import React, { useState, useEffect } from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';

const InjectionHistory = () => {
    const [injectionData, setInjectionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [groupedData, setGroupedData] = useState({});
    const [appointmentDetails, setAppointmentDetails] = useState({});
    const [loadingDetails, setLoadingDetails] = useState({});

    useEffect(() => {
        fetchInjectionHistory();
    }, []);

    const fetchInjectionHistory = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');

            if (!user || !token) {
                setError('Vui lòng đăng nhập để xem lịch sử tiêm chủng');
                setLoading(false);
                return;
            }

            const userId = user.userID;

            const response = await fetch(`/api/user/injection-history?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Lỗi API: ${response.status}`);
            }

            const result = await response.json();
            console.log('Dữ liệu lịch sử tiêm:', result);

            if (result && result.data) {
                setInjectionData(result.data);

                // Nhóm dữ liệu theo childrenId
                const grouped = {};
                result.data.forEach(item => {
                    if (!grouped[item.childrenId]) {
                        grouped[item.childrenId] = {
                            childrenName: item.childrenName,
                            injections: []
                        };
                    }
                    grouped[item.childrenId].injections.push(item);
                });

                // Sắp xếp theo ngày gần nhất
                Object.keys(grouped).forEach(childId => {
                    grouped[childId].injections.sort((a, b) =>
                        new Date(b.injectionDate) - new Date(a.injectionDate)
                    );
                });

                setGroupedData(grouped);

                // Sau khi có dữ liệu, lấy thông tin chi tiết của từng lịch hẹn
                const allAppointmentIds = result.data.map(item => item.appointmentId);
                fetchAppointmentDetails(allAppointmentIds, token);
            }

            setError(null);
        } catch (err) {
            console.error('Lỗi khi lấy lịch sử tiêm:', err);
            setError(`Không thể lấy lịch sử tiêm chủng: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchAppointmentDetails = async (appointmentIds, token) => {
        const detailsObj = {};
        const loadingObj = {};

        // Khởi tạo trạng thái loading cho từng appointment
        appointmentIds.forEach(id => {
            loadingObj[id] = true;
        });

        setLoadingDetails(loadingObj);

        // Lấy thông tin chi tiết cho từng lịch hẹn
        for (const appointmentId of appointmentIds) {
            try {
                // Sử dụng đúng endpoint từ Swagger UI: /api/appointment/{appointmentId}
                const response = await fetch(`/api/appointment/${appointmentId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': '*/*'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(`Chi tiết lịch hẹn ${appointmentId}:`, data);
                    detailsObj[appointmentId] = data;
                } else {
                    console.warn(`Không thể lấy thông tin chi tiết cho lịch hẹn ${appointmentId}. Status: ${response.status}`);
                }
            } catch (error) {
                console.error(`Lỗi khi lấy thông tin chi tiết lịch hẹn ${appointmentId}:`, error);
            } finally {
                // Cập nhật trạng thái loading cho appointment này
                setLoadingDetails(prev => ({
                    ...prev,
                    [appointmentId]: false
                }));
            }
        }

        console.log('Tất cả chi tiết lịch hẹn:', detailsObj);
        setAppointmentDetails(detailsObj);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
        } catch (error) {
            return dateString;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Not Paid': return 'Chưa thanh toán';
            case 'Pending': return 'Chờ xác nhận';
            case 'Verified Coming': return 'Đã xác nhận';
            case 'Cancelled': return 'Đã hủy';
            case 'Completed': return 'Đã hoàn thành';
            default: return status || 'Không xác định';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Not Paid': return 'text-yellow-700 bg-yellow-100';
            case 'Pending': return 'text-blue-700 bg-blue-100';
            case 'Verified Coming': return 'text-green-700 bg-green-100';
            case 'Cancelled': return 'text-red-700 bg-red-100';
            case 'Completed': return 'text-purple-700 bg-purple-100';
            default: return 'text-gray-700 bg-gray-100';
        }
    };

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-blue-800 mb-6">Lịch sử tiêm chủng</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {Object.keys(groupedData).length === 0 ? (
                            <div className="bg-white shadow-md rounded-lg p-6 text-center">
                                <h2 className="text-xl font-semibold text-gray-700 mb-2">Chưa có lịch sử tiêm chủng</h2>
                                <p className="text-gray-500">Bạn chưa có thông tin tiêm chủng nào được ghi nhận</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {Object.entries(groupedData).map(([childId, data]) => (
                                    <div key={childId} className="bg-white shadow-md rounded-lg overflow-hidden">
                                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                                            <h2 className="text-xl font-bold text-white">{data.childrenName}</h2>
                                        </div>

                                        <div className="p-6">
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Tên mũi tiêm
                                                            </th>

                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Ngày tiêm
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Trạng thái
                                                            </th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                                                                Thông tin lịch hẹn
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {data.injections.map((injection, index) => (
                                                            <tr key={injection.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-700">
                                                                    {injection.doseName}
                                                                </td>

                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                    {formatDate(injection.injectionDate)}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                    {appointmentDetails[injection.appointmentId] ? (
                                                                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(appointmentDetails[injection.appointmentId].status)}`}>
                                                                            {getStatusText(appointmentDetails[injection.appointmentId].status)}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-gray-500">—</span>
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                                    {loadingDetails[injection.appointmentId] ? (
                                                                        <div className="animate-pulse text-gray-400">Đang tải...</div>
                                                                    ) : appointmentDetails[injection.appointmentId] ? (
                                                                        <div className="space-y-2">
                                                                            <div>
                                                                                <span className="text-gray-500">Thời gian hẹn: </span>
                                                                                <span>{appointmentDetails[injection.appointmentId].timeStart || '—'}</span>
                                                                            </div>

                                                                            {/* Hiển thị ngày đặt lịch */}
                                                                            <div>
                                                                                <span className="text-gray-500">Ngày đặt lịch: </span>
                                                                                <span>{appointmentDetails[injection.appointmentId].createAt ?
                                                                                    formatDate(appointmentDetails[injection.appointmentId].createAt) : '—'}</span>
                                                                            </div>

                                                                            {/* Hiển thị thông tin vaccine */}
                                                                            {appointmentDetails[injection.appointmentId].vaccineDetailsList &&
                                                                                appointmentDetails[injection.appointmentId].vaccineDetailsList.length > 0 && (
                                                                                    <div>
                                                                                        <span className="text-gray-500 font-medium block mb-1">Thông tin vaccine:</span>
                                                                                        <ul className="pl-4 space-y-1">
                                                                                            {appointmentDetails[injection.appointmentId].vaccineDetailsList.map((vaccine, idx) => (
                                                                                                <li key={idx} className="text-xs">
                                                                                                    <div className="border border-gray-200 rounded p-2 bg-gray-50">
                                                                                                        <div className="font-medium text-blue-600">{vaccine.doseName}</div>
                                                                                                        <div className="flex justify-between">

                                                                                                            <span className="font-medium text-green-600">
                                                                                                                {Intl.NumberFormat('vi-VN', {
                                                                                                                    style: 'currency',
                                                                                                                    currency: 'VND'
                                                                                                                }).format(vaccine.price || 0)}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </li>
                                                                                            ))}
                                                                                        </ul>
                                                                                    </div>
                                                                                )}

                                                                            {/* Hiển thị tổng tiền nếu có */}


                                                                            {/* Hiển thị ghi chú nếu có */}
                                                                            {appointmentDetails[injection.appointmentId].note && (
                                                                                <div>
                                                                                    <span className="text-gray-500">Ghi chú: </span>
                                                                                    <span className="italic">{appointmentDetails[injection.appointmentId].note}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-gray-500">Không có thông tin</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </DefaultLayout>
    );
};

export default InjectionHistory;