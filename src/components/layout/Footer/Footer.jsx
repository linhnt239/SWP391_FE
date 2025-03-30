import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-blue-900 text-white py-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Về chúng tôi */}
                    <div>
                        <h2 className="text-lg font-bold mb-4">Về chúng tôi</h2>
                        <div className="flex items-center mb-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-2">
                                <img src="/images/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                            </div>
                            <div className="font-bold">Vaccine Schedule</div>
                        </div>
                        <p className="text-sm text-gray-300 mb-3">
                            Hệ thống tiêm chủng hiện đại giúp phụ huynh và nhân viên y tế theo dõi lịch tiêm chủng cho trẻ một cách hiệu quả.
                        </p>
                        <div className="flex space-x-3 mt-3">
                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                                className="bg-blue-700 hover:bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faFacebookF} className="h-4" />
                            </a>
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
                                className="bg-blue-700 hover:bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faInstagram} className="h-4" />
                            </a>
                            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"
                                className="bg-blue-700 hover:bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faTwitter} className="h-4" />
                            </a>
                            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"
                                className="bg-blue-700 hover:bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faYoutube} className="h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Liên kết nhanh */}
                    <div>
                        <h2 className="text-lg font-bold mb-4">Liên kết nhanh</h2>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-gray-300 hover:text-white flex items-center">
                                    <span className="text-blue-400 mr-2">›</span> Trang chủ
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-300 hover:text-white flex items-center">
                                    <span className="text-blue-400 mr-2">›</span> Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="text-gray-300 hover:text-white flex items-center">
                                    <span className="text-blue-400 mr-2">›</span> Dịch vụ
                                </Link>
                            </li>
                            <li>
                                <Link href="/news" className="text-gray-300 hover:text-white flex items-center">
                                    <span className="text-blue-400 mr-2">›</span> Tin tức
                                </Link>
                            </li>
                            <li>
                                <Link href="/vaccination-process" className="text-gray-300 hover:text-white flex items-center">
                                    <span className="text-blue-400 mr-2">›</span> Quản lý tiêm chủng
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Dịch vụ */}
                    <div>
                        <h2 className="text-lg font-bold mb-4">Dịch vụ</h2>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>✔ Đặt lịch tiêm vắc-xin</li>
                            <li>✔ Tư vấn tiêm chủng</li>
                            <li>✔ Theo dõi sức khỏe sau tiêm</li>
                            <li>✔ Nhắc nhở lịch tiêm</li>
                            <li>✔ Hỗ trợ khách hàng 24/7</li>
                        </ul>
                    </div>

                    {/* Liên hệ */}
                    <div>
                        <h2 className="text-lg font-bold mb-4">Liên hệ</h2>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="mt-1 mr-2 text-blue-400 h-4 w-4" />
                                <span className="text-gray-300">Số 1 Võ Văn Ngân, Phường Linh Chiểu, Thành phố Thủ Đức</span>
                            </li>
                            <li className="flex items-center">
                                <FontAwesomeIcon icon={faPhone} className="mr-2 text-blue-400 h-4 w-4" />
                                <a href="tel:0898520760" className="text-gray-300 hover:text-white">
                                    0898520760
                                </a>
                            </li>
                            <li className="flex items-center">
                                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-blue-400 h-4 w-4" />
                                <a href="mailto:contact@vaccinetracking.com" className="text-gray-300 hover:text-white">
                                    contact@vaccinetracking.com
                                </a>
                            </li>
                            <li className="text-gray-300 mt-2">
                                <div className="font-medium mb-1">Giờ làm việc:</div>
                                <p className="text-xs">Thứ Hai - Thứ Sáu: 8:00 - 17:00</p>
                                <p className="text-xs">Thứ Bảy: 8:00 - 12:00</p>
                                <p className="text-xs">Chủ Nhật: Đóng cửa</p>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center text-xs text-gray-400 mt-6 pt-4 border-t border-blue-800">
                    © {currentYear} Child Vaccine Schedule Tracking System. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
