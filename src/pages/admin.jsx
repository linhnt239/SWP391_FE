import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const Admin = () => {
    const [activeSection, setActiveSection] = useState("manageUsers");
    const [showDropdown, setShowDropdown] = useState(false);
    const [users, setUsers] = useState([]); // Danh sách người dùng từ API
    const [loading, setLoading] = useState(true); // Trạng thái loading khi lấy dữ liệu
    const [deleteLoading, setDeleteLoading] = useState({}); // Trạng thái loading khi xóa từng user
    const [showConfirm, setShowConfirm] = useState(null); // ID của user cần xác nhận xóa
    const router = useRouter();

    // Dữ liệu giả lập cho doanh thu (revenue) - giữ nguyên
    const [revenueData, setRevenueData] = useState([
        { id: 1, service: "Tiêm vaccine trẻ em", amount: 5000000, date: "2025-03-01" },
        { id: 2, service: "Tiêm vaccine người lớn", amount: 3000000, date: "2025-03-02" },
        { id: 3, service: "Tiêm vaccine trẻ em", amount: 2000000, date: "2025-03-05" },
        { id: 4, service: "Tư vấn sức khỏe", amount: 1000000, date: "2025-03-07" },
    ]);

    // Bộ lọc ngày - giữ nguyên
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

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

    // Lọc doanh thu theo ngày - giữ nguyên
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

    // Tính tổng doanh thu - giữ nguyên
    const totalRevenue = filteredRevenue.reduce((sum, item) => sum + item.amount, 0);

    // Tính doanh thu theo dịch vụ - giữ nguyên
    const revenueByService = filteredRevenue.reduce((acc, item) => {
        acc[item.service] = (acc[item.service] || 0) + item.amount;
        return acc;
    }, {});

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
                            ) : users.length > 0 ? (
                                users.map((user) => (
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
                        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Manage Revenue</h2>
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Tổng doanh thu: {totalRevenue.toLocaleString()} VNĐ
                            </h3>
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
                                <li
                                    key={item.id}
                                    className="grid grid-cols-4 gap-4 items-center text-center py-2 border-b border-gray-200"
                                >
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
                                <li
                                    key={index}
                                    className="grid grid-cols-2 gap-4 items-center text-center py-2 border-b border-gray-200"
                                >
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