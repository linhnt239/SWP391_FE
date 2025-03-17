// src/components/staff/SystemManagementSection.js
import React from 'react';

const SystemManagementSection = ({
    showAddServiceForm,
    setShowAddServiceForm,
    newService,
    setNewService,
    services,
    editServiceId,
    editService,
    setEditService,
    handleAddService,
    handleDeleteService,
    handleEditService,
    handleSaveEditService,
}) => {
    return (
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
    );
};

export default SystemManagementSection;