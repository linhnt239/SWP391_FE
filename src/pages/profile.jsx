// src/pages/profile.jsx
import React, { useState } from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';

const Profile = () => {
    const [showHistory, setShowHistory] = useState(false);
    const [isEditing, setIsEditing] = useState({
        parentName: false,
        phone: false,
        email: false,
        childDob: false,
        address: false,
    });

    // Dữ liệu giả lập ban đầu
    const [formData, setFormData] = useState({
        parentName: 'Nguyen Thi B',
        phone: '0123 456 789',
        email: 'nguyenthib@example.com',
        childDob: '2020-05-15',
        address: '123 Nguyễn Trãi, Q.3, TP.HCM',
        appointments: [
            { id: 1, vaccine: 'Pentaxim', date: '2025-03-15', status: 'completed' },
            { id: 2, vaccine: 'MMR', date: '2025-04-10', status: 'scheduled' },
        ],
    });

    const toggleHistory = () => {
        setShowHistory(!showHistory);
    };

    const handleInputClick = (field) => {
        setIsEditing((prev) => ({ ...prev, [field]: true }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Lưu giá trị và tắt chế độ chỉnh sửa
        setIsEditing({
            parentName: false,
            phone: false,
            email: false,
            childDob: false,
            address: false,
        });
        // Ở đây bạn có thể gọi API để lưu dữ liệu nếu cần
        console.log('Dữ liệu đã lưu:', formData);
    };

    return (
        <DefaultLayout>
            <section className="py-12 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Hồ sơ</h1>
                    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md flex">
                        {/* Phần avatar */}
                        <div className="w-1/3 flex flex-col items-center">
                            <img
                                src="/avt.jpg"
                                alt="User Avatar"
                                className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-blue-500"
                            />
                            <button className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Thay đổi ảnh
                            </button>
                            <button
                                onClick={toggleHistory}
                                className="mt-4 text-blue-600 hover:underline"
                            >
                                Lịch sử đặt dịch vụ
                            </button>
                        </div>
                        {/* Phần thông tin */}
                        <div className="w-2/3 pl-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Tên</label>
                                <input
                                    type="text"
                                    name="parentName"
                                    value={formData.parentName}
                                    onChange={handleInputChange}
                                    onClick={() => handleInputClick('parentName')}
                                    readOnly={!isEditing.parentName}
                                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${isEditing.parentName ? 'bg-white' : 'bg-gray-100'
                                        } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Điện thoại</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    onClick={() => handleInputClick('phone')}
                                    readOnly={!isEditing.phone}
                                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${isEditing.phone ? 'bg-white' : 'bg-gray-100'
                                        } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onClick={() => handleInputClick('email')}
                                    readOnly={!isEditing.email}
                                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${isEditing.email ? 'bg-white' : 'bg-gray-100'
                                        } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                                <input
                                    type="text"
                                    name="childDob"
                                    value={formData.childDob}
                                    onChange={handleInputChange}
                                    onClick={() => handleInputClick('childDob')}
                                    readOnly={!isEditing.childDob}
                                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${isEditing.childDob ? 'bg-white' : 'bg-gray-100'
                                        } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    onClick={() => handleInputClick('address')}
                                    readOnly={!isEditing.address}
                                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${isEditing.address ? 'bg-white' : 'bg-gray-100'
                                        } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                            </div>
                            <div className="text-right">
                                <button
                                    onClick={handleSave}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Lịch sử đặt dịch vụ */}
                    {showHistory && (
                        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lịch sử đặt dịch vụ</h2>
                            <ul className="space-y-4">
                                {formData.appointments.map((app) => (
                                    <li key={app.id} className="text-gray-700">
                                        <strong>Vaccine:</strong> {app.vaccine} - <strong>Ngày:</strong> {app.date} -{' '}
                                        <span className={app.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}>
                                            {app.status === 'completed' ? 'Hoàn thành' : 'Đang chờ'}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </section>
        </DefaultLayout>
    );
};

export default Profile;