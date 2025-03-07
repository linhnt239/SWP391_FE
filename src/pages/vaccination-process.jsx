// src/pages/vaccination-process.js
import React from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarPlus, faSyringe, faFileAlt, faMoneyBillWave, faStar } from '@fortawesome/free-solid-svg-icons';

const VaccinationProcess = () => {
    // Giả lập dữ liệu đơn đặt lịch
    const appointment = {
        id: 1,
        childName: 'Nguyen Van A',
        vaccineType: 'Pentaxim',
        date: '2025-03-15',
        time: '14:00',
        status: 'completed', // Có thể là 'scheduled', 'in-progress', 'completed'
        paymentStatus: 'paid',
        rating: 4.5,
    };

    return (
        <DefaultLayout>
            <section className="py-12 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                        Quản lý quá trình tiêm chủng
                    </h1>
                    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
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
                                    <strong>Tiêm chủng:</strong> {appointment.status === 'completed' ? 'Đã hoàn thành' : 'Chưa thực hiện'}
                                </p>
                            </div>
                            {/* Bước 3: Ghi nhận */}
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faFileAlt} className="text-blue-600 text-2xl mr-4" />
                                <p className="text-gray-700">
                                    <strong>Ghi nhận kết quả:</strong> Đã cập nhật vào hồ sơ
                                </p>
                            </div>
                            {/* Bước 4: Thanh toán */}
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faMoneyBillWave} className="text-blue-600 text-2xl mr-4" />
                                <p className="text-gray-700">
                                    <strong>Thanh toán:</strong> {appointment.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </p>
                            </div>
                            {/* Bước 5: Đánh giá */}
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={faStar} className="text-blue-600 text-2xl mr-4" />
                                <p className="text-gray-700">
                                    <strong>Đánh giá:</strong> {appointment.rating ? `${appointment.rating}/5` : 'Chưa đánh giá'}
                                </p>
                                {appointment.rating ? null : (
                                    <button className="ml-4 bg-blue-900 text-white px-4 py-2 rounded-full hover:bg-blue-700">
                                        Đánh giá ngay
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </DefaultLayout>
    );
};

export default VaccinationProcess;