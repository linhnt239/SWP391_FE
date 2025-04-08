// src/components/staff/OverviewSection.js
import React from 'react';

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
          icon={
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          }
          bgColor="bg-gradient-to-r from-blue-50 to-blue-100"
          textColor="text-blue-700"
          borderColor="border-blue-500"
        />

        <StatCard
          title="Phản ứng sau tiêm"
          value={feedbacks.filter((f) => !f.response).length}
          icon={
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          bgColor="bg-gradient-to-r from-green-50 to-green-100"
          textColor="text-green-700"
          borderColor="border-green-500"
        />

        <StatCard
          title="Tin Tức"
          value={services.length}
          icon={
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          }
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