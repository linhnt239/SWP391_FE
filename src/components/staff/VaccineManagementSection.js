import React, { useState, useEffect } from 'react';

// Modal Component for Adding Vaccine Detail
const AddVaccineDetailModal = ({ vaccineId, onClose, onAddDetail }) => {
  const [newDetail, setNewDetail] = useState({
    doseName: '',
    doseRequire: '',
    imageUrl: '',
    manufacturer: '',
    quantity: 0,
    stock: 0,
    dateBetweenDoses: '',
    price: 0,
    status: 'active', // Default status, adjust as needed
    ageRequired: 0,
    dosageAmount: 0,
    boosterInterval: 0,
  });
  const [addLoading, setAddLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Validation for the form
  const validateDetailForm = () => {
    if (!newDetail.doseName.trim()) {
      setErrorMessage('Tên mũi không được để trống!');
      return false;
    }
    if (!newDetail.manufacturer.trim()) {
      setErrorMessage('Nhà sản xuất không được để trống!');
      return false;
    }
    if (newDetail.quantity < 0) {
      setErrorMessage('Số lượng không được nhỏ hơn 0!');
      return false;
    }
    if (newDetail.price < 0) {
      setErrorMessage('Giá không được nhỏ hơn 0!');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  // Handle form submission
  const handleAddDetail = async () => {
    if (!validateDetailForm()) {
      return;
    }

    setAddLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`/api/vaccine-details/${vaccineId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
        body: JSON.stringify({
          doseName: newDetail.doseName,
          doseRequire: newDetail.doseRequire,
          imageUrl: newDetail.imageUrl,
          manufacturer: newDetail.manufacturer,
          quantity: parseInt(newDetail.quantity) || 0,
          stock: parseInt(newDetail.stock) || 0,
          dateBetweenDoses: newDetail.dateBetweenDoses,
          price: parseInt(newDetail.price) || 0,
          status: newDetail.status,
          ageRequired: parseInt(newDetail.ageRequired) || 0,
          dosageAmount: parseInt(newDetail.dosageAmount) || 0,
          boosterInterval: parseInt(newDetail.boosterInterval) || 0,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add detail: ${response.status} - ${errorText}`);
      }

      const addedDetail = await response.json();
      onAddDetail(addedDetail); // Callback to update the parent state
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error adding vaccine detail:', error.message);
      setErrorMessage('Có lỗi xảy ra khi thêm chi tiết vaccine. Vui lòng thử lại!');
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl">
        <h3 className="text-2xl font-bold text-blue-900 mb-6">Thêm Vaccine Detail</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên mũi (doseName)</label>
            <input
              type="text"
              value={newDetail.doseName}
              onChange={(e) => setNewDetail({ ...newDetail, doseName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số liều cần thiết (doseRequire)</label>
            <input
              type="text"
              value={newDetail.doseRequire}
              onChange={(e) => setNewDetail({ ...newDetail, doseRequire: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL hình ảnh (imageUrl)</label>
            <input
              type="text"
              value={newDetail.imageUrl}
              onChange={(e) => setNewDetail({ ...newDetail, imageUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nhà sản xuất (manufacturer)</label>
            <input
              type="text"
              value={newDetail.manufacturer}
              onChange={(e) => setNewDetail({ ...newDetail, manufacturer: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng (quantity)</label>
            <input
              type="number"
              value={newDetail.quantity}
              onChange={(e) => setNewDetail({ ...newDetail, quantity: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng cách giữa các liều (dateBetweenDoses)</label>
            <input
              type="text"
              value={newDetail.dateBetweenDoses}
              onChange={(e) => setNewDetail({ ...newDetail, dateBetweenDoses: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá (price)</label>
            <input
              type="number"
              value={newDetail.price}
              onChange={(e) => setNewDetail({ ...newDetail, price: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tuổi yêu cầu (ageRequired)</label>
            <input
              type="number"
              value={newDetail.ageRequired}
              onChange={(e) => setNewDetail({ ...newDetail, ageRequired: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Liều lượng (ml)</label>
            <input
              type="number"
              value={newDetail.dosageAmount}
              onChange={(e) => setNewDetail({ ...newDetail, dosageAmount: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng thời gian tăng cường (boosterInterval)</label>
            <input
              type="number"
              value={newDetail.boosterInterval}
              onChange={(e) => setNewDetail({ ...newDetail, boosterInterval: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
        </div>
        {errorMessage && <p className="text-red-500 text-sm mt-4">{errorMessage}</p>}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
            disabled={addLoading}
          >
            Hủy
          </button>
          <button
            onClick={handleAddDetail}
            className={`bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center transition duration-200 ${addLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={addLoading}
          >
            {addLoading ? (
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
              'Lưu'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main VaccineManagementSection Component
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
    quantity: 0,
    stock: 0,
    dateBetweenDoses: '',
    price: 0,
    ageRequired: 0,
    dosageAmount: 0,
    boosterInterval: 0,
  });
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddDetailModal, setShowAddDetailModal] = useState(false);

  const handleAddDetailCallback = (newDetail) => {
    setVaccineDetails((prevDetails) => [...prevDetails, newDetail]);
  };

  const validateForm = () => {
    if (!newVaccine.illnessName.trim() || !newVaccine.descriptions.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin hợp lệ!');
      return false;
    }
    if (newVaccine.illnessName.length < 3) {
      setErrorMessage('Tên bệnh phải có ít nhất 3 ký tự!');
      return false;
    }
    if (newVaccine.descriptions.length < 3) {
      setErrorMessage('Mô tả phải có ít nhất 3 ký tự!');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const onAddVaccine = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await handleAddVaccine();
      setErrorMessage('');
      setShowAddVaccineForm(false);
    } catch (error) {
      setErrorMessage('Có lỗi xảy ra khi thêm vaccine. Vui lòng thử lại!');
    }
  };

  const handleViewDetails = async (vaccineId) => {
    setSelectedVaccineId(vaccineId);
    setFetchLoading(true);
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
      setFetchLoading(false);
      setShowVaccineDetails(true);
    }
  };

  const handleDeleteDetail = async (vaccineId, detailsId) => {
    setDeleteDetailLoading((prev) => ({ ...prev, [detailsId]: true }));
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`/api/vaccine-details/${detailsId}`, {
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
      ageRequired: detail.ageRequired || 0,
      dosageAmount: detail.dosageAmount || 0,
      boosterInterval: detail.boosterInterval || 0,
    });
  };

  const handleSaveEditDetail = async () => {
    if (!selectedVaccineId || !editDetailId) {
      console.error('Invalid vaccine or detail ID');
      return;
    }

    setFetchLoading(true);
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
          dateBetweenDoses: parseInt(editedDetail.dateBetweenDoses) || 0,
          price: parseInt(editedDetail.price) || 0,
          ageRequired: parseInt(editedDetail.ageRequired) || 0,
          dosageAmount: parseInt(editedDetail.dosageAmount) || 0,
          boosterInterval: parseInt(editedDetail.boosterInterval) || 0,
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
      setFetchLoading(false);
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

  const handleOpenAddDetailModal = (vaccineId) => {
    setSelectedVaccineId(vaccineId);
    setShowAddDetailModal(true);
  };

  const handleCloseAddDetailModal = () => {
    setShowAddDetailModal(false);
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả (descriptions)</label>
                <input
                  type="text"
                  value={newVaccine.descriptions}
                  onChange={(e) => setNewVaccine({ ...newVaccine, descriptions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
              <div className="flex items-end">
                <button
                  onClick={onAddVaccine}
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
          <div className="grid grid-cols-4 gap-4 text-center font-semibold bg-gray-200 p-2 rounded-t-md">
            <span>Tên bệnh</span>
            <span>Mô tả</span>
            <span>Hành động</span>
            <span>Chi tiết</span>
          </div>
          <ul className="space-y-2">
            {vaccines.map((vaccine) => (
              <li key={vaccine.vaccineId} className="grid grid-cols-4 gap-4 items-center text-center">
                {editVaccineId === vaccine.vaccineId ? (
                  <>
                    <input
                      type="text"
                      value={editVaccine.illnessName}
                      onChange={(e) => setEditVaccine({ ...editVaccine, illnessName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={editVaccine.descriptions}
                      onChange={(e) => setEditVaccine({ ...editVaccine, descriptions: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleDeleteVaccine(vaccine.vaccineId)}
                        className={`bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center ${deleteLoading[vaccine.vaccineId] ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                        className={`bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 ${fetchLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                onClick={() => handleOpenAddDetailModal(selectedVaccineId)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Thêm Mũi Tiêm
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
              <div className="grid grid-cols-12 gap-4 mt-4 font-semibold bg-gray-200 p-2 rounded-t-md text-center">
                <span className="col-span-1">Tên mũi</span>
                <span className="col-span-1">Số liều</span>
                <span className="col-span-1">URL ảnh</span>
                <span className="col-span-1">Nhà sản xuất</span>
                <span className="col-span-1">Số lượng</span>
                <span className="col-span-1">Khoảng cách liều</span>
                <span className="col-span-1">Giá (VNĐ)</span>
                <span className="col-span-1">Tuổi yêu cầu</span>
                <span className="col-span-1">Liều lượng (ml)</span>
                <span className="col-span-1">Khoảng tăng cường</span>
                <span className="col-span-1">Hành động</span>
              </div>
              <ul className="space-y-4">
                {vaccineDetails.map((detail) => (
                  <li
                    key={detail.vaccineDetailsId}
                    className="grid grid-cols-12 gap-4 p-4 bg-gray-100 rounded-md items-center text-center"
                  >
                    {editDetailId === detail.vaccineDetailsId ? (
                      <>
                        <div className="col-span-1">
                          <input
                            type="text"
                            value={editedDetail.doseName}
                            onChange={(e) => setEditedDetail({ ...editedDetail, doseName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="text"
                            value={editedDetail.doseRequire}
                            onChange={(e) => setEditedDetail({ ...editedDetail, doseRequire: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="text"
                            value={editedDetail.imageUrl}
                            onChange={(e) => setEditedDetail({ ...editedDetail, imageUrl: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="text"
                            value={editedDetail.manufacturer}
                            onChange={(e) => setEditedDetail({ ...editedDetail, manufacturer: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="number"
                            value={editedDetail.quantity}
                            onChange={(e) =>
                              setEditedDetail({ ...editedDetail, quantity: parseInt(e.target.value) || 0 })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="number"
                            value={editedDetail.stock}
                            onChange={(e) =>
                              setEditedDetail({ ...editedDetail, stock: parseInt(e.target.value) || 0 })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="text"
                            value={editedDetail.dateBetweenDoses}
                            onChange={(e) => setEditedDetail({ ...editedDetail, dateBetweenDoses: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="number"
                            value={editedDetail.price}
                            onChange={(e) =>
                              setEditedDetail({ ...editedDetail, price: parseInt(e.target.value) || 0 })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="number"
                            value={editedDetail.ageRequired}
                            onChange={(e) =>
                              setEditedDetail({ ...editedDetail, ageRequired: parseInt(e.target.value) || 0 })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="number"
                            value={editedDetail.dosageAmount}
                            onChange={(e) =>
                              setEditedDetail({ ...editedDetail, dosageAmount: parseInt(e.target.value) || 0 })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-1">
                          <input
                            type="number"
                            value={editedDetail.boosterInterval}
                            onChange={(e) =>
                              setEditedDetail({ ...editedDetail, boosterInterval: parseInt(e.target.value) || 0 })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-1 flex justify-center space-x-2">
                          <button
                            onClick={handleSaveEditDetail}
                            className={`bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center ${fetchLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={fetchLoading}
                          >
                            {fetchLoading ? (
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
                            disabled={fetchLoading}
                          >
                            Hủy
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="col-span-1">{detail.doseName || 'N/A'}</span>
                        <span className="col-span-1">{detail.doseRequire || 'N/A'}</span>
                        <div className="col-span-1">
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
                        <span className="col-span-1">{detail.manufacturer || 'N/A'}</span>
                        <span className="col-span-1">{detail.quantity || 'N/A'}</span>
                        <span className="col-span-1">{detail.stock || 'N/A'}</span>
                        <span className="col-span-1">{detail.dateBetweenDoses || 'N/A'}</span>
                        <span className="col-span-1">{detail.price ? detail.price.toLocaleString() : 'N/A'}</span>
                        <span className="col-span-1">{detail.ageRequired || 'N/A'}</span>
                        <span className="col-span-1">{detail.dosageAmount || 'N/A'}</span>
                        <span className="col-span-1">{detail.boosterInterval || 'N/A'}</span>
                        <div className="col-span-1 flex justify-center space-x-2">
                          <button
                            onClick={() => handleEditDetail(detail)}
                            className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteDetail(selectedVaccineId, detail.vaccineDetailsId)}
                            className={`bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center ${deleteDetailLoading[detail.vaccineDetailsId] ? 'opacity-50 cursor-not-allowed' : ''}`}
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

      {showAddDetailModal && (
        <AddVaccineDetailModal
          vaccineId={selectedVaccineId}
          onClose={handleCloseAddDetailModal}
          onAddDetail={handleAddDetailCallback}
        />
      )}
    </div>
  );
};

export default VaccineManagementSection;