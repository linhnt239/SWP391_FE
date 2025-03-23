import React from 'react';

const ConfirmationStep = ({ formData, selectedChild, setStep, handleCheckout }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Xác nhận thông tin</h2>
            {/* Hiển thị thông tin đã chọn */}
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold">Thông tin trẻ:</h3>
                    <p>Tên: {selectedChild ? selectedChild.childrenName : formData.childName}</p>
                    <p>Giới tính: {selectedChild ? (selectedChild.gender === 'male' ? 'Nam' : 'Nữ') : (formData.gender === 'male' ? 'Nam' : 'Nữ')}</p>
                    <p>Ngày sinh: {selectedChild ? selectedChild.dateOfBirth : formData.dateOfBirth}</p>
                </div>
                <div>
                    <h3 className="font-semibold">Thời gian:</h3>
                    <p>Ngày: {formData.preferredDate}</p>
                    <p>Giờ: {formData.preferredTime}</p>
                </div>
                {formData.note && (
                    <div>
                        <h3 className="font-semibold">Ghi chú:</h3>
                        <p>{formData.note}</p>
                    </div>
                )}
            </div>

            {/* Nút điều hướng */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                    Quay lại
                </button>
                <button
                    onClick={handleCheckout}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Xác nhận và thanh toán
                </button>
            </div>
        </div>
    );
};

export default ConfirmationStep; 