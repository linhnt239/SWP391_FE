// src/pages/services.js
import React from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyringe, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

const Services = () => {
    return (
        <DefaultLayout>
            <section className="py-12 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                        Dịch vụ & Bảng giá
                    </h1>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-blue-900 text-white">
                                    <th className="py-3 px-4 text-left"><FontAwesomeIcon icon={faSyringe} className="mr-2" /> Tên vaccine</th>
                                    <th className="py-3 px-4 text-left">Đối tượng</th>
                                    <th className="py-3 px-4 text-left"><FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" /> Giá (VNĐ)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="py-3 px-4">Vaccine phòng lao (BCG)</td>
                                    <td className="py-3 px-4">Trẻ từ 0-1 tuổi</td>
                                    <td className="py-3 px-4">150,000</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-3 px-4">Vaccine 5 trong 1 (Pentaxim)</td>
                                    <td className="py-3 px-4">Trẻ từ 2-24 tháng</td>
                                    <td className="py-3 px-4">700,000</td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-3 px-4">Vaccine sởi - quai bị - rubella (MMR)</td>
                                    <td className="py-3 px-4">Trẻ từ 9 tháng</td>
                                    <td className="py-3 px-4">300,000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-center text-gray-600 mt-4">
                        * Giá trên chưa bao gồm phí khám trước tiêm (50,000 VNĐ). Vui lòng liên hệ để biết thêm chi tiết.
                    </p>
                </div>
            </section>
        </DefaultLayout>
    );
};

export default Services;