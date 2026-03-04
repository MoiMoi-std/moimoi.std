import RSVPForm from '@/components/guest/RSVPForm'
import { Calendar, Clock, Heart, MapPin } from 'lucide-react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'

export default function DefaultGeneralView({ wedding }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  const { content, template } = wedding || {}

  // Merge template default_content với wedding content
  // Cast template as any vì default_content có thể tồn tại trong DB nhưng chưa có trong generated types
  const templateData = template as any
  const mergedContent = {
    ...(templateData?.default_content || {}),
    ...content
  }

  const primaryColor = mergedContent.primary_color || '#d97706'
  const fontFamily = mergedContent.font_family || 'Cormorant Garamond, serif'

  // Countdown timer
  useEffect(() => {
    if (mergedContent.wedding_date) {
      const interval = setInterval(() => {
        const weddingDate = new Date(`${mergedContent.wedding_date}T${mergedContent.wedding_time || '00:00'}`)
        const now = new Date()
        const diff = weddingDate.getTime() - now.getTime()

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)
          setTimeRemaining({ days, hours, minutes, seconds })
        } else {
          setTimeRemaining(null)
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [mergedContent.wedding_date, mergedContent.wedding_time])

  if (!wedding) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>404 - Wedding not found</h1>
          <p className='text-gray-500'>Không tìm thấy thiệp cưới với slug này.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>
          {mergedContent.groom_name} &amp; {mergedContent.bride_name} - Thiệp Cưới
        </title>
        <meta
          name='description'
          content={`Trân trọng kính mời bạn đến dự lễ thành hôn của ${mergedContent.groom_name} và ${mergedContent.bride_name}`}
        />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap'
          rel='stylesheet'
        />
      </Head>

      <div className='min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50' style={{ fontFamily }}>
        {/* Hero Section */}
        <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
          {/* Background Pattern */}
          <div className='absolute inset-0 opacity-5'>
            <div
              className='absolute inset-0'
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }}
            ></div>
          </div>

          {/* Decorative Elements */}
          <div
            className='absolute top-10 left-10 w-32 h-32 border-2 rounded-full opacity-20'
            style={{ borderColor: primaryColor }}
          ></div>
          <div
            className='absolute bottom-10 right-10 w-40 h-40 border-2 rounded-full opacity-20'
            style={{ borderColor: primaryColor }}
          ></div>

          <div className='relative z-10 text-center px-4 max-w-4xl mx-auto'>
            {/* Save The Date Badge */}
            <div
              className='inline-block mb-8 px-6 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border'
              style={{ borderColor: `${primaryColor}20` }}
            >
              <p className='text-sm font-medium tracking-[0.3em] uppercase' style={{ color: primaryColor }}>
                Save The Date
              </p>
            </div>

            {/* Names */}
            <h1
              className='text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight'
              style={{ color: primaryColor }}
            >
              {mergedContent.groom_name}
              <span className='block text-3xl md:text-4xl my-4 opacity-60'>&amp;</span>
              {mergedContent.bride_name}
            </h1>

            {/* Date */}
            {mergedContent.wedding_date && (
              <p className='text-xl md:text-2xl text-gray-600 mb-8 font-light tracking-wider'>
                {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}

            {/* Divider */}
            <div className='flex items-center justify-center gap-4 my-8'>
              <div
                className='h-px w-16 bg-gradient-to-r from-transparent'
                style={{ background: `linear-gradient(to right, transparent, ${primaryColor})` }}
              ></div>
              <Heart size={24} fill={primaryColor} color={primaryColor} className='animate-pulse' />
              <div
                className='h-px w-16 bg-gradient-to-l from-transparent'
                style={{ background: `linear-gradient(to left, transparent, ${primaryColor})` }}
              ></div>
            </div>

            {/* Subtitle */}
            <p className='text-lg md:text-xl text-gray-500 italic max-w-2xl mx-auto'>
              Trân trọng kính mời bạn đến dự buổi lễ thành hôn của chúng tôi
            </p>

            {/* Scroll Indicator */}
            <div className='mt-16 animate-bounce'>
              <div
                className='w-6 h-10 border-2 rounded-full mx-auto flex items-start justify-center p-2'
                style={{ borderColor: primaryColor }}
              >
                <div className='w-1 h-3 rounded-full' style={{ backgroundColor: primaryColor }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Countdown Section */}
        {timeRemaining && (
          <section
            className='py-16 px-4'
            style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}05)` }}
          >
            <div className='max-w-4xl mx-auto text-center'>
              <h2 className='text-3xl md:text-4xl font-bold mb-4' style={{ color: primaryColor }}>
                Đếm Ngược Đến Ngày Vui
              </h2>
              <p className='text-gray-600 mb-8'>Chỉ còn một chút nữa thôi...</p>

              <div className='grid grid-cols-4 gap-4 md:gap-8'>
                {[
                  { label: 'Ngày', value: timeRemaining.days },
                  { label: 'Giờ', value: timeRemaining.hours },
                  { label: 'Phút', value: timeRemaining.minutes },
                  { label: 'Giây', value: timeRemaining.seconds }
                ].map((item) => (
                  <div
                    key={item.label}
                    className='bg-white rounded-2xl shadow-lg p-4 md:p-6 border'
                    style={{ borderColor: `${primaryColor}20` }}
                  >
                    <div className='text-3xl md:text-5xl font-bold mb-2' style={{ color: primaryColor }}>
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className='text-xs md:text-sm text-gray-500 uppercase tracking-wider'>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Event Details Section */}
        <section className='py-20 px-4 bg-white'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl md:text-5xl font-bold mb-4' style={{ color: primaryColor }}>
                Thông Tin Sự Kiện
              </h2>
              <div className='w-20 h-1 mx-auto rounded-full' style={{ backgroundColor: primaryColor }}></div>
            </div>

            <div className='grid md:grid-cols-2 gap-8'>
              {/* Date & Time */}
              <div
                className='bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 shadow-lg border'
                style={{ borderColor: `${primaryColor}20` }}
              >
                <div className='flex items-center gap-4 mb-4'>
                  <div className='p-3 rounded-full' style={{ backgroundColor: `${primaryColor}20` }}>
                    <Calendar size={24} color={primaryColor} />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-800'>Thời Gian</h3>
                </div>
                <p className='text-gray-600 text-lg mb-2'>
                  {mergedContent.wedding_date &&
                    new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                </p>
                <div className='flex items-center gap-2 text-gray-500'>
                  <Clock size={18} />
                  <span>Lúc {mergedContent.wedding_time || '00:00'}</span>
                </div>
              </div>

              {/* Location */}
              <div
                className='bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 shadow-lg border'
                style={{ borderColor: `${primaryColor}20` }}
              >
                <div className='flex items-center gap-4 mb-4'>
                  <div className='p-3 rounded-full' style={{ backgroundColor: `${primaryColor}20` }}>
                    <MapPin size={24} color={primaryColor} />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-800'>Địa Điểm</h3>
                </div>
                <p className='text-gray-600 text-lg mb-4'>{mergedContent.address}</p>
                {mergedContent.map_url && (
                  <a
                    href={mergedContent.map_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all hover:scale-105'
                    style={{ backgroundColor: primaryColor }}
                  >
                    <MapPin size={18} />
                    Xem Bản Đồ
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        {mergedContent.images && mergedContent.images.length > 0 && (
          <section
            className='py-20 px-4'
            style={{ background: `linear-gradient(to bottom, ${primaryColor}05, white)` }}
          >
            <div className='max-w-6xl mx-auto'>
              <div className='text-center mb-16'>
                <h2 className='text-4xl md:text-5xl font-bold mb-4' style={{ color: primaryColor }}>
                  Khoảnh Khắc Của Chúng Tôi
                </h2>
                <div className='w-20 h-1 mx-auto rounded-full' style={{ backgroundColor: primaryColor }}></div>
              </div>

              <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {mergedContent.images.slice(0, 6).map((img: string, idx: number) => (
                  <div key={idx} className='relative group overflow-hidden rounded-2xl shadow-lg aspect-square'>
                    <img
                      src={img}
                      alt={`Wedding photo ${idx + 1}`}
                      className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* RSVP Section */}
        <section className='py-20 px-4 bg-white'>
          <div className='max-w-3xl mx-auto'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl md:text-5xl font-bold mb-4' style={{ color: primaryColor }}>
                Xác Nhận Tham Dự
              </h2>
              <p className='text-gray-600 text-lg'>Vui lòng cho chúng tôi biết bạn có thể tham dự hay không</p>
            </div>

            <RSVPForm weddingId={wedding.id} />
          </div>
        </section>

        {/* Footer */}
        <footer
          className='py-12 px-4 text-center'
          style={{ background: `linear-gradient(to bottom, white, ${primaryColor}10)` }}
        >
          <div className='mb-6'>
            <Heart size={32} fill={primaryColor} color={primaryColor} className='mx-auto mb-4' />
            <p className='text-2xl font-bold mb-2' style={{ color: primaryColor }}>
              {mergedContent.groom_name} &amp; {mergedContent.bride_name}
            </p>
            <p className='text-gray-500'>Cảm ơn bạn đã đến chung vui cùng chúng tôi</p>
          </div>
          <div className='text-sm text-gray-400'>
            <p>Powered by MoiMoi Studio</p>
          </div>
        </footer>
      </div>
    </>
  )
}
