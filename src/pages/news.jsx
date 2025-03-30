import React, { useState, useEffect } from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { BiCalendarAlt, BiChevronRight, BiNews } from 'react-icons/bi';
import { toast } from 'react-toastify';
import Link from 'next/link';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);

                // Cập nhật endpoint đúng với Swagger UI
                const response = await fetch('/api/news-getall', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                setNews(data);
            } catch (error) {
                console.error('Error fetching news:', error);
                setError(error.message);
                toast.error('Không thể tải tin tức. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

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

    // Format time from date string
    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <DefaultLayout>
            <div className="min-h-screen bg-white py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10">
                        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 border-b border-gray-200 pb-4">
                            Thông báo & Tin tức
                        </h1>
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
                    ) : (
                        <div className="max-w-5xl mx-auto">
                            <ul className="divide-y divide-gray-200">
                                {news && news.length > 0 ? (
                                    news.map((item) => {
                                        const createdAt = item.createAt || item.createdAt;
                                        const dateStr = formatDate(createdAt);
                                        const timeStr = formatTime(createdAt);

                                        return (
                                            <li key={item.id || item.newsId} className="py-4 hover:bg-gray-50 transition-colors">
                                                <Link href={`/news/${item.id || item.newsId}`} className="block">
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 text-blue-600 mr-3 mt-1">
                                                            <BiChevronRight className="text-xl" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-col md:flex-row md:items-baseline">
                                                                <div className="text-gray-500 text-sm md:w-40 mb-1 md:mb-0">
                                                                    {dateStr} {timeStr}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-base md:text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors">
                                                                        {item.title}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-12">
                                        <BiNews className="text-5xl text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">Không có tin tức nào được tìm thấy.</p>
                                    </div>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
};

export default News; 