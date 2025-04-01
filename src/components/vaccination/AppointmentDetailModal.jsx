import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faVial } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const AppointmentDetailModal = ({
    appointment,
    formatDate,
    formatPrice,
    calculateTotalPrice,
    getStatusText,
    getStatusClass,
    canCancelAppointment,
    onClose,
    onCancelAppointment
}) => {
    // Lọc danh sách vaccine để loại bỏ các mục trùng lặp dựa trên ID
    const uniqueVaccines = appointment.vaccineDetailsList ?
        [...new Map(appointment.vaccineDetailsList.map(item =>
            [item.vaccineDetailsId, item]
        )).values()] : [];

    // Tính tổng tiền dựa trên danh sách vaccine đã lọc
    const calculateUniqueTotal = () => {
        return uniqueVaccines.reduce((total, vaccine) => total + (vaccine.price || 0), 0);
    };

    const handleCancelWithConfirm = () => {
        if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này không?')) {
            toast.promise(
                onCancelAppointment(appointment.appointmentId),
                {
                    pending: 'Đang hủy lịch hẹn...',
                    success: 'Lịch hẹn đã được hủy thành công',
                    error: 'Có lỗi xảy ra khi hủy lịch hẹn'
                }
            );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-blue-600">Chi tiết lịch hẹn</h2>
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={onClose}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <h3 className="font-semibold text-indigo-700 mb-3">Thông tin trẻ</h3>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Họ tên:</span>
                            <span className="font-semibold">{appointment.childrenName}</span>
                        </div>
                        {appointment.dateOfBirth && (
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Ngày sinh:</span>
                                <span className="font-semibold">{formatDate(appointment.dateOfBirth)}</span>
                            </div>
                        )}
                        {appointment.childrenGender && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Giới tính:</span>
                                <span className="font-semibold">
                                    {appointment.childrenGender === "MALE" ? "Nam" : "Nữ"}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Trạng thái:</span>
                                <span className={`font-semibold ${getStatusClass(appointment.status)}`}>
                                    {getStatusText(appointment.status)}
                                </span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Ngày hẹn:</span>
                                <span className="font-semibold">{formatDate(appointment.appointmentDate)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Giờ hẹn:</span>
                                <span className="font-semibold">{appointment.timeStart || "Chưa xác định"}</span>
                            </div>
                        </div>



                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <h3 className="font-semibold text-green-700 mb-3">Danh sách vắc-xin</h3>
                            {uniqueVaccines.length > 0 ? (
                                <>
                                    <div className="space-y-3">
                                        {uniqueVaccines.map((vaccine, index) => (
                                            <div key={index} className="flex justify-between items-center border-b border-green-100 pb-2">
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faVial} className="text-green-500 mr-2" />
                                                    <span>{vaccine.doseName}</span>
                                                </div>
                                                <span className="font-semibold">{formatPrice(vaccine.price || 0)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center mt-4 pt-2 border-t border-green-200">
                                        <span className="font-bold text-gray-700">Tổng tiền:</span>
                                        <span className="font-bold text-green-600">{formatPrice(calculateUniqueTotal())}</span>
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-500 italic">Không có thông tin vắc-xin</p>
                            )}
                        </div>

                        {appointment.note && (
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                <h3 className="font-semibold text-yellow-700 mb-2">Ghi chú</h3>
                                <p className="text-gray-700">{appointment.note}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        {canCancelAppointment(appointment.status) && (
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                onClick={handleCancelWithConfirm}
                            >
                                Hủy lịch hẹn
                            </button>
                        )}
                        <button
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                            onClick={onClose}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetailModal; 