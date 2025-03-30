import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BiCheckCircle, BiCalendar, BiTimeFive, BiChild, BiArrowBack } from 'react-icons/bi';
import DefaultLayout from '@/components/layout/DefaultLayout';

const BookingSuccess = () => {
    const router = useRouter();
    const { method, date, time } = router.query;
    const [appointmentInfo, setAppointmentInfo] = useState({
        childName: '',
        appointmentDate: '',
        appointmentTime: '',
        paymentMethod: ''
    });
    const [isLoaded, setIsLoaded] = useState(false);

    // Format date to DD/MM/YYYY
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    useEffect(() => {
        // Chỉ chạy ở phía client
        if (typeof window !== 'undefined') {
            const lastAppointment = JSON.parse(localStorage.getItem('lastAppointment') || '{}');

            setAppointmentInfo({
                childName: lastAppointment.childName || '',
                appointmentDate: date || lastAppointment.appointmentDate || '',
                appointmentTime: time || lastAppointment.appointmentTime || '',
                paymentMethod: method || lastAppointment.paymentMethod || 'cash'
            });

            setIsLoaded(true);

            // Nếu không có thông tin và router đã sẵn sàng, chuyển hướng về trang chủ
            if (router.isReady &&
                !method && !date && !time &&
                Object.keys(lastAppointment).length === 0) {
                router.push('/');
            }
        }
    }, [router.isReady, method, date, time]);

    // Chỉ hiển thị UI khi dữ liệu đã được load từ client
    if (!isLoaded) {
        return (
            <DefaultLayout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="mx-auto px-4">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-full">
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
                                    <span className="text-sm font-medium">Xác nhận đặt lịch thành công</span>
                                </div>
                            </div>
                        </div>
                        {/* Header với gradient */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-8 text-white text-center">
                            <div className="bg-white bg-opacity-20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                <BiCheckCircle className="text-5xl" />
                            </div>
                            <h1 className="text-3xl font-bold mb-2">Đặt lịch thành công!</h1>
                            <p className="text-blue-100">Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi</p>
                        </div>

                        {/* Nội dung thông tin lịch hẹn */}
                        <div className="p-8">
                            <div className="mb-8">
                                <p className="text-gray-700 mb-4 text-lg">
                                    {appointmentInfo.paymentMethod === 'cash'
                                        ? 'Bạn đã đặt lịch tiêm chủng thành công. Vui lòng đến trung tâm đúng hẹn và thanh toán trực tiếp tại quầy.'
                                        : 'Bạn đã đặt lịch và thanh toán tiêm chủng thành công. Vui lòng đến trung tâm đúng hẹn.'
                                    }
                                </p>
                                <p className="text-gray-600">
                                    Trung tâm sẽ gửi thông báo xác nhận qua email của bạn sau khi xác nhận đặt lịch.
                                </p>
                            </div>

                            {/* Thông tin chi tiết */}
                            <div className="bg-blue-50 rounded-lg p-6 mb-8">
                                <h2 className="text-xl font-semibold text-blue-800 mb-4 border-b border-blue-200 pb-2">Chi tiết lịch hẹn</h2>

                                <div className="space-y-4">
                                    {appointmentInfo.childName && (
                                        <div className="flex items-center">
                                            <BiChild className="text-blue-600 text-xl mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Họ tên trẻ</p>
                                                <p className="font-medium">{appointmentInfo.childName}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center">
                                        <BiCalendar className="text-blue-600 text-xl mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Ngày tiêm</p>
                                            <p className="font-medium">{formatDate(appointmentInfo.appointmentDate)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <BiTimeFive className="text-blue-600 text-xl mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Giờ tiêm</p>
                                            <p className="font-medium">{appointmentInfo.appointmentTime}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lưu ý */}
                            <div className="bg-amber-50 border-l-4 border-amber-400 p-5 mb-8">
                                <h3 className="font-semibold text-amber-800 mb-2">Lưu ý quan trọng</h3>
                                <p className="text-amber-700">
                                    {appointmentInfo.paymentMethod === 'cash'
                                        ? 'Vui lòng đến trước 15 phút để hoàn tất thủ tục thanh toán trước khi tiêm.'
                                        : 'Vui lòng đến trước 15 phút để hoàn tất thủ tục trước khi tiêm.'
                                    }
                                </p>
                            </div>

                            {/* Các nút điều hướng */}
                            <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link href="/"
                                    className="flex items-center justify-center px-5 py-3 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                    <BiArrowBack className="mr-2" />
                                    Về trang chủ
                                </Link>

                                <Link href="/vaccination-process"
                                    className="flex items-center justify-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                                    Xem lịch tiêm chủng
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default BookingSuccess; 