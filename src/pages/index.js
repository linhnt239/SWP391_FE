// src/pages/index.js
import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyringe, faBook, faMoneyBillWave, faHospital, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import DefaultLayout from "@/components/layout/DefaultLayout";

const Home = () => {
  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="bg-blue-100 py-16 text-center">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Hệ thống Quản lý và Theo dõi Lịch Tiêm chủng Trẻ em
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Đảm bảo sức khỏe trẻ em với lịch tiêm chủng chính xác, nhắc nhở tự động và tư vấn chuyên gia.
          </p>
          <Link href="/schedule">
            <button className="bg-blue-900 text-white px-6 py-3 rounded-full hover:bg-blue-700">
              Đặt lịch tiêm chủng ngay
            </button>
          </Link>
        </div>
      </section>

      {/* Giới thiệu thông tin cơ sở tiêm chủng */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
            <FontAwesomeIcon icon={faHospital} className="mr-2" /> Giới thiệu cơ sở tiêm chủng
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <p className="text-gray-700 leading-relaxed">
                Hệ thống Quản lý và Theo dõi Lịch Tiêm chủng Trẻ em được thiết kế để hỗ trợ phụ huynh và nhân viên y tế quản lý lịch tiêm chủng hiệu quả. Chúng tôi hợp tác với các trung tâm y tế uy tín, cung cấp dịch vụ tiêm chủng an toàn, chất lượng cao với đội ngũ bác sĩ và y tá được đào tạo chuyên sâu. Với hệ thống nhắc nhở tự động, bạn sẽ không bao giờ bỏ lỡ lịch tiêm chủng của con mình.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Địa chỉ: 123 Nguyễn Trãi, P.Tân Phú, Q.3, TP.HCM<br />
                Hotline: 0898520760 (Hỗ trợ 24/7)
              </p>
            </div>
            <div className="md:w-1/2">
              <img src="/vaccine-center.png" alt="Vaccine Center" className="rounded-lg shadow-md w-full h-64 object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Dịch vụ tiêm chủng */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
            <FontAwesomeIcon icon={faSyringe} className="mr-2" /> Dịch vụ tiêm chủng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Tiêm chủng cho trẻ em</h3>
              <p className="text-gray-700">
                Cung cấp các loại vaccine cần thiết cho trẻ từ 0-12 tuổi, bao gồm vaccine phòng lao, sởi, quai bị, và nhiều bệnh nguy hiểm khác.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Nhắc nhở tự động</h3>
              <p className="text-gray-700">
                Hệ thống gửi thông báo qua email hoặc SMS để nhắc nhở lịch tiêm chủng, đảm bảo không bỏ sót mũi tiêm nào.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Tư vấn chuyên gia</h3>
              <p className="text-gray-700">
                Đội ngũ bác sĩ sẵn sàng tư vấn trực tuyến về lịch tiêm chủng, phản ứng sau tiêm, và chăm sóc sức khỏe trẻ em.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bảng giá */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
            <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" /> Bảng giá dịch vụ
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="py-3 px-4 text-left">Tên vaccine</th>
                  <th className="py-3 px-4 text-left">Đối tượng</th>
                  <th className="py-3 px-4 text-left">Giá (VNĐ)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Vaccine phòng lao (BCG)</td>
                  <td className="py-3 px-4">Trẻ từ 0-1 tuổi</td>
                  <td className="py-3 px-4">150,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Vaccine 5 trong 1 (Pentaxim)</td>
                  <td className="py-3 px-4">Trẻ từ 2-24 tháng</td>
                  <td className="py-3 px-4">700,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Vaccine sởi - quai bị - rubella (MMR)</td>
                  <td className="py-3 px-4">Trẻ từ 9 tháng</td>
                  <td className="py-3 px-4">300,000</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Tư vấn chuyên gia (trực tuyến)</td>
                  <td className="py-3 px-4">Phụ huynh</td>
                  <td className="py-3 px-4">Miễn phí</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-center text-gray-600 mt-4">
            * Giá trên chưa bao gồm phí khám trước tiêm (50,000 VNĐ). Vui lòng đặt lịch để được tư vấn chi tiết.
          </p>
        </div>
      </section>

      {/* Cẩm nang tiêm chủng */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">
            <FontAwesomeIcon icon={faBook} className="mr-2" /> Cẩm nang tiêm chủng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Lịch tiêm chủng cho trẻ em</h3>
              <p className="text-gray-700">
                Hướng dẫn chi tiết lịch tiêm chủng theo độ tuổi, từ sơ sinh đến 12 tuổi, giúp phụ huynh dễ dàng theo dõi và đảm bảo con được tiêm đầy đủ các mũi vaccine cần thiết.
              </p>
              <Link href="/guide/schedule">
                <span className="text-blue-600 hover:underline mt-4 inline-block">Xem chi tiết</span>
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Chăm sóc sau tiêm chủng</h3>
              <p className="text-gray-700">
                Hướng dẫn cách chăm sóc trẻ sau khi tiêm vaccine, xử lý các phản ứng phụ thường gặp như sốt, sưng đỏ, và cách nhận biết các dấu hiệu cần gặp bác sĩ.
              </p>
              <Link href="/guide/post-vaccination-care">
                <span className="text-blue-600 hover:underline mt-4 inline-block">Xem chi tiết</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-blue-700 text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" /> Đặt lịch tiêm chủng ngay hôm nay!
          </h2>
          <p className="text-lg mb-6">
            Đảm bảo sức khỏe cho con bạn với hệ thống quản lý tiêm chủng thông minh.
          </p>
          <Link href="/schedule">
            <button className="bg-white text-blue-900 px-6 py-3 rounded-full hover:bg-gray-200">
              Đặt lịch ngay
            </button>
          </Link>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default Home;