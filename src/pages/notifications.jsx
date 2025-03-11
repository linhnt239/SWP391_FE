// src/pages/notifications.js
import DefaultLayout from '@/components/layout/DefaultLayout';
import React from 'react';
import { BiBell, BiCheck, BiTime } from 'react-icons/bi';

const Notifications = () => {
    const notifications = [
        {
            id: 1,
            type: 'appointment',
            title: 'Nhắc lịch tiêm chủng',
            message: 'Bạn có lịch tiêm vắc-xin Pentaxim vào ngày 20/04/2024',
            time: '2 giờ trước',
            isRead: false,
        },
        {
            id: 2,
            type: 'system',
            title: 'Cập nhật hệ thống',
            message: 'Hệ thống sẽ bảo trì từ 23:00 ngày 15/04/2024 đến 02:00 ngày 16/04/2024',
            time: '1 ngày trước',
            isRead: true,
        },
        {
            id: 3,
            type: 'reminder',
            title: 'Nhắc nhở theo dõi',
            message: 'Đừng quên cập nhật tình trạng sau tiêm của bạn trong 24h tới',
            time: '3 ngày trước',
            isRead: false,
        },
    ];

    const getNotificationColor = (type) => {
        switch (type) {
            case 'appointment':
                return 'bg-blue-100 border-blue-500';
            case 'system':
                return 'bg-gray-100 border-gray-500';
            case 'reminder':
                return 'bg-yellow-100 border-yellow-500';
            default:
                return 'bg-white border-gray-300';
        }
    };

    return (
        <DefaultLayout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Thông báo</h1>
                    <p className="text-gray-600">Quản lý các thông báo của bạn</p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-4">
                            <BiBell className="text-2xl text-blue-600" />
                            <span className="text-lg font-semibold">Tất cả thông báo</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                            Đánh dấu tất cả đã đọc
                        </button>
                    </div>

                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 border-l-4 rounded-lg ${getNotificationColor(notification.type)} 
                                ${notification.isRead ? 'opacity-75' : ''} transition duration-200 hover:shadow-md`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 mb-1">
                                            {notification.title}
                                        </h3>
                                        <p className="text-gray-600">{notification.message}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="flex items-center text-sm text-gray-500">
                                            <BiTime className="mr-1" />
                                            {notification.time}
                                        </span>
                                        {notification.isRead ? (
                                            <BiCheck className="text-green-500 text-xl" />
                                        ) : (
                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Notifications;