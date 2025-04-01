// src/pages/profile.jsx
'use client';

import React, { useState, useEffect } from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { BiEdit, BiHistory, BiWallet, BiSave } from 'react-icons/bi';
import { toast } from 'react-toastify'; // Thêm react-toastify

const Profile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState({
        username: false,
        phone: false,
        email: false,
        dateOfBirth: false,
        address: false,
    });

    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        email: '',
        dateOfBirth: '',
        address: '',
        appointments: [],
        payments: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false); // Thêm trạng thái loading cho nút lưu

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                const token = localStorage.getItem('token');
                const userId = userData.userID;

                if (!userId || !token) {
                    throw new Error('Không tìm thấy userID hoặc token trong localStorage');
                }

                // Fetch user profile
                const profileResponse = await fetch(
                    `/api/user/profile?userId=${userId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const profileData = await profileResponse.json();

                // Fetch completed appointments
                const appointmentsResponse = await fetch(
                    `/api/appointments/${userId}/completed`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const appointmentsData = await appointmentsResponse.json();
                console.log('Completed appointments:', appointmentsData);

                // Fetch payment history
                const paymentsResponse = await fetch(
                    `/api/payments/user/${userId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const paymentsData = await paymentsResponse.json();
                console.log('Payment history:', paymentsData);

                setFormData({
                    username: profileData.username || '',
                    phone: profileData.phone || '',
                    email: profileData.email || '',
                    dateOfBirth: profileData.dateOfBirth || '',
                    address: profileData.address || '',
                    appointments: appointmentsData || [],
                    payments: paymentsData || [],
                });
            } catch (err) {
                setError(err.message);
                console.error('Lỗi khi lấy dữ liệu:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleInputClick = (field) => {
        setIsEditing((prev) => ({ ...prev, [field]: true }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true); // Bật trạng thái loading
        try {
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            const token = localStorage.getItem('token');
            const userId = userData.userID;

            if (!userId || !token) {
                throw new Error('Không tìm thấy userID hoặc token');
            }

            const response = await fetch(
                `/api/user/profile?userId=${userId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }
            );




            setIsEditing({
                username: false,
                phone: false,
                email: false,
                dateOfBirth: false,
                address: false,
            });

            // Hiển thị toast thành công
            toast.success('Cập nhật thông tin thành công!', {
                position: 'top-right',
                autoClose: 3000,
            });

            console.log('Dữ liệu đã lưu:', formData);
        } catch (err) {
            setError(err.message);
            console.error('Lỗi khi lưu dữ liệu:', err);

            // Hiển thị toast lỗi
            toast.error('Lưu thay đổi thất bại. Vui lòng thử lại!', {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setIsSaving(false); // Tắt trạng thái loading
        }
    };

    // Format date to Vietnamese format
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Format price to Vietnamese currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <DefaultLayout>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="md:flex">
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
                                    <h2 className="mt-4 text-xl font-bold">{formData.username}</h2>
                                    <p className="text-blue-200">{formData.email}</p>
                                </div>
                                <nav className="mt-8 space-y-2">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${activeTab === 'profile' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
                                    >
                                        <BiEdit className="text-xl" />
                                        <span>Thông tin cá nhân</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('history')}
                                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${activeTab === 'history' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
                                    >
                                        <BiHistory className="text-xl" />
                                        <span>Lịch sử đặt dịch vụ</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('payments')}
                                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 ${activeTab === 'payments' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
                                    >
                                        <BiWallet className="text-xl" />
                                        <span>Lịch sử thanh toán</span>
                                    </button>
                                </nav>
                            </div>
                            <div className="md:w-3/4 p-8">
                                {activeTab === 'profile' && (
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Thông tin cá nhân</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {Object.entries({
                                                'Tên người dùng': 'username',
                                                'Số điện thoại': 'phone',
                                                'Email': 'email',
                                                'Ngày sinh': 'dateOfBirth',
                                                'Địa chỉ': 'address',
                                            }).map(([label, field]) => (
                                                <div key={field} className="relative">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                                    <input
                                                        type={field === 'dateOfBirth' ? 'date' : 'text'}
                                                        name={field}
                                                        value={formData[field]}
                                                        onChange={handleInputChange}
                                                        onClick={() => handleInputClick(field)}
                                                        readOnly={!isEditing[field]}
                                                        className={`w-full px-4 py-2 rounded-lg border ${isEditing[field] ? 'border-blue-500 bg-white' : 'border-gray-300 bg-gray-50'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 flex justify-end">
                                            <button
                                                onClick={handleSave}
                                                disabled={isSaving} // Vô hiệu hóa nút khi đang lưu
                                                className={`flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <svg
                                                            className="animate-spin h-5 w-5 mr-2 text-white"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            ></circle>
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            ></path>
                                                        </svg>
                                                        <span>Đang lưu...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <BiSave className="text-xl" />
                                                        <span>Lưu thay đổi</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'history' && (
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Lịch sử đặt dịch vụ</h3>
                                        <div className="space-y-4">
                                            {loading ? (
                                                <div className="flex justify-center py-4">
                                                    <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                </div>
                                            ) : formData.appointments.length > 0 ? (
                                                formData.appointments.map((appointment) => (
                                                    <div key={appointment.appointmentId} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                        <div className="flex flex-col md:flex-row justify-between">
                                                            <div className="mb-3 md:mb-0">
                                                                <h4 className="font-semibold text-lg">{appointment.childrenName}</h4>
                                                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                                                                    <p>
                                                                        <span className="font-medium">Ngày tiêm:</span>{' '}
                                                                        {new Date(appointment.appointmentDate).toLocaleDateString('vi-VN')}
                                                                    </p>
                                                                    <p>
                                                                        <span className="font-medium">Giờ tiêm:</span>{' '}
                                                                        {appointment.timeStart ?
                                                                            (typeof appointment.timeStart === 'string' ?
                                                                                appointment.timeStart :
                                                                                `${String(appointment.timeStart.hour).padStart(2, '0')}:${String(appointment.timeStart.minute).padStart(2, '0')}`) :
                                                                            'Chưa có thông tin'}
                                                                    </p>
                                                                    <p>
                                                                        <span className="font-medium">Vaccine:</span>{' '}
                                                                        {appointment.vaccineDetailsList && appointment.vaccineDetailsList.length > 0
                                                                            ? appointment.vaccineDetailsList[0].doseName
                                                                            : "Không có thông tin"}
                                                                    </p>
                                                                    <p>
                                                                        <span className="font-medium">Mũi thứ:</span>{' '}
                                                                        {appointment.vaccineDetailsList && appointment.vaccineDetailsList.length > 0
                                                                            ? `${appointment.vaccineDetailsList[0].currentDose}/${appointment.vaccineDetailsList[0].doseRequire}`
                                                                            : "N/A"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end">
                                                                <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-medium mb-2">
                                                                    Hoàn thành
                                                                </span>

                                                                <p className="text-blue-600 font-medium mt-2">
                                                                    {appointment.vaccineDetailsList && appointment.vaccineDetailsList.length > 0
                                                                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(appointment.vaccineDetailsList[0].price)
                                                                        : "0 VND"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-600">Không có lịch sử đặt dịch vụ hoàn thành.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'payments' && (
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Lịch sử thanh toán</h3>
                                        <div className="space-y-4">
                                            {formData.payments.length > 0 ? (
                                                formData.payments.map((payment) => (
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
                                                                <span
                                                                    className={`inline-block px-4 py-1 rounded-full ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                                                >
                                                                    {payment.status === 'completed' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-600">Không có lịch sử thanh toán.</p>
                                            )}
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