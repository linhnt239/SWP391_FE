import React from 'react';

const ChildProfileSelector = ({
    formData,
    handleChange,
    children,
    selectedChild,
    formatDate,
    calculateAge
}) => {
    return (
        <div className="mb-6">
            <label htmlFor="childId" className="block text-sm font-medium text-gray-700 mb-1">
                Chọn hồ sơ trẻ <span className="text-red-500">*</span>
            </label>

            <div className="space-y-4">
                <select
                    id="childId"
                    name="childId"
                    value={formData.childId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">-- Chọn hồ sơ trẻ --</option>
                    {children.map(child => (
                        <option
                            key={child.childrenId || child.id}
                            value={child.childrenId || child.id}
                        >
                            {child.childrenName || child.name} - {formatDate(child.dateOfBirth || child.dob)}
                        </option>
                    ))}
                    <option value="new">+ Thêm hồ sơ trẻ mới</option>
                </select>

                {selectedChild && formData.childId !== 'new' ? (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-medium text-blue-800 mb-2">Thông tin trẻ đã chọn:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Họ tên:</p>
                                <p className="font-medium">{selectedChild.childrenName || selectedChild.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Ngày sinh:</p>
                                <p className="font-medium">{formatDate(selectedChild.dateOfBirth || selectedChild.dob)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Tuổi:</p>
                                <p className="font-medium">{calculateAge(selectedChild.dateOfBirth || selectedChild.dob)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Giới tính:</p>
                                <p className="font-medium">{selectedChild.gender === 'male' ? 'Nam' : 'Nữ'}</p>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default ChildProfileSelector; 