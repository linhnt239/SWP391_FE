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
  const [fetchLoading, setFetchLoading] = useState({}); // Thay đổi thành object
  const [deleteDetailLoading, setDeleteDetailLoading] = useState({});
  const [editDetailId, setEditDetailId] = useState(null);
  const [editedDetail, setEditedDetail] = useState({
    doseName: '',
    doseRequire: '',
    imageUrl: '',
    manufacturer: '',
    quantity: 0,
    stock: 0,
    dateBetweenDoses: '',
    price: 0,
  });
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  const handleAddDetailCallback = (newDetail) => {
    setVaccineDetails((prevDetails) => [...prevDetails, newDetail]);
  };

  // Fetch vaccine details
  const handleViewDetails = async (vaccineId) => {
    setSelectedVaccineId(vaccineId);
    setFetchLoading((prev) => ({ ...prev, [vaccineId]: true })); // Chỉ loading cho vaccineId này
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`/api/vaccinesdetails-get/${vaccineId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch details: ${response.status}`);
      }

      const data = await response.json();
      setVaccineDetails(Array.isArray(data.vaccineDetails) ? data.vaccineDetails : Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching vaccine details:', error.message);
      setVaccineDetails([]);
    } finally {
      setFetchLoading((prev) => ({ ...prev, [vaccineId]: false })); // Tắt loading cho vaccineId này
      setShowVaccineDetails(true);
    }
  };

  // Delete vaccine detail
  const handleDeleteDetail = async (vaccineId, detailsId) => {
    setDeleteDetailLoading((prev) => ({ ...prev, [detailsId]: true }));
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`/api/vaccine-details/${vaccineId}/${detailsId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete detail: ${response.status}`);
      }

      setVaccineDetails((prevDetails) => prevDetails.filter((detail) => detail.vaccineDetailsId !== detailsId));
    } catch (error) {
      console.error('Error deleting vaccine detail:', error.message);
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
      quantity: detail.quantity || 0,
      stock: detail.stock || 0,
      dateBetweenDoses: detail.dateBetweenDoses || '',
      price: detail.price || 0,
    });
  };

  // Save edited vaccine detail
  const handleSaveEditDetail = async () => {
    if (!selectedVaccineId || !editDetailId) {
      console.error('Invalid vaccine or detail ID');
      return;
    }

    setFetchLoading((prev) => ({ ...prev, [selectedVaccineId]: true })); // Loading cho vaccine đang chỉnh sửa
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`/api/vaccine-details/${selectedVaccineId}/${editDetailId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
        body: JSON.stringify({
          ...editedDetail,
          quantity: parseInt(editedDetail.quantity) || 0,
          stock: parseInt(editedDetail.stock) || 0,
          price: parseInt(editedDetail.price) || 0,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update: ${response.status} - ${errorText}`);
      }

      const updatedDetail = await response.json();
      setVaccineDetails((prevDetails) =>
        prevDetails.map((detail) =>
          detail.vaccineDetailsId === editDetailId ? { ...detail, ...updatedDetail } : detail
        )
      );
      setEditDetailId(null);
    } catch (error) {
      console.error('Error updating vaccine detail:', error.message);
    } finally {
      setFetchLoading((prev) => ({ ...prev, [selectedVaccineId]: false })); // Tắt loading
    }
  };

  const handleOpenImagePopup = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setShowImagePopup(true);
  };

  const handleCloseImagePopup = () => {
    setShowImagePopup(false);
    setSelectedImageUrl('');
  };

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
                <label className="block text-sm font-medium text-gray-700">Tên bệnh (illnessName)</label>
                <input
                  type="text"
                  value={newVaccine.illnessName}
                  onChange={(e) => setNewVaccine({ ...newVaccine, illnessName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả (description)</label>
                <input
                  type="text"
                  value={newVaccine.descriptions}
                  onChange={(e) => setNewVaccine({ ...newVaccine, descriptions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Giới hạn tuổi (ageLimit)</label>
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
                  className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
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
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
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
                      type="text"
                      value={editVaccine.description}
                      onChange={(e) => setEditVaccine({ ...editVaccine, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="number"
                      value={editVaccine.ageLimit}
                      onChange={(e) =>
                        setEditVaccine({ ...editVaccine, ageLimit: parseInt(e.target.value) || 0 })
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
                    <span>{vaccine.descriptions || 'N/A'}</span>
                    <span>{vaccine.ageLimit || 'N/A'}</span>
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleDeleteVaccine(vaccine.vaccineId)}
                        className={`bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center ${
                          deleteLoading[vaccine.vaccineId] ? 'opacity-50 cursor-not-allowed' : ''
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
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
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
                        className={`bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center ${
                          fetchLoading[vaccine.vaccineId] ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={fetchLoading[vaccine.vaccineId]}
                      >
                        {fetchLoading[vaccine.vaccineId] ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5 mr-2 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Đang tải...
                          </>
                        ) : (
                          'Xem chi tiết'
                        )}
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
                onClick={() => handleOpenVaccineDetailModal(selectedVaccineId, handleAddDetailCallback)}
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
          {fetchLoading[selectedVaccineId] ? (
            <p className="text-gray-500">Đang tải chi tiết vaccine...</p>
          ) : vaccineDetails.length > 0 ? (
            <>
              <div className="grid grid-cols-9 gap-4 mt-4 font-semibold bg-gray-200 p-2 rounded-t-md text-center">
                <span>Tên mũi</span>
                <span>Số liều</span>
                <span>URL ảnh</span>
                <span>Nhà sản xuất</span>
                <span>Số lượng</span>
                <span>Tồn kho</span>
                <span>Khoảng cách liều</span>
                <span>Giá (VNĐ)</span>
                <span>Hành động</span>
              </div>
              <ul className="space-y-4">
                {vaccineDetails.map((detail) => (
                  <li
                    key={detail.vaccineDetailsId}
                    className="grid grid-cols-9 gap-4 p-4 bg-gray-100 rounded-md items-center text-center"
                  >
                    {editDetailId === detail.vaccineDetailsId ? (
                      <>
                        <input
                          type="text"
                          value={editedDetail.doseName}
                          onChange={(e) => setEditedDetail({ ...editedDetail, doseName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          value={editedDetail.doseRequire}
                          onChange={(e) => setEditedDetail({ ...editedDetail, doseRequire: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          value={editedDetail.imageUrl}
                          onChange={(e) => setEditedDetail({ ...editedDetail, imageUrl: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          value={editedDetail.manufacturer}
                          onChange={(e) => setEditedDetail({ ...editedDetail, manufacturer: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="number"
                          value={editedDetail.quantity}
                          onChange={(e) =>
                            setEditedDetail({ ...editedDetail, quantity: parseInt(e.target.value) || 0 })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="number"
                          value={editedDetail.stock}
                          onChange={(e) =>
                            setEditedDetail({ ...editedDetail, stock: parseInt(e.target.value) || 0 })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          value={editedDetail.dateBetweenDoses}
                          onChange={(e) => setEditedDetail({ ...editedDetail, dateBetweenDoses: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="number"
                          value={editedDetail.price}
                          onChange={(e) =>
                            setEditedDetail({ ...editedDetail, price: parseInt(e.target.value) || 0 })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={handleSaveEditDetail}
                            className={`bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center ${
                              fetchLoading[selectedVaccineId] ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={fetchLoading[selectedVaccineId]}
                          >
                            {fetchLoading[selectedVaccineId] ? (
                              <>
                                <svg
                                  className="animate-spin h-5 w-5 mr-2 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                Đang lưu...
                              </>
                            ) : (
                              'Lưu'
                            )}
                          </button>
                          <button
                            onClick={() => setEditDetailId(null)}
                            className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                            disabled={fetchLoading[selectedVaccineId]}
                          >
                            Hủy
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span>{detail.doseName || 'N/A'}</span>
                        <span>{detail.doseRequire || 'N/A'}</span>
                        <div>
                          {detail.imageUrl ? (
                            <img
                              src={detail.imageUrl}
                              alt="Vaccine"
                              className="w-16 h-16 object-cover rounded-md cursor-pointer mx-auto"
                              onClick={() => handleOpenImagePopup(detail.imageUrl)}
                              onError={(e) => (e.target.src = 'https://via.placeholder.com/64?text=N/A')}
                            />
                          ) : (
                            'N/A'
                          )}
                        </div>
                        <span>{detail.manufacturer || 'N/A'}</span>
                        <span>{detail.quantity || 'N/A'}</span>
                        <span>{detail.stock || 'N/A'}</span>
                        <span>{detail.dateBetweenDoses || 'N/A'}</span>
                        <span>{detail.price ? detail.price.toLocaleString() : 'N/A'}</span>
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEditDetail(detail)}
                            className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteDetail(selectedVaccineId, detail.vaccineDetailsId)}
                            className={`bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center ${
                              deleteDetailLoading[detail.vaccineDetailsId] ? 'opacity-50 cursor-not-allowed' : ''
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
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
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