import React, { useEffect, useState } from 'react';

const SuccessStep = ({ router }) => {
    const [lastAppointment, setLastAppointment] = useState({});

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedAppointment = localStorage.getItem('lastAppointment');
                if (savedAppointment) {
                    setLastAppointment(JSON.parse(savedAppointment));
                }
            } catch (error) {
                console.error('Error loading appointment data:', error);
            }
        }
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-center mb-6">
                <div className="rounded-full bg-green-100 p-3 mx-auto w-fit mb-4">
                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h2>
                <p className="text-gray-600">Cảm ơn bạn đã đặt lịch tiêm chủng.</p>
            </div>

            {/* Thông tin lịch hẹn */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Thông tin lịch tiêm</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tên trẻ:</span>
                        <span className="font-medium">{lastAppointment.childName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Ngày tiêm:</span>
                        <span className="font-medium">{lastAppointment.appointmentDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Giờ tiêm:</span>
                        <span className="font-medium">{lastAppointment.appointmentTime}</span>
                    </div>
                </div>
            </div>

            {/* Lưu ý quan trọng */}
            <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">Lưu ý quan trọng</h3>
                <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                        <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Vui lòng đến trước giờ hẹn 15 phút
                    </li>
                    <li className="flex items-start">
                        <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Mang theo sổ tiêm chủng (nếu có)
                    </li>
                </ul>
            </div>

            {/* Nút điều hướng */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={() => router.push('/appointments')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Xem lịch hẹn của tôi
                </button>
                <button
                    onClick={() => router.push('/')}
                    className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                    Về trang chủ
                </button>
            </div>
        </div>
    );
};

export default SuccessStep; 