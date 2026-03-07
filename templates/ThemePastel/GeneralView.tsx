import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'

export default function PastelGeneralView({ wedding }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [tick, setTick] = useState(0)

  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }

  const blush = '#f7c5d0'
  const sky = '#c0d8f4'
  const mint = '#baf0d8'
  const lavender = '#d8c0f4'
  const peach = '#f9d8a0'
  const white = '#fdfaff'
  const softWhite = '#f5f0fa'
  const accent1 = mergedContent.primary_color || '#e890b0'
  const accent2 = '#70a8e0'
  const textDark = '#2a1a30'
  const textMid = '#7060a0'

  const bubbles = [
    { x: 10, y: 12, r: 40, color: blush, delay: 0 },
    { x: 80, y: 8, r: 60, color: sky, delay: 1 },
    { x: 50, y: 60, r: 50, color: lavender, delay: 0.5 },
    { x: 20, y: 72, r: 45, color: mint, delay: 1.5 },
    { x: 85, y: 65, r: 55, color: peach, delay: 0.8 }
  ]

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

  useEffect(() => {
    const a = setInterval(() => setTick((t) => t + 1), 3000)
    return () => clearInterval(a)
  }, [])

  if (!wedding)
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: white
        }}
      >
        <h1 style={{ color: accent1, fontFamily: "'Dancing Script', cursive" }}>Không tìm thấy thiệp cưới</h1>
      </div>
    )

  const albumImages: string[] = mergedContent.images?.length > 0 ? mergedContent.images : []

  return (
    <>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600&family=Poppins:wght@300;400&display=swap'
          rel='stylesheet'
        />
        <style>{`
          @keyframes psFade { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes psFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
          @keyframes psDrift { 0%{transform:translateY(-20px) scale(0.8);opacity:0} 30%{opacity:0.7} 80%{opacity:0.5} 100%{transform:translateY(-80px) scale(1.2);opacity:0} }
          @keyframes psBlob { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 33%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} 66%{border-radius:40% 70% 30% 60%/40% 50% 60% 50%} }
          @keyframes psPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
          .ps-up{animation:psFade .8s ease forwards;opacity:0}
          .ps-d1{animation-delay:.2s} .ps-d2{animation-delay:.5s} .ps-d3{animation-delay:.8s} .ps-d4{animation-delay:1.1s}
          .ps-blob{animation:psBlob 8s ease-in-out infinite}
          .ps-float{animation:psFloat 3.5s ease-in-out infinite}
          .ps-pulse{animation:psPulse 2.5s ease-in-out infinite}
          *{box-sizing:border-box;margin:0;padding:0}
        `}</style>
      </Head>
      <div style={{ background: white, fontFamily: "'Poppins', sans-serif", color: textDark, overflowX: 'hidden' }}>
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
          {/* Watercolor blob background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, rgba(247,197,208,0.45) 0%, rgba(192,216,244,0.35) 30%, rgba(216,192,244,0.35) 60%, rgba(186,240,216,0.4) 100%)`
            }}
          />

          {/* Blobs */}
          {bubbles.map((b, i) => (
            <div
              key={i}
              className='ps-blob'
              style={{
                position: 'absolute',
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: b.r * 2,
                height: b.r * 2,
                background: b.color,
                opacity: 0.22,
                filter: 'blur(30px)',
                animationDelay: `${b.delay}s`
              }}
            />
          ))}

          {/* Cover image with soft overlay */}
          {mergedContent.cover_image && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${mergedContent.cover_image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.18,
                filter: 'saturate(0.7) brightness(1.2)'
              }}
            />
          )}

          <div style={{ position: 'relative', zIndex: 2, padding: '60px 28px' }}>
            {/* Floating hearts ornament */}
            <div className='ps-up ps-d1 ps-float' style={{ marginBottom: 16 }}>
              <svg width='80' height='28' viewBox='0 0 80 28' fill='none'>
                {[10, 26, 40, 54, 70].map((cx, i) => (
                  <path
                    key={i}
                    d={`M${cx} ${14 - 4} C${cx - 3} ${14 - 7} ${cx - 6} ${14 - 4} ${cx} ${14 + 2} C${cx + 6} ${14 - 4} ${cx + 3} ${14 - 7} ${cx} ${14 - 4}`}
                    fill={[blush, sky, lavender, mint, peach][i]}
                    opacity={0.8}
                  />
                ))}
              </svg>
            </div>

            <p
              className='ps-up ps-d1'
              style={{
                fontSize: 9,
                letterSpacing: '0.4em',
                color: accent1,
                textTransform: 'uppercase',
                marginBottom: 18,
                fontWeight: 400
              }}
            >
              A love story
            </p>
            <h1
              className='ps-up ps-d2'
              style={{
                fontSize: 'clamp(2.8rem,11vw,7.5rem)',
                fontFamily: "'Dancing Script', cursive",
                fontWeight: 600,
                color: textDark,
                lineHeight: 1.15,
                marginBottom: 8
              }}
            >
              {mergedContent.groom_name || 'Chú Rể'}
            </h1>

            {/* Sparkle divider */}
            <div
              className='ps-up ps-d2'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '14px 0' }}
            >
              <div
                style={{
                  flex: 1,
                  maxWidth: 40,
                  height: 1,
                  background: `linear-gradient(to right, transparent, ${accent1})`
                }}
              />
              <svg width='20' height='20' viewBox='0 0 20 20'>
                <path d='M10 2 L11 9 L18 10 L11 11 L10 18 L9 11 L2 10 L9 9 Z' fill={accent1} opacity='0.7' />
              </svg>
              <div
                style={{
                  flex: 1,
                  maxWidth: 40,
                  height: 1,
                  background: `linear-gradient(to left, transparent, ${accent1})`
                }}
              />
            </div>

            <h1
              className='ps-up ps-d3'
              style={{
                fontSize: 'clamp(2.8rem,11vw,7.5rem)',
                fontFamily: "'Dancing Script', cursive",
                fontWeight: 600,
                color: textDark,
                lineHeight: 1.15,
                marginBottom: 24
              }}
            >
              {mergedContent.bride_name || 'Cô Dâu'}
            </h1>

            {/* Rainbow dots divider */}
            <div
              className='ps-up ps-d3'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 18 }}
            >
              {[blush, peach, mint, sky, lavender].map((c, i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: c, opacity: 0.8 }} />
              ))}
            </div>

            {mergedContent.wedding_date && (
              <p
                className='ps-up ps-d4'
                style={{ fontSize: 13, color: textMid, letterSpacing: '0.05em', fontWeight: 300 }}
              >
                {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
        </section>

        {/* ── COUNTDOWN ── */}
        {timeRemaining && (
          <section style={{ background: softWhite, padding: '60px 24px', textAlign: 'center' }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.4em',
                color: accent1,
                textTransform: 'uppercase',
                marginBottom: 28,
                fontWeight: 400
              }}
            >
              Đếm ngược ngày vui
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, maxWidth: 360, margin: '0 auto' }}>
              {[
                { v: timeRemaining.days, l: 'Ngày', c: blush },
                { v: timeRemaining.hours, l: 'Giờ', c: sky },
                { v: timeRemaining.minutes, l: 'Phút', c: lavender },
                { v: timeRemaining.seconds, l: 'Giây', c: mint }
              ].map((it, i) => (
                <div key={i} style={{ flex: 1 }}>
                  <div
                    className='ps-pulse'
                    style={{
                      background: it.c,
                      borderRadius: 12,
                      padding: '14px 4px',
                      marginBottom: 8,
                      opacity: 0.85,
                      animationDelay: `${i * 0.3}s`
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontSize: 'clamp(1.8rem,6vw,3rem)',
                        fontFamily: "'Dancing Script', cursive",
                        color: textDark,
                        lineHeight: 1
                      }}
                    >
                      {String(it.v).padStart(2, '0')}
                    </span>
                  </div>
                  <p style={{ fontSize: 9, letterSpacing: '0.2em', color: textMid, textTransform: 'uppercase' }}>
                    {it.l}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── STORY ── */}
        <section style={{ background: white, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            {/* Watercolor blob accent */}
            <div style={{ position: 'relative', marginBottom: 24 }}>
              <div
                className='ps-blob'
                style={{
                  width: 80,
                  height: 50,
                  background: blush,
                  borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                  margin: '0 auto',
                  opacity: 0.4,
                  filter: 'blur(4px)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%,-50%)',
                  display: 'flex',
                  gap: 6
                }}
              >
                {[blush, sky, lavender].map((c, i) => (
                  <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: c, opacity: 0.8 }} />
                ))}
              </div>
            </div>
            <h2
              style={{
                fontSize: 'clamp(1.8rem,6vw,3rem)',
                fontFamily: "'Dancing Script', cursive",
                fontWeight: 600,
                color: textDark,
                marginBottom: 18
              }}
            >
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.9, color: textMid, fontWeight: 300 }}>
              {mergedContent.intro_text ||
                'Trong vườn sắc màu của tình yêu, chúng tôi tìm thấy nhau — nhẹ nhàng như những cánh hoa, rực rỡ như muôn màu sắc bên nhau. Hãy đến chung vui với chúng tôi nhé!'}
            </p>
          </div>
        </section>

        {/* ── EVENT DETAILS ── */}
        <section style={{ background: softWhite, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p
                style={{
                  fontSize: 9,
                  letterSpacing: '0.4em',
                  color: accent1,
                  textTransform: 'uppercase',
                  marginBottom: 10,
                  fontWeight: 400
                }}
              >
                Ngày trọng đại
              </p>
              <h2
                style={{
                  fontSize: 'clamp(1.6rem,5vw,2.6rem)',
                  fontFamily: "'Dancing Script', cursive",
                  fontWeight: 600,
                  color: textDark
                }}
              >
                Lễ cưới của chúng tôi
              </h2>
            </div>
            {[
              { label: 'Ngày cưới', value: mergedContent.event_date || mergedContent.wedding_date, c: blush },
              { label: 'Giờ cưới', value: mergedContent.wedding_time, c: sky },
              { label: 'Địa điểm', value: mergedContent.address, c: lavender },
              { label: 'Lịch âm', value: mergedContent.lunar_date, c: mint }
            ]
              .filter((it) => it.value)
              .map((it, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 14,
                    padding: '12px 0',
                    borderBottom: `1px solid rgba(216,192,244,0.2)`
                  }}
                >
                  <div
                    style={{ width: 8, height: 36, borderRadius: 4, background: it.c, flexShrink: 0, opacity: 0.7 }}
                  />
                  <div style={{ paddingTop: 4 }}>
                    <p
                      style={{
                        fontSize: 9,
                        letterSpacing: '0.3em',
                        color: accent1,
                        textTransform: 'uppercase',
                        marginBottom: 3,
                        fontWeight: 400
                      }}
                    >
                      {it.label}
                    </p>
                    <p style={{ fontSize: 15, color: textDark, fontWeight: 300 }}>{it.value}</p>
                  </div>
                </div>
              ))}
            {mergedContent.map_url && (
              <a
                href={mergedContent.map_url}
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  display: 'inline-block',
                  marginTop: 24,
                  padding: '12px 28px',
                  background: blush,
                  color: textDark,
                  textDecoration: 'none',
                  fontSize: 11,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  borderRadius: 24,
                  fontWeight: 400
                }}
              >
                Xem bản đồ
              </a>
            )}
          </div>
        </section>

        {/* ── ALBUM ── */}
        {albumImages.length > 0 && (
          <section style={{ background: white, padding: '72px 24px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.4em',
                    color: accent1,
                    textTransform: 'uppercase',
                    marginBottom: 8,
                    fontWeight: 400
                  }}
                >
                  Album ảnh
                </p>
                <h2
                  style={{
                    fontSize: 'clamp(1.6rem,5vw,2.6rem)',
                    fontFamily: "'Dancing Script', cursive",
                    fontWeight: 600,
                    color: textDark
                  }}
                >
                  Kỷ niệm đẹp
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {albumImages.slice(0, 4).map((img: string, i: number) => (
                  <div
                    key={i}
                    style={{
                      aspectRatio: '3/4',
                      overflow: 'hidden',
                      borderRadius: 16,
                      border: `3px solid ${[blush, sky, lavender, mint][i]}`,
                      boxShadow: `0 4px 20px rgba(216,192,244,0.3)`,
                      transform: i % 2 === 0 ? 'rotate(-1deg)' : 'rotate(1deg)'
                    }}
                  >
                    <img
                      src={img}
                      alt=''
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'saturate(0.9) brightness(1.03)'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── GIFT ── */}
        {(mergedContent.bank_name || mergedContent.account_number) && (
          <section style={{ background: softWhite, padding: '72px 24px' }}>
            <div style={{ maxWidth: 420, margin: '0 auto', textAlign: 'center' }}>
              <p
                style={{
                  fontSize: 9,
                  letterSpacing: '0.4em',
                  color: accent1,
                  textTransform: 'uppercase',
                  marginBottom: 14,
                  fontWeight: 400
                }}
              >
                Mừng cưới
              </p>
              <h2
                style={{
                  fontSize: 'clamp(1.6rem,5vw,2.4rem)',
                  fontFamily: "'Dancing Script', cursive",
                  fontWeight: 600,
                  color: textDark,
                  marginBottom: 8
                }}
              >
                Tấm lòng quý khách
              </h2>
              <p style={{ fontSize: 13, color: textMid, fontWeight: 300, marginBottom: 28, lineHeight: 1.7 }}>
                Tình yêu và sự hiện diện của quý vị là điều chúng tôi trân trọng nhất.
              </p>
              <div
                style={{
                  border: `2px solid ${blush}`,
                  borderRadius: 16,
                  padding: '24px 20px',
                  background: white,
                  boxShadow: `0 4px 24px rgba(247,197,208,0.3)`
                }}
              >
                {mergedContent.account_name && (
                  <p
                    style={{
                      fontSize: 18,
                      fontFamily: "'Dancing Script', cursive",
                      fontWeight: 600,
                      color: textDark,
                      marginBottom: 6
                    }}
                  >
                    {mergedContent.account_name}
                  </p>
                )}
                {mergedContent.bank_name && (
                  <p
                    style={{
                      fontSize: 10,
                      letterSpacing: '0.2em',
                      color: textMid,
                      textTransform: 'uppercase',
                      marginBottom: 6,
                      fontWeight: 400
                    }}
                  >
                    {mergedContent.bank_name}
                  </p>
                )}
                {mergedContent.account_number && (
                  <p
                    style={{
                      fontSize: 22,
                      color: textDark,
                      letterSpacing: '0.08em',
                      fontFamily: "'Dancing Script', cursive",
                      fontWeight: 600
                    }}
                  >
                    {mergedContent.account_number}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── FOOTER ── */}
        <section
          style={{
            background: `linear-gradient(135deg, ${blush} 0%, ${sky} 35%, ${lavender} 70%, ${mint} 100%)`,
            padding: '52px 24px',
            textAlign: 'center',
            opacity: 0.92
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
            {[blush, sky, lavender, mint, peach].map((c, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: textDark, opacity: 0.3 }} />
            ))}
          </div>
          <p
            style={{
              fontSize: 'clamp(1.4rem,5vw,2.5rem)',
              fontFamily: "'Dancing Script', cursive",
              fontWeight: 600,
              color: textDark,
              marginBottom: 6
            }}
          >
            {mergedContent.groom_name} & {mergedContent.bride_name}
          </p>
          {mergedContent.wedding_date && (
            <p style={{ fontSize: 11, letterSpacing: '0.1em', color: textMid, fontWeight: 300 }}>
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
              color: 'rgba(42,26,48,0.3)',
              marginTop: 24,
              textTransform: 'uppercase'
            }}
          >
            Made with love · MoiMoi Studio
          </p>
        </section>
      </div>
    </>
  )
}
