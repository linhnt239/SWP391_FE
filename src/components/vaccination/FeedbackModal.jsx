import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

const FeedbackModal = ({
    show,
    onClose,
    onSubmit,
    rating,
    setRating,
    feedback,
    setFeedback,
    isSubmitting
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Đánh giá dịch vụ</h2>

                <div className="mb-4">
                    <label className="block mb-2">Mức độ hài lòng</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <button
                                key={value}
                                onClick={() => setRating(value)}
                                className={`text-2xl ${rating >= value ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Nhận xét của bạn</label>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows="4"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        disabled={isSubmitting}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal; 