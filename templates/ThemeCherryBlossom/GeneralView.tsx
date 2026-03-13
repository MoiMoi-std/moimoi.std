import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'
import { getImageStyle, resolveImageAdjust } from '../../lib/imageUtils'
import { useTemplateViewport } from '../../lib/TemplateViewportContext'

export default function CherryBlossomGeneralView({ wedding }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const viewport = useTemplateViewport()

  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }

  const pink = mergedContent.primary_color || '#d4507a'
  const pinkDeep = '#a83258'
  const pinkLight = '#f0a0be'
  const pinkBg = '#fff8fb'
  const pinkCard = 'rgba(255,255,255,0.92)'
  const purple = '#9b5de5'
  const blush = '#fce4ec'
  const textDark = '#2d1322'
  const textMid = '#8b4d6a'

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
      } else {
        setTimeRemaining(null)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [mergedContent.wedding_date, mergedContent.wedding_time])

  if (!wedding) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: pinkBg
        }}
      >
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div
            style={{
              width: 48,
              height: 48,
              marginBottom: 12,
              opacity: 0.6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                width: 24,
                height: 32,
                borderRadius: '50% 0 50% 0',
                background: pink,
                transform: 'rotate(-15deg)'
              }}
            />
          </div>
          <h1 style={{ color: pink, fontFamily: "'Quicksand', sans-serif" }}>Không tìm thấy thiệp cưới</h1>
        </div>
      </div>
    )
  }

  const albumImages: string[] = (mergedContent.images || []).filter(Boolean)

  return (
    <>
      <Head>
        <title>
          {mergedContent.groom_name} &amp; {mergedContent.bride_name} — Cherry Blossom Wedding
        </title>
        <meta name='description' content={`Thiệp cưới — ${mergedContent.groom_name} và ${mergedContent.bride_name}`} />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Noto+Serif+JP:wght@300;400;500;600;700&display=swap'
          rel='stylesheet'
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${pinkBg}; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
          html { scroll-behavior: smooth; }

          @keyframes cbFadeUp {
            from { opacity: 0; transform: translateY(40px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes cbHeroZoom {
            from { transform: scale(1.07); }
            to   { transform: scale(1); }
          }
          @keyframes cbPetalFall {
            0%   { transform: translateY(-60px) translateX(0px) rotate(0deg) scale(1); opacity: 0.85; }
            20%  { opacity: 0.9; }
            80%  { opacity: 0.65; }
            100% { transform: translateY(110vh) translateX(80px) rotate(600deg) scale(0.7); opacity: 0; }
          }
          @keyframes cbFloat {
            0%, 100% { transform: translateY(0px) rotate(-2deg); }
            50%       { transform: translateY(-14px) rotate(2deg); }
          }
          @keyframes cbShimmer {
            0%   { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes cbPuls {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50%       { opacity: 1; transform: scale(1.08); }
          }
          @keyframes cbScrollPulse {
            0%   { opacity: 1; transform: scaleY(1); }
            100% { opacity: 0; transform: scaleY(0); transform-origin: top; }
          }

          .cb-up   { animation: cbFadeUp 0.9s cubic-bezier(.16,1,.3,1) both; }
          .cb-zoom { animation: cbHeroZoom 2s cubic-bezier(.16,1,.3,1) both; }
          .cb-d1   { animation-delay: 0.15s; }
          .cb-d2   { animation-delay: 0.3s; }
          .cb-d3   { animation-delay: 0.45s; }
          .cb-d4   { animation-delay: 0.6s; }
          .cb-d5   { animation-delay: 0.75s; }
          .cb-float { animation: cbFloat 6s ease-in-out infinite; }
          .cb-pulse { animation: cbPuls 3s ease-in-out infinite; }

          /* CSS Petal shape — no emoji */
          .cb-petal {
            position: absolute;
            width: 14px;
            height: 20px;
            border-radius: 50% 0 50% 0;
            animation: cbPetalFall linear infinite;
            pointer-events: none;
            user-select: none;
          }

          .cb-card {
            background: ${pinkCard};
            backdrop-filter: blur(18px);
            border: 1px solid ${pink}18;
            border-radius: 24px;
            box-shadow: 0 4px 28px ${pink}0d, 0 1px 0 rgba(255,255,255,0.9) inset;
            transition: transform 0.45s cubic-bezier(.16,1,.3,1), box-shadow 0.45s;
          }
          .cb-card:hover { transform: translateY(-6px); box-shadow: 0 18px 52px ${pink}18; }

          .cb-photo {
            overflow: hidden;
            border-radius: 20px;
            box-shadow: 0 8px 32px ${pink}1a;
            transition: transform 0.5s cubic-bezier(.16,1,.3,1), box-shadow 0.5s;
            cursor: pointer;
          }
          .cb-photo:hover { transform: scale(1.025); box-shadow: 0 16px 48px ${pink}28; }

          .cb-names {
            background: linear-gradient(135deg, #fff 0%, ${pinkLight} 40%, ${purple} 80%, #fff 100%);
            background-size: 250% 250%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: cbShimmer 8s linear infinite;
          }

          .cb-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, ${pink}50, ${pink}90, ${pink}50, transparent);
          }

          .cb-btn {
            transition: transform 0.3s, box-shadow 0.3s;
          }
          .cb-btn:hover { transform: translateY(-3px); box-shadow: 0 14px 36px ${pink}50; }

          .cb-scroll-dot {
            width: 6px; height: 6px; border-radius: 50%;
            background: rgba(255,255,255,0.8); margin: 0 auto;
            animation: cbScrollPulse 1.8s ease-in-out infinite;
          }
        `}</style>
      </Head>

      <div
        style={{
          minHeight: '100vh',
          background: pinkBg,
          fontFamily: "'Quicksand', sans-serif",
          color: textDark,
          overflowX: 'hidden'
        }}
      >
        {/* ══ Hero ══ */}
        <section
          style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Background */}
          {mergedContent.cover_image ? (
            <div
              className='cb-zoom'
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${mergedContent.cover_image})`,
                backgroundSize: 'cover',
                backgroundPosition: (() => {
                  const adj = resolveImageAdjust(mergedContent.cover_image_position, viewport)
                  return adj ? `${adj.x}% ${adj.y}%` : 'center top'
                })()
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(160deg, #fce4ec 0%, #f48fb1 40%, ${purple}60 100%)`
              }}
            />
          )}

          {/* Romantic pink overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: mergedContent.cover_image
                ? `linear-gradient(to bottom, rgba(90,20,45,0.28) 0%, rgba(60,10,30,0.52) 50%, rgba(30,5,18,0.78) 100%)`
                : `linear-gradient(to bottom, rgba(180,60,100,0.15) 0%, rgba(80,20,50,0.4) 100%)`
            }}
          />

          {/* Soft glow in center */}
          <div
            style={{
              position: 'absolute',
              width: 600,
              height: 600,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${pink}18, transparent 65%)`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              filter: 'blur(80px)',
              pointerEvents: 'none'
            }}
          />

          {/* CSS Petals — shapes not emoji */}
          {[
            { left: '6%', delay: '0s', dur: '9s', color: `${pink}cc`, rot: '20deg' },
            { left: '18%', delay: '2.5s', dur: '12s', color: `${pinkLight}bb`, rot: '-15deg' },
            { left: '33%', delay: '5s', dur: '10s', color: `${pink}aa`, rot: '35deg' },
            { left: '52%', delay: '1s', dur: '14s', color: `${purple}99`, rot: '-30deg' },
            { left: '68%', delay: '3.5s', dur: '11s', color: `${pinkLight}cc`, rot: '10deg' },
            { left: '80%', delay: '6s', dur: '9.5s', color: `${pink}bb`, rot: '50deg' },
            { left: '92%', delay: '0.8s', dur: '13s', color: `${pinkLight}aa`, rot: '-45deg' }
          ].map((p, i) => (
            <div
              key={i}
              className='cb-petal'
              style={{
                left: p.left,
                top: 0,
                background: p.color,
                transform: `rotate(${p.rot})`,
                animationDelay: p.delay,
                animationDuration: p.dur
              }}
            />
          ))}

          {/* Hero text */}
          <div
            style={{ textAlign: 'center', maxWidth: 720, padding: '80px 28px 100px', position: 'relative', zIndex: 1 }}
          >
            <p
              className='cb-up'
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.55em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.65)',
                marginBottom: 40
              }}
            >
              SAKURA WEDDING
            </p>

            <h1
              className='cb-names cb-up cb-d1'
              style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: 'clamp(3rem, 10vw, 6.5rem)',
                fontWeight: 700,
                lineHeight: 1.05,
                paddingTop: '0.15em',
                paddingBottom: '0.15em'
              }}
            >
              {mergedContent.groom_name}
            </h1>

            <div
              className='cb-up cb-d2'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, margin: '22px 0' }}
            >
              <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'rgba(255,255,255,0.35)' }} />
              {/* CSS petal ornament */}
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50% 0 50% 0',
                  background: 'rgba(255,255,255,0.85)',
                  transform: 'rotate(45deg)'
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.6)'
                }}
              />
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '0 50% 0 50%',
                  background: 'rgba(255,255,255,0.85)',
                  transform: 'rotate(45deg)'
                }}
              />
              <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'rgba(255,255,255,0.35)' }} />
            </div>

            <h1
              className='cb-names cb-up cb-d3'
              style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: 'clamp(3rem, 10vw, 6.5rem)',
                fontWeight: 700,
                lineHeight: 1.05,
                paddingTop: '0.15em',
                paddingBottom: '0.15em',
                marginBottom: 36
              }}
            >
              {mergedContent.bride_name}
            </h1>

            {mergedContent.wedding_date && (
              <p
                className='cb-up cb-d4'
                style={{
                  fontFamily: "'Noto Serif JP', serif",
                  fontSize: 16,
                  fontStyle: 'italic',
                  color: 'rgba(255,255,255,0.82)',
                  letterSpacing: '0.05em',
                  marginBottom: 10
                }}
              >
                {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
            {mergedContent.address && (
              <p
                className='cb-up cb-d5'
                style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}
              >
                {mergedContent.address}
              </p>
            )}

            <div
              className='cb-up cb-d5'
              style={{ marginTop: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            >
              <div
                style={{
                  width: 1,
                  height: 48,
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.55), transparent)'
                }}
              />
              <div className='cb-scroll-dot' />
            </div>
          </div>
        </section>

        {/* ══ Quote ══ */}
        <section style={{ padding: '80px 24px', background: `linear-gradient(135deg, ${pinkBg} 0%, ${blush} 100%)` }}>
          <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
            {/* Petal ornament */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
              {[20, 30, 20].map((deg, i) => (
                <div
                  key={i}
                  style={{
                    width: 12,
                    height: 18,
                    borderRadius: '50% 0 50% 0',
                    background: `${pink}55`,
                    transform: `rotate(${i * 30 - 30}deg)`
                  }}
                />
              ))}
            </div>
            <p
              style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: 'clamp(0.95rem, 3vw, 1.2rem)',
                fontStyle: 'italic',
                fontWeight: 300,
                color: textMid,
                lineHeight: 2.1
              }}
            >
              Hai gia đình trân trọng kính mời quý vị đến chung vui
              <br />
              trong ngày lễ thành hôn của
            </p>
            <p
              style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
                fontWeight: 500,
                color: pinkDeep,
                marginTop: 14,
                letterSpacing: '0.03em'
              }}
            >
              {mergedContent.groom_name} &amp; {mergedContent.bride_name}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
              {[20, 30, 20].map((deg, i) => (
                <div
                  key={i}
                  style={{
                    width: 12,
                    height: 18,
                    borderRadius: '0 50% 0 50%',
                    background: `${pink}55`,
                    transform: `rotate(${i * 30 - 30 + 180}deg)`
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ══ Countdown ══ */}
        {timeRemaining && (
          <section
            style={{
              padding: '80px 20px',
              background: `linear-gradient(135deg, ${pinkDeep} 0%, #7b1840 100%)`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* bg petal shapes */}
            <div
              style={{
                position: 'absolute',
                bottom: -30,
                right: -30,
                width: 200,
                height: 200,
                borderRadius: '50% 0 50% 0',
                background: 'rgba(255,255,255,0.04)',
                pointerEvents: 'none'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: -40,
                left: -40,
                width: 240,
                height: 240,
                borderRadius: '0 50% 0 50%',
                background: 'rgba(255,255,255,0.03)',
                pointerEvents: 'none'
              }}
            />
            <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.5em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.45)',
                  marginBottom: 48
                }}
              >
                ĐẾM NGƯỢC
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 1,
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: 20,
                  overflow: 'hidden'
                }}
              >
                {[
                  { label: 'Ngày', value: timeRemaining.days },
                  { label: 'Giờ', value: timeRemaining.hours },
                  { label: 'Phút', value: timeRemaining.minutes },
                  { label: 'Giây', value: timeRemaining.seconds }
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{ padding: '32px 8px', textAlign: 'center', background: 'rgba(0,0,0,0.25)' }}
                  >
                    <div
                      style={{
                        fontFamily: "'Noto Serif JP', serif",
                        fontSize: 'clamp(2.5rem, 7vw, 4rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: '#fff',
                        lineHeight: 1,
                        marginBottom: 10
                      }}
                    >
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.22em',
                        color: 'rgba(255,255,255,0.45)',
                        textTransform: 'uppercase'
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ Event Details ══ */}
        <section style={{ padding: '90px 20px', background: pinkBg }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.5em',
                  textTransform: 'uppercase',
                  color: pink,
                  marginBottom: 14
                }}
              >
                THÔNG TIN LỄ CƯỚI
              </p>
              <h2
                style={{
                  fontFamily: "'Noto Serif JP', serif",
                  fontSize: 'clamp(1.6rem, 5vw, 2.5rem)',
                  fontWeight: 700,
                  color: textDark
                }}
              >
                Ngày trọng đại
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
              {[
                {
                  icon: (
                    <svg
                      width='22'
                      height='22'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke={pink}
                      strokeWidth='1.5'
                      strokeLinecap='round'
                    >
                      <rect x='3' y='4' width='18' height='18' rx='2' />
                      <path d='M16 2v4M8 2v4M3 10h18' />
                    </svg>
                  ),
                  title: 'Ngày cưới',
                  value: mergedContent.wedding_date
                    ? new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : null
                },
                {
                  icon: (
                    <svg
                      width='22'
                      height='22'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke={pink}
                      strokeWidth='1.5'
                      strokeLinecap='round'
                    >
                      <circle cx='12' cy='12' r='9' />
                      <path d='M12 7v5l3 3' />
                    </svg>
                  ),
                  title: 'Giờ tổ chức',
                  value: mergedContent.wedding_time
                },
                {
                  icon: (
                    <svg
                      width='22'
                      height='22'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke={pink}
                      strokeWidth='1.5'
                      strokeLinecap='round'
                    >
                      <path d='M12 22s-8-6.5-8-12a8 8 0 0116 0c0 5.5-8 12-8 12Z' />
                      <circle cx='12' cy='10' r='2.5' />
                    </svg>
                  ),
                  title: 'Địa điểm',
                  value: mergedContent.address
                }
              ].map(({ icon, title, value }) => (
                <div
                  key={title}
                  className='cb-card cb-up'
                  style={{ padding: '28px 24px', display: 'flex', alignItems: 'flex-start', gap: 18 }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      background: `${pink}10`,
                      border: `1px solid ${pink}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: pink,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        marginBottom: 8
                      }}
                    >
                      {title}
                    </p>
                    <p style={{ fontSize: 16, fontWeight: 600, color: textDark, lineHeight: 1.6 }}>{value || '—'}</p>
                  </div>
                </div>
              ))}
            </div>

            {mergedContent.map_url && (
              <div style={{ textAlign: 'center', marginTop: 36 }}>
                <a
                  href={mergedContent.map_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='cb-btn'
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '14px 32px',
                    background: `linear-gradient(135deg, ${pink}, ${pinkLight})`,
                    color: '#fff',
                    borderRadius: 50,
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: 15,
                    boxShadow: `0 8px 28px ${pink}45`
                  }}
                >
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                  >
                    <polygon points='1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6' />
                    <line x1='8' y1='2' x2='8' y2='18' />
                    <line x1='16' y1='6' x2='16' y2='22' />
                  </svg>
                  Xem bản đồ
                </a>
              </div>
            )}
          </div>
        </section>

        {/* ══ Album ══ */}
        {albumImages.length > 0 && (
          <section style={{ padding: '90px 20px', background: `linear-gradient(135deg, ${pinkBg} 0%, ${blush} 100%)` }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 52 }}>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.5em',
                    textTransform: 'uppercase',
                    color: pink,
                    marginBottom: 12
                  }}
                >
                  KHOẢNH KHẮC
                </p>
                <h2
                  style={{
                    fontFamily: "'Noto Serif JP', serif",
                    fontSize: 'clamp(1.6rem, 5vw, 2.5rem)',
                    fontWeight: 700,
                    color: textDark
                  }}
                >
                  Album cưới
                </h2>
              </div>
              <div style={{ columns: '2 200px', gap: 12 }}>
                {albumImages.map((img: string, i: number) => (
                  <div key={i} className='cb-photo' style={{ marginBottom: 12, breakInside: 'avoid' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Ảnh cưới ${i + 1}`}
                      style={{
                        width: '100%',
                        display: 'block',
                        ...getImageStyle(resolveImageAdjust(mergedContent.image_positions?.[i], viewport))
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ Gift / Bank ══ */}
        {mergedContent.account_number && (
          <section style={{ padding: '90px 20px', background: pinkBg }}>
            <div style={{ maxWidth: 560, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.5em',
                    textTransform: 'uppercase',
                    color: pink,
                    marginBottom: 12
                  }}
                >
                  MỪNG CƯỚI
                </p>
                <h2
                  style={{
                    fontFamily: "'Noto Serif JP', serif",
                    fontSize: 'clamp(1.6rem, 5vw, 2.5rem)',
                    fontWeight: 700,
                    color: textDark,
                    marginBottom: 16
                  }}
                >
                  Tấm lòng thơm thảo
                </h2>
                <p
                  style={{
                    color: textMid,
                    fontSize: 15,
                    lineHeight: 1.85,
                    fontStyle: 'italic',
                    fontFamily: "'Noto Serif JP', serif"
                  }}
                >
                  Sự hiện diện của bạn là món quà quý giá nhất.
                  <br />
                  Nếu muốn gửi tặng thêm, xin trân trọng cảm ơn!
                </p>
              </div>
              <div className='cb-card' style={{ padding: '36px 32px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 24,
                    paddingBottom: 20,
                    borderBottom: `1px solid ${pink}15`
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: `${pink}10`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke={pink}
                      strokeWidth='1.5'
                      strokeLinecap='round'
                    >
                      <rect x='2' y='5' width='20' height='14' rx='2' />
                      <path d='M2 10h20' />
                    </svg>
                  </div>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: textMid,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase'
                    }}
                  >
                    Thông tin tài khoản
                  </p>
                </div>
                {mergedContent.bank_name && (
                  <p style={{ fontSize: 13, color: textMid, marginBottom: 8 }}>{mergedContent.bank_name}</p>
                )}
                <p
                  style={{
                    fontFamily: "'Noto Serif JP', serif",
                    fontSize: 'clamp(1.5rem, 5vw, 2.1rem)',
                    fontWeight: 700,
                    color: pinkDeep,
                    letterSpacing: '0.06em',
                    marginBottom: 8
                  }}
                >
                  {mergedContent.account_number}
                </p>
                {mergedContent.account_name && (
                  <p style={{ fontSize: 14, color: textMid, fontStyle: 'italic' }}>{mergedContent.account_name}</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ══ Footer ══ */}
        <footer
          style={{
            padding: '72px 24px 80px',
            textAlign: 'center',
            background: `linear-gradient(135deg, ${pinkDeep} 0%, #8b1a45 100%)`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* decorative petal shapes */}
          <div
            style={{
              position: 'absolute',
              bottom: -30,
              right: -20,
              width: 180,
              height: 180,
              borderRadius: '50% 0 50% 0',
              background: 'rgba(255,255,255,0.04)',
              pointerEvents: 'none'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: -40,
              left: -30,
              width: 200,
              height: 200,
              borderRadius: '0 50% 0 50%',
              background: 'rgba(255,255,255,0.03)',
              pointerEvents: 'none'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 24, position: 'relative' }}>
            {[0, 72, 144, 216, 288].map((deg) => (
              <div
                key={deg}
                style={{
                  width: 10,
                  height: 15,
                  borderRadius: '50% 0 50% 0',
                  background: 'rgba(255,255,255,0.55)',
                  transform: `rotate(${deg}deg)`
                }}
              />
            ))}
          </div>
          <p
            style={{
              fontFamily: "'Noto Serif JP', serif",
              fontSize: 22,
              fontWeight: 700,
              color: '#fff',
              fontStyle: 'italic',
              marginBottom: 8,
              position: 'relative'
            }}
          >
            {mergedContent.groom_name} &amp; {mergedContent.bride_name}
          </p>
          <p
            style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              position: 'relative'
            }}
          >
            MoiMoi Studio
          </p>
        </footer>
      </div>
    </>
  )
}
