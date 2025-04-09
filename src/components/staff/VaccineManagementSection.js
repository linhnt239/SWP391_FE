import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Modal Component for Adding Vaccine Detail
const AddVaccineDetailModal = ({ vaccineId, onClose, onAddDetail }) => {
  const [newDetail, setNewDetail] = useState({
    doseName: '',
    doseRequire: '',
    imageUrl: '',
    manufacturer: '',
    quantity: 0,
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
    if (newDetail.boosterInterval < 0) {
      setErrorMessage('Khoảng thời gian tăng cường không được nhỏ hơn 0!');
      return false;
    }
    // if (newDetail.ageRequired < 0) {
    //   setErrorMessage('Tuổi yêu cầu không được nhỏ hơn 0!');
    //   return false;
    // }
    if (newDetail.dateBetweenDoses < 0) {
      setErrorMessage('Khoảng cách giữa các mũi không được nhỏ hơn 0!');
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên mũi</label>
            <input
              type="text"
              value={newDetail.doseName}
              onChange={(e) => setNewDetail({ ...newDetail, doseName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số mũi tiêm cần thiết</label>
            <input
              type="text"
              value={newDetail.doseRequire}
              onChange={(e) => setNewDetail({ ...newDetail, doseRequire: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL hình ảnh</label>
            <input
              type="text"
              value={newDetail.imageUrl}
              onChange={(e) => setNewDetail({ ...newDetail, imageUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nhà sản xuất</label>
            <input
              type="text"
              value={newDetail.manufacturer}
              onChange={(e) => setNewDetail({ ...newDetail, manufacturer: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
            <input
              type="number"
              value={newDetail.quantity}
              onChange={(e) => setNewDetail({ ...newDetail, quantity: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng cách giữa các liều</label>
            <input
              type="text"
              value={newDetail.dateBetweenDoses}
              onChange={(e) => setNewDetail({ ...newDetail, dateBetweenDoses: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá (đồng)</label>
            <input
              type="number"
              value={newDetail.price}
              onChange={(e) => setNewDetail({ ...newDetail, price: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tuổi yêu cầu</label>
            <input
              type="number"
              value={newDetail.ageRequired}
              onChange={(e) => setNewDetail({ ...newDetail, ageRequired: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div> */}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng thời gian tăng cường</label>
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

// Vaccine Details Modal Component
const VaccineDetailsModal = ({ isOpen, onClose, vaccineId, vaccineName }) => {
  const [vaccineDetails, setVaccineDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDetailModal, setShowAddDetailModal] = useState(false);
  const [editDetailId, setEditDetailId] = useState(null);
  const [editedDetail, setEditedDetail] = useState({
    doseName: '',
    doseRequire: '',
    imageUrl: '',
    manufacturer: '',
    quantity: 0,
    dateBetweenDoses: '',
    price: 0,
    ageRequired: 0,
    dosageAmount: 0,
    boosterInterval: 0,
  });
  const [deleteDetailLoading, setDeleteDetailLoading] = useState({});

  useEffect(() => {
    if (isOpen && vaccineId) {
      fetchVaccineDetails();
    }
  }, [isOpen, vaccineId]);

  const fetchVaccineDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`/api/vaccinesdetails-get/${vaccineId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch details');

      const data = await response.json();
      setVaccineDetails(Array.isArray(data.vaccineDetails) ? data.vaccineDetails : Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Không thể tải thông tin chi tiết vaccine');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDetail = async (detailId) => {
    setDeleteDetailLoading(prev => ({ ...prev, [detailId]: true }));
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/vaccine-details/${detailId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
      });

      if (!response.ok) throw new Error('Failed to delete');

      setVaccineDetails(details => details.filter(d => d.vaccineDetailsId !== detailId));
      toast.success('Xóa thành công');
    } catch (error) {
      toast.error('Không thể xóa chi tiết vaccine');
    } finally {
      setDeleteDetailLoading(prev => ({ ...prev, [detailId]: false }));
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
      dateBetweenDoses: detail.dateBetweenDoses || '',
      price: detail.price || 0,
      ageRequired: detail.ageRequired || 0,
      dosageAmount: detail.dosageAmount || 0,
      boosterInterval: detail.boosterInterval || 0,
    });
  };

  const handleSaveEditDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/vaccine-details/${vaccineId}/${editDetailId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
        body: JSON.stringify(editedDetail),
      });

      if (!response.ok) throw new Error('Failed to update');

      const updatedDetail = await response.json();
      setVaccineDetails(details =>
        details.map(d => d.vaccineDetailsId === editDetailId ? { ...d, ...updatedDetail } : d)
      );
      setEditDetailId(null);
      toast.success('Cập nhật thành công');
    } catch (error) {
      toast.error('Không thể cập nhật chi tiết vaccine');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Chi tiết Vaccine: {vaccineName}
          </h2>
          <div className="flex items-center space-x-3">
          <button
              onClick={() => setShowAddDetailModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg 
              transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
              <span>Thêm mũi tiêm</span>
                </button>
                    <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                      </button>
                    </div>
                    </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : vaccineDetails.length > 0 ? (
            <div className="grid gap-4">
                {vaccineDetails.map((detail) => (
                <div
                    key={detail.vaccineDetailsId}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md 
                  transition-shadow duration-200 p-4"
                  >
                    {editDetailId === detail.vaccineDetailsId ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên mũi</label>
                          <input
                            type="text"
                            value={editedDetail.doseName}
                            onChange={(e) => setEditedDetail({ ...editedDetail, doseName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số liều cần thiết</label>
                          <input
                            type="text"
                            value={editedDetail.doseRequire}
                            onChange={(e) => setEditedDetail({ ...editedDetail, doseRequire: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL hình ảnh</label>
                          <input
                            type="text"
                            value={editedDetail.imageUrl}
                            onChange={(e) => setEditedDetail({ ...editedDetail, imageUrl: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nhà sản xuất</label>
                          <input
                            type="text"
                            value={editedDetail.manufacturer}
                            onChange={(e) => setEditedDetail({ ...editedDetail, manufacturer: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                          <input
                            type="number"
                            value={editedDetail.quantity}
                          onChange={(e) => setEditedDetail({ ...editedDetail, quantity: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng cách giữa các liều</label>
                          <input
                            type="text"
                            value={editedDetail.dateBetweenDoses}
                            onChange={(e) => setEditedDetail({ ...editedDetail, dateBetweenDoses: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Giá (đồng)</label>
                          <input
                            type="number"
                            value={editedDetail.price}
                          onChange={(e) => setEditedDetail({ ...editedDetail, price: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tuổi yêu cầu</label>
                          <input
                            type="number"
                            value={editedDetail.ageRequired}
                          onChange={(e) => setEditedDetail({ ...editedDetail, ageRequired: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div> */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Liều lượng (ml)</label>
                          <input
                            type="number"
                            value={editedDetail.dosageAmount}
                          onChange={(e) => setEditedDetail({ ...editedDetail, dosageAmount: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng thời gian tăng cường</label>
                          <input
                            type="number"
                            value={editedDetail.boosterInterval}
                          onChange={(e) => setEditedDetail({ ...editedDetail, boosterInterval: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      <div className="md:col-span-3 flex justify-end space-x-2 pt-4 border-t mt-4">
                          <button
                            onClick={handleSaveEditDetail}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg
                          transition-all duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                          <span>Lưu thay đổi</span>
                          </button>
                          <button
                            onClick={() => setEditDetailId(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg
                          transition-all duration-200 flex items-center space-x-2"
                          >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>Hủy</span>
                          </button>
                        </div>
                    </div>
                    ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-1">
                          {detail.imageUrl ? (
                            <img
                              src={detail.imageUrl}
                            alt={detail.doseName}
                            className="w-full h-48 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                            }}
                            />
                          ) : (
                          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" 
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          )}
                        </div>
                      <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-800">Tên mũi</h3>
                          <p>{detail.doseName || 'N/A'}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Số liều cần thiết</h3>
                          <p>{detail.doseRequire || 'N/A'}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Nhà sản xuất</h3>
                          <p>{detail.manufacturer || 'N/A'}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Số lượng</h3>
                          <p>{detail.quantity || 'N/A'}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Khoảng cách giữa các liều</h3>
                          <p>{detail.dateBetweenDoses || 'N/A'}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Giá</h3>
                          <p>{detail.price ? `${detail.price.toLocaleString()}đ` : 'N/A'}</p>
                        </div>
                        {/* <div>
                          <h3 className="font-semibold text-gray-800">Tuổi yêu cầu</h3>
                          <p>{detail.ageRequired || 'N/A'}</p>
                        </div> */}
                        <div>
                          <h3 className="font-semibold text-gray-800">Liều lượng</h3>
                          <p>{detail.dosageAmount ? `${detail.dosageAmount}ml` : 'N/A'}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Khoảng thời gian tăng cường</h3>
                          <p>{detail.boosterInterval || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="md:col-span-4 flex justify-end space-x-2 pt-4 border-t">
                          <button
                            onClick={() => handleEditDetail(detail)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg
                          transition-all duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Sửa</span>
                          </button>
                          <button
                          onClick={() => handleDeleteDetail(detail.vaccineDetailsId)}
                            disabled={deleteDetailLoading[detail.vaccineDetailsId]}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg
                          transition-all duration-200 flex items-center space-x-2"
                          >
                            {deleteDetailLoading[detail.vaccineDetailsId] ? (
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" 
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>Xóa</span>
                            </>
                            )}
                          </button>
                        </div>
                    </div>
                    )}
                </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có thông tin chi tiết</h3>
              <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách thêm thông tin chi tiết cho vaccine này.</p>
            </div>
          )}
        </div>
      </div>

      {showAddDetailModal && (
        <AddVaccineDetailModal
          vaccineId={vaccineId}
          onClose={() => setShowAddDetailModal(false)}
          onAddDetail={(newDetail) => {
            setVaccineDetails(prev => [...prev, newDetail]);
            setShowAddDetailModal(false);
          }}
        />
      )}
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
}) => {
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Quản lý Vaccine</h2>
          <button
            onClick={() => setShowAddVaccineForm(!showAddVaccineForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg
            transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Thêm Vaccine</span>
          </button>
        </div>

        {showAddVaccineForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên bệnh</label>
                <input
                  type="text"
                  value={newVaccine.illnessName}
                  onChange={(e) => setNewVaccine({ ...newVaccine, illnessName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên bệnh..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <input
                  type="text"
                  value={newVaccine.descriptions}
                  onChange={(e) => setNewVaccine({ ...newVaccine, descriptions: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mô tả..."
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
            <button
                onClick={handleAddVaccine}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg
                transition-all duration-200 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Lưu Vaccine</span>
                  </>
                )}
            </button>
          </div>
        </div>
      )}

        {/* Vaccine List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên bệnh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vaccines.map((vaccine) => (
                <tr key={vaccine.vaccineId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{vaccine.illnessName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">{vaccine.descriptions}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedVaccine(vaccine);
                          setShowDetailsModal(true);
                        }}
                        className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1 rounded-lg
                        transition-all duration-200 text-sm font-medium flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Chi tiết</span>
                      </button>       
                      <button
                        onClick={() => handleDeleteVaccine(vaccine.vaccineId)}
                        disabled={deleteLoading[vaccine.vaccineId]}
                        className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded-lg
                        transition-all duration-200 text-sm font-medium flex items-center space-x-1"
                      >
                        {deleteLoading[vaccine.vaccineId] ? (
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" 
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Xóa</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <VaccineDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        vaccineId={selectedVaccine?.vaccineId}
        vaccineName={selectedVaccine?.illnessName}
        />
    </div>
  );
};

export default VaccineManagementSection;