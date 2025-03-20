import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AppointmentManagementSection = () => {
    const [appointments, setAppointments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [confirmLoading, setConfirmLoading] = useState({}); // Trạng thái loading cho từng lịch hẹn
    const [pageLoading, setPageLoading] = useState(true); // Trạng thái loading cho dữ liệu
    const appointmentsPerPage = 10; // Số lịch hẹn mỗi trang

    useEffect(() => {
        const fetchAppointments = async () => {
            setPageLoading(true); // Bật trạng thái loading cho dữ liệu
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
                    vaccines: appointment.vaccineDetailsList.map(vaccine => vaccine.doseName).join(", "),
                }));

                // Sắp xếp theo thời gian mới nhất
                formattedAppointments.sort((a, b) => {
                    const dateA = new Date(a.time);
                    const dateB = new Date(b.time);
                    return dateB - dateA; // Sắp xếp giảm dần (mới nhất trước)
                });

                setAppointments(formattedAppointments);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu lịch hẹn:", error);
                toast.error("Không thể lấy danh sách lịch hẹn!", {
                    position: "top-right",
                    autoClose: 3000,
                });
            } finally {
                setPageLoading(false); // Tắt trạng thái loading sau khi API hoàn tất
            }
        };

        fetchAppointments();
    }, []);

    const handleConfirmAppointment = async (id) => {
        setConfirmLoading((prev) => ({ ...prev, [id]: true }));

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token không tồn tại. Vui lòng đăng nhập lại!");
            }

            const response = await fetch(`/api/appointments/${id}/verify`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    accept: "*/*",
                },
                body: JSON.stringify({
                    status: "Confirmed",
                }),
            });

            if (!response.ok) {
                throw new Error("Không thể xác nhận lịch hẹn");
            }

            setAppointments((prev) =>
                prev.map((app) =>
                    app.id === id ? { ...app, status: "Confirmed" } : app
                )
            );
            toast.success("Lịch hẹn đã được xác nhận!", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error("Lỗi khi xác nhận lịch hẹn:", error);
            toast.error("Không thể xác nhận lịch hẹn!", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setConfirmLoading((prev) => ({ ...prev, [id]: false }));
        }
    };

    const handleCancelAppointment = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token không tồn tại. Vui lòng đăng nhập lại!");
            }

            const response = await fetch(`/api/appointments/${id}/verify`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    accept: "*/*",
                },
                body: JSON.stringify({
                    status: "Cancelled",
                }),
            });

            if (!response.ok) {
                throw new Error("Không thể hủy lịch hẹn");
            }

            setAppointments((prev) =>
                prev.map((app) =>
                    app.id === id ? { ...app, status: "Cancelled" } : app
                )
            );
            toast.error("Lịch hẹn đã bị hủy!", {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error("Lỗi khi hủy lịch hẹn:", error);
            toast.error("Không thể hủy lịch hẹn!", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    // Tính toán số lượng trang và dữ liệu hiển thị trên trang hiện tại
    const totalAppointments = appointments.length;
    const totalPages = Math.ceil(totalAppointments / appointmentsPerPage);
    const startIndex = (currentPage - 1) * appointmentsPerPage;
    const endIndex = startIndex + appointmentsPerPage;
    const currentAppointments = appointments.slice(startIndex, endIndex);

    // Hàm chuyển trang
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
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
                {pageLoading ? (
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
                ) : currentAppointments.length > 0 ? (
                    currentAppointments.map((appointment) => (
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
                                        disabled={confirmLoading[appointment.id]}
                                        className={`flex items-center px-2 py-1 rounded text-white ${
                                            confirmLoading[appointment.id]
                                                ? "bg-green-400 cursor-not-allowed"
                                                : "bg-green-600 hover:bg-green-700"
                                        }`}
                                    >
                                        {confirmLoading[appointment.id] ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-5 w-5 mr-2 text-white"
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
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            "Xác nhận"
                                        )}
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
                    ))
                ) : (
                    <li className="text-center py-4 text-gray-500">
                        Không có lịch hẹn nào.
                    </li>
                )}
            </ul>

            {/* Phân trang */}
            {totalAppointments > 0 && !pageLoading && (
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded ${
                            currentPage === 1
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                        Trang trước
                    </button>
                    <span>
                        Trang {currentPage} / {totalPages} (Tổng cộng: {totalAppointments} lịch hẹn)
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded ${
                            currentPage === totalPages
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                        Trang sau
                    </button>
                </div>
            )}
        </div>
    );
};

export default AppointmentManagementSection;