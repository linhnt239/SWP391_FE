import React from 'react';
import Link from 'next/link';

const PaymentStep = ({
    formData,
    selectedChild,
    cartItems,
    totalPrice,
    onBack,
    onCheckout,
    formatPrice,
    formatDate
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Thanh toán</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Vui lòng chọn phương thức thanh toán
                        </p>
                    </div>

                    <div className="p-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin đơn hàng</h3>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Người đăng ký:</p>
                                        <p className="font-medium">{formData.parentName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Số điện thoại:</p>
                                        <p className="font-medium">{formData.parentPhone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Người được tiêm:</p>
                                        <p className="font-medium">
                                            {selectedChild ? selectedChild.childrenName : formData.childName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Ngày sinh:</p>
                                        <p className="font-medium">
                                            {formatDate(selectedChild ? selectedChild.dateOfBirth : formData.dateOfBirth)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Giới tính:</p>
                                        <p className="font-medium">
                                            {selectedChild ?
                                                (selectedChild.gender === 'male' ? 'Nam' : 'Nữ') :
                                                (formData.gender === 'male' ? 'Nam' : 'Nữ')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Ngày tiêm:</p>
                                        <p className="font-medium">{formatDate(formData.preferredDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Giờ tiêm:</p>
                                        <p className="font-medium">{formData.preferredTime}</p>
                                    </div>
                                </div>

                                {formData.note && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-600">Ghi chú:</p>
                                        <p className="font-medium">{formData.note}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Phương thức thanh toán</h3>

                            <div className="space-y-3">
                                <label className="block p-4 border border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cash"
                                            defaultChecked
                                            className="form-radio h-4 w-4 text-blue-600"
                                        />
                                        <div className="ml-3">
                                            <span className="font-medium text-gray-800">Thanh toán tại trung tâm</span>
                                            <p className="text-sm text-gray-600 mt-1">Thanh toán trực tiếp khi đến tiêm</p>
                                        </div>
                                    </div>
                                </label>

                                <label className="block p-4 border border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="bank"
                                            className="form-radio h-4 w-4 text-blue-600"
                                        />
                                        <div className="ml-3">
                                            <span className="font-medium text-gray-800">Chuyển khoản ngân hàng</span>
                                            <p className="text-sm text-gray-600 mt-1">Chuyển khoản trước khi đến tiêm</p>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-between mt-8">
                            <button
                                type="button"
                                onClick={onBack}
                                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Quay lại
                            </button>

                            <button
                                type="button"
                                onClick={onCheckout}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Xác nhận đặt lịch
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">Tóm tắt đơn hàng</h2>
                    </div>

                    <div className="p-6">
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between pb-4 border-b border-gray-100">
                                    <div>
                                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                                        <p className="text-sm text-gray-600">Số mũi: {item.doses}</p>
                                    </div>
                                    <div className="text-blue-600 font-medium">
                                        {formatPrice(item.price)}
                                    </div>
                                </div>
                            ))}

                            <div className="pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-gray-700">Tổng tiền:</span>
                                    <span className="text-xl font-bold text-blue-600">{formatPrice(totalPrice)}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Đã bao gồm VAT</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentStep; 