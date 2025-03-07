// src/pages/profile.js
import React from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHistory } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
    // Giả lập dữ liệu hồ sơ
    const profile = {
        parentName: 'Nguyen Thi B',
        childName: 'Nguyen Van A',
        childDob: '2020-05-15',
        appointments: [
            { id: 1, vaccine: 'Pentaxim', date: '2025-03-15', status: 'completed' },
            { id: 2, vaccine: 'MMR', date: '2025-04-10', status: 'scheduled' },
        ],
    };

    return (
        <DefaultLayout>
            <section className="py-12 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                        Hồ sơ khách hàng
                    </h1>
                    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-blue-900 mb-2">
                                <FontAwesomeIcon icon={faUser} className="mr-2" /> Thông tin cá nhân
                            </h2>
                            <p className="text-gray-700">
                                <strong>Họ tên phụ huynh:</strong> {profile.parentName}<br />
                                <strong>Họ tên trẻ:</strong> {profile.childName}<br />
                                <strong>Ngày sinh trẻ:</strong> {profile.childDob}
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-blue-900 mb-2">
                                <FontAwesomeIcon icon={faHistory} className="mr-2" /> Lịch sử đặt lịch
                            </h2>
                            <ul className="space-y-4">
                                {profile.appointments.map((app) => (
                                    <li key={app.id} className="text-gray-700">
                                        <strong>Vaccine:</strong> {app.vaccine} - <strong>Ngày:</strong> {app.date} -{' '}
                                        <span className={app.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}>
                                            {app.status === 'completed' ? 'Hoàn thành' : 'Đang chờ'}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </DefaultLayout>
    );
};

export default Profile;