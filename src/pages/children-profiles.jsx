import React, { useState, useEffect } from 'react';
import DefaultLayout from '@/components/layout/DefaultLayout';
import { BiPlus, BiEdit, BiTrash, BiChild } from 'react-icons/bi';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';

const ChildrenProfiles = () => {
    const [children, setChildren] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentChild, setCurrentChild] = useState(null);
    const [formData, setFormData] = useState({
        childrenName: '',
        dateOfBirth: '',
        gender: 'male',
        medicalIssue: ''
    });
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy thông tin người dùng và token từ localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');

        if (!savedToken) {
            setError('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
            setIsLoading(false);
            return;
        }

        setToken(savedToken);

        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                if (user && user.userID) {
                    setUserId(user.userID);
                    console.log("User ID loaded:", user.userID);
                } else {
                    console.error('User ID not found in stored user data');
                    setError('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                setError('Không thể lấy thông tin người dùng');
            }
        } else {
            console.error('No user data found in localStorage');
            setError('Vui lòng đăng nhập để xem hồ sơ trẻ');
        }
    }, []);

    // Tạo API headers với token
    const createHeaders = () => {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    // Fetch children data when userId and token are available
    useEffect(() => {
        if (userId && token) {
            fetchChildren();
        } else {
            setIsLoading(false);
        }
    }, [userId, token]);

    const fetchChildren = async () => {
        setIsLoading(true);
        try {
            console.log("Fetching children with token:", token);
            console.log("User ID:", userId);

            const response = await fetch(`/api/child-get/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API Error Response:", errorText);
                throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            console.log("Children data (raw):", data);

            // Kiểm tra cấu trúc dữ liệu trả về và cập nhật state
            let processedChildren = [];

            if (Array.isArray(data)) {
                console.log("Data is an array");
                processedChildren = data;
            } else if (data && typeof data === 'object') {
                console.log("Data is an object");
                // Kiểm tra các trường phổ biến có thể chứa mảng trẻ em
                if (data.children && Array.isArray(data.children)) {
                    processedChildren = data.children;
                } else if (data.data && Array.isArray(data.data)) {
                    processedChildren = data.data;
                } else if (data.results && Array.isArray(data.results)) {
                    processedChildren = data.results;
                } else if (data.items && Array.isArray(data.items)) {
                    processedChildren = data.items;
                } else {
                    // Nếu không tìm thấy mảng, kiểm tra xem đối tượng có phải là một hồ sơ trẻ không
                    if (data.childrenId || data.childrenName) {
                        processedChildren = [data];
                    } else {
                        // Log toàn bộ cấu trúc dữ liệu để debug
                        console.log("Unknown data structure:", JSON.stringify(data, null, 2));
                    }
                }
            }

            console.log("Processed children:", processedChildren);
            setChildren(processedChildren);
            setError(null);
        } catch (error) {
            console.error('Error fetching children:', error);
            setError(`Không thể tải danh sách hồ sơ trẻ: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (child = null) => {
        if (child) {
            setCurrentChild(child);
            setFormData({
                childrenName: child.childrenName,
                dateOfBirth: child.dateOfBirth.split('T')[0], // Format date for input
                gender: child.gender,
                medicalIssue: child.medicalIssue || ''
            });
        } else {
            setCurrentChild(null);
            setFormData({
                childrenName: '',
                dateOfBirth: '',
                gender: 'male',
                medicalIssue: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId || !token) {
            alert('Không tìm thấy thông tin người dùng hoặc token. Vui lòng đăng nhập lại.');
            return;
        }

        try {
            let response;

            if (currentChild) {
                // Cập nhật hồ sơ trẻ hiện có
                response = await fetch(`/api/child-update/${currentChild.childrenId}`, {
                    method: 'PUT',
                    headers: createHeaders(),
                    body: JSON.stringify(formData)
                });
            } else {
                // Tạo hồ sơ trẻ mới
                response = await fetch(`/api/child-create/${userId}`, {
                    method: 'POST',
                    headers: createHeaders(),
                    body: JSON.stringify(formData)
                });
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            console.log("Save response:", data);

            // Hiển thị thông báo thành công
            alert(currentChild ? 'Cập nhật hồ sơ trẻ thành công' : 'Thêm hồ sơ trẻ thành công');

            // Tải lại danh sách trẻ sau khi thêm/cập nhật
            fetchChildren();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving child profile:', error);
            alert(`Không thể lưu hồ sơ trẻ: ${error.message}`);
        }
    };

    const handleDelete = async (childrenId) => {
        if (!token) {
            alert('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
            return;
        }

        if (window.confirm('Bạn có chắc chắn muốn xóa hồ sơ này không?')) {
            try {
                const response = await fetch(`/api/child-delete/${childrenId}`, {
                    method: 'DELETE',
                    headers: createHeaders()
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
                }

                // Hiển thị thông báo thành công
                alert('Xóa hồ sơ trẻ thành công');

                // Tải lại danh sách trẻ sau khi xóa
                fetchChildren();
            } catch (error) {
                console.error('Error deleting child profile:', error);
                alert(`Không thể xóa hồ sơ trẻ: ${error.message}`);
            }
        }
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'dd MMMM yyyy', { locale: vi });
        } catch (error) {
            return dateString;
        }
    };

    const calculateAge = (dateOfBirth) => {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 1) {
            // Tính tuổi theo tháng nếu dưới 1 tuổi
            const monthAge = today.getMonth() - birthDate.getMonth() +
                (today.getFullYear() - birthDate.getFullYear()) * 12;
            return `${monthAge} tháng`;
        }

        return `${age} tuổi`;
    };

    return (
        <DefaultLayout>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Hồ sơ của trẻ</h1>
                        <p className="text-gray-600 mt-2">Quản lý thông tin của trẻ</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        <BiPlus className="mr-2" /> Thêm hồ sơ trẻ
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
                        <p>{error}</p>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : children.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {children.map((child) => (
                            <div key={child.childrenId} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-bold text-gray-800">{child.childrenName}</h2>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleOpenModal(child)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <BiEdit size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(child.childrenId)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <BiTrash size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-gray-600">
                                        <div className="flex items-center">
                                            <span className="font-semibold w-32">Ngày sinh:</span>
                                            <span>{formatDate(child.dateOfBirth)}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-semibold w-32">Tuổi:</span>
                                            <span>{calculateAge(child.dateOfBirth)}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-semibold w-32">Giới tính:</span>
                                            <span>{child.gender === 'male' ? 'Nam' : 'Nữ'}</span>
                                        </div>
                                        {child.medicalIssue && (
                                            <div>
                                                <span className="font-semibold block mb-1">Vấn đề sức khỏe:</span>
                                                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                    {child.medicalIssue}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <BiChild className="text-6xl text-blue-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Chưa có hồ sơ trẻ nào</h2>
                        <p className="text-gray-600 mb-6">Hãy thêm hồ sơ của trẻ để quản lý lịch tiêm chủng</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center"
                        >
                            <BiPlus className="mr-2" /> Thêm hồ sơ trẻ
                        </button>
                    </div>
                )}

                {/* Modal thêm/sửa hồ sơ trẻ */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    {currentChild ? 'Cập nhật hồ sơ trẻ' : 'Thêm hồ sơ trẻ'}
                                </h2>

                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="childrenName">
                                                Tên trẻ
                                            </label>
                                            <input
                                                type="text"
                                                id="childrenName"
                                                name="childrenName"
                                                value={formData.childrenName}
                                                onChange={handleChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateOfBirth">
                                                Ngày sinh
                                            </label>
                                            <input
                                                type="date"
                                                id="dateOfBirth"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth}
                                                onChange={handleChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                                Giới tính
                                            </label>
                                            <div className="flex space-x-4">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="male"
                                                        checked={formData.gender === 'male'}
                                                        onChange={handleChange}
                                                        className="form-radio h-4 w-4 text-blue-600"
                                                    />
                                                    <span className="ml-2 text-gray-700">Nam</span>
                                                </label>
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="female"
                                                        checked={formData.gender === 'female'}
                                                        onChange={handleChange}
                                                        className="form-radio h-4 w-4 text-blue-600"
                                                    />
                                                    <span className="ml-2 text-gray-700">Nữ</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="medicalIssue">
                                                Vấn đề sức khỏe
                                            </label>
                                            <textarea
                                                id="medicalIssue"
                                                name="medicalIssue"
                                                value={formData.medicalIssue}
                                                onChange={handleChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                rows="4"
                                                placeholder="Nhập thông tin về vấn đề sức khỏe của trẻ (nếu có)"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        >
                                            {currentChild ? 'Cập nhật' : 'Thêm mới'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default ChildrenProfiles;
