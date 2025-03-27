// src/components/staff/FeedbackSection.js
import React, { useState, useEffect } from 'react';

const FeedbackSection = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
    const [responseText, setResponseText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');

            const response = await fetch('/api/feedback-all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Không thể lấy dữ liệu feedback: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Data:', data);

            setFeedbacks(data.map(item => ({
                id: item.feedbackId,
                userId: item.userId,
                username: item.username,
                appointmentId: item.appointmentsId,
                rating: item.rating,
                comment: item.context,
                createdAt: item.createAt,
                updatedAt: item.updateAt
            })));
        } catch (err) {
            console.error('Fetch Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRespondFeedback = (feedbackId) => {
        setSelectedFeedbackId(feedbackId);
        setResponseText('');
    };

    const handleSaveResponse = async () => {
        if (!responseText.trim()) {
            alert('Vui lòng nhập nội dung phản hồi');
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error('Không tìm thấy token');

            // Thay đổi endpoint thực tế tại đây
            const response = await fetch(`/api/feedback/${selectedFeedbackId}/respond`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ response: responseText }),
            });

            if (!response.ok) {
                throw new Error('Không thể lưu phản hồi');
            }

            alert('Phản hồi đã được lưu thành công');
            setSelectedFeedbackId(null);
            setResponseText('');
            fetchFeedbacks();
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Quản lý Feedback</h2>

            {loading && <p className="text-center">Đang tải...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {!loading && !error && (
                <>
                    <div className="grid grid-cols-4 gap-4 text-center font-semibold bg-gray-200 p-2 rounded-t-md">
                        <span>Người dùng</span>
                        <span>Đánh giá</span>
                        <span>Nội dung</span>
                        <span>Thời gian</span>
                    </div>
                    <ul className="space-y-2">
                        {feedbacks.map((feedback) => (
                            <li key={feedback.id} className="grid grid-cols-4 gap-4 items-center text-center py-2 border-b border-gray-200">
                                <span>{feedback.username || 'Ẩn danh'}</span>
                                <span>{feedback.rating} ⭐</span>
                                <span>{feedback.comment}</span>
                                <span>{new Date(feedback.createdAt).toLocaleDateString('vi-VN')}</span>
                            </li>
                        ))}
                    </ul>
                    {selectedFeedbackId && (
                        <div className="mt-4 p-4 border border-gray-300 rounded-md">
                            <textarea
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                placeholder="Nhập phản hồi..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                rows="3"
                            />
                            <div className="mt-2 flex justify-end space-x-2">
                                <button
                                    onClick={() => setSelectedFeedbackId(null)}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSaveResponse}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FeedbackSection;