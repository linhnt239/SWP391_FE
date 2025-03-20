import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Sử dụng useRouter từ Next.js
import Image from 'next/image'; // Sử dụng Image từ Next.js để tối ưu hình ảnh

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        phone: '',
        dateOfBirth: '',
    });

    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const router = useRouter(); // Khởi tạo useRouter

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Xóa lỗi khi người dùng chỉnh sửa
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        const selectedDate = new Date(formData.dateOfBirth);

        // Kiểm tra các trường bắt buộc
        if (!formData.username) newErrors.username = 'Tên người dùng là bắt buộc';
        if (!formData.email) newErrors.email = 'Email không được để trống';
        if (!formData.password) newErrors.password = 'Mật khẩu không được để trống';
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
        }
        if (!formData.address) newErrors.address = 'Địa chỉ là bắt buộc';
        if (!formData.phone) {
            newErrors.phone = 'Số điện thoại là bắt buộc';
        } else {
            // Validate số điện thoại: 9 chữ số, bắt đầu bằng 0
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Xóa thông báo trước khi gửi yêu cầu

        if (!validateForm()) {
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
            setMessage('Đăng ký thành công!');
            console.log('Đăng ký thành công:', data);
            // Xóa form sau khi đăng ký thành công
            setFormData({
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                address: '',
                phone: '',
                dateOfBirth: '',
            });
            // Điều hướng về trang đăng nhập sau 2 giây
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error) {
            setMessage('Đăng ký không thành công, vui lòng kiểm tra lại thông tin.');
            console.error('Lỗi khi đăng ký:', error.message);
        }
    };

    // Hàm xử lý nút "Quay lại"
    const handleBackToLogin = () => {
        router.push('/login'); // Điều hướng về trang đăng nhập
    };

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center">
            <div className="max-w-8xl w-full h-[100vh] bg-white shadow-xl overflow-hidden flex flex-col md:flex-row">
                {/* Phần bên trái - Hình ảnh */}
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

                {/* Phần bên phải - Form */}
                <div className="w-full md:w-1/2 py-6 px-8 flex flex-col">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Đăng ký</h1>
                        <p className="text-gray-600 mt-2">Vui lòng nhập thông tin đăng ký của bạn</p>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Tên người dùng */}
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

                            {/* Email */}
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="Nhập email của bạn"
                                    required
                                />
                                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                            </div>

                            {/* Mật khẩu */}
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Mật khẩu</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="Nhập mật khẩu của bạn"
                                    required
                                />
                                {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                            </div>

                            {/* Xác nhận mật khẩu */}
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

                            {/* Địa chỉ */}
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

                            {/* Số điện thoại */}
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

                            {/* Ngày sinh */}
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

                    {/* Nút Đăng ký và Quay lại */}
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
                        {message && <div className="text-red-500 text-sm text-center mt-4">{message}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;