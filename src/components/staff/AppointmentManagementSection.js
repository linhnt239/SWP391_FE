import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AppointmentManagementSection = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Token không tồn tại. Vui lòng đăng nhập lại!");
                }

                const response = await fetch("/api/appointments-all", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        accept: "*/*",
                    },
                });

                if (!response.ok) {
                    throw new Error("Không thể lấy danh sách lịch hẹn");
                }

                const data = await response.json();

                // Chuẩn hóa dữ liệu
                const formattedAppointments = data.map(appointment => ({
                    id: appointment.appointmentId,
                    user: appointment.childrenName,
                    time: `${appointment.appointmentDate} ${appointment.timeStart}`,
                    status: appointment.status,
                    doctor: appointment.vaccineDetailsList.length > 0 ? appointment.vaccineDetailsList[0].manufacturer : "N/A",
                    vaccines: appointment.vaccineDetailsList.map(vaccine => vaccine.doseName).join(", ")
                }));

                setAppointments(formattedAppointments);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu lịch hẹn:", error);
                toast.error("Không thể lấy danh sách lịch hẹn!", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        };

        fetchAppointments();
    }, []);

    const handleConfirmAppointment = (id) => {
        setAppointments((prev) =>
            prev.map((app) =>
                app.id === id ? { ...app, status: "Confirmed" } : app
            )
        );
        toast.success("Lịch hẹn đã được xác nhận!", {
            position: "top-right",
            autoClose: 3000,
        });
    };

    const handleCancelAppointment = (id) => {
        setAppointments((prev) =>
            prev.map((app) =>
                app.id === id ? { ...app, status: "Cancelled" } : app
            )
        );
        toast.error("Lịch hẹn đã bị hủy!", {
            position: "top-right",
            autoClose: 3000,
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Appointment Management</h2>
            <div className="grid grid-cols-6 gap-4 text-center font-semibold bg-gray-200 p-2 rounded-t-md">
                <span>Người dùng</span>
                <span>Thời gian</span>
                <span>Trạng thái</span>
                <span>Bác sĩ</span>
                <span>Vaccine</span>
                <span>Hành động</span>
            </div>
            <ul className="space-y-2">
                {appointments.map((appointment) => (
                    <li
                        key={appointment.id}
                        className="grid grid-cols-6 gap-4 items-center text-center py-2 border-b border-gray-200"
                    >
                        <span>{appointment.user}</span>
                        <span>{appointment.time}</span>
                        <span
                            className={`px-2 py-1 rounded ${
                                appointment.status === "Pending"
                                    ? "bg-yellow-500 text-white"
                                    : appointment.status === "Confirmed"
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                            }`}
                        >
                            {appointment.status}
                        </span>
                        <span>{appointment.doctor}</span>
                        <span>{appointment.vaccines}</span>
                        <div className="flex justify-center space-x-2">
                            {appointment.status === "Pending" && (
                                <button
                                    onClick={() => handleConfirmAppointment(appointment.id)}
                                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                                >
                                    Xác nhận
                                </button>
                            )}
                            {appointment.status !== "Cancelled" && (
                                <button
                                    onClick={() => handleCancelAppointment(appointment.id)}
                                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                >
                                    Hủy
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AppointmentManagementSection;
