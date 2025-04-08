import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNews, setNewNews] = useState({
    img: '',
    title: '',
    description: '',
    source: '',
    category: '',
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingNewsId, setDeletingNewsId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage] = useState(6);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token không tồn tại. Vui lòng đăng nhập lại!');
      }

      const response = await fetch('/api/news-getall', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể lấy danh sách tin tức');
      }

      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Lỗi khi lấy tin tức:', error);
      toast.error('Không thể tải tin tức. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Get current news items
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = news.slice(indexOfFirstNews, indexOfLastNews);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(news.length / newsPerPage);

  // Previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCreateNews = async (formData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token không tồn tại. Vui lòng đăng nhập lại!');
      }

      // Đảm bảo dữ liệu đúng format trước khi gửi
      const newsData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        source: formData.source.trim(),
        category: formData.category.trim(),
        img: formData.img?.trim() || "" // Nếu img không có thì gửi string rỗng
      };

      console.log('Sending data to server:', newsData); // Log để debug

      const response = await fetch('/api/news-create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsData),
      });

      if (!response.ok) {
        throw new Error('Không thể tạo tin tức');
      }

      const data = await response.json();
      console.log('Response from server:', data); // Log để debug
      
      setNews([data, ...news]);
      setShowAddModal(false);
      toast.success('Tạo tin tức thành công!');
    } catch (error) {
      console.error('Lỗi khi tạo tin tức:', error);
      toast.error(error.message || 'Không thể tạo tin tức. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleEditNews = (news) => {
    setEditingNews({
      newsId: news.newsId,
      title: news.title,
      description: news.description,
      source: news.source,
      category: news.category,
      img: news.img || '',
    });
    setShowEditModal(true);
  };

  const handleUpdateNews = async (formData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token không tồn tại. Vui lòng đăng nhập lại!');
      }

      // Đảm bảo dữ liệu đúng format trước khi gửi
      const newsData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        source: formData.source.trim(),
        category: formData.category.trim(),
        img: formData.img?.trim() || ""
      };

      console.log('Sending update data:', newsData); // Log để debug

      const response = await fetch(`/api/news-update/${editingNews.newsId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsData),
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật tin tức');
      }

      const updatedNews = await response.json();
      console.log('Response from server:', updatedNews); // Log để debug

      setNews(news.map((item) => (item.newsId === editingNews.newsId ? updatedNews : item)));
      setShowEditModal(false);
      setEditingNews(null);
      toast.success('Cập nhật tin tức thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật tin tức:', error);
      toast.error(error.message || 'Không thể cập nhật tin tức. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleShowDeleteModal = (newsId) => {
    setDeletingNewsId(newsId);
    setShowDeleteModal(true);
  };

  const handleDeleteNews = async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token không tồn tại. Vui lòng đăng nhập lại!');
      } 

      const response = await fetch(`/api/news-delete/${deletingNewsId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể xóa tin tức');
      }

      setNews(news.filter((item) => item.newsId !== deletingNewsId));
      setShowDeleteModal(false);
      setDeletingNewsId(null);
      toast.success('Xóa tin tức thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa tin tức:', error);
      toast.error('Không thể xóa tin tức. Vui lòng thử lại!');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleShowDetail = (news) => {
    setSelectedNews(news);
    setShowDetailModal(true);
  };

  const AddNewsModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      img: '',
      source: '',
      category: ''
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Kiểm tra dữ liệu trước khi gửi
      if (!formData.title || !formData.description || !formData.source || !formData.category) {
        toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      await handleCreateNews(formData); // Gọi hàm handleCreateNews với formData
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Thêm tin tức mới</h2>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình ảnh</label>
              <input
                type="url"
                name="img"
                value={formData.img}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nguồn</label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
              >
                Tạo tin tức
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const EditNewsModal = () => {
    const [formData, setFormData] = useState({
      title: editingNews?.title || '',
      description: editingNews?.description || '',
      img: editingNews?.img || '',
      source: editingNews?.source || '',
      category: editingNews?.category || ''
    });

    useEffect(() => {
      if (editingNews) {
        setFormData({
          title: editingNews.title || '',
          description: editingNews.description || '',
          img: editingNews.img || '',
          source: editingNews.source || '',
          category: editingNews.category || ''
        });
      }
    }, [editingNews]);

    const handleEditInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Kiểm tra dữ liệu trước khi gửi
      if (!formData.title || !formData.description || !formData.source || !formData.category) {
        toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      await handleUpdateNews(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-6">Sửa tin tức</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình ảnh</label>
                <input
                  type="url"
                  name="img"
                  value={formData.img}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nguồn</label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingNews(null);
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {loading ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Xác nhận xóa</h2>
        <p className="text-gray-600 mb-6">
          Bạn có chắc chắn muốn xóa tin tức này? Hành động này không thể hoàn tác.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setDeletingNewsId(null);
            }}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
            disabled={deleteLoading}
          >
            Hủy
          </button>
          <button
            onClick={handleDeleteNews}
            disabled={deleteLoading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
          >
            {deleteLoading ? 'Đang xóa...' : 'Xóa'}
          </button>
        </div>
      </div>
    </div>
  );

  const NewsDetailModal = () => {
    if (!selectedNews) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{selectedNews.title}</h2>
            <button
              onClick={() => setShowDetailModal(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {selectedNews.img && (
            <div className="mb-6">
              <img
                src={selectedNews.img}
                alt={selectedNews.title}
                className="w-full h-auto rounded-lg object-cover max-h-[400px]"
              />
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {selectedNews.category}
              </span>
              <span className="text-sm text-gray-500">
                Đăng ngày: {formatDate(selectedNews.createdAt)}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Nguồn:</h3>
              <p className="text-gray-600">{selectedNews.source}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Mô tả:</h3>
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {selectedNews.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-4 mt-8 mb-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Trước
        </button>
        <div className="flex items-center space-x-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`w-10 h-10 rounded-full ${
                currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md ${
            currentPage === totalPages
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Sau
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm px-4 py-2 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-lg md:text-xl font-bold text-gray-800">Quản lý tin tức</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-2 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 
            transition-all duration-200 transform hover:scale-105 active:scale-95 hover:shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 animate-pulse"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="hidden sm:inline">Thêm tin tức mới</span>
            <span className="sm:hidden">Thêm mới</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentNews.map((item) => (
              <div
                key={item.newsId}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 
                transform hover:-translate-y-1 flex flex-col group"
              >
                {/* Image Section */}
                <div className="relative h-40 md:h-48 overflow-hidden rounded-t-lg">
                  {item.img ? (
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-300 group-hover:text-gray-400 transition-colors duration-300" 
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs 
                    rounded-full group-hover:bg-blue-200 transition-colors duration-300">
                    {item.category}
                  </span>
                </div>

                {/* Content Section */}
                <div className="p-3 flex-1 flex flex-col">
                  <div className="mb-2">
                    <h2 className="text-base font-medium text-gray-800 line-clamp-2 mb-1 
                      group-hover:text-blue-600 transition-colors duration-300">
                      {item.title}
                    </h2>
                    <time className="text-xs text-gray-500">{formatDate(item.createdAt)}</time>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-2 group-hover:text-gray-900 transition-colors duration-300">
                    {item.description}
                  </p>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span className="truncate max-w-[150px] group-hover:text-gray-700 transition-colors duration-300">
                        Nguồn: {item.source}
                      </span>
                      <button
                        onClick={() => handleShowDetail(item)}
                        className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center group/btn"
                      >
                        Xem thêm
                        <svg 
                          className="w-3 h-3 ml-1 transform transition-transform duration-300 group-hover/btn:translate-x-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleEditNews(item)}
                        className="px-2 py-1 bg-blue-500 text-white rounded inline-flex items-center
                        hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
                      >
                        <svg 
                          className="w-3 h-3 mr-1 transition-transform duration-300 group-hover:rotate-12" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="text-xs font-medium">Sửa</span>
                      </button>
                      <button
                        onClick={() => handleShowDeleteModal(item.newsId)}
                        className="px-2 py-1 bg-red-500 text-white rounded inline-flex items-center
                        hover:bg-red-600 transition-all duration-300 transform hover:scale-105 active:scale-95
                        hover:shadow-md"
                      >
                        <svg 
                          className="w-3 h-3 mr-1 transition-transform duration-300 group-hover:rotate-12" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="text-xs font-medium">Xóa</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {news.length === 0 && (
            <div className="text-center py-8">
              <div className="bg-white rounded-lg p-6 max-w-sm mx-auto shadow-sm hover:shadow-md transition-shadow duration-300">
                <svg
                  className="mx-auto h-10 w-10 text-gray-400 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
                <h3 className="mt-3 text-base font-medium text-gray-900">Chưa có tin tức</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Bắt đầu bằng cách thêm tin tức mới vào hệ thống.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                  transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm
                  hover:shadow-md group"
                >
                  <span className="inline-flex items-center">
                    Thêm tin tức mới
                    <svg 
                      className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Section */}
      {totalPages > 1 && (
        <div className="bg-white border-t border-gray-100 py-3 sticky bottom-0">
          <div className="max-w-7xl mx-auto px-4">
            <Pagination />
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddModal && <AddNewsModal />}
      {showEditModal && <EditNewsModal />}
      {showDeleteModal && <DeleteConfirmModal />}
      {showDetailModal && <NewsDetailModal />}
    </div>
  );
};

export default News;