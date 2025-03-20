import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faEye, faVial, faCalendarCheck, faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const VaccinationProcess = () => {
    const router = useRouter();
    const [appointments, setAppointments] = useState([]);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Lấy thông tin người dùng từ localStorage
    useEffect(() => {
        // Đảm bảo chỉ thực hiện trên client-side
        if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('user');
            const savedToken = localStorage.getItem('token');

            if (savedUser) {
                try {
                    const user = JSON.parse(savedUser);
                    setUserId(user.userId || user.userID || user.id);
                } catch (error) {
                    console.error('Error parsing user data:', error);
                }
            }

            if (savedToken) {
                setToken(savedToken);
            }
        }
    }, []);

    // Lấy danh sách lịch hẹn từ API
    useEffect(() => {
        const fetchAppointments = async () => {
            if (!userId || !token) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                console.log("Fetching appointments with token:", token);
                console.log("User ID:", userId);

                const response = await fetch(`/api/appointment-getbyuserid/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("API Error Response:", errorText);
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                console.log("Appointments data:", data);

                // Đảm bảo mọi lịch hẹn đều có thông tin đầy đủ
                const processedData = data.map(appointment => {
                    // Nếu là lịch hẹn đã hủy mà thiếu thông tin, điền vào giá trị mặc định
                    if ((appointment.status === 'Cancelled' || appointment.status === 'Stored Vaccine' || appointment.status === 'Đã hủy') &&
                        (!appointment.childrenName || !appointment.appointmentDate || !appointment.timeStart)) {
                        return {
                            ...appointment,
                            childrenName: appointment.childrenName || "Chưa xác định",
                            appointmentDate: appointment.appointmentDate || new Date().toISOString(),
                            timeStart: appointment.timeStart || "10:00"
                        };
                    }
                    return appointment;
                });

                setAppointments(processedData);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, [userId, token]);

    const handleFeedback = (appointment) => {
        setSelectedAppointment(appointment);
        setShowFeedbackModal(true);
    };

    const handleViewDetail = (appointment) => {
        setSelectedAppointment(appointment);
        setShowDetailModal(true);
    };

    const handleCancelAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setCancelReason('');
        setShowCancelModal(true);
    };

    const submitCancelAppointment = async () => {
        if (!token) {
            alert('Bạn chưa đăng nhập. Vui lòng đăng nhập để hủy lịch hẹn.');
            return;
        }

        if (!cancelReason.trim()) {
            alert('Vui lòng nhập lý do hủy lịch hẹn.');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch(`/api/${selectedAppointment.appointmentId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    reason: cancelReason
                })
            });

            if (response.ok) {
                alert('Hủy lịch hẹn thành công!');
                setShowCancelModal(false);

                // Cập nhật trạng thái UI ngay lập tức - giữ nguyên thông tin, chỉ thay đổi trạng thái
                setAppointments(prevAppointments =>
                    prevAppointments.map(appointment =>
                        appointment.appointmentId === selectedAppointment.appointmentId
                            ? {
                                ...appointment,
                                status: 'Đã hủy',
                                // Đảm bảo giữ nguyên tất cả thông tin
                                childrenName: appointment.childrenName || selectedAppointment.childrenName,
                                appointmentDate: appointment.appointmentDate || selectedAppointment.appointmentDate,
                                timeStart: appointment.timeStart || selectedAppointment.timeStart,
                                vaccineDetailsList: appointment.vaccineDetailsList || selectedAppointment.vaccineDetailsList
                            }
                            : appointment
                    )
                );

                // Vẫn refresh dữ liệu từ server trong nền
                if (userId) {
                    const refreshResponse = await fetch(`/api/appointment-getbyuserid/${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (refreshResponse.ok) {
                        const refreshData = await refreshResponse.json();
                        // Đảm bảo dữ liệu từ server không ghi đè lên UI trong trường hợp thiếu thông tin
                        setAppointments(refreshData.map(newAppointment => {
                            // Nếu là appointment vừa bị hủy, kiểm tra các thông tin cần thiết
                            if (newAppointment.appointmentId === selectedAppointment.appointmentId) {
                                return {
                                    ...newAppointment,
                                    childrenName: newAppointment.childrenName || selectedAppointment.childrenName,
                                    appointmentDate: newAppointment.appointmentDate || selectedAppointment.appointmentDate,
                                    timeStart: newAppointment.timeStart || selectedAppointment.timeStart
                                };
                            }
                            return newAppointment;
                        }));
                    }
                }
            } else {
                const errorText = await response.text();
                console.error("Cancel API Error:", errorText);
                alert(`Có lỗi xảy ra khi hủy lịch hẹn: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            alert('Có lỗi xảy ra khi hủy lịch hẹn. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const submitFeedback = async () => {
        if (!token) {
            alert('Bạn chưa đăng nhập. Vui lòng đăng nhập để gửi đánh giá.');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch(`/api/appointments/${selectedAppointment.appointmentId}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    rating: rating,
                    comment: feedback
                })
            });

            if (response.ok) {
                alert('Cảm ơn bạn đã đánh giá!');
                setShowFeedbackModal(false);

                // Refresh lại danh sách lịch hẹn
                if (userId) {
                    const refreshResponse = await fetch(`/api/appointment-getbyuserid/${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (refreshResponse.ok) {
                        const refreshData = await refreshResponse.json();
                        setAppointments(refreshData);
                    }
                }
            } else {
                alert('Có lỗi xảy ra khi gửi đánh giá');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Có lỗi xảy ra khi gửi đánh giá');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Định dạng ngày tháng
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return format(date, 'dd/MM/yyyy', { locale: vi });
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    };

    // Tính tổng số lượng vaccine
    const calculateTotalVaccines = (appointment) => {
        if (!appointment.vaccineDetailsList || !Array.isArray(appointment.vaccineDetailsList)) {
            return 0;
        }
        return appointment.vaccineDetailsList.length;
    };

    // Tính tổng giá tiền
    const calculateTotalPrice = (appointment) => {
        if (!appointment.vaccineDetailsList || !Array.isArray(appointment.vaccineDetailsList)) {
            return 0;
        }
        return appointment.vaccineDetailsList.reduce((total, vaccine) => total + (vaccine.price || 0), 0);
    };

    // Format giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Lấy trạng thái văn bản từ mã trạng thái
    const getStatusText = (status) => {
        switch (status) {
            case 'Verified Coming':
                return 'Đã xác nhận';
            case 'Cancelled':
            case 'Stored Vaccine':
            case 'Đã hủy':
                return 'Đã hủy';
            case 'Pending':
                return 'Chờ xác nhận';
            case 'COMPLETED':
                return 'Hoàn thành';
            default:
                return status;
        }
    };

    // Lấy CSS class cho trạng thái
    const getStatusClass = (status) => {
        switch (status) {
            case 'Verified Coming':
                return 'bg-blue-100 text-blue-800';
            case 'Cancelled':
            case 'Stored Vaccine':
            case 'Đã hủy':
                return 'bg-red-100 text-red-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Kiểm tra xem lịch hẹn có thể hủy được không
    const canCancelAppointment = (appointment) => {
        // Chỉ hiển thị nút hủy cho các lịch hẹn có trạng thái Pending
        return appointment.status === 'Pending';
    };

    if (isLoading) {
        return (
            <DefaultLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </DefaultLayout>
        );
    }

    // Nếu không có thông tin người dùng, hiển thị thông báo đăng nhập
    if (!userId || !token) {
        return (
            <DefaultLayout>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-10">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Vui lòng đăng nhập</h2>
                        <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem lịch sử tiêm chủng</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
                        >
                            Đăng nhập ngay
                        </button>
                    </div>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Quan sát tiêm chủng</h1>

                {appointments.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Chưa có lịch tiêm nào</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left">Tên trẻ</th>
                                    <th className="px-6 py-3 text-left">Ngày tiêm</th>
                                    <th className="px-6 py-3 text-left">Giờ tiêm</th>
                                    <th className="px-6 py-3 text-left">Số loại vaccine</th>
                                    <th className="px-6 py-3 text-left">Trạng thái</th>
                                    <th className="px-6 py-3 text-left">Đánh giá</th>
                                    <th className="px-6 py-3 text-left">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {appointments.map((appointment) => {
                                    // Nếu là lịch đã hủy nhưng không có thông tin, hiển thị một cái gì đó thay thế
                                    const isEmptyCancelledAppointment =
                                        (appointment.status === 'Cancelled' || appointment.status === 'Stored Vaccine' || appointment.status === 'Đã hủy') &&
                                        (!appointment.childrenName && !appointment.appointmentDate && !appointment.timeStart);

                                    return (
                                        <tr key={appointment.appointmentId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                {appointment.childrenName || (isEmptyCancelledAppointment ? "Lịch đã hủy" : "—")}
                                            </td>
                                            <td className="px-6 py-4">
                                                {formatDate(appointment.appointmentDate) || (isEmptyCancelledAppointment ? "—" : "—")}
                                            </td>
                                            <td className="px-6 py-4">
                                                {appointment.timeStart || (isEmptyCancelledAppointment ? "—" : "—")}
                                            </td>
                                            <td className="px-6 py-4">{calculateTotalVaccines(appointment)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-sm ${getStatusClass(appointment.status)}`}>
                                                    {getStatusText(appointment.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {appointment.feedbacks && appointment.feedbacks.length > 0 ? (
                                                    <div className="flex items-center">
                                                        <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                                                        <span>{appointment.feedbacks[0].rating}/5</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">Chưa đánh giá</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <button
                                                    onClick={() => handleViewDetail(appointment)}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center"
                                                    title="Xem chi tiết"
                                                >
                                                    <FontAwesomeIcon icon={faEye} className="mr-1" />
                                                    Chi tiết
                                                </button>

                                                {appointment.status === 'COMPLETED' &&
                                                    (!appointment.feedbacks || appointment.feedbacks.length === 0) && (
                                                        <button
                                                            onClick={() => handleFeedback(appointment)}
                                                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center"
                                                            title="Đánh giá"
                                                        >
                                                            <FontAwesomeIcon icon={faStar} className="mr-1" />
                                                            Đánh giá
                                                        </button>
                                                    )}

                                                {canCancelAppointment(appointment) && (
                                                    <button
                                                        onClick={() => handleCancelAppointment(appointment)}
                                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center"
                                                        title="Hủy lịch hẹn"
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                                        Hủy lịch
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal Chi tiết lịch hẹn */}
                {showDetailModal && selectedAppointment && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Chi tiết lịch tiêm</h2>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                <div className="flex items-center mb-2">
                                    <FontAwesomeIcon icon={faCalendarCheck} className="text-blue-600 mr-2" />
                                    <h3 className="text-lg font-semibold text-blue-800">Thông tin lịch hẹn</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Mã lịch hẹn:</p>
                                        <p className="font-medium">{selectedAppointment.appointmentId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Trạng thái:</p>
                                        <p className={`font-medium ${getStatusClass(selectedAppointment.status)} inline-block px-2 py-1 rounded`}>
                                            {getStatusText(selectedAppointment.status)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Ngày tiêm:</p>
                                        <p className="font-medium">{formatDate(selectedAppointment.appointmentDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Giờ tiêm:</p>
                                        <p className="font-medium">{selectedAppointment.timeStart}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Ngày tạo:</p>
                                        <p className="font-medium">{selectedAppointment.createAt}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Lần cập nhật:</p>
                                        <p className="font-medium">{selectedAppointment.updateAt || "Chưa cập nhật"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg mb-4">
                                <div className="flex items-center mb-2">
                                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                    </svg>
                                    <h3 className="text-lg font-semibold text-green-800">Thông tin trẻ</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Họ tên:</p>
                                        <p className="font-medium">{selectedAppointment.childrenName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Giới tính:</p>
                                        <p className="font-medium">{selectedAppointment.childrenGender === 'male' ? 'Nam' : 'Nữ'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Ngày sinh:</p>
                                        <p className="font-medium">{formatDate(selectedAppointment.dateOfBirth)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Vấn đề sức khỏe:</p>
                                        <p className="font-medium">{selectedAppointment.medicalIssue || "Không có"}</p>
                                    </div>
                                </div>
                                {selectedAppointment.note && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600">Ghi chú:</p>
                                        <p className="font-medium">{selectedAppointment.note}</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                    <FontAwesomeIcon icon={faVial} className="text-yellow-600 mr-2" />
                                    <h3 className="text-lg font-semibold text-yellow-800">Danh sách vaccine</h3>
                                </div>

                                {selectedAppointment.vaccineDetailsList && selectedAppointment.vaccineDetailsList.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white border border-yellow-200 rounded-lg">
                                            <thead className="bg-yellow-100">
                                                <tr>
                                                    <th className="py-2 px-4 border-b border-yellow-200 text-left text-sm">Tên</th>
                                                    <th className="py-2 px-4 border-b border-yellow-200 text-left text-sm">Liều</th>
                                                    <th className="py-2 px-4 border-b border-yellow-200 text-left text-sm">Nhà sản xuất</th>
                                                    <th className="py-2 px-4 border-b border-yellow-200 text-left text-sm">Giá</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedAppointment.vaccineDetailsList.map((vaccine) => (
                                                    <tr key={vaccine.vaccineDetailsId} className="border-b border-yellow-100">
                                                        <td className="py-2 px-4">{vaccine.doseName}</td>
                                                        <td className="py-2 px-4">{vaccine.doseRequire}</td>
                                                        <td className="py-2 px-4">{vaccine.manufacturer}</td>
                                                        <td className="py-2 px-4">{formatPrice(vaccine.price)}</td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-yellow-50">
                                                    <td colSpan="3" className="py-2 px-4 font-semibold text-right">Tổng tiền:</td>
                                                    <td className="py-2 px-4 font-bold">{formatPrice(calculateTotalPrice(selectedAppointment))}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">Không có thông tin vaccine</p>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end gap-2">
                                {canCancelAppointment(selectedAppointment) && (
                                    <button
                                        onClick={() => {
                                            setShowDetailModal(false);
                                            handleCancelAppointment(selectedAppointment);
                                        }}
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                    >
                                        Hủy lịch hẹn
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Feedback */}
                {showFeedbackModal && selectedAppointment && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-bold mb-4">Đánh giá dịch vụ</h2>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Đánh giá sao</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Nhận xét của bạn</label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                    placeholder="Nhập nhận xét của bạn..."
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowFeedbackModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    disabled={isSubmitting}
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={submitFeedback}
                                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    Gửi đánh giá
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Hủy lịch hẹn */}
                {showCancelModal && selectedAppointment && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-red-600 flex items-center">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 mr-2" />
                                    Xác nhận hủy lịch hẹn
                                </h2>
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>

                            <div className="bg-red-50 p-4 mb-4 rounded">
                                <p className="text-red-800">
                                    Bạn có chắc chắn muốn hủy lịch hẹn tiêm chủng này không? Hành động này không thể hoàn tác.
                                </p>
                            </div>

                            <div className="mb-4">
                                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                    <h3 className="font-medium text-blue-800 mb-2">Thông tin lịch hẹn</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-sm text-gray-600">Tên trẻ:</p>
                                            <p className="font-medium">{selectedAppointment.childrenName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Ngày tiêm:</p>
                                            <p className="font-medium">{formatDate(selectedAppointment.appointmentDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Giờ tiêm:</p>
                                            <p className="font-medium">{selectedAppointment.timeStart}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Số loại vaccine:</p>
                                            <p className="font-medium">{calculateTotalVaccines(selectedAppointment)}</p>
                                        </div>
                                    </div>
                                </div>

                                <label className="block text-sm font-medium mb-2 text-gray-700">
                                    Vui lòng nhập lý do hủy lịch hẹn <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    rows="3"
                                    placeholder="Nhập lý do hủy lịch (bắt buộc)"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    disabled={isSubmitting}
                                >
                                    Quay lại
                                </button>
                                <button
                                    onClick={submitCancelAppointment}
                                    className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    Xác nhận hủy lịch
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default VaccinationProcess;