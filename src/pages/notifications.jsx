import DefaultLayout from '@/components/layout/DefaultLayout';
import React, { useEffect, useState } from 'react';
import { BiBell, BiCheck, BiTime } from 'react-icons/bi';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Lấy thông tin người dùng từ localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                setUserId(user.userId);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (userId) {
            // Gọi API để lấy thông báo
            fetch(`/api/notification/${userId}`)
                .then(response => response.json())
                .then(data => {
                    setNotifications(data.notifications || []);
                })
                .catch(error => {
                    console.error('Error fetching notifications:', error);
                });
        }
    }, [userId]);

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
                                key={notification.notificationId}
                                className={`p-4 border-l-4 rounded-lg ${getNotificationColor(notification.type)} 
                                ${notification.isRead ? 'opacity-75' : ''} transition duration-200 hover:shadow-md`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 mb-1">
                                            {notification.title}
                                        </h3>
                                        <p className="text-gray-600">{notification.messages}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="flex items-center text-sm text-gray-500">
                                            <BiTime className="mr-1" />
                                            {new Date(notification.createdAt).toLocaleString()}
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