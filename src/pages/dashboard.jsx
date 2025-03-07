// src/pages/dashboard.js
import React from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faUsers, faCalendar } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    // Giả lập dữ liệu
    const stats = {
        totalAppointments: 150,
        totalCustomers: 80,
        completedVaccinations: 120,
    };

    return (
        <DefaultLayout>
            <section className="py-12 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                        Bảng điều khiển quản trị
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <FontAwesomeIcon icon={faCalendar} className="text-blue-600 text-3xl mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900">Tổng số lịch</h3>
                            <p className="text-2xl text-blue-900">{stats.totalAppointments}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-3xl mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900">Tổng số khách hàng</h3>
                            <p className="text-2xl text-blue-900">{stats.totalCustomers}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <FontAwesomeIcon icon={faChartPie} className="text-blue-600 text-3xl mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900">Tiêm chủng hoàn thành</h3>
                            <p className="text-2xl text-blue-900">{stats.completedVaccinations}</p>
                        </div>
                    </div>
                </div>
            </section>
        </DefaultLayout>
    );
};

export default Dashboard;