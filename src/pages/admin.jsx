import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Đăng ký các components của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Admin = () => {
    const [activeSection, setActiveSection] = useState("manageUsers");
    const [showDropdown, setShowDropdown] = useState(false);
    const [users, setUsers] = useState([]); // Danh sách người dùng từ API
    const [loading, setLoading] = useState(true); // Trạng thái loading khi lấy dữ liệu
    const [deleteLoading, setDeleteLoading] = useState({}); // Trạng thái loading khi xóa từng user
    const [showConfirm, setShowConfirm] = useState(null); // ID của user cần xác nhận xóa
    const router = useRouter();

    // Thay thế state revenueData cũ
    const [revenueData, setRevenueData] = useState([]);
    const [revenueLoading, setRevenueLoading] = useState(true);

    // Bộ lọc ngày - giữ nguyên
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Thêm state cho filter
    const [filterType, setFilterType] = useState('all'); // 'all', 'week', 'month', 'custom'

    // Thêm state cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    // Lấy danh sách người dùng từ API
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Token không tồn tại. Vui lòng đăng nhập lại!");
                }

                const response = await fetch("/api/user", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        accept: "*/*",
                    },
                });

                if (!response.ok) {
                    throw new Error("Không thể lấy danh sách người dùng");
                }

                const data = await response.json();

                // Chuẩn hóa dữ liệu người dùng, thêm trường role
                const formattedUsers = data.map((user) => ({
                    id: user.userID,
                    name: user.username || "N/A",
                    email: user.email || "N/A",
                    status: user.status || "N/A",
                    role: user.role || "N/A",
                }));

                setUsers(formattedUsers);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu người dùng:", error);
                toast.error("Không thể lấy danh sách người dùng!", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Thêm useEffect để fetch dữ liệu doanh thu
    useEffect(() => {
        const fetchRevenue = async () => {
            setRevenueLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Token không tồn tại. Vui lòng đăng nhập lại!");
                }

                const response = await fetch("/api/payments/revenue/daily", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        accept: "*/*",
                    },
                });

                if (!response.ok) {
                    throw new Error("Không thể lấy dữ liệu doanh thu");
                }

                const data = await response.json();
                setRevenueData(data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
                toast.error("Không thể lấy dữ liệu doanh thu!", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } finally {
                setRevenueLoading(false);
            }
        };

        fetchRevenue();
    }, []);

    // Xử lý logout - giữ nguyên
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        router.push("/login");
    };

    // Hiển thị popup xác nhận xóa
    const confirmDeleteUser = (userId) => {
        setShowConfirm(userId);
    };

    // Hủy popup xác nhận
    const cancelDelete = () => {
        setShowConfirm(null);
    };

    // Xóa người dùng
    const handleDeleteUser = async (userId) => {
        setDeleteLoading((prev) => ({ ...prev, [userId]: true }));
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token không tồn tại. Vui lòng đăng nhập lại!");
            }

            const response = await fetch(`/api/user/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    accept: "*/*",
                },
            });

            if (!response.ok) {
                throw new Error("Không thể xóa người dùng");
            }

            // Cập nhật danh sách người dùng sau khi xóa
            setUsers(users.filter((user) => user.id !== userId));
            toast.success("Người dùng đã được xóa thành công!", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
            toast.error("Không thể xóa người dùng!", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setDeleteLoading((prev) => ({ ...prev, [userId]: false }));
            setShowConfirm(null); // Ẩn popup sau khi xóa
        }
    };

    // Cập nhật hàm lọc doanh thu
    const filteredRevenue = revenueData.filter((item) => {
        const itemDate = new Date(item.day);
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

    // Cập nhật cách tính tổng doanh thu
    const totalRevenue = filteredRevenue.reduce((sum, item) => sum + item.totalRevenue, 0);

    // Tính doanh thu theo dịch vụ - giữ nguyên
    const revenueByService = filteredRevenue.reduce((acc, item) => {
        acc[item.service] = (acc[item.service] || 0) + item.amount;
        return acc;
    }, {});

    // Sửa lại cấu hình biểu đồ
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Doanh thu theo ngày',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Doanh thu (VNĐ)'
                }
            },
            y1: {
                beginAtZero: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Số lượng giao dịch'
                },
                grid: {
                    drawOnChartArea: false,
                }
            }
        }
    };

    // Sửa lại dữ liệu biểu đồ
    const chartData = {
        labels: filteredRevenue.map(item => new Date(item.day).toLocaleDateString('vi-VN')),
        datasets: [
            {
                label: 'Doanh thu',
                data: filteredRevenue.map(item => item.totalRevenue),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                borderColor: 'rgb(53, 162, 235)',
                borderWidth: 1,
                yAxisID: 'y',
            },
            {
                label: 'Số lượng giao dịch',
                data: filteredRevenue.map(item => item.paymentCount),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
                yAxisID: 'y1'
            }
        ]
    };

    // Thêm hàm helper để lấy ngày đầu và cuối của tuần/tháng hiện tại
    const getDateRange = (type) => {
        const today = new Date();
        const firstDay = new Date(today);
        const lastDay = new Date(today);

        switch (type) {
            case 'week':
                firstDay.setDate(today.getDate() - today.getDay()); // Chủ nhật của tuần này
                lastDay.setDate(firstDay.getDate() + 6); // Thứ 7 của tuần này
                break;
            case 'month':
                firstDay.setDate(1); // Ngày đầu tháng
                lastDay.setMonth(today.getMonth() + 1, 0); // Ngày cuối tháng
                break;
            default:
                return { start: '', end: '' };
        }

        return {
            start: firstDay.toISOString().split('T')[0],
            end: lastDay.toISOString().split('T')[0]
        };
    };

    // Thêm hàm xử lý thay đổi filter
    const handleFilterChange = (type) => {
        setFilterType(type);
        if (type === 'all') {
            setStartDate('');
            setEndDate('');
        } else if (type !== 'custom') {
            const { start, end } = getDateRange(type);
            setStartDate(start);
            setEndDate(end);
        }
    };

    // Tính toán users cho trang hiện tại
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // Tính tổng số trang
    const totalPages = Math.ceil(users.length / usersPerPage);

    // Hàm thay đổi trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Component phân trang
    const Pagination = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex justify-center mt-4 space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${
                        currentPage === 1
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    Trước
                </button>
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => handlePageChange(number)}
                        className={`px-3 py-1 rounded ${
                            currentPage === number
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        {number}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${
                        currentPage === totalPages
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    Sau
                </button>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar - giữ nguyên */}
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
                                onClick={() => setActiveSection("manageUsers")}
                                className={`w-full text-left px-4 py-2 rounded ${
                                    activeSection === "manageUsers" ? "bg-teal-500" : "hover:bg-gray-700"
                                }`}
                            >
                                Manage Users
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveSection("manageRevenue")}
                                className={`w-full text-left px-4 py-2 rounded ${
                                    activeSection === "manageRevenue" ? "bg-teal-500" : "hover:bg-gray-700"
                                }`}
                            >
                                Manage Revenue
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                {activeSection === "manageUsers" && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Manage Users</h2>
                        <div className="grid grid-cols-6 gap-4 text-center font-semibold bg-gray-200 p-2 rounded-t-md">
                            <span>ID</span>
                            <span>Tên</span>
                            <span>Email</span>
                            <span>Trạng thái</span>
                            <span>Role</span>
                            <span>Hành động</span>
                        </div>
                        <ul className="space-y-2">
                            {loading ? (
                                <li className="flex justify-center items-center py-4">
                                    <svg
                                        className="animate-spin h-8 w-8 text-blue-600 mr-3"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    <span className="text-gray-500">Đang tải...</span>
                                </li>
                            ) : currentUsers.length > 0 ? (
                                currentUsers.map((user) => (
                                    <li
                                        key={user.id}
                                        className="grid grid-cols-6 gap-4 items-center text-center py-2 border-b border-gray-200"
                                    >
                                        <span>{user.id}</span>
                                        <span>{user.name}</span>
                                        <span>{user.email}</span>
                                        <span>{user.status}</span>
                                        <span>{user.role}</span>
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => confirmDeleteUser(user.id)}
                                                disabled={deleteLoading[user.id]}
                                                className={`px-2 py-1 rounded text-white ${
                                                    deleteLoading[user.id]
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-red-600 hover:bg-red-700"
                                                }`}
                                            >
                                                {deleteLoading[user.id] ? (
                                                    <svg
                                                        className="animate-spin h-5 w-5 text-white inline"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                ) : (
                                                    "Xóa"
                                                )}
                                            </button>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="text-center py-4 text-gray-500">
                                    Không có người dùng nào.
                                </li>
                            )}
                        </ul>
                        {/* Thêm component phân trang */}
                        {!loading && users.length > 0 && <Pagination />}
                    </div>
                )}

                {/* Popup xác nhận xóa */}
                {showConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
                            <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
                            <div className="mt-6 flex justify-end space-x-4">
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(showConfirm)}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === "manageRevenue" && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Quản lý doanh thu</h2>
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Tổng doanh thu: {totalRevenue.toLocaleString()} VNĐ
                            </h3>
                            
                            {/* Thêm phần filter buttons */}
                            <div className="flex space-x-2 mb-4">
                                <button
                                    onClick={() => handleFilterChange('all')}
                                    className={`px-4 py-2 rounded-md ${
                                        filterType === 'all'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                >
                                    Tất cả
                                </button>
                                <button
                                    onClick={() => handleFilterChange('week')}
                                    className={`px-4 py-2 rounded-md ${
                                        filterType === 'week'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                >
                                    Tuần này
                                </button>
                                <button
                                    onClick={() => handleFilterChange('month')}
                                    className={`px-4 py-2 rounded-md ${
                                        filterType === 'month'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                >
                                    Tháng này
                                </button>
                            </div>

                            {/* Chỉ hiển thị date inputs khi ở chế độ tùy chỉnh */}
                            {filterType === 'custom' && (
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
                            )}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Doanh thu theo ngày</h3>
                        {revenueLoading ? (
                            <div className="flex justify-center items-center py-4">
                                <svg
                                    className="animate-spin h-8 w-8 text-blue-600 mr-3"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                <span className="text-gray-500">Đang tải...</span>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-3 gap-4 text-center font-semibold bg-gray-200 p-2 rounded-t-md">
                                    <span>Ngày</span>
                                    <span>Số lượng giao dịch</span>
                                    <span>Doanh thu (VNĐ)</span>
                                </div>
                                <ul className="space-y-2">
                                    {filteredRevenue.map((item, index) => (
                                        <li
                                            key={index}
                                            className="grid grid-cols-3 gap-4 items-center text-center py-2 border-b border-gray-200"
                                        >
                                            <span>{new Date(item.day).toLocaleDateString('vi-VN')}</span>
                                            <span>{item.paymentCount}</span>
                                            <span>{item.totalRevenue.toLocaleString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {/* Thêm phần biểu đồ */}
                        <div className="mb-8 mt-4">
                            <h3 className="text-xl font-semibold text-gray-700 mb-4">Biểu đồ doanh thu</h3>
                            <div className="h-[400px]">
                                {!revenueLoading && filteredRevenue.length > 0 ? (
                                    <Bar options={chartOptions} data={chartData} />
                                ) : revenueLoading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <svg
                                            className="animate-spin h-8 w-8 text-blue-600 mr-3"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        <span className="text-gray-500">Đang tải biểu đồ...</span>
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center h-full">
                                        <span className="text-gray-500">Không có dữ liệu để hiển thị</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;