import React, { useState } from 'react';

const ParentInfoForm = ({ formData, handleChange }) => {
    const [phoneError, setPhoneError] = useState('');

    const validatePhone = (e) => {
        const value = e.target.value;
        const phoneRegex = /^0\d{9}$/;

        if (!phoneRegex.test(value) && value.length > 0) {
            setPhoneError('Số điện thoại không đúng định dạng');
        } else {
            setPhoneError('');
        }

        handleChange(e);
    };

    return (
        <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin người đăng ký</h3>

            <div className="space-y-4">
                <div>
                    <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-1">
                        Họ tên người đăng ký <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="parentName"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập họ tên người đăng ký"
                    />
                </div>

                <div>
                    <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        id="parentPhone"
                        name="parentPhone"
                        value={formData.parentPhone}
                        onChange={validatePhone}
                        required
                        pattern="^0\d{9}$"
                        className={`w-full px-4 py-2 border ${phoneError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Nhập số điện thoại"
                    />
                    {phoneError && <p className="mt-1 text-sm text-red-500">{phoneError}</p>}
                </div>
            </div>
        </div>
    );
};

export default ParentInfoForm; 