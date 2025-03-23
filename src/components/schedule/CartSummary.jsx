import React from 'react';
import Link from 'next/link';

const CartSummary = ({ cartItems, totalPrice, formatPrice }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Danh sách vaccine ({cartItems.length})</h2>
            </div>

            <div className="p-6">
                {cartItems.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-gray-500">Không có vaccine nào trong giỏ hàng</p>
                        <Link href="/services" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                            Xem danh sách vaccine
                        </Link>
                    </div>
                ) : (
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

                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">Tổng tiền:</span>
                                <span className="text-xl font-bold text-blue-600">{formatPrice(totalPrice)}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Đã bao gồm VAT</p>
                        </div>

                        <div className="pt-4">
                            <Link href="/cart" className="block text-center w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-lg font-medium transition-colors">
                                Chỉnh sửa giỏ hàng
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartSummary; 