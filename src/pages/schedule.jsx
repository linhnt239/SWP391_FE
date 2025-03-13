// src/pages/schedule.js (Cập nhật form)
import React, { useState, useEffect } from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Schedule = () => {
    const router = useRouter();
    const { vaccineId } = router.query;

    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    const [formData, setFormData] = useState({
        parentName: '',
        childId: '',
        vaccineType: vaccineId || '',
        scheduleType: 'single',
        preferredDate: '',
        preferredTime: '',
        note: '',
    });

    // Lấy thông tin người dùng từ localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                setUserId(user.userId);
                setFormData(prev => ({
                    ...prev,
                    parentName: user.username || ''
                }));
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    // Lấy danh sách trẻ từ API
    useEffect(() => {
        if (userId) {
            fetchChildren();
        } else {
            setLoading(false);
        }
    }, [userId]);

    const fetchChildren = async () => {
        try {
            // Trong thực tế, bạn sẽ gọi API thực sự
            // const response = await fetch(`/api/children/${userId}`);
            // const data = await response.json();
            // if (response.ok) {
            //     setChildren(data.children || []);
            // }

            // Dữ liệu mẫu
            setTimeout(() => {
                setChildren([
                    { childId: '1', childrenName: 'Nguyễn Văn A', dateOfBirth: '2020-05-15' },
                    { childId: '2', childrenName: 'Nguyễn Thị B', dateOfBirth: '2022-01-10' }
                ]);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Error fetching children:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.childId) {
            alert('Vui lòng chọn trẻ từ hồ sơ hoặc thêm hồ sơ trẻ mới!');
            return;
        }

        console.log('Đặt lịch:', formData);
        alert(`Đặt lịch thành công! Chúng tôi sẽ liên hệ để xác nhận.`);

        // Reset form
        setFormData({
            parentName: formData.parentName,
            childId: '',
            vaccineType: '',
            scheduleType: 'single',
            preferredDate: '',
            preferredTime: '',
            note: '',
        });
    };

    // Định dạng ngày tháng
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    return (
        <DefaultLayout>
            <section className="py-12 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                        Đặt lịch tiêm chủng cho trẻ
                    </h1>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                            {children.length === 0 ? (
                                <div className="text-center py-8">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Chưa có hồ sơ trẻ</h2>
                                    <p className="text-gray-600 mb-6">
                                        Bạn cần thêm hồ sơ của trẻ trước khi đặt lịch tiêm chủng.
                                    </p>
                                    <Link href="/children-profiles" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Thêm hồ sơ trẻ
                                    </Link>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="parentName" className="block text-sm font-medium text-gray-700">
                                            Họ tên phụ huynh
                                        </label>
                                        <input
                                            type="text"
                                            id="parentName"
                                            name="parentName"
                                            value={formData.parentName}
                                            onChange={handleChange}
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="childId" className="block text-sm font-medium text-gray-700">
                                            Chọn trẻ từ hồ sơ
                                        </label>
                                        <select
                                            id="childId"
                                            name="childId"
                                            value={formData.childId}
                                            onChange={handleChange}
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">-- Chọn trẻ --</option>
                                            {children.map(child => (
                                                <option key={child.childId} value={child.childId}>
                                                    {child.childrenName} - {formatDate(child.dateOfBirth)}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="mt-2 flex justify-end">
                                            <Link href="/children-profiles" className="text-sm text-blue-600 hover:text-blue-800">
                                                + Thêm hồ sơ trẻ mới
                                            </Link>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="vaccineType" className="block text-sm font-medium text-gray-700">
                                            Loại vaccine cần tiêm
                                        </label>
                                        <select
                                            id="vaccineType"
                                            name="vaccineType"
                                            value={formData.vaccineType}
                                            onChange={handleChange}
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Chọn loại vaccine</option>
                                            <option value="1">Vaccine phòng lao (BCG)</option>
                                            <option value="2">Vaccine 5 trong 1 (Pentaxim)</option>
                                            <option value="3">Vaccine sởi - quai bị - rubella (MMR)</option>
                                            <option value="4">Vaccine viêm gan B</option>
                                            <option value="5">Vaccine phòng thủy đậu (Varicella)</option>
                                            <option value="6">Vaccine phòng viêm não Nhật Bản</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700">
                                            Ngày mong muốn tiêm
                                        </label>
                                        <input
                                            type="date"
                                            id="preferredDate"
                                            name="preferredDate"
                                            value={formData.preferredDate}
                                            onChange={handleChange}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700">
                                            Giờ mong muốn tiêm
                                        </label>
                                        <input
                                            type="time"
                                            id="preferredTime"
                                            name="preferredTime"
                                            value={formData.preferredTime}
                                            onChange={handleChange}
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                                            Ghi chú (nếu có)
                                        </label>
                                        <textarea
                                            id="note"
                                            name="note"
                                            value={formData.note}
                                            onChange={handleChange}
                                            rows="3"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="text-center">
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Xác nhận đặt lịch
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </DefaultLayout>
    );
};

export default Schedule;