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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý tin tức</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Thêm tin tức mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <div
            key={item.newsId}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {item.img ? (
              <img src={item.img} alt={item.title} className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Không có hình ảnh</span>
              </div>
            )}

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                  {item.category}
                </span>
                <span className="text-sm text-gray-500">{formatDate(item.createdAt)}</span>
              </div>

              <h2 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h2>

              <div className="relative">
                <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>
                <button
                  onClick={() => handleShowDetail(item)}
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  Xem thêm
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Nguồn: {item.source}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditNews(item)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleShowDeleteModal(item.newsId)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && <AddNewsModal />}
      {showEditModal && <EditNewsModal />}
      {showDeleteModal && <DeleteConfirmModal />}
      {showDetailModal && <NewsDetailModal />}

      {news.length === 0 && (
        <div className="text-center text-gray-500 mt-8">Chưa có tin tức nào được đăng.</div>
      )}
    </div>
  );
};

export default News;