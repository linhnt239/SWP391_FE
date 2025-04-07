// src/components/staff/OverviewSection.js
import React from 'react';

const OverviewSection = ({ vaccines, feedbacks, services }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Overview</h2>
            <p className="text-gray-700 mb-4">Chào mừng bạn đến với bảng điều khiển quản lý nhân viên.</p>
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-blue-900">Số lượng vaccine</h3>
                    <p className="text-2xl font-bold text-blue-900">{vaccines.length}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-green-900">Phản ứng sau tiêm</h3>
                    <p className="text-2xl font-bold text-green-900">{feedbacks.filter((f) => !f.response).length}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-yellow-900">Số lượng dịch vụ</h3>
                    <p className="text-2xl font-bold text-yellow-900">{services.length}</p>
                </div>
            </div>
        </div>
    );
};

export default OverviewSection;