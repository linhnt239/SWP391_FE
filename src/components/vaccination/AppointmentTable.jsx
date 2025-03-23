import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEye, faClock, faTimes } from '@fortawesome/free-solid-svg-icons';

const AppointmentTable = ({
    appointments,
    formatDate,
    getStatusText,
    getStatusClass,
    canCancelAppointment,
    canEditTime,
    onViewDetail,
    onFeedback,
    onEditTime,
    onCancelAppointment
}) => {
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
                                {appointment.feedbacks && appointment.feedbacks.length > 0 ? (
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                                        <span>{appointment.feedbacks[0].rating}/5</span>
                                    </div>
                                ) : (
                                    <span className="text-gray-500">Chưa đánh giá</span>
                                )}
                            </td>
                            <td className="px-6 py-4 flex gap-2">
                                <button
                                    onClick={() => onViewDetail(appointment)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center"
                                    title="Xem chi tiết"
                                >
                                    <FontAwesomeIcon icon={faEye} className="mr-1" />
                                    Chi tiết
                                </button>

                                {appointment.status === 'COMPLETED' &&
                                    (!appointment.feedbacks || appointment.feedbacks.length === 0) && (
                                        <button
                                            onClick={() => onFeedback(appointment)}
                                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center"
                                            title="Đánh giá"
                                        >
                                            <FontAwesomeIcon icon={faStar} className="mr-1" />
                                            Đánh giá
                                        </button>
                                    )}

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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentTable; 