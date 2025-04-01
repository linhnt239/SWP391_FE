import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { BiCalendarAlt, BiUser, BiArrowBack } from 'react-icons/bi';
import Link from 'next/link';
import { toast } from 'react-toastify';

const NewsDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [newsDetail, setNewsDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            if (!id) return; // Wait for id to be available

            try {
                setLoading(true);
                const response = await fetch(`/api/news/getById?id=${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                setNewsDetail(data);
            } catch (error) {
                console.error('Error fetching news detail:', error);
                setError(error.message);
                toast.error('Không thể tải thông tin tin tức. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchNewsDetail();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <DefaultLayout>
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section với ảnh nền */}
                <div className="relative bg-blue-900 h-[300px] overflow-hidden">
                    {newsDetail?.img ? (
                        <img
                            src={newsDetail.img}
                            alt={newsDetail.title}
                            className="w-full h-full object-cover opacity-30"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700" />
                    )}
                    
                    {/* Overlay content */}
                    <div className="absolute inset-0 bg-black bg-opacity-40" />
                    
                    {/* Back button */}
                    <div className="absolute top-8 left-8">
                        <Link 
                            href="/news" 
                            className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-all"
                        >
                            <BiArrowBack className="mr-2" />
                            Quay lại danh sách tin tức
                        </Link>
                    </div>
                </div>

                {/* Main content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-16">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
                            <p className="text-red-700">Đã xảy ra lỗi: {error}</p>
                            <p className="text-red-700">Vui lòng thử lại sau hoặc liên hệ hỗ trợ.</p>
                        </div>
                    ) : newsDetail ? (
                        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                            <div className="p-8">
                                {/* Category and Date */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                                        {newsDetail.category}
                                    </span>
                                    <div className="flex items-center">
                                        <BiCalendarAlt className="mr-1" />
                                        <span>{formatDate(newsDetail.createdAt)}</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h1 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
                                    {newsDetail.title}
                                </h1>

                                {/* Source */}
                                <div className="flex items-center gap-2 mb-8 p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600 font-medium">Nguồn:</span>
                                    <span className="text-blue-600">{newsDetail.source}</span>
                                </div>

                                {/* Content */}
                                <div className="prose prose-lg max-w-none">
                                    <div className="space-y-6">
                                        {/* Main image if exists */}
                                        {newsDetail.img && (
                                            <img
                                                src={newsDetail.img}
                                                alt={newsDetail.title}
                                                className="w-full rounded-lg shadow-md"
                                            />
                                        )}
                                        
                                        {/* Description */}
                                        <div className="text-gray-700 leading-relaxed space-y-6 whitespace-pre-wrap">
                                            {newsDetail.description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                            <p className="text-gray-500">Không tìm thấy thông tin tin tức.</p>
                        </div>
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
};

export default NewsDetail; 