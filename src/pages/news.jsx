import React, { useState, useEffect } from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { BiNews, BiCalendarAlt, BiUser } from 'react-icons/bi';
import { toast } from 'react-toastify';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);

                // Sửa lại endpoint thành /api/news-getall theo API trong swagger
                const response = await fetch('/api/news-getall', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': '*/*'  // Thêm header Accept để đảm bảo server chấp nhận
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

    return (
        <DefaultLayout>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-blue-900 mb-4">Tin tức và sự kiện</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Cập nhật thông tin mới nhất về dịch vụ tiêm chủng, vaccine và các chương trình khuyến mãi
                        </p>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {news && news.length > 0 ? (
                                news.map((item) => (
                                    <div
                                        key={item.id || item.newsId}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                    >
                                        {item.imageUrl && (
                                            <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="w-full h-48 object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <div className="flex items-center text-sm text-gray-500 mb-3">
                                                <BiCalendarAlt className="mr-1" />
                                                <span>{formatDate(item.createAt || item.createdAt)}</span>
                                                {item.author && (
                                                    <>
                                                        <span className="mx-2">•</span>
                                                        <BiUser className="mr-1" />
                                                        <span>{item.author}</span>
                                                    </>
                                                )}
                                            </div>
                                            <h2 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h2>
                                            <p className="text-gray-600 mb-4 line-clamp-3">{item.description || item.content}</p>
                                            <a
                                                href={`/news/${item.id || item.newsId}`}
                                                className="inline-block text-blue-600 font-medium hover:text-blue-800"
                                            >
                                                Đọc thêm →
                                            </a>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <BiNews className="text-5xl text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">Không có tin tức nào được tìm thấy.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DefaultLayout>
    );
};

export default News; 