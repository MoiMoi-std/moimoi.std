import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'
import { getImageStyle, resolveImageAdjust } from '../../lib/imageUtils'
import { useTemplateViewport } from '../../lib/TemplateViewportContext'

export default function MinimalistGeneralView({ wedding }: TemplateProps) {
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

  const ink = '#0d0d0d'
  const inkMid = '#4a4a4a'
  const inkLight = '#9a9a9a'
  const inkFaint = '#e8e8e8'
  const accent = mergedContent.primary_color || '#b8927a'
  const accentLight = '#ddbea9'
  const bg = '#fafafa'

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
        style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg }}
      >
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: '0.3em',
              color: inkLight,
              textTransform: 'uppercase',
              marginBottom: 16
            }}
          >
            NOT FOUND
          </p>
          <h1 style={{ color: ink, fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem' }}>
            Không tìm thấy thiệp cưới
          </h1>
        </div>
      </div>
    )
  }

  const albumImages: string[] = (mergedContent.images || []).filter(Boolean)

  return (
    <>
      <Head>
        <title>
          {mergedContent.groom_name} &amp; {mergedContent.bride_name}
        </title>
        <meta name='description' content={`Thiệp cưới — ${mergedContent.groom_name} và ${mergedContent.bride_name}`} />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap'
          rel='stylesheet'
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${bg}; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
          html { scroll-behavior: smooth; }

          @keyframes minFadeUp {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes minFadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes minHeroZoom {
            from { transform: scale(1.06); }
            to   { transform: scale(1); }
          }
          @keyframes minScrollPulse {
            0%, 100% { opacity: 0.8; transform: translateY(0); }
            50%       { opacity: 0.3; transform: translateY(6px); }
          }
          @keyframes minLine {
            from { width: 0; }
            to   { width: 100%; }
          }

          .m-up    { animation: minFadeUp 1s cubic-bezier(.16,1,.3,1) both; }
          .m-zoom  { animation: minHeroZoom 2.2s cubic-bezier(.16,1,.3,1) both; }
          .m-in    { animation: minFadeIn 1.4s ease both; }
          .m-d1    { animation-delay: 0.2s; }
          .m-d2    { animation-delay: 0.4s; }
          .m-d3    { animation-delay: 0.6s; }
          .m-d4    { animation-delay: 0.8s; }
          .m-d5    { animation-delay: 1s; }

          .m-photo {
            overflow: hidden;
            transition: transform 0.7s cubic-bezier(.16,1,.3,1);
            cursor: pointer;
          }
          .m-photo:hover { transform: scale(1.018); }

          .m-line { height: 1px; background: ${inkFaint}; }
          .m-accent-line { height: 1.5px; background: ${accent}; }

          .m-btn { transition: background 0.25s, color 0.25s, box-shadow 0.25s; }
          .m-btn:hover { box-shadow: 0 6px 24px rgba(13,13,13,0.15); }

          .m-count-cell:not(:last-child) { border-right: 1px solid ${inkFaint}; }

          .m-scroll-arr {
            animation: minScrollPulse 2s ease-in-out infinite;
          }
        `}</style>
      </Head>

      <div
        style={{
          minHeight: '100vh',
          background: bg,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          color: ink,
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
            overflow: 'hidden'
          }}
        >
          {/* Top bar */}
          <div
            style={{
              padding: '28px 40px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              zIndex: 10
            }}
          >
            <p
              className='m-in'
              style={{
                fontSize: 9,
                letterSpacing: '0.5em',
                color: 'rgba(255,255,255,0.6)',
                textTransform: 'uppercase'
              }}
            >
              WEDDING INVITATION
            </p>
            <p
              className='m-in'
              style={{
                fontSize: 9,
                letterSpacing: '0.4em',
                color: 'rgba(255,255,255,0.45)',
                textTransform: 'uppercase'
              }}
            >
              MoiMoi Studio
            </p>
          </div>

          {/* Full screen cover image */}
          {mergedContent.cover_image ? (
            <div
              className='m-zoom'
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${mergedContent.cover_image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.72) saturate(0.85)'
              }}
            />
          ) : (
            <div
              style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, #2a2a2a 0%, #111 100%)` }}
            />
          )}

          {/* Gradient overlay — darkest at bottom */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.72) 85%, rgba(0,0,0,0.88) 100%)'
            }}
          />

          {/* Names — positioned at bottom of hero */}
          <div
            style={{
              marginTop: 'auto',
              padding: '60px 44px 56px',
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div className='m-accent-line m-up' style={{ width: 40, marginBottom: 28 }} />

            <h1
              className='m-up m-d1'
              style={{
                fontSize: 'clamp(3.5rem, 11vw, 8rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: '#ffffff',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                textShadow: '0 2px 40px rgba(0,0,0,0.3)'
              }}
            >
              {mergedContent.groom_name}
            </h1>

            <div className='m-up m-d2' style={{ display: 'flex', alignItems: 'center', gap: 20, margin: '20px 0' }}>
              <div className='m-accent-line' style={{ width: 28 }} />
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 300,
                  letterSpacing: '0.18em',
                  color: 'rgba(255,255,255,0.6)',
                  textTransform: 'uppercase'
                }}
              >
                and
              </p>
              <div className='m-accent-line' style={{ width: 28 }} />
            </div>

            <h1
              className='m-up m-d3'
              style={{
                fontSize: 'clamp(3.5rem, 11vw, 8rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: '#ffffff',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                textShadow: '0 2px 40px rgba(0,0,0,0.3)',
                marginBottom: 32
              }}
            >
              {mergedContent.bride_name}
            </h1>

            {mergedContent.wedding_date && (
              <p
                className='m-up m-d4'
                style={{ fontSize: 14, fontWeight: 300, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.65)' }}
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

          {/* Scroll indicator */}
          <div className='m-scroll-arr' style={{ position: 'absolute', bottom: 28, right: 44, zIndex: 2 }}>
            <svg width='20' height='36' viewBox='0 0 20 36' fill='none'>
              <rect x='9' y='1' width='2' height='20' rx='1' fill='rgba(255,255,255,0.5)' />
              <path
                d='M4 22l6 8 6-8'
                stroke='rgba(255,255,255,0.5)'
                strokeWidth='1.5'
                fill='none'
                strokeLinecap='round'
              />
            </svg>
          </div>
        </section>

        {/* ══ Quote ══ */}
        <section style={{ padding: '100px 44px', borderBottom: `1px solid ${inkFaint}` }}>
          <div style={{ maxWidth: 700 }}>
            <div className='m-accent-line' style={{ width: 32, marginBottom: 36 }} />
            <p
              className='m-up'
              style={{
                fontSize: 'clamp(1.1rem, 3.5vw, 1.5rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: inkMid,
                lineHeight: 1.9,
                letterSpacing: '0.01em'
              }}
            >
              Hai gia đình trân trọng kính mời quý vị tới dự lễ thành hôn của
            </p>
            <p
              className='m-up m-d1'
              style={{
                fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
                fontWeight: 400,
                color: ink,
                marginTop: 20,
                letterSpacing: '0.01em'
              }}
            >
              {mergedContent.groom_name} &amp; {mergedContent.bride_name}
            </p>
          </div>
        </section>

        {/* ══ Countdown ══ */}
        {timeRemaining && (
          <section style={{ padding: '100px 44px', borderBottom: `1px solid ${inkFaint}` }}>
            <div style={{ maxWidth: 820 }}>
              <p
                className='m-up'
                style={{
                  fontSize: 9,
                  letterSpacing: '0.5em',
                  color: accent,
                  textTransform: 'uppercase',
                  marginBottom: 52
                }}
              >
                COUNTDOWN
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
                {[
                  { label: 'Days', value: timeRemaining.days },
                  { label: 'Hours', value: timeRemaining.hours },
                  { label: 'Minutes', value: timeRemaining.minutes },
                  { label: 'Seconds', value: timeRemaining.seconds }
                ].map((item, i) => (
                  <div
                    key={item.label}
                    className={`m-count-cell m-up m-d${i + 1}`}
                    style={{ textAlign: 'center', padding: '0 16px', paddingBottom: 8 }}
                  >
                    <div
                      style={{
                        fontSize: 'clamp(3.5rem, 9vw, 6rem)',
                        fontWeight: 200,
                        letterSpacing: '-0.03em',
                        color: ink,
                        lineHeight: 1,
                        marginBottom: 16
                      }}
                    >
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div style={{ fontSize: 9, letterSpacing: '0.32em', color: inkLight, textTransform: 'uppercase' }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className='m-accent-line' style={{ width: 40, marginTop: 52 }} />
            </div>
          </section>
        )}

        {/* ══ Event Details ══ */}
        <section style={{ padding: '100px 44px', borderBottom: `1px solid ${inkFaint}` }}>
          <div style={{ maxWidth: 820 }}>
            <p
              className='m-up'
              style={{
                fontSize: 9,
                letterSpacing: '0.5em',
                color: accent,
                textTransform: 'uppercase',
                marginBottom: 56
              }}
            >
              EVENT DETAILS
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 52 }}>
              {[
                {
                  label: 'DATE',
                  value: mergedContent.wedding_date
                    ? new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : null
                },
                { label: 'TIME', value: mergedContent.wedding_time },
                { label: 'VENUE', value: mergedContent.address }
              ].map(({ label, value }) => (
                <div key={label} className='m-up'>
                  <p
                    style={{
                      fontSize: 9,
                      letterSpacing: '0.4em',
                      color: accent,
                      textTransform: 'uppercase',
                      marginBottom: 16,
                      fontWeight: 400
                    }}
                  >
                    {label}
                  </p>
                  <div className='m-accent-line' style={{ width: 20, marginBottom: 16 }} />
                  <p style={{ fontSize: 20, fontWeight: 300, color: ink, lineHeight: 1.65 }}>{value || '—'}</p>
                </div>
              ))}
            </div>

            {mergedContent.map_url && (
              <div style={{ marginTop: 56 }}>
                <a
                  href={mergedContent.map_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='m-btn'
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 36px',
                    border: `1px solid ${ink}`,
                    color: ink,
                    textDecoration: 'none',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 14,
                    fontWeight: 400,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase'
                  }}
                >
                  Xem bản đồ
                </a>
              </div>
            )}
          </div>
        </section>

        {/* ══ Cover + Album ══ */}
        {(mergedContent.cover_image || albumImages.length > 0) && (
          <section style={{ padding: '100px 40px', borderTop: `1px solid ${ink}0d`, background: '#fafafa' }}>
            <div style={{ maxWidth: 1060, margin: '0 auto' }}>
              <p
                className='m-up'
                style={{
                  fontSize: 10,
                  letterSpacing: '0.5em',
                  color: inkLight,
                  textTransform: 'uppercase',
                  marginBottom: 56
                }}
              >
                OUR MOMENTS
              </p>

              {mergedContent.cover_image && (
                <div className='m-photo' style={{ marginBottom: 16, maxHeight: 580, overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mergedContent.cover_image}
                    alt='Wedding Cover'
                    style={{
                      width: '100%',
                      maxHeight: 580,
                      display: 'block',
                      filter: 'grayscale(10%)',
                      ...getImageStyle(resolveImageAdjust(mergedContent.cover_image_position, viewport))
                    }}
                  />
                </div>
              )}

              {albumImages.length > 0 && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))',
                    gap: 12,
                    marginTop: 12
                  }}
                >
                  {albumImages.map((img: string, i: number) => (
                    <div key={i} className='m-photo' style={{ height: 260 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`Ảnh cưới ${i + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'block',
                          filter: 'grayscale(8%)',
                          ...getImageStyle(resolveImageAdjust(mergedContent.image_positions?.[i], viewport))
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ══ Gift / Bank ══ */}
        {mergedContent.account_number && (
          <section style={{ padding: '100px 44px', borderBottom: `1px solid ${inkFaint}` }}>
            <div style={{ maxWidth: 580 }}>
              <p
                className='m-up'
                style={{
                  fontSize: 9,
                  letterSpacing: '0.5em',
                  color: accent,
                  textTransform: 'uppercase',
                  marginBottom: 40
                }}
              >
                GIFT
              </p>
              <p
                className='m-up m-d1'
                style={{
                  fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                  fontWeight: 300,
                  color: inkMid,
                  lineHeight: 1.9,
                  marginBottom: 48,
                  fontStyle: 'italic'
                }}
              >
                Sự hiện diện của bạn là món quà quý giá nhất.
              </p>
              <div className='m-up m-d2' style={{ paddingTop: 36, borderTop: `1px solid ${inkFaint}` }}>
                {mergedContent.bank_name && (
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: inkLight,
                      letterSpacing: '0.18em',
                      marginBottom: 12,
                      textTransform: 'uppercase'
                    }}
                  >
                    {mergedContent.bank_name}
                  </p>
                )}
                <p
                  style={{
                    fontSize: 'clamp(2rem, 6vw, 3.2rem)',
                    fontWeight: 200,
                    color: ink,
                    letterSpacing: '0.04em',
                    marginBottom: 12
                  }}
                >
                  {mergedContent.account_number}
                </p>
                {mergedContent.account_name && (
                  <p style={{ fontSize: 15, fontWeight: 300, color: inkMid, fontStyle: 'italic' }}>
                    {mergedContent.account_name}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ══ Footer ══ */}
        <footer
          style={{
            padding: '56px 44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16
          }}
        >
          <p style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 300, fontStyle: 'italic', color: ink }}>
            {mergedContent.groom_name} &amp; {mergedContent.bride_name}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <div className='m-accent-line' style={{ width: 24, alignSelf: 'flex-end' }} />
            <p style={{ fontSize: 9, color: inkLight, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              MoiMoi Studio
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
