// src/pages/services.js
import React, { useState, useEffect } from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyringe, faInfoCircle, faCalendarAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const Services = () => {
    const [vaccines, setVaccines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVaccines = async () => {
            try {
                const response = await fetch('/api/vaccines-all');

                if (!response.ok) {
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();

                // Chuyển đổi dữ liệu API thành định dạng cần thiết cho UI
                const formattedVaccines = data.map(vaccine => {
                    // Lấy thông tin từ vaccineDetailsList đầu tiên (nếu có)
                    const details = vaccine.vaccineDetailsList && vaccine.vaccineDetailsList.length > 0
                        ? vaccine.vaccineDetailsList[0]
                        : {};

                    return {
                        id: vaccine.vaccineId,
                        name: vaccine.illnessName,
                        description: vaccine.descriptions,
                        ageGroup: `Trẻ từ ${vaccine.ageLimit} tháng trở lên`,
                        price: details.price || 0,
                        doses: details.doseRequire || 1
                    };
                });

                setVaccines(formattedVaccines);
                setError(null);
            } catch (error) {
                console.error('Error fetching vaccines:', error);
                setError(error.message || 'Đã xảy ra lỗi khi tải dữ liệu vaccine');
                setVaccines([]);
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
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 mb-8">
                            <div className="flex items-center mb-3">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-xl mr-2" />
                                <h3 className="text-lg font-semibold">Không thể tải dữ liệu</h3>
                            </div>
                            <p>{error}</p>
                            <p className="mt-3">Vui lòng thử lại sau hoặc liên hệ với quản trị viên.</p>
                        </div>
                    ) : vaccines.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">Không có dữ liệu vaccine nào.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {vaccines.map((vaccine) => (
                                <div key={vaccine.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{vaccine.name}</h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2">{vaccine.description}</p>
                                        <div className="flex justify-between items-center mb-4">
                                            
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
                                Vui lòng đặt lịch trước để được phục vụ tốt nhất.
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                Trẻ em cần mang theo sổ tiêm chủng khi đến tiêm.
                            </li>
                        </ul>
                        <div className="mt-6 text-center">
                            <Link href="/schedule" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg inline-flex items-center transition-colors">
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