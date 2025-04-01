'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const initFormValue = {
    email: '',
    password: '',
};

const isEmptyValue = (value) => !value || value.trim().length < 1;

const LoginForm = () => {
    const [formValue, setFormValue] = useState(initFormValue);
    const [formError, setFormError] = useState({});
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedRememberMe = localStorage.getItem('rememberMe');

        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                setFormValue({ email: user.email, password: '' });
                setRememberMe(savedRememberMe === 'true');
            } catch (error) {
                console.error(error);
                localStorage.removeItem('user');
                localStorage.removeItem('rememberMe');
            }
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue((prev) => ({ ...prev, [name]: value }));
    };

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    const validateForm = () => {
        const errors = {};
        if (isEmptyValue(formValue.email)) errors.email = 'Email không được để trống';
        if (isEmptyValue(formValue.password)) errors.password = 'Mật khẩu không được để trống';
        setFormError(errors);
        return Object.keys(errors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const loginData = {
                    email: formValue.email,
                    password: formValue.password,
                };

                const response = await fetch('/api/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loginData),
                });

                const data = await response.json();

                if (data.token) {
                    console.log('Token:', data.token);

                    // Thêm userID vào userData
                    const userData = {
                        email: data.email,
                        username: data.username,
                        role: data.role,
                        userID: data.userID, // Lưu userID từ response
                    };

                    // Lưu vào localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(userData));

                    // Lưu vào cookies
                    document.cookie = `token=${data.token}; path=/`;
                    document.cookie = `user=${JSON.stringify(userData)}; path=/`;

                    if (rememberMe) {
                        localStorage.setItem('rememberMe', 'true');
                    }

                    // Chuyển hướng dựa trên role
                    switch (data.role) {
                        case 'Staff':
                            window.location.href = '/staff';
                            break;
                        case 'Admin':
                            window.location.href = '/admin';
                            break;
                        case 'User':
                            window.location.href = '/';
                            break;
                        default:
                            setFormError({
                                general: 'Tài khoản không có quyền truy cập.',
                            });
                    }
                } else {
                    setFormError({
                        general: data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.',
                    });
                }
            } catch (error) {
                console.error('Lỗi đăng nhập:', error);
                setFormError({
                    general: 'Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại sau.',
                });
            }
        }
    };

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center">
            <div className="max-w-full w-full h-[100%] bg-white rounded-2xl shadow-xl overflow-hidden flex">
                <div className="hidden md:flex md:w-1/2 bg-blue-600 py-10 px-8 items-center justify-center">
                    <div className="text-white text-center">
                        <h2 className="text-3xl font-bold mb-4">Chào mừng trở lại!</h2>
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
                <div className="w-full md:w-1/2 py-10 px-8 flex flex-col justify-center">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-gray-800">Đăng nhập</h1>
                        <p className="text-gray-600 mt-2">Vui lòng nhập thông tin đăng nhập của bạn</p>
                    </div>
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                            <input
                                type="text"
                                name="email"
                                value={formValue.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-colors"
                                placeholder="Nhập email của bạn"
                                required
                                autoComplete="email"
                            />
                            {formError.email && <div className="text-red-500 text-sm mt-1">{formError.email}</div>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Mật khẩu</label>
                            <input
                                type="password"
                                name="password"
                                value={formValue.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border focus:border-blue-500 focus:outline-none transition-colors"
                                placeholder="Nhập mật khẩu của bạn"
                                required
                                autoComplete="current-password"
                            />
                            {formError.password && <div className="text-red-500 text-sm mt-1">{formError.password}</div>}
                        </div>
                        <div className="flex items-center justify-between">
                            <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Đăng nhập
                        </button>
                        {formError.general && <div className="text-red-500 text-sm text-center">{formError.general}</div>}
                    </form>
                    <div className="text-center mt-6">
                        <p className="text-gray-600 text-sm">
                            Chưa có tài khoản?{' '}
                            <Link href="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;