import React from 'react';

const TermsModal = ({ onClose, onAccept }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Điều khoản và điều kiện</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <div className="prose max-w-none">
                        <h3>CHÍNH SÁCH VÀ ĐIỀU KIỆN ĐĂNG KÝ & SẮP XẾP ƯU TIÊN</h3>

                        <p>Khi đăng ký tiêm chủng tại hệ thống tiêm chủng, quý khách vui lòng lưu ý một số điều kiện sau:</p>

                        <ol>
                            <li>
                                <strong>Đăng ký thông tin chính xác:</strong> Quý khách cần cung cấp thông tin chính xác và đầy đủ của người được tiêm. Hệ thống chỉ thực hiện tiêm chủng cho khách hàng có thông tin đăng ký trùng khớp hoàn toàn với thông tin cung cấp.
                            </li>
                            <li>
                                <strong>Khám sàng lọc trước tiêm:</strong> Tất cả người được tiêm đều phải được khám sàng lọc trước khi tiêm để đảm bảo an toàn. Kết quả khám sàng lọc sẽ quyết định việc tiêm chủng có được thực hiện hay không.
                            </li>
                            <li>
                                <strong>Thời gian chờ:</strong> Thời gian chờ đợi có thể kéo dài tùy thuộc vào số lượng khách hàng. Quý khách nên đến sớm hơn 15-30 phút so với giờ hẹn.
                            </li>
                            <li>
                                <strong>Theo dõi sau tiêm:</strong> Người được tiêm cần được theo dõi ít nhất 30 phút tại trung tâm sau khi tiêm để đảm bảo không có phản ứng bất thường.
                            </li>
                            <li>
                                <strong>Hủy/đổi lịch:</strong> Nếu quý khách muốn hủy hoặc thay đổi lịch tiêm, vui lòng thông báo trước ít nhất 24 giờ.
                            </li>
                            <li>
                                <strong>Thanh toán:</strong> Quý khách có thể thanh toán trực tiếp tại trung tâm hoặc qua các phương thức thanh toán trực tuyến được cung cấp.
                            </li>
                        </ol>

                        <p>Bằng việc đồng ý với các điều khoản này, quý khách xác nhận đã đọc, hiểu và chấp nhận tất cả các điều kiện nêu trên.</p>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onAccept}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Tôi đã đọc và đồng ý
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsModal; 