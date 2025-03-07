// src/pages/payment.jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';

// Giả lập bảng giá vaccine
const vaccinePrices = {
    Pentaxim: 700000, // 700,000 VNĐ
    MMR: 300000, // 300,000 VNĐ
};

const Payment = () => {
    const router = useRouter();
    const { appointmentId } = router.query;
    const [appointment, setAppointment] = useState(null);
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        if (appointmentId) {
            // Giả lập dữ liệu đặt lịch
            const appointments = [
                {
                    id: 1,
                    childName: 'Nguyen Van A',
                    vaccineType: 'Pentaxim',
                    date: '2025-03-15',
                    time: '14:00',
                    status: 'completed',
                    paymentStatus: 'unpaid',
                },
                {
                    id: 2,
                    childName: 'Nguyen Van B',
                    vaccineType: 'MMR',
                    date: '2025-04-10',
                    time: '10:00',
                    status: 'scheduled',
                    paymentStatus: 'unpaid',
                },
            ];

            const selectedAppointment = appointments.find((app) => app.id === parseInt(appointmentId));
            if (selectedAppointment) {
                setAppointment(selectedAppointment);
                // Tính tiền dựa trên vaccine
                const price = vaccinePrices[selectedAppointment.vaccineType] || 0;
                setAmount(price);
            }
        }
    }, [appointmentId]);

    const handlePayment = () => {
        // Giả lập thanh toán thành công
        setAppointment((prev) => ({ ...prev, paymentStatus: 'paid' }));
        alert('Thanh toán thành công!');
        router.push('/vaccination-process');
    };

    if (!appointment) {
        return (
            <DefaultLayout>
                <section className="py-12 bg-gray-100">
                    <div className="container mx-auto px-4">
                        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                            Thanh toán
                        </h1>
                        <p className="text-center text-gray-700">Không tìm thấy thông tin đặt lịch.</p>
                    </div>
                </section>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <section className="py-12 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                        Thanh toán
                    </h1>
                    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-blue-900 mb-2">
                                Thông tin đặt lịch
                            </h2>
                            <p className="text-gray-700">
                                <strong>Tên trẻ:</strong> {appointment.childName}<br />
                                <strong>Vaccine:</strong> {appointment.vaccineType}<br />
                                <strong>Ngày:</strong> {appointment.date} lúc {appointment.time}<br />
                                <strong>Số tiền:</strong> {amount.toLocaleString()} VNĐ
                            </p>
                        </div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-blue-900 mb-2">
                                Trạng thái thanh toán
                            </h2>
                            <p className="text-gray-700">
                                Trạng thái hiện tại:{' '}
                                {appointment.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </p>
                            {appointment.paymentStatus === 'unpaid' && (
                                <button
                                    onClick={handlePayment}
                                    className="mt-4 bg-blue-900 text-white px-6 py-3 rounded-full hover:bg-blue-700"
                                >
                                    <FontAwesomeIcon icon={faCreditCard} className="mr-2" /> Thanh toán ngay
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </DefaultLayout>
    );
};

export default Payment;