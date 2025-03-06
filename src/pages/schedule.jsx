// src/pages/schedule.js
import React, { useState } from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';

const Schedule = () => {
    const [formData, setFormData] = useState({
        parentName: '',
        childName: '',
        childDob: '',
        vaccineType: '',
        preferredDate: '',
        preferredTime: '',
        note: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Đặt lịch:', formData);
        alert('Đặt lịch thành công! Chúng tôi sẽ liên hệ để xác nhận.');
        setFormData({
            parentName: '',
            childName: '',
            childDob: '',
            vaccineType: '',
            preferredDate: '',
            preferredTime: '',
            note: '',
        });
    };

    return (
        <DefaultLayout>
            <section className="py-12 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                        Đặt lịch tiêm chủng cho trẻ
                    </h1>
                    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
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
                                <label htmlFor="childName" className="block text-sm font-medium text-gray-700">
                                    Họ tên trẻ
                                </label>
                                <input
                                    type="text"
                                    id="childName"
                                    name="childName"
                                    value={formData.childName}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="childDob" className="block text-sm font-medium text-gray-700">
                                    Ngày sinh của trẻ
                                </label>
                                <input
                                    type="date"
                                    id="childDob"
                                    name="childDob"
                                    value={formData.childDob}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
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
                                    <option value="BCG">Vaccine phòng lao (BCG)</option>
                                    <option value="Pentaxim">Vaccine 5 trong 1 (Pentaxim)</option>
                                    <option value="MMR">Vaccine sởi - quai bị - rubella (MMR)</option>
                                    <option value="Other">Khác</option>
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
                                    className="bg-blue-900 text-white px-6 py-3 rounded-full hover:bg-blue-700"
                                >
                                    Xác nhận đặt lịch
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </DefaultLayout>
    );
};

export default Schedule;