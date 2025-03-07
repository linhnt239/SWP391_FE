// src/pages/notifications.js
import React from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const Notifications = () => {
    const notifications = [
        { id: 1, message: 'Nhắc nhở: Tiêm vaccine MMR cho Nguyen Van A vào 2025-04-10', date: '2025-03-06' },
        { id: 2, message: 'Đã đặt lịch thành công cho vaccine Pentaxim', date: '2025-03-01' },
    ];

    return (
        <DefaultLayout>
            <section className="py-12 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                        Thông báo của bạn
                    </h1>
                    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                        <ul className="space-y-4">
                            {notifications.map((notif) => (
                                <li key={notif.id} className="text-gray-700 flex items-center">
                                    <FontAwesomeIcon icon={faBell} className="text-blue-600 mr-2" />
                                    <span>{notif.message} - <em>{notif.date}</em></span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </DefaultLayout>
    );
};

export default Notifications;