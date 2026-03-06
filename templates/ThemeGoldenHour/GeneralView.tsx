import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'

export default function GoldenHourGeneralView({ wedding }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null)

  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }

  const amber = mergedContent.primary_color || '#c96a2a'
  const amberLight = '#e8925a'
  const gold = '#f0c060'
  const peach = '#fde8d4'
  const cream = '#fff8f0'
  const creamDark = '#fdecd8'
  const textDark = '#2a1400'
  const textMid = '#8b4c20'

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: cream }}>
      <h1 style={{ color: amber, fontFamily: "'Libre Baskerville', serif" }}>Không tìm thấy thiệp cưới</h1>
    </div>
  )

  const albumImages: string[] = mergedContent.images?.length > 0 ? mergedContent.images : []

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes ghFade { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
          @keyframes ghOrb { 0%,100%{transform:translate(0,0) scale(1);opacity:0.15} 50%{transform:translate(8px,-12px) scale(1.15);opacity:0.25} }
          @keyframes ghZoom { from{transform:scale(1)} to{transform:scale(1.07)} }
          @keyframes ghGlow { 0%,100%{text-shadow:0 0 30px rgba(240,192,96,0.3)} 50%{text-shadow:0 0 60px rgba(240,192,96,0.6)} }
          .gh-up{animation:ghFade 0.9s ease forwards;opacity:0}
          .gh-d1{animation-delay:.25s} .gh-d2{animation-delay:.5s} .gh-d3{animation-delay:.75s} .gh-d4{animation-delay:1s}
          .gh-zoom{animation:ghZoom 14s ease-in-out infinite alternate}
          .gh-orb{animation:ghOrb 6s ease-in-out infinite}
          .gh-glow{animation:ghGlow 3s ease-in-out infinite}
          .gh-up.gh-glow.gh-d2{animation:ghFade .9s .5s ease forwards, ghGlow 3s 1.4s ease-in-out infinite}
          .gh-up.gh-glow.gh-d3{animation:ghFade .9s .75s ease forwards, ghGlow 3s 1.65s ease-in-out infinite}
          *{box-sizing:border-box;margin:0;padding:0}
        `}</style>
      </Head>
      <div style={{ background: cream, fontFamily: "'Lato', sans-serif", color: textDark, overflowX: 'hidden' }}>

        {/* ── HERO ── */}
        <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', textAlign: 'center' }}>
          {mergedContent.cover_image ? (
            <div className="gh-zoom" style={{ position: 'absolute', inset: 0, backgroundImage: `url(${mergedContent.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.5) saturate(0.8) sepia(0.25)' }} />
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, #4a1800 0%, ${amber} 45%, ${gold} 100%)` }} />
          )}
          {/* Sunset gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, rgba(42,20,0,0.3) 0%, rgba(42,20,0,0.1) 30%, rgba(201,106,42,0.35) 65%, rgba(42,20,0,0.85) 100%)` }} />

          {/* Bokeh orbs */}
          {[{ top: '15%', left: '10%', size: 80, delay: '0s' }, { top: '25%', right: '8%', size: 120, delay: '2s' }, { top: '40%', left: '5%', size: 60, delay: '4s' }].map((orb, i) => (
            <div key={i} className="gh-orb" style={{ position: 'absolute', top: orb.top, left: (orb as any).left, right: (orb as any).right, width: orb.size, height: orb.size, borderRadius: '50%', background: `radial-gradient(circle, ${gold} 0%, transparent 70%)`, animationDelay: orb.delay, pointerEvents: 'none' }} />
          ))}

          <div style={{ position: 'relative', zIndex: 2, padding: '60px 28px' }}>
            {/* Sun ray ornament */}
            <div className="gh-up gh-d1" style={{ marginBottom: 24 }}>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => (
                  <line key={a} x1={28 + 18 * Math.cos(a * Math.PI / 180)} y1={28 + 18 * Math.sin(a * Math.PI / 180)} x2={28 + 26 * Math.cos(a * Math.PI / 180)} y2={28 + 26 * Math.sin(a * Math.PI / 180)} stroke={gold} strokeWidth="0.8" opacity="0.5" />
                ))}
                <circle cx="28" cy="28" r="10" fill="none" stroke={gold} strokeWidth="0.7" opacity="0.6" />
                <circle cx="28" cy="28" r="4" fill={gold} opacity="0.7" />
              </svg>
            </div>
            <p className="gh-up gh-d1" style={{ fontSize: 9, letterSpacing: '0.5em', color: 'rgba(240,192,96,0.75)', textTransform: 'uppercase', marginBottom: 20 }}>The Wedding of</p>
            <h1 className="gh-up gh-glow gh-d2" style={{ fontSize: 'clamp(2.8rem,11vw,7rem)', fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontWeight: 400, color: '#fff', lineHeight: 1, marginBottom: 10 }}>
              {mergedContent.groom_name || 'Chú Rể'}
            </h1>
            <div className="gh-up gh-d2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '18px 0' }}>
              <div style={{ width: 40, height: 1, background: `linear-gradient(to right, transparent, ${gold})`, opacity: 0.5 }} />
              <p style={{ fontSize: 12, letterSpacing: '0.4em', color: gold, fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic' }}>and</p>
              <div style={{ width: 40, height: 1, background: `linear-gradient(to left, transparent, ${gold})`, opacity: 0.5 }} />
            </div>
            <h1 className="gh-up gh-glow gh-d3" style={{ fontSize: 'clamp(2.8rem,11vw,7rem)', fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontWeight: 400, color: '#fff', lineHeight: 1, marginBottom: 30 }}>
              {mergedContent.bride_name || 'Cô Dâu'}
            </h1>
            {mergedContent.wedding_date && (
              <p className="gh-up gh-d4" style={{ fontSize: 13, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', fontFamily: "'Libre Baskerville', serif" }}>
                {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>
        </section>

        {/* ── COUNTDOWN ── */}
        {timeRemaining && (
          <section style={{ background: `linear-gradient(135deg, ${amber}, ${amberLight})`, padding: '60px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: 9, letterSpacing: '0.45em', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: 28 }}>Đếm ngược đến hoàng hôn yêu dấu</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, maxWidth: 360, margin: '0 auto' }}>
              {[{ v: timeRemaining.days, l: 'Ngày' }, { v: timeRemaining.hours, l: 'Giờ' }, { v: timeRemaining.minutes, l: 'Phút' }, { v: timeRemaining.seconds, l: 'Giây' }].map((it, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 8, padding: '14px 6px', marginBottom: 8, backdropFilter: 'blur(4px)' }}>
                    <span style={{ display: 'block', fontSize: 'clamp(1.8rem,6vw,3rem)', fontFamily: "'Libre Baskerville', serif", color: '#fff', lineHeight: 1 }}>{String(it.v).padStart(2, '0')}</span>
                  </div>
                  <p style={{ fontSize: 9, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase' }}>{it.l}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── STORY ── */}
        <section style={{ background: cream, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ width: 56, height: 2, background: `linear-gradient(to right, transparent, ${amber}, transparent)`, margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: 'clamp(1.8rem,6vw,2.8rem)', fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', color: textDark, marginBottom: 20 }}>
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: textMid }}>
              {mergedContent.intro_text || 'Như ánh hoàng hôn làm bầu trời bừng sáng, tình yêu của chúng tôi sưởi ấm mọi khoảnh khắc. Chúng tôi trân trọng mời bạn cùng chia sẻ khoảnh khắc diệu kỳ này.'}
            </p>
          </div>
        </section>

        {/* ── EVENT DETAILS ── */}
        <section style={{ background: creamDark, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p style={{ fontSize: 9, letterSpacing: '0.5em', color: amber, textTransform: 'uppercase', marginBottom: 10 }}>Ngày trọng đại</p>
              <h2 style={{ fontSize: 'clamp(1.6rem,5vw,2.6rem)', fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', color: textDark }}>Lễ thành hôn</h2>
            </div>
            {[
              { label: 'Ngày cưới', value: mergedContent.event_date || mergedContent.wedding_date },
              { label: 'Giờ lễ', value: mergedContent.wedding_time },
              { label: 'Địa điểm', value: mergedContent.address },
              { label: 'Lịch âm', value: mergedContent.lunar_date }
            ].filter(it => it.value).map((it, i) => (
              <div key={i} style={{ padding: '16px 0', borderBottom: `1px solid rgba(201,106,42,0.12)` }}>
                <p style={{ fontSize: 9, letterSpacing: '0.3em', color: amber, textTransform: 'uppercase', marginBottom: 4 }}>{it.label}</p>
                <p style={{ fontSize: 15, color: textDark, lineHeight: 1.5 }}>{it.value}</p>
              </div>
            ))}
            {mergedContent.map_url && (
              <a href={mergedContent.map_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 28, padding: '12px 32px', background: `linear-gradient(135deg, ${amber}, ${amberLight})`, color: '#fff', textDecoration: 'none', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', borderRadius: 24 }}>
                Xem bản đồ
              </a>
            )}
          </div>
        </section>

        {/* ── ALBUM ── */}
        {albumImages.length > 0 && (
          <section style={{ background: cream, padding: '72px 24px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <p style={{ fontSize: 9, letterSpacing: '0.4em', color: amber, textTransform: 'uppercase', marginBottom: 8 }}>Khoảnh khắc</p>
                <h2 style={{ fontSize: 'clamp(1.6rem,5vw,2.6rem)', fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', color: textDark }}>Album ảnh cưới</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {albumImages.slice(0, 4).map((img: string, i: number) => (
                  <div key={i} style={{ aspectRatio: '1', overflow: 'hidden', borderRadius: 8, boxShadow: `0 8px 24px rgba(201,106,42,0.2)` }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.12) saturate(1.1)' }} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── GIFT ── */}
        {(mergedContent.bank_name || mergedContent.account_number) && (
          <section style={{ background: `linear-gradient(135deg, ${amber}22, ${gold}18)`, padding: '72px 24px' }}>
            <div style={{ maxWidth: 420, margin: '0 auto', textAlign: 'center' }}>
              <p style={{ fontSize: 9, letterSpacing: '0.4em', color: amber, textTransform: 'uppercase', marginBottom: 14 }}>Hộp mừng cưới</p>
              <h2 style={{ fontSize: 'clamp(1.6rem,5vw,2.4rem)', fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', color: textDark, marginBottom: 8 }}>Tấm lòng quý khách</h2>
              <div style={{ border: `1px solid rgba(201,106,42,0.22)`, borderRadius: 12, padding: '28px 20px', background: 'rgba(255,248,240,0.8)', marginTop: 24 }}>
                {mergedContent.account_name && <p style={{ fontSize: 18, fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', color: amber, marginBottom: 8 }}>{mergedContent.account_name}</p>}
                {mergedContent.bank_name && <p style={{ fontSize: 10, letterSpacing: '0.25em', color: textMid, textTransform: 'uppercase', marginBottom: 6 }}>{mergedContent.bank_name}</p>}
                {mergedContent.account_number && <p style={{ fontSize: 22, color: textDark, letterSpacing: '0.1em', fontFamily: "'Libre Baskerville', serif" }}>{mergedContent.account_number}</p>}
              </div>
            </div>
          </section>
        )}

        {/* ── FOOTER ── */}
        <section style={{ background: `linear-gradient(135deg, ${amber}, ${amberLight})`, padding: '52px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 'clamp(1.2rem,4vw,2rem)', fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', color: '#fff', marginBottom: 8 }}>{mergedContent.groom_name} & {mergedContent.bride_name}</p>
          {mergedContent.wedding_date && (
            <p style={{ fontSize: 9, letterSpacing: '0.35em', color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase' }}>
              {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
          <p style={{ fontSize: 8, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', marginTop: 24, textTransform: 'uppercase' }}>Made with love · MoiMoi Studio</p>
        </section>
      </div>
    </>
  )
}
