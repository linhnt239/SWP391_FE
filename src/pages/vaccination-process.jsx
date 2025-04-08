import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DefaultLayout from '@/components/layout/DefaultLayout';
import AppointmentTable from '@/components/vaccination/AppointmentTable';
import AppointmentDetailModal from '@/components/vaccination/AppointmentDetailModal';
import CancelAppointmentModal from '@/components/vaccination/CancelAppointmentModal';
import EditTimeModal from '@/components/vaccination/EditTimeModal';
import { useAppointments } from '@/hooks/useAppointments';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { toast } from 'react-toastify';
import FeedbackModal from '@/components/vaccination/FeedbackModal';

const VaccinationProcess = () => {
    const router = useRouter();
    const {
        appointments,
        isLoading,
        userId,
        token,
        refreshAppointments,
        submitCancelAppointment,
        submitFeedback,
        submitEditTime,
        calculateTotalVaccines,
        calculateTotalPrice,
        formatDate,
        formatPrice,
        getStatusText,
        getStatusClass,
        canCancelAppointment,
        canEditTime,
        canFeedback,
        setAppointments,
        getFeedback
    } = useAppointments();

    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showEditTimeModal, setShowEditTimeModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(5);
    const [cancelReason, setCancelReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editedTime, setEditedTime] = useState({ hour: 0, minute: 0, second: 0, nano: 0 });
    const [isEditingTime, setIsEditingTime] = useState(false);
    const [newAppointmentDate, setNewAppointmentDate] = useState('');
    const [newNote, setNewNote] = useState('');

    const handleSubmitFeedback = async () => {
        if (!feedback.trim()) {
            toast.error('Vui lòng nhập nội dung đánh giá');
            return;
        }

        try {
            setIsSubmitting(true);

            // Gửi feedback
            await submitFeedback(selectedAppointment.appointmentId, rating, feedback);

            // Đóng modal và reset form
            setShowFeedbackModal(false);
            setFeedback('');
            setRating(5);

            // Refresh lại danh sách để cập nhật UI
            await refreshAppointments();

            toast.success('Gửi đánh giá thành công!');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenDetail = (appointment) => {
        setSelectedAppointment(appointment);
        setShowDetailModal(true);
    };

    const handleOpenFeedback = (appointment) => {
        setSelectedAppointment(appointment);
        setShowFeedbackModal(true);
    };

    const handleCancelAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setCancelReason('');
        setShowCancelModal(true);
    };

    const handleEditTime = (appointment) => {
        setSelectedAppointment(appointment);

        if (appointment.timeStart) {
            const timeParts = appointment.timeStart.split(':');
            if (timeParts.length >= 2) {
                setEditedTime({
                    hour: parseInt(timeParts[0]) || 0,
                    minute: parseInt(timeParts[1]) || 0,
                    second: 0,
                    nano: 0
                });
            }
        }

        // Khởi tạo giá trị mặc định cho ngày hẹn và ghi chú
        setNewAppointmentDate(appointment.appointmentDate || '');
        setNewNote(appointment.note || '');

        setShowEditTimeModal(true);
    };

    const handleSubmitCancelAppointment = async () => {
        if (!token) {
            toast.error('Bạn chưa đăng nhập. Vui lòng đăng nhập để hủy lịch hẹn.');
            return;
        }

        if (!cancelReason.trim()) {
            toast.error('Vui lòng nhập lý do hủy lịch hẹn.');
            return;
        }

        try {
            setIsSubmitting(true);
            await submitCancelAppointment(selectedAppointment.appointmentId, cancelReason);
            toast.success('Hủy lịch hẹn thành công!');
            setShowCancelModal(false);
            await refreshAppointments();
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            toast.error('Có lỗi xảy ra khi hủy lịch hẹn. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitEditTime = async () => {
        if (!token) {
            toast.error('Bạn chưa đăng nhập. Vui lòng đăng nhập để chỉnh sửa lịch hẹn.');
            return;
        }

        if (selectedAppointment.status !== 'Pending') {
            toast.error('Chỉ lịch hẹn có trạng thái "Chờ xác nhận" mới có thể chỉnh sửa giờ hẹn.');
            setShowEditTimeModal(false);
            return;
        }

        // Kiểm tra ngày tiêm mới phải sau ngày hiện tại
        const currentDate = new Date();
        const newDate = new Date(newAppointmentDate);

        if (newDate < currentDate) {
            toast.error('Ngày tiêm mới phải sau ngày hiện tại');
            return;
        }

        try {
            setIsEditingTime(true);
            await submitEditTime(selectedAppointment, editedTime, newAppointmentDate, newNote);
            toast.success('Cập nhật lịch hẹn thành công!');
            setShowEditTimeModal(false);
            await refreshAppointments();
        } catch (error) {
            console.error('Error updating appointment:', error);
            toast.error('Có lỗi xảy ra khi cập nhật lịch hẹn. Vui lòng thử lại sau.');
        } finally {
            setIsEditingTime(false);
        }
    };

    if (isLoading) {
        return (
            <DefaultLayout>
                <LoadingSpinner />
            </DefaultLayout>
        );
    }

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
                    <EmptyState message="Chưa có lịch tiêm nào" />
                ) : (
                    <AppointmentTable
                        appointments={appointments}
                        formatDate={formatDate}
                        calculateTotalVaccines={calculateTotalVaccines}
                        getStatusText={getStatusText}
                        getStatusClass={getStatusClass}
                        canCancelAppointment={canCancelAppointment}
                        canEditTime={canEditTime}
                        canFeedback={canFeedback}
                        onOpenDetail={handleOpenDetail}
                        onOpenFeedback={handleOpenFeedback}
                        onEditTime={handleEditTime}
                        onCancelAppointment={handleCancelAppointment}
                    />
                )}

                {showDetailModal && selectedAppointment && (
                    <AppointmentDetailModal
                        appointment={selectedAppointment}
                        formatDate={formatDate}
                        formatPrice={formatPrice}
                        calculateTotalPrice={calculateTotalPrice}
                        getStatusText={getStatusText}
                        getStatusClass={getStatusClass}
                        canCancelAppointment={canCancelAppointment}
                        onClose={() => setShowDetailModal(false)}
                        onCancelAppointment={() => {
                            setShowDetailModal(false);
                            handleCancelAppointment(selectedAppointment);
                        }}
                    />
                )}

                {showFeedbackModal && selectedAppointment && (
                    <FeedbackModal
                        show={showFeedbackModal}
                        onClose={() => {
                            setShowFeedbackModal(false);
                            setFeedback('');
                            setRating(5);
                        }}
                        onSubmit={handleSubmitFeedback}
                        rating={rating}
                        setRating={setRating}
                        feedback={feedback}
                        setFeedback={setFeedback}
                        isSubmitting={isSubmitting}
                    />
                )}

                {showCancelModal && selectedAppointment && (
                    <CancelAppointmentModal
                        appointment={selectedAppointment}
                        cancelReason={cancelReason}
                        isSubmitting={isSubmitting}
                        formatDate={formatDate}
                        calculateTotalVaccines={calculateTotalVaccines}
                        onReasonChange={(e) => setCancelReason(e.target.value)}
                        onSubmit={handleSubmitCancelAppointment}
                        onClose={() => setShowCancelModal(false)}
                    />
                )}

                {showEditTimeModal && selectedAppointment && (
                    <EditTimeModal
                        appointment={selectedAppointment}
                        editedTime={editedTime}
                        isEditingTime={isEditingTime}
                        formatDate={formatDate}
                        onTimeChange={setEditedTime}
                        onSubmit={handleSubmitEditTime}
                        onClose={() => setShowEditTimeModal(false)}
                        newAppointmentDate={newAppointmentDate}
                        setNewAppointmentDate={setNewAppointmentDate}
                        newNote={newNote}
                        setNewNote={setNewNote}
                    />
                )}
            </div>
        </DefaultLayout>
    );
};

export default VaccinationProcess;