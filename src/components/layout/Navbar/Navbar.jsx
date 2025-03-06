// src/components/Navbar/Navbar.js
import React from 'react';
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="bg-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center">
                <div className="flex items-center space-x-2">
                    <img src="/vaccine-icon.jpeg" alt="Vaccine Logo" className="h-10" />
                    <span className="text-blue-900 font-bold text-xl">Vaccine</span>
                </div>
            </div>
            <div className="flex items-center space-x-6"> {/* Tăng space-x-8 để cách logo và menu ra thêm */}
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
                        <Link href="/services" className="text-blue-900 hover:text-blue-600">
                            Dịch vụ
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact" className="text-blue-900 hover:text-blue-600">
                            Liên hệ
                        </Link>
                    </li>
                </ul>
            </div>
            <div>
                <button className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">
                    Đặt lịch tiêm chủng
                </button>
            </div>
        </nav>
    );
};

export default Navbar;