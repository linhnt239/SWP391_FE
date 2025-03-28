import React from 'react';
import Link from 'next/link';
import ChildProfileSelector from './ChildProfileSelector';
import ParentInfoForm from './ParentInfoForm';
import AppointmentTimeForm from './AppointmentTimeForm';

const UserInfoForm = ({
    formData,
    handleChange,
    handleSubmit,
    children,
    selectedChild,
    acceptTerms,
    setAcceptTerms,
    setShowTerms,
    formatDate,
    calculateAge
}) => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Thông tin người được tiêm</h2>
                <p className="text-sm text-gray-600 mt-1">
                    Vui lòng điền đầy đủ thông tin để đăng ký tiêm chủng
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                {/* Lựa chọn sử dụng hồ sơ có sẵn hoặc tạo mới */}
                {children.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="useExistingProfile"
                                    checked={formData.useExistingProfile}
                                    onChange={() => handleChange({
                                        target: {
                                            name: 'useExistingProfile',
                                            type: 'checkbox',
                                            checked: true
                                        }
                                    })}
                                    className="form-radio h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2">Sử dụng hồ sơ có sẵn</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="useExistingProfile"
                                    checked={!formData.useExistingProfile}
                                    onChange={() => handleChange({
                                        target: {
                                            name: 'useExistingProfile',
                                            type: 'checkbox',
                                            checked: false
                                        }
                                    })}
                                    className="form-radio h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2">Tạo hồ sơ mới</span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Chọn hồ sơ có sẵn */}
                {formData.useExistingProfile && children.length > 0 ? (
                    <ChildProfileSelector
                        formData={formData}
                        handleChange={handleChange}
                        children={children}
                        selectedChild={selectedChild}
                        formatDate={formatDate}
                        calculateAge={calculateAge}
                    />
                ) : (
                    <div className="text-center py-4 border border-dashed border-gray-300 rounded-lg">
                        <Link href="/children-profiles" className="text-blue-600 hover:text-blue-800 font-medium">
                            Quản lý hồ sơ trẻ
                        </Link>
                    </div>
                )}

                {/* Thông tin người đăng ký */}
                <ParentInfoForm
                    formData={formData}
                    handleChange={handleChange}
                />

                {/* Thông tin lịch tiêm */}
                <AppointmentTimeForm
                    formData={formData}
                    handleChange={handleChange}
                />

                {/* Phương thức thanh toán */}
                <div className="mt-6">
                    <h3 className="font-medium text-gray-800 mb-3">Phương thức thanh toán</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className={`border rounded-lg p-4 flex items-center cursor-pointer hover:border-blue-500 transition-colors ${formData.paymentMethod === 'online' ? 'border-blue-500 bg-blue-50' : ''}`}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="online"
                                checked={formData.paymentMethod === 'online'}
                                onChange={handleChange}
                                className="form-radio h-4 w-4 text-blue-600"
                            />
                            <div className="ml-3">
                                <p className="font-medium">Thanh toán online</p>
                                <p className="text-sm text-gray-600">Thanh toán qua cổng VNPay</p>
                            </div>
                        </label>

                        <label className={`border rounded-lg p-4 flex items-center cursor-pointer hover:border-blue-500 transition-colors ${formData.paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50' : ''}`}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cash"
                                checked={formData.paymentMethod === 'cash'}
                                onChange={handleChange}
                                className="form-radio h-4 w-4 text-blue-600"
                            />
                            <div className="ml-3">
                                <p className="font-medium">Thanh toán tiền mặt</p>
                                <p className="text-sm text-gray-600">Thanh toán tại trung tâm tiêm chủng</p>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="mt-6">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            checked={acceptTerms}
                            onChange={() => setAcceptTerms(!acceptTerms)}
                            className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                            Tôi đã đọc và đồng ý với{' '}
                            <button
                                type="button"
                                onClick={() => setShowTerms(true)}
                                className="text-blue-600 hover:text-blue-800 underline"
                            >
                                điều khoản và điều kiện
                            </button>
                        </span>
                    </label>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        {formData.paymentMethod === 'cash' ? 'Đặt lịch' : 'Thanh toán'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserInfoForm; 