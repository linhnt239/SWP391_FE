// src/pages/services.js
import React, { useState, useEffect } from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyringe, faInfoCircle, faCalendarAlt, faShieldVirus } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';

const Services = () => {
    const [vaccines, setVaccines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Giả lập việc lấy dữ liệu từ API
        // Trong thực tế, bạn sẽ gọi API thực sự ở đây
        const fetchVaccines = async () => {
            try {
                // const response = await fetch('/api/vaccines');
                // const data = await response.json();
                // setVaccines(data);

                // Dữ liệu mẫu
                setVaccines([
                    {
                        id: 1,
                        name: 'Vaccine phòng lao (BCG)',
                        description: 'Vaccine phòng bệnh lao, tiêm cho trẻ sơ sinh',
                        ageGroup: 'Trẻ từ 0-1 tuổi',
                        price: 150000,
                        doses: 1
                    },
                    {
                        id: 2,
                        name: 'Vaccine 5 trong 1 (Pentaxim)',
                        description: 'Phòng bạch hầu, ho gà, uốn ván, bại liệt và Hib',
                        ageGroup: 'Trẻ từ 2-24 tháng',
                        price: 700000,
                        doses: 3
                    },
                    {
                        id: 3,
                        name: 'Vaccine sởi - quai bị - rubella (MMR)',
                        description: 'Phòng bệnh sởi, quai bị và rubella',
                        ageGroup: 'Trẻ từ 9 tháng',
                        price: 300000,
                        doses: 2
                    },
                    {
                        id: 4,
                        name: 'Vaccine viêm gan B',
                        description: 'Phòng bệnh viêm gan B',
                        ageGroup: 'Mọi lứa tuổi',
                        price: 220000,
                        doses: 3
                    },
                    {
                        id: 5,
                        name: 'Vaccine phòng thủy đậu (Varicella)',
                        description: 'Phòng bệnh thủy đậu',
                        ageGroup: 'Trẻ từ 12 tháng trở lên',
                        price: 650000,
                        doses: 2
                    },
                    {
                        id: 6,
                        name: 'Vaccine phòng viêm não Nhật Bản',
                        description: 'Phòng bệnh viêm não Nhật Bản',
                        ageGroup: 'Trẻ từ 1-15 tuổi',
                        price: 280000,
                        doses: 3
                    }
                ]);
            } catch (error) {
                console.error('Error fetching vaccines:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVaccines();
    }, []);

    // Hàm định dạng giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    return (
        <DefaultLayout>
            <section className="py-12 bg-gradient-to-b from-blue-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-blue-900 mb-4">
                            Dịch vụ tiêm chủng
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Chúng tôi cung cấp đa dạng các loại vaccine chất lượng cao, đảm bảo an toàn và hiệu quả cho trẻ em và người lớn.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {vaccines.map((vaccine) => (
                                <div key={vaccine.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{vaccine.name}</h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2">{vaccine.description}</p>
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                                {vaccine.ageGroup}
                                            </div>
                                            <div className="text-lg font-bold text-blue-600">
                                                {formatPrice(vaccine.price)}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center text-gray-500">
                                                <FontAwesomeIcon icon={faSyringe} className="mr-2" />
                                                <span>{vaccine.doses} mũi</span>
                                            </div>
                                            <Link href={`/vaccine/${vaccine.id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
                                                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                                                Xem chi tiết
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-12 bg-blue-50 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-blue-900 mb-4">Thông tin thêm</h2>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                Giá trên chưa bao gồm phí khám trước tiêm (50,000 VNĐ).
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                Vui lòng đặt lịch trước để được phục vụ tốt nhất.
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                Trẻ em cần mang theo sổ tiêm chủng khi đến tiêm.
                            </li>
                        </ul>
                        <div className="mt-6 text-center">
                            <Link href="/appointment" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg inline-flex items-center transition-colors">
                                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                Đặt lịch ngay
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </DefaultLayout>
    );
};

export default Services;