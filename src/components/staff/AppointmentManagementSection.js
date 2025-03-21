import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AppointmentManagementSection = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [token, setToken] = useState('');
    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // 10 lịch hẹn mỗi trang

    useEffect(() => {
        // Lấy token từ localStorage khi component được tạo
        const authToken = localStorage.getItem('token');
        if (authToken) {
            setToken(authToken);
            fetchAppointments(authToken);
        } else {
            setLoading(false);
            toast.error('Bạn cần đăng nhập để xem trang này');
        }
    }, []);

    // Hàm lấy danh sách cuộc hẹn từ API
    const fetchAppointments = async (authToken) => {
        try {
            const response = await fetch('/api/appointments-all', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Không thể lấy danh sách lịch hẹn');
            }

            const data = await response.json();
            // Sắp xếp danh sách lịch hẹn:
            // 1. Ưu tiên các lịch hẹn có trạng thái "Pending" lên đầu
            // 2. Trong mỗi nhóm (Pending và không phải Pending), sắp xếp theo ngày hẹn mới nhất (appointmentDate)
            const sortedAppointments = data.sort((a, b) => {
                // Nếu a là Pending mà b không phải Pending, a lên trước
                if (a.status === 'Pending' && b.status !== 'Pending') return -1;
                // Nếu b là Pending mà a không phải Pending, b lên trước
                if (b.status === 'Pending' && a.status !== 'Pending') return 1;
                // Nếu cả hai cùng trạng thái (cùng là Pending hoặc cùng không phải Pending), sắp xếp theo ngày hẹn
                return new Date(b.appointmentDate) - new Date(a.appointmentDate);
            });
            setAppointments(sortedAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Hàm xác nhận lịch hẹn sử dụng API PUT /api/appointments/{appointmentId}/verify
    const verifyAppointment = async (appointmentId) => {
        setActionLoading((prev) => ({ ...prev, [appointmentId]: true }));

        try {
            const response = await fetch(`/api/appointments/${appointmentId}/verify`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'accept': '*/*',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể xác nhận lịch hẹn');
            }

            // Cập nhật trạng thái lịch hẹn trong state sau khi xác nhận thành công
            setAppointments((prevAppointments) =>
                prevAppointments.map((app) =>
                    app.appointmentId === appointmentId
                        ? { ...app, status: 'Verified Coming' }
                        : app
                )
            );

            toast.success('Xác nhận lịch hẹn thành công!');

            // Cập nhật lại danh sách từ server để đảm bảo dữ liệu đồng bộ
            fetchAppointments(token);
        } catch (error) {
            console.error('Error verifying appointment:', error);
            toast.error(error.message || 'Có lỗi xảy ra khi xác nhận lịch hẹn');
        } finally {
            setActionLoading((prev) => ({ ...prev, [appointmentId]: false }));
        }
    };

    // Hàm hiển thị trạng thái lịch hẹn dưới dạng text
    const getStatusText = (status) => {
        switch (status) {
            case 'Pending':
                return 'Chờ xác nhận';
            case 'Verified Coming':
                return 'Đã xác nhận';
            case 'Cancelled':
                return 'Đã hủy';
            case 'COMPLETED':
                return 'Đã hoàn thành';
            default:
                return status;
        }
    };

    // Hàm trả về class CSS dựa trên trạng thái
    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Verified Coming':
                return 'bg-green-100 text-green-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            case 'COMPLETED':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Hàm kiểm tra xem một lịch hẹn có thể được xác nhận hay không
    const canVerify = (status) => {
        return status === 'Pending';
    };

    // Phân trang cho danh sách lịch hẹn
    const totalAppointments = appointments.length;
    const totalPages = Math.ceil(totalAppointments / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAppointments = appointments.slice(startIndex, endIndex);

    // Hiển thị loading khi đang tải dữ liệu
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Quản lý lịch hẹn</h2>

            {/* Bảng hiển thị danh sách lịch hẹn */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Mã lịch hẹn
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Tên trẻ
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Ngày hẹn
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Giờ hẹn
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Trạng thái
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedAppointments.length > 0 ? (
                            paginatedAppointments.map((appointment) => (
                                <tr key={appointment.appointmentId}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {appointment.appointmentId.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {appointment.childrenName || 'Không có tên'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(appointment.appointmentDate).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {appointment.timeStart}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                                                appointment.status
                                            )}`}
                                        >
                                            {getStatusText(appointment.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex space-x-2">
                                            {/* Nút xác nhận lịch hẹn - chỉ hiển thị nếu trạng thái là Pending */}
                                            {canVerify(appointment.status) && (
                                                <button
                                                    className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md flex items-center justify-center"
                                                    onClick={() => verifyAppointment(appointment.appointmentId)}
                                                    disabled={actionLoading[appointment.appointmentId]}
                                                >
                                                    {actionLoading[appointment.appointmentId] ? (
                                                        <>
                                                            <svg
                                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                                                ></circle>
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                ></path>
                                                            </svg>
                                                            Đang xác nhận
                                                        </>
                                                    ) : (
                                                        'Xác nhận'
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                    Không có lịch hẹn nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="flex justify-center space-x-2 mt-4">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        disabled={currentPage === 1}
                    >
                        Trang trước
                    </button>
                    <span className="px-4 py-2">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        disabled={currentPage === totalPages}
                    >
                        Trang sau
                    </button>
                </div>
            )}
        </div>
    );
};

export default AppointmentManagementSection;