// src/components/staff/FeedbackSection.js
import React from 'react';

const FeedbackSection = ({
    feedbacks,
    selectedFeedbackId,
    responseText,
    setResponseText,
    handleRespondFeedback,
    handleSaveResponse,
}) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Feedback</h2>
            <div className="grid grid-cols-4 gap-4 text-center font-semibold bg-gray-200 p-2 rounded-t-md">
                <span>Người dùng</span>
                <span>Đánh giá</span>
                <span>Bình luận</span>
                <span>Hành động</span>
            </div>
            <ul className="space-y-2">
                {feedbacks.map((feedback) => (
                    <li key={feedback.id} className="grid grid-cols-4 gap-4 items-center text-center py-2 border-b border-gray-200">
                        <span>{feedback.user}</span>
                        <span>{feedback.rating}/5</span>
                        <span className="">{feedback.comment}</span>
                        <div className="flex justify-center">
                            <button
                                onClick={() => handleRespondFeedback(feedback.id)}
                                className="bg-blue-900 text-white px-2 py-1 rounded hover:bg-blue-700"
                            >
                                Phản hồi
                            </button>
                        </div>
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
        </div>
    );
};

export default FeedbackSection;