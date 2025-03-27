import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEye, faClock, faTimes } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { useAppointments } from '../../hooks/useAppointments';

const AppointmentTable = ({
    appointments,
    formatDate,
    calculateTotalVaccines,
    getStatusText,
    getStatusClass,
    canCancelAppointment,
    canEditTime,
    canFeedback,
    onViewDetail,
    onFeedback,
    onEditTime,
    onCancelAppointment,
    onOpenFeedback,
    onOpenDetail
}) => {
    const { getFeedback } = useAppointments();
    const [appointmentFeedbacks, setAppointmentFeedbacks] = useState({});

    // Fetch feedback cho mỗi appointment khi component mount
    useEffect(() => {
        const fetchFeedbacks = async () => {
            const feedbacksMap = {};
            for (const appointment of appointments) {
                try {
                    const feedback = await getFeedback(appointment.appointmentId);
                    if (feedback && feedback.length > 0) {
                        feedbacksMap[appointment.appointmentId] = feedback[0];
                    }
                } catch (error) {
                    console.error(`Error fetching feedback for appointment ${appointment.appointmentId}:`, error);
                }
            }
            setAppointmentFeedbacks(feedbacksMap);
        };

        fetchFeedbacks();
    }, [appointments]);

    const renderFeedbackColumn = (appointment) => {
        const isCompleted = getStatusText(appointment.status) === 'Hoàn thành';

        // Kiểm tra feedback từ dữ liệu appointment
        if (appointment.feedbacks && appointment.feedbacks.length > 0) {
            const rating = appointment.feedbacks[0].rating;
            return (
                <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span>{rating}/5</span>
                </div>
            );
        }

        if (isCompleted) {
            return (
                <button
                    onClick={() => onOpenFeedback(appointment)}
                    className="text-blue-600 hover:text-blue-800"
                >
                    Đánh giá
                </button>
            );
        }

        return <span className="text-gray-500">Chưa đánh giá</span>;
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left">Tên trẻ</th>
                        <th className="px-6 py-3 text-left">Ngày tiêm</th>
                        <th className="px-6 py-3 text-left">Giờ tiêm</th>
                        <th className="px-6 py-3 text-left">Mũi vaccine</th>
                        <th className="px-6 py-3 text-left">Trạng thái</th>
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
                                {renderFeedbackColumn(appointment)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                <div className="flex justify-start space-x-2">
                                    <button
                                        onClick={() => onViewDetail(appointment)}
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
    onOpenFeedback: PropTypes.func.isRequired,
    onOpenDetail: PropTypes.func.isRequired
};

export default AppointmentTable; 