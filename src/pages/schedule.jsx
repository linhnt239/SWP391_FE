import React, { useState, useEffect } from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { useRouter } from 'next/router';
import Link from 'next/link';


const Schedule = () => {
    const router = useRouter();
    const [cartItems, setCartItems] = useState([]);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [step, setStep] = useState(1); // 1: Thông tin người tiêm, 2: Thanh toán
    const [selectedChild, setSelectedChild] = useState(null);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const [formData, setFormData] = useState({
        childId: '',
        childName: '',
        dateOfBirth: '',
        gender: '',
        parentName: '',
        parentPhone: '',
        preferredDate: '',
        preferredTime: '',
        note: '',
        useExistingProfile: true,
    });

    // Lấy thông tin người dùng từ localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');

        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                setUserId(user.userId || user.userID || user.id);
                setFormData(prev => ({
                    ...prev,
                    parentName: user.username || user.name || '',
                    parentPhone: user.phone || user.phoneNumber || '',
                }));
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }

        if (savedToken) {
            setToken(savedToken);
        }

        // Lấy giỏ hàng từ localStorage
        try {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartItems(cart);

            // Tính tổng tiền
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            setTotalPrice(total);
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    }, []);

    // Lấy danh sách trẻ từ API
    useEffect(() => {
        if (userId && token) {
            fetchChildren();
        } else {
            setLoading(false);
        }
    }, [userId, token]);

    useEffect(() => {
        // Kiểm tra URL parameters khi component được mount
        const urlParams = new URLSearchParams(window.location.search);
        const vnp_ResponseCode = urlParams.get('vnp_ResponseCode');

        if (vnp_ResponseCode === "00") {
            setPaymentSuccess(true);
            setStep(2); // Chuyển đến bước 3

            // Xóa giỏ hàng từ localStorage sau khi thanh toán thành công
            localStorage.removeItem('cart');

            // Xóa URL parameters
            window.history.replaceState({}, '', '/schedule');
        }
    }, []);

    const fetchChildren = async () => {
        try {
            setLoading(true);
            console.log("Fetching children with token:", token);
            console.log("User ID:", userId);

            // Cập nhật URL endpoint mới
            const response = await fetch(`/api/child-get/${userId}/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API Error Response:", errorText);
                throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            console.log("Children data:", data);

            // Kiểm tra cấu trúc dữ liệu trả về và cập nhật state
            let processedChildren = [];

            if (Array.isArray(data)) {
                console.log("Data is an array");
                processedChildren = data;
            } else if (data && typeof data === 'object') {
                console.log("Data is an object");
                // Kiểm tra các trường phổ biến có thể chứa mảng trẻ em
                if (data.children && Array.isArray(data.children)) {
                    processedChildren = data.children;
                } else if (data.data && Array.isArray(data.data)) {
                    processedChildren = data.data;
                } else if (data.results && Array.isArray(data.results)) {
                    processedChildren = data.results;
                } else if (data.items && Array.isArray(data.items)) {
                    processedChildren = data.items;
                } else {
                    // Nếu không tìm thấy mảng, kiểm tra xem đối tượng có phải là một hồ sơ trẻ không
                    if (data.childrenId || data.childrenName) {
                        processedChildren = [data];
                    } else {
                        // Log toàn bộ cấu trúc dữ liệu để debug
                        console.log("Unknown data structure:", JSON.stringify(data, null, 2));
                    }
                }
            }

            console.log("Processed children:", processedChildren);
            setChildren(processedChildren);
        } catch (error) {
            console.error('Error fetching children:', error);
            setChildren([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        // Nếu chọn một đứa trẻ từ danh sách, cập nhật thông tin
        if (name === 'childId') {
            if (value === 'new') {
                setFormData(prev => ({
                    ...prev,
                    childId: 'new',
                    childName: '',
                    dateOfBirth: '',
                    gender: '',
                    useExistingProfile: false
                }));
                setSelectedChild(null);
            } else if (value) {
                // Sửa lại phần tìm kiếm trẻ
                const selectedChildId = value.split(' - ')[0]; // Lấy phần ID từ giá trị select
                const child = children.find(c =>
                    c.childrenId === selectedChildId ||
                    c.id === selectedChildId
                );

                console.log("Selected Child ID:", selectedChildId);
                console.log("Available Children:", children);
                console.log("Found child:", child);

                if (child) {
                    setSelectedChild(child);
                    setFormData(prev => ({
                        ...prev,
                        childId: selectedChildId,
                        useExistingProfile: true,
                        childName: child.childrenName || child.name,
                        dateOfBirth: child.dateOfBirth || child.dob,
                        gender: child.gender
                    }));
                }
            }
        }

        // Nếu chuyển đổi giữa sử dụng hồ sơ có sẵn và tạo mới
        if (name === 'useExistingProfile') {
            if (checked) {
                // Reset form về trạng thái ban đầu khi chọn sử dụng hồ sơ có sẵn
                setFormData(prev => ({
                    ...prev,
                    childId: '',
                    childName: '',
                    dateOfBirth: '',
                    gender: '',
                    useExistingProfile: true,
                }));
                setSelectedChild(null);
            } else {
                // Reset childId khi chọn tạo hồ sơ mới
                setFormData(prev => ({
                    ...prev,
                    childId: '',
                    useExistingProfile: false,
                }));
                setSelectedChild(null);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra nếu đã chọn trẻ hoặc điền đầy đủ thông tin
        if (formData.childId === '') {
            alert('Vui lòng chọn trẻ từ hồ sơ hoặc thêm hồ sơ trẻ mới!');
            return;
        }

        if (formData.childId === 'new' && (!formData.childName || !formData.dateOfBirth || !formData.gender)) {
            alert('Vui lòng điền đầy đủ thông tin trẻ!');
            return;
        }

        if (!formData.preferredDate || !formData.preferredTime) {
            alert('Vui lòng chọn ngày và giờ tiêm!');
            return;
        }

        if (!acceptTerms) {
            alert('Vui lòng đồng ý với điều khoản và điều kiện!');
            return;
        }

        // Chuyển sang bước thanh toán
        setStep(2);
    };

    const handleCheckout = async () => {
        try {
            const checkoutData = {
                childrenName: selectedChild ? selectedChild.childrenName : formData.childName,
                childrenGender: selectedChild ? selectedChild.gender : formData.gender,
                dateOfBirth: selectedChild ? selectedChild.dateOfBirth : formData.dateOfBirth,
                medicalIssue: "None",
                appointmentDate: formData.preferredDate,
                timeStart: formData.preferredTime,
                note: formData.note || ""
            };

            // Lưu thông tin lịch hẹn vào localStorage
            localStorage.setItem('lastAppointment', JSON.stringify({
                childName: checkoutData.childrenName,
                appointmentDate: formData.preferredDate,
                appointmentTime: formData.preferredTime
            }));

            const response = await fetch(`/api/cart/checkout?userId=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(checkoutData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const result = await response.text();

            if (result && result.startsWith('http')) {
                // Sau khi API trả về URL thanh toán thành công
                // Bạn có thể thêm mã để xóa giỏ hàng ở đây nếu muốn xóa trước khi chuyển hướng
                // localStorage.removeItem('cart');

                window.location.href = result;
            } else {
                throw new Error('Invalid payment URL received');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            alert(`Đã xảy ra lỗi khi thanh toán: ${error.message}`);
        }
    };

    // Định dạng giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // Định dạng ngày tháng
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    // Tính tuổi từ ngày sinh
    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return '';
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 1) {
            // Tính số tháng
            let months = today.getMonth() - birthDate.getMonth();
            if (months < 0) {
                months += 12;
            }
            if (today.getDate() < birthDate.getDate()) {
                months--;
            }
            return `${months} tháng`;
        }

        return `${age} tuổi`;
    };

    const renderStep3 = () => {
        if (paymentSuccess) {
            const lastAppointment = JSON.parse(localStorage.getItem('lastAppointment') || '{}');

            return (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-center mb-6">
                        <div className="rounded-full bg-green-100 p-3 mx-auto w-fit mb-4">
                            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h2>
                        <p className="text-gray-600">Cảm ơn bạn đã đặt lịch tiêm chủng.</p>
                    </div>

                    {/* Thông tin lịch hẹn */}
                    <div className="bg-blue-50 rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-semibold text-blue-900 mb-4">Thông tin lịch tiêm</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Tên trẻ:</span>
                                <span className="font-medium">{lastAppointment.childName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Ngày tiêm:</span>
                                <span className="font-medium">{lastAppointment.appointmentDate}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Giờ tiêm:</span>
                                <span className="font-medium">{lastAppointment.appointmentTime}</span>
                            </div>
                        </div>
                    </div>

                    {/* Lưu ý quan trọng */}
                    <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-yellow-800 mb-3">Lưu ý quan trọng</h3>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Vui lòng đến trước giờ hẹn 15 phút
                            </li>
                            <li className="flex items-start">
                                <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Mang theo sổ tiêm chủng (nếu có)
                            </li>
                        </ul>
                    </div>

                    {/* Nút điều hướng */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push('/appointments')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Xem lịch hẹn của tôi
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                        >
                            Về trang chủ
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Xác nhận thông tin</h2>
                {/* Hiển thị thông tin đã chọn */}
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold">Thông tin trẻ:</h3>
                        <p>Tên: {selectedChild ? selectedChild.childrenName : formData.childName}</p>
                        <p>Giới tính: {selectedChild ? selectedChild.gender : formData.gender}</p>
                        <p>Ngày sinh: {selectedChild ? selectedChild.dateOfBirth : formData.dateOfBirth}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Thời gian:</h3>
                        <p>Ngày: {formData.preferredDate}</p>
                        <p>Giờ: {formData.preferredTime}</p>
                    </div>
                    {formData.note && (
                        <div>
                            <h3 className="font-semibold">Ghi chú:</h3>
                            <p>{formData.note}</p>
                        </div>
                    )}
                </div>

                {/* Nút điều hướng */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={() => setStep(1)}
                        className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                    >
                        Quay lại
                    </button>
                    <button
                        onClick={handleCheckout}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Xác nhận và thanh toán
                    </button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <DefaultLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <div className="bg-gray-100 min-h-screen py-8">
                <div className="container mx-auto px-4">
                    {/* Tiêu đề và các bước */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-blue-900 mb-6">Đăng ký mũi tiêm</h1>
                        <div className="flex justify-center items-center mb-6">
                            <div className={`flex flex-col items-center ${step === 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                                    1
                                </div>
                                <span className="text-sm font-medium">Thông tin người được tiêm</span>
                            </div>
                            <div className={`w-16 h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                            <div className={`flex flex-col items-center ${step === 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                                    2
                                </div>
                                <span className="text-sm font-medium">Thanh toán</span>
                            </div>
                            <div className="w-16 h-1 mx-2 bg-gray-300"></div>
                            <div className="flex flex-col items-center text-gray-500">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-gray-300">
                                    3
                                </div>
                                <span className="text-sm font-medium">Xác nhận từ chúng tôi</span>
                            </div>
                        </div>
                    </div>

                    {step === 1 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Form thông tin người tiêm */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                    <div className="p-6 border-b border-gray-200">
                                        <h2 className="text-xl font-bold text-gray-800">Thông tin người được tiêm</h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Vui lòng điền đầy đủ thông tin để đăng ký tiêm chủng
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="p-6">
                                        {/* Lựa chọn sử dụng hồ sơ có sẵn hoặc tạo mới */}
                                        {children.length > 0 && (
                                            <div className="mb-6">
                                                <div className="flex items-center space-x-4">
                                                    <label className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="useExistingProfile"
                                                            checked={formData.useExistingProfile}
                                                            onChange={() => setFormData({ ...formData, useExistingProfile: true })}
                                                            className="form-radio h-4 w-4 text-blue-600"
                                                        />
                                                        <span className="ml-2">Sử dụng hồ sơ có sẵn</span>
                                                    </label>
                                                    <label className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="useExistingProfile"
                                                            checked={!formData.useExistingProfile}
                                                            onChange={() => setFormData({ ...formData, useExistingProfile: false })}
                                                            className="form-radio h-4 w-4 text-blue-600"
                                                        />
                                                        <span className="ml-2">Tạo hồ sơ mới</span>
                                                    </label>
                                                </div>
                                            </div>
                                        )}

                                        {/* Chọn hồ sơ có sẵn */}
                                        {formData.useExistingProfile && children.length > 0 ? (
                                            <div className="mb-6">
                                                <label htmlFor="childId" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Chọn hồ sơ trẻ <span className="text-red-500">*</span>
                                                </label>

                                                <div className="space-y-4">
                                                    <select
                                                        id="childId"
                                                        name="childId"
                                                        value={formData.childId}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="">-- Chọn hồ sơ trẻ --</option>
                                                        {children.map(child => (
                                                            <option
                                                                key={child.childrenId || child.id}
                                                                value={child.childrenId || child.id}
                                                            >
                                                                {child.childrenName || child.name} - {formatDate(child.dateOfBirth || child.dob)}
                                                            </option>
                                                        ))}
                                                        <option value="new">+ Thêm hồ sơ trẻ mới</option>
                                                    </select>

                                                    {selectedChild && formData.childId !== 'new' ? (
                                                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                                            <h3 className="font-medium text-blue-800 mb-2">Thông tin trẻ đã chọn:</h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-sm text-gray-600">Họ tên:</p>
                                                                    <p className="font-medium">{selectedChild.childrenName || selectedChild.name}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-600">Ngày sinh:</p>
                                                                    <p className="font-medium">{formatDate(selectedChild.dateOfBirth || selectedChild.dob)}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-600">Tuổi:</p>
                                                                    <p className="font-medium">{calculateAge(selectedChild.dateOfBirth || selectedChild.dob)}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-600">Giới tính:</p>
                                                                    <p className="font-medium">{selectedChild.gender === 'male' ? 'Nam' : 'Nữ'}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 border border-dashed border-gray-300 rounded-lg">
                                                <Link href="/children-profiles" className="text-blue-600 hover:text-blue-800 font-medium">
                                                    Quản lý hồ sơ trẻ
                                                </Link>
                                            </div>
                                        )}

                                        {/* Form điền thông tin trẻ mới */}
                                        {/* {(children.length === 0 || formData.childId === 'new') && (
                                            <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <h3 className="font-medium text-gray-800 mb-2">
                                                    {children.length === 0 ? 'Thông tin trẻ' : 'Thêm hồ sơ trẻ mới'}
                                                </h3>

                                                <div>
                                                    <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Họ tên trẻ <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="childName"
                                                        name="childName"
                                                        value={formData.childName}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Nhập họ tên trẻ"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Ngày tháng năm sinh <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id="dateOfBirth"
                                                        name="dateOfBirth"
                                                        value={formData.dateOfBirth}
                                                        onChange={handleChange}
                                                        required
                                                        max={new Date().toISOString().split('T')[0]}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Giới tính <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="flex space-x-4">
                                                        <label className="inline-flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="gender"
                                                                value="male"
                                                                checked={formData.gender === 'male'}
                                                                onChange={handleChange}
                                                                required
                                                                className="form-radio h-4 w-4 text-blue-600"
                                                            />
                                                            <span className="ml-2">Nam</span>
                                                        </label>
                                                        <label className="inline-flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="gender"
                                                                value="female"
                                                                checked={formData.gender === 'female'}
                                                                onChange={handleChange}
                                                                required
                                                                className="form-radio h-4 w-4 text-blue-600"
                                                            />
                                                            <span className="ml-2">Nữ</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                {formData.childId === 'new' && (
                                                    <div className="flex items-center justify-between pt-2">
                                                        <p className="text-sm text-gray-600">
                                                            Hồ sơ trẻ mới sẽ được lưu vào tài khoản của bạn
                                                        </p>
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, childId: '' })}
                                                            className="text-sm text-blue-600 hover:text-blue-800"
                                                        >
                                                            Quay lại
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )} */}

                                        <div className="border-t border-gray-200 pt-6 mt-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin người đăng ký</h3>

                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Họ tên người đăng ký <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="parentName"
                                                        name="parentName"
                                                        value={formData.parentName}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Nhập họ tên người đăng ký"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Số điện thoại <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        id="parentPhone"
                                                        name="parentPhone"
                                                        value={formData.parentPhone}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Nhập số điện thoại"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 pt-6 mt-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin lịch tiêm</h3>

                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Ngày tiêm <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id="preferredDate"
                                                        name="preferredDate"
                                                        value={formData.preferredDate}
                                                        onChange={handleChange}
                                                        required
                                                        min={new Date().toISOString().split('T')[0]}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Giờ tiêm <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        id="preferredTime"
                                                        name="preferredTime"
                                                        value={formData.preferredTime}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="">-- Chọn giờ tiêm --</option>
                                                        <option value="08:00">08:00 - 09:00</option>
                                                        <option value="09:00">09:00 - 10:00</option>
                                                        <option value="10:00">10:00 - 11:00</option>
                                                        <option value="13:30">13:30 - 14:30</option>
                                                        <option value="14:30">14:30 - 15:30</option>
                                                        <option value="15:30">15:30 - 16:30</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Ghi chú
                                                    </label>
                                                    <textarea
                                                        id="note"
                                                        name="note"
                                                        value={formData.note}
                                                        onChange={handleChange}
                                                        rows="3"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Nhập ghi chú nếu có"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={acceptTerms}
                                                    onChange={() => setAcceptTerms(!acceptTerms)}
                                                    className="form-checkbox h-4 w-4 text-blue-600"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">
                                                    Tôi đã đọc và đồng ý với{' '}
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowTerms(true)}
                                                        className="text-blue-600 hover:text-blue-800 underline"
                                                    >
                                                        điều khoản và điều kiện
                                                    </button>
                                                </span>
                                            </label>
                                        </div>

                                        <div className="mt-8 flex justify-end">
                                            <button
                                                type="submit"
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                            >
                                                Xem điều khoản và thanh toán
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Thông tin giỏ hàng */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24">
                                    <div className="p-6 border-b border-gray-200">
                                        <h2 className="text-xl font-bold text-gray-800">Danh sách vaccine ({cartItems.length})</h2>
                                    </div>

                                    <div className="p-6">
                                        {cartItems.length === 0 ? (
                                            <div className="text-center py-4">
                                                <p className="text-gray-500">Không có vaccine nào trong giỏ hàng</p>
                                                <Link href="/services" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                                                    Xem danh sách vaccine
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {cartItems.map((item) => (
                                                    <div key={item.id} className="flex justify-between pb-4 border-b border-gray-100">
                                                        <div>
                                                            <h3 className="font-medium text-gray-800">{item.name}</h3>
                                                            <p className="text-sm text-gray-600">Số mũi: {item.doses}</p>
                                                        </div>
                                                        <div className="text-blue-600 font-medium">
                                                            {formatPrice(item.price)}
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className="pt-4 border-t border-gray-200">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium text-gray-700">Tổng tiền:</span>
                                                        <span className="text-xl font-bold text-blue-600">{formatPrice(totalPrice)}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">Đã bao gồm VAT</p>
                                                </div>

                                                <div className="pt-4">
                                                    <Link href="/cart" className="block text-center w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-lg font-medium transition-colors">
                                                        Chỉnh sửa giỏ hàng
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : renderStep3()}
                </div>
            </div>

            {/* Modal điều khoản và điều kiện */}
            {showTerms && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Điều khoản và điều kiện</h2>
                            <button
                                onClick={() => setShowTerms(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="prose max-w-none">
                                <h3>CHÍNH SÁCH VÀ ĐIỀU KIỆN ĐĂNG KÝ & SẮP XẾP ƯU TIÊN</h3>

                                <p>Khi đăng ký tiêm chủng tại hệ thống tiêm chủng, quý khách vui lòng lưu ý một số điều kiện sau:</p>

                                <ol>
                                    <li>
                                        <strong>Đăng ký thông tin chính xác:</strong> Quý khách cần cung cấp thông tin chính xác và đầy đủ của người được tiêm. Hệ thống chỉ thực hiện tiêm chủng cho khách hàng có thông tin đăng ký trùng khớp hoàn toàn với thông tin cung cấp.
                                    </li>
                                    <li>
                                        <strong>Khám sàng lọc trước tiêm:</strong> Tất cả người được tiêm đều phải được khám sàng lọc trước khi tiêm để đảm bảo an toàn. Kết quả khám sàng lọc sẽ quyết định việc tiêm chủng có được thực hiện hay không.
                                    </li>
                                    <li>
                                        <strong>Thời gian chờ:</strong> Thời gian chờ đợi có thể kéo dài tùy thuộc vào số lượng khách hàng. Quý khách nên đến sớm hơn 15-30 phút so với giờ hẹn.
                                    </li>
                                    <li>
                                        <strong>Theo dõi sau tiêm:</strong> Người được tiêm cần được theo dõi ít nhất 30 phút tại trung tâm sau khi tiêm để đảm bảo không có phản ứng bất thường.
                                    </li>
                                    <li>
                                        <strong>Hủy/đổi lịch:</strong> Nếu quý khách muốn hủy hoặc thay đổi lịch tiêm, vui lòng thông báo trước ít nhất 24 giờ.
                                    </li>
                                    <li>
                                        <strong>Thanh toán:</strong> Quý khách có thể thanh toán trực tiếp tại trung tâm hoặc qua các phương thức thanh toán trực tuyến được cung cấp.
                                    </li>
                                </ol>

                                <p>Bằng việc đồng ý với các điều khoản này, quý khách xác nhận đã đọc, hiểu và chấp nhận tất cả các điều kiện nêu trên.</p>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => {
                                        setAcceptTerms(true);
                                        setShowTerms(false);
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Tôi đã đọc và đồng ý
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DefaultLayout>
    );
};

export default Schedule;