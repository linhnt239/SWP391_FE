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

  const handleCreateNews = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token không tồn tại. Vui lòng đăng nhập lại!');
      }

      const response = await fetch('/api/news-create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNews),
      });

      if (!response.ok) {
        throw new Error('Không thể tạo tin tức');
      }

      const data = await response.json();
      setNews([data, ...news]);
      setShowAddModal(false);
      setNewNews({
        img: '',
        title: '',
        description: '',
        source: '',
        category: '',
      });
      toast.success('Tạo tin tức thành công!');
    } catch (error) {
      console.error('Lỗi khi tạo tin tức:', error);
      toast.error('Không thể tạo tin tức. Vui lòng thử lại!');
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
      img: news.img || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateNews = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token không tồn tại. Vui lòng đăng nhập lại!');
      }

      const response = await fetch(`/api/news-update/${editingNews.newsId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingNews.title,
          description: editingNews.description,
          source: editingNews.source,
          category: editingNews.category,
          img: editingNews.img
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật tin tức');
      }

      const updatedNews = await response.json();
      setNews(news.map(item => 
        item.newsId === editingNews.newsId ? updatedNews : item
      ));
      setShowEditModal(false);
      setEditingNews(null);
      toast.success('Cập nhật tin tức thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật tin tức:', error);
      toast.error('Không thể cập nhật tin tức. Vui lòng thử lại!');
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

      setNews(news.filter(item => item.newsId !== deletingNewsId));
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

  const AddNewsModal = () => {
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewNews(prev => ({
        ...prev,
        [name]: value
      }));
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <form onSubmit={handleCreateNews} className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề
              </label>
              <input
                type="text"
                name="title"
                defaultValue={newNews.title}
                onInput={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                name="description"
                defaultValue={newNews.description}
                onInput={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Hình ảnh
              </label>
              <input
                type="url"
                name="img"
                defaultValue={newNews.img}
                onInput={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nguồn
              </label>
              <input
                type="text"
                name="source"
                defaultValue={newNews.source}
                onInput={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục
              </label>
              <input
                type="text"
                name="category"
                defaultValue={newNews.category}
                onInput={handleInputChange}
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
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tạo...
                  </>
                ) : (
                  'Tạo tin tức'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const EditNewsModal = () => {
    const handleEditInputChange = (e) => {
      const { name, value } = e.target;
      setEditingNews(prev => ({
        ...prev,
        [name]: value
      }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-6">Sửa tin tức</h2>
          <form onSubmit={handleUpdateNews}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingNews.title}
                  onInput={handleEditInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={editingNews.description}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Hình ảnh
                </label>
                <input
                  type="url"
                  value={editingNews.img}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nguồn
                </label>
                <input
                  type="text"
                  value={editingNews.source}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục
                </label>
                <input
                  type="text"
                  value={editingNews.category}
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
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
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
                <span className="text-sm text-gray-500">
                  {formatDate(item.createdAt)}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                {item.title}
              </h2>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {item.description}
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Nguồn: {item.source}
                </span>
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
      
      {news.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          Chưa có tin tức nào được đăng.
        </div>
      )}
    </div>
  );
};

export default News;
