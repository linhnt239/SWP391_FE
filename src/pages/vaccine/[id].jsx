import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/components/layout/DefaultLayout';
import Link from 'next/link';
import Image from 'next/image';

const VaccineDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [vaccine, setVaccine] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchVaccineDetail = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/vaccinedetails-all?vaccineId=${id}`);

                if (!response.ok) {
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }

                const responseData = await response.json();
                console.log("API Response:", responseData);

                // Tìm vaccine có vaccineId trùng với id từ URL
                const vaccineData = responseData.find(item => item.vaccineId === id) || responseData[0];

                if (!vaccineData) {
                    throw new Error('Không tìm thấy thông tin vaccine');
                }

                console.log("Selected Vaccine Data:", vaccineData);

                // Định dạng dữ liệu cho phù hợp với UI
                const formattedVaccine = {
                    id: vaccineData.vaccineId || id,
                    detailsId: vaccineData.vaccineDetailsId || 'Không có mã',
                    name: vaccineData.doseName || 'Không có tên',
                    description: 'Vaccine phòng ngừa bệnh truyền nhiễm',
                    ageGroup: 'Phù hợp với mọi lứa tuổi',
                    price: vaccineData.price || 0,
                    doses: vaccineData.doseRequire || 1,
                    manufacturer: vaccineData.manufacturer || 'Chưa có thông tin',
                    schedule: [
                        `Liều lượng: ${vaccineData.doseRequire || '1'} mũi`,
                        `Thời gian giữa các mũi: ${vaccineData.dateBetweenDoses || '0'} ngày`
                    ],
                    sideEffects: 'Có thể gặp một số tác dụng phụ nhẹ như: sốt nhẹ, đau tại chỗ tiêm, mệt mỏi. Các triệu chứng này thường tự hết sau 1-2 ngày.',
                    contraindications: 'Không tiêm cho người đang bị sốt, bệnh cấp tính hoặc có tiền sử dị ứng với bất kỳ thành phần nào của vaccine.',
                    benefits: 'Bảo vệ cơ thể khỏi các bệnh truyền nhiễm nguy hiểm, giảm nguy cơ biến chứng và tử vong.',
                    longDescription: 'Thông tin chi tiết về vaccine sẽ được cập nhật sau.',
                    quantity: vaccineData.quantity || 0,
                    createdAt: vaccineData.createdAt || '',
                    updateAt: vaccineData.updateAt || '',
                    status: vaccineData.status || 'Đang cập nhật',
                    dateBetweenDoses: vaccineData.dateBetweenDoses || 0,
                    imageUrl: vaccineData.imageUrl || null
                };

                console.log("Formatted Vaccine:", formattedVaccine);
                setVaccine(formattedVaccine);
                setError(null);
            } catch (error) {
                console.error('Error fetching vaccine details:', error);
                setError(error.message || 'Đã xảy ra lỗi khi tải thông tin vaccine');
            } finally {
                setIsLoading(false);
            }
        };

        fetchVaccineDetail();
    }, [id]);

    // Hàm định dạng giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // Hàm định dạng ngày tháng
    const formatDate = (dateString) => {
        if (!dateString) return 'Không có thông tin';

        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date);
        } catch (error) {
            return dateString;
        }
    };

    const handleAddToCart = () => {
        try {
            // Lấy giỏ hàng hiện tại từ localStorage hoặc tạo mới nếu chưa có
            const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');

            // Kiểm tra xem vaccine đã có trong giỏ hàng chưa
            const existingItem = currentCart.find(item => item.id === vaccine.id);

            if (existingItem) {
                // Nếu đã có, hiển thị thông báo và không thêm vào giỏ hàng
                alert('Vaccine này đã có trong giỏ hàng của bạn!');
                return;
            } else {
                // Nếu chưa có, thêm mới vào giỏ hàng với số lượng cố định là 1
                currentCart.push({
                    id: vaccine.id,
                    name: vaccine.name,
                    price: vaccine.price,
                    quantity: 1, // Số lượng cố định là 1
                    manufacturer: vaccine.manufacturer,
                    doses: vaccine.doses,
                    dateBetweenDoses: vaccine.dateBetweenDoses
                });
            }

            // Lưu giỏ hàng vào localStorage
            localStorage.setItem('cart', JSON.stringify(currentCart));

            // Kích hoạt sự kiện cập nhật giỏ hàng
            window.dispatchEvent(new Event('cartUpdated'));

            // Hiển thị thông báo thành công
            setAddedToCart(true);

            // Reset thông báo sau 3 giây
            setTimeout(() => {
                setAddedToCart(false);
            }, 3000);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    if (isLoading) {
        return (
            <DefaultLayout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </DefaultLayout>
        );
    }

    if (error) {
        return (
            <DefaultLayout>
                <div className="container mx-auto px-4 py-12">
                    <Link href="/services" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Quay lại danh sách vaccine
                    </Link>

                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 mb-8">
                        <div className="flex items-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="text-lg font-semibold">Không thể tải thông tin vaccine</h3>
                        </div>
                        <p>{error}</p>
                        <p className="mt-3">Vui lòng thử lại sau hoặc liên hệ với quản trị viên.</p>
                    </div>
                </div>
            </DefaultLayout>
        );
    }

    if (!vaccine) {
        return (
            <DefaultLayout>
                <div className="container mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy thông tin vaccine</h1>
                    <Link href="/services" className="text-blue-600 hover:text-blue-800 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Quay lại danh sách vaccine
                    </Link>
                </div>
            </DefaultLayout>
        );
    }

    // Xác định trạng thái hiển thị
    const displayStatus = vaccine.status.includes('Available') ? 'Đang cập nhật' : vaccine.status;
    const isAvailable = vaccine.quantity > 0;

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumbs */}
                <nav className="flex mb-6" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                        <li className="inline-flex items-center">
                            <Link href="/" className="text-gray-700 hover:text-blue-600">
                                Trang chủ
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                </svg>
                                <Link href="/services" className="ml-1 text-gray-700 hover:text-blue-600 md:ml-2">
                                    Dịch vụ
                                </Link>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                </svg>
                                <span className="ml-1 text-gray-500 md:ml-2">{vaccine.name}</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                {addedToCart && (
                    <div className="fixed top-20 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 shadow-lg flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span>Đã thêm vào giỏ hàng!</span>
                        <button
                            onClick={() => router.push('/cart')}
                            className="ml-4 text-blue-600 hover:text-blue-800 underline"
                        >
                            Xem giỏ hàng
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl font-bold text-gray-800">{vaccine.name}</h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {isAvailable ? 'Còn hàng' : 'Hết hàng'}
                            </span>
                        </div>
                        <p className="text-gray-600 mt-2">{vaccine.description}</p>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                                    <h2 className="text-xl font-bold text-blue-900 mb-4">Thông tin cơ bản</h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-700">Giá tiêm:</span>
                                            <span className="font-bold text-blue-600">{formatPrice(vaccine.price)}/mũi</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-700">Số mũi tiêm:</span>
                                            <span>{vaccine.doses} mũi</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-700">Thời gian giữa các mũi:</span>
                                            <span>{vaccine.dateBetweenDoses} ngày</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-700">Đối tượng:</span>
                                            <span>{vaccine.ageGroup}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-700">Nhà sản xuất:</span>
                                            <span>{vaccine.manufacturer}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-700">Số lượng hiện có:</span>
                                            <span className={`font-bold ${vaccine.quantity > 50 ? 'text-green-600' : vaccine.quantity > 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                {vaccine.quantity} liều
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-3">Lịch tiêm chủng</h2>
                                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                        {vaccine.schedule.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-3">Lợi ích</h2>
                                    <p className="text-gray-600 bg-green-50 p-4 rounded-lg">{vaccine.benefits}</p>
                                </div>
                            </div>

                            <div>
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-3">Tác dụng phụ có thể gặp</h2>
                                    <p className="text-gray-600 bg-yellow-50 p-4 rounded-lg">{vaccine.sideEffects}</p>
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-3">Chống chỉ định</h2>
                                    <p className="text-gray-600 bg-red-50 p-4 rounded-lg">{vaccine.contraindications}</p>
                                </div>

                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <h2 className="text-xl font-bold text-blue-900 mb-4">Tình trạng vaccine</h2>
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">Số lượng hiện có:</span>
                                            <span className="font-bold">{vaccine.quantity} liều</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className={`h-2.5 rounded-full ${vaccine.quantity > 50 ? 'bg-green-600' : vaccine.quantity > 10 ? 'bg-yellow-600' : 'bg-red-600'}`}
                                                style={{ width: `${Math.min((vaccine.quantity / 100) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-4">
                                        {vaccine.quantity <= 0 ?
                                            "Hiện tại vaccine đã hết hàng, vui lòng quay lại sau." :
                                            vaccine.quantity <= 10 ?
                                                "Số lượng vaccine sắp hết, vui lòng đặt lịch sớm." :
                                                "Vaccine đang có sẵn để tiêm chủng."
                                        }
                                    </p>
                                    <button
                                        onClick={handleAddToCart}
                                        className={`w-full ${isAvailable ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center`}
                                        disabled={!isAvailable}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        {isAvailable ? 'Thêm vào giỏ hàng' : 'Hiện không thể đặt mua'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Lưu ý khi tiêm chủng</h2>
                            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Trẻ cần được khám sàng lọc trước khi tiêm chủng.
                                    </li>
                                    <li className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Phụ huynh nên theo dõi trẻ trong vòng 30 phút sau tiêm tại cơ sở y tế.
                                    </li>
                                    <li className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Tiếp tục theo dõi trẻ trong 24-48 giờ sau tiêm.
                                    </li>
                                    <li className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Nếu trẻ có biểu hiện bất thường, hãy liên hệ ngay với cơ sở y tế.
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 justify-center">
                            <button
                                onClick={handleAddToCart}
                                className={`${isAvailable ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white px-8 py-4 rounded-lg flex items-center justify-center transition-colors font-bold text-lg`}
                                disabled={!isAvailable}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {isAvailable ? 'Thêm vào giỏ hàng' : 'Hiện không thể đặt mua'}
                            </button>
                            <Link
                                href="/cart"
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg flex items-center justify-center transition-colors font-bold text-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Xem giỏ hàng
                            </Link>
                            <Link
                                href="/services"
                                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg flex items-center justify-center transition-colors font-bold text-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Xem vaccine khác
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default VaccineDetail;