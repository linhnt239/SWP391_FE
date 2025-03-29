// src/components/staff/SystemManagementSection.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const PaymentManagementSection = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [token, setToken] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const itemsPerPage = 10;

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
            const response = await fetch('/api/appointmentDetails/findAll', {
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
                if (a.paymentStatus === 'Pending' && b.paymentStatus !== 'Pending') return -1;
                if (b.paymentStatus === 'Pending' && a.paymentStatus !== 'Pending') return 1;
                return new Date(b.createAt) - new Date(a.createAt);
            });
            setAppointments(sortedAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const markAsPaid = async (appointmentId) => {
        if (!appointmentId) {
            toast.error('ID lịch hẹn không hợp lệ');
            return;
        }

        setActionLoading((prev) => ({ ...prev, [appointmentId]: true }));
        const toastId = toast.loading('Đang xác nhận thanh toán...');

        try {
            console.log('Attempting to mark as paid:', appointmentId);
            
            const response = await fetch(`/api/appointmentDetails/${appointmentId}/mark-paid`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const responseText = await response.text();
            console.log('Server response:', response.status, responseText);

            if (!response.ok) {
                let errorMessage;
                try {
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.message;
                } catch {
                    errorMessage = responseText;
                }
                throw new Error(errorMessage || 'Không thể xác nhận thanh toán');
            }

            toast.update(toastId, {
                render: 'Xác nhận thanh toán thành công!',
                type: 'success',
                isLoading: false,
                autoClose: 3000,
            });

            // Refresh data after successful update
            await fetchAppointments(token);

        } catch (error) {
            console.error('Error in markAsPaid:', error);
            toast.update(toastId, {
                render: error.message || 'Có lỗi xảy ra khi xác nhận thanh toán',
                type: 'error',
                isLoading: false,
                autoClose: 5000,
            });
        } finally {
            setActionLoading((prev) => ({ ...prev, [appointmentId]: false }));
        }
    };

    const getPaymentStatusText = (status) => {
        switch (status) {
            case 'Pending': return 'Chưa thanh toán';
            case 'Paid': return 'Đã thanh toán';
            default: return status;
        }
    };

    const getPaymentStatusClass = (status) => {
        switch (status) {
            case 'Pending': return 'bg-red-100 text-red-800';
            case 'Paid': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const canMarkAsPaid = (status) => {
        return status === 'Pending';
    };

    const formatDateTime = (date, time) => {
        const formattedDate = new Date(date).toLocaleDateString('vi-VN');
        let formattedTime = 'Chưa có giờ';
        
        if (time && typeof time.hour !== 'undefined' && typeof time.minute !== 'undefined') {
            formattedTime = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
        }
        
        return { formattedDate, formattedTime };
    };

    // Filter appointments
    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = appointment.childrenName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || appointment.paymentStatus === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalAppointments = filteredAppointments.length;
    const totalPages = Math.ceil(totalAppointments / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalAppointments);
    const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Quản lý thanh toán</h2>

            {/* Search and filter */}
            <div className="mb-4 flex flex-wrap gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="Pending">Chưa thanh toán</option>
                    <option value="Paid">Đã thanh toán</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên trẻ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày hẹn</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giờ hẹn</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phương thức thanh toán</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedAppointments.length > 0 ? (
                            paginatedAppointments.map((appointment) => {
                                const { formattedDate, formattedTime } = formatDateTime(
                                    appointment.appointmentDate,
                                    appointment.timeStart
                                );
                                return (
                                    <tr key={appointment.appointmentId}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {appointment.childrenName || 'Không có tên'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formattedDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formattedTime}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {appointment.paymentMethod || 'Chưa chọn'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusClass(appointment.paymentStatus)}`}>
                                                {getPaymentStatusText(appointment.paymentStatus)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {canMarkAsPaid(appointment.paymentStatus) && (
                                                <button
                                                    className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md flex items-center justify-center disabled:bg-green-400"
                                                    onClick={() => markAsPaid(appointment.appointmentDetailId)}
                                                    disabled={actionLoading[appointment.appointmentDetailId]}
                                                >
                                                    {actionLoading[appointment.appointmentDetailId] ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Đang xác nhận
                                                        </>
                                                    ) : (
                                                        'Xác nhận thanh toán'
                                                    )}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
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

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-4 flex justify-center space-x-2">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                    >
                        Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
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

export default PaymentManagementSection;