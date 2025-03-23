import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const CancelAppointmentModal = ({
    appointment,
    cancelReason,
    isSubmitting,
    formatDate,
    calculateTotalVaccines,
    onReasonChange,
    onSubmit,
    onClose
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-red-600 flex items-center">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 mr-2" />
                        Xác nhận hủy lịch hẹn
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div className="bg-red-50 p-4 mb-4 rounded">
                    <p className="text-red-800">
                        Bạn có chắc chắn muốn hủy lịch hẹn tiêm chủng này không? Hành động này không thể hoàn tác.
                    </p>
                </div>

                <div className="mb-4">
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <h3 className="font-medium text-blue-800 mb-2">Thông tin lịch hẹn</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div>
                                <p className="text-sm text-gray-600">Tên trẻ:</p>
                                <p className="font-medium">{appointment.childrenName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Ngày tiêm:</p>
                                <p className="font-medium">{formatDate(appointment.appointmentDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Giờ tiêm:</p>
                                <p className="font-medium">{appointment.timeStart}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Mũi vaccine:</p>
                                <p className="font-medium">{calculateTotalVaccines(appointment)}</p>
                            </div>
                        </div>
                    </div>

                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Vui lòng nhập lý do hủy lịch hẹn <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={cancelReason}
                        onChange={onReasonChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        rows="3"
                        placeholder="Nhập lý do hủy lịch (bắt buộc)"
                        required
                    />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        disabled={isSubmitting}
                    >
                        Quay lại
                    </button>
                    <button
                        onClick={onSubmit}
                        className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting && (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        Xác nhận hủy lịch
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelAppointmentModal; 