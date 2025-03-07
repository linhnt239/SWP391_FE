// src/pages/payment.js
import React, { useState } from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faTimes } from '@fortawesome/free-solid-svg-icons';

const Payment = () => {
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [cancelReason, setCancelReason] = useState('');

    const handlePayment = () => {
        setPaymentStatus('paid');
        alert('Thanh toán thành công!');
    };

    const handleCancel = () => {
        if (cancelReason) {
            setPaymentStatus('cancelled');
            alert(`Đã hủy lịch với lý do: ${cancelReason}`);
            setCancelReason('');
        } else {
            alert('Vui lòng nhập lý do hủy!');
        }
    };

    return (
        <DefaultLayout>
            <section className="py-12 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                        Thanh toán & Hủy lịch
                    </h1>
                    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-blue-900 mb-2">Trạng thái thanh toán</h2>
                            <p className="text-gray-700">
                                Trạng thái hiện tại: {paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </p>
                            {paymentStatus === 'pending' && (
                                <button
                                    onClick={handlePayment}
                                    className="mt-4 bg-blue-900 text-white px-6 py-3 rounded-full hover:bg-blue-700"
                                >
                                    <FontAwesomeIcon icon={faCreditCard} className="mr-2" /> Thanh toán ngay
                                </button>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-blue-900 mb-2">Hủy lịch</h2>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Nhập lý do hủy lịch..."
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                rows="3"
                            />
                            <button
                                onClick={handleCancel}
                                className="mt-4 bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700"
                            >
                                <FontAwesomeIcon icon={faTimes} className="mr-2" /> Hủy lịch
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </DefaultLayout>
    );
};

export default Payment;