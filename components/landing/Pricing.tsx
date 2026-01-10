import { Check, X } from 'lucide-react'

const plans = [
  {
    name: 'Trải Nghiệm',
    price: '0đ',
    desc: 'Dành cho các cặp đôi muốn thử nghiệm trước.',
    features: ['1 Mẫu thiệp cơ bản', 'Giới hạn 50 khách mời RSVP', 'Lưu trữ trong 1 tuần', 'Có logo MoiMoi Studio'],
    notIncluded: ['Nhạc nền', 'Bản đồ chỉ đường', 'QR Mừng cưới', 'Hiệu ứng mở thiệp'],
    highlight: false
  },
  {
    name: 'Gói Cơ Bản',
    price: '199.000đ',
    desc: 'Đầy đủ tính năng cần thiết cho một đám cưới.',
    features: [
      'Kho 20+ mẫu thiệp Premium',
      'Không giới hạn khách RSVP',
      'Tích hợp Bản đồ & QR Mừng cưới',
      'Nhạc nền tùy chọn',
      'Lưu trữ 6 tháng'
    ],
    notIncluded: ['Tên miền riêng (.vn)', 'Hỗ trợ thay đổi thiết kế'],
    highlight: true // Gói này sẽ nổi bật nhất
  },
  {
    name: 'Gói Cao Cấp',
    price: '499.000đ',
    desc: 'Sự hoàn hảo và hỗ trợ tận răng từ đội ngũ.',
    features: [
      'Mọi tính năng của Gói Cơ Bản',
      'Sở hữu tên miền riêng (tu-uyen.vn)',
      'Tùy chỉnh màu sắc/font chữ theo yêu cầu',
      'Chuyên viên hỗ trợ setup 1-1',
      'Lưu trữ vĩnh viễn'
    ],
    notIncluded: [],
    highlight: false
  }
]

export default function Pricing() {
  return (
    <section id='pricing' className='py-20 bg-gray-50'>
      <div className='container px-4 mx-auto'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 md:text-4xl'>Bảng Giá Dịch Vụ</h2>
          <p className='max-w-2xl mx-auto text-gray-600'>
            Chi phí chỉ bằng 5 tấm thiệp giấy, nhưng lưu giữ kỷ niệm mãi mãi. Thanh toán 1 lần, sử dụng trọn đời.
          </p>
        </div>

        <div className='grid max-w-6xl gap-8 mx-auto md:grid-cols-3'>
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.highlight
                  ? 'bg-white border-2 border-pink-500 shadow-xl scale-105 z-10'
                  : 'bg-white border border-gray-100 hover:shadow-lg'
              }`}
            >
              {plan.highlight && (
                <div className='absolute top-0 px-4 py-1 text-sm font-bold text-white -translate-x-1/2 -translate-y-1/2 bg-pink-600 rounded-full left-1/2'>
                  Khuyên Dùng
                </div>
              )}

              <h3 className='mb-2 text-xl font-bold text-gray-900'>{plan.name}</h3>
              <div className='mb-2 text-4xl font-bold text-pink-600'>{plan.price}</div>
              <p className='mb-6 text-sm text-gray-500'>{plan.desc}</p>

              <button
                className={`w-full py-3 rounded-xl font-bold mb-8 transition ${
                  plan.highlight
                    ? 'bg-pink-600 text-white hover:bg-pink-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Chọn Gói Này
              </button>

              <div className='space-y-4'>
                {plan.features.map((feature, i) => (
                  <div key={i} className='flex items-start gap-3 text-sm text-gray-700'>
                    <Check className='w-5 h-5 text-green-500 shrink-0' />
                    <span>{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <div key={i} className='flex items-start gap-3 text-sm text-gray-400'>
                    <X className='w-5 h-5 text-gray-300 shrink-0' />
                    <span className='line-through'>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
