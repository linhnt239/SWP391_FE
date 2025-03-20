import DefaultLayout from '@/components/layout/DefaultLayout';
import React, { useEffect, useState } from 'react';
import { BiBell, BiCheck, BiTime } from 'react-icons/bi';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Lấy thông tin người dùng từ localStorage
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');

        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                setUserId(user.userId || user.userID || user.id);

                if (savedToken) {
                    setToken(savedToken);
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (userId && token) {
            fetchNotifications();
        }
    }, [userId, token]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            // Sử dụng API mới từ swagger
            const response = await fetch(`/api/notifications-getByUserId/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Notifications data:', data);

            // Kiểm tra cấu trúc dữ liệu và cập nhật state
            if (Array.isArray(data)) {
                setNotifications(data);
            } else if (data && Array.isArray(data.notifications)) {
                setNotifications(data.notifications);
            } else {
                // Nếu không phải mảng, có thể là đối tượng JSON duy nhất
                setNotifications(data ? [data] : []);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    // Định dạng ngày giờ thân thiện
    const formatDateTime = (dateTimeStr) => {
        try {
            const date = new Date(dateTimeStr);
            return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateTimeStr;
        }
    };

    // Cập nhật hàm tính màu sắc để phù hợp với loại thông báo
    const getNotificationColor = (title) => {
        if (!title) return 'bg-white border-gray-300';

        const lowerTitle = title.toLowerCase();

        if (lowerTitle.includes('lịch hẹn') || lowerTitle.includes('appointment')) {
            return 'bg-blue-100 border-blue-500';
        } else if (lowerTitle.includes('thanh toán') || lowerTitle.includes('payment')) {
            return 'bg-green-100 border-green-500';
        } else if (lowerTitle.includes('nhắc nhở') || lowerTitle.includes('reminder')) {
            return 'bg-yellow-100 border-yellow-500';
        } else if (lowerTitle.includes('hủy') || lowerTitle.includes('cancel')) {
            return 'bg-red-100 border-red-500';
        } else {
            return 'bg-gray-100 border-gray-500'; // Mặc định cho thông báo hệ thống
        }
    };

    // Xử lý việc đánh dấu đã đọc tất cả thông báo
    const markAllAsRead = async () => {
        if (!userId || !token) return;

        try {
            // API này cần được thay thế bằng API thực tế của bạn để đánh dấu đã đọc
            const response = await fetch(`/api/notifications/mark-all-read/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Cập nhật UI để hiển thị tất cả thông báo đã đọc
                setNotifications(notifications.map(notif => ({
                    ...notif,
                    isRead: true
                })));
            }
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    if (loading) {
        return (
            <DefaultLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </DefaultLayout>
        );
    }

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
                        <button
                            onClick={markAllAsRead}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Đánh dấu tất cả đã đọc
                        </button>
                    </div>

                    {notifications.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-gray-400 mb-4">
                                <BiBell className="text-5xl mx-auto mb-2" />
                            </div>
                            <p className="text-gray-500">Bạn chưa có thông báo nào</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.notificationId}
                                    className={`p-4 border-l-4 rounded-lg ${getNotificationColor(notification.title)} 
                                    ${notification.isRead ? 'opacity-75' : ''} transition duration-200 hover:shadow-md`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 mb-1">
                                                {notification.title || 'Thông báo mới'}
                                            </h3>
                                            <p className="text-gray-600">{notification.messages}</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="flex items-center text-sm text-gray-500">
                                                <BiTime className="mr-1" />
                                                {formatDateTime(notification.createdAt)}
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
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Notifications;