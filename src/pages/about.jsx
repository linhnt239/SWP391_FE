// src/pages/about.js
import React from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldVirus, faUserMd, faCalendarCheck, faUsers } from '@fortawesome/free-solid-svg-icons';

const About = () => {
    return (
        <DefaultLayout>
            {/* Hero Section */}
            <section className="bg-blue-100 py-20 text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-blue-900 mb-4">
                        Về chúng tôi - Child Vaccine Schedule Tracking System
                    </h1>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                        Hành trình bảo vệ sức khỏe trẻ em với hệ thống quản lý tiêm chủng thông minh và đáng tin cậy.
                    </p>
                </div>
            </section>

            {/* Giới thiệu chung */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2">
                            <img
                                src="/about-image.jpg" // Thay bằng hình ảnh thực tế trong public/
                                alt="About Us"
                                className="rounded-lg shadow-lg w-full h-64 object-cover"
                            />
                        </div>
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-bold text-blue-900 mb-4">Chúng tôi là ai?</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Child Vaccine Schedule Tracking System là một giải pháp công nghệ hiện đại được phát triển để hỗ trợ phụ huynh và nhân viên y tế quản lý lịch tiêm chủng cho trẻ em một cách hiệu quả. Với sứ mệnh mang đến sự an toàn và sức khỏe tốt nhất, chúng tôi kết hợp đội ngũ chuyên gia y tế và công nghệ tiên tiến để đảm bảo mỗi trẻ em đều được tiêm chủng đúng lịch và đầy đủ.
                            </p>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                Thành lập với mục tiêu nâng cao nhận thức về tiêm chủng và giảm thiểu các rủi ro sức khỏe, hệ thống của chúng tôi đã hỗ trợ hàng nghìn gia đình trên khắp Việt Nam.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Highlight */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center">Tại sao chọn chúng tôi?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <FontAwesomeIcon icon={faShieldVirus} className="text-blue-600 text-4xl mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900">An toàn hàng đầu</h3>
                            <p className="text-gray-600 mt-2">
                                Đảm bảo vaccine chất lượng cao và quy trình tiêm chủng an toàn theo tiêu chuẩn quốc tế.
                            </p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <FontAwesomeIcon icon={faUserMd} className="text-blue-600 text-4xl mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900">Đội ngũ chuyên gia</h3>
                            <p className="text-gray-600 mt-2">
                                Bác sĩ và y tá được đào tạo chuyên sâu, sẵn sàng tư vấn mọi thắc mắc.
                            </p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <FontAwesomeIcon icon={faCalendarCheck} className="text-blue-600 text-4xl mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900">Nhắc nhở thông minh</h3>
                            <p className="text-gray-600 mt-2">
                                Hệ thống tự động gửi thông báo qua email/SMS để bạn không bỏ lỡ lịch tiêm.
                            </p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-4xl mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900">Hỗ trợ cộng đồng</h3>
                            <p className="text-gray-600 mt-2">
                                Phục vụ hàng nghìn gia đình với cam kết nâng cao sức khỏe cộng đồng.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lịch sử phát triển */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Lịch sử phát triển</h2>
                    <div className="space-y-8">
                        <div className="flex items-center">
                            <div className="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
                                2023
                            </div>
                            <p className="text-gray-700">
                                Thành lập hệ thống với mục tiêu ban đầu hỗ trợ 500 gia đình tại TP.HCM.
                            </p>
                        </div>
                        <div className="flex items-center">
                            <div className="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
                                2024
                            </div>
                            <p className="text-gray-700">
                                Mở rộng dịch vụ ra toàn quốc và tích hợp công nghệ AI để tối ưu hóa nhắc nhở.
                            </p>
                        </div>
                        <div className="flex items-center">
                            <div className="bg-blue-900 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
                                2025
                            </div>
                            <p className="text-gray-700">
                                Kế hoạch hợp tác với các bệnh viện lớn, phục vụ hơn 10,000 gia đình (dự kiến).
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-12 bg-blue-900 text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-4">Hãy cùng chúng tôi bảo vệ trẻ em!</h2>
                    <p className="text-lg mb-6 max-w-xl mx-auto">
                        Đặt lịch tiêm chủng ngay hôm nay để đảm bảo sức khỏe cho con bạn.
                    </p>
                    <a href="/schedule">
                        <button className="bg-white text-blue-900 px-6 py-3 rounded-full hover:bg-gray-200">
                            Đặt lịch ngay
                        </button>
                    </a>
                </div>
            </section>
        </DefaultLayout>
    );
};

export default About;