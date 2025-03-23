import React from 'react';

const ChildProfileForm = ({ formData, handleChange }) => {
    return (
        <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-2">
                Thêm hồ sơ trẻ mới
            </h3>

            <div>
                <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-1">
                    Họ tên trẻ <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="childName"
                    name="childName"
                    value={formData.childName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập họ tên trẻ"
                />
            </div>

            <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày tháng năm sinh <span className="text-red-500">*</span>
                </label>
                <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giới tính <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === 'male'}
                            onChange={handleChange}
                            required
                            className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">Nam</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={formData.gender === 'female'}
                            onChange={handleChange}
                            required
                            className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2">Nữ</span>
                    </label>
                </div>
            </div>

            {formData.childId === 'new' && (
                <div className="flex items-center justify-between pt-2">
                    <p className="text-sm text-gray-600">
                        Hồ sơ trẻ mới sẽ được lưu vào tài khoản của bạn
                    </p>
                    <button
                        type="button"
                        onClick={() => handleChange({
                            target: {
                                name: 'childId',
                                value: '',
                                type: 'text'
                            }
                        })}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        Quay lại
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChildProfileForm; 