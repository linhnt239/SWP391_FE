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
        additionalInfo: ''
    });
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Lấy thông tin người dùng từ localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                setUserId(user.userId);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchChildren();
        } else {
            setIsLoading(false);
        }
    }, [userId]);

    const fetchChildren = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/children/${userId}`);
            const data = await response.json();

            if (response.ok) {
                setChildren(data.children || []);
            } else {
                console.error('Error fetching children:', data.message);
            }
        } catch (error) {
            console.error('Error fetching children:', error);
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
                additionalInfo: child.additionalInfo || ''
            });
        } else {
            setCurrentChild(null);
            setFormData({
                childrenName: '',
                dateOfBirth: '',
                gender: 'male',
                additionalInfo: ''
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

        const childData = {
            ...formData,
            userId
        };

        try {
            let response;

            if (currentChild) {
                // Cập nhật hồ sơ trẻ hiện có
                response = await fetch(`/api/children/${currentChild.childId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(childData)
                });
            } else {
                // Tạo hồ sơ trẻ mới
                response = await fetch('/api/children', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(childData)
                });
            }

            const data = await response.json();

            if (response.ok) {
                fetchChildren();
                handleCloseModal();
            } else {
                console.error('Error saving child profile:', data.message);
            }
        } catch (error) {
            console.error('Error saving child profile:', error);
        }
    };

    const handleDelete = async (childId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa hồ sơ này không?')) {
            try {
                const response = await fetch(`/api/children/${childId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    fetchChildren();
                } else {
                    const data = await response.json();
                    console.error('Error deleting child profile:', data.message);
                }
            } catch (error) {
                console.error('Error deleting child profile:', error);
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

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : children.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {children.map((child) => (
                            <div key={child.childId} className="bg-white rounded-lg shadow-lg overflow-hidden">
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
                                                onClick={() => handleDelete(child.childId)}
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
                                        {child.additionalInfo && (
                                            <div>
                                                <span className="font-semibold block mb-1">Thông tin thêm:</span>
                                                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                    {child.additionalInfo}
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
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="additionalInfo">
                                                Thông tin thêm
                                            </label>
                                            <textarea
                                                id="additionalInfo"
                                                name="additionalInfo"
                                                value={formData.additionalInfo}
                                                onChange={handleChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                rows="4"
                                                placeholder="Nhập thông tin thêm về trẻ (nếu có)"
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
