import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className='pt-32 pb-20 bg-gradient-to-b from-pink-50 to-white'>
      <div className='container px-4 mx-auto text-center'>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-6xl'
        >
          Trao tấm thiệp <br />
          <span className='text-pink-600'>Gói trọn tin yêu</span>
        </motion.h1>

        <p className='max-w-2xl mx-auto mb-8 text-lg text-gray-600'>
          Nền tảng tạo thiệp cưới online phong cách Gen Z. Tích hợp bản đồ, RSVP và QR mừng cưới chỉ trong 1 nốt nhạc.
        </p>

        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <button className='px-8 py-3 text-lg font-semibold text-white transition bg-pink-600 rounded-full shadow-lg hover:bg-pink-700 shadow-pink-200'>
            Dùng Thử Miễn Phí
          </button>
          <button className='px-8 py-3 text-lg font-semibold text-gray-700 transition bg-white border border-gray-200 rounded-full hover:bg-gray-50'>
            Xem Mẫu Demo
          </button>
        </div>

        {/* Placeholder cho ảnh Demo */}
        <div className='flex items-center justify-center h-64 max-w-4xl mx-auto mt-16 text-gray-400 bg-gray-200 border-4 border-white shadow-2xl md:h-96 rounded-2xl'>
          Ảnh Demo Giao Diện (Frontend sẽ thay sau)
        </div>
      </div>
    </section>
  )
}
