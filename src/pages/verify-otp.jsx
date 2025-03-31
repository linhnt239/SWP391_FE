import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { FaArrowLeft } from 'react-icons/fa';

const VerifyOTP = () => {
    const router = useRouter();
    const { email } = router.query;

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 phút tính bằng giây
    const [inputValues, setInputValues] = useState(['', '', '', '', '', '']);

    useEffect(() => {
        if (!email && router.isReady) {
            toast.error('Email không hợp lệ. Vui lòng thử lại từ đầu.');
            router.push('/forgot-password');
        }

        // Timer đếm ngược
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [email, router]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleInputChange = (index, value) => {
        // Chỉ cho phép nhập số
        if (!/^\d*$/.test(value)) return;

        const newInputValues = [...inputValues];
        newInputValues[index] = value;
        setInputValues(newInputValues);

        // Cập nhật giá trị OTP
        setOtp(newInputValues.join(''));

        // Tự động focus vào ô tiếp theo
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-input-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Xử lý phím Backspace
        if (e.key === 'Backspace' && !inputValues[index] && index > 0) {
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        // Chỉ lấy 6 ký tự đầu tiên nếu là số
        const cleanedData = pastedData.replace(/\D/g, '').slice(0, 6);

        if (cleanedData) {
            const newValues = Array(6).fill('');
            for (let i = 0; i < cleanedData.length; i++) {
                newValues[i] = cleanedData[i];
            }
            setInputValues(newValues);
            setOtp(cleanedData);

            // Focus vào ô cuối cùng có giá trị, hoặc ô đầu tiên nếu không có ký tự nào
            const lastFilledIndex = Math.min(cleanedData.length, 5);
            const inputToFocus = document.getElementById(`otp-input-${lastFilledIndex}`);
            if (inputToFocus) inputToFocus.focus();
        }
    };

    const resendOTP = async () => {
        if (!email) {
            toast.error('Email không hợp lệ. Vui lòng thử lại từ đầu.');
            return;
        }

        try {
            setLoading(true);
            // Sửa lại endpoint và cách truyền tham số cho phù hợp
            const response = await fetch(`/api/auth/forgot-password?email=${encodeURIComponent(email)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                }
            });

            if (!response.ok) {
                let errorMessage = 'Có lỗi xảy ra khi gửi lại OTP';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    errorMessage = `Lỗi ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            toast.success('Mã OTP mới đã được gửi đến email của bạn!', {
                position: "top-right",
                autoClose: 5000
            });

            // Reset thời gian đếm ngược
            setTimeLeft(300);
            // Reset input values
            setInputValues(['', '', '', '', '', '']);
            setOtp('');
        } catch (error) {
            toast.error(error.message || 'Không thể gửi lại mã OTP', {
                position: "top-right",
                autoClose: 5000
            });
            console.error('Lỗi khi gửi lại OTP:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error('Vui lòng nhập đủ 6 chữ số OTP');
            return;
        }

        if (!email) {
            toast.error('Email không hợp lệ. Vui lòng thử lại từ đầu.');
            return;
        }

        setLoading(true);

        try {
            // Sửa lại endpoint và cách truyền tham số - sử dụng query parameter thay vì body
            const response = await fetch(`/api/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${otp}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                }
            });

            if (!response.ok) {
                let errorMessage = 'Mã OTP không hợp lệ';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    errorMessage = `Lỗi ${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            toast.success('Xác thực OTP thành công!', {
                position: "top-right",
                autoClose: 3000
            });

            // Chuyển đến trang đặt lại mật khẩu
            router.push({
                pathname: '/reset-password',
                query: { email }
            });
        } catch (error) {
            toast.error(error.message || 'Xác thực OTP thất bại', {
                position: "top-right",
                autoClose: 5000
            });
            console.error('Lỗi khi xác thực OTP:', error);
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
                            alt="OTP Verification"
                            width={120}
                            height={120}
                            className="mx-auto rounded-full bg-white p-2"
                        />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Xác thực OTP</h1>
                    <p className="text-xl mb-6">Vui lòng nhập mã OTP đã được gửi đến email của bạn</p>
                    <div className="bg-blue-600 bg-opacity-30 rounded-lg p-6 mt-8">
                        <h3 className="text-lg font-semibold mb-2">Lưu ý:</h3>
                        <p className="text-sm text-blue-100 mb-3">
                            • Mã OTP có hiệu lực trong 5 phút
                        </p>
                        <p className="text-sm text-blue-100 mb-3">
                            • Kiểm tra cả hộp thư spam nếu bạn không tìm thấy email
                        </p>
                        <p className="text-sm text-blue-100">
                            • Đảm bảo bạn nhập đúng mã OTP để tránh bị khóa tài khoản
                        </p>
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

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Xác thực mã OTP</h2>
                        <p className="text-gray-600">
                            Vui lòng nhập mã OTP 6 chữ số đã được gửi đến email của bạn
                        </p>
                        {email && (
                            <p className="mt-2 text-blue-600 font-medium">{email}</p>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-3">
                                Nhập mã OTP
                            </label>
                            <div className="flex justify-between items-center gap-2">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <input
                                        key={index}
                                        id={`otp-input-${index}`}
                                        type="text"
                                        maxLength="1"
                                        value={inputValues[index]}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className="w-12 h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                <p className="text-gray-600">
                                    Thời gian còn lại: <span className="font-medium text-blue-700">{formatTime(timeLeft)}</span>
                                </p>
                            </div>

                            {timeLeft === 0 ? (
                                <button
                                    type="button"
                                    onClick={resendOTP}
                                    disabled={loading}
                                    className="text-blue-600 hover:text-blue-800 font-medium underline"
                                >
                                    Gửi lại mã OTP
                                </button>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    Không nhận được mã? Bạn có thể yêu cầu gửi lại sau khi hết thời gian.
                                </p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${(loading || otp.length !== 6) ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                                    'Xác nhận'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Mobile Only Instructions */}
                    <div className="mt-10 md:hidden">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Lưu ý:</h3>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>• Mã OTP có hiệu lực trong 5 phút</li>
                                <li>• Kiểm tra cả hộp thư spam nếu bạn không tìm thấy email</li>
                                <li>• Đảm bảo bạn nhập đúng mã OTP để tránh bị khóa tài khoản</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP; 