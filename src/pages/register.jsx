import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { toast } from 'react-toastify';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        phone: '',
        dateOfBirth: '',
        otp: '',
    });

    const [errors, setErrors] = useState({});
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        const selectedDate = new Date(formData.dateOfBirth);

        if (!formData.username) newErrors.username = 'Tên người dùng là bắt buộc';
        if (!formData.email) {
            newErrors.email = 'Email không được để trống';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Email không hợp lệ';
            }
        }
        if (!formData.password) {
            newErrors.password = 'Mật khẩu không được để trống';
        } else {
            const passwordRegex = /^(?=.*[A-Z]).{6,12}$/;
            if (!passwordRegex.test(formData.password)) {
                newErrors.password = 'Mật khẩu phải có độ dài 6-12 ký tự và ít nhất một chữ viết hoa';
            }
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
        }
        if (!formData.address) newErrors.address = 'Địa chỉ là bắt buộc';
        if (!formData.phone) {
            newErrors.phone = 'Số điện thoại là bắt buộc';
        } else {
            const phoneRegex = /^0\d{9}$/;
            if (!phoneRegex.test(formData.phone)) {
                newErrors.phone = 'Vui lòng nhập lại số điện thoại (phải có 9 chữ số và bắt đầu bằng 0)';
            }
        }
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Ngày sinh là bắt buộc';
        } else if (selectedDate > today) {
            newErrors.dateOfBirth = 'Ngày sinh không hợp lệ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOtp = async () => {
        if (!formData.email) {
            toast.error('Vui lòng nhập email để gửi OTP', {
                position: "top-right",
                autoClose: 5000,
            });
            setErrors({ ...errors, email: 'Email không được để trống' });
            return false;
        }

        try {
            const response = await fetch(`/api/user/send-otp?email=${encodeURIComponent(formData.email)}`, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                },
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Gửi OTP thất bại');
            }

            const responseText = await response.text();
            toast.success(responseText, {
                position: "top-right",
                autoClose: 3000,
            });

            setShowOtpPopup(true);
            return true;
        } catch (error) {
            toast.error('Gửi OTP thất bại: ' + error.message, {
                position: "top-right",
                autoClose: 5000,
            });
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const otpSent = await handleSendOtp();
        if (!otpSent) {
            return;
        }
    };

    const handleOtpSubmit = async () => {
        if (!formData.otp) {
            toast.error('Vui lòng nhập OTP', {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        try {
            const response = await fetch('/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Đăng ký thất bại');
            }

            const data = await response.json();

            toast.success('Đăng ký thành công! Chuyển hướng đến trang đăng nhập...', {
                position: "top-right",
                autoClose: 2000,
            });

            console.log('Đăng ký thành công:', data);

            setFormData({
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                address: '',
                phone: '',
                dateOfBirth: '',
                otp: '',
            });

            setShowOtpPopup(false);

            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error) {
            toast.error('Đăng ký không thành công: ' + error.message, {
                position: "top-right",
                autoClose: 5000,
            });
            console.error('Lỗi khi đăng ký:', error.message);
        }
    };

    const handleBackToLogin = () => {
        router.push('/login');
    };

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center">
            <div className="max-w-8xl w-full h-[100vh] bg-white shadow-xl overflow-hidden flex flex-col md:flex-row">
                <div className="hidden md:flex md:w-1/2 bg-blue-600 py-10 px-8 items-center justify-center">
                    <div className="text-white text-center">
                        <h2 className="text-3xl font-bold mb-4">Chào mừng bạn đến!</h2>
                        <p className="mb-6">Hệ thống theo dõi lịch tiêm chủng cho trẻ em</p>
                        <Image
                            src="/vaccine-icon.jpeg"
                            width={300}
                            height={300}
                            className="mx-auto object-contain rounded-lg"
                            alt="Vaccine"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/2 py-6 px-8 flex flex-col">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Đăng ký</h1>
                        <p className="text-gray-600 mt-2">Vui lòng nhập thông tin đăng ký của bạn</p>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Tên người dùng</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="Nhập tên người dùng"
                                    required
                                />
                                {errors.username && <div className="text-red-500 text-sm mt-1">{errors.username}</div>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="Nhập email của bạn"
                                    required
                                />
                                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Mật khẩu</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="Nhập mật khẩu của bạn (6-12 ký tự, ít nhất 1 chữ hoa)"
                                    required
                                />
                                {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Xác nhận mật khẩu</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="Xác nhận mật khẩu"
                                    required
                                />
                                {errors.confirmPassword && <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="Nhập địa chỉ của bạn"
                                    required
                                />
                                {errors.address && <div className="text-red-500 text-sm mt-1">{errors.address}</div>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Số điện thoại</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="Nhập số điện thoại"
                                    required
                                />
                                {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Ngày sinh</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-colors"
                                    required
                                />
                                {errors.dateOfBirth && <div className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</div>}
                            </div>
                        </form>
                    </div>

                    <div className="mt-6 space-y-4">
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Đăng ký
                        </button>
                        <button
                            type="button"
                            onClick={handleBackToLogin}
                            className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                        >
                            Quay lại đăng nhập
                        </button>
                    </div>
                </div>
            </div>

            {showOtpPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Nhập OTP</h2>
                        <p className="mb-4">Vui lòng nhập mã OTP đã được gửi đến email của bạn.</p>
                        <input
                            type="text"
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-colors mb-4"
                            placeholder="Nhập mã OTP"
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowOtpPopup(false)}
                                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleOtpSubmit}
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;