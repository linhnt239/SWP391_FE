// src/components/Header/Header.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const HeaderAfterLogin = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [userData, setUserData] = useState(null);
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
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <span>📞 0898520760</span>
                        <span>📍 123 Nguyễn Trãi, P.Tân Phú, Q.3, TP.HCM</span>
                    </div>
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
        </header>
    );
};

export default HeaderAfterLogin;