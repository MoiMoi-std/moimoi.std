import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'

export default function RoyalGeneralView({ wedding }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null)

  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }

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

  if (!wedding) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: navy }}>
      <h1 style={{ color: gold, fontFamily: "'Cormorant Garamond', serif" }}>Không tìm thấy thiệp cưới</h1>
    </div>
  )

  const albumImages: string[] = mergedContent.images?.length > 0 ? mergedContent.images : []

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Cinzel:wght@400;500&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes royalShimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
          @keyframes royalFadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
          @keyframes royalZoom { from{transform:scale(1)} to{transform:scale(1.06)} }
          .ry-up{animation:royalFadeUp 1s ease forwards;opacity:0}
          .ry-d1{animation-delay:.3s} .ry-d2{animation-delay:.6s} .ry-d3{animation-delay:.9s} .ry-d4{animation-delay:1.2s}
          .ry-shimmer{background:linear-gradient(90deg,${gold} 0%,${goldLight} 35%,#fffbe8 50%,${goldLight} 65%,${gold} 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:royalShimmer 4s linear infinite}
          .ry-up.ry-shimmer.ry-d2{animation:royalFadeUp 1s .6s ease forwards, royalShimmer 4s 1.6s linear infinite}
          .ry-up.ry-shimmer.ry-d3{animation:royalFadeUp 1s .9s ease forwards, royalShimmer 4s 1.9s linear infinite}
          .ry-zoom{animation:royalZoom 14s ease-in-out infinite alternate}
          *{box-sizing:border-box;margin:0;padding:0}
        `}</style>
      </Head>
      <div style={{ background: parchment, fontFamily: "'Cormorant Garamond', Georgia, serif", color: textDark, overflowX: 'hidden' }}>

        {/* ── HERO ── */}
        <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: navy, overflow: 'hidden' }}>
          {mergedContent.cover_image && (
            <div className="ry-zoom" style={{ position: 'absolute', inset: 0, backgroundImage: `url(${mergedContent.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.38) saturate(0.6)' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,27,53,0.55) 0%, rgba(15,27,53,0.25) 45%, rgba(15,27,53,0.88) 85%, rgba(15,27,53,0.98) 100%)' }} />

          {/* Top bar */}
          <div style={{ position: 'relative', zIndex: 10, padding: '26px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 8, letterSpacing: '0.6em', color: `rgba(201,162,39,0.65)`, textTransform: 'uppercase', fontFamily: "'Cinzel',serif" }}>Wedding Invitation</p>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 2 L18.5 9 L26 9 L20 13.5 L22 21 L16 16.5 L10 21 L12 13.5 L6 9 L13.5 9 Z" fill={`rgba(201,162,39,0.7)`} />
              <circle cx="16" cy="28" r="2" fill="none" stroke={`rgba(201,162,39,0.4)`} strokeWidth="0.8" />
            </svg>
            <p style={{ fontSize: 8, letterSpacing: '0.6em', color: `rgba(201,162,39,0.65)`, textTransform: 'uppercase', fontFamily: "'Cinzel',serif" }}>MoiMoi</p>
          </div>

          {/* Center names */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, padding: '40px 32px', textAlign: 'center' }}>
            <div className="ry-up ry-d1" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <div style={{ width: 48, height: 1, background: `linear-gradient(to right, transparent, ${gold})` }} />
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 0 L8.2 4.5 L13 4.5 L9.2 7.3 L10.5 12 L7 9.2 L3.5 12 L4.8 7.3 L1 4.5 L5.8 4.5 Z" fill={gold} opacity="0.7" /></svg>
              <div style={{ width: 48, height: 1, background: `linear-gradient(to left, transparent, ${gold})` }} />
            </div>
            <p className="ry-up ry-d1" style={{ fontSize: 9, letterSpacing: '0.55em', color: gold, textTransform: 'uppercase', fontFamily: "'Cinzel',serif", marginBottom: 20 }}>The Wedding of</p>
            <h1 className="ry-up ry-shimmer ry-d2" style={{ fontSize: 'clamp(3rem,12vw,7rem)', fontWeight: 300, fontStyle: 'italic', lineHeight: 0.95, letterSpacing: '0.02em', marginBottom: 10 }}>
              {mergedContent.groom_name || 'Chú Rể'}
            </h1>
            <div className="ry-up ry-d2" style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '16px 0' }}>
              <div style={{ width: 36, height: 1, background: `linear-gradient(to right, transparent, ${gold})` }} />
              <svg width="28" height="14" viewBox="0 0 28 14">
                <circle cx="14" cy="7" r="4" fill="none" stroke={gold} strokeWidth="0.7" />
                <line x1="0" y1="7" x2="8" y2="7" stroke={gold} strokeWidth="0.7" />
                <line x1="20" y1="7" x2="28" y2="7" stroke={gold} strokeWidth="0.7" />
              </svg>
              <p style={{ fontSize: 10, letterSpacing: '0.4em', color: gold, fontFamily: "'Cinzel',serif" }}>AND</p>
              <svg width="28" height="14" viewBox="0 0 28 14">
                <circle cx="14" cy="7" r="4" fill="none" stroke={gold} strokeWidth="0.7" />
                <line x1="0" y1="7" x2="8" y2="7" stroke={gold} strokeWidth="0.7" />
                <line x1="20" y1="7" x2="28" y2="7" stroke={gold} strokeWidth="0.7" />
              </svg>
              <div style={{ width: 36, height: 1, background: `linear-gradient(to left, transparent, ${gold})` }} />
            </div>
            <h1 className="ry-up ry-shimmer ry-d3" style={{ fontSize: 'clamp(3rem,12vw,7rem)', fontWeight: 300, fontStyle: 'italic', lineHeight: 0.95, letterSpacing: '0.02em', marginBottom: 28 }}>
              {mergedContent.bride_name || 'Cô Dâu'}
            </h1>
            <div className="ry-up ry-d3" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <div style={{ width: 36, height: 1, background: `linear-gradient(to right, transparent, ${gold})` }} />
              <div style={{ width: 5, height: 5, border: `1px solid ${gold}`, transform: 'rotate(45deg)', opacity: 0.6 }} />
              <div style={{ width: 36, height: 1, background: `linear-gradient(to left, transparent, ${gold})` }} />
            </div>
            {mergedContent.wedding_date && (
              <p className="ry-up ry-d4" style={{ fontSize: 13, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.65)', fontStyle: 'italic' }}>
                {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', paddingBottom: 28 }}>
            <p style={{ fontSize: 7, letterSpacing: '0.5em', color: `rgba(201,162,39,0.45)`, fontFamily: "'Cinzel',serif", textTransform: 'uppercase' }}>Scroll</p>
          </div>
        </section>

        {/* ── COUNTDOWN ── */}
        {timeRemaining && (
          <section style={{ background: navyMid, padding: '60px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: 9, letterSpacing: '0.55em', color: gold, textTransform: 'uppercase', fontFamily: "'Cinzel',serif", marginBottom: 32 }}>Đếm ngược đến ngày đặc biệt</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, maxWidth: 360, margin: '0 auto' }}>
              {[{ v: timeRemaining.days, l: 'Ngày' }, { v: timeRemaining.hours, l: 'Giờ' }, { v: timeRemaining.minutes, l: 'Phút' }, { v: timeRemaining.seconds, l: 'Giây' }].map((it, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ background: 'rgba(201,162,39,0.07)', border: `1px solid rgba(201,162,39,0.22)`, padding: '14px 8px', marginBottom: 8 }}>
                    <span style={{ display: 'block', fontSize: 'clamp(1.8rem,7vw,3.2rem)', fontFamily: "'Cinzel',serif", color: gold, lineHeight: 1 }}>{String(it.v).padStart(2, '0')}</span>
                  </div>
                  <p style={{ fontSize: 8, letterSpacing: '0.3em', color: `rgba(201,162,39,0.55)`, textTransform: 'uppercase', fontFamily: "'Cinzel',serif" }}>{it.l}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── COUPLE STORY ── */}
        <section style={{ background: parchmentDark, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ width: 32, height: 1, background: gold, opacity: 0.4 }} />
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 0 L8.2 4.5 L13 4.5 L9.2 7.3 L10.5 12 L7 9.2 L3.5 12 L4.8 7.3 L1 4.5 L5.8 4.5 Z" fill={gold} opacity="0.55" /></svg>
              <div style={{ width: 32, height: 1, background: gold, opacity: 0.4 }} />
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem,6vw,3rem)', fontWeight: 400, fontStyle: 'italic', color: textDark, marginBottom: 20 }}>
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: textMid, fontStyle: 'italic' }}>
              {mergedContent.intro_text || 'Với trái tim tràn đầy hạnh phúc, chúng tôi trân trọng kính mời quý vị đến chung vui trong ngày trọng đại nhất cuộc đời chúng tôi.'}
            </p>
          </div>
        </section>

        {/* ── EVENT DETAILS ── */}
        <section style={{ background: navy, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <p style={{ fontSize: 9, letterSpacing: '0.5em', color: gold, textTransform: 'uppercase', fontFamily: "'Cinzel',serif", marginBottom: 10 }}>Thông tin lễ cưới</p>
              <h2 style={{ fontSize: 'clamp(1.6rem,5vw,2.6rem)', color: parchment, fontWeight: 300, fontStyle: 'italic' }}>Lễ thành hôn</h2>
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
            ].filter(it => it.value).map((it, i) => (
              <div key={i} style={{ padding: '16px 0', borderBottom: `1px solid rgba(201,162,39,0.12)` }}>
                <p style={{ fontSize: 8, letterSpacing: '0.35em', color: gold, textTransform: 'uppercase', fontFamily: "'Cinzel',serif", marginBottom: 5 }}>{it.label}</p>
                <p style={{ fontSize: 15, color: parchment, lineHeight: 1.5 }}>{it.value}</p>
              </div>
            ))}
            {mergedContent.map_url && (
              <a href={mergedContent.map_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: 28, padding: '13px 24px', border: `1px solid ${gold}`, color: gold, textAlign: 'center', textDecoration: 'none', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: "'Cinzel',serif" }}>
                Xem bản đồ
              </a>
            )}
          </div>
        </section>

        {/* ── ALBUM ── */}
        {albumImages.length > 0 && (
          <section style={{ background: parchmentDark, padding: '72px 24px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <p style={{ fontSize: 9, letterSpacing: '0.5em', color: gold, textTransform: 'uppercase', fontFamily: "'Cinzel',serif", marginBottom: 10 }}>Kỷ niệm đôi ta</p>
                <h2 style={{ fontSize: 'clamp(1.6rem,5vw,2.6rem)', color: textDark, fontWeight: 300, fontStyle: 'italic' }}>Album ảnh cưới</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                {albumImages.slice(0, 4).map((img: string, i: number) => (
                  <div key={i} style={{ aspectRatio: '3/4', overflow: 'hidden', border: `3px solid ${parchment}`, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── GIFT ── */}
        {(mergedContent.bank_name || mergedContent.account_number) && (
          <section style={{ background: navy, padding: '72px 24px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
              <p style={{ fontSize: 9, letterSpacing: '0.5em', color: gold, textTransform: 'uppercase', fontFamily: "'Cinzel',serif", marginBottom: 14 }}>Hộp mừng cưới</p>
              <h2 style={{ fontSize: 'clamp(1.6rem,5vw,2.4rem)', color: parchment, fontWeight: 300, fontStyle: 'italic', marginBottom: 8 }}>Tấm lòng của quý khách</h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 32, fontStyle: 'italic' }}>Sự hiện diện của quý vị là món quà quý giá nhất.</p>
              <div style={{ border: `1px solid rgba(201,162,39,0.28)`, padding: '28px 24px', background: 'rgba(201,162,39,0.04)' }}>
                {mergedContent.account_name && <p style={{ fontSize: 17, color: gold, fontStyle: 'italic', marginBottom: 8 }}>{mergedContent.account_name}</p>}
                {mergedContent.bank_name && <p style={{ fontSize: 10, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: 6, fontFamily: "'Cinzel',serif" }}>{mergedContent.bank_name}</p>}
                {mergedContent.account_number && <p style={{ fontSize: 22, color: parchment, letterSpacing: '0.12em', fontFamily: "'Cinzel',serif" }}>{mergedContent.account_number}</p>}
              </div>
            </div>
          </section>
        )}

        {/* ── FOOTER ── */}
        <section style={{ background: navyMid, padding: '52px 24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 40, height: 1, background: `linear-gradient(to right, transparent, ${gold})`, opacity: 0.4 }} />
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 0 L7 4 L11 4 L8 6.5 L9 10.5 L6 8 L3 10.5 L4 6.5 L1 4 L5 4 Z" fill={gold} opacity="0.5" /></svg>
            <div style={{ width: 40, height: 1, background: `linear-gradient(to left, transparent, ${gold})`, opacity: 0.4 }} />
          </div>
          <p style={{ fontSize: 'clamp(1.2rem,4vw,1.9rem)', fontStyle: 'italic', color: parchment, marginBottom: 8 }}>{mergedContent.groom_name} & {mergedContent.bride_name}</p>
          {mergedContent.wedding_date && (
            <p style={{ fontSize: 9, letterSpacing: '0.4em', color: `rgba(201,162,39,0.45)`, textTransform: 'uppercase', fontFamily: "'Cinzel',serif" }}>
              {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
          <p style={{ fontSize: 8, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.18)', marginTop: 28, textTransform: 'uppercase', fontFamily: "'Cinzel',serif" }}>Made with love · MoiMoi Studio</p>
        </section>
      </div>
    </>
  )
}
