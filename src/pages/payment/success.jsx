import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/components/layout/DefaultLayout';
import PaymentSuccess from '@/components/payment/PaymentSuccess';

const PaymentSuccessPage = () => {
    const router = useRouter();
    const [appointmentInfo, setAppointmentInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Lấy thông tin từ URL parameters (VNPay callback)
        const { vnp_Amount, vnp_BankCode, vnp_OrderInfo } = router.query;

        if (vnp_Amount) {
            // Có thể lấy thông tin chi tiết lịch hẹn từ localStorage hoặc gọi API
            const appointmentData = JSON.parse(localStorage.getItem('lastAppointment') || '{}');
            setAppointmentInfo(appointmentData);
            setLoading(false);
        }
    }, [router.query]);

    if (loading) {
        return (
            <DefaultLayout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <PaymentSuccess
                appointmentDate={appointmentInfo?.appointmentDate || 'Đang cập nhật'}
                appointmentTime={appointmentInfo?.appointmentTime || 'Đang cập nhật'}
                childName={appointmentInfo?.childName || 'Đang cập nhật'}
            />
        </DefaultLayout>
    );
};

export default PaymentSuccessPage; 