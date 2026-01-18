import StudioLayout from '@/components/studio/StudioLayout'
import { Check, CreditCard, Star } from 'lucide-react'

const FEATURES = [
  'Tên miền riêng (vd: tenban.moimoi.vn)',
  'Lưu trữ ảnh không giới hạn',
  'Xóa logo MoiMoi',
  'Hiệu ứng 3D cao cấp',
  'Nhận RSVP qua Zalo',
  'Hỗ trợ ưu tiên 24/7'
]

export default function UpgradePage() {
  return (
    <StudioLayout>
      <div className='max-w-5xl mx-auto py-10'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-serif font-bold text-gray-900 mb-4'>Nâng Cấp Gói Dịch Vụ</h1>
          <p className='text-gray-500 text-lg'>Mở khóa toàn bộ tính năng cao cấp cho đám cưới của bạn</p>
        </div>

        <div className='grid md:grid-cols-2 gap-8 items-start'>
          {/* Free Plan */}
          <div className='bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative opacity-70 hover:opacity-100 transition-opacity'>
            <div className='mb-6'>
              <h3 className='text-xl font-bold text-gray-900'>Cơ Bản</h3>
              <div className='mt-4 flex items-baseline'>
                <span className='text-4xl font-extrabold tracking-tight text-gray-900'>0 ₫</span>
                <span className='ml-1 text-xl font-semibold text-gray-500'>/ trọn đời</span>
              </div>
              <p className='mt-4 text-gray-500'>Đủ dùng cho một đám cưới nhỏ, đơn giản.</p>
            </div>
            <ul className='space-y-4 mb-8'>
              <li className='flex items-center text-gray-600'>
                <Check size={20} className='mr-3 text-green-500' /> 1 Mẫu thiệp cơ bản
              </li>
              <li className='flex items-center text-gray-600'>
                <Check size={20} className='mr-3 text-green-500' /> Lưu trữ 10 ảnh
              </li>
              <li className='flex items-center text-gray-600'>
                <Check size={20} className='mr-3 text-green-500' /> RSVP cơ bản
              </li>
            </ul>
            <button className='w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl cursor-not-allowed'>
              Đang sử dụng
            </button>
          </div>

          {/* Premium Plan */}
          <div className='bg-white p-8 rounded-3xl border-2 border-pink-500 shadow-2xl relative overflow-hidden transform md:-translate-y-4'>
            <div className='absolute top-0 right-0 bg-gradient-to-l from-pink-500 to-rose-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider'>
              Phổ Biến Nhất
            </div>
            <div className='mb-6'>
              <h3 className='text-xl font-bold text-gray-900 flex items-center gap-2'>
                Premium <Star size={20} className='fill-yellow-400 text-yellow-400' />
              </h3>
              <div className='mt-4 flex items-baseline'>
                <span className='text-5xl font-extrabold tracking-tight text-pink-600'>490k</span>
                <span className='ml-1 text-xl font-semibold text-gray-400 line-through'>990k</span>
              </div>
              <p className='mt-4 text-gray-500'>Trọn gói tất cả tính năng. Thanh toán 1 lần duy nhất.</p>
            </div>
            <ul className='space-y-4 mb-8'>
              {FEATURES.map((feature, idx) => (
                <li key={idx} className='flex items-center text-gray-700 font-medium'>
                  <div className='mr-3 bg-pink-100 rounded-full p-1 text-pink-600'>
                    <Check size={14} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <div className='space-y-3'>
              <button className='w-full py-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2'>
                <CreditCard size={20} /> Thanh Toán Ngay
              </button>
              <p className='text-center text-xs text-gray-400'>Hoàn tiền 100% nếu không hài lòng trong 7 ngày.</p>
            </div>
          </div>
        </div>
      </div>
    </StudioLayout>
  )
}
