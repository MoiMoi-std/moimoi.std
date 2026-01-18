import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className='relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-pink-50 to-white'>
      {/* Background Pattern Layer */}
      <div className='absolute inset-0 opacity-[0.25] -left-10 -right-10'>
        <div className='grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-8 lg:gap-12 transform -rotate-12 scale-125 md:scale-110 pt-10'>
          {[...Array(80)].map((_, i) => (
            <div key={i} className='flex flex-col items-center gap-1'>
              {i % 2 === 0 ? (
                <svg width='40' height='28' viewBox='0 0 100 60' className='text-pink-500 md:w-[55px] md:h-[40px] lg:w-[70px] lg:h-[50px]'>
                  <path
                    d='M20 40 Q10 30, 15 20 Q20 10, 30 15 Q40 10, 50 15 Q60 10, 70 15 Q80 10, 85 20 Q90 30, 80 40 Q85 50, 50 50 Q15 50, 20 40 Z'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2.5'
                    opacity='0.9'
                  />
                </svg>
              ) : (
                <svg width='35' height='35' viewBox='0 0 100 100' className='text-pink-500 md:w-[50px] md:h-[50px] lg:w-[60px] lg:h-[60px]'>
                  {/* Hoa 5 cánh */}
                  <g transform='translate(50, 50)'>
                    {/* 5 cánh hoa */}
                    {[0, 72, 144, 216, 288].map((angle, idx) => (
                      <path
                        key={idx}
                        d='M 0,-8 Q -12,-20 0,-32 Q 12,-20 0,-8 Z'
                        transform={`rotate(${angle})`}
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        opacity='0.8'
                      />
                    ))}
                    {/* Lõi tròn */}
                    <circle cx='0' cy='0' r='7' fill='currentColor' opacity='0.6' />
                  </g>
                </svg>
              )}
              <div
                className='text-[10px] md:text-xs lg:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-600 whitespace-nowrap'
                style={{
                  WebkitTextStroke: '0.8px rgba(236, 72, 153, 0.8)',
                  fontFamily: 'SDK SC Web, sans-serif'
                }}
              >
                MoiMoi Studio
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient Overlay - lighter */}
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-pink-50/30 to-white'></div>

      {/* Decorative Flower Elements */}
      <div className='absolute top-20 left-10 opacity-20'>
        <svg width='200' height='200' viewBox='0 0 200 200' className='text-pink-300'>
          <path
            d='M100 50 Q80 30, 60 50 T50 100 Q30 120, 50 140 T100 150 Q120 170, 140 150 T150 100 Q170 80, 150 60 T100 50'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          />
        </svg>
      </div>
      <div className='absolute bottom-20 right-10 opacity-20'>
        <svg width='150' height='150' viewBox='0 0 200 200' className='text-pink-300'>
          <path
            d='M100 50 Q80 30, 60 50 T50 100 Q30 120, 50 140 T100 150 Q120 170, 140 150 T150 100 Q170 80, 150 60 T100 50'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          />
        </svg>
      </div>

      <div className='container relative z-10 px-4 mx-auto text-center'>
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

        {/* iPad Mockup với Thiệp Cưới - Animated */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className='max-w-4xl mx-auto mt-16'
        >
          {/* iPad Frame */}
          <div className='relative mx-auto w-full max-w-[700px] h-[400px] md:h-[500px] bg-gray-900 rounded-[40px] shadow-2xl p-3'>
            
            {/* Screen */}
            <div className='relative w-full h-full bg-gradient-to-br from-pink-50 via-white to-rose-50 rounded-[32px] overflow-hidden'>
              {/* Thiệp Cưới Content */}
              <div className='flex items-center justify-center h-full p-8 md:p-12'>
                
                <div className='max-w-2xl w-full'>
                  {/* Header với nhạc */}
                  <div className='flex items-center justify-between mb-8'>
                    <div className='w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center'>
                      <svg className='w-5 h-5 text-pink-600' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z'/>
                      </svg>
                    </div>
                    <div className='text-sm text-gray-400'>14:30</div>
                  </div>

                  {/* Tên cặp đôi */}
                  <div className='text-center space-y-3 mb-10'>
                    <h3 className='text-sm md:text-base text-pink-400 font-medium tracking-wider'>THE WEDDING OF</h3>
                    <h2 className='text-5xl md:text-6xl font-bold text-gray-800'>
                      Minh & Lan
                    </h2>
                    <p className='text-lg md:text-xl text-gray-600 mt-4'>20.05.2026 • 18:00</p>
                    <p className='text-base text-gray-500'>Nhà hàng Tiệc Cưới Palace, TP.HCM</p>
                  </div>

                  {/* Action Buttons */}
                  <div className='grid grid-cols-3 gap-4'>
                    {/* RSVP Button */}
                    <button className='col-span-3 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-base md:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all'>
                      Xác nhận tham dự
                    </button>
                    
                    {/* Map & QR Row */}
                    <button className='py-3 bg-white border-2 border-pink-200 text-pink-600 text-sm md:text-base font-medium rounded-full flex items-center justify-center gap-2 hover:bg-pink-50 hover:scale-105 transition-all'>
                      <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd'/>
                      </svg>
                      Bản đồ
                    </button>
                    <button className='py-3 bg-white border-2 border-pink-200 text-pink-600 text-sm md:text-base font-medium rounded-full flex items-center justify-center gap-2 hover:bg-pink-50 hover:scale-105 transition-all'>
                      <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z' clipRule='evenodd'/>
                      </svg>
                      QR Code
                    </button>
                    <button className='py-3 bg-white border-2 border-pink-200 text-pink-600 text-sm md:text-base font-medium rounded-full flex items-center justify-center gap-2 hover:bg-pink-50 hover:scale-105 transition-all'>
                      <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2 0v8h12V6H4zm8 2a1 1 0 100 2h2a1 1 0 100-2h-2z'/>
                      </svg>
                      Mừng cưới
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
