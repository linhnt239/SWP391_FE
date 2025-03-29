// src/components/Navbar/Navbar.js
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
    return (
        <nav className="bg-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center">
                <Link href="/">
                    <div className="flex items-center space-x-2">
                        <img src="/vaccine-icon.jpeg" alt="Vaccine Logo" className="h-10" />
                        <span className="text-blue-900 font-bold text-xl">Vaccine</span>
                    </div>
                </Link>
            </div>

            <div className="flex items-center space-x-6">
                <ul className="flex space-x-8">
                    <li>
                        <Link href="/" className="text-blue-900 hover:text-blue-600">
                            Trang chủ
                        </Link>
                    </li>
                    <li>
                        <Link href="/about" className="text-blue-900 hover:text-blue-600">
                            Giới thiệu
                        </Link>
                    </li>
                    <li>
                        <Link href="/news" className="text-blue-900 hover:text-blue-600">
                            Tin tức
                        </Link>
                    </li>
                    <li>
                        <Link href="/services" className="text-blue-900 hover:text-blue-600">
                            Dịch vụ
                        </Link>
                    </li>
                    <li>
                        <Link href="/vaccination-process" className="text-blue-900 hover:text-blue-600">
                            Quản lý Tiêm chủng
                        </Link>
                    </li>
                    <li>
                        <Link href="/notifications" className="text-blue-900 hover:text-blue-600">
                            Thông báo
                        </Link>
                    </li>
                </ul>
            </div>

            <div>
                <Link href="/schedule">
                    <button className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">
                        Đặt lịch tiêm chủng
                    </button>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;