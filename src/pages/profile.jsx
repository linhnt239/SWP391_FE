// src/pages/profile.jsx
import React, { useState } from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { BiEdit, BiHistory, BiWallet, BiSave } from 'react-icons/bi';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('profile');
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
        payments: [
            {
                id: 1,
                service: 'Tiêm vaccine Pentaxim',
                amount: 1500000,
                date: '2025-03-15',
                status: 'completed'
            },
            {
                id: 2,
                service: 'Tiêm vaccine MMR',
                amount: 850000,
                date: '2025-04-10',
                status: 'pending'
            }
        ]
    });

    const handleInputClick = (field) => {
        setIsEditing((prev) => ({ ...prev, [field]: true }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setIsEditing({
            parentName: false,
            phone: false,
            email: false,
            childDob: false,
            address: false,
        });
        console.log('Dữ liệu đã lưu:', formData);
    };

    return (
        <DefaultLayout>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="md:flex">
                            {/* Sidebar */}
                            <div className="md:w-1/4 bg-blue-900 text-white p-6">
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        <img
                                            src="/avt.jpg"
                                            alt="User Avatar"
                                            className="w-32 h-32 rounded-full object-cover border-4 border-white"
                                        />
                                        <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition">
                                            <BiEdit className="text-xl" />
                                        </button>
                                    </div>
                                    <h2 className="mt-4 text-xl font-bold">{formData.parentName}</h2>
                                    <p className="text-blue-200">{formData.email}</p>
                                </div>

                                <nav className="mt-8 space-y-2">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${activeTab === 'profile' ? 'bg-blue-800' : 'hover:bg-blue-800'
                                            }`}
                                    >
                                        <BiEdit className="text-xl" />
                                        <span>Thông tin cá nhân</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('history')}
                                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${activeTab === 'history' ? 'bg-blue-800' : 'hover:bg-blue-800'
                                            }`}
                                    >
                                        <BiHistory className="text-xl" />
                                        <span>Lịch sử đặt dịch vụ</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('payments')}
                                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${activeTab === 'payments' ? 'bg-blue-800' : 'hover:bg-blue-800'
                                            }`}
                                    >
                                        <BiWallet className="text-xl" />
                                        <span>Lịch sử thanh toán</span>
                                    </button>
                                </nav>
                            </div>

                            {/* Main Content */}
                            <div className="md:w-3/4 p-8">
                                {activeTab === 'profile' && (
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Thông tin cá nhân</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {Object.entries({
                                                'Họ và tên': 'parentName',
                                                'Số điện thoại': 'phone',
                                                'Email': 'email',
                                                'Ngày sinh': 'childDob',
                                                'Địa chỉ': 'address'
                                            }).map(([label, field]) => (
                                                <div key={field} className="relative">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                                    <input
                                                        type="text"
                                                        name={field}
                                                        value={formData[field]}
                                                        onChange={handleInputChange}
                                                        onClick={() => handleInputClick(field)}
                                                        readOnly={!isEditing[field]}
                                                        className={`w-full px-4 py-2 rounded-lg border ${isEditing[field] ? 'border-blue-500 bg-white' : 'border-gray-300 bg-gray-50'
                                                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 flex justify-end">
                                            <button
                                                onClick={handleSave}
                                                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                                            >
                                                <BiSave className="text-xl" />
                                                <span>Lưu thay đổi</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'history' && (
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Lịch sử đặt dịch vụ</h3>
                                        <div className="space-y-4">
                                            {formData.appointments.map((app) => (
                                                <div key={app.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <h4 className="font-semibold text-lg">{app.vaccine}</h4>
                                                            <p className="text-gray-600">{app.date}</p>
                                                        </div>
                                                        <span className={`px-4 py-1 rounded-full ${app.status === 'completed'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {app.status === 'completed' ? 'Hoàn thành' : 'Đang chờ'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'payments' && (
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Lịch sử thanh toán</h3>
                                        <div className="space-y-4">
                                            {formData.payments.map((payment) => (
                                                <div key={payment.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <h4 className="font-semibold text-lg">{payment.service}</h4>
                                                            <p className="text-gray-600">{payment.date}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-bold text-blue-600">
                                                                {payment.amount.toLocaleString('vi-VN')} VNĐ
                                                            </p>
                                                            <span className={`inline-block px-4 py-1 rounded-full ${payment.status === 'completed'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {payment.status === 'completed' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Profile;