import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const AppointmentManagementSection = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [token, setToken] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [reactions, setReactions] = useState({});
    const [loadingReactions, setLoadingReactions] = useState(false);
    const [updatingReaction, setUpdatingReaction] = useState(null);
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

            // Tải dữ liệu phản ứng sau tiêm cho các lịch hẹn đã xác nhận
            const confirmedAppointments = sortedAppointments.filter(app => app.status === 'Verified Coming');
            if (confirmedAppointments.length > 0) {
                fetchReactionsForAppointments(confirmedAppointments, authToken);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchReactionsForAppointments = async (confirmedAppointments, authToken) => {
        setLoadingReactions(true);
        try {
            const reactionsData = {};

            await Promise.all(confirmedAppointments.map(async appointment => {
                try {
                    // Kiểm tra nếu lịch hẹn đã có phản ứng trong state
                    if (appointment.reactions && appointment.reactions.length > 0) {
                        reactionsData[appointment.appointmentId] = appointment.reactions[0];
                        return;
                    }

                    const response = await fetch(`/api/appointments/${appointment.appointmentId}`, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        console.warn(`Could not fetch reaction for appointment ${appointment.appointmentId}`);
                        return;
                    }

                    const appointmentData = await response.json();
                    if (appointmentData.reactions && appointmentData.reactions.length > 0) {
                        reactionsData[appointment.appointmentId] = appointmentData.reactions[0];
                    }
                } catch (error) {
                    console.error(`Error fetching reaction for appointment ${appointment.appointmentId}:`, error);
                }
            }));

            setReactions(reactionsData);
        } catch (error) {
            console.error('Error fetching reactions:', error);
        } finally {
            setLoadingReactions(false);
        }
    };

    const handleUpdateReaction = async (appointmentId, condition, qualified) => {
        setUpdatingReaction(appointmentId);
        try {
            const response = await fetch(`/api/appointmentDetails/${appointmentId}/record-reaction-and-set-qualification`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    condition: condition || 'Không có phản ứng',
                    qualified: qualified
                })
            });

            if (!response.ok) {
                throw new Error('Không thể cập nhật phản ứng sau tiêm');
            }

            // Cập nhật state
            setReactions(prev => ({
                ...prev,
                [appointmentId]: {
                    condition: condition || 'Không có phản ứng',
                    qualified: qualified
                }
            }));

            toast.success('Đã cập nhật phản ứng thành công!');
        } catch (error) {
            console.error('Error updating reaction:', error);
            toast.error('Có lỗi xảy ra khi cập nhật phản ứng sau tiêm');
        } finally {
            setUpdatingReaction(null);
        }
    };

    const verifyAppointment = async (appointmentId) => {
        setActionLoading((prev) => ({ ...prev, [appointmentId]: true }));
        try {
            const response = await fetch(`/api/appointmentsDetail/${appointmentId}/verify`, {
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

        // Kiểm tra xem lịch hẹn đã có phản ứng và đã đạt điều kiện chưa
        const reaction = reactions[appointmentId];
        if (!reaction) {
            toast.warning('Vui lòng nhập phản ứng sau tiêm trước khi hoàn thành');
            return;
        }

        if (reaction.qualified !== true) {
            toast.warning('Chỉ những lịch hẹn có phản ứng sau tiêm đạt yêu cầu mới có thể hoàn thành');
            return;
        }

        setActionLoading((prev) => ({ ...prev, [appointmentId]: true }));
        const toastId = toast.loading('Đang cập nhật trạng thái...');

        try {
            const response = await fetch(`/api/appointmentsDetail/${appointmentId}/mark-successful`, {
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

    const renderReactionColumn = (appointment) => {
        const appointmentId = appointment.appointmentId;
        const isConfirmed = appointment.status === 'Verified Coming';
        const isCompleted = appointment.status === 'Completed';
        const reaction = reactions[appointmentId];

        if (loadingReactions) {
            return <span className="text-gray-400">Đang tải...</span>;
        }

        // Nếu đã hoàn thành, chỉ hiển thị thông tin phản ứng, không cho phép chỉnh sửa
        if (isCompleted && reaction) {
            return (
                <div className="space-y-2">
                    <div className="text-sm">{reaction.condition || 'Không có phản ứng'}</div>
                    <div className="px-2 py-1 text-xs rounded-full inline-flex items-center bg-green-100 text-green-800 font-medium">
                        <FontAwesomeIcon icon={faCheck} className="mr-1" />
                        Đạt
                    </div>
                </div>
            );
        }

        // Nếu đã hoàn thành nhưng không có dữ liệu phản ứng
        if (isCompleted && !reaction) {
            return <span className="text-gray-500">Không có dữ liệu</span>;
        }

        // Nếu không phải trạng thái đã xác nhận
        if (!isConfirmed) {
            return <span className="text-gray-500">N/A</span>;
        }

        if (updatingReaction === appointmentId) {
            return (
                <div className="flex justify-center">
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            );
        }

        // Nếu đã có dữ liệu reaction và đang ở trạng thái Đã xác nhận
        if (reaction && isConfirmed) {
            return (
                <div className="space-y-2">
                    <div className="text-sm">{reaction.condition || 'Không có phản ứng'}</div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleUpdateReaction(appointmentId, reaction.condition, true)}
                            className={`px-2 py-1 text-xs rounded-full flex items-center ${reaction.qualified ? 'bg-green-100 text-green-800 font-medium' : 'bg-gray-100 text-gray-600'}`}
                            title="Đủ điều kiện tiêm"
                        >
                            <FontAwesomeIcon icon={faCheck} className="mr-1" />
                            Đạt
                        </button>
                        <button
                            onClick={() => handleUpdateReaction(appointmentId, reaction.condition, false)}
                            className={`px-2 py-1 text-xs rounded-full flex items-center ${reaction.qualified === false ? 'bg-red-100 text-red-800 font-medium' : 'bg-gray-100 text-gray-600'}`}
                            title="Không đủ điều kiện tiêm"
                        >
                            <FontAwesomeIcon icon={faTimes} className="mr-1" />
                            Không đạt
                        </button>
                    </div>
                </div>
            );
        }

        // Nếu chưa có dữ liệu reaction và đang ở trạng thái Đã xác nhận
        if (isConfirmed) {
            return (
                <div className="space-y-2">
                    <input
                        type="text"
                        placeholder="Nhập phản ứng"
                        className="w-full px-2 py-1 text-sm border rounded"
                        id={`reaction-input-${appointmentId}`}
                    />
                    <div className="flex space-x-2">
                        <button
                            onClick={() => {
                                const input = document.getElementById(`reaction-input-${appointmentId}`);
                                handleUpdateReaction(appointmentId, input.value, true);
                            }}
                            className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center"
                            title="Đủ điều kiện tiêm"
                        >
                            <FontAwesomeIcon icon={faCheck} className="mr-1" />
                            Đạt
                        </button>
                        <button
                            onClick={() => {
                                const input = document.getElementById(`reaction-input-${appointmentId}`);
                                handleUpdateReaction(appointmentId, input.value, false);
                            }}
                            className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full flex items-center"
                            title="Không đủ điều kiện tiêm"
                        >
                            <FontAwesomeIcon icon={faTimes} className="mr-1" />
                            Không đạt
                        </button>
                    </div>
                </div>
            );
        }

        return <span className="text-gray-500">N/A</span>;
    };

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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phản ứng sau tiêm</th>
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
                                    <td className="px-6 py-4">
                                        {renderReactionColumn(appointment)}
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
                                                    disabled={actionLoading[appointment.appointmentId] ||
                                                        !reactions[appointment.appointmentId] ||
                                                        reactions[appointment.appointmentId].qualified !== true}
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