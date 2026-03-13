import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'
import { getImageStyle, resolveImageAdjust } from '../../lib/imageUtils'
import { useTemplateViewport } from '../../lib/TemplateViewportContext'

export default function NatureGeneralView({ wedding }: TemplateProps) {
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

  const sage = mergedContent.primary_color || '#4a7c59'
  const sageDark = '#2f5c3e'
  const sageLight = '#7aab8a'
  const cream = '#f6f2ea'
  const creamDark = '#ede5d4'
  const textDark = '#1e2b1a'
  const textMid = '#5a6e52'

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
          background: cream
        }}
      >
        <div style={{ textAlign: 'center', padding: 40 }}>
          <svg width='48' height='48' viewBox='0 0 48 48' fill='none' style={{ marginBottom: 12, opacity: 0.6 }}>
            <path d='M8 40 Q12 16 40 8 Q24 24 8 40Z' fill={sage} />
            <path d='M16 40 Q20 24 36 16' stroke={sage} strokeWidth='1.2' fill='none' opacity='0.5' />
          </svg>
          <h1 style={{ color: sage, fontFamily: "'Lora', serif" }}>Không tìm thấy thiệp cưới</h1>
        </div>
      </div>
    )
  }

  const albumImages: string[] = (mergedContent.images || []).filter(Boolean)

  return (
    <>
      <Head>
        <title>
          {mergedContent.groom_name} &amp; {mergedContent.bride_name} — Garden Wedding
        </title>
        <meta name='description' content={`Thiệp cưới — ${mergedContent.groom_name} và ${mergedContent.bride_name}`} />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap'
          rel='stylesheet'
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${cream}; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
          html { scroll-behavior: smooth; }

          @keyframes natFadeUp {
            from { opacity: 0; transform: translateY(40px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes natHeroZoom {
            from { transform: scale(1.08); }
            to   { transform: scale(1); }
          }
          @keyframes natLeafSway {
            0%, 100% { transform: rotate(-6deg) translateY(0); }
            50%       { transform: rotate(6deg) translateY(-10px); }
          }
          @keyframes natFloat {
            0%, 100% { transform: translateY(0px) rotate(-1deg); }
            50%       { transform: translateY(-14px) rotate(1deg); }
          }
          @keyframes natScrollPulse {
            0%   { opacity: 1; transform: scaleY(1); transform-origin: top; }
            100% { opacity: 0; transform: scaleY(0); transform-origin: top; }
          }
          @keyframes natPulse {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50%       { opacity: 1; transform: scale(1.06); }
          }

          .nat-up     { animation: natFadeUp 0.9s cubic-bezier(.16,1,.3,1) both; }
          .nat-scale  { animation: natHeroZoom 2s cubic-bezier(.16,1,.3,1) both; }
          .nat-d1     { animation-delay: 0.15s; }
          .nat-d2     { animation-delay: 0.3s; }
          .nat-d3     { animation-delay: 0.45s; }
          .nat-d4     { animation-delay: 0.6s; }
          .nat-d5     { animation-delay: 0.75s; }
          .nat-float  { animation: natFloat 7s ease-in-out infinite; }
          .nat-sway   { animation: natLeafSway 5s ease-in-out infinite; }
          .nat-pulse  { animation: natPulse 3.5s ease-in-out infinite; }

          .nat-card {
            background: rgba(255,255,255,0.93);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(74,124,89,0.12);
            border-radius: 20px;
            box-shadow: 0 2px 16px rgba(30,43,26,0.07), 0 0 0 1px rgba(255,255,255,0.8) inset;
            transition: transform 0.4s cubic-bezier(.16,1,.3,1), box-shadow 0.4s;
          }
          .nat-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(30,43,26,0.12); }

          .nat-photo {
            overflow: hidden;
            border-radius: 16px;
            box-shadow: 0 6px 28px rgba(30,43,26,0.14);
            transition: transform 0.5s cubic-bezier(.16,1,.3,1), box-shadow 0.5s;
            cursor: pointer;
          }
          .nat-photo:hover { transform: scale(1.025); box-shadow: 0 16px 48px rgba(30,43,26,0.2); }

          .nat-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, ${sage}50, ${sage}90, ${sage}50, transparent);
          }

          .nat-btn {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .nat-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 32px ${sage}45; }

          .nat-scroll-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: rgba(255,255,255,0.8);
            margin: 0 auto;
            animation: natScrollPulse 1.8s ease-in-out infinite;
          }
        `}</style>
      </Head>

      <div
        style={{
          minHeight: '100vh',
          background: cream,
          fontFamily: "'DM Sans', sans-serif",
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
          {/* Cover image background */}
          {mergedContent.cover_image ? (
            <div
              className='nat-scale'
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
                background: `linear-gradient(160deg, ${sageDark} 0%, ${sage} 60%, ${sageLight} 100%)`
              }}
            />
          )}

          {/* Forest gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: mergedContent.cover_image
                ? `linear-gradient(to bottom, rgba(20,38,22,0.3) 0%, rgba(15,30,18,0.52) 45%, rgba(8,20,10,0.78) 100%)`
                : `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)`
            }}
          />

          {/* SVG botanical corners */}
          <svg
            className='nat-sway'
            style={{
              position: 'absolute',
              top: -8,
              left: -8,
              width: 200,
              height: 200,
              opacity: 0.15,
              pointerEvents: 'none'
            }}
            viewBox='0 0 200 200'
          >
            <path d='M12,188 Q18,52 178,12 Q88,76 12,188Z' fill='white' />
            <path d='M30,188 Q38,80 160,36' stroke='white' strokeWidth='0.8' fill='none' opacity='0.5' />
          </svg>
          <svg
            className='nat-sway nat-d2'
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              width: 180,
              height: 180,
              opacity: 0.12,
              transform: 'scaleX(-1)',
              pointerEvents: 'none'
            }}
            viewBox='0 0 200 200'
          >
            <path d='M12,188 Q18,52 178,12 Q88,76 12,188Z' fill='white' />
          </svg>
          <svg
            style={{
              position: 'absolute',
              bottom: -8,
              left: -8,
              width: 160,
              height: 160,
              opacity: 0.1,
              transform: 'rotate(180deg) scaleX(-1)',
              pointerEvents: 'none'
            }}
            viewBox='0 0 200 200'
          >
            <path d='M12,188 Q18,52 178,12 Q88,76 12,188Z' fill='white' />
          </svg>

          {/* Hero text */}
          <div
            style={{ textAlign: 'center', maxWidth: 720, padding: '80px 28px 100px', position: 'relative', zIndex: 1 }}
          >
            <p
              className='nat-up'
              style={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.55em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.65)',
                marginBottom: 40
              }}
            >
              WEDDING INVITATION
            </p>

            <h1
              className='nat-up nat-d1'
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: 'clamp(3.2rem, 10vw, 6.5rem)',
                fontWeight: 600,
                fontStyle: 'italic',
                color: '#fff',
                lineHeight: 1.05,
                textShadow: '0 4px 40px rgba(0,0,0,0.35)'
              }}
            >
              {mergedContent.groom_name}
            </h1>

            <div
              className='nat-up nat-d2'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, margin: '22px 0' }}
            >
              <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'rgba(255,255,255,0.35)' }} />
              <svg width='32' height='32' viewBox='0 0 32 32' fill='none'>
                <path d='M16,3 Q7,11 7,18a9 9 0 0018 0Q25,11 16,3Z' fill='rgba(255,255,255,0.85)' />
                <path d='M16,29 Q9,23 7,18' stroke='rgba(255,255,255,0.4)' strokeWidth='1' fill='none' />
              </svg>
              <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'rgba(255,255,255,0.35)' }} />
            </div>

            <h1
              className='nat-up nat-d3'
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: 'clamp(3.2rem, 10vw, 6.5rem)',
                fontWeight: 600,
                fontStyle: 'italic',
                color: '#fff',
                lineHeight: 1.05,
                textShadow: '0 4px 40px rgba(0,0,0,0.35)',
                marginBottom: 36
              }}
            >
              {mergedContent.bride_name}
            </h1>

            {mergedContent.wedding_date && (
              <p
                className='nat-up nat-d4'
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: 17,
                  fontStyle: 'italic',
                  color: 'rgba(255,255,255,0.82)',
                  letterSpacing: '0.04em',
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
                className='nat-up nat-d5'
                style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}
              >
                {mergedContent.address}
              </p>
            )}

            <div
              className='nat-up nat-d5'
              style={{ marginTop: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            >
              <div
                style={{
                  width: 1,
                  height: 48,
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)'
                }}
              />
              <div className='nat-scroll-dot' />
            </div>
          </div>
        </section>

        {/* ══ Quote ══ */}
        <section
          style={{ padding: '80px 24px', background: `linear-gradient(135deg, ${cream} 0%, ${creamDark} 100%)` }}
        >
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <svg style={{ marginBottom: 32, opacity: 0.5 }} width='28' height='28' viewBox='0 0 28 28' fill={sage}>
              <path d='M14,2 Q5,9 5,16a9 9 0 0018 0Q23,9 14,2Z' />
            </svg>
            <p
              style={{
                fontFamily: "'Lora', serif",
                fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: textMid,
                lineHeight: 2,
                letterSpacing: '0.02em'
              }}
            >
              Hai gia đình trân trọng kính mời quý vị đến chung vui
              <br />
              trong ngày lễ thành hôn của
            </p>
            <p
              style={{
                fontFamily: "'Lora', serif",
                fontSize: 'clamp(1.3rem, 4vw, 1.7rem)',
                fontWeight: 600,
                color: sageDark,
                marginTop: 16,
                letterSpacing: '0.03em'
              }}
            >
              {mergedContent.groom_name} &amp; {mergedContent.bride_name}
            </p>
            <svg
              style={{ marginTop: 32, opacity: 0.5, transform: 'rotate(180deg)' }}
              width='28'
              height='28'
              viewBox='0 0 28 28'
              fill={sage}
            >
              <path d='M14,2 Q5,9 5,16a9 9 0 0018 0Q23,9 14,2Z' />
            </svg>
          </div>
        </section>

        {/* ══ Countdown ══ */}
        {timeRemaining && (
          <section style={{ padding: '80px 20px', background: sageDark, position: 'relative', overflow: 'hidden' }}>
            {/* bg leaf deco */}
            <svg
              style={{
                position: 'absolute',
                bottom: -20,
                right: -20,
                width: 260,
                opacity: 0.07,
                pointerEvents: 'none'
              }}
              viewBox='0 0 200 200'
            >
              <path d='M20,180 Q30,50 180,20 Q90,90 20,180Z' fill='white' />
            </svg>
            <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.5em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.45)',
                  marginBottom: 48
                }}
              >
                ĐẾM NGƯỢC NGÀY VUI
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
                    style={{ padding: '32px 8px', textAlign: 'center', background: 'rgba(0,0,0,0.3)' }}
                  >
                    <div
                      style={{
                        fontFamily: "'Lora', serif",
                        fontSize: 'clamp(2.5rem, 7vw, 4rem)',
                        fontWeight: 600,
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
                        fontWeight: 500,
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
        <section style={{ padding: '90px 20px' }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.5em',
                  textTransform: 'uppercase',
                  color: sage,
                  marginBottom: 14
                }}
              >
                THÔNG TIN LỄ CƯỚI
              </p>
              <h2
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: 'clamp(1.6rem, 5vw, 2.5rem)',
                  fontWeight: 600,
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
                      stroke={sage}
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
                      stroke={sage}
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
                      stroke={sage}
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
                  className='nat-card nat-up'
                  style={{ padding: '28px 24px', display: 'flex', alignItems: 'flex-start', gap: 18 }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: `${sage}10`,
                      border: `1px solid ${sage}20`,
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
                        fontWeight: 600,
                        color: sage,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        marginBottom: 8
                      }}
                    >
                      {title}
                    </p>
                    <p style={{ fontSize: 16, fontWeight: 500, color: textDark, lineHeight: 1.6 }}>{value || '—'}</p>
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
                  className='nat-btn'
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '14px 32px',
                    background: sage,
                    color: '#fff',
                    borderRadius: 50,
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: 15,
                    boxShadow: `0 8px 28px ${sage}45`
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
          <section
            style={{ padding: '90px 20px', background: `linear-gradient(135deg, ${cream} 0%, ${creamDark} 100%)` }}
          >
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 52 }}>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '0.5em',
                    textTransform: 'uppercase',
                    color: sage,
                    marginBottom: 12
                  }}
                >
                  KHOẢNH KHẮC
                </p>
                <h2
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: 'clamp(1.6rem, 5vw, 2.5rem)',
                    fontWeight: 600,
                    color: textDark
                  }}
                >
                  Album cưới
                </h2>
              </div>
              <div style={{ columns: '2 200px', gap: 12 }}>
                {albumImages.map((img: string, i: number) => (
                  <div key={i} className='nat-photo' style={{ marginBottom: 12, breakInside: 'avoid' }}>
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
          <section style={{ padding: '90px 20px' }}>
            <div style={{ maxWidth: 560, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '0.5em',
                    textTransform: 'uppercase',
                    color: sage,
                    marginBottom: 12
                  }}
                >
                  MỪNG CƯỚI
                </p>
                <h2
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: 'clamp(1.6rem, 5vw, 2.5rem)',
                    fontWeight: 600,
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
                    fontFamily: "'Lora', serif"
                  }}
                >
                  Sự hiện diện của bạn là món quà quý giá nhất.
                  <br />
                  Nếu muốn gửi tặng thêm, xin trân trọng cảm ơn!
                </p>
              </div>
              <div className='nat-card' style={{ padding: '36px 32px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 24,
                    paddingBottom: 20,
                    borderBottom: `1px solid ${sage}15`
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: `${sage}12`,
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
                      stroke={sage}
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
                      fontWeight: 600,
                      color: textMid,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase'
                    }}
                  >
                    Thông tin tài khoản
                  </p>
                </div>
                {mergedContent.bank_name && (
                  <p style={{ fontSize: 13, color: textMid, marginBottom: 8, letterSpacing: '0.05em' }}>
                    {mergedContent.bank_name}
                  </p>
                )}
                <p
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: 'clamp(1.5rem, 5vw, 2.1rem)',
                    fontWeight: 600,
                    color: sageDark,
                    letterSpacing: '0.08em',
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
            background: sageDark,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <svg
            style={{ position: 'absolute', bottom: -16, right: -16, width: 220, opacity: 0.07, pointerEvents: 'none' }}
            viewBox='0 0 200 200'
          >
            <path d='M20,180 Q30,50 180,20 Q90,90 20,180Z' fill='white' />
          </svg>
          <svg
            style={{
              position: 'absolute',
              top: -16,
              left: -16,
              width: 180,
              opacity: 0.05,
              transform: 'rotate(180deg)',
              pointerEvents: 'none'
            }}
            viewBox='0 0 200 200'
          >
            <path d='M20,180 Q30,50 180,20 Q90,90 20,180Z' fill='white' />
          </svg>
          <div className='nat-float' style={{ display: 'inline-block', marginBottom: 24, position: 'relative' }}>
            <svg width='32' height='32' viewBox='0 0 32 32' fill='rgba(255,255,255,0.65)'>
              <path d='M16,3 Q7,10 7,18a9 9 0 0018 0Q25,10 16,3Z' />
            </svg>
          </div>
          <p
            style={{
              fontFamily: "'Lora', serif",
              fontSize: 22,
              fontWeight: 600,
              fontStyle: 'italic',
              color: '#fff',
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
