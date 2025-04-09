// src/components/staff/OverviewSection.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyringe, faCommentDots, faNewspaper } from '@fortawesome/free-solid-svg-icons';

const StatCard = ({ title, value, icon, bgColor, textColor, borderColor }) => {
  return (
    <div className={`${bgColor} p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 border-l-4 ${borderColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${textColor} mb-1 uppercase tracking-wider`}>{title}</p>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
        <div className={`${textColor} opacity-75 text-3xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const OverviewSection = ({ vaccines, feedbacks, services }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">
          Chào mừng bạn đến với bảng điều khiển quản lý nhân viên. Dưới đây là tổng quan về hệ thống.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Số lượng vaccine"
          value={vaccines.length}
          icon={<FontAwesomeIcon icon={faSyringe} className="w-12 h-12" />}
          bgColor="bg-gradient-to-r from-blue-50 to-blue-100"
          textColor="text-blue-700"
          borderColor="border-blue-500"
        />

        <StatCard
          title="Phản hồi chưa trả lời"
          value={feedbacks.filter((f) => !f.response).length}
          icon={<FontAwesomeIcon icon={faCommentDots} className="w-12 h-12" />}
          bgColor="bg-gradient-to-r from-green-50 to-green-100"
          textColor="text-green-700"
          borderColor="border-green-500"
        />

        <StatCard
          title="Tin tức"
          value={services.length}
          icon={<FontAwesomeIcon icon={faNewspaper} className="w-12 h-12" />}
          bgColor="bg-gradient-to-r from-yellow-50 to-yellow-100"
          textColor="text-yellow-700"
          borderColor="border-yellow-500"
        />
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl shadow-sm">
        <div className="flex items-center space-x-3 text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">
            Bảng điều khiển được cập nhật theo thời gian thực. Các số liệu thống kê trên phản ánh tình trạng hiện tại của hệ thống.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;