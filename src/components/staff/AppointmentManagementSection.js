import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AppointmentManagementSection = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [token, setToken] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // 10 lịch hẹn mỗi trang

    useEffect(() => {
        const authToken = localStorage.getItem('token');
        if (authToken) {
            setToken(authToken);
            fetchAppointments(authToken);
        } else {
            setLoading(false);
            toast.error('Bạn cần đăng nhập để xem trang này');
        }
    }, []);

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
            const sortedAppointments = data.sort((a, b) => {
                if (a.status === 'Pending' && b.status !== 'Pending') return -1;
                if (b.status === 'Pending' && a.status !== 'Pending') return 1;
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

            setAppointments((prevAppointments) =>
                prevAppointments.map((app) =>
                    app.appointmentId === appointmentId ? { ...app, status: 'Verified Coming' } : app
                )
            );
            toast.success('Xác nhận lịch hẹn thành công!');
            fetchAppointments(token);
        } catch (error) {
            console.error('Error verifying appointment:', error);
            toast.error(error.message || 'Có lỗi xảy ra khi xác nhận lịch hẹn');
        } finally {
            setActionLoading((prev) => ({ ...prev, [appointmentId]: false }));
        }
    };

    const markAppointmentAsComplete = async (appointmentId) => {
        if (!appointmentId) {
            toast.error('ID lịch hẹn không hợp lệ');
            return;
        }

        setActionLoading((prev) => ({ ...prev, [appointmentId]: true }));
        const toastId = toast.loading('Đang cập nhật trạng thái...');

        try {
            const response = await fetch(`/api/appointments/${appointmentId}/mark-successful`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Không thể cập nhật trạng thái lịch hẹn');
            }

            setAppointments((prevAppointments) =>
                prevAppointments.map((app) =>
                    app.appointmentId === appointmentId ? { ...app, status: 'Completed' } : app
                )
            );

            toast.update(toastId, {
                render: 'Đã cập nhật trạng thái thành công!',
                type: 'success',
                isLoading: false,
                autoClose: 3000,
            });
            await fetchAppointments(token);
        } catch (error) {
            console.error('Error marking appointment as complete:', error);
            toast.update(toastId, {
                render: error.message || 'Có lỗi xảy ra khi cập nhật trạng thái',
                type: 'error',
                isLoading: false,
                autoClose: 5000,
            });
        } finally {
            setActionLoading((prev) => ({ ...prev, [appointmentId]: false }));
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Not Paid': return 'Chưa Thanh Toán';
            case 'Pending': return 'Chờ xác nhận';
            case 'Verified Coming': return 'Đã xác nhận';
            case 'Cancelled': return 'Đã hủy';
            case 'Completed': return 'Đã hoàn thành';
            default: return status;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Verified Coming': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            case 'Completed': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const canVerify = (status) => status === 'Pending';
    const canMarkComplete = (status) => status === 'Verified Coming';

    // Logic phân trang
    const totalAppointments = appointments.length;
    const totalPages = Math.ceil(totalAppointments / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalAppointments);
    const paginatedAppointments = appointments.slice(startIndex, endIndex);

    // Hàm chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên trẻ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày hẹn</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giờ hẹn</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedAppointments.length > 0 ? (
                            paginatedAppointments.map((appointment) => (
                                <tr key={appointment.appointmentId}>
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
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(appointment.status)}`}>
                                            {getStatusText(appointment.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex space-x-2">
                                            {canVerify(appointment.status) && (
                                                <button
                                                    className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md flex items-center justify-center disabled:bg-green-400"
                                                    onClick={() => verifyAppointment(appointment.appointmentId)}
                                                    disabled={actionLoading[appointment.appointmentId]}
                                                >
                                                    {actionLoading[appointment.appointmentId] ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Đang xác nhận
                                                        </>
                                                    ) : (
                                                        'Xác nhận'
                                                    )}
                                                </button>
                                            )}
                                            {canMarkComplete(appointment.status) && (
                                                <button
                                                    className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md flex items-center justify-center disabled:bg-blue-400"
                                                    onClick={() => markAppointmentAsComplete(appointment.appointmentId)}
                                                    disabled={actionLoading[appointment.appointmentId]}
                                                >
                                                    {actionLoading[appointment.appointmentId] ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Đang cập nhật
                                                        </>
                                                    ) : (
                                                        'Hoàn thành'
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                    Không có lịch hẹn nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <div className="mt-4 flex justify-center space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                        Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
};

export default AppointmentManagementSection;