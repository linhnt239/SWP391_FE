import React, { useState, useEffect } from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { useRouter } from 'next/router';
import Link from 'next/link';
import StepIndicator from '@/components/schedule/StepIndicator';
import UserInfoForm from '@/components/schedule/UserInfoForm';
import CartSummary from '@/components/schedule/CartSummary';
import ConfirmationStep from '@/components/schedule/ConfirmationStep';
import SuccessStep from '@/components/schedule/SuccessStep';
import TermsModal from '@/components/schedule/TermsModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useSchedule } from '@/hooks/useSchedule';

const Schedule = () => {
    const router = useRouter();
    const {
        cartItems,
        children,
        loading,
        userId,
        token,
        totalPrice,
        step,
        selectedChild,
        acceptTerms,
        paymentSuccess,
        formData,
        formatPrice,
        formatDate,
        calculateAge,
        setStep,
        setAcceptTerms,
        setSelectedChild,
        handleChange,
        handleCheckout,
        handleSubmit
    } = useSchedule();

    const [showTerms, setShowTerms] = useState(false);

    // Kiểm tra thanh toán thành công từ URL
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const vnp_ResponseCode = urlParams.get('vnp_ResponseCode');

            if (vnp_ResponseCode === "00") {
                // Xóa URL parameters
                window.history.replaceState({}, '', '/schedule');
            }
        }
    }, []);

    if (loading) {
        return (
            <DefaultLayout>
                <LoadingSpinner />
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <div className="bg-gray-100 min-h-screen py-8">
                <div className="container mx-auto px-4">
                    {/* Tiêu đề và các bước */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-blue-900 mb-6">Đăng ký mũi tiêm</h1>
                        <StepIndicator currentStep={step} />
                    </div>

                    {step === 1 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Form thông tin người tiêm */}
                            <div className="lg:col-span-2">
                                <UserInfoForm
                                    formData={formData}
                                    handleChange={handleChange}
                                    handleSubmit={handleSubmit}
                                    children={children}
                                    selectedChild={selectedChild}
                                    acceptTerms={acceptTerms}
                                    setAcceptTerms={setAcceptTerms}
                                    setShowTerms={setShowTerms}
                                    formatDate={formatDate}
                                    calculateAge={calculateAge}
                                />
                            </div>

                            {/* Thông tin giỏ hàng */}
                            <div className="lg:col-span-1">
                                <CartSummary
                                    cartItems={cartItems}
                                    totalPrice={totalPrice}
                                    formatPrice={formatPrice}
                                />
                            </div>
                        </div>
                    ) : (
                        paymentSuccess ? (
                            <SuccessStep router={router} />
                        ) : (
                            <ConfirmationStep
                                formData={formData}
                                selectedChild={selectedChild}
                                setStep={setStep}
                                handleCheckout={handleCheckout}
                            />
                        )
                    )}
                </div>
            </div>

            {/* Modal điều khoản và điều kiện */}
            {showTerms && (
                <TermsModal
                    onClose={() => setShowTerms(false)}
                    onAccept={() => {
                        setAcceptTerms(true);
                        setShowTerms(false);
                    }}
                />
            )}
        </DefaultLayout>
    );
};

export default Schedule;