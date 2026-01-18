import { motion } from 'framer-motion'
import { ArrowRight, Heart, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className='relative pt-40 pb-20 overflow-hidden bg-[#FDFBF7]'>
      {/* Animated Background Blobs */}
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
        <div className='absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-pink-200/30 rounded-full blur-[100px] animate-pulse'></div>
        <div className='absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px] animate-pulse delay-1000'></div>
      </div>

      <div className='container px-4 mx-auto text-center relative z-10'>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className='inline-flex items-center px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-pink-600 uppercase bg-white border border-pink-100 rounded-full shadow-sm'>
            <Sparkles size={16} className='mr-2' />
            Thiết kế cho Gen Z
          </div>

          <h1 className='max-w-4xl mx-auto mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-7xl font-serif tracking-tight'>
            Trao tấm thiệp <br />
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-gold-dark italic'>
              Gói trọn tin yêu
            </span>
          </h1>

          <p className='max-w-2xl mx-auto mb-10 text-lg text-gray-600 md:text-xl font-sans leading-relaxed'>
            Nền tảng tạo thiệp cưới online đẳng cấp. Tích hợp bản đồ, RSVP và QR mừng cưới tinh tế chỉ trong 1 nốt nhạc.
          </p>

          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Link href='/studio'>
              <button className='px-8 py-4 text-base font-bold text-white transition-all transform bg-pink-600 rounded-full shadow-xl hover:bg-pink-700 hover:shadow-pink-300 hover:-translate-y-1 flex items-center gap-2'>
                Dùng Thử Miễn Phí <ArrowRight size={20} />
              </button>
            </Link>
            <Link href='#templates'>
              <button className='px-8 py-4 text-base font-bold text-gray-700 transition-all bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300'>
                Xem Mẫu Demo
              </button>
            </Link>
          </div>
        </motion.div>

        {/* CSS-Only Wedding Card Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className='relative max-w-5xl mx-auto mt-20'
        >
          {/* Card Container */}
          <div className='relative bg-white rounded-[2rem] shadow-2xl shadow-pink-900/10 p-4 md:p-8 border border-white/50 backdrop-blur-sm'>
            <div className='absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 rounded-[2rem] pointer-events-none'></div>

            {/* Browser Toolbar UI (Decorative) */}
            <div className='flex items-center gap-2 mb-4 md:mb-6 px-4 opacity-30'>
              <div className='w-3 h-3 bg-red-400 rounded-full'></div>
              <div className='w-3 h-3 bg-yellow-400 rounded-full'></div>
              <div className='w-3 h-3 bg-green-400 rounded-full'></div>
              <div className='ml-4 flex-1 h-6 bg-gray-100 rounded-lg max-w-sm'></div>
            </div>

            {/* Hero Content Inside Mockup */}
            <div className='relative overflow-hidden rounded-2xl bg-[#FAFAFA] aspect-[16/9] md:aspect-[21/9] flex items-center justify-center group'>
              {/* Decorative Background inside Card */}
              <div className='absolute inset-0'>
                <div className='absolute top-0 right-0 w-64 h-64 bg-rose-100 rounded-full mix-blend-multiply blur-3xl opacity-50'></div>
                <div className='absolute bottom-0 left-0 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply blur-3xl opacity-50'></div>
              </div>

              <div className='relative z-10 text-center p-8'>
                <div className='mb-4 font-serif text-2xl md:text-5xl font-bold text-gray-800'>
                  Minh Nhật <span className='text-pink-500'>&</span> Thanh Hằng
                </div>
                <p className='text-sm md:text-lg text-gray-500 uppercase tracking-[0.2em] mb-6'>
                  Save the Date • 20.12.2026
                </p>
                <div className='inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white rounded-full shadow-lg text-pink-500 animate-bounce cursor-pointer hover:bg-pink-50 transition-colors'>
                  <Heart fill='currentColor' size={24} />
                </div>
              </div>

              {/* Checkmark Badge */}
              <div className='absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/50 flex items-center gap-3 transform translate-y-2 opacity-100 transition-all'>
                <div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600'>
                  <Sparkles size={14} />
                </div>
                <div>
                  <div className='text-xs font-bold text-gray-800'>RSVP Confirmed</div>
                  <div className='text-[10px] text-gray-500'>Vừa nhận được 1 xác nhận</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements around mockup */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className='absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl rotate-12 shadow-xl opacity-20 md:opacity-100 blur-sm md:blur-0'
          ></motion.div>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className='absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full shadow-xl opacity-20 md:opacity-100 blur-sm md:blur-0'
          ></motion.div>
        </motion.div>
      </div>
    </section>
  )
}
