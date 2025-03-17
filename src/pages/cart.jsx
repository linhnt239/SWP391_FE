import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/components/layout/DefaultLayout';
import Link from 'next/link';

const Cart = () => {
    const router = useRouter();
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Lấy giỏ hàng từ localStorage
        try {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartItems(cart);

            // Tính tổng tiền
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            setTotalPrice(total);
        } catch (error) {
            console.error('Error loading cart:', error);
        }

        setIsLoading(false);
    }, []);

    // Hàm định dạng giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const handleRemoveItem = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        // Kích hoạt sự kiện cập nhật giỏ hàng
        window.dispatchEvent(new Event('cartUpdated'));

        // Cập nhật tổng tiền
        const total = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPrice(total);
    };

    const handleClearCart = () => {
        setCartItems([]);
        localStorage.setItem('cart', JSON.stringify([]));

        // Kích hoạt sự kiện cập nhật giỏ hàng
        window.dispatchEvent(new Event('cartUpdated'));

        setTotalPrice(0);
    };

    const handleCheckout = () => {
        router.push('/schedule');
    };

    if (isLoading) {
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
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Giỏ hàng của bạn</h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Giỏ hàng của bạn đang trống</h2>
                        <p className="text-gray-600 mb-6">Hãy thêm vaccine vào giỏ hàng để tiếp tục.</p>
                        <Link href="/services" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Xem danh sách vaccine
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-800">Danh sách vaccine ({cartItems.length})</h2>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center">
                                            <div className="flex-grow mb-4 md:mb-0">
                                                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                                <p className="text-gray-600 text-sm mt-1">Nhà sản xuất: {item.manufacturer}</p>
                                                <p className="text-gray-600 text-sm">Số mũi: {item.doses} mũi (cách nhau {item.dateBetweenDoses} ngày)</p>
                                                <p className="text-blue-600 font-medium mt-2">{formatPrice(item.price)}/mũi</p>
                                            </div>
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="text-red-500 hover:text-red-700 flex items-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-6 bg-gray-50">
                                    <button
                                        onClick={handleClearCart}
                                        className="text-red-600 hover:text-red-800 flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Xóa tất cả
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-800">Tóm tắt đơn hàng</h2>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tổng số loại vaccine:</span>
                                            <span className="font-medium">{cartItems.length}</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-4 mt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold text-gray-800">Tổng tiền:</span>
                                                <span className="text-xl font-bold text-blue-600">{formatPrice(totalPrice)}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">Đã bao gồm VAT</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mt-6 transition-colors flex items-center justify-center"
                                        disabled={cartItems.length === 0}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                        Đặt lịch tiêm ngay
                                    </button>

                                    <Link
                                        href="/services"
                                        className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-lg font-semibold mt-3 transition-colors flex items-center justify-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Tiếp tục mua hàng
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default Cart; 