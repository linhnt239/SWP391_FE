import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const router = useRouter();

    const validateForm = () => {
        const newErrors = {};
        // Validate email
        if (!email) {
            newErrors.email = 'Email không được để trống';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newErrors.email = 'Email không hợp lệ';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Sửa lại endpoint - truyền email như query parameter thay vì trong body
            const response = await fetch(`/api/auth/forgot-password?email=${encodeURIComponent(email)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                }
            });

            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error('Không có quyền truy cập. Vui lòng kiểm tra lại email.');
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Lỗi ${response.status}: Không thể gửi yêu cầu`);
            }

            const data = await response.json().catch(() => ({}));

            toast.success('Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!', {
                position: "top-right",
                autoClose: 5000
            });

            // Chuyển đến trang xác thực OTP với email đã nhập
            router.push({
                pathname: '/verify-otp',
                query: { email }
            });
        } catch (error) {
            toast.error(error.message || 'Không thể gửi yêu cầu đặt lại mật khẩu', {
                position: "top-right",
                autoClose: 5000
            });
            console.error('Lỗi khi gửi yêu cầu đặt lại mật khẩu:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Panel - Decorative Section */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-r from-blue-700 to-blue-500 text-white p-10 flex-col justify-center items-center">
                <div className="max-w-md text-center">
                    <div className="mb-8">
                        <Image
                            src="/vaccine-icon.jpeg"
                            alt="Forgot Password"
                            width={120}
                            height={120}
                            className="mx-auto rounded-full bg-white p-2"
                        />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Quên mật khẩu?</h1>
                    <p className="text-xl mb-6">Đừng lo lắng, chúng tôi sẽ giúp bạn khôi phục tài khoản.</p>
                    <div className="space-y-4">
                        <div className="flex items-center bg-blue-600 bg-opacity-30 rounded-lg p-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500 mr-4">
                                <span className="font-bold">1</span>
                            </div>
                            <div className="text-left">
                                <p className="font-semibold">Nhập email của bạn</p>
                                <p className="text-blue-100 text-sm">Hệ thống sẽ gửi mã OTP đến email này</p>
                            </div>
                        </div>
                        <div className="flex items-center bg-blue-600 bg-opacity-30 rounded-lg p-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500 mr-4">
                                <span className="font-bold">2</span>
                            </div>
                            <div className="text-left">
                                <p className="font-semibold">Xác thực mã OTP</p>
                                <p className="text-blue-100 text-sm">Nhập mã OTP được gửi đến email của bạn</p>
                            </div>
                        </div>
                        <div className="flex items-center bg-blue-600 bg-opacity-30 rounded-lg p-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-500 mr-4">
                                <span className="font-bold">3</span>
                            </div>
                            <div className="text-left">
                                <p className="font-semibold">Đặt lại mật khẩu</p>
                                <p className="text-blue-100 text-sm">Tạo mật khẩu mới cho tài khoản của bạn</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form Section */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                    <div className="mb-6">
                        <Link
                            href="/login"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <FaArrowLeft className="mr-2" /> Quay lại đăng nhập
                        </Link>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Quên mật khẩu</h2>
                        <p className="text-gray-600">
                            Nhập email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập địa chỉ email của bạn"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang xử lý...
                                    </span>
                                ) : (
                                    'Gửi mã OTP'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Mobile Only Instructions */}
                    <div className="mt-10 md:hidden">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Quy trình đặt lại mật khẩu</h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                        <span className="font-bold">1</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700">Nhập email của bạn</p>
                                    <p className="text-gray-500 text-sm">Hệ thống sẽ gửi mã OTP đến email này</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                        <span className="font-bold">2</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700">Xác thực mã OTP</p>
                                    <p className="text-gray-500 text-sm">Nhập mã OTP được gửi đến email của bạn</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                        <span className="font-bold">3</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-700">Đặt lại mật khẩu</p>
                                    <p className="text-gray-500 text-sm">Tạo mật khẩu mới cho tài khoản của bạn</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;