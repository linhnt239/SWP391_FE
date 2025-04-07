// src/components/Header/Header.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const HeaderAfterLogin = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [userData, setUserData] = useState(null);
    const [cartItemCount, setCartItemCount] = useState(0);
    const router = useRouter();

    useEffect(() => {
        // Chỉ kiểm tra và set userData, không redirect
        const user = localStorage.getItem('user');
        if (user) {
            try {
                setUserData(JSON.parse(user));
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    // Cập nhật số lượng item trong giỏ hàng
    useEffect(() => {
        const updateCartCount = () => {
            try {
                const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                const count = cart.reduce((sum, item) => sum + item.quantity, 0);
                setCartItemCount(count);
            } catch (error) {
                console.error('Error loading cart count:', error);
                setCartItemCount(0);
            }
        };

        // Cập nhật khi component mount
        updateCartCount();

        // Thêm event listener để cập nhật khi localStorage thay đổi
        window.addEventListener('storage', updateCartCount);

        // Tạo một custom event để cập nhật khi thêm vào giỏ hàng
        window.addEventListener('cartUpdated', updateCartCount);

        return () => {
            window.removeEventListener('storage', updateCartCount);
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    const handleLogout = () => {
        // Xóa localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');

        // Xóa cookies
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';

        // Chuyển về trang login
        window.location.href = '/login';
    };

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest('.dropdown-container')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <header className="bg-blue-900 text-white py-2">
            <div className="mx-auto px-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <span>📞 0898520760</span>
                        <span>📍 123 Nguyễn Trãi, P.Tân Phú, Q.3, TP.HCM</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Nút giỏ hàng */}
                        <Link href="/cart" className="relative flex items-center hover:text-blue-200 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemCount > 99 ? '99+' : cartItemCount}
                                </span>
                            )}
                        </Link>

                        {/* Avatar và dropdown */}
                        <div className="relative dropdown-container">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center space-x-2 focus:outline-none"
                            >
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white">
                                    <Image
                                        src="/avt.jpg"
                                        alt="User Avatar"
                                        width={32}
                                        height={32}
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                    <div className="px-4 py-2 border-b">
                                        <p className="text-sm font-medium text-gray-900">
                                            {userData?.username}
                                        </p>
                                    </div>
                                    <Link href="/profile">
                                        <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                            Hồ sơ
                                        </div>
                                    </Link>
                                    <Link href="/children-profiles">
                                        <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                            Hồ sơ của trẻ
                                        </div>
                                    </Link>
                                    <Link href="/cart">
                                        <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                            Giỏ hàng
                                            {cartItemCount > 0 && (
                                                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                                                    {cartItemCount}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderAfterLogin;