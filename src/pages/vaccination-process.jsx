// src/pages/vaccination-process.jsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus, faSyringe, faFileAlt, faMoneyBillWave, faStar } from '@fortawesome/free-solid-svg-icons';

const VaccinationProcess = () => {
    const router = useRouter();
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            childName: 'Nguyen Van A',
            vaccineType: 'Pentaxim',
            date: '2025-03-15',
            time: '14:00',
            status: 'completed',
            paymentStatus: 'unpaid',
            rating: null, // Chưa đánh giá
            cancelled: false,
        },
        {
            id: 2,
            childName: 'Nguyen Van B',
            vaccineType: 'MMR',
            date: '2025-04-10',
            time: '10:00',
            status: 'scheduled',
            paymentStatus: 'unpaid',
            rating: null,
            cancelled: false,
        },
    ]);
    const [showCancelConfirm, setShowCancelConfirm] = useState(null);

    const handleCancel = (id) => {
        setShowCancelConfirm(id);
    };

    const confirmCancel = (id) => {
        setAppointments((prev) =>
            prev.map((app) =>
                app.id === id ? { ...app, status: 'cancelled', cancelled: true } : app
            )
        );
        setShowCancelConfirm(null);
    };

    const handleRate = (id) => {
        // Giả lập đánh giá, bạn có thể thay bằng form đánh giá thực tế
        const rating = prompt('Nhập đánh giá của bạn (1-5):', '5');
        if (rating && !isNaN(rating) && rating >= 1 && rating <= 5) {
            setAppointments((prev) =>
                prev.map((app) =>
                    app.id === id ? { ...app, rating: parseFloat(rating) } : app
                )
            );
            alert('Cảm ơn bạn đã đánh giá!');
        } else {
            alert('Vui lòng nhập số từ 1 đến 5.');
        }
    };

    return (
        <DefaultLayout>
            <section className="py-12 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                        Quản lý quá trình tiêm chủng
                    </h1>
                    {appointments.map((appointment) => (
                        <div
                            key={appointment.id}
                            className={`max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mb-6 ${appointment.cancelled ? 'opacity-50 pointer-events-none' : ''
                                }`}
                        >
                            <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                                Thông tin đặt lịch: {appointment.childName}
                            </h2>
                            <div className="space-y-6">
                                {/* Bước 1: Đặt lịch */}
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faCalendarPlus} className="text-blue-600 text-2xl mr-4" />
                                    <p className="text-gray-700">
                                        <strong>Đặt lịch:</strong> {appointment.date} lúc {appointment.time}
                                    </p>
                                </div>
                                {/* Bước 2: Tiêm chủng */}
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faSyringe} className="text-blue-600 text-2xl mr-4" />
                                    <p className="text-gray-700">
                                        <strong>Tiêm chủng:</strong>{' '}
                                        {appointment.status === 'completed'
                                            ? 'Đã hoàn thành'
                                            : appointment.status === 'scheduled'
                                                ? 'Đang chờ'
                                                : 'Đã hủy'}
                                    </p>
                                </div>
                                {/* Bước 3: Ghi nhận */}
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faFileAlt} className="text-blue-600 text-2xl mr-4" />
                                    <p className="text-gray-700">
                                        <strong>Ghi nhận kết quả:</strong>{' '}
                                        {appointment.status === 'completed' ? 'Đã cập nhật vào hồ sơ' : 'Chưa thực hiện'}
                                    </p>
                                </div>
                                {/* Bước 4: Thanh toán */}
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-blue-600 text-2xl mr-4" />
                                    <p className="text-gray-700">
                                        <strong>Thanh toán:</strong>{' '}
                                        {appointment.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </p>
                                    {appointment.status === 'completed' && appointment.paymentStatus !== 'paid' && (
                                        <Link href={`/payment?appointmentId=${appointment.id}`}>
                                            <button className="ml-4 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700">
                                                Thanh toán
                                            </button>
                                        </Link>
                                    )}
                                    {appointment.status === 'scheduled' && !appointment.cancelled && (
                                        <button
                                            onClick={() => handleCancel(appointment.id)}
                                            className="ml-4 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
                                        >
                                            Hủy
                                        </button>
                                    )}
                                </div>
                                {/* Bước 5: Đánh giá */}
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faStar} className="text-blue-600 text-2xl mr-4" />
                                    <div className="flex items-center">
                                        <p className="text-gray-700">
                                            <strong>Đánh giá:</strong>{' '}
                                            {appointment.rating ? `${appointment.rating}/5` : 'Chưa đánh giá'}
                                        </p>
                                        {appointment.status === 'completed' && !appointment.rating && (
                                            <button
                                                onClick={() => handleRate(appointment.id)}
                                                className="mt-2 bg-blue-900 text-white px-4 py-2 rounded-full hover:bg-blue-700 ml-4"
                                            >
                                                Đánh giá ngay
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Bảng xác nhận hủy */}
                            {showCancelConfirm === appointment.id && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-lg shadow-md">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                            Bạn có chắc chắn muốn hủy không?
                                        </h3>
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                onClick={() => setShowCancelConfirm(null)}
                                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                                            >
                                                Không
                                            </button>
                                            <button
                                                onClick={() => confirmCancel(appointment.id)}
                                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                            >
                                                Có
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </DefaultLayout>
    );
};

export default VaccinationProcess;