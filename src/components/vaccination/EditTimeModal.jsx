import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendarAlt, faStickyNote } from '@fortawesome/free-solid-svg-icons';

const EditTimeModal = ({
    appointment,
    editedTime,
    isEditingTime,
    formatDate,
    onTimeChange,
    onSubmit,
    onClose,
    newAppointmentDate,
    setNewAppointmentDate,
    newNote,
    setNewNote
}) => {
    // Lấy ngày hiện tại để giới hạn datepicker
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-90vh overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-blue-600 flex items-center">
                        <FontAwesomeIcon icon={faClock} className="text-blue-600 mr-2" />
                        Chỉnh sửa lịch hẹn
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

                <div className="bg-blue-50 p-4 mb-4 rounded">
                    <p className="text-blue-800">
                        Bạn đang chỉnh sửa lịch hẹn tiêm ngày {formatDate(appointment.appointmentDate)}
                    </p>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-600" />
                        Ngày hẹn mới <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={newAppointmentDate}
                        onChange={(e) => setNewAppointmentDate(e.target.value)}
                        min={today}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <p className="mt-2 text-sm text-gray-500">Ngày hẹn hiện tại: {formatDate(appointment.appointmentDate)}</p>
                    <p className="mt-1 text-sm text-red-600">Lưu ý: Ngày hẹn mới phải sau ngày hiện tại</p>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center">
                        <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-600" />
                        Giờ hẹn mới <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 items-center">
                        <select
                            value={editedTime.hour}
                            onChange={(e) => onTimeChange({ ...editedTime, hour: parseInt(e.target.value) })}
                            className="p-2 border border-gray-300 rounded-md flex-1"
                        >
                            {Array.from({ length: 10 }, (_, i) => i + 8).map((hour) => (
                                <option key={hour} value={hour}>
                                    {hour.toString().padStart(2, '0')}
                                </option>
                            ))}
                        </select>
                        <span className="text-xl font-bold">:</span>
                        <select
                            value={editedTime.minute}
                            onChange={(e) => onTimeChange({ ...editedTime, minute: parseInt(e.target.value) })}
                            className="p-2 border border-gray-300 rounded-md flex-1"
                        >
                            {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                                <option key={minute} value={minute}>
                                    {minute.toString().padStart(2, '0')}
                                </option>
                            ))}
                        </select>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Giờ hẹn hiện tại: {appointment.timeStart}</p>
                    <p className="mt-1 text-sm text-blue-600">Lưu ý: Giờ hẹn chỉ có thể từ 8:00 đến 17:00</p>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center">
                        <FontAwesomeIcon icon={faStickyNote} className="mr-2 text-blue-600" />
                        Ghi chú
                    </label>
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows="3"
                        placeholder="Thêm ghi chú cho lịch hẹn (nếu có)"
                    ></textarea>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        disabled={isEditingTime}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onSubmit}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center ${isEditingTime ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={isEditingTime}
                    >
                        {isEditingTime && (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTimeModal; 