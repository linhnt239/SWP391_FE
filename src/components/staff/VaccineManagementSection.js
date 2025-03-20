// src/components/staff/VaccineManagementSection.js
import React, { useState, useEffect } from 'react';

const VaccineManagementSection = ({
  showAddVaccineForm,
  setShowAddVaccineForm,
  newVaccine,
  setNewVaccine,
  vaccines,
  editVaccineId,
  editVaccine,
  setEditVaccine,
  loading,
  deleteLoading,
  handleAddVaccine,
  handleDeleteVaccine,
  handleEditVaccine,
  handleSaveEditVaccine,
  handleOpenVaccineDetailModal,
}) => {
  const [showVaccineDetails, setShowVaccineDetails] = useState(false);
  const [selectedVaccineId, setSelectedVaccineId] = useState(null);
  const [vaccineDetails, setVaccineDetails] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [deleteDetailLoading, setDeleteDetailLoading] = useState({});
  const [editDetailId, setEditDetailId] = useState(null);
  const [editedDetail, setEditedDetail] = useState({
    doseName: '',
    doseRequire: '',
    imageUrl: '',
    manufacturer: '',
    quantity: '',
    stock: '',
    dateBetweenDoses: '',
    price: '',
  });
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  // Fetch vaccine details
  const handleViewDetails = async (vaccineId) => {
    setSelectedVaccineId(vaccineId);
    setFetchLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching details for vaccineId:', vaccineId);
      console.log('Token:', token);
      const response = await fetch(`/api/vaccinesdetails-get/${vaccineId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          accept: '*/*',
        },
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Raw API response:', data);
      setVaccineDetails(Array.isArray(data.vaccineDetails) ? data.vaccineDetails : Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi khi fetch chi tiết vaccine:', error.message);
      setVaccineDetails([]);
    } finally {
      setFetchLoading(false);
      setShowVaccineDetails(true);
    }
  };

  // Delete vaccine detail
  const handleDeleteDetail = async (vaccineId, detailsId) => {
    setDeleteDetailLoading((prev) => ({ ...prev, [detailsId]: true }));
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/vaccine-details/${vaccineId}/${detailsId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          accept: '*/*',
        },
      });
      if (!response.ok) {
        throw new Error('Không thể xóa chi tiết vaccine');
      }
      setVaccineDetails((prevDetails) => prevDetails.filter((detail) => detail.vaccineDetailsId !== detailsId));
    } catch (error) {
      console.error('Lỗi khi xóa chi tiết vaccine:', error);
    } finally {
      setDeleteDetailLoading((prev) => ({ ...prev, [detailsId]: false }));
    }
  };

  // Handle edit button click for vaccine detail
  const handleEditDetail = (detail) => {
    setEditDetailId(detail.vaccineDetailsId);
    setEditedDetail({
      doseName: detail.doseName || '',
      doseRequire: detail.doseRequire || '',
      imageUrl: detail.imageUrl || '',
      manufacturer: detail.manufacturer || '',
      quantity: detail.quantity || '',
      stock: detail.stock || '',
      dateBetweenDoses: detail.dateBetweenDoses || '',
      price: detail.price || '',
    });
  };

  // Save edited vaccine detail
  const handleSaveEditDetail = async () => {
    setFetchLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/vaccine-details/${selectedVaccineId}/${editDetailId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify(editedDetail),
      });
      if (!response.ok) {
        throw new Error('Không thể cập nhật chi tiết vaccine');
      }
      const updatedDetail = await response.json();
      setVaccineDetails((prevDetails) =>
        prevDetails.map((detail) =>
          detail.vaccineDetailsId === editDetailId ? { ...detail, ...updatedDetail } : detail
        )
      );
      setEditDetailId(null);
    } catch (error) {
      console.error('Lỗi khi cập nhật chi tiết vaccine:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  // Open image popup
  const handleOpenImagePopup = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setShowImagePopup(true);
  };

  // Close image popup
  const handleCloseImagePopup = () => {
    setShowImagePopup(false);
    setSelectedImageUrl('');
  };

  // Back to vaccine list
  const handleBackToVaccines = () => {
    setShowVaccineDetails(false);
    setSelectedVaccineId(null);
    setVaccineDetails([]);
    setEditDetailId(null);
  };

  const selectedVaccine = vaccines.find((v) => v.vaccineId === selectedVaccineId);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-blue-900 mb-4">Vaccine Management</h2>
      {!showVaccineDetails && (
        <>
          <button
            onClick={() => setShowAddVaccineForm(!showAddVaccineForm)}
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
          >
            {showAddVaccineForm ? 'Ẩn Form' : 'Thêm Vaccine'}
          </button>
          {showAddVaccineForm && (
            <div className="grid gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên bệnh</label>
                <input
                  type="text"
                  value={newVaccine.illnessName}
                  onChange={(e) => setNewVaccine({ ...newVaccine, illnessName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <input
                  type="text"
                  value={newVaccine.description}
                  onChange={(e) => setNewVaccine({ ...newVaccine, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Giới hạn tháng</label>
                <input
                  type="number"
                  value={newVaccine.ageLimit}
                  onChange={(e) => setNewVaccine({ ...newVaccine, ageLimit: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddVaccine}
                  className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
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
                    'Lưu Vaccine'
                  )}
                </button>
              </div>
            </div>
          )}
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Danh sách vaccine</h3>
          <div className="grid grid-cols-5 gap-4 text-center font-semibold bg-gray-200 p-2 rounded-t-md">
            <span>Tên vaccine</span>
            <span>Mô tả</span>
            <span>Độ tuổi</span>
            <span>Hành động</span>
            <span>Chi tiết</span>
          </div>
          <ul className="space-y-2">
            {vaccines.map((vaccine) => (
              <li key={vaccine.vaccineId} className="grid grid-cols-5 gap-4 items-center text-center">
                {editVaccineId === vaccine.vaccineId ? (
                  <>
                    <input
                      type="text"
                      value={editVaccine.illnessName}
                      onChange={(e) => setEditVaccine({ ...editVaccine, illnessName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="number"
                      value={editVaccine.stock}
                      onChange={(e) =>
                        setEditVaccine({ ...editVaccine, stock: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="number"
                      value={editVaccine.price}
                      onChange={(e) =>
                        setEditVaccine({ ...editVaccine, price: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      onClick={handleSaveEditVaccine}
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                    >
                      Lưu
                    </button>
                    <span></span>
                  </>
                ) : (
                  <>
                    <span>{vaccine.illnessName || 'N/A'}</span>
                    <span>{vaccine.descriptions}</span>
                    <span>{vaccine.ageLimit}</span>
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleDeleteVaccine(vaccine.vaccineId)}
                        className={`bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center ${deleteLoading[vaccine.vaccineId] ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        disabled={deleteLoading[vaccine.vaccineId]}
                      >
                        {deleteLoading[vaccine.vaccineId] ? (
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
                            Đang xóa...
                          </>
                        ) : (
                          'Xóa'
                        )}
                      </button>
                    </div>
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(vaccine.vaccineId)}
                        className={`bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 ${fetchLoading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        disabled={fetchLoading}
                      >
                        {fetchLoading ? 'Đang tải...' : 'Xem chi tiết'}
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      {showVaccineDetails && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">
              Danh sách Vaccine Details - {selectedVaccine?.illnessName || 'N/A'}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => handleOpenVaccineDetailModal(selectedVaccineId)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Thêm Detail
              </button>
              <button
                onClick={handleBackToVaccines}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Back
              </button>
            </div>
          </div>
          {fetchLoading ? (
            <p className="text-gray-500">Đang tải chi tiết vaccine...</p>
          ) : vaccineDetails.length > 0 ? (
            <>
              <div className="grid grid-cols-9 gap-4 mt-4 font-semibold bg-gray-200 p-2 rounded-t-md text-center">
                <span className="flex items-center justify-center">Tên mũi</span>
                <span className="flex items-center justify-center">Số liều</span>
                <span className="flex items-center justify-center">URL ảnh</span>
                <span className="flex items-center justify-center">Nhà sản xuất</span>
                <span className="flex items-center justify-center">Số lượng</span>
                <span className="flex items-center justify-center">Tồn kho</span>
                <span className="flex items-center justify-center">Khoảng cách liều</span>
                <span className="flex items-center justify-center">Giá (VNĐ)</span>
                <span className="flex items-center justify-center">Hành động</span>
              </div>
              <ul className="space-y-4">
                {vaccineDetails.map((detail) => (
                  <li
                    key={detail.vaccineDetailsId}
                    className="grid grid-cols-9 gap-4 p-4 bg-gray-100 rounded-md items-center"
                  >
                    {editDetailId === detail.vaccineDetailsId ? (
                      <>
                        <div className="flex items-center justify-center">
                          <input
                            type="text"
                            value={editedDetail.doseName}
                            onChange={(e) => setEditedDetail({ ...editedDetail, doseName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-center"
                          />
                        </div>
                        <div className="flex items-center justify-center">
                          <input
                            type="text"
                            value={editedDetail.doseRequire}
                            onChange={(e) => setEditedDetail({ ...editedDetail, doseRequire: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-center"
                          />
                        </div>
                        <div className="flex items-center justify-center">
                          <input
                            type="text"
                            value={editedDetail.imageUrl}
                            onChange={(e) => setEditedDetail({ ...editedDetail, imageUrl: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-center"
                          />
                        </div>
                        <div className="flex items-center justify-center">
                          <input
                            type="text"
                            value={editedDetail.manufacturer}
                            onChange={(e) => setEditedDetail({ ...editedDetail, manufacturer: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-center"
                          />
                        </div>
                        <div className="flex items-center justify-center">
                          <input
                            type="number"
                            value={editedDetail.quantity}
                            onChange={(e) =>
                              setEditedDetail({ ...editedDetail, quantity: parseInt(e.target.value) || 0 })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-center"
                          />
                        </div>
                        <div className="flex items-center justify-center">
                          <input
                            type="number"
                            value={editedDetail.stock}
                            onChange={(e) =>
                              setEditedDetail({ ...editedDetail, stock: parseInt(e.target.value) || 0 })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-center"
                          />
                        </div>
                        <div className="flex items-center justify-center">
                          <input
                            type="text"
                            value={editedDetail.dateBetweenDoses}
                            onChange={(e) =>
                              setEditedDetail({ ...editedDetail, dateBetweenDoses: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-center"
                          />
                        </div>
                        <div className="flex items-center justify-center">
                          <input
                            type="number"
                            value={editedDetail.price}
                            onChange={(e) =>
                              setEditedDetail({ ...editedDetail, price: parseInt(e.target.value) || 0 })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-center"
                          />
                        </div>
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={handleSaveEditDetail}
                            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => setEditDetailId(null)}
                            className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                          >
                            Hủy
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center justify-center">{detail.doseName || 'N/A'}</span>
                        <span className="flex items-center justify-center">{detail.doseRequire || 'N/A'}</span>
                        <div className="flex items-center justify-center">
                          {detail.imageUrl ? (
                            <img
                              src={detail.imageUrl}
                              alt="Vaccine"
                              className="w-16 h-16 object-cover rounded-md cursor-pointer"
                              onClick={() => handleOpenImagePopup(detail.imageUrl)}
                              onError={(e) => (e.target.src = 'https://via.placeholder.com/64?text=N/A')}
                            />
                          ) : (
                            <span className="text-center">N/A</span>
                          )}
                        </div>
                        <span className="flex items-center justify-center">{detail.manufacturer || 'N/A'}</span>
                        <span className="flex items-center justify-center">{detail.quantity || 'N/A'}</span>
                        <span className="flex items-center justify-center">{detail.stock || 'N/A'}</span>
                        <span className="flex items-center justify-center">{detail.dateBetweenDoses || 'N/A'}</span>
                        <span className="flex items-center justify-center">
                          {detail.price ? detail.price.toLocaleString() : 'N/A'}
                        </span>
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEditDetail(detail)}
                            className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteDetail(selectedVaccineId, detail.vaccineDetailsId)}
                            className={`bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center ${deleteDetailLoading[detail.vaccineDetailsId]
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                              }`}
                            disabled={deleteDetailLoading[detail.vaccineDetailsId]}
                          >
                            {deleteDetailLoading[detail.vaccineDetailsId] ? (
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
                                Đang xóa...
                              </>
                            ) : (
                              'Xóa'
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-gray-500">Không có chi tiết vaccine nào.</p>
          )}
        </>
      )}

      {/* Popup cho hình ảnh */}
      {showImagePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <img
              src={selectedImageUrl}
              alt="Vaccine Preview"
              className="max-w-full max-h-96 object-contain"
              onError={(e) => (e.target.src = 'https://via.placeholder.com/300?text=N/A')}
            />
            <button
              onClick={handleCloseImagePopup}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccineManagementSection;