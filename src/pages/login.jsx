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
const isEmailValid = (email) =>
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

const LoginForm = () => {
    const [formValue, setFormValue] = useState(initFormValue);
    const [formError, setFormError] = useState({});
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

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
        if (isEmptyValue(formValue.email)) errors.email = 'Email is required';
        else if (!isEmailValid(formValue.email)) errors.email = 'Email is invalid';
        if (isEmptyValue(formValue.password)) errors.password = 'Password is required';
        setFormError(errors);
        return Object.keys(errors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                // Placeholder cho API đăng nhập - Thay bằng API thực tế của bạn
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formValue.email, password: formValue.password }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Giả định API trả về { id, email, name, avatar }
                    const userData = {
                        id: data.id,
                        email: data.email,
                        name: data.name,
                        avatar: data.avatar || 'https://via.placeholder.com/40', // Lấy avatar từ API, mặc định placeholder nếu không có
                    };
                    login(userData);
                    if (rememberMe) {
                        localStorage.setItem('user', JSON.stringify(userData));
                        localStorage.setItem('rememberMe', rememberMe);
                    }
                    router.push('/');
                } else {
                    setFormError({ ...formError, general: data.message || 'Đăng nhập thất bại' });
                }
            } catch (error) {
                console.error('Lỗi:', error);
                setFormError({ ...formError, general: 'Có lỗi xảy ra, vui lòng thử lại' });
            }
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg flex w-3/4 max-w-4xl">
                <div className="w-1/2 hidden md:flex items-center justify-center p-6">
                    <Image src="/vaccine-icon.jpeg" width={300} height={300} className="object-contain" alt="Vaccine" />
                </div>
                <div className="w-full md:w-1/2 p-10 flex flex-col items-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Child Vaccine Schedule Tracking System</h1>
                    <form className="w-full" onSubmit={handleLogin}>
                        <div className="mb-4">
                            <input
                                type="email"
                                name="email"
                                value={formValue.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full p-3 border rounded-lg"
                                required
                                autoComplete="email"
                            />
                            {formError.email && <div className="text-red-500 text-sm mt-1">{formError.email}</div>}
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                name="password"
                                value={formValue.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full p-3 border rounded-lg"
                                required
                                autoComplete="current-password"
                            />
                            {formError.password && <div className="text-red-500 text-sm mt-1">{formError.password}</div>}
                        </div>
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={handleRememberMeChange}
                                className="w-4 h-4 mr-2"
                            />
                            <p className="text-gray-600">Remember me</p>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                            Đăng nhập
                        </button>
                        {formError.general && <div className="text-red-500 text-sm mt-2 text-center">{formError.general}</div>}
                    </form>
                    <Link href="/register" className="w-full mt-4">
                        <button className="w-full border border-gray-400 text-gray-700 py-3 rounded-lg hover:bg-gray-100">
                            Đăng ký
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;