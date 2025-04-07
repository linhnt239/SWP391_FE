import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
    return (
        <header className="bg-blue-900 text-white py-2">
            <div className="mx-auto px-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <span>📞 0898520760</span>
                        <span>📍 123 Nguyễn Trãi, P.Tân Phú, Q.3, TP.HCM</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/login">
                            <span className="hover:text-gray-300 cursor-pointer">Đăng nhập</span>
                        </Link>
                        <Link href="/register">
                            <span className="hover:text-gray-300 cursor-pointer">Đăng ký</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 