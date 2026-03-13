import { createClient } from '@supabase/supabase-js'
import { Calendar, Clock, Heart, MapPin } from 'lucide-react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { WeddingCalendar } from '../../components/WeddingCalendar'
import { getImageStyle, resolveImageAdjust } from '../../lib/imageUtils'
import { useTemplateViewport } from '../../lib/TemplateViewportContext'
import { TemplateProps } from '../TemplateRegistry'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function DefaultGeneralView({ wedding, guestName = '', rsvpId }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // RSVP state
  const [wish, setWish] = useState('')
  const [phone, setPhone] = useState('')
  const [isAttending, setIsAttending] = useState<boolean | null>(null)
  const [partySize, setPartySize] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const { content, template } = wedding || {}

  const viewport = useTemplateViewport()

  const templateData = template as any
  const mergedContent = {
    ...(templateData?.default_content || {}),
    ...content
  }

  const primaryColor = mergedContent.primary_color || '#d97706'
  const fontFamily = mergedContent.font_family || 'Cormorant Garamond, serif'
  const headingFontFamily = mergedContent.heading_font_family || fontFamily
  const sectionFontFamily = mergedContent.section_font_family || fontFamily

  const coverImage =
    mergedContent.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=533&fit=crop'
  const mockAlbumImages = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1529443132905-8ee5f6e8ed8b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1578730169862-749eae6bc1cc?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1513279922550-250c2129b13a?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1484863137850-59afcfe05386?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=400&fit=crop'
  ]
  const albumImages = mergedContent.images?.length > 0 ? mergedContent.images : mockAlbumImages

  let calYear = 0,
    calMonth = 0,
    calDay = 0
  if (mergedContent.wedding_date) {
    const parts = (mergedContent.wedding_date as string).split('-').map(Number)
    calYear = parts[0]
    calMonth = parts[1]
    calDay = parts[2]
  }

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

  // Pre-fill RSVP nếu có rsvpId
  useEffect(() => {
    if (!rsvpId) return
    supabase
      .from('rsvps')
      .select('wishes, phone, is_attending, party_size')
      .eq('id', rsvpId)
      .single()
      .then(({ data }) => {
        if (!data) return
        if (data.wishes) setWish(data.wishes)
        if (data.phone) setPhone(data.phone)
        if (data.is_attending != null) setIsAttending(data.is_attending)
        if (data.party_size) setPartySize(data.party_size)
      })
  }, [rsvpId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSubmitError('')
    try {
      if (rsvpId) {
        const { error } = await supabase
          .from('rsvps')
          .update({
            phone: phone.trim() || null,
            is_attending: isAttending,
            party_size: isAttending ? partySize : 1,
            wishes: wish.trim() || null
          })
          .eq('id', rsvpId)
        if (error) throw error
      }
      setSubmitted(true)
    } catch (err: any) {
      console.error('RSVP error:', err)
      setSubmitError('Có lỗi xảy ra, vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    border: '1.5px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    background: '#fafafa',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    color: '#111827'
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
    fontSize: '13px',
    color: '#374151',
    letterSpacing: '0.04em'
  }

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
        <style>{`
          input:focus, textarea:focus {
            border-color: ${primaryColor} !important;
            background: #fff !important;
            box-shadow: 0 0 0 3px ${primaryColor}20 !important;
            outline: none;
          }
          .btn-attend:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(34,197,94,.25); }
          .btn-decline:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(239,68,68,.25); }
          .btn-submit:not(:disabled):hover { transform: translateY(-2px); }
          @keyframes floatY {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(-10px); }
          }
          .float { animation: floatY 3.2s ease-in-out infinite; display: inline-block; }
        `}</style>
      </Head>

      <div className='min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50' style={{ fontFamily }}>
        {/* Hero Section */}
        <section
          className='relative overflow-hidden'
          style={{
            height: 'var(--phone-height, 100svh)',
            minHeight: 600,
            maxWidth: viewport === 'laptop' ? 390 : undefined,
            margin: viewport === 'laptop' ? '0 auto' : undefined
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt='Wedding Cover'
            className='absolute inset-0 w-full h-full'
            style={getImageStyle(resolveImageAdjust(mergedContent.cover_image_position, viewport))}
          />
          <div
            className='absolute inset-0'
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 38%, rgba(0,0,0,0.72) 100%)'
            }}
          />

          {/* Top badge */}
          <div className='absolute top-8 left-0 right-0 flex justify-center z-10'>
            <div className='px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30'>
              <p className='text-sm font-medium tracking-[0.3em] uppercase text-white'>Save The Date</p>
            </div>
          </div>

          {/* Bottom: names + date */}
          <div className='absolute bottom-0 left-0 right-0 z-10 text-center px-6 pb-12'>
            {guestName && <p className='text-white/60 text-xs tracking-[0.2em] uppercase mb-2'>Trân trọng kính mời</p>}
            {guestName && (
              <p
                className='text-white font-semibold text-lg mb-3'
                style={{ fontFamily: headingFontFamily, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
              >
                {guestName}
              </p>
            )}
            <h1
              className='font-bold leading-tight text-white mb-2'
              style={{
                fontFamily: headingFontFamily,
                fontSize: 'clamp(2rem, 8vw, 3rem)',
                textShadow: '0 2px 12px rgba(0,0,0,0.5)'
              }}
            >
              {mergedContent.groom_name}
              <span className='block text-white/70 my-2' style={{ fontSize: 'clamp(1rem, 4vw, 1.4rem)' }}>
                &amp;
              </span>
              {mergedContent.bride_name}
            </h1>
            {mergedContent.wedding_date && (
              <p className='text-white/75 text-sm font-light tracking-widest mt-1'>
                {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
            <div className='mt-4 flex items-center justify-center gap-3'>
              <div className='h-px w-12 bg-white/40'></div>
              <Heart size={16} fill='white' color='white' className='opacity-70' />
              <div className='h-px w-12 bg-white/40'></div>
            </div>
          </div>
        </section>

        {/* Parents Info Section */}
        {(mergedContent.groom_father_name || mergedContent.bride_father_name) && (
          <section className='py-16 px-4 bg-white'>
            <div className='max-w-2xl mx-auto'>
              <div className='text-center mb-10'>
                <h2 className='text-3xl font-bold mb-3' style={{ color: primaryColor, fontFamily: sectionFontFamily }}>
                  Gia Đình
                </h2>
                <div className='w-16 h-1 mx-auto rounded-full' style={{ backgroundColor: primaryColor }}></div>
              </div>
              <div className='grid grid-cols-2 gap-8'>
                <div className='text-center'>
                  <p className='text-xs font-semibold tracking-widest uppercase mb-4' style={{ color: primaryColor }}>
                    Nhà Trai
                  </p>
                  <div className='space-y-1 text-sm text-gray-700'>
                    {mergedContent.groom_father_name && (
                      <p>
                        Ông: <span className='font-medium'>{mergedContent.groom_father_name}</span>
                      </p>
                    )}
                    {mergedContent.groom_mother_name && (
                      <p>
                        Bà: <span className='font-medium'>{mergedContent.groom_mother_name}</span>
                      </p>
                    )}
                    {mergedContent.groom_city && (
                      <p className='text-gray-500 text-xs mt-1'>{mergedContent.groom_city}</p>
                    )}
                  </div>
                </div>
                <div className='text-center'>
                  <p className='text-xs font-semibold tracking-widest uppercase mb-4' style={{ color: primaryColor }}>
                    Nhà Gái
                  </p>
                  <div className='space-y-1 text-sm text-gray-700'>
                    {mergedContent.bride_father_name && (
                      <p>
                        Ông: <span className='font-medium'>{mergedContent.bride_father_name}</span>
                      </p>
                    )}
                    {mergedContent.bride_mother_name && (
                      <p>
                        Bà: <span className='font-medium'>{mergedContent.bride_mother_name}</span>
                      </p>
                    )}
                    {mergedContent.bride_city && (
                      <p className='text-gray-500 text-xs mt-1'>{mergedContent.bride_city}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Countdown Section */}
        {timeRemaining && (
          <section
            className='py-16 px-4'
            style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}05)` }}
          >
            <div className='max-w-4xl mx-auto text-center'>
              <h2
                className='text-3xl md:text-4xl font-bold mb-4'
                style={{ color: primaryColor, fontFamily: sectionFontFamily }}
              >
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
              <h2
                className='text-4xl md:text-5xl font-bold mb-4'
                style={{ color: primaryColor, fontFamily: sectionFontFamily }}
              >
                Thông Tin Sự Kiện
              </h2>
              <div className='w-20 h-1 mx-auto rounded-full' style={{ backgroundColor: primaryColor }}></div>
            </div>

            <div className={`grid gap-8 ${viewport === 'laptop' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <div
                className='bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 shadow-lg border'
                style={{ borderColor: `${primaryColor}20` }}
              >
                <div className='flex items-center gap-4 mb-4'>
                  <div className='p-3 rounded-full' style={{ backgroundColor: `${primaryColor}20` }}>
                    <Calendar size={24} color={primaryColor} />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-800' style={{ fontFamily: sectionFontFamily }}>
                    Thời Gian
                  </h3>
                </div>
                {calYear > 0 && (
                  <div className='mb-4'>
                    <WeddingCalendar
                      year={calYear}
                      month={calMonth}
                      day={calDay}
                      primaryColor={primaryColor}
                      variant='light'
                    />
                  </div>
                )}
                <div className='flex items-center gap-2 text-gray-500'>
                  <Clock size={18} />
                  <span>Lúc {mergedContent.wedding_time || '00:00'}</span>
                </div>
              </div>

              <div
                className='bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 shadow-lg border'
                style={{ borderColor: `${primaryColor}20` }}
              >
                <div className='flex items-center gap-4 mb-4'>
                  <div className='p-3 rounded-full' style={{ backgroundColor: `${primaryColor}20` }}>
                    <MapPin size={24} color={primaryColor} />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-800' style={{ fontFamily: sectionFontFamily }}>
                    Địa Điểm
                  </h3>
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
        <section className='py-20 px-4' style={{ background: `linear-gradient(to bottom, ${primaryColor}05, white)` }}>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-16'>
              <h2
                className='text-4xl md:text-5xl font-bold mb-4'
                style={{ color: primaryColor, fontFamily: sectionFontFamily }}
              >
                Khoảnh Khắc Của Chúng Tôi
              </h2>
              <div className='w-20 h-1 mx-auto rounded-full' style={{ backgroundColor: primaryColor }}></div>
            </div>

            <div className='grid grid-cols-2 gap-2'>
              {albumImages.slice(0, 4).map((img: string, idx: number) => {
                const isLast = idx === 3
                const extraCount = albumImages.length - 4
                return (
                  <div
                    key={idx}
                    className='relative overflow-hidden rounded-xl shadow-md'
                    style={{ aspectRatio: '3/4', cursor: 'pointer' }}
                    onClick={() => {
                      setLightboxIndex(idx)
                      setLightboxOpen(true)
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Wedding photo ${idx + 1}`}
                      className='w-full h-full'
                      style={getImageStyle(resolveImageAdjust(mergedContent.image_positions?.[idx], viewport))}
                    />
                    {isLast && extraCount > 0 && (
                      <div
                        className='absolute inset-0 flex items-center justify-center'
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: '#fff',
                          fontSize: '1.2rem',
                          fontWeight: 700
                        }}
                      >
                        +{extraCount}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* RSVP Section */}
        <section className='py-20 px-4 bg-white'>
          <div className='max-w-2xl mx-auto'>
            <div className='text-center mb-10'>
              <h2
                className='text-4xl md:text-5xl font-bold mb-4'
                style={{ color: primaryColor, fontFamily: sectionFontFamily }}
              >
                Xác Nhận Tham Dự
              </h2>
              <div className='w-20 h-1 mx-auto rounded-full' style={{ backgroundColor: primaryColor }}></div>
              {guestName && (
                <p className='mt-4 text-gray-600 text-sm'>
                  Kính mời <span className='font-semibold'>{guestName}</span>
                </p>
              )}
            </div>

            {!submitted ? (
              <div
                style={{
                  background: 'rgba(255,255,255,.92)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '20px',
                  padding: '28px 24px',
                  border: `1px solid ${primaryColor}20`,
                  boxShadow: '0 4px 24px rgba(0,0,0,.05)'
                }}
              >
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: primaryColor,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    marginBottom: '4px'
                  }}
                >
                  💌 Xác nhận tham dự
                </p>
                <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', marginBottom: '24px' }}>
                  Vui lòng điền thông tin để chúng tôi chuẩn bị tốt hơn
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* Tham dự? */}
                  <div>
                    <label style={labelStyle}>Bạn có tham dự không? *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <button
                        type='button'
                        className='btn-attend'
                        onClick={() => setIsAttending(true)}
                        style={{
                          padding: '13px 8px',
                          borderRadius: '12px',
                          border: isAttending === true ? '2px solid #22c55e' : '1.5px solid #e5e7eb',
                          background: isAttending === true ? '#f0fdf4' : '#fafafa',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: isAttending === true ? '#15803d' : '#6b7280',
                          transition: 'all .2s',
                          fontFamily: 'inherit'
                        }}
                      >
                        Có, tôi sẽ đến
                      </button>
                      <button
                        type='button'
                        className='btn-decline'
                        onClick={() => setIsAttending(false)}
                        style={{
                          padding: '13px 8px',
                          borderRadius: '12px',
                          border: isAttending === false ? '2px solid #ef4444' : '1.5px solid #e5e7eb',
                          background: isAttending === false ? '#fef2f2' : '#fafafa',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: isAttending === false ? '#dc2626' : '#6b7280',
                          transition: 'all .2s',
                          fontFamily: 'inherit'
                        }}
                      >
                        Xin lỗi, tôi bận
                      </button>
                    </div>
                  </div>

                  {/* Số điện thoại */}
                  <div>
                    <label style={labelStyle}>
                      Số điện thoại&nbsp;
                      <span
                        style={{
                          color: '#9ca3af',
                          fontSize: '12px',
                          fontWeight: '400',
                          textTransform: 'none',
                          letterSpacing: 0
                        }}
                      >
                        (tùy chọn)
                      </span>
                    </label>
                    <input
                      type='tel'
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder='0901 234 567'
                      style={inputStyle}
                    />
                  </div>

                  {/* Số người */}
                  <div>
                    <label style={labelStyle}>Số người tham dự</label>
                    <div style={{ display: 'flex' }}>
                      {[1, 2, 3, 4, 5].map((n, i) => (
                        <button
                          key={n}
                          type='button'
                          onClick={() => setPartySize(n)}
                          style={{
                            flex: 1,
                            padding: '12px 4px',
                            border: '1.5px solid',
                            borderColor: partySize === n ? primaryColor : '#e5e7eb',
                            borderRight: i < 4 ? 'none' : '1.5px solid',
                            borderRightColor: partySize === n ? primaryColor : '#e5e7eb',
                            borderRadius: i === 0 ? '10px 0 0 10px' : i === 4 ? '0 10px 10px 0' : '0',
                            background: partySize === n ? primaryColor : '#fafafa',
                            color: partySize === n ? '#fff' : '#6b7280',
                            fontWeight: '700',
                            fontSize: '15px',
                            cursor: 'pointer',
                            transition: 'all .18s',
                            fontFamily: 'inherit'
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '5px' }}>người tham dự</p>
                  </div>

                  {/* Lời chúc */}
                  <div>
                    <label style={labelStyle}>
                      Lời chúc&nbsp;
                      <span
                        style={{
                          color: '#9ca3af',
                          fontSize: '12px',
                          fontWeight: '400',
                          textTransform: 'none',
                          letterSpacing: 0
                        }}
                      >
                        (tùy chọn)
                      </span>
                    </label>
                    <textarea
                      value={wish}
                      onChange={(e) => setWish(e.target.value)}
                      placeholder='Chúc hai bạn trăm năm hạnh phúc, vạn sự như ý...'
                      rows={4}
                      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type='submit'
                    className='btn-submit'
                    disabled={loading || isAttending === null}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background:
                        isAttending === null || loading
                          ? '#e5e7eb'
                          : `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 100%)`,
                      color: isAttending === null || loading ? '#9ca3af' : '#fff',
                      border: 'none',
                      borderRadius: '14px',
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: loading || isAttending === null ? 'not-allowed' : 'pointer',
                      letterSpacing: '0.03em',
                      transition: 'all .25s',
                      boxShadow: isAttending !== null && !loading ? `0 6px 22px ${primaryColor}45` : 'none',
                      fontFamily: 'inherit'
                    }}
                  >
                    {loading ? '⏳ Đang gửi...' : '💌 Gửi xác nhận'}
                  </button>

                  {submitError && (
                    <div
                      style={{
                        padding: '12px 16px',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '10px',
                        color: '#dc2626',
                        fontSize: '14px',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}
                    >
                      ❌ {submitError}
                    </div>
                  )}
                </form>
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(255,255,255,.95)',
                  borderRadius: '24px',
                  padding: '52px 28px',
                  textAlign: 'center',
                  boxShadow: '0 10px 48px rgba(0,0,0,.08)',
                  border: `1px solid ${primaryColor}10`
                }}
              >
                <div className='float' style={{ fontSize: '4rem', marginBottom: '22px' }}>
                  {isAttending ? '🎊' : '💝'}
                </div>
                <h3
                  style={{
                    fontFamily: headingFontFamily,
                    fontSize: '1.55rem',
                    fontWeight: '700',
                    color: isAttending ? '#15803d' : primaryColor,
                    marginBottom: '12px',
                    lineHeight: 1.3
                  }}
                >
                  {isAttending ? 'Hẹn gặp bạn tại đám cưới!' : 'Cảm ơn bạn đã phản hồi!'}
                </h3>
                <p
                  style={{ color: '#6b7280', fontSize: '15px', lineHeight: 1.75, maxWidth: '300px', margin: '0 auto' }}
                >
                  {isAttending
                    ? `Chúng tôi rất vui được đón tiếp${guestName ? ` ${guestName}` : ''}. Hẹn gặp trong ngày vui! 🥂`
                    : 'Rất tiếc khi bạn không thể tham dự. Mong có dịp gặp nhau trong tương lai! 💕'}
                </p>
                {wish && (
                  <div
                    style={{
                      marginTop: '28px',
                      padding: '16px 20px',
                      background: `${primaryColor}08`,
                      borderRadius: '14px',
                      borderLeft: `3px solid ${primaryColor}`,
                      textAlign: 'left'
                    }}
                  >
                    <p
                      style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        color: primaryColor,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '8px'
                      }}
                    >
                      Lời chúc của bạn
                    </p>
                    <p style={{ color: '#374151', fontStyle: 'italic', fontSize: '14px', lineHeight: 1.7 }}>
                      &ldquo;{wish}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer
          className='py-12 px-4 text-center'
          style={{ background: `linear-gradient(to bottom, white, ${primaryColor}10)` }}
        >
          <div className='mb-6'>
            <Heart size={32} fill={primaryColor} color={primaryColor} className='mx-auto mb-4' />
            <p className='text-2xl font-bold mb-2' style={{ color: primaryColor, fontFamily: headingFontFamily }}>
              {mergedContent.groom_name} &amp; {mergedContent.bride_name}
            </p>
            <p className='text-gray-500'>Cảm ơn bạn đã đến chung vui cùng chúng tôi</p>
          </div>
          <div className='text-sm text-gray-400'>
            <p>Powered by MoiMoi Studio</p>
          </div>
        </footer>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.92)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#fff',
              width: 40,
              height: 40,
              borderRadius: '50%',
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: 0,
              right: 0,
              textAlign: 'center',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.85rem'
            }}
          >
            {lightboxIndex + 1} / {albumImages.length}
          </div>
          {lightboxIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex(lightboxIndex - 1)
              }}
              style={{
                position: 'absolute',
                left: 12,
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#fff',
                width: 44,
                height: 44,
                borderRadius: '50%',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ‹
            </button>
          )}
          <div onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={albumImages[lightboxIndex]}
              alt={`Photo ${lightboxIndex + 1}`}
              style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 8, display: 'block' }}
            />
          </div>
          {lightboxIndex < albumImages.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex(lightboxIndex + 1)
              }}
              style={{
                position: 'absolute',
                right: 12,
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#fff',
                width: 44,
                height: 44,
                borderRadius: '50%',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  )
}
