import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/components/layout/DefaultLayout';
import Link from 'next/link';
import { toast } from 'react-toastify';

const ListVaccineDetail = () => {
    const router = useRouter();
    const { vaccineId } = router.query;
    const [vaccineDetails, setVaccineDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVaccineDetails = async () => {
            if (!vaccineId) return;

            try {
                setLoading(true);
                // Lấy token từ localStorage
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('Vui lòng đăng nhập để xem thông tin');
                }

                // Sửa lại URL endpoint và thêm token vào header
                const response = await fetch(`/api/vaccinesdetails-get/${vaccineId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        throw new Error('Token không hợp lệ hoặc đã hết hạn');
                    }
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                console.log('API Response:', data);

                // Xử lý dữ liệu
                const formattedDetails = Array.isArray(data) ? data : [data];
                setVaccineDetails(formattedDetails);
                setError(null);

            } catch (error) {
                console.error('Error fetching vaccine details:', error);
                setError(error.message);

                // Nếu lỗi token, chuyển hướng về trang login
                if (error.message.includes('đăng nhập') || error.message.includes('token')) {
                    toast.error('Vui lòng đăng nhập để xem thông tin');
                    router.push('/login');
                    return;
                }

                toast.error(error.message || 'Không thể tải thông tin vaccine');
            } finally {
                setLoading(false);
            }
        };

        fetchVaccineDetails();
    }, [vaccineId, router]);

    const handleViewDetail = (vaccineDetailsId) => {
        router.push(`/vaccineDetails/${vaccineDetailsId}`);
    };

    // Format price to VND
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="flex mb-8" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link href="/" className="text-gray-700 hover:text-blue-600">
                                    Trang chủ
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                    <Link href="/services" className="text-gray-700 hover:text-blue-600">
                                        Dịch vụ
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                    <span className="text-gray-500">Chi tiết Vaccine</span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Chi tiết gói Vaccine</h1>
                        <p className="text-gray-600">Vui lòng chọn mũi tiêm phù hợp với nhu cầu của bạn</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700">{error}</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {vaccineDetails.map((detail) => (
                                <div
                                    key={detail.vaccineDetailsId}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-800 mb-2">
                                                    {detail.doseName || 'Mũi tiêm'}
                                                </h2>
                                                <p className="text-gray-600">
                                                    {detail.doseRequire} Mũi
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${detail.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {detail.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center">
                                                    <span className="text-gray-600">Nhà sản xuất: {detail.manufacturer || 'Chưa cập nhật'}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-gray-600">Khoảng cách giữa các mũi: {detail.dateBetweenDoses || 0} ngày</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center">
                                                    <span className="text-gray-600">Số lượng còn lại: {detail.quantity || 0}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="font-bold text-blue-600">{formatPrice(detail.price || 0)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">

                                            <button
                                                onClick={() => handleViewDetail(detail.vaccineDetailsId)}
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                disabled={!detail.quantity}
                                            >
                                                Chọn mũi này
                                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {vaccineDetails.length === 0 && (
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">Không có thông tin chi tiết về vaccine này.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
};

export default ListVaccineDetail; 