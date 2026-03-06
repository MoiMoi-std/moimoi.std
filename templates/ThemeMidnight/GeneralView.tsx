import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'

export default function MidnightGeneralView({ wedding }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null)
  const [stars] = useState(() => Array.from({ length: 60 }, (_, i) => ({
    x: (i * 37 + 11) % 100,
    y: (i * 53 + 7) % 70,
    size: (i % 3) + 1,
    delay: (i * 0.3) % 4
  })))

  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }

  const midnight = '#06071a'
  const deepBlue = '#0d1130'
  const wine = mergedContent.primary_color || '#7a1a3c'
  const wineLight = '#c04070'
  const candle = '#f0d090'
  const candleLight = '#fff8e8'
  const textLight = '#e8e0f8'
  const textMid = '#9088b8'

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

  if (!wedding) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: midnight }}>
      <h1 style={{ color: candle, fontFamily: "'Playfair Display', serif" }}>Không tìm thấy thiệp cưới</h1>
    </div>
  )

  const albumImages: string[] = mergedContent.images?.length > 0 ? mergedContent.images : []

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Montserrat:wght@300;400&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes mnFade { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
          @keyframes mnTwinkle { 0%,100%{opacity:0.2;transform:scale(1)} 50%{opacity:0.9;transform:scale(1.3)} }
          @keyframes mnZoom { from{transform:scale(1)} to{transform:scale(1.05)} }
          @keyframes mnCandleGlow { 0%,100%{text-shadow:0 0 20px rgba(240,208,144,0.3)} 50%{text-shadow:0 0 50px rgba(240,208,144,0.7),0 0 80px rgba(122,26,60,0.4)} }
          .mn-up{animation:mnFade 1s ease forwards;opacity:0}
          .mn-d1{animation-delay:.3s} .mn-d2{animation-delay:.6s} .mn-d3{animation-delay:.9s} .mn-d4{animation-delay:1.2s}
          .mn-zoom{animation:mnZoom 14s ease-in-out infinite alternate}
          .mn-glow{animation:mnCandleGlow 3s ease-in-out infinite}
          .mn-up.mn-glow.mn-d2{animation:mnFade 1s .6s ease forwards, mnCandleGlow 3s 1.6s ease-in-out infinite}
          .mn-up.mn-glow.mn-d3{animation:mnFade 1s .9s ease forwards, mnCandleGlow 3s 1.9s ease-in-out infinite}
          *{box-sizing:border-box;margin:0;padding:0}
        `}</style>
      </Head>
      <div style={{ background: midnight, fontFamily: "'Montserrat', sans-serif", color: textLight, overflowX: 'hidden' }}>

        {/* ── HERO ── */}
        <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', textAlign: 'center' }}>
          {mergedContent.cover_image && (
            <div className="mn-zoom" style={{ position: 'absolute', inset: 0, backgroundImage: `url(${mergedContent.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.3) saturate(0.5) hue-rotate(200deg)' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, rgba(6,7,26,0.55) 0%, rgba(6,7,26,0.2) 30%, rgba(122,26,60,0.18) 55%, rgba(6,7,26,0.88) 85%, rgba(6,7,26,0.97) 100%)` }} />

          {/* Twinkling stars */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
            {stars.map((star, i) => (
              <div key={i} style={{ position: 'absolute', left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size, borderRadius: '50%', background: '#fff', animation: `mnTwinkle ${1.5 + star.delay}s ${star.delay}s ease-in-out infinite`, opacity: 0.3 }} />
            ))}
          </div>

          {/* Moon */}
          <div style={{ position: 'absolute', top: '8%', right: '12%', zIndex: 1, opacity: 0.25 }}>
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="18" fill={candle} />
              <circle cx="30" cy="20" r="14" fill={midnight} />
            </svg>
          </div>

          <div style={{ position: 'relative', zIndex: 2, padding: '60px 28px' }}>
            <div className="mn-up mn-d1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 22 }}>
              <div style={{ width: 36, height: 1, background: `rgba(240,208,144,0.3)` }} />
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M8 1 C5 1 2 4 3.5 8 C5 12 8 15 8 15 C8 15 11 12 12.5 8 C14 4 11 1 8 1 Z" fill={candle} opacity="0.5" />
              </svg>
              <div style={{ width: 36, height: 1, background: `rgba(240,208,144,0.3)` }} />
            </div>
            <p className="mn-up mn-d1" style={{ fontSize: 9, letterSpacing: '0.55em', color: `rgba(240,208,144,0.65)`, textTransform: 'uppercase', marginBottom: 20 }}>Under the stars</p>
            <h1 className="mn-up mn-glow mn-d2" style={{ fontSize: 'clamp(2.8rem,11vw,7rem)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 400, color: candleLight, lineHeight: 0.95, marginBottom: 10 }}>
              {mergedContent.groom_name || 'Chú Rể'}
            </h1>
            <div className="mn-up mn-d2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '18px 0' }}>
              <div style={{ width: 32, height: 1, background: `rgba(192,64,112,0.5)` }} />
              <svg width="14" height="14" viewBox="0 0 14 14">
                <path d="M7 1 L13 7 L7 13 L1 7 Z" fill="none" stroke={wineLight} strokeWidth="0.8" opacity="0.7" />
                <circle cx="7" cy="7" r="2" fill={wineLight} opacity="0.7" />
              </svg>
              <div style={{ width: 32, height: 1, background: `rgba(192,64,112,0.5)` }} />
            </div>
            <h1 className="mn-up mn-glow mn-d3" style={{ fontSize: 'clamp(2.8rem,11vw,7rem)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 400, color: candleLight, lineHeight: 0.95, marginBottom: 30 }}>
              {mergedContent.bride_name || 'Cô Dâu'}
            </h1>
            {mergedContent.wedding_date && (
              <p className="mn-up mn-d4" style={{ fontSize: 13, letterSpacing: '0.15em', color: `rgba(240,208,144,0.65)`, fontStyle: 'italic', fontFamily: "'Playfair Display', serif" }}>
                {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>
        </section>

        {/* ── COUNTDOWN ── */}
        {timeRemaining && (
          <section style={{ background: deepBlue, padding: '60px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: 9, letterSpacing: '0.5em', color: candle, textTransform: 'uppercase', marginBottom: 28 }}>Đếm ngược đến đêm huyền diệu</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, maxWidth: 360, margin: '0 auto' }}>
              {[{ v: timeRemaining.days, l: 'Ngày' }, { v: timeRemaining.hours, l: 'Giờ' }, { v: timeRemaining.minutes, l: 'Phút' }, { v: timeRemaining.seconds, l: 'Giây' }].map((it, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ background: `rgba(122,26,60,0.2)`, border: `1px solid rgba(122,26,60,0.35)`, borderRadius: 8, padding: '14px 6px', marginBottom: 8, boxShadow: `0 0 16px rgba(122,26,60,0.15)` }}>
                    <span style={{ display: 'block', fontSize: 'clamp(1.8rem,6vw,3rem)', fontFamily: "'Playfair Display', serif", color: candle, lineHeight: 1 }}>{String(it.v).padStart(2, '0')}</span>
                  </div>
                  <p style={{ fontSize: 9, letterSpacing: '0.25em', color: textMid, textTransform: 'uppercase' }}>{it.l}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── STORY ── */}
        <section style={{ background: midnight, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 22 }}>
              <div style={{ width: 28, height: 1, background: `rgba(240,208,144,0.25)` }} />
              <div style={{ width: 5, height: 5, background: candle, borderRadius: '50%', opacity: 0.5 }} />
              <div style={{ width: 28, height: 1, background: `rgba(240,208,144,0.25)` }} />
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem,6vw,3rem)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: candleLight, marginBottom: 20 }}>
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.9, color: textMid }}>
              {mergedContent.intro_text || 'Dưới bầu trời đêm lấp lánh ngàn sao, chúng tôi hứa hẹn với nhau điều mãi mãi. Hãy cùng chúng tôi kỷ niệm khoảnh khắc huyền diệu nhất trong cuộc đời.'}
            </p>
          </div>
        </section>

        {/* ── EVENT DETAILS ── */}
        <section style={{ background: deepBlue, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p style={{ fontSize: 9, letterSpacing: '0.5em', color: candle, textTransform: 'uppercase', marginBottom: 10 }}>Đêm lễ cưới</p>
              <h2 style={{ fontSize: 'clamp(1.6rem,5vw,2.6rem)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: textLight }}>Lễ thành hôn</h2>
            </div>
            {[
              { label: 'Ngày cưới', value: mergedContent.event_date || mergedContent.wedding_date },
              { label: 'Giờ lễ', value: mergedContent.wedding_time },
              { label: 'Địa điểm', value: mergedContent.address },
              { label: 'Lịch âm', value: mergedContent.lunar_date }
            ].filter(it => it.value).map((it, i) => (
              <div key={i} style={{ padding: '16px 0', borderBottom: `1px solid rgba(122,26,60,0.18)` }}>
                <p style={{ fontSize: 9, letterSpacing: '0.35em', color: wineLight, textTransform: 'uppercase', marginBottom: 4 }}>{it.label}</p>
                <p style={{ fontSize: 15, color: textLight, lineHeight: 1.5 }}>{it.value}</p>
              </div>
            ))}
            {mergedContent.map_url && (
              <a href={mergedContent.map_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 28, padding: '12px 32px', border: `1px solid rgba(122,26,60,0.5)`, color: wineLight, textDecoration: 'none', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', borderRadius: 4 }}>
                Xem bản đồ
              </a>
            )}
          </div>
        </section>

        {/* ── ALBUM ── */}
        {albumImages.length > 0 && (
          <section style={{ background: midnight, padding: '72px 24px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <p style={{ fontSize: 9, letterSpacing: '0.4em', color: candle, textTransform: 'uppercase', marginBottom: 8 }}>Kỷ niệm</p>
                <h2 style={{ fontSize: 'clamp(1.6rem,5vw,2.6rem)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: textLight }}>Album ảnh cưới</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                {albumImages.slice(0, 4).map((img: string, i: number) => (
                  <div key={i} style={{ aspectRatio: '3/4', overflow: 'hidden', border: `1px solid rgba(122,26,60,0.25)`, boxShadow: `0 8px 32px rgba(0,0,0,0.5)` }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9) saturate(0.85) contrast(1.05)' }} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── GIFT ── */}
        {(mergedContent.bank_name || mergedContent.account_number) && (
          <section style={{ background: deepBlue, padding: '72px 24px' }}>
            <div style={{ maxWidth: 420, margin: '0 auto', textAlign: 'center' }}>
              <p style={{ fontSize: 9, letterSpacing: '0.45em', color: candle, textTransform: 'uppercase', marginBottom: 14 }}>Hộp mừng cưới</p>
              <h2 style={{ fontSize: 'clamp(1.6rem,5vw,2.4rem)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: textLight, marginBottom: 28 }}>Tấm lòng quý khách</h2>
              <div style={{ border: `1px solid rgba(122,26,60,0.3)`, borderRadius: 8, padding: '28px 20px', background: 'rgba(122,26,60,0.06)' }}>
                {mergedContent.account_name && <p style={{ fontSize: 18, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: candle, marginBottom: 8 }}>{mergedContent.account_name}</p>}
                {mergedContent.bank_name && <p style={{ fontSize: 10, letterSpacing: '0.25em', color: textMid, textTransform: 'uppercase', marginBottom: 6 }}>{mergedContent.bank_name}</p>}
                {mergedContent.account_number && <p style={{ fontSize: 22, color: textLight, letterSpacing: '0.1em' }}>{mergedContent.account_number}</p>}
              </div>
            </div>
          </section>
        )}

        {/* ── FOOTER ── */}
        <section style={{ background: midnight, borderTop: `1px solid rgba(122,26,60,0.2)`, padding: '52px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 'clamp(1.2rem,4vw,2rem)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: candleLight, marginBottom: 8 }}>{mergedContent.groom_name} & {mergedContent.bride_name}</p>
          {mergedContent.wedding_date && (
            <p style={{ fontSize: 9, letterSpacing: '0.35em', color: `rgba(240,208,144,0.4)`, textTransform: 'uppercase' }}>
              {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
          <p style={{ fontSize: 8, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.15)', marginTop: 28, textTransform: 'uppercase' }}>Made with love · MoiMoi Studio</p>
        </section>
      </div>
    </>
  )
}
