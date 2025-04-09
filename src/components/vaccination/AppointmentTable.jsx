import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEye, faClock, faTimes } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { useAppointments } from '../../hooks/useAppointments';

const AppointmentTable = ({
    appointments,
    formatDate,
    getStatusText,
    getStatusClass,
    canCancelAppointment,
    canEditTime,
    canFeedback,
    onOpenDetail,
    onOpenFeedback,
    onEditTime,
    onCancelAppointment
}) => {
    const { getFeedback } = useAppointments();
    const [feedbacksMap, setFeedbacksMap] = useState({});
    const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
    const fetchedAppointmentsRef = useRef(new Set());

    // Logging khi component mount và update
    useEffect(() => {
        console.log("AppointmentTable mounted/updated");
        console.log("Current appointments:", appointments);
        console.log("Current feedbacksMap:", feedbacksMap);
        return () => {
            console.log("AppointmentTable unmounted");
        };
    }, [appointments, feedbacksMap]);

    // Tải tất cả feedback một lần duy nhất khi component mount
    useEffect(() => {
        const getAllFeedbacks = async () => {
            console.log("Starting to fetch all feedbacks...");
            setLoadingFeedbacks(true);

            try {
                // Gọi API để lấy tất cả feedbacks
                const response = await fetch(`/api/feedback-all`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    console.error(`Error fetching all feedbacks: ${response.status}`);
                    return;
                }

                const allFeedbacks = await response.json();
                console.log("All feedbacks from API:", allFeedbacks);

                // Tạo map từ appointmentId đến danh sách feedbacks
                const feedbacks = {};
                allFeedbacks.forEach(feedback => {
                    const appointmentId = feedback.appointmentsId;
                    if (!feedbacks[appointmentId]) {
                        feedbacks[appointmentId] = [];
                    }
                    feedbacks[appointmentId].push(feedback);
                });

                console.log("Processed feedbacks map:", feedbacks);

                // Cập nhật state
                setFeedbacksMap(feedbacks);

                // Log xem có appointment nào đã có feedback chưa
                appointments.forEach(appointment => {
                    const hasFeedback = feedbacks[appointment.appointmentId] &&
                        feedbacks[appointment.appointmentId].length > 0;
                    console.log(`Appointment ${appointment.appointmentId} has feedback: ${hasFeedback}`);
                    if (hasFeedback) {
                        console.log(`Feedback for appointment ${appointment.appointmentId}:`,
                            feedbacks[appointment.appointmentId]);
                    }
                });
            } catch (error) {
                console.error('Error fetching all feedbacks:', error);
            } finally {
                setLoadingFeedbacks(false);
            }
        };

        getAllFeedbacks();
    }, []); // Chỉ chạy một lần khi component mount

    // Log khi appointments thay đổi
    useEffect(() => {
        console.log("Appointments changed:", appointments);
    }, [appointments]);

    const renderFeedbackColumn = (appointment) => {
        console.log(`Rendering feedback column for appointment ${appointment.appointmentId}`);
        console.log(`Status: ${appointment.status}, StatusText: ${getStatusText(appointment.status)}`);

        const isCompleted = getStatusText(appointment.status) === 'Hoàn thành';
        const hasFeedback = feedbacksMap[appointment.appointmentId] &&
            feedbacksMap[appointment.appointmentId].length > 0;

        console.log(`Appointment ${appointment.appointmentId}: isCompleted=${isCompleted}, hasFeedback=${hasFeedback}`);

        if (hasFeedback) {
            const feedback = feedbacksMap[appointment.appointmentId][0];
            console.log(`Showing rating for appointment ${appointment.appointmentId}:`, feedback);
            return (
                <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span>{feedback.rating}/5</span>
                </div>
            );
        }

        if (isCompleted) {
            console.log(`Showing "Đánh giá" button for appointment ${appointment.appointmentId}`);
            return (
                <button
                    onClick={() => onOpenFeedback(appointment)}
                    className="text-blue-600 hover:text-blue-800"
                >
                    Đánh giá
                </button>
            );
        }

        console.log(`Showing "Chưa đánh giá" for appointment ${appointment.appointmentId}`);
        return <span className="text-gray-500">Chưa đánh giá</span>;
    };

    return (
        <div className="overflow-x-auto">
            <pre className="text-xs bg-gray-100 p-2 mb-2 overflow-auto hidden">
                {JSON.stringify({
                    appointments: appointments.map(a => ({
                        id: a.appointmentId,
                        status: a.status,
                        statusText: getStatusText(a.status),
                        hasFeedback: feedbacksMap[a.appointmentId] ? true : false
                    })),
                    feedbacksMap
                }, null, 2)}
            </pre>
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left">Tên trẻ</th>
                        <th className="px-6 py-3 text-left">Ngày tiêm</th>
                        <th className="px-6 py-3 text-left">Giờ tiêm</th>
                        <th className="px-6 py-3 text-left">Mũi vaccine</th>
                        <th className="px-6 py-3 text-left">Trạng thái</th>
                        <th className="px-6 py-3 text-left">Phản ứng</th>
                        <th className="px-6 py-3 text-left">Đánh giá</th>
                        <th className="px-6 py-3 text-left">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                        <tr key={appointment.appointmentId} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                {appointment.childrenName || "—"}
                            </td>
                            <td className="px-6 py-4">
                                {formatDate(appointment.appointmentDate) || "—"}
                            </td>
                            <td className="px-6 py-4">
                                {appointment.timeStart || "—"}
                            </td>
                            <td className="px-6 py-4">
                                {appointment.vaccineDetailsList && appointment.vaccineDetailsList.length > 0
                                    ? `${appointment.vaccineDetailsList[0].currentDose}`
                                    : "—"
                                }
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-sm ${getStatusClass(appointment.status)}`}>
                                    {getStatusText(appointment.status)}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {appointment.reactions && appointment.reactions.length > 0
                                    ? appointment.reactions[0].condition || "Không có phản ứng"
                                    : "—"
                                }
                            </td>
                            <td className="px-6 py-4">
                                {loadingFeedbacks ? (
                                    <span className="text-gray-400">Đang tải...</span>
                                ) : (
                                    renderFeedbackColumn(appointment)
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex justify-start space-x-2">
                                    <button
                                        onClick={() => onOpenDetail(appointment)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Chi tiết
                                    </button>
                                    {canEditTime(appointment) && (
                                        <button
                                            onClick={() => onEditTime(appointment)}
                                            className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 flex items-center"
                                            title="Chỉnh sửa giờ hẹn"
                                        >
                                            <FontAwesomeIcon icon={faClock} className="mr-1" />
                                            Sửa giờ
                                        </button>
                                    )}
                                    {canCancelAppointment(appointment) && (
                                        <button
                                            onClick={() => onCancelAppointment(appointment)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center"
                                            title="Hủy lịch hẹn"
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                            Hủy lịch
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

AppointmentTable.propTypes = {
    appointments: PropTypes.array.isRequired,
    formatDate: PropTypes.func.isRequired,
    getStatusText: PropTypes.func.isRequired,
    getStatusClass: PropTypes.func.isRequired,
    canCancelAppointment: PropTypes.func.isRequired,
    canEditTime: PropTypes.func.isRequired,
    canFeedback: PropTypes.func.isRequired,
    onOpenDetail: PropTypes.func.isRequired,
    onOpenFeedback: PropTypes.func.isRequired,
    onEditTime: PropTypes.func,
    onCancelAppointment: PropTypes.func
};

export default AppointmentTable; 