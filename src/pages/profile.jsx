// src/pages/profile.jsx
'use client';

import React, { useState, useEffect } from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { BiEdit, BiHistory, BiWallet, BiSave, BiX } from 'react-icons/bi';
import { FaSyringe, FaCalendarAlt, FaInfoCircle, FaMoneyBillWave, FaClock } from 'react-icons/fa';
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
    const [showVaccineModal, setShowVaccineModal] = useState(false);
    const [selectedVaccine, setSelectedVaccine] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                const token = localStorage.getItem('token');
                const userId = userData.userID;

                if (!userId || !token) {
                    throw new Error('Không tìm thấy userID hoặc token trong localStorage');
                }

                // Fetch user profile theo đúng API endpoint
                const profileResponse = await fetch(
                    `/api/user/profile?userId=${userId}`, // Sửa lại endpoint
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'Accept': '*/*'
                        },
                    }
                );

                if (!profileResponse.ok) {
                    throw new Error(`API error: ${profileResponse.status}`);
                }

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
                try {
                    console.log('Fetching payment history for userId:', userId);

                    const paymentResponse = await fetch(
                        `/api/payments-getByUserId/${userId}`,
                        {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                                'Accept': '*/*'
                            },
                        }
                    );

                    console.log('Payment API response status:', paymentResponse.status);

                    if (!paymentResponse.ok) {
                        console.error(`Error fetching payment history: ${paymentResponse.status}`);
                    } else {
                        const paymentData = await paymentResponse.json();
                        console.log('Payment history data:', paymentData);

                        // Xử lý dữ liệu thanh toán và đảm bảo format đúng
                        let formattedPayments = [];

                        if (Array.isArray(paymentData)) {
                            formattedPayments = paymentData;
                        } else if (paymentData && typeof paymentData === 'object') {
                            if (Array.isArray(paymentData.payments)) {
                                formattedPayments = paymentData.payments;
                            } else if (paymentData[0] && typeof paymentData[0] === 'object') {
                                formattedPayments = paymentData;
                            }
                        }

                        // Cập nhật state với dữ liệu thanh toán đã xử lý
                        setFormData(prev => ({
                            ...prev,
                            payments: formattedPayments || [],
                        }));
                    }
                } catch (paymentError) {
                    console.error('Error in payment history fetch:', paymentError);
                }

                setFormData(prev => ({
                    ...prev,
                    username: profileData.username || '',
                    phone: profileData.phone || '',
                    email: profileData.email || '',
                    dateOfBirth: profileData.dateOfBirth || '',
                    address: profileData.address || '',
                    appointments: appointmentsData || [],
                }));
            } catch (err) {
                setError(err.message);
                console.error('Lỗi khi lấy dữ liệu:', err);
                toast.error('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
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

    const handleOpenVaccineModal = (vaccine, appointment) => {
        setSelectedVaccine(vaccine);
        setSelectedAppointment(appointment);
        setShowVaccineModal(true);
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
                                        <span>Lịch sử tiêm chủng</span>
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
                                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Lịch sử tiêm chủng</h3>
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
                                                    <div key={appointment.appointmentId}
                                                        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                                        <div className="flex flex-col md:flex-row justify-between">
                                                            <div className="mb-3 md:mb-0 w-full">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <h4 className="font-semibold text-lg">{appointment.childrenName}</h4>
                                                                    <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-medium">
                                                                        Hoàn thành
                                                                    </span>
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                                                                    <p className="flex items-center">
                                                                        <FaCalendarAlt className="mr-2 text-blue-500" />
                                                                        <span className="font-medium">Ngày tiêm:</span>{' '}
                                                                        {new Date(appointment.appointmentDate).toLocaleDateString('vi-VN')}
                                                                    </p>
                                                                    <p className="flex items-center">
                                                                        <FaClock className="mr-2 text-blue-500" />
                                                                        <span className="font-medium">Giờ tiêm:</span>{' '}
                                                                        {appointment.timeStart ?
                                                                            (typeof appointment.timeStart === 'string' ?
                                                                                appointment.timeStart :
                                                                                `${String(appointment.timeStart.hour).padStart(2, '0')}:${String(appointment.timeStart.minute).padStart(2, '0')}`) :
                                                                            'Chưa có thông tin'}
                                                                    </p>
                                                                    <p className="flex items-center">
                                                                        <FaCalendarAlt className="mr-2 text-blue-500" />
                                                                        <span className="font-medium">Ngày tạo:</span>{' '}
                                                                        {appointment.createAt ? appointment.createAt : 'Không có thông tin'}
                                                                    </p>
                                                                    <p className="flex items-center">
                                                                        <FaCalendarAlt className="mr-2 text-blue-500" />
                                                                        <span className="font-medium">Ngày cập nhật:</span>{' '}
                                                                        {appointment.updateAt ? appointment.updateAt : 'Không có thông tin'}
                                                                    </p>
                                                                </div>

                                                                {appointment.vaccineDetailsList && appointment.vaccineDetailsList.length > 0 && (
                                                                    <div className="mt-4 border-t pt-3">
                                                                        <div className="flex justify-between items-center mb-2">
                                                                            <h5 className="font-medium text-gray-800">Thông tin vaccine</h5>
                                                                            <button
                                                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                                                                                onClick={() => {
                                                                                    setSelectedVaccine(appointment.vaccineDetailsList[0]);
                                                                                    setSelectedAppointment(appointment);
                                                                                    setShowVaccineModal(true);
                                                                                }}
                                                                            >
                                                                                Xem chi tiết
                                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>

                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                                                            <p className="text-gray-600">
                                                                                <span className="font-medium">Vaccine:</span>{' '}
                                                                                {appointment.vaccineDetailsList[0].doseName}
                                                                            </p>
                                                                            <p className="text-gray-600">
                                                                                <span className="font-medium">Nhà sản xuất:</span>{' '}
                                                                                {appointment.vaccineDetailsList[0].manufacturer}
                                                                            </p>
                                                                            <p className="text-gray-600">
                                                                                <span className="font-medium">Mũi thứ:</span>{' '}
                                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                                    {`${appointment.vaccineDetailsList[0].currentDose}/${appointment.vaccineDetailsList[0].doseRequire}`}
                                                                                </span>
                                                                            </p>
                                                                            <p className="text-blue-600 font-medium">
                                                                                {formatPrice(appointment.vaccineDetailsList[0].price)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-600">Không có Lịch sử tiêm chủng hoàn thành.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'payments' && (
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Lịch sử thanh toán</h3>

                                        {loading ? (
                                            <div className="flex justify-center py-4">
                                                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>
                                        ) : formData.payments && formData.payments.length > 0 ? (
                                            <div className="overflow-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã thanh toán</th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phương thức</th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {formData.payments.map((payment, index) => (
                                                            <tr key={payment.paymentId || index} className="hover:bg-gray-50">
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {payment.paymentId ? payment.paymentId.substring(0, 8) + '...' : 'N/A'}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-blue-600">
                                                                    {formatPrice(payment.amount || 0)}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {payment.paymentMethod || 'Chờ xác nhận'}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                                        ${payment.status === 'Pending'
                                                                            ? 'bg-yellow-100 text-yellow-800'
                                                                            : payment.status === 'completed' || payment.status === 'Completed'
                                                                                ? 'bg-green-100 text-green-800'
                                                                                : 'bg-gray-100 text-gray-800'}`}>
                                                                        {payment.status === 'Pending' ? 'Chờ thanh toán' :
                                                                            payment.status === 'Success' || payment.status === 'Completed' ? 'Đã thanh toán' : payment.status}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {payment.createdAt ? new Date(payment.createdAt).toLocaleString('vi-VN') : 'N/A'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                                <p className="text-lg font-medium text-gray-600">Không có dữ liệu thanh toán</p>
                                                <p className="text-gray-500 mt-2">Lịch sử thanh toán của bạn sẽ hiển thị ở đây</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal hiển thị thông tin vaccine */}
            {showVaccineModal && selectedVaccine && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-4 rounded-t-lg">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                    Chi tiết Vaccine
                                </h3>
                                <button
                                    onClick={() => setShowVaccineModal(false)}
                                    className="text-white hover:text-gray-200 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-xl font-bold text-gray-800">{selectedVaccine.doseName}</h4>
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        Mũi {selectedVaccine.currentDose}/{selectedVaccine.doseRequire}
                                    </span>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div>
                                                <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Thông tin cơ bản</h5>
                                                <div className="mt-2 space-y-2">
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-600">Tên vaccine:</span>
                                                        <span className="font-medium">{selectedVaccine.doseName}</span>
                                                    </p>
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-600">Nhà sản xuất:</span>
                                                        <span className="font-medium">{selectedVaccine.manufacturer}</span>
                                                    </p>
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-600">Liều lượng:</span>
                                                        <span className="font-medium">{selectedVaccine.dosageAmount} mL</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Lịch trình tiêm</h5>
                                                <div className="mt-2 space-y-2">
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-600">Số mũi yêu cầu:</span>
                                                        <span className="font-medium">{selectedVaccine.doseRequire} mũi</span>
                                                    </p>
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-600">Mũi hiện tại:</span>
                                                        <span className="font-medium">{selectedVaccine.currentDose}</span>
                                                    </p>
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-600">Khoảng cách giữa các mũi:</span>
                                                        <span className="font-medium">{selectedVaccine.dateBetweenDoses} ngày</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Thông tin bổ sung</h5>
                                                <div className="mt-2 space-y-2">
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-600">Giá:</span>
                                                        <span className="font-medium text-blue-600">{formatPrice(selectedVaccine.price)}</span>
                                                    </p>
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-600">Độ tuổi yêu cầu:</span>
                                                        <span className="font-medium">{selectedVaccine.ageRequired} tháng</span>
                                                    </p>
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-600">Thời gian tăng cường:</span>
                                                        <span className="font-medium">{selectedVaccine.boosterInterval} tháng</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h5 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Thông tin lịch hẹn</h5>
                                                <div className="mt-2 space-y-2">
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-600">Tên bệnh nhân:</span>
                                                        <span className="font-medium">{selectedAppointment?.childrenName || 'N/A'}</span>
                                                    </p>
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-600">Ngày tiêm:</span>
                                                        <span className="font-medium">{selectedAppointment ? formatDate(selectedAppointment.appointmentDate) : 'N/A'}</span>
                                                    </p>
                                                    <p className="flex justify-between">
                                                        <span className="text-gray-600">Thời gian tiêm:</span>
                                                        <span className="font-medium">
                                                            {selectedAppointment && selectedAppointment.timeStart
                                                                ? (typeof selectedAppointment.timeStart === 'string'
                                                                    ? selectedAppointment.timeStart
                                                                    : `${String(selectedAppointment.timeStart.hour).padStart(2, '0')}:${String(selectedAppointment.timeStart.minute).padStart(2, '0')}`)
                                                                : 'N/A'}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h5 className="text-blue-800 font-medium flex items-center mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Thông tin quan trọng
                                </h5>
                                <p className="text-sm text-blue-700">
                                    Vaccine này cần được tiêm đủ {selectedVaccine.doseRequire} mũi để đạt hiệu quả bảo vệ tối ưu.
                                    Khoảng cách giữa các mũi tiêm là {selectedVaccine.dateBetweenDoses} ngày.
                                </p>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setShowVaccineModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DefaultLayout>
    );
};

export default Profile;