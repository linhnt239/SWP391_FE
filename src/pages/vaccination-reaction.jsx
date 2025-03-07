// src/pages/vaccination-reaction.js
import React, { useState } from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const VaccinationReaction = () => {
    const [reactionData, setReactionData] = useState({
        childName: '',
        vaccineType: '',
        reaction: '',
        date: '',
    });

    const handleChange = (e) => {
        setReactionData({ ...reactionData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Phản ứng sau tiêm:', reactionData);
        alert('Cảm ơn bạn đã ghi nhận! Chúng tôi sẽ liên hệ để hỗ trợ.');
        setReactionData({
            childName: '',
            vaccineType: '',
            reaction: '',
            date: '',
        });
    };

    return (
        <DefaultLayout>
            <section className="py-12 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
                        Ghi nhận phản ứng sau tiêm
                    </h1>
                    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="childName" className="block text-sm font-medium text-gray-700">
                                    Họ tên trẻ
                                </label>
                                <input
                                    type="text"
                                    id="childName"
                                    name="childName"
                                    value={reactionData.childName}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="vaccineType" className="block text-sm font-medium text-gray-700">
                                    Loại vaccine
                                </label>
                                <input
                                    type="text"
                                    id="vaccineType"
                                    name="vaccineType"
                                    value={reactionData.vaccineType}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="reaction" className="block text-sm font-medium text-gray-700">
                                    Phản ứng (nếu có)
                                </label>
                                <textarea
                                    id="reaction"
                                    name="reaction"
                                    value={reactionData.reaction}
                                    onChange={handleChange}
                                    rows="4"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                    Ngày xảy ra phản ứng
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={reactionData.date}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="bg-blue-900 text-white px-6 py-3 rounded-full hover:bg-blue-700"
                                >
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" /> Ghi nhận
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </DefaultLayout>
    );
};

export default VaccinationReaction;