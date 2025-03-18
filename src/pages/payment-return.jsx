import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/components/layout/DefaultLayout';

const PaymentReturnPage = () => {
    const router = useRouter();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [appointmentInfo, setAppointmentInfo] = useState(null);

    useEffect(() => {
        if (!router.isReady) return;

        const { vnp_ResponseCode } = router.query;
        // Lấy thông tin lịch hẹn từ localStorage
        const lastAppointment = JSON.parse(localStorage.getItem('lastAppointment') || '{}');
        setAppointmentInfo(lastAppointment);

        if (vnp_ResponseCode === "00") {
            setStatus('success');
        } else {
            setStatus('error');
            setTimeout(() => {
                router.push('/schedule');
            }, 2000);
        }
    }, [router.isReady, router.query]);

    if (status === 'loading') {
        return (
            <DefaultLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </DefaultLayout>
        );
    }

    if (status === 'error') {
        return (
            <DefaultLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="mb-4">
                            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Thanh toán không thành công</h2>
                        <p className="text-gray-600 mb-4">Đang chuyển hướng về trang đặt lịch...</p>
                    </div>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <div className="min-h-screen bg-gray-100 py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-8">
                            {/* Success Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="rounded-full bg-green-100 p-3">
                                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                                Thanh toán thành công!
                            </h1>
                            <p className="text-center text-gray-600 mb-8">
                                Cảm ơn bạn đã đặt lịch tiêm chủng.
                            </p>

                            {/* Appointment Details */}
                            {appointmentInfo && (
                                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                                    <h2 className="text-xl font-semibold text-blue-900 mb-4">
                                        Thông tin lịch tiêm
                                    </h2>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Tên trẻ:</span>
                                            <span className="font-medium">{appointmentInfo.childName}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Ngày tiêm:</span>
                                            <span className="font-medium">{appointmentInfo.appointmentDate}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Giờ tiêm:</span>
                                            <span className="font-medium">{appointmentInfo.appointmentTime}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Important Notes */}
                            <div className="bg-yellow-50 rounded-lg p-6 mb-8">
                                <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                                    Lưu ý quan trọng
                                </h3>
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

                            {/* Navigation Buttons */}
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
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default PaymentReturnPage; 