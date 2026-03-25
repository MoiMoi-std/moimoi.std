import Head from 'next/head'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { TemplateProps } from '../TemplateRegistry'
import MusicPlayer from '@/components/MusicPlayer'
import { getImageStyle, resolveImageAdjust } from '../../lib/imageUtils'
import { useTemplateViewport } from '../../lib/TemplateViewportContext'
import { useMapEmbed } from '../../lib/useMapEmbed'

const Sparkles = () => {
  const [sparkles, setSparkles] = useState<{ left: string; delay: string; duration: string }[]>([])

  useEffect(() => {
    setSparkles(
      [...Array(30)].map(() => ({
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 8}s`,
        duration: `${4 + Math.random() * 5}s`
      }))
    )
  }, [])

  if (sparkles.length === 0) return null

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      {sparkles.map((style, i) => (
        <div
          key={i}
          className='ry-sparkle'
          style={{
            left: style.left,
            animationDelay: style.delay,
            animationDuration: style.duration
          }}
        />
      ))}
    </div>
  )
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const BANK_MAP: Record<string, string> = {
  Vietcombank: 'VCB',
  Techcombank: 'TCB',
  MBBank: 'MB',
  ACB: 'ACB',
  Vietinbank: 'ICB',
  BIDV: 'BIDV',
  VPBank: 'VPB',
  TPBank: 'TPB'
}

export default function RoyalGeneralView({ wedding, disableSplash, musicUrl }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const viewport = useTemplateViewport()
  const [wishesList, setWishesList] = useState<any[]>([])
  const [showSplash, setShowSplash] = useState(!disableSplash)
  const [splashFading, setSplashFading] = useState(false)
  const [showGiftQr, setShowGiftQr] = useState(false)

  const handleOpenInvitation = () => {
    setSplashFading(true)
    setTimeout(() => setShowSplash(false), 600)
  }

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

  useEffect(() => {
    if (showSplash) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('ry-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    document.querySelectorAll('.ry-scroll-anim').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [showSplash])

  const navy = '#0f1b35'
  const navyMid = '#162548'
  const gold = mergedContent.primary_color || '#c9a227'
  const goldLight = '#e8d06a'
  const parchment = '#f9f4e8'
  const parchmentDark = '#f0e8d0'
  const textDark = '#1e1a0f'
  const textMid = '#5c4f2a'

  useEffect(() => {
    if (!mergedContent.wedding_date) return
    const interval = setInterval(() => {
      const weddingDate = new Date(`${mergedContent.wedding_date}T${mergedContent.wedding_time || '00:00'}`)
      const now = new Date()
      const diff = weddingDate.getTime() - now.getTime()
      if (diff > 0) {
        setTimeRemaining({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
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
          background: navy
        }}
      >
        <h1 style={{ color: gold, fontFamily: "'Cormorant Garamond', serif" }}>Không tìm thấy thiệp cưới</h1>
      </div>
    )

  const allAlbumImages: string[] = mergedContent.images?.length > 0 ? mergedContent.images : []
  const albumImages = allAlbumImages.slice(0, 20)

  return (
    <>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Cinzel:wght@400;500&display=swap'
          rel='stylesheet'
        />
        <style>{`
          @keyframes royalShimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
          @keyframes royalFadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
          @keyframes royalZoom { from{transform:scale(1)} to{transform:scale(1.1)} }
          @keyframes ryFloat { 0%, 100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
          @keyframes ryGlow { 0%{box-shadow:0 0 10px rgba(201,168,76,0.2)} 100%{box-shadow:0 0 25px rgba(201,168,76,0.6)} }
          @keyframes ryFall { 0%{transform:translateY(-10px) rotate(0deg);opacity:0} 20%{opacity:0.8} 80%{opacity:0.8} 100%{transform:translateY(100vh) rotate(360deg);opacity:0} }
          
          .ry-up{animation:royalFadeUp 1.2s cubic-bezier(0.2,0.8,0.2,1) forwards;opacity:0}
          .ry-d1{animation-delay:.3s} .ry-d2{animation-delay:.6s} .ry-d3{animation-delay:.9s} .ry-d4{animation-delay:1.2s}
          .ry-shimmer{background:linear-gradient(90deg,${gold} 0%,${goldLight} 35%,#fffbe8 50%,${goldLight} 65%,${gold} 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:royalShimmer 4s linear infinite}
          .ry-up.ry-shimmer.ry-d2{animation:royalFadeUp 1.2s .6s cubic-bezier(0.2,0.8,0.2,1) forwards, royalShimmer 5s 1.8s linear infinite}
          .ry-up.ry-shimmer.ry-d3{animation:royalFadeUp 1.2s .9s cubic-bezier(0.2,0.8,0.2,1) forwards, royalShimmer 5s 2.1s linear infinite}
          .ry-zoom{animation:royalZoom 20s ease-in-out infinite alternate}
          .ry-float{animation:ryFloat 6s ease-in-out infinite}
          .ry-up-float{animation:royalFadeUp 1.2s cubic-bezier(0.2,0.8,0.2,1) forwards, ryFloat 6s 1.2s ease-in-out infinite;opacity:0}
          .ry-btn-glow{animation:ryGlow 2s infinite alternate}
          .ry-sparkle{position:absolute;top:-10px;width:3px;height:3px;background:#C9A84C;border-radius:50%;box-shadow:0 0 6px 1px #C9A84C;animation:ryFall linear infinite;opacity:0}
          
          /* Intersection Observer classes */
          .ry-scroll-anim{opacity:0;transform:translateY(40px);transition:all 1.2s cubic-bezier(0.2,0.8,0.2,1)}
          .ry-visible{opacity:1;transform:translateY(0)}
          .ry-delay-1{transition-delay:0.2s}
          .ry-delay-2{transition-delay:0.4s}
          .ry-delay-3{transition-delay:0.6s}
          
          .gift-card-royal {
            background: linear-gradient(135deg, ${navyMid} 0%, ${navy} 100%);
            border: 1px solid ${gold}44;
            transition: all 0.3s ease;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }
          .gift-card-royal:hover {
            transform: translateY(-5px);
            border-color: ${gold};
            box-shadow: 0 15px 40px rgba(0,0,0,0.4);
          }
          
          *{box-sizing:border-box;margin:0;padding:0}
        `}</style>
      </Head>
      <div
        style={{
          background: '#FAFAFA',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          color: '#333333',
          overflowX: 'hidden'
        }}
      >
        {/* ═════════ SPLASH SCREEN ═════════ */}
        {showSplash && (
          <div
            onClick={handleOpenInvitation}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9997,
              backgroundColor: '#FAFAFA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: splashFading ? 0 : 1,
              transition: 'opacity 0.6s ease',
              fontFamily: "'Cormorant Garamond', serif",
              padding: 20
            }}
          >
            <Sparkles />
            <div
              className='splash-card ry-up-float'
              style={{
                width: '100%',
                maxWidth: 480,
                textAlign: 'center',
                backgroundColor: '#fff',
                borderRadius: '1.5rem',
                border: '1px solid #C9A84C',
                padding: '4px',
                position: 'relative',
                boxShadow: '0 12px 40px rgba(0,0,0,0.1)'
              }}
            >
              <div
                style={{
                  border: '1px solid #C9A84C',
                  borderRadius: '1.25rem',
                  padding: '40px 32px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {/* Crown / Motif */}
                <div style={{ marginBottom: 20 }}>
                  <svg width='40' height='30' viewBox='0 0 40 30' fill='none'>
                    <path
                      d='M20 2L24 12L36 10L27 18L30 28L20 22L10 28L13 18L4 10L16 12L20 2Z'
                      fill='#C9A84C'
                      opacity='0.8'
                    />
                    <circle cx='20' cy='15' r='3' fill='#fff' />
                  </svg>
                </div>

                <p
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.7rem',
                    letterSpacing: '0.3em',
                    color: '#C9A84C',
                    textTransform: 'uppercase',
                    marginBottom: 16
                  }}
                >
                  Trân trọng kính báo
                </p>

                <p style={{ fontSize: '0.85rem', color: '#555', fontStyle: 'italic', marginBottom: 16 }}>
                  Lễ thành hôn của
                </p>

                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 24 }}
                >
                  <h3
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: 'clamp(2rem, 8vw, 2.5rem)',
                      color: '#1e3a8a',
                      fontWeight: 500,
                      lineHeight: 1.2
                    }}
                  >
                    {mergedContent.groom_name || 'Chú Rể'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 30, height: 1, backgroundColor: '#C9A84C', opacity: 0.5 }} />
                    <span style={{ fontFamily: "'Cinzel', serif", color: '#C9A84C', fontSize: '1.2rem' }}>&amp;</span>
                    <div style={{ width: 30, height: 1, backgroundColor: '#C9A84C', opacity: 0.5 }} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: 'clamp(2rem, 8vw, 2.5rem)',
                      color: '#1e3a8a',
                      fontWeight: 500,
                      lineHeight: 1.2
                    }}
                  >
                    {mergedContent.bride_name || 'Cô Dâu'}
                  </h3>
                </div>

                {/* Date */}
                {mergedContent.wedding_date && (
                  <div style={{ marginBottom: 30 }}>
                    <span
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '0.9rem',
                        fontWeight: 400,
                        color: '#333',
                        letterSpacing: '0.1em'
                      }}
                    >
                      {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </span>
                  </div>
                )}

                <div style={{ position: 'relative', zIndex: 10 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpenInvitation()
                    }}
                    className='ry-btn-glow'
                    style={{
                      backgroundColor: '#1e3a8a',
                      color: '#fff',
                      border: '1px solid #C9A84C',
                      borderRadius: '4px',
                      padding: '12px 40px',
                      fontSize: '0.85rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      fontFamily: "'Cinzel', serif",
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Mở Thiệp
                  </button>
                </div>
                <p style={{ fontSize: '0.65rem', color: '#999', letterSpacing: '0.08em', marginTop: 16 }}>
                  hoặc chạm vào bất kỳ đâu để mở
                </p>
              </div>
            </div>
          </div>
        )}
        {/* ── HERO ── */}
        <section
          style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1e3a8a',
            overflow: 'hidden'
          }}
        >
          {mergedContent.cover_image && (
            <div
              className='ry-zoom'
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
                opacity: 0.25
              }}
            />
          )}

          <Sparkles />

          {/* Royal Frame Wrapper */}
          <div
            className='ry-up'
            style={{
              position: 'relative',
              zIndex: 2,
              margin: '24px',
              padding: '8px',
              border: '1px solid rgba(201,168,76,0.6)',
              borderRadius: '200px 200px 0 0',
              maxWidth: '90vw',
              width: '420px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(4px)'
            }}
          >
            <div
              style={{
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '192px 192px 0 0',
                padding: '60px 24px 40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
                <svg width='48' height='36' viewBox='0 0 48 36' fill='none'>
                  <path
                    d='M24 2L28 14L40 12L31 22L36 34L24 26L12 34L17 22L8 12L20 14L24 2Z'
                    fill='#C9A84C'
                    opacity='0.7'
                  />
                  <circle cx='24' cy='18' r='4' fill='rgba(255,255,255,0.8)' />
                </svg>
              </div>

              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.8rem',
                  letterSpacing: '0.4em',
                  color: '#C9A84C',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: 32
                }}
              >
                The Wedding Of
              </span>

              <h1
                className='ry-up ry-shimmer ry-d2'
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 'clamp(2.5rem, 10vw, 3.5rem)',
                  color: '#FAFAFA',
                  fontWeight: 400,
                  lineHeight: 1.15,
                  marginBottom: 8
                }}
              >
                {mergedContent.groom_name || 'Chú Rể'}
              </h1>
              <div className='ry-up ry-d2' style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '12px 0' }}>
                <div style={{ width: 40, height: 1, backgroundColor: 'rgba(201,168,76,0.3)' }} />
                <span style={{ fontFamily: "'Cinzel', serif", color: '#C9A84C', fontSize: '1.5rem' }}>&amp;</span>
                <div style={{ width: 40, height: 1, backgroundColor: 'rgba(201,168,76,0.3)' }} />
              </div>

              <h1
                className='ry-up ry-shimmer ry-d3'
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 'clamp(2.5rem, 10vw, 3.5rem)',
                  color: '#FAFAFA',
                  fontWeight: 400,
                  lineHeight: 1.15,
                  marginBottom: 32
                }}
              >
                {mergedContent.bride_name || 'Cô Dâu'}
              </h1>

              <div
                style={{ marginBottom: 24, fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}
              >
                Hân hạnh đón tiếp quý khách
              </div>

              <div
                style={{ width: '80%', height: 1, backgroundColor: 'rgba(201,168,76,0.3)', margin: '0 auto 24px' }}
              />

              {mergedContent.wedding_date && (
                <div style={{ paddingBottom: 10 }}>
                  <span
                    className='ry-up ry-d4'
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: '#C9A84C',
                      letterSpacing: '0.2em'
                    }}
                  >
                    {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── COUNTDOWN ── */}
        {timeRemaining && (
          <section style={{ background: navyMid, padding: '60px 24px', textAlign: 'center' }}>
            <p
              className='ry-scroll-anim'
              style={{
                fontSize: 9,
                letterSpacing: '0.55em',
                color: gold,
                textTransform: 'uppercase',
                fontFamily: "'Cinzel',serif",
                marginBottom: 32
              }}
            >
              Đếm ngược đến ngày đặc biệt
            </p>
            <div
              className='ry-scroll-anim ry-delay-1'
              style={{ display: 'flex', justifyContent: 'center', gap: 10, maxWidth: 360, margin: '0 auto' }}
            >
              {[
                { v: timeRemaining.days, l: 'Ngày' },
                { v: timeRemaining.hours, l: 'Giờ' },
                { v: timeRemaining.minutes, l: 'Phút' },
                { v: timeRemaining.seconds, l: 'Giây' }
              ].map((it, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div
                    style={{
                      background: 'rgba(201,162,39,0.07)',
                      border: `1px solid rgba(201,162,39,0.22)`,
                      padding: '14px 8px',
                      marginBottom: 8
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontSize: 'clamp(1.8rem,7vw,3.2rem)',
                        fontFamily: "'Cinzel',serif",
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
                      color: `rgba(201,162,39,0.55)`,
                      textTransform: 'uppercase',
                      fontFamily: "'Cinzel',serif"
                    }}
                  >
                    {it.l}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── COUPLE STORY ── */}
        <section style={{ background: parchmentDark, padding: '72px 24px' }}>
          <div className='ry-scroll-anim' style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ width: 32, height: 1, background: gold, opacity: 0.4 }} />
              <svg width='14' height='14' viewBox='0 0 14 14'>
                <path
                  d='M7 0 L8.2 4.5 L13 4.5 L9.2 7.3 L10.5 12 L7 9.2 L3.5 12 L4.8 7.3 L1 4.5 L5.8 4.5 Z'
                  fill={gold}
                  opacity='0.55'
                />
              </svg>
              <div style={{ width: 32, height: 1, background: gold, opacity: 0.4 }} />
            </div>
            <h2
              style={{
                fontSize: 'clamp(1.8rem,6vw,3rem)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: textDark,
                marginBottom: 20
              }}
            >
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </h2>
            <p
              className='ry-scroll-anim ry-delay-1'
              style={{ fontSize: 15, lineHeight: 1.85, color: textMid, fontStyle: 'italic' }}
            >
              {mergedContent.intro_text ||
                'Với trái tim tràn đầy hạnh phúc, chúng tôi trân trọng kính mời quý vị đến chung vui trong ngày trọng đại nhất cuộc đời chúng tôi.'}
            </p>
          </div>
        </section>

        {/* ── EVENT DETAILS ── */}
        <section style={{ background: navy, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <div className='ry-scroll-anim' style={{ textAlign: 'center', marginBottom: 44 }}>
              <p
                style={{
                  fontSize: 9,
                  letterSpacing: '0.5em',
                  color: gold,
                  textTransform: 'uppercase',
                  fontFamily: "'Cinzel',serif",
                  marginBottom: 10
                }}
              >
                Thông tin lễ cưới
              </p>
              <h2
                style={{ fontSize: 'clamp(1.6rem,5vw,2.6rem)', color: parchment, fontWeight: 300, fontStyle: 'italic' }}
              >
                Lễ thành hôn
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14 }}>
                <div style={{ width: 28, height: 1, background: `linear-gradient(to right, transparent, ${gold})` }} />
                <div style={{ width: 5, height: 5, background: gold, transform: 'rotate(45deg)', opacity: 0.7 }} />
                <div style={{ width: 28, height: 1, background: `linear-gradient(to left, transparent, ${gold})` }} />
              </div>
            </div>
            {[
              { label: 'Ngày cưới', value: mergedContent.event_date || mergedContent.wedding_date },
              { label: 'Giờ lễ', value: mergedContent.wedding_time },
              { label: 'Địa điểm', value: mergedContent.address },
              { label: 'Lịch âm', value: mergedContent.lunar_date }
            ]
              .filter((it) => it.value)
              .map((it, i) => (
                <div
                  className='ry-scroll-anim ry-delay-1'
                  key={i}
                  style={{ padding: '16px 0', borderBottom: `1px solid rgba(201,162,39,0.12)` }}
                >
                  <p
                    style={{
                      fontSize: 8,
                      letterSpacing: '0.35em',
                      color: gold,
                      textTransform: 'uppercase',
                      fontFamily: "'Cinzel',serif",
                      marginBottom: 5
                    }}
                  >
                    {it.label}
                  </p>
                  <p style={{ fontSize: 15, color: parchment, lineHeight: 1.5 }}>{it.value}</p>
                </div>
              ))}
            {mergedContent.address && (
              <div
                className='ry-scroll-anim ry-delay-2'
                style={{
                  marginTop: 28,
                  width: '100%',
                  height: 250,
                  borderRadius: 12,
                  overflow: 'hidden',
                  position: 'relative',
                  border: `1px solid rgba(201,162,39,0.28)`
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
          <section style={{ background: parchmentDark, padding: '72px 24px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <div className='ry-scroll-anim' style={{ textAlign: 'center', marginBottom: 36 }}>
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.5em',
                    color: gold,
                    textTransform: 'uppercase',
                    fontFamily: "'Cinzel',serif",
                    marginBottom: 10
                  }}
                >
                  Kỷ niệm đôi ta
                </p>
                <h2
                  style={{
                    fontSize: 'clamp(1.6rem,5vw,2.6rem)',
                    color: textDark,
                    fontWeight: 300,
                    fontStyle: 'italic'
                  }}
                >
                  Album ảnh cưới
                </h2>
              </div>
              <div
                className='ry-scroll-anim ry-delay-1'
                style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}
              >
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
                        border: `3px solid ${parchment}`,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                      }}
                    >
                      <img
                        src={img}
                        alt=''
                        style={{
                          width: '100%',
                          height: '100%',
                          ...getImageStyle(resolveImageAdjust(mergedContent.image_positions?.[i], viewport))
                        }}
                      />
                      {isLast && extraCount > 0 && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: parchment,
                            fontSize: '1.5rem',
                            fontWeight: 600
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
        {(() => {
          const bankName = mergedContent.bank_name || ''
          const accountNumber = mergedContent.account_number || ''
          const accountName = mergedContent.account_name || ''
          const customQrImage = mergedContent.qr_image || mergedContent.qrImage || ''
          const transferNote = `Mung cuoi ${mergedContent.groom_name} ${mergedContent.bride_name}`.trim()
          const bankCode = BANK_MAP[bankName] || bankName
          const generatedQrUrl =
            bankCode && accountNumber
              ? `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.jpg?amount=0&addInfo=${encodeURIComponent(
                  transferNote
                )}&accountName=${encodeURIComponent(accountName)}`
              : ''
          const displayQrUrl = customQrImage || generatedQrUrl
          const hasGiftInfo = Boolean(displayQrUrl || accountNumber || bankName || accountName)

          if (!hasGiftInfo) return null

          return (
            <section style={{ background: navy, padding: '72px 24px' }}>
              <div className='ry-scroll-anim' style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.5em',
                    color: gold,
                    textTransform: 'uppercase',
                    fontFamily: "'Cinzel',serif",
                    marginBottom: 14
                  }}
                >
                  Hộp mừng cưới
                </p>
                <h2
                  style={{
                    fontSize: 'clamp(1.6rem,5vw,2.4rem)',
                    color: parchment,
                    fontWeight: 300,
                    fontStyle: 'italic',
                    marginBottom: 12
                  }}
                >
                  Tấm lòng của quý khách
                </h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 32, fontStyle: 'italic' }}>
                  Sự hiện diện của quý vị là món quà quý giá nhất.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div
                    className='gift-card-royal'
                    onClick={() => setShowGiftQr(true)}
                    style={{
                      width: '100%',
                      maxWidth: 320,
                      borderRadius: 12,
                      padding: '32px 24px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Decorative bits */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 8,
                        border: `1px solid ${gold}22`,
                        borderRadius: 8,
                        pointerEvents: 'none'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 60,
                        height: 60,
                        background: `radial-gradient(circle at top right, ${gold}33, transparent 70%)`
                      }}
                    />

                    <div style={{ marginBottom: 16 }}>
                      <svg width='40' height='40' viewBox='0 0 24 24' fill='none'>
                        <path
                          d='M20 12V20H4V12'
                          stroke={gold}
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <path
                          d='M22 7H2V12H22V7Z'
                          stroke={gold}
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <path
                          d='M12 20V7'
                          stroke={gold}
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <path
                          d='M12 7C12 7 12 3 9.5 3C7 3 7 7 12 7Z'
                          stroke={gold}
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <path
                          d='M12 7C12 7 12 3 14.5 3C17 3 17 7 12 7Z'
                          stroke={gold}
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </div>

                    <p
                      style={{
                        fontFamily: "'Cinzel', serif",
                        color: gold,
                        fontSize: '0.9rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        marginBottom: 6
                      }}
                    >
                      Mở Hộp Mừng Cưới
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontStyle: 'italic' }}>
                      Nhấn để gửi lời chúc và quà tặng
                    </p>
                  </div>
                </div>
              </div>

              {/* Gift Modal */}
              {showGiftQr && (
                <div
                  onClick={() => setShowGiftQr(false)}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    backgroundColor: 'rgba(15, 27, 53, 0.95)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: '100%',
                      maxWidth: 400,
                      backgroundColor: parchment,
                      borderRadius: 16,
                      border: `2px solid ${gold}`,
                      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                      padding: '30px 24px',
                      position: 'relative'
                    }}
                  >
                    <button
                      onClick={() => setShowGiftQr(false)}
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: 'none',
                        border: 'none',
                        fontSize: 24,
                        color: gold,
                        cursor: 'pointer'
                      }}
                    >
                      &times;
                    </button>

                    <p
                      style={{
                        fontFamily: "'Cinzel', serif",
                        textAlign: 'center',
                        color: navy,
                        fontSize: '1.1rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        marginBottom: 24,
                        borderBottom: `1px solid ${gold}33`,
                        paddingBottom: 12
                      }}
                    >
                      Thông tin chuyển khoản
                    </p>

                    {displayQrUrl && (
                      <div
                        style={{
                          background: '#fff',
                          padding: 12,
                          borderRadius: 12,
                          marginBottom: 24,
                          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        <img
                          src={displayQrUrl}
                          alt='QR Code'
                          style={{ width: '100%', maxWidth: 240, height: 'auto' }}
                        />
                      </div>
                    )}

                    <div style={{ display: 'grid', gap: 12, color: navy }}>
                      {bankName && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                          <span style={{ opacity: 0.6 }}>Ngân hàng:</span>
                          <span style={{ fontWeight: 600 }}>{bankName}</span>
                        </div>
                      )}
                      {accountName && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                          <span style={{ opacity: 0.6 }}>Chủ TK:</span>
                          <span style={{ fontWeight: 600 }}>{accountName}</span>
                        </div>
                      )}
                      {accountNumber && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                          <span style={{ opacity: 0.6 }}>Số TK:</span>
                          <span style={{ fontWeight: 600, letterSpacing: 1 }}>{accountNumber}</span>
                        </div>
                      )}
                      <div
                        style={{
                          marginTop: 12,
                          padding: 10,
                          background: `${gold}11`,
                          borderRadius: 8,
                          fontSize: 12,
                          lineHeight: 1.5,
                          fontStyle: 'italic',
                          color: textMid,
                          textAlign: 'center'
                        }}
                      >
                        Nội dung: {transferNote}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )
        })()}

        {/* ── GUESTBOOK ── */}
        <section style={{ background: parchmentDark, padding: '72px 24px' }}>
          <div className='ry-scroll-anim' style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.5em',
                color: gold,
                textTransform: 'uppercase',
                fontFamily: "'Cinzel',serif",
                marginBottom: 10
              }}
            >
              Sổ Lưu Bút
            </p>
            <h2
              style={{
                fontSize: 'clamp(1.6rem,5vw,2.6rem)',
                color: textDark,
                fontWeight: 300,
                fontStyle: 'italic',
                marginBottom: 28
              }}
            >
              Lời Chúc Trân Trọng
            </h2>
            <div
              className='ry-scroll-anim ry-delay-1'
              style={{
                border: `1px solid rgba(201,162,39,0.28)`,
                borderRadius: 4,
                padding: '24px 20px',
                background: parchment,
                maxHeight: 450,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}
            >
              {wishesList.length > 0 ? (
                wishesList.map((w, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '20px',
                      textAlign: 'left',
                      background: parchmentDark,
                      borderRadius: 4,
                      borderLeft: `3px solid ${gold}`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        marginBottom: 10
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Cinzel',serif",
                          fontWeight: 700,
                          color: textDark,
                          fontSize: '0.9rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                      >
                        {w.guest_name || 'Khách mời'}
                      </span>
                    </div>

                    <p
                      style={{
                        fontStyle: 'italic',
                        color: textMid,
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                        borderTop: `1px solid ${gold}11`,
                        paddingTop: 10
                      }}
                    >
                      {w.wishes ? `"${w.wishes}"` : 'Đã gửi phản hồi RSVP.'}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ color: textMid, fontStyle: 'italic' }}>Chưa có lời chúc nào.</p>
              )}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <section style={{ background: navyMid, padding: '52px 24px', textAlign: 'center' }}>
          <div
            className='ry-scroll-anim'
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 18 }}
          >
            <div
              style={{
                width: 40,
                height: 1,
                background: `linear-gradient(to right, transparent, ${gold})`,
                opacity: 0.4
              }}
            />
            <svg width='12' height='12' viewBox='0 0 12 12'>
              <path d='M6 0 L7 4 L11 4 L8 6.5 L9 10.5 L6 8 L3 10.5 L4 6.5 L1 4 L5 4 Z' fill={gold} opacity='0.5' />
            </svg>
            <div
              style={{
                width: 40,
                height: 1,
                background: `linear-gradient(to left, transparent, ${gold})`,
                opacity: 0.4
              }}
            />
          </div>
          <p style={{ fontSize: 'clamp(1.2rem,4vw,1.9rem)', fontStyle: 'italic', color: parchment, marginBottom: 8 }}>
            {mergedContent.groom_name} & {mergedContent.bride_name}
          </p>
          {mergedContent.wedding_date && (
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.4em',
                color: `rgba(201,162,39,0.45)`,
                textTransform: 'uppercase',
                fontFamily: "'Cinzel',serif"
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
              color: 'rgba(255,255,255,0.18)',
              marginTop: 28,
              textTransform: 'uppercase',
              fontFamily: "'Cinzel',serif"
            }}
          >
            Made with love · MoiMoi Studio
          </p>
        </section>
      </div>

      {/* ═════════ MUSIC PLAYER ═════════ */}
      {!showSplash && <MusicPlayer musicUrl={musicUrl} />}
    </>
  )
}
