import { MapPin, MailOpen, QrCode } from 'lucide-react'

const features = [
  {
    icon: <MailOpen className='w-8 h-8 text-pink-500' />,
    title: 'RSVP Real-time',
    desc: 'Nhận xác nhận tham dự tức thì. Đồng bộ dữ liệu về Google Sheets giúp bạn quản lý bàn tiệc dễ dàng.'
  },
  {
    icon: <MapPin className='w-8 h-8 text-blue-500' />,
    title: 'Bản Đồ Thông Minh',
    desc: 'Tích hợp Google Maps, giúp khách mời tìm đường đến nhà hàng chỉ với 1 cú chạm, không lo lạc đường.'
  },
  {
    icon: <QrCode className='w-8 h-8 text-green-500' />,
    title: 'Mừng Cưới 4.0',
    desc: 'Tích hợp mã QR VietQR, tự động điền số tài khoản và lời chúc. Tinh tế và tiện lợi.'
  }
]

export default function Features() {
  return (
    <section id='features' className='py-20 bg-white'>
      <div className='container px-4 mx-auto'>
        <h2 className='mb-12 text-3xl font-bold text-center'>Tính Năng Vượt Trội</h2>
        <div className='grid gap-8 md:grid-cols-3'>
          {features.map((item, idx) => (
            <div key={idx} className='p-6 transition border border-gray-100 rounded-2xl bg-gray-50 hover:bg-pink-50'>
              <div className='flex items-center justify-center w-16 h-16 mb-4 bg-white rounded-full shadow-sm'>
                {item.icon}
              </div>
              <h3 className='mb-2 text-xl font-bold'>{item.title}</h3>
              <p className='text-gray-600'>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
