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

                // Cập nhật endpoint để phù hợp với API backend
                const response = await fetch(`/api/news-getById/${id}`, {
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

    // Format date to Vietnamese format
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <DefaultLayout>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link href="/news" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                            <BiArrowBack className="mr-2" />
                            Quay lại danh sách tin tức
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
                            <p className="text-red-700">Đã xảy ra lỗi: {error}</p>
                            <p className="text-red-700">Vui lòng thử lại sau hoặc liên hệ hỗ trợ.</p>
                        </div>
                    ) : newsDetail ? (
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            {newsDetail.imageUrl && (
                                <div className="w-full h-80 overflow-hidden">
                                    <img
                                        src={newsDetail.imageUrl}
                                        alt={newsDetail.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-8">
                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <BiCalendarAlt className="mr-1" />
                                    <span>{formatDate(newsDetail.createAt || newsDetail.createdAt)}</span>
                                    {newsDetail.author && (
                                        <>
                                            <span className="mx-2">•</span>
                                            <BiUser className="mr-1" />
                                            <span>{newsDetail.author}</span>
                                        </>
                                    )}
                                </div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-6">{newsDetail.title}</h1>
                                <div className="prose prose-blue max-w-none">
                                    {newsDetail.content ? (
                                        <div dangerouslySetInnerHTML={{ __html: newsDetail.content }} />
                                    ) : (
                                        <p className="text-gray-700">{newsDetail.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Không tìm thấy thông tin tin tức.</p>
                        </div>
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
};

export default NewsDetail; 