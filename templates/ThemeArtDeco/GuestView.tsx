import Head from 'next/head'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import RSVPForm from '@/components/guest/RSVPForm'
import { TemplateProps } from '../TemplateRegistry'
import { getImageStyle, resolveImageAdjust } from '../../lib/imageUtils'
import { useTemplateViewport } from '../../lib/TemplateViewportContext'
import { useMapEmbed } from '../../lib/useMapEmbed'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function ArtDecoGuestView({ wedding, guestName, rsvpId }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const viewport = useTemplateViewport()
  const [wishesList, setWishesList] = useState<any[]>([])

  const { content, template } = wedding || {}

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
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }
  const mapEmbedSrc = useMapEmbed(mergedContent.map_url, mergedContent.address)
  const fontFamily = mergedContent.font_family || ''
  const sectionFontFamily = mergedContent.section_font_family || fontFamily

  const black = '#0e0e18'
  const darkCard = '#16162a'
  const gold = mergedContent.primary_color || '#d4ac4e'
  const goldLight = '#f0cf80'
  const cream = '#f5eed8'
  const teal = '#1d5060'
  const textLight = '#f0e8d4'

  useEffect(() => {
    if (!mergedContent.wedding_date) return
    const interval = setInterval(() => {
      const d = new Date(`${mergedContent.wedding_date}T${mergedContent.wedding_time || '00:00'}`)
      const diff = d.getTime() - Date.now()
      if (diff > 0) {
        setTimeRemaining({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000)
        })
      } else setTimeRemaining(null)
    }, 1000)
    return () => clearInterval(interval)
  }, [mergedContent.wedding_date, mergedContent.wedding_time])

  if (!wedding)
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: black
        }}
      >
        <h1 style={{ color: gold, fontFamily: "'Cinzel Decorative', cursive" }}>Không tìm thấy thiệp cưới</h1>
      </div>
    )

  const allAlbumImages: string[] = mergedContent.images?.length > 0 ? mergedContent.images : []
  const albumImages = allAlbumImages.slice(0, 20)

  return (
    <>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;500&family=Raleway:wght@300;400&display=swap'
          rel='stylesheet'
        />
        <style>{`
          @keyframes adFade { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes adShimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
          @keyframes adLineDraw { from{width:0} to{width:100%} }
          @keyframes adZoom { from{transform:scale(1)} to{transform:scale(1.05)} }
          .ad-up{animation:adFade 0.9s ease forwards;opacity:0}
          .ad-d1{animation-delay:.25s} .ad-d2{animation-delay:.55s} .ad-d3{animation-delay:.85s} .ad-d4{animation-delay:1.1s}
          .ad-shimmer{background:linear-gradient(90deg,${gold} 0%,${goldLight} 35%,#fff8dc 50%,${goldLight} 65%,${gold} 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:adShimmer 4s linear infinite}
          .ad-up.ad-shimmer.ad-d2{animation:adFade 0.9s .55s ease forwards, adShimmer 4s 1.45s linear infinite}
          .ad-up.ad-shimmer.ad-d3{animation:adFade 0.9s .85s ease forwards, adShimmer 4s 1.75s linear infinite}
          .ad-zoom{animation:adZoom 14s ease-in-out infinite alternate}
          *{box-sizing:border-box;margin:0;padding:0}
        `}</style>
      </Head>
      <div style={{ background: black, fontFamily: "'Raleway', sans-serif", color: textLight, overflowX: 'hidden' }}>
        {/* ── HERO ── */}
        <section
          style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            textAlign: 'center'
          }}
        >
          {mergedContent.cover_image && (
            <div
              className='ad-zoom'
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${mergedContent.cover_image})`,
                backgroundSize: 'cover',
                ...(() => {
                  const adj = resolveImageAdjust(mergedContent.cover_image_position, viewport)
                  return {
                    backgroundPosition: adj ? `${adj.x}% ${adj.y}%` : 'center',
                    ...(adj && adj.zoom !== 1
                      ? { transform: `scale(${adj.zoom})`, transformOrigin: `${adj.x}% ${adj.y}%` }
                      : {})
                  }
                })(),
                filter: 'brightness(0.28) saturate(0.4) contrast(1.1)'
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to bottom, rgba(14,14,24,0.65) 0%, rgba(14,14,24,0.25) 40%, rgba(14,14,24,0.88) 85%, rgba(14,14,24,0.98) 100%)`
            }}
          />

          {/* Art Deco geometric frame */}
          <div
            style={{
              position: 'absolute',
              inset: 40,
              border: `1px solid rgba(212,172,78,0.15)`,
              pointerEvents: 'none'
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 48,
              border: `0.5px solid rgba(212,172,78,0.08)`,
              pointerEvents: 'none'
            }}
          />
          {/* Corner diamonds */}
          {[
            { top: 36, left: 36 },
            { top: 36, right: 36 },
            { bottom: 36, left: 36 },
            { bottom: 36, right: 36 }
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                ...(pos as any),
                width: 10,
                height: 10,
                border: `1px solid rgba(212,172,78,0.45)`,
                transform: 'rotate(45deg)',
                pointerEvents: 'none'
              }}
            />
          ))}

          <div style={{ position: 'relative', zIndex: 2, padding: '80px 40px' }}>
            {/* Deco top ornament */}
            <div className='ad-up ad-d1' style={{ marginBottom: 24 }}>
              <svg width='80' height='24' viewBox='0 0 80 24' fill='none'>
                <line x1='0' y1='12' x2='28' y2='12' stroke={gold} strokeWidth='0.6' opacity='0.5' />
                <polygon points='32,12 36,8 40,12 36,16' fill={gold} opacity='0.6' />
                <polygon points='40,12 44,8 48,12 44,16' fill={gold} opacity='0.4' />
                <line x1='52' y1='12' x2='80' y2='12' stroke={gold} strokeWidth='0.6' opacity='0.5' />
                <line x1='0' y1='6' x2='26' y2='6' stroke={gold} strokeWidth='0.4' opacity='0.25' />
                <line x1='54' y1='6' x2='80' y2='6' stroke={gold} strokeWidth='0.4' opacity='0.25' />
                <line x1='0' y1='18' x2='26' y2='18' stroke={gold} strokeWidth='0.4' opacity='0.25' />
                <line x1='54' y1='18' x2='80' y2='18' stroke={gold} strokeWidth='0.4' opacity='0.25' />
              </svg>
            </div>
            <p
              className='ad-up ad-d1'
              style={{
                fontSize: 8,
                letterSpacing: '0.7em',
                color: `rgba(212,172,78,0.65)`,
                textTransform: 'uppercase',
                fontFamily: "'Cinzel', serif",
                marginBottom: 22
              }}
            >
              Wedding Invitation
            </p>
            {mergedContent.groom_role && (
              <p
                className='ad-up ad-d1'
                style={{
                  fontSize: 10,
                  letterSpacing: '0.4em',
                  color: `rgba(212,172,78,0.8)`,
                  textTransform: 'uppercase',
                  fontFamily: "'Cinzel', serif",
                  marginBottom: 8
                }}
              >
                {mergedContent.groom_role}
              </p>
            )}
            <h1
              className='ad-up ad-shimmer ad-d2'
              style={{
                fontSize: 'clamp(2.5rem,10vw,6rem)',
                fontFamily: "'Cinzel Decorative', cursive",
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: '0.05em',
                paddingTop: '0.15em',
                paddingBottom: '0.15em',
                marginBottom: 14
              }}
            >
              {mergedContent.groom_name || 'Chú Rể'}
            </h1>
            <div
              className='ad-up ad-d2'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '14px 0' }}
            >
              <div style={{ width: 28, height: 1, background: `rgba(212,172,78,0.4)` }} />
              <svg width='20' height='20' viewBox='0 0 20 20'>
                <polygon points='10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8' fill={gold} opacity='0.6' />
              </svg>
              <div style={{ width: 28, height: 1, background: `rgba(212,172,78,0.4)` }} />
            </div>
            {mergedContent.bride_role && (
              <p
                className='ad-up ad-d2'
                style={{
                  fontSize: 10,
                  letterSpacing: '0.4em',
                  color: `rgba(212,172,78,0.8)`,
                  textTransform: 'uppercase',
                  fontFamily: "'Cinzel', serif",
                  marginBottom: 8
                }}
              >
                {mergedContent.bride_role}
              </p>
            )}
            <h1
              className='ad-up ad-shimmer ad-d3'
              style={{
                fontSize: 'clamp(2.5rem,10vw,6rem)',
                fontFamily: "'Cinzel Decorative', cursive",
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: '0.05em',
                paddingTop: '0.15em',
                paddingBottom: '0.15em',
                marginBottom: 26
              }}
            >
              {mergedContent.bride_name || 'Cô Dâu'}
            </h1>
            {/* Bottom deco */}
            <div className='ad-up ad-d3' style={{ marginBottom: 18 }}>
              <svg width='80' height='16' viewBox='0 0 80 16' fill='none'>
                <line x1='0' y1='8' x2='30' y2='8' stroke={gold} strokeWidth='0.6' opacity='0.45' />
                <rect x='33' y='5' width='6' height='6' transform='rotate(45 36 8)' fill={gold} opacity='0.5' />
                <rect x='41' y='5' width='6' height='6' transform='rotate(45 44 8)' fill={gold} opacity='0.3' />
                <line x1='50' y1='8' x2='80' y2='8' stroke={gold} strokeWidth='0.6' opacity='0.45' />
              </svg>
            </div>
            {mergedContent.wedding_date && (
              <p
                className='ad-up ad-d4'
                style={{
                  fontSize: 11,
                  letterSpacing: '0.3em',
                  color: `rgba(240,207,128,0.65)`,
                  textTransform: 'uppercase',
                  fontFamily: "'Cinzel', serif"
                }}
              >
                {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
            {guestName && (
              <div
                style={{
                  marginTop: 22,
                  padding: '12px 28px',
                  border: `1px solid rgba(212,172,78,0.3)`,
                  display: 'inline-block'
                }}
              >
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.4em',
                    color: `rgba(212,172,78,0.65)`,
                    textTransform: 'uppercase',
                    fontFamily: "'Cinzel', serif",
                    marginBottom: 4
                  }}
                >
                  Kính gửi
                </p>
                <p
                  style={{
                    fontSize: 'clamp(1rem,3.5vw,1.6rem)',
                    fontFamily: "'Cinzel Decorative', cursive",
                    color: gold,
                    fontWeight: 400
                  }}
                >
                  {guestName}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── COUNTDOWN ── */}
        {timeRemaining && (
          <section style={{ background: darkCard, padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
              <div style={{ width: 24, height: 1, background: gold, opacity: 0.4 }} />
              <p
                style={{
                  fontSize: 8,
                  letterSpacing: '0.6em',
                  color: gold,
                  textTransform: 'uppercase',
                  fontFamily: "'Cinzel', serif"
                }}
              >
                Đếm ngược
              </p>
              <div style={{ width: 24, height: 1, background: gold, opacity: 0.4 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, maxWidth: 360, margin: '0 auto' }}>
              {[
                { v: timeRemaining.days, l: 'Ngày' },
                { v: timeRemaining.hours, l: 'Giờ' },
                { v: timeRemaining.minutes, l: 'Phút' },
                { v: timeRemaining.seconds, l: 'Giây' }
              ].map((it, i) => (
                <div key={i} style={{ flex: 1 }}>
                  <div
                    style={{
                      border: `1px solid rgba(212,172,78,0.28)`,
                      padding: '14px 4px',
                      marginBottom: 8,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 1,
                        background: `linear-gradient(to right, transparent, ${gold}, transparent)`,
                        opacity: 0.3
                      }}
                    />
                    <span
                      style={{
                        display: 'block',
                        fontSize: 'clamp(1.8rem,6vw,3rem)',
                        fontFamily: "'Cinzel Decorative', cursive",
                        color: gold,
                        lineHeight: 1
                      }}
                    >
                      {String(it.v).padStart(2, '0')}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 8,
                      letterSpacing: '0.3em',
                      color: `rgba(212,172,78,0.5)`,
                      textTransform: 'uppercase',
                      fontFamily: "'Cinzel', serif"
                    }}
                  >
                    {it.l}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── STORY ── */}
        <section style={{ background: black, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <svg width='60' height='36' viewBox='0 0 60 36' fill='none' style={{ marginBottom: 24 }}>
              <line x1='0' y1='18' x2='18' y2='18' stroke={gold} strokeWidth='0.6' opacity='0.4' />
              <polygon points='20,18 24,14 30,18 24,22' fill={gold} opacity='0.5' />
              <polygon points='30,18 36,14 40,18 36,22' fill={gold} opacity='0.35' />
              <line x1='42' y1='18' x2='60' y2='18' stroke={gold} strokeWidth='0.6' opacity='0.4' />
              <line x1='0' y1='12' x2='16' y2='12' stroke={gold} strokeWidth='0.4' opacity='0.2' />
              <line x1='44' y1='12' x2='60' y2='12' stroke={gold} strokeWidth='0.4' opacity='0.2' />
              <line x1='0' y1='24' x2='16' y2='24' stroke={gold} strokeWidth='0.4' opacity='0.2' />
              <line x1='44' y1='24' x2='60' y2='24' stroke={gold} strokeWidth='0.4' opacity='0.2' />
            </svg>
            <h2
              style={{
                fontSize: 'clamp(1.8rem,6vw,3rem)',
                fontFamily: "'Cinzel Decorative', cursive",
                color: gold,
                fontWeight: 400,
                marginBottom: 20,
                letterSpacing: '0.03em'
              }}
            >
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: 'rgba(240,232,212,0.7)', letterSpacing: '0.03em' }}>
              {mergedContent.intro_text ||
                'Với phong cách hoàng gia và trái tim thuần khiết, chúng tôi tổ chức lễ kết hôn trọng đại. Sự hiện diện của quý vị sẽ làm rực rỡ thêm ngày trọng đại này.'}
            </p>
          </div>
        </section>

        {/* ── EVENT DETAILS ── */}
        <section style={{ background: darkCard, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p
                style={{
                  fontSize: 8,
                  letterSpacing: '0.6em',
                  color: gold,
                  textTransform: 'uppercase',
                  fontFamily: "'Cinzel', serif",
                  marginBottom: 10
                }}
              >
                Ceremony Details
              </p>
              <h2
                style={{
                  fontSize: 'clamp(1.4rem,4vw,2.2rem)',
                  fontFamily: "'Cinzel Decorative', cursive",
                  color: textLight,
                  fontWeight: 400
                }}
              >
                Lễ Thành Hôn
              </h2>
            </div>
            {[
              { label: 'Ngày cưới', value: mergedContent.event_date || mergedContent.wedding_date },
              { label: 'Giờ lễ', value: mergedContent.wedding_time },
              { label: 'Địa điểm', value: mergedContent.address },
              { label: 'Lịch âm', value: mergedContent.lunar_date }
            ]
              .filter((it) => it.value)
              .map((it, i) => (
                <div key={i} style={{ padding: '16px 0', borderBottom: `1px solid rgba(212,172,78,0.1)` }}>
                  <p
                    style={{
                      fontSize: 8,
                      letterSpacing: '0.45em',
                      color: gold,
                      textTransform: 'uppercase',
                      fontFamily: "'Cinzel', serif",
                      marginBottom: 5
                    }}
                  >
                    {it.label}
                  </p>
                  <p style={{ fontSize: 15, color: textLight, lineHeight: 1.5, letterSpacing: '0.02em' }}>{it.value}</p>
                </div>
              ))}
            {mergedContent.address && (
              <div
                style={{
                  marginTop: 28,
                  width: '100%',
                  height: 250,
                  borderRadius: 12,
                  overflow: 'hidden',
                  position: 'relative',
                  border: `1px solid rgba(212,172,78,0.25)`
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
        </section>

        {/* ── ALBUM ── */}
        {albumImages.length > 0 && (
          <section style={{ background: black, padding: '72px 24px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <p
                  style={{
                    fontSize: 8,
                    letterSpacing: '0.55em',
                    color: gold,
                    textTransform: 'uppercase',
                    fontFamily: "'Cinzel', serif",
                    marginBottom: 10
                  }}
                >
                  Album ảnh
                </p>
                <h2
                  style={{
                    fontSize: 'clamp(1.4rem,4vw,2.2rem)',
                    fontFamily: "'Cinzel Decorative', cursive",
                    color: textLight,
                    fontWeight: 400
                  }}
                >
                  Khoảnh Khắc Vàng
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                {albumImages.slice(0, 4).map((img: string, i: number) => {
                  const isLast = i === 3
                  const extraCount = albumImages.length - 4
                  return (
                    <div
                      key={i}
                      style={{
                        position: 'relative',
                        aspectRatio: '3/4',
                        overflow: 'hidden',
                        border: `1px solid rgba(212,172,78,0.2)`
                      }}
                    >
                      <img
                        src={img}
                        alt=''
                        style={{
                          width: '100%',
                          height: '100%',
                          filter: 'sepia(0.15) contrast(1.1)',
                          ...getImageStyle(resolveImageAdjust(mergedContent.image_positions?.[i], viewport))
                        }}
                      />
                      {isLast && extraCount > 0 && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: gold,
                            fontSize: '1.5rem',
                            fontFamily: "'Cinzel', serif"
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
        )}

        {/* ── GIFT ── */}
        {(mergedContent.bank_name || mergedContent.account_number || mergedContent.qr_image) && (
          <section style={{ background: darkCard, padding: '72px 24px' }}>
            <div style={{ maxWidth: 420, margin: '0 auto', textAlign: 'center' }}>
              <p
                style={{
                  fontSize: 8,
                  letterSpacing: '0.55em',
                  color: gold,
                  textTransform: 'uppercase',
                  fontFamily: "'Cinzel', serif",
                  marginBottom: 14
                }}
              >
                Hộp mừng cưới
              </p>
              <h2
                style={{
                  fontSize: 'clamp(1.4rem,4vw,2.2rem)',
                  fontFamily: "'Cinzel Decorative', cursive",
                  color: textLight,
                  marginBottom: 28
                }}
              >
                Tấm Lòng Quý Khách
              </h2>
              <div style={{ border: `1px solid rgba(212,172,78,0.25)`, padding: '28px 20px', position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: -1,
                    left: '20%',
                    right: '20%',
                    height: 1,
                    background: `linear-gradient(to right, transparent, ${gold}, transparent)`,
                    opacity: 0.4
                  }}
                />
                {mergedContent.qr_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mergedContent.qr_image}
                    alt='QR Tiền Mừng'
                    style={{ width: 180, height: 180, objectFit: 'contain', margin: '12px auto 0', display: 'block' }}
                  />
                ) : (
                  mergedContent.account_number && (
                    <p
                      style={{ fontSize: 22, color: textLight, letterSpacing: '0.12em', fontFamily: "'Cinzel', serif" }}
                    >
                      {mergedContent.account_number}
                    </p>
                  )
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── GUESTBOOK ── */}
        <section style={{ background: black, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <p
              style={{
                fontSize: 8,
                letterSpacing: '0.55em',
                color: gold,
                textTransform: 'uppercase',
                fontFamily: "'Cinzel', serif",
                marginBottom: 14
              }}
            >
              Sổ Lưu Bút
            </p>
            <h2
              style={{
                fontSize: 'clamp(1.4rem,4vw,2.2rem)',
                fontFamily: "'Cinzel Decorative', cursive",
                color: textLight,
                marginBottom: 28
              }}
            >
              Lời Chúc Trân Trọng
            </h2>
            <div style={{ border: `1px solid rgba(212,172,78,0.25)`, padding: '28px 20px', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: -1,
                  left: '20%',
                  right: '20%',
                  height: 1,
                  background: `linear-gradient(to right, transparent, ${gold}, transparent)`,
                  opacity: 0.4
                }}
              />
              {wishesList.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {wishesList.map((w, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '16px',
                        textAlign: 'left',
                        background: 'rgba(212,172,78,0.05)',
                        borderLeft: `2px solid ${gold}`
                      }}
                    >
                      <p
                        style={{
                          fontStyle: 'italic',
                          color: 'rgba(240,232,212,0.7)',
                          marginBottom: 8,
                          fontSize: 13,
                          lineHeight: 1.6
                        }}
                      >
                        "{w.wishes}"
                      </p>
                      <p
                        style={{
                          fontFamily: "'Cinzel', serif",
                          color: gold,
                          fontSize: 10,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase'
                        }}
                      >
                        - {w.guest_name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'rgba(240,232,212,0.5)', fontStyle: 'italic' }}>Chưa có lời chúc nào.</p>
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

        {/* ── FOOTER ── */}
        <section
          style={{
            background: black,
            borderTop: `1px solid rgba(212,172,78,0.12)`,
            padding: '52px 24px',
            textAlign: 'center'
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.2rem,4vw,2.4rem)',
              fontFamily: "'Cinzel Decorative', cursive",
              color: gold,
              fontWeight: 400,
              marginBottom: 10
            }}
          >
            {mergedContent.groom_name} & {mergedContent.bride_name}
          </h2>
          {mergedContent.wedding_date && (
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.45em',
                color: `rgba(212,172,78,0.45)`,
                textTransform: 'uppercase',
                fontFamily: "'Cinzel', serif"
              }}
            >
              {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
          <p
            style={{
              fontSize: 8,
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.15)',
              marginTop: 28,
              textTransform: 'uppercase',
              fontFamily: "'Cinzel', serif"
            }}
          >
            Made with love · MoiMoi Studio
          </p>
        </section>
      </div>
    </>
  )
}
