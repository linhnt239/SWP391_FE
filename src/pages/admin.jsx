// src/pages/admin.jsx
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Admin = () => {
    const [activeSection, setActiveSection] = useState('manageUsers');
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();

    // Dữ liệu giả lập cho users
    const [users, setUsers] = useState([
        { id: 1, name: 'Nguyen Van A', email: 'nguyenvana@example.com', status: 'Active' },
        { id: 2, name: 'Tran Thi B', email: 'tranthib@example.com', status: 'Active' },
        { id: 3, name: 'Le Van C', email: 'levanc@example.com', status: 'Disabled' },
    ]);

    // Dữ liệu giả lập cho doanh thu (revenue)
    const [revenueData, setRevenueData] = useState([
        { id: 1, service: 'Tiêm vaccine trẻ em', amount: 5000000, date: '2025-03-01' },
        { id: 2, service: 'Tiêm vaccine người lớn', amount: 3000000, date: '2025-03-02' },
        { id: 3, service: 'Tiêm vaccine trẻ em', amount: 2000000, date: '2025-03-05' },
        { id: 4, service: 'Tư vấn sức khỏe', amount: 1000000, date: '2025-03-07' },
    ]);

    // Bộ lọc ngày
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Xử lý logout
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        router.push('/login');
    };

    // Vô hiệu hóa user
    const handleDisableUser = (id) => {
        setUsers(
            users.map((user) =>
                user.id === id ? { ...user, status: user.status === 'Active' ? 'Disabled' : 'Active' } : user
            )
        );
    };

    // Lọc doanh thu theo ngày
    const filteredRevenue = revenueData.filter((item) => {
        const itemDate = new Date(item.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && end) {
            return itemDate >= start && itemDate <= end;
        } else if (start) {
            return itemDate >= start;
        } else if (end) {
            return itemDate <= end;
        }
        return true;
    });

    // Tính tổng doanh thu
    const totalRevenue = filteredRevenue.reduce((sum, item) => sum + item.amount, 0);

    // Tính doanh thu theo dịch vụ
    const revenueByService = filteredRevenue.reduce((acc, item) => {
        acc[item.service] = (acc[item.service] || 0) + item.amount;
        return acc;
    }, {});

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white p-4">
                <div className="relative">
                    <div
                        className="flex items-center mb-6 cursor-pointer"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <Image
                            src="/avt.jpg"
                            alt="Admin Avatar"
                            width={40}
                            height={40}
                            className="rounded-full mr-2"
                        />
                        <div>
                            <p className="text-sm">Admin Name</p>
                            <p className="text-xs">Admin ID: 001</p>
                        </div>
                    </div>
                    {showDropdown && (
                        <div className="absolute top-12 left-0 w-full bg-gray-700 rounded-md shadow-lg z-10">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 rounded-md"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setActiveSection('manageUsers')}
                                className={`w-full text-left px-4 py-2 rounded ${activeSection === 'manageUsers' ? 'bg-teal-500' : 'hover:bg-gray-700'}`}
                            >
                                Manage Users
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveSection('manageRevenue')}
                                className={`w-full text-left px-4 py-2 rounded ${activeSection === 'manageRevenue' ? 'bg-teal-500' : 'hover:bg-gray-700'}`}
                            >
                                Manage Revenue
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                {activeSection === 'manageUsers' && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Manage Users</h2>
                        <div className="grid grid-cols-5 gap-4 text-center font-semibold bg-gray-200 p-2 rounded-t-md">
                            <span>ID</span>
                            <span>Tên</span>
                            <span>Email</span>
                            <span>Trạng thái</span>
                            <span>Hành động</span>
                        </div>
                        <ul className="space-y-2">
                            {users.map((user) => (
                                <li key={user.id} className="grid grid-cols-5 gap-4 items-center text-center py-2 border-b border-gray-200">
                                    <span>{user.id}</span>
                                    <span>{user.name}</span>
                                    <span>{user.email}</span>
                                    <span>{user.status}</span>
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => handleDisableUser(user.id)}
                                            className={`px-2 py-1 rounded text-white ${user.status === 'Active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                                        >
                                            {user.status === 'Active' ? 'Disable' : 'Enable'}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {activeSection === 'manageRevenue' && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Manage Revenue</h2>
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Tổng doanh thu: {totalRevenue.toLocaleString()} VNĐ</h3>
                            <div className="flex space-x-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Từ ngày</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Đến ngày</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Doanh thu chi tiết</h3>
                        <div className="grid grid-cols-4 gap-4 text-center font-semibold bg-gray-200 p-2 rounded-t-md">
                            <span>ID</span>
                            <span>Dịch vụ</span>
                            <span>Số tiền (VNĐ)</span>
                            <span>Ngày</span>
                        </div>
                        <ul className="space-y-2">
                            {filteredRevenue.map((item) => (
                                <li key={item.id} className="grid grid-cols-4 gap-4 items-center text-center py-2 border-b border-gray-200">
                                    <span>{item.id}</span>
                                    <span>{item.service}</span>
                                    <span>{item.amount.toLocaleString()}</span>
                                    <span>{item.date}</span>
                                </li>
                            ))}
                        </ul>
                        <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Doanh thu theo dịch vụ</h3>
                        <div className="grid grid-cols-2 gap-4 text-center font-semibold bg-gray-200 p-2 rounded-t-md">
                            <span>Dịch vụ</span>
                            <span>Tổng tiền (VNĐ)</span>
                        </div>
                        <ul className="space-y-2">
                            {Object.entries(revenueByService).map(([service, amount], index) => (
                                <li key={index} className="grid grid-cols-2 gap-4 items-center text-center py-2 border-b border-gray-200">
                                    <span>{service}</span>
                                    <span>{amount.toLocaleString()}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;