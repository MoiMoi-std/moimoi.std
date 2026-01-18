import { Check, X } from 'lucide-react'

const plans = [
  {
    name: 'Sinh Viên',
    price: '150.000đ',
    desc: 'Ưu đãi cho lễ tốt nghiệp, sinh nhật và đám cưới nhỏ',
    features: ['5 Mẫu thiệp cơ bản', 'Giới hạn 50 khách mời RSVP', 'Lưu trữ trong 6 tháng', 'Có logo MoiMoi Studio'],
    notIncluded: ['Nhạc nền', 'Bản đồ chỉ đường', 'QR Mừng cưới', 'Hiệu ứng mở thiệp'],
    highlight: false
  },
  {
    name: 'Gói Cơ Bản',
    price: '500.000đ',
    desc: 'Đầy đủ tính năng cần thiết cho một đám cưới.',
    features: [
      'Kho 20+ mẫu thiệp Premium',
      'Giới hạn 100 khách mời RSVP',
      'Không giới hạn khách RSVP',
      'Tích hợp Bản đồ & QR Mừng cưới',
      'Nhạc nền tùy chọn',
      'Lưu trữ 2 năm'
    ],
    notIncluded: ['Hỗ trợ thay đổi thiết kế'],
    highlight: true // Gói này sẽ nổi bật nhất
  },
  {
    name: 'Gói Nâng Cao',
    price: '699.000đ',
    desc: 'Tùy chỉnh nâng cao, thể hiện phong cách riêng của bạn.',
    features: [
      'Mọi tính năng của Gói Cơ Bản',
      'Giới hạn 250 khách mời RSVP',
      'Hỗ trợ thay đổi thiết kế (màu sắc, font chữ)',
      'Hiệu ứng mở thiệp độc đáo',
      'Lưu trữ 3 năm'
    ],
    notIncluded: ['Sở hữu slug tùy chọn', 'Hỗ trợ setup 1-1', 'Thiết kế theo yêu cầu'],
    highlight: false
  },
  {
    name: 'Gói Cao Cấp',
    price: '1.299.000đ',
    desc: 'Sự hoàn hảo và hỗ trợ tận răng từ đội ngũ.',
    features: [
      'Mọi tính năng của Gói Cơ Bản & Nâng cao',
      'Giới hạn 500 khách mời RSVP',
      'Thiết kế thiệp theo yêu cầu',
      'Sở hữu slug tùy chọn (moimoi.io.vn/yourname)',
      'Tùy chỉnh màu sắc/font chữ theo yêu cầu',
      'Chuyên viên hỗ trợ setup 1-1',
      'Lưu trữ 5 năm'
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
            MoiMoi giúp bạn thong dong<br></br>
            Giá mềm như bún, hài lòng khách qua
          </p>
        </div>

        <div className='grid max-w-7xl gap-8 mx-auto md:grid-cols-2 lg:grid-cols-4'>
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
