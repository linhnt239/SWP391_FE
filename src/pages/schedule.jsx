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

    const fetchChildren = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/child-get/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Children data:", data);

            if (Array.isArray(data)) {
                setChildren(data);
            } else {
                console.error("Unexpected API response format:", data);
                setChildren([]);
            }
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
                // Nếu chọn "Thêm hồ sơ trẻ mới", reset thông tin trẻ
                setFormData(prev => ({
                    ...prev,
                    childId: 'new',
                    childName: '',
                    dateOfBirth: '',
                    gender: '',
                }));
                setSelectedChild(null);
            } else if (value) {
                // Nếu chọn một đứa trẻ có sẵn
                const child = children.find(c => c.childId === value || c.id === value);
                if (child) {
                    setSelectedChild(child);
                    setFormData(prev => ({
                        ...prev,
                        childId: value,
                        childName: child.childrenName || child.name || '',
                        dateOfBirth: child.dateOfBirth || child.dob || '',
                        gender: child.gender || '',
                    }));
                }
            } else {
                // Nếu không chọn đứa trẻ nào
                setFormData(prev => ({
                    ...prev,
                    childId: '',
                }));
                setSelectedChild(null);
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
            // Chuẩn bị dữ liệu để gửi đi
            const checkoutData = {
                userId: userId,
                childId: formData.childId !== 'new' ? formData.childId : null,
                childInfo: formData.childId === 'new' ? {
                    name: formData.childName,
                    dateOfBirth: formData.dateOfBirth,
                    gender: formData.gender
                } : null,
                vaccines: cartItems.map(item => ({
                    vaccineId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                appointmentInfo: {
                    date: formData.preferredDate,
                    time: formData.preferredTime,
                    note: formData.note
                },
                totalAmount: totalPrice
            };

            console.log('Checkout data:', checkoutData);

            // Gửi request đến API
            const response = await fetch('/api/cart/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(checkoutData)
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Checkout result:', result);

            // Xóa giỏ hàng sau khi đặt lịch thành công
            localStorage.setItem('cart', JSON.stringify([]));
            window.dispatchEvent(new Event('cartUpdated'));

            // Chuyển hướng đến trang xác nhận
            router.push('/confirmation');
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
                                                            <option key={child.childId || child.id} value={child.childId || child.id}>
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
                                                <p className="text-gray-500 mb-2">Bạn chưa có hồ sơ trẻ nào</p>
                                                <Link href="/children-profiles" className="text-blue-600 hover:text-blue-800 font-medium">
                                                    Quản lý hồ sơ trẻ
                                                </Link>
                                            </div>
                                        )}

                                        {/* Form điền thông tin trẻ mới */}
                                        {(children.length === 0 || formData.childId === 'new') && (
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
                                        )}

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
                    ) : (
                        // Bước 2: Thanh toán
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                    <div className="p-6 border-b border-gray-200">
                                        <h2 className="text-xl font-bold text-gray-800">Thanh toán</h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Vui lòng chọn phương thức thanh toán
                                        </p>
                                    </div>

                                    <div className="p-6">
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin đơn hàng</h3>

                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm text-gray-600">Người đăng ký:</p>
                                                        <p className="font-medium">{formData.parentName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Số điện thoại:</p>
                                                        <p className="font-medium">{formData.parentPhone}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Người được tiêm:</p>
                                                        <p className="font-medium">{formData.useExistingProfile && selectedChild ? (selectedChild.childrenName || selectedChild.name) : formData.childName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Ngày sinh:</p>
                                                        <p className="font-medium">{formatDate(formData.useExistingProfile && selectedChild ? (selectedChild.dateOfBirth || selectedChild.dob) : formData.dateOfBirth)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Ngày tiêm:</p>
                                                        <p className="font-medium">{formatDate(formData.preferredDate)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Giờ tiêm:</p>
                                                        <p className="font-medium">{formData.preferredTime}</p>
                                                    </div>
                                                </div>

                                                {formData.note && (
                                                    <div className="mt-4">
                                                        <p className="text-sm text-gray-600">Ghi chú:</p>
                                                        <p className="font-medium">{formData.note}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Phương thức thanh toán</h3>

                                            <div className="space-y-3">
                                                <label className="block p-4 border border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="paymentMethod"
                                                            value="cash"
                                                            defaultChecked
                                                            className="form-radio h-4 w-4 text-blue-600"
                                                        />
                                                        <div className="ml-3">
                                                            <span className="font-medium text-gray-800">Thanh toán tại trung tâm</span>
                                                            <p className="text-sm text-gray-600 mt-1">Thanh toán trực tiếp khi đến tiêm</p>
                                                        </div>
                                                    </div>
                                                </label>

                                                <label className="block p-4 border border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="paymentMethod"
                                                            value="bank"
                                                            className="form-radio h-4 w-4 text-blue-600"
                                                        />
                                                        <div className="ml-3">
                                                            <span className="font-medium text-gray-800">Chuyển khoản ngân hàng</span>
                                                            <p className="text-sm text-gray-600 mt-1">Chuyển khoản trước khi đến tiêm</p>
                                                        </div>
                                                    </div>
                                                </label>

                                                <label className="block p-4 border border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name="paymentMethod"
                                                            value="momo"
                                                            className="form-radio h-4 w-4 text-blue-600"
                                                        />
                                                        <div className="ml-3">
                                                            <span className="font-medium text-gray-800">Thanh toán qua Momo</span>
                                                            <p className="text-sm text-gray-600 mt-1">Thanh toán qua ví điện tử Momo</p>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex justify-between mt-8">
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors"
                                            >
                                                Quay lại
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleCheckout}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                            >
                                                Xác nhận đặt lịch
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tóm tắt đơn hàng */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24">
                                    <div className="p-6 border-b border-gray-200">
                                        <h2 className="text-xl font-bold text-gray-800">Tóm tắt đơn hàng</h2>
                                    </div>

                                    <div className="p-6">
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

                                            <div className="pt-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-gray-700">Tổng tiền:</span>
                                                    <span className="text-xl font-bold text-blue-600">{formatPrice(totalPrice)}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">Đã bao gồm VAT</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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