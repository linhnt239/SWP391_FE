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

    const handleLogin = (e) => {
        e.preventDefault();
        if (validateForm()) {
            if (rememberMe) {
                localStorage.setItem('user', JSON.stringify({ email: formValue.email }));
                localStorage.setItem('rememberMe', rememberMe);
            }
            router.push('/');
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
                            <input type="checkbox" checked={rememberMe} onChange={handleRememberMeChange} className="w-4 h-4 mr-2" />
                            <p className="text-gray-600">Remember me</p>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">Đăng nhập</button>
                    </form>
                    <Link href="/register" className="w-full mt-4">
                        <button className="w-full border border-gray-400 text-gray-700 py-3 rounded-lg hover:bg-gray-100">Đăng ký</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
