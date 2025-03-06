import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { faPhone as faPhoneSolid } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    return (
        <footer className="bg-blue-900 text-white py-10">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                <div>
                    <h2 className="text-lg font-bold mb-3">Child Vaccine Schedule Tracking System</h2>
                    <p className="text-sm">
                        Hệ thống giúp phụ huynh và nhân viên y tế quản lý lịch tiêm chủng hiệu quả, đảm bảo sức khỏe cho trẻ em với các tính năng hiện đại.
                    </p>
                    <p className="text-sm mt-3 font-bold">Hotline: 0898520760</p>
                </div>
                <div className="flex flex-col items-center md:items-center">
                    <h2 className="text-lg font-bold mb-3">Chức năng</h2>
                    <ul className="text-sm space-y-2 text-center">
                        <li>✔ Quản lý lịch tiêm</li>
                        <li>✔ Nhắc nhở tự động</li>
                        <li>✔ Theo dõi sức khỏe</li>
                        <li>✔ Tư vấn trực tuyến</li>
                        <li>✔ Báo cáo thống kê</li>
                    </ul>
                </div>
                <div className="flex flex-col items-center">
                    <h2 className="text-lg font-bold mb-3">Liên hệ</h2>
                    <div className="flex space-x-4">
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                            <FontAwesomeIcon icon={faInstagram} className="h-6" />
                        </a>
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                            <FontAwesomeIcon icon={faFacebookF} className="h-6" />
                        </a>
                        <a href="tel:+0898520760" className="hover:text-gray-300">
                            <FontAwesomeIcon icon={faPhoneSolid} className="h-6" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="text-center text-sm mt-6 border-t border-gray-700 pt-4">
                © 2025 Child Vaccine Schedule Tracking System. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
