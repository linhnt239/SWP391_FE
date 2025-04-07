// src/components/staff/VaccineDetailModal.js
import React from 'react';

const VaccineDetailModal = ({
    showVaccineDetailModal,
    vaccineDetail,
    setVaccineDetail,
    vaccineDetailLoading,
    handleCloseVaccineDetailModal,
    handleAddVaccineDetail,
}) => {
    if (!showVaccineDetailModal) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Thêm Vaccine Detail</h2>
                <div className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên mũi</label>
                        <input
                            type="text"
                            value={vaccineDetail.doseName}
                            onChange={(e) => setVaccineDetail({ ...vaccineDetail, doseName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Số mũi tiêm cần thiết</label>
                        <input
                            type="number"
                            value={vaccineDetail.doseRequire}
                            onChange={(e) => setVaccineDetail({ ...vaccineDetail, doseRequire: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL hình ảnh</label>
                        <input
                            type="text"
                            value={vaccineDetail.imageUrl}
                            onChange={(e) => setVaccineDetail({ ...vaccineDetail, imageUrl: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nhà sản xuất</label>
                        <input
                            type="text"
                            value={vaccineDetail.manufacturer}
                            onChange={(e) => setVaccineDetail({ ...vaccineDetail, manufacturer: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Số lượng</label>
                        <input
                            type="number"
                            value={vaccineDetail.quantity}
                            onChange={(e) => setVaccineDetail({ ...vaccineDetail, quantity: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Khoảng cách giữa các liều</label>
                        <input
                            type="number"
                            value={vaccineDetail.dateBetweenDoses}
                            onChange={(e) => setVaccineDetail({ ...vaccineDetail, dateBetweenDoses: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giá (đồng)</label>
                        <input
                            type="number"
                            value={vaccineDetail.price}
                            onChange={(e) => setVaccineDetail({ ...vaccineDetail, price: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={handleCloseVaccineDetailModal}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleAddVaccineDetail}
                        className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center ${vaccineDetailLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={vaccineDetailLoading}
                    >
                        {vaccineDetailLoading ? (
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
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Đang xử lý...
                            </>
                        ) : (
                            'Lưu'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VaccineDetailModal;