// src/pages/staff.jsx
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Staff = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const [showAddVaccineForm, setShowAddVaccineForm] = useState(false);
    const [showAddServiceForm, setShowAddServiceForm] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false); // State để hiển thị dropdown
    const [vaccines, setVaccines] = useState([
        { id: 1, name: 'Pentaxim', stock: 50, price: 700000 },
        { id: 2, name: 'MMR', stock: 30, price: 300000 },
    ]);
    const [feedbacks, setFeedbacks] = useState([
        { id: 1, user: 'Nguyen Van A', rating: 4, comment: 'Dịch vụ tốt!', response: '' },
        { id: 2, user: 'Tran Thi B', rating: 3, comment: 'Chờ hơi lâu.', response: '' },
    ]);
    const [services, setServices] = useState([
        { id: 1, name: 'Tiêm vaccine trẻ em', description: 'Dịch vụ tiêm vaccine cơ bản' },
    ]);
    const [newVaccine, setNewVaccine] = useState({ name: '', stock: 0, price: 0 });
    const [editVaccineId, setEditVaccineId] = useState(null);
    const [editVaccine, setEditVaccine] = useState({ name: '', stock: 0, price: 0 });
    const [newService, setNewService] = useState({ name: '', description: '' });
    const [editServiceId, setEditServiceId] = useState(null);
    const [editService, setEditService] = useState({ name: '', description: '' });
    const [responseText, setResponseText] = useState('');
    const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);

    const router = useRouter();

    // Xử lý logout
    const handleLogout = () => {
        // Xóa thông tin đăng nhập (giả lập, trong thực tế có thể xóa token từ localStorage)
        localStorage.removeItem('authToken'); // Ví dụ
        router.push('/login'); // Chuyển hướng sang trang login
    };

    // Thêm vaccine
    const handleAddVaccine = () => {
        if (newVaccine.name && newVaccine.stock >= 0 && newVaccine.price >= 0) {
            setVaccines([...vaccines, { id: Date.now(), ...newVaccine }]);
            setNewVaccine({ name: '', stock: 0, price: 0 });
            setShowAddVaccineForm(false);
        } else {
            alert('Vui lòng điền đầy đủ thông tin hợp lệ!');
        }
    };

    // Xóa vaccine
    const handleDeleteVaccine = (id) => {
        setVaccines(vaccines.filter((v) => v.id !== id));
    };

    // Sửa vaccine
    const handleEditVaccine = (vaccine) => {
        setEditVaccineId(vaccine.id);
        setEditVaccine({ ...vaccine });
    };

    const handleSaveEditVaccine = () => {
        if (editVaccine.name && editVaccine.stock >= 0 && editVaccine.price >= 0) {
            setVaccines(
                vaccines.map((v) => (v.id === editVaccineId ? { ...editVaccine, id: editVaccineId } : v))
            );
            setEditVaccineId(null);
            setEditVaccine({ name: '', stock: 0, price: 0 });
        } else {
            alert('Vui lòng điền đầy đủ thông tin hợp lệ!');
        }
    };

    // Cập nhật stock
    const handleUpdateStock = (id, stock) => {
        setVaccines(
            vaccines.map((v) =>
                v.id === id ? { ...v, stock: Math.max(0, v.stock + parseInt(stock)) } : v
            )
        );
    };

    // Xử lý phản hồi
    const handleRespondFeedback = (id) => {
        setSelectedFeedbackId(id);
        const feedback = feedbacks.find((f) => f.id === id);
        setResponseText(feedback.response || '');
    };

    const handleSaveResponse = () => {
        if (responseText.trim()) {
            setFeedbacks(
                feedbacks.map((f) =>
                    f.id === selectedFeedbackId ? { ...f, response: responseText } : f
                )
            );
            setResponseText('');
            setSelectedFeedbackId(null);
        } else {
            alert('Vui lòng nhập phản hồi!');
        }
    };

    // Thêm dịch vụ
    const handleAddService = () => {
        if (newService.name && newService.description) {
            setServices([...services, { id: Date.now(), ...newService }]);
            setNewService({ name: '', description: '' });
            setShowAddServiceForm(false);
        } else {
            alert('Vui lòng điền đầy đủ thông tin!');
        }
    };

    // Xóa dịch vụ
    const handleDeleteService = (id) => {
        setServices(services.filter((s) => s.id !== id));
    };

    // Sửa dịch vụ
    const handleEditService = (service) => {
        setEditServiceId(service.id);
        setEditService({ ...service });
    };

    const handleSaveEditService = () => {
        if (editService.name && editService.description) {
            setServices(
                services.map((s) => (s.id === editServiceId ? { ...editService, id: editServiceId } : s))
            );
            setEditServiceId(null);
            setEditService({ name: '', description: '' });
        } else {
            alert('Vui lòng điền đầy đủ thông tin!');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white p-4">
                <div className="relative">
                    <div
                        className="flex items-center mb-6 cursor-pointer"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <Image
                            src="/avt.jpg" // Thay bằng ảnh nhân viên thực tế nếu có
                            alt="Staff Avatar"
                            width={40}
                            height={40}
                            className="rounded-full mr-2"
                        />
                        <div>
                            <p className="text-sm">Nguyen Van C</p>
                            <p className="text-xs">Staff ID: 001</p>
                        </div>
                    </div>
                    {showDropdown && (
                        <div className="absolute top-12 left-0 w-full bg-gray-700 rounded-md shadow-lg z-10">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 rounded-md"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setActiveSection('overview')}
                                className={`w-full text-left px-4 py-2 rounded ${activeSection === 'overview' ? 'bg-teal-500' : 'hover:bg-gray-700'}`}
                            >
                                Overview
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveSection('addVaccine')}
                                className={`w-full text-left px-4 py-2 rounded ${activeSection === 'addVaccine' ? 'bg-teal-500' : 'hover:bg-gray-700'}`}
                            >
                                Vaccine Management
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveSection('feedback')}
                                className={`w-full text-left px-4 py-2 rounded ${activeSection === 'feedback' ? 'bg-teal-500' : 'hover:bg-gray-700'}`}
                            >
                                Feedback
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveSection('system')}
                                className={`w-full text-left px-4 py-2 rounded ${activeSection === 'system' ? 'bg-teal-500' : 'hover:bg-gray-700'}`}
                            >
                                System Management
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                {activeSection === 'overview' && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Overview</h2>
                        <p className="text-gray-700 mb-4">Chào mừng bạn đến với bảng điều khiển quản lý nhân viên.</p>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-blue-100 p-4 rounded-lg text-center">
                                <h3 className="text-lg font-semibold text-blue-900">Số lượng vaccine</h3>
                                <p className="text-2xl font-bold text-blue-900">{vaccines.length}</p>
                            </div>
                            <div className="bg-green-100 p-4 rounded-lg text-center">
                                <h3 className="text-lg font-semibold text-green-900">Phản hồi chưa xử lý</h3>
                                <p className="text-2xl font-bold text-green-900">{feedbacks.filter(f => !f.response).length}</p>
                            </div>
                            <div className="bg-yellow-100 p-4 rounded-lg text-center">
                                <h3 className="text-lg font-semibold text-yellow-900">Số lượng dịch vụ</h3>
                                <p className="text-2xl font-bold text-yellow-900">{services.length}</p>
                            </div>
                        </div>
                    </div>
                )}
                {activeSection === 'addVaccine' && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Vaccine Management</h2>
                        <button
                            onClick={() => setShowAddVaccineForm(!showAddVaccineForm)}
                            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
                        >
                            {showAddVaccineForm ? 'Ẩn Form' : 'Thêm Vaccine'}
                        </button>
                        {showAddVaccineForm && (
                            <div className="grid gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tên vaccine</label>
                                    <input
                                        type="text"
                                        value={newVaccine.name}
                                        onChange={(e) => setNewVaccine({ ...newVaccine, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Số lượng tồn kho</label>
                                    <input
                                        type="number"
                                        value={newVaccine.stock}
                                        onChange={(e) => setNewVaccine({ ...newVaccine, stock: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Giá (VNĐ)</label>
                                    <input
                                        type="number"
                                        value={newVaccine.price}
                                        onChange={(e) => setNewVaccine({ ...newVaccine, price: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={handleAddVaccine}
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    >
                                        Lưu Vaccine
                                    </button>
                                </div>
                            </div>
                        )}
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Danh sách vaccine</h3>
                        <div className="grid grid-cols-4 gap-4 text-center font-semibold bg-gray-200 p-2 rounded-t-md">
                            <span>Tên vaccine</span>
                            <span>Số lượng</span>
                            <span>Giá (VNĐ)</span>
                            <span>Hành động</span>
                        </div>
                        <ul className="space-y-2">
                            {vaccines.map((vaccine) => (
                                <li key={vaccine.id} className="grid grid-cols-4 gap-4 items-center text-center">
                                    {editVaccineId === vaccine.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editVaccine.name}
                                                onChange={(e) => setEditVaccine({ ...editVaccine, name: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                            <input
                                                type="number"
                                                value={editVaccine.stock}
                                                onChange={(e) => setEditVaccine({ ...editVaccine, stock: parseInt(e.target.value) || 0 })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                            <input
                                                type="number"
                                                value={editVaccine.price}
                                                onChange={(e) => setEditVaccine({ ...editVaccine, price: parseInt(e.target.value) || 0 })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                            <button
                                                onClick={handleSaveEditVaccine}
                                                className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                            >
                                                Lưu
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span>{vaccine.name}</span>
                                            <span>{vaccine.stock}</span>
                                            <span>{vaccine.price.toLocaleString()}</span>
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => handleEditVaccine(vaccine)}
                                                    className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteVaccine(vaccine.id)}
                                                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {activeSection === 'feedback' && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Feedback</h2>
                        <div className="grid grid-cols-4 gap-4 text-center font-semibold bg-gray-200 p-2 rounded-t-md">
                            <span>Người dùng</span>
                            <span>Đánh giá</span>
                            <span>Bình luận</span>
                            <span>Hành động</span>
                        </div>
                        <ul className="space-y-2">
                            {feedbacks.map((feedback) => (
                                <li key={feedback.id} className="grid grid-cols-4 gap-4 items-center text-center py-2 border-b border-gray-200">
                                    <span>{feedback.user}</span>
                                    <span>{feedback.rating}/5</span>
                                    <span className="">{feedback.comment}</span>
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => handleRespondFeedback(feedback.id)}
                                            className="bg-blue-900 text-white px-2 py-1 rounded hover:bg-blue-700"
                                        >
                                            Phản hồi
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {selectedFeedbackId && (
                            <div className="mt-4 p-4 border border-gray-300 rounded-md">
                                <textarea
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    placeholder="Nhập phản hồi..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    rows="3"
                                />
                                <div className="mt-2 flex justify-end space-x-2">
                                    <button
                                        onClick={() => setSelectedFeedbackId(null)}
                                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleSaveResponse}
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    >
                                        Lưu
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {activeSection === 'system' && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-blue-900 mb-4">System Management</h2>
                        <button
                            onClick={() => setShowAddServiceForm(!showAddServiceForm)}
                            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
                        >
                            {showAddServiceForm ? 'Ẩn Form' : 'Thêm Dịch Vụ'}
                        </button>
                        {showAddServiceForm && (
                            <div className="grid gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tên dịch vụ</label>
                                    <input
                                        type="text"
                                        value={newService.name}
                                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mô tả dịch vụ</label>
                                    <textarea
                                        value={newService.description}
                                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                        placeholder="Mô tả dịch vụ"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        rows="3"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={handleAddService}
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    >
                                        Lưu Dịch Vụ
                                    </button>
                                </div>
                            </div>
                        )}
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Danh sách dịch vụ</h3>
                        <div className="grid grid-cols-3 gap-4 text-center font-semibold bg-gray-200 p-2 rounded-t-md">
                            <span>Tên dịch vụ</span>
                            <span>Mô tả</span>
                            <span>Hành động</span>
                        </div>
                        <ul className="space-y-2">
                            {services.map((service) => (
                                <li key={service.id} className="grid grid-cols-3 gap-4 items-center text-center py-2 border-b border-gray-200">
                                    {editServiceId === service.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editService.name}
                                                onChange={(e) => setEditService({ ...editService, name: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                            <textarea
                                                value={editService.description}
                                                onChange={(e) => setEditService({ ...editService, description: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                rows="2"
                                            />
                                            <button
                                                onClick={handleSaveEditService}
                                                className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                            >
                                                Lưu
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span>{service.name}</span>
                                            <span>{service.description}</span>
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => handleEditService(service)}
                                                    className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteService(service.id)}
                                                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Staff;