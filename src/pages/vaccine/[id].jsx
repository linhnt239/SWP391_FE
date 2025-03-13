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

    useEffect(() => {
        if (!id) return;

        // Giả lập việc lấy dữ liệu từ API
        const fetchVaccineDetail = async () => {
            try {
                // Dữ liệu mẫu - trong thực tế sẽ lấy từ API
                const vaccinesData = [
                    {
                        id: 1,
                        name: 'Vaccine phòng lao (BCG)',
                        description: 'Vaccine phòng bệnh lao, tiêm cho trẻ sơ sinh',
                        longDescription: 'Vaccine BCG (Bacillus Calmette-Guérin) là vaccine phòng bệnh lao, được tiêm cho trẻ sơ sinh để bảo vệ trẻ khỏi bệnh lao. Vaccine này đặc biệt quan trọng ở các quốc gia có tỷ lệ mắc bệnh lao cao.\n\nVaccine BCG giúp bảo vệ trẻ khỏi các dạng lao nặng như lao màng não và lao toàn thể. Hiệu quả bảo vệ của vaccine BCG đối với lao phổi ở người lớn là khác nhau tùy theo vùng địa lý.',
                        ageGroup: 'Trẻ từ 0-1 tuổi',
                        price: 150000,
                        doses: 1,
                        image: '/images/bcg-vaccine.jpg',
                        manufacturer: 'Viện Pasteur, Việt Nam',
                        schedule: [
                            'Tiêm 1 mũi duy nhất trong vòng 1 tháng đầu sau sinh'
                        ],
                        sideEffects: 'Sau tiêm có thể xuất hiện nốt sẩn đỏ tại vị trí tiêm, sau đó có thể loét nhỏ và để lại sẹo nhỏ. Đây là phản ứng bình thường của vaccine BCG.',
                        contraindications: 'Trẻ bị suy giảm miễn dịch, đang mắc bệnh nhiễm trùng cấp tính, sốt cao.',
                        benefits: 'Bảo vệ trẻ khỏi các dạng lao nặng, đặc biệt là lao màng não và lao toàn thể ở trẻ nhỏ.'
                    },
                    {
                        id: 2,
                        name: 'Vaccine 5 trong 1 (Pentaxim)',
                        description: 'Phòng bạch hầu, ho gà, uốn ván, bại liệt và Hib',
                        longDescription: 'Vaccine Pentaxim là vaccine phối hợp 5 trong 1 được sản xuất bởi hãng dược phẩm Sanofi Pasteur của Pháp. Vaccine này giúp phòng ngừa 5 bệnh nguy hiểm ở trẻ nhỏ bao gồm bạch hầu, ho gà, uốn ván, bại liệt và các bệnh do Hib gây ra như viêm màng não, viêm phổi, viêm thanh quản.\n\nVaccine Pentaxim được chỉ định tiêm cho trẻ từ 2 tháng tuổi trở lên. Lịch tiêm cơ bản gồm 3 mũi, mỗi mũi cách nhau ít nhất 1 tháng. Trẻ cần được tiêm đủ 3 mũi để đạt hiệu quả bảo vệ tối ưu.\n\nSau khi tiêm, cơ thể trẻ sẽ sản sinh ra kháng thể chống lại các mầm bệnh, giúp bảo vệ trẻ khỏi các bệnh nguy hiểm này.',
                        ageGroup: 'Trẻ từ 2-24 tháng',
                        price: 700000,
                        doses: 3,
                        image: '/images/pentaxim-vaccine.jpg',
                        manufacturer: 'Sanofi Pasteur, Pháp',
                        schedule: [
                            'Mũi 1: Lúc trẻ được 2 tháng tuổi',
                            'Mũi 2: Cách mũi 1 ít nhất 1 tháng',
                            'Mũi 3: Cách mũi 2 ít nhất 1 tháng'
                        ],
                        sideEffects: 'Có thể gặp một số tác dụng phụ nhẹ như: sốt nhẹ, đau tại chỗ tiêm, mệt mỏi, bỏ ăn. Các triệu chứng này thường tự hết sau 1-2 ngày.',
                        contraindications: 'Không tiêm cho trẻ đang bị sốt, bệnh cấp tính hoặc có tiền sử dị ứng với bất kỳ thành phần nào của vaccine.',
                        benefits: 'Bảo vệ trẻ khỏi 5 bệnh nguy hiểm, giảm nguy cơ biến chứng và tử vong do các bệnh này gây ra.'
                    },
                    {
                        id: 3,
                        name: 'Vaccine sởi - quai bị - rubella (MMR)',
                        description: 'Phòng bệnh sởi, quai bị và rubella',
                        longDescription: 'Vaccine MMR là vaccine phối hợp giúp phòng ngừa ba bệnh: sởi, quai bị và rubella (còn gọi là bệnh sởi Đức). Đây là những bệnh truyền nhiễm nguy hiểm có thể gây ra nhiều biến chứng nghiêm trọng.\n\nSởi có thể gây viêm phổi, viêm não và thậm chí tử vong. Quai bị có thể gây viêm tinh hoàn ở nam giới, viêm buồng trứng ở nữ giới và đôi khi gây vô sinh. Rubella nếu nhiễm ở phụ nữ mang thai có thể gây dị tật bẩm sinh nghiêm trọng cho thai nhi.\n\nVaccine MMR được tiêm cho trẻ từ 9 tháng tuổi trở lên, với liều thứ hai được tiêm khi trẻ 18 tháng tuổi để tăng cường hiệu quả bảo vệ.',
                        ageGroup: 'Trẻ từ 9 tháng',
                        price: 300000,
                        doses: 2,
                        image: '/images/mmr-vaccine.jpg',
                        manufacturer: 'Merck, Hoa Kỳ',
                        schedule: [
                            'Mũi 1: Khi trẻ được 9-12 tháng tuổi',
                            'Mũi 2: Khi trẻ được 18 tháng tuổi'
                        ],
                        sideEffects: 'Có thể gặp sốt nhẹ, phát ban nhẹ, sưng hạch bạch huyết. Hiếm khi gây sốt cao hoặc co giật do sốt.',
                        contraindications: 'Không tiêm cho người đang mang thai, người suy giảm miễn dịch nặng, người có tiền sử dị ứng với thành phần của vaccine.',
                        benefits: 'Bảo vệ trẻ khỏi ba bệnh truyền nhiễm nguy hiểm, ngăn ngừa các biến chứng nghiêm trọng và góp phần loại trừ các bệnh này khỏi cộng đồng.'
                    },
                    {
                        id: 4,
                        name: 'Vaccine viêm gan B',
                        description: 'Phòng bệnh viêm gan B',
                        longDescription: 'Vaccine viêm gan B giúp phòng ngừa bệnh viêm gan B, một bệnh truyền nhiễm nguy hiểm do virus viêm gan B (HBV) gây ra. Bệnh viêm gan B có thể dẫn đến viêm gan cấp tính hoặc mạn tính, xơ gan và ung thư gan.\n\nVaccine viêm gan B được khuyến cáo tiêm cho tất cả trẻ sơ sinh, trẻ em và người lớn chưa được tiêm phòng. Đối với trẻ sơ sinh, mũi đầu tiên nên được tiêm trong vòng 24 giờ sau sinh.\n\nVaccine viêm gan B có hiệu quả cao, với tỷ lệ bảo vệ trên 95% sau khi hoàn thành đủ liều. Miễn dịch sau tiêm có thể kéo dài nhiều năm, thậm chí suốt đời.',
                        ageGroup: 'Mọi lứa tuổi',
                        price: 220000,
                        doses: 3,
                        image: '/images/hepb-vaccine.jpg',
                        manufacturer: 'GSK, Bỉ',
                        schedule: [
                            'Mũi 1: Trong vòng 24 giờ sau sinh',
                            'Mũi 2: Khi trẻ được 2 tháng tuổi',
                            'Mũi 3: Khi trẻ được 6 tháng tuổi'
                        ],
                        sideEffects: 'Đau, sưng, đỏ tại chỗ tiêm. Hiếm khi gây sốt nhẹ, mệt mỏi, đau đầu.',
                        contraindications: 'Người có tiền sử dị ứng nặng với thành phần của vaccine.',
                        benefits: 'Phòng ngừa bệnh viêm gan B cấp tính và mạn tính, giảm nguy cơ xơ gan và ung thư gan do virus viêm gan B gây ra.'
                    },
                    {
                        id: 5,
                        name: 'Vaccine phòng thủy đậu (Varicella)',
                        description: 'Phòng bệnh thủy đậu',
                        longDescription: 'Vaccine thủy đậu (Varicella) giúp phòng ngừa bệnh thủy đậu, một bệnh truyền nhiễm do virus Varicella-zoster gây ra. Bệnh thủy đậu thường gây sốt và phát ban ngứa trên khắp cơ thể.\n\nMặc dù thủy đậu thường là bệnh nhẹ ở trẻ em khỏe mạnh, nhưng có thể gây biến chứng nghiêm trọng như nhiễm trùng da, viêm phổi, viêm não và thậm chí tử vong, đặc biệt ở trẻ sơ sinh, người lớn và người có hệ miễn dịch suy yếu.\n\nVaccine thủy đậu được khuyến cáo tiêm cho trẻ từ 12 tháng tuổi trở lên, với liều thứ hai được tiêm khi trẻ 4-6 tuổi. Vaccine có hiệu quả khoảng 85% trong việc ngăn ngừa mọi dạng của bệnh thủy đậu và gần 100% trong việc ngăn ngừa các dạng nặng của bệnh.',
                        ageGroup: 'Trẻ từ 12 tháng trở lên',
                        price: 650000,
                        doses: 2,
                        image: '/images/varicella-vaccine.jpg',
                        manufacturer: 'Merck, Hoa Kỳ',
                        schedule: [
                            'Mũi 1: Khi trẻ được 12-15 tháng tuổi',
                            'Mũi 2: Khi trẻ được 4-6 tuổi'
                        ],
                        sideEffects: 'Đau, sưng tại chỗ tiêm. Một số trường hợp có thể xuất hiện phát ban nhẹ giống thủy đậu (5-26 ngày sau tiêm).',
                        contraindications: 'Người đang mang thai, người suy giảm miễn dịch nặng, người có tiền sử dị ứng với thành phần của vaccine.',
                        benefits: 'Phòng ngừa bệnh thủy đậu và các biến chứng của bệnh, giảm nguy cơ mắc bệnh zona (herpes zoster) sau này.'
                    },
                    {
                        id: 6,
                        name: 'Vaccine phòng viêm não Nhật Bản',
                        description: 'Phòng bệnh viêm não Nhật Bản',
                        longDescription: 'Vaccine viêm não Nhật Bản giúp phòng ngừa bệnh viêm não Nhật Bản, một bệnh truyền nhiễm nguy hiểm do virus viêm não Nhật Bản gây ra và được truyền qua muỗi đốt. Bệnh viêm não Nhật Bản có thể gây viêm não, viêm màng não và có tỷ lệ tử vong cao.\n\nVaccine viêm não Nhật Bản được khuyến cáo tiêm cho trẻ em từ 1 tuổi trở lên, đặc biệt là những người sống ở vùng có dịch bệnh lưu hành. Lịch tiêm cơ bản gồm 3 mũi, với 2 mũi đầu cách nhau 28 ngày và mũi thứ 3 được tiêm sau 1 năm.\n\nVaccine có hiệu quả bảo vệ cao, khoảng 91% sau khi hoàn thành đủ liều. Miễn dịch sau tiêm có thể kéo dài nhiều năm, nhưng có thể cần tiêm nhắc lại sau 4-5 năm ở vùng có nguy cơ cao.',
                        ageGroup: 'Trẻ từ 1-15 tuổi',
                        price: 280000,
                        doses: 3,
                        image: '/images/je-vaccine.jpg',
                        manufacturer: 'Vabiotech, Việt Nam',
                        schedule: [
                            'Mũi 1: Khi trẻ được 1 tuổi',
                            'Mũi 2: Cách mũi 1 khoảng 1-2 tuần',
                            'Mũi 3: Cách mũi 2 khoảng 1 năm'
                        ],
                        sideEffects: 'Đau, sưng, đỏ tại chỗ tiêm. Có thể gây sốt nhẹ, mệt mỏi, đau đầu trong vài ngày.',
                        contraindications: 'Người có tiền sử dị ứng nặng với thành phần của vaccine, người đang mắc bệnh cấp tính.',
                        benefits: 'Phòng ngừa bệnh viêm não Nhật Bản và các biến chứng nghiêm trọng của bệnh, giảm tỷ lệ tử vong và di chứng thần kinh do bệnh gây ra.'
                    }
                ];

                const selectedVaccine = vaccinesData.find(v => v.id === parseInt(id));

                if (selectedVaccine) {
                    setVaccine(selectedVaccine);
                }
            } catch (error) {
                console.error('Error fetching vaccine details:', error);
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

    const handleBookAppointment = () => {
        router.push({
            pathname: '/schedule',
            query: { vaccineId: id }
        });
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

    return (
        <DefaultLayout>
            <div className="container mx-auto px-4 py-12">
                <Link href="/services" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Quay lại danh sách vaccine
                </Link>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/3 relative h-64 md:h-auto">
                            {vaccine.image ? (
                                <div className="relative h-full">
                                    <Image
                                        src={vaccine.image}
                                        alt={vaccine.name}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                            ) : (
                                <div className="h-full bg-blue-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="md:w-2/3 p-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">{vaccine.name}</h1>
                            <p className="text-gray-600 mb-6">{vaccine.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Giá tiêm</p>
                                        <p className="text-xl font-bold text-blue-600">{formatPrice(vaccine.price)}/mũi</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Số mũi tiêm</p>
                                        <p className="text-xl font-bold">{vaccine.doses} mũi</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Đối tượng</p>
                                        <p className="text-xl font-bold">{vaccine.ageGroup}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Nhà sản xuất</p>
                                        <p className="text-xl font-bold">{vaccine.manufacturer}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleBookAppointment}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                Đặt lịch tiêm ngay
                            </button>
                        </div>
                    </div>

                    <div className="p-8 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Lịch tiêm chủng</h2>
                                <ul className="space-y-3">
                                    {vaccine.schedule.map((item, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="text-blue-500 mr-2">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Lợi ích</h2>
                                <p className="text-gray-600">{vaccine.benefits}</p>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Tác dụng phụ có thể gặp</h2>
                                <p className="text-gray-600 mb-6">{vaccine.sideEffects}</p>

                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Chống chỉ định</h2>
                                <p className="text-gray-600">{vaccine.contraindications}</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Thông tin chi tiết</h2>
                            <div className="text-gray-600 space-y-4">
                                {vaccine.longDescription.split('\n\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                            <h2 className="text-xl font-bold text-blue-900 mb-4">Lưu ý khi tiêm chủng</h2>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    Trẻ cần được khám sàng lọc trước khi tiêm chủng.
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    Phụ huynh nên theo dõi trẻ trong vòng 30 phút sau tiêm tại cơ sở y tế.
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-2">•</span>
                                    Tiếp tục theo dõi trẻ trong 24-48 giờ sau tiêm.
                                </li>
                            </ul>
                            <div className="mt-6 text-center">
                                <button
                                    onClick={handleBookAppointment}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg inline-flex items-center transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    Đặt lịch tiêm ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default VaccineDetail;