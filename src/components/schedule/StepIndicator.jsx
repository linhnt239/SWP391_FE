import React from 'react';

const StepIndicator = ({ currentStep }) => {
    return (
        <div className="flex justify-center items-center mb-6">
            <div className={`flex flex-col items-center ${currentStep === 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                    1
                </div>
                <span className="text-sm font-medium">Thông tin người được tiêm</span>
            </div>
            <div className={`w-16 h-1 mx-2 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex flex-col items-center ${currentStep === 2 ? 'text-blue-600' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                    2
                </div>
                <span className="text-sm font-medium">Thanh toán</span>
            </div>
            <div className="w-16 h-1 mx-2 bg-gray-300"></div>
            <div className="flex flex-col items-center text-gray-500">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-gray-300">
                    3
                </div>
                <span className="text-sm font-medium">Xác nhận từ chúng tôi</span>
            </div>
            <div className="flex flex-col items-center text-gray-500">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-gray-300">
                    4
                </div>
                <span className="text-sm font-medium">Finish</span>
            </div>
        </div>
    );
};

export default StepIndicator; 