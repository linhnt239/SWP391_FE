import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';

const ResetPassword = () => {
    const router = useRouter();
    const { email } = router.query;

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmNewpassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (!email && router.isReady) {
            toast.error('Email không hợp lệ. Vui lòng thử lại từ đầu.');
            router.push('/forgot-password');
        }
    }, [email, router]);

    const validateForm = () => {
        const newErrors = {};

        // Validate mật khẩu mới
        if (!formData.newPassword) {
            newErrors.newPassword = 'Mật khẩu mới không được để trống';
        } else if (formData.newPassword.length < 6 || formData.newPassword.length > 12) {
            newErrors.newPassword = 'Mật khẩu phải có độ dài từ 6 đến 12 ký tự';
        } else if (!/[A-Z]/.test(formData.newPassword)) {
            newErrors.newPassword = 'Mật khẩu phải chứa ít nhất một chữ viết hoa';
        }

        // Validate xác nhận mật khẩu
        if (!formData.confirmNewpassword) {
            newErrors.confirmNewpassword = 'Vui lòng xác nhận mật khẩu mới';
        } else if (formData.newPassword !== formData.confirmNewpassword) {
            newErrors.confirmNewpassword = 'Mật khẩu xác nhận không khớp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Xóa lỗi khi người dùng thay đổi input
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!email) {
            toast.error('Email không hợp lệ. Vui lòng thử lại từ đầu.');
            return;
        }

        setLoading(true);

        try {
            // Đảm bảo chính xác tên trường - phải là chính xác "newPassword" và "confirmNewPassword"
            const response = await fetch(`/api/auth/reset-password?email=${encodeURIComponent(email)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                },
                body: JSON.stringify({
                    "newPassword": formData.newPassword,
                    "confirmNewpassword": formData.confirmNewpassword
                })
            });

            // Log để debug - không hiển thị mật khẩu thực
            console.log('Request sent to:', `/api/auth/reset-password?email=${encodeURIComponent(email)}`);

            if (!response.ok) {
                let errorMessage = 'Không thể đặt lại mật khẩu';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || `Lỗi ${response.status}: ${response.statusText}`;
                } catch (jsonError) {
                    errorMessage = `Lỗi ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.', {
                position: "top-right",
                autoClose: 3000
            });

            // Chuyển hướng đến trang đăng nhập
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error) {
            toast.error(error.message || 'Không thể đặt lại mật khẩu', {
                position: "top-right",
                autoClose: 5000
            });
            console.error('Lỗi khi đặt lại mật khẩu:', error);
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
                            alt="Reset Password"
                            width={120}
                            height={120}
                            className="mx-auto rounded-full bg-white p-2"
                        />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Đặt lại mật khẩu</h1>
                    <p className="text-xl mb-8">Tạo mật khẩu mới an toàn cho tài khoản của bạn</p>

                    <div className="bg-blue-600 bg-opacity-30 rounded-lg p-6 mt-8">
                        <h3 className="text-lg font-semibold mb-4">Lưu ý khi tạo mật khẩu:</h3>
                        <ul className="text-sm text-blue-100 space-y-3 text-left">
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Sử dụng từ 6 đến 12 ký tự</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Phải có ít nhất một chữ viết hoa</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Không sử dụng thông tin cá nhân dễ đoán</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Không sử dụng lại mật khẩu từ các trang web khác</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form Section */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                    <div className="mb-6">
                        <Link
                            href="/forgot-password"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <FaArrowLeft className="mr-2" /> Quay lại
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Đặt lại mật khẩu</h2>
                        <p className="text-gray-600">
                            Tạo mật khẩu mới cho tài khoản của bạn
                        </p>
                        {email && (
                            <p className="mt-2 text-blue-600 font-medium">{email}</p>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Mật khẩu mới */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu mới
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-sm pr-10"
                                    placeholder="Nhập mật khẩu mới"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                            )}
                        </div>

                        {/* Xác nhận mật khẩu mới */}
                        <div>
                            <label htmlFor="confirmNewpassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Xác nhận mật khẩu mới
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmNewpassword"
                                    name="confirmNewpassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmNewpassword}
                                    onChange={handleChange}
                                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-sm pr-10"
                                    placeholder="Xác nhận mật khẩu mới"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.confirmNewpassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmNewpassword}</p>
                            )}
                        </div>

                        <div className="pt-2">
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
                                    'Xác nhận đặt lại mật khẩu'
                                )}
                            </button>
                            <div className="text-center mt-4">
                                <Link
                                    href="/login"
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Quay lại đăng nhập
                                </Link>
                            </div>
                        </div>
                    </form>

                    {/* Mobile Only Password Tips */}
                    <div className="mt-10 md:hidden">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Lưu ý khi tạo mật khẩu:</h3>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>• Sử dụng từ 6 đến 12 ký tự</li>
                                <li>• Phải có ít nhất một chữ viết hoa</li>
                                <li>• Không sử dụng thông tin cá nhân dễ đoán</li>
                                <li>• Không sử dụng lại mật khẩu từ các trang web khác</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword; 