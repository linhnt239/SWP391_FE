// src/pages/staff.js
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/staff/Sidebar";
import OverviewSection from "../components/staff/OverviewSection";
import VaccineManagementSection from "../components/staff/VaccineManagementSection";
import FeedbackSection from "../components/staff/FeedbackSection";

import VaccineDetailModal from "../components/staff/VaccineDetailModal";
import { useRouter } from "next/router";
import AppointmentManagementSection from "@/components/staff/AppointmentManagementSection";
import PaymentManagementSection from "@/components/staff/PaymentManagementSection";
import News from "../components/staff/News";

const Staff = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [showAddVaccineForm, setShowAddVaccineForm] = useState(false);
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [vaccines, setVaccines] = useState([]);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      user: "Nguyen Van A",
      time: "10:00 AM - 11:00 AM",
      status: "Pending",
      doctor: "Dr. B",
    },
    {
      id: 2,
      user: "Tran Thi B",
      time: "1:00 PM - 2:00 PM",
      status: "Confirmed",
      doctor: "Dr. C",
    },
  ]);
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      user: "Nguyen Van A",
      rating: 4,
      comment: "Dịch vụ tốt!",
      response: "",
    },
    {
      id: 2,
      user: "Tran Thi B",
      rating: 3,
      comment: "Chờ hơi lâu.",
      response: "",
    },
  ]);
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Tiêm vaccine trẻ em",
      description: "Dịch vụ tiêm vaccine cơ bản",
    },
  ]);
  const [newVaccine, setNewVaccine] = useState({
    illnessName: "",
    description: "",
    ageLimit: 0,
  });
  const [editVaccineId, setEditVaccineId] = useState(null);
  const [editVaccine, setEditVaccine] = useState({
    name: "",
    stock: 0,
    price: 0,
  });
  const [newService, setNewService] = useState({ name: "", description: "" });
  const [editServiceId, setEditServiceId] = useState(null);
  const [editService, setEditService] = useState({ name: "", description: "" });
  const [responseText, setResponseText] = useState("");
  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
  const [loading, setLoading] = useState(false); // Loading cho nút Lưu Vaccine
  const [deleteLoading, setDeleteLoading] = useState({}); // Loading cho từng nút Xóa
  const [error, setError] = useState(null);

  // State cho modal Vaccine Detail
  const [showVaccineDetailModal, setShowVaccineDetailModal] = useState(false);
  const [selectedVaccineId, setSelectedVaccineId] = useState(null);
  const [vaccineDetail, setVaccineDetail] = useState({
    doseRequire: 0,
    doseName: "",
    imageUrl: "",
    manufacturer: "",
    quantity: 0,
    stock: 0,
    dateBetweenDoses: 0,
    price: 0,
  });
  const [vaccineDetailLoading, setVaccineDetailLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token không tồn tại. Vui lòng đăng nhập lại!");
        }

        const response = await fetch("/api/vaccines-all", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            accept: "*/*",
          },
        });

        if (!response.ok) {
          throw new Error("Không thể lấy danh sách vaccine");
        }

        const data = await response.json();
        setVaccines(data);
      } catch (err) {
        setError(err.message);
        console.error("Lỗi khi lấy dữ liệu vaccine:", err);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchVaccines();
  }, []);

  // Thêm vaccine bằng API POST với token
  const handleAddVaccine = async () => {
    if (
      !newVaccine.illnessName ||
      !newVaccine.descriptions ||
      newVaccine.ageLimit < 0
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin hợp lệ!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token không tồn tại. Vui lòng đăng nhập lại!");
      }

      const response = await fetch("/api/vaccines-create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          illnessName: newVaccine.illnessName,
          descriptions: newVaccine.descriptions,
          ageLimit: newVaccine.ageLimit,
        }),
      });

      if (!response.ok) {
        throw new Error("Tạo vaccine thất bại");
      }

      const data = await response.json();
      setVaccines([...vaccines, data]);
      setNewVaccine({ illnessName: "", description: "", ageLimit: 0 });
      setShowAddVaccineForm(false);
      toast.success("Tạo vaccine thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      setError(err.message);
      console.error("Lỗi khi tạo vaccine:", err);
      toast.error("Tạo vaccine thất bại. Vui lòng thử lại!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Xóa vaccine bằng API DELETE với token
  const handleDeleteVaccine = async (vaccineId) => {
    setDeleteLoading((prev) => ({ ...prev, [vaccineId]: true }));
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token không tồn tại. Vui lòng đăng nhập lại!");
      }

      const response = await fetch(`/api/vaccines-delete/${vaccineId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          accept: "*/*",
        },
      });

      if (!response.ok) {
        throw new Error("Xóa vaccine thất bại");
      }

      // Xóa vaccine khỏi danh sách
      setVaccines(vaccines.filter((v) => v.vaccineId !== vaccineId));
      toast.success("Xóa vaccine thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Lỗi khi xóa vaccine:", err);
      toast.error("Xóa vaccine thất bại. Vui lòng thử lại!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [vaccineId]: false }));
    }
  };

  // Mở modal để thêm Vaccine Detail
  const handleOpenVaccineDetailModal = (vaccineId) => {
    setSelectedVaccineId(vaccineId);
    setShowVaccineDetailModal(true);
  };

  // Đóng modal
  const handleCloseVaccineDetailModal = () => {
    setShowVaccineDetailModal(false);
    setSelectedVaccineId(null);
    setVaccineDetail({
      doseRequire: 0,
      doseName: "",
      imageUrl: "",
      manufacturer: "",
      quantity: 0,
      stock: 0,
      dateBetweenDoses: 0,
      price: 0,
    });
  };

  // Thêm Vaccine Detail bằng API POST
  const handleAddVaccineDetail = async () => {
    if (
      !vaccineDetail.doseName ||
      !vaccineDetail.manufacturer ||
      vaccineDetail.quantity < 0 ||
      vaccineDetail.stock < 0 ||
      vaccineDetail.price < 0 ||
      vaccineDetail.doseRequire < 0 ||
      vaccineDetail.dateBetweenDoses < 0
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin hợp lệ!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setVaccineDetailLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token không tồn tại. Vui lòng đăng nhập lại!");
      }

      const response = await fetch(
        `/api/vaccine-details/${selectedVaccineId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            accept: "*/*",
          },
          body: JSON.stringify(vaccineDetail),
        }
      );

      if (!response.ok) {
        throw new Error("Thêm vaccine detail thất bại");
      }

      toast.success("Thêm vaccine detail thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
      handleCloseVaccineDetailModal();
    } catch (err) {
      console.error("Lỗi khi thêm vaccine detail:", err);
      toast.error("Thêm vaccine detail thất bại. Vui lòng thử lại!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setVaccineDetailLoading(false);
    }
  };

  // Sửa vaccine
  const handleEditVaccine = (vaccine) => {
    setEditVaccineId(vaccine.vaccineId);
    setEditVaccine({ ...vaccine });
  };
  const handleConfirmAppointment = (id) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "Confirmed" } : app))
    );
    toast.success("Lịch hẹn đã được xác nhận!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleCancelAppointment = (id) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "Cancelled" } : app))
    );
    toast.error("Lịch hẹn đã bị hủy!", {
      position: "top-right",
      autoClose: 3000,
    });
  };
  const handleSaveEditVaccine = () => {
    if (
      editVaccine.illnessName &&
      editVaccine.stock >= 0 &&
      editVaccine.price >= 0
    ) {
      setVaccines(
        vaccines.map((v) =>
          v.vaccineId === editVaccineId
            ? { ...editVaccine, vaccineId: editVaccineId }
            : v
        )
      );
      setEditVaccineId(null);
      setEditVaccine({ name: "", stock: 0, price: 0 });
    } else {
      toast.error("Vui lòng điền đầy đủ thông tin hợp lệ!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Cập nhật stock
  const handleUpdateStock = (id, stock) => {
    setVaccines(
      vaccines.map((v) =>
        v.vaccineId === id
          ? { ...v, stock: Math.max(0, v.stock + parseInt(stock)) }
          : v
      )
    );
  };

  // Xử lý phản hồi
  const handleRespondFeedback = (id) => {
    setSelectedFeedbackId(id);
    const feedback = feedbacks.find((f) => f.id === id);
    setResponseText(feedback.response || "");
  };

  const handleSaveResponse = () => {
    if (responseText.trim()) {
      setFeedbacks(
        feedbacks.map((f) =>
          f.id === selectedFeedbackId ? { ...f, response: responseText } : f
        )
      );
      setResponseText("");
      setSelectedFeedbackId(null);
      toast.success("Phản hồi đã được lưu!", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      toast.error("Vui lòng nhập phản hồi!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Thêm dịch vụ
  const handleAddService = () => {
    if (newService.name && newService.description) {
      setServices([...services, { id: Date.now(), ...newService }]);
      setNewService({ name: "", description: "" });
      setShowAddServiceForm(false);
      toast.success("Thêm dịch vụ thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      toast.error("Vui lòng điền đầy đủ thông tin!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Xóa dịch vụ
  const handleDeleteService = (id) => {
    setServices(services.filter((s) => s.id !== id));
    toast.success("Xóa dịch vụ thành công!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // Sửa dịch vụ
  const handleEditService = (service) => {
    setEditServiceId(service.id);
    setEditService({ ...service });
  };

  const handleSaveEditService = () => {
    if (editService.name && editService.description) {
      setServices(
        services.map((s) =>
          s.id === editServiceId ? { ...editService, id: editServiceId } : s
        )
      );
      setEditServiceId(null);
      setEditService({ name: "", description: "" });
      toast.success("Sửa dịch vụ thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      toast.error("Vui lòng điền đầy đủ thông tin!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer />
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="flex-1 pl-4">
        {activeSection === "overview" && (
          <OverviewSection
            vaccines={vaccines}
            feedbacks={feedbacks}
            services={services}
          />
        )}
        {activeSection === "addVaccine" && (
          <VaccineManagementSection
            showAddVaccineForm={showAddVaccineForm}
            setShowAddVaccineForm={setShowAddVaccineForm}
            newVaccine={newVaccine}
            setNewVaccine={setNewVaccine}
            vaccines={vaccines}
            editVaccineId={editVaccineId}
            editVaccine={editVaccine}
            setEditVaccine={setEditVaccine}
            loading={loading}
            deleteLoading={deleteLoading}
            handleAddVaccine={handleAddVaccine}
            handleDeleteVaccine={handleDeleteVaccine}
            handleEditVaccine={handleEditVaccine}
            handleSaveEditVaccine={handleSaveEditVaccine}
            handleOpenVaccineDetailModal={handleOpenVaccineDetailModal}
          />
        )}
        {activeSection === "feedback" && (
          <FeedbackSection
            feedbacks={feedbacks}
            selectedFeedbackId={selectedFeedbackId}
            responseText={responseText}
            setResponseText={setResponseText}
            handleRespondFeedback={handleRespondFeedback}
            handleSaveResponse={handleSaveResponse}
          />
        )}
        {activeSection === "payment" && (
          <PaymentManagementSection
            showAddServiceForm={showAddServiceForm}
            setShowAddServiceForm={setShowAddServiceForm}
            newService={newService}
            setNewService={setNewService}
            services={services}
            editServiceId={editServiceId}
            editService={editService}
            setEditService={setEditService}
            handleAddService={handleAddService}
            handleDeleteService={handleDeleteService}
            handleEditService={handleEditService}
            handleSaveEditService={handleSaveEditService}
          />
        )}
        {activeSection === "appointment" && <AppointmentManagementSection />}
        {activeSection === "news" && <News />}
      </div>
      <VaccineDetailModal
        showVaccineDetailModal={showVaccineDetailModal}
        vaccineDetail={vaccineDetail}
        setVaccineDetail={setVaccineDetail}
        vaccineDetailLoading={vaccineDetailLoading}
        handleCloseVaccineDetailModal={handleCloseVaccineDetailModal}
        handleAddVaccineDetail={handleAddVaccineDetail}
      />
    </div>
  );
};

export default Staff;
