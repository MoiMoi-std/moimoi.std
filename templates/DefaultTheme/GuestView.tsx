import { createClient } from '@supabase/supabase-js'
import { Calendar, Clock, Heart, MapPin } from 'lucide-react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import RSVPForm from '@/components/guest/RSVPForm'
import { WeddingCalendar } from '../../components/WeddingCalendar'
import { getImageStyle, resolveImageAdjust } from '../../lib/imageUtils'
import { useTemplateViewport } from '../../lib/TemplateViewportContext'
import { TemplateProps } from '../TemplateRegistry'
import { useMapEmbed } from '../../lib/useMapEmbed'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function DefaultGuestView({ wedding, guestName = '', rsvpId }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Guestbook state
  const [wishesList, setWishesList] = useState<any[]>([])

  const { content, template } = wedding || {}

  const viewport = useTemplateViewport()

  const templateData = template as any
  const mergedContent = {
    ...(templateData?.default_content || {}),
    ...content
  }
  const mapEmbedSrc = useMapEmbed(mergedContent.map_url, mergedContent.address)

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
  const allAlbumImages = mergedContent.images?.length > 0 ? mergedContent.images : mockAlbumImages
  const albumImages = allAlbumImages.slice(0, 20)

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

  // Fetch Wishes
  useEffect(() => {
    if (wedding?.id) {
      supabase
        .from('rsvps')
        .select('guest_name, wishes')
        .eq('wedding_id', wedding.id)
        .not('wishes', 'is', null)
        .neq('wishes', '')
        .then(({ data }) => {
          if (data) setWishesList(data)
        })
    }
  }, [wedding?.id])

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
              {mergedContent.groom_role && (
                <span
                  className='block text-white/80 text-sm tracking-widest uppercase mb-1'
                  style={{ fontFamily: sectionFontFamily }}
                >
                  {mergedContent.groom_role}
                </span>
              )}
              {mergedContent.groom_name}
              <span className='block text-white/70 my-2' style={{ fontSize: 'clamp(1rem, 4vw, 1.4rem)' }}>
                &amp;
              </span>
              {mergedContent.bride_name}
              {mergedContent.bride_role && (
                <span
                  className='block text-white/80 text-sm tracking-widest uppercase mt-2'
                  style={{ fontFamily: sectionFontFamily }}
                >
                  {mergedContent.bride_role}
                </span>
              )}
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
                {mergedContent.lunar_date && (
                  <div className='flex items-center gap-2 text-gray-500 mt-2'>
                    <Calendar size={18} />
                    <span>Âm lịch: {mergedContent.lunar_date}</span>
                  </div>
                )}
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
                {mergedContent.address && (
                  <div
                    style={{
                      marginTop: 24,
                      width: '100%',
                      height: 250,
                      borderRadius: 12,
                      overflow: 'hidden',
                      position: 'relative',
                      border: `1px solid ${primaryColor}40`
                    }}
                  >
                    <iframe
                      width='100%'
                      height='100%'
                      style={{ border: 0 }}
                      loading='lazy'
                      allowFullScreen
                      referrerPolicy='no-referrer-when-downgrade'
                      src={mapEmbedSrc}
                    />
                  </div>
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
                Sổ Lưu Bút
              </h2>
              <div className='w-20 h-1 mx-auto rounded-full' style={{ backgroundColor: primaryColor }}></div>
              {guestName && (
                <p className='mt-4 text-gray-600 text-sm'>
                  Kính mời <span className='font-semibold'>{guestName}</span>
                </p>
              )}
            </div>

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
              {wishesList.length > 0 ? (
                <div className='flex flex-col gap-4'>
                  {wishesList.map((w, idx) => (
                    <div
                      key={idx}
                      className='p-6 text-left rounded-xl'
                      style={{ background: `${primaryColor}08`, borderLeft: `3px solid ${primaryColor}` }}
                    >
                      <p className='italic text-gray-600 mb-2 leading-relaxed'>"{w.wishes}"</p>
                      <p className='font-bold text-sm tracking-widest uppercase' style={{ color: primaryColor }}>
                        - {w.guest_name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-gray-500 italic text-center'>Chưa có lời chúc nào.</p>
              )}
            </div>
          </div>
        </section>

        {/* ── RSVP ── */}
        <section style={{ padding: '60px 20px 80px', background: 'transparent' }}>
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <RSVPForm
              weddingId={wedding?.id}
              rsvpId={rsvpId}
              guestName={guestName}
              primaryColor={mergedContent.primary_color}
              fontFamily={fontFamily}
              sectionFontFamily={sectionFontFamily}
            />
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
