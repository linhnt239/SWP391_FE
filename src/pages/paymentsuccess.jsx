import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/components/layout/DefaultLayout';
import Link from 'next/link';

const PaymentSuccess = () => {
    const router = useRouter();
    const [paymentDetails, setPaymentDetails] = useState({
        status: '',
        message: '',
        appointmentInfo: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Đảm bảo router đã sẵn sàng trước khi đọc query params
        if (!router.isReady) return;

        const { status, message } = router.query;

        // Lấy thông tin lịch hẹn từ localStorage
        const appointmentInfo = JSON.parse(localStorage.getItem('lastAppointment') || '{}');

        setPaymentDetails({
            status: status || 'success',
            message: message || 'Thanh toán thành công!',
            appointmentInfo: appointmentInfo
        });

        // Xóa giỏ hàng từ localStorage vì đã thanh toán thành công
        localStorage.removeItem('cart');

        setLoading(false);
    }, [router.isReady, router.query]);

    if (loading) {
        return (
            <DefaultLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <div className="bg-gray-100 min-h-screen py-12">
                <div className="container mx-auto px-4 max-w-3xl">
                    {/* Tiêu đề và các bước */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-blue-900 mb-6">Đăng ký mũi tiêm</h1>
                        <div className="flex justify-center items-center mb-6">
                            <div className="flex flex-col items-center text-gray-500">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-gray-300">
                                    1
                                </div>
                                <span className="text-sm font-medium">Thông tin người được tiêm</span>
                            </div>
                            <div className="w-16 h-1 mx-2 bg-gray-300"></div>
                            <div className="flex flex-col items-center text-gray-500">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-gray-300">
                                    2
                                </div>
                                <span className="text-sm font-medium">Thanh toán</span>
                            </div>
                            <div className="w-16 h-1 mx-2 bg-blue-600"></div>
                            <div className="flex flex-col items-center text-blue-600">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-blue-600 text-white">
                                    3
                                </div>
                                <span className="text-sm font-medium">Xác nhận thanh toán thành công</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <div className="text-center mb-8">
                            <div className="rounded-full bg-green-100 p-3 mx-auto w-fit mb-4">
                                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h1>
                            <p className="text-gray-600">{decodeURIComponent(paymentDetails.message)}</p>
                        </div>

                        {/* Thông tin lịch hẹn */}
                        {paymentDetails.appointmentInfo && Object.keys(paymentDetails.appointmentInfo).length > 0 && (
                            <div className="bg-blue-50 rounded-lg p-6 mb-6">
                                <h2 className="text-xl font-semibold text-blue-900 mb-4">Thông tin lịch tiêm</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Tên trẻ:</span>
                                        <span className="font-medium">{paymentDetails.appointmentInfo.childName}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Ngày tiêm:</span>
                                        <span className="font-medium">{paymentDetails.appointmentInfo.appointmentDate}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Giờ tiêm:</span>
                                        <span className="font-medium">{paymentDetails.appointmentInfo.appointmentTime}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Lưu ý quan trọng */}
                        <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                            <h2 className="text-lg font-semibold text-yellow-800 mb-3">Lưu ý quan trọng</h2>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Vui lòng đến trước giờ hẹn 15 phút để hoàn tất thủ tục
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Mang theo sổ tiêm chủng (nếu có) và giấy tờ tùy thân
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Theo dõi trẻ sau tiêm ít nhất 30 phút tại trung tâm
                                </li>
                            </ul>
                        </div>

                        {/* Thông tin biên lai */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">Thông tin thanh toán</h2>
                            <p className="text-gray-700 mb-2">
                                Biên lai thanh toán đã được gửi đến email của bạn. Bạn có thể kiểm tra email để xem chi tiết.
                            </p>
                            <p className="text-gray-700">
                                Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua hotline: <span className="font-medium">1900 1234</span>
                            </p>
                        </div>

                        {/* Nút điều hướng */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/vaccination-process" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center">
                                Xem lịch tiêm chủng của tôi
                            </Link>
                            <Link href="/" className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors text-center">
                                Về trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default PaymentSuccess; 