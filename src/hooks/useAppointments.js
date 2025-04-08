import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'react-toastify';

export const useAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

    // Lấy thông tin người dùng từ localStorage
    useEffect(() => {
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
        if (userId && token) {
            fetchAppointments();
        } else {
            setIsLoading(false);
        }
    }, [userId, token]);

    // Hàm fetch dữ liệu lịch hẹn
    const fetchAppointments = async () => {
        if (!userId || !token) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);

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

            // Lọc bỏ các bản ghi trùng lặp dựa trên appointmentId
            const uniqueAppointmentIds = new Set();
            const uniqueAppointments = data.filter(appointment => {
                if (uniqueAppointmentIds.has(appointment.appointmentId)) {
                    return false; // Bỏ qua bản ghi trùng lặp
                }
                uniqueAppointmentIds.add(appointment.appointmentId);
                return true;
            });

            // Chuẩn hóa dữ liệu - đảm bảo trạng thái hủy được thống nhất
            const processedData = uniqueAppointments.map(appointment => {
                if (
                    appointment.status === 'Cancelled' ||
                    appointment.status === 'Canceled' ||
                    appointment.status === 'Stored Vaccine' ||
                    appointment.status === 'Đã hủy' ||
                    (appointment.status && (
                        appointment.status.toLowerCase().includes('hủy') ||
                        appointment.status.toLowerCase().includes('cancel')
                    ))
                ) {
                    return {
                        ...appointment,
                        status: 'Cancelled' // Thống nhất thành một trạng thái duy nhất trong dữ liệu
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

    // Hàm gửi đánh giá
    const submitFeedback = async (appointmentId, rating, feedback) => {
        if (!token || !userId) {
            throw new Error('Bạn cần đăng nhập để gửi đánh giá');
        }

        try {
            const response = await fetch(`/api/feedback-create/${userId}/${appointmentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    rating: rating.toString(),
                    context: feedback
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API Error Response:", errorText);
                throw new Error(`API error: ${response.status}`);
            }

            // Cập nhật state appointments sau khi gửi feedback thành công
            setAppointments(prevAppointments =>
                prevAppointments.map(apt => {
                    if (apt.appointmentId === appointmentId) {
                        return {
                            ...apt,
                            feedbacks: [
                                ...(apt.feedbacks || []),
                                {
                                    rating: rating.toString(),
                                    context: feedback,
                                    createAt: new Date().toISOString()
                                }
                            ]
                        };
                    }
                    return apt;
                })
            );

            return await response.json();
        } catch (error) {
            console.error('Error submitting feedback:', error);
            throw error;
        }
    };

    // Hàm hủy lịch hẹn
    const submitCancelAppointment = async (appointmentId, reason) => {
        if (!token) throw new Error('Unauthorized');

        const response = await fetch(`/api/${appointmentId}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ reason })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Cancel API Error:", errorText);
            throw new Error(`API error: ${response.status}`);
        }

        // Cập nhật UI ngay lập tức
        setAppointments(prevAppointments =>
            prevAppointments.map(appointment =>
                appointment.appointmentId === appointmentId
                    ? { ...appointment, status: 'Cancelled' }
                    : appointment
            )
        );

        return true;
    };

    // Hàm cập nhật giờ hẹn và ngày tiêm
    const submitEditTime = async (appointment, editedTime, newAppointmentDate, newNote) => {
        if (!token) throw new Error('Unauthorized');

        // Kiểm tra ngày tiêm mới phải sau ngày hiện tại
        const currentDate = new Date();
        const newDate = new Date(newAppointmentDate);

        if (newDate < currentDate) {
            throw new Error('Ngày tiêm mới phải sau ngày hiện tại');
        }

        // Kiểm tra ngày tiêm mới phải sau ngày tiêm hiện tại
        const currentAppointmentDate = new Date(appointment.appointmentDate);
        if (newDate < currentAppointmentDate) {
            throw new Error('Ngày tiêm mới phải sau ngày tiêm đã đặt');
        }

        // Tạo đối tượng timeStart theo định dạng yêu cầu của API
        const timeStartObj = {
            hour: editedTime.hour,
            minute: editedTime.minute,
            second: 0,
            nano: 0
        };

        // Chuẩn bị dữ liệu đầy đủ cho request, giữ nguyên tất cả các trường hiện có
        const fullRequestData = {
            childrenName: appointment.childrenName || "",
            note: newNote || appointment.note || "",
            medicalIssue: appointment.medicalIssue || "",
            childrenGender: appointment.childrenGender || "",
            dateOfBirth: appointment.dateOfBirth || "",
            appointmentDate: newAppointmentDate || appointment.appointmentDate,
            timeStart: timeStartObj
        };

        try {
            // Thử với định dạng object
            const response = await fetch(`/api/appointments/${appointment.appointmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(fullRequestData)
            });

            if (response.ok) {
                // Cập nhật UI ngay lập tức
                const formattedTime = `${editedTime.hour.toString().padStart(2, '0')}:${editedTime.minute.toString().padStart(2, '0')}`;

                setAppointments(prevAppointments =>
                    prevAppointments.map(apt =>
                        apt.appointmentId === appointment.appointmentId
                            ? {
                                ...apt,
                                timeStart: formattedTime,
                                appointmentDate: newAppointmentDate || apt.appointmentDate,
                                note: newNote || apt.note
                            }
                            : apt
                    )
                );

                return true;
            }

            // Nếu không thành công, thử với format chuỗi
            const alternativeData = {
                ...fullRequestData,
                timeStart: `${editedTime.hour.toString().padStart(2, '0')}:${editedTime.minute.toString().padStart(2, '0')}`
            };

            const alternativeResponse = await fetch(`/api/appointments/${appointment.appointmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(alternativeData)
            });

            if (!alternativeResponse.ok) {
                throw new Error(`API error: ${alternativeResponse.status}`);
            }

            // Cập nhật UI ngay lập tức
            const formattedTime = `${editedTime.hour.toString().padStart(2, '0')}:${editedTime.minute.toString().padStart(2, '0')}`;

            setAppointments(prevAppointments =>
                prevAppointments.map(apt =>
                    apt.appointmentId === appointment.appointmentId
                        ? {
                            ...apt,
                            timeStart: formattedTime,
                            appointmentDate: newAppointmentDate || apt.appointmentDate,
                            note: newNote || apt.note
                        }
                        : apt
                )
            );

            return true;
        } catch (error) {
            console.error("Error updating appointment:", error);
            throw error;
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
            case 'Not Paid':
                return 'Chưa Thanh Toán';
            case 'Verified Coming':
                return 'Đã xác nhận';
            case 'Cancelled':
            case 'Canceled':
            case 'Stored Vaccine':
            case 'Đã hủy':
                return 'Đã hủy';
            case 'Pending':
                return 'Chờ xác nhận';
            case 'Completed':
                return 'Hoàn thành';
            default:
                if (status && (status.toLowerCase().includes('hủy') || status.toLowerCase().includes('cancel'))) {
                    return 'Đã hủy';
                }
                return status;
        }
    };

    // Lấy CSS class cho trạng thái
    const getStatusClass = (status) => {
        switch (status) {
            case 'Verified Coming':
                return 'bg-blue-100 text-blue-800';
            case 'Cancelled':
            case 'Canceled':
            case 'Stored Vaccine':
            case 'Đã hủy':
                return 'bg-red-100 text-red-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Completed':
                return 'bg-green-100 text-green-800';
            default:
                if (status && (status.toLowerCase().includes('hủy') || status.toLowerCase().includes('cancel'))) {
                    return 'bg-red-100 text-red-800';
                }
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Kiểm tra xem lịch hẹn có thể hủy được không
    const canCancelAppointment = (appointment) => {
        // Chỉ hiển thị nút hủy cho các lịch hẹn có trạng thái Pending
        return appointment.status === 'Pending';
    };

    // Kiểm tra xem lịch hẹn có thể chỉnh sửa giờ không
    const canEditTime = (appointment) => {
        // Chỉ cho phép chỉnh sửa khi trạng thái là Pending (Chờ xác nhận)
        return appointment.status === 'Pending';
    };

    // Làm mới dữ liệu lịch hẹn
    const refreshAppointments = async () => {
        await fetchAppointments();
    };

    // Thêm vào các hàm hiện có
    const canFeedback = (status) => {
        return status === 'Completed';
    };

    // Thêm hàm getFeedback vào hook useAppointments
    const getFeedback = async (appointmentId) => {
        if (!token) return null;

        try {
            console.log(`Fetching feedback for appointment ${appointmentId}`);

            // Sử dụng endpoint chính xác từ Swagger
            const response = await fetch(`/api/feedbacks-getByAppointmentId/${appointmentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error(`Error fetching feedback for appointment ${appointmentId}: ${response.status}`);
                return null;
            }

            const data = await response.json();
            console.log(`Feedback data for appointment ${appointmentId}:`, data);
            return data;
        } catch (error) {
            console.error(`Error fetching feedback for appointment ${appointmentId}:`, error);
            return null;
        }
    };

    return {
        appointments,
        isLoading,
        userId,
        token,
        refreshAppointments,
        submitCancelAppointment,
        submitFeedback,
        submitEditTime,
        calculateTotalPrice,
        formatDate,
        formatPrice,
        getStatusText,
        getStatusClass,
        canCancelAppointment,
        canEditTime,
        canFeedback,
        getFeedback,
    };
}; 