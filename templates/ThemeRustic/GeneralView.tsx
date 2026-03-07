import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'

export default function RusticGeneralView({ wedding }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }

  const bark = '#3d1f0a'
  const barkMid = '#5a2e10'
  const honey = mergedContent.primary_color || '#c4873a'
  const honeyLight = '#e8ac60'
  const kraft = '#f0dfc0'
  const kraftDark = '#e0ccaa'
  const warmWhite = '#fdf8f0'
  const sage = '#6b7c5c'
  const textDark = '#2a1206'
  const textMid = '#6b3d1a'

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
          background: bark
        }}
      >
        <h1 style={{ color: honey, fontFamily: "'Playfair Display', serif" }}>Không tìm thấy thiệp cưới</h1>
      </div>
    )

  const albumImages: string[] = mergedContent.images?.length > 0 ? mergedContent.images : []

  return (
    <>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Source+Serif+4:ital,wght@0,300;1,300&display=swap'
          rel='stylesheet'
        />
        <style>{`
          @keyframes rsFade { from{opacity:0;transform:translateY(25px)} to{opacity:1;transform:translateY(0)} }
          @keyframes rsZoom { from{transform:scale(1)} to{transform:scale(1.05)} }
          @keyframes rsSway { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2deg)} }
          @keyframes rsLeaf { 0%{transform:translateY(-20px) rotate(0deg);opacity:0} 20%{opacity:0.8} 100%{transform:translateY(100vh) rotate(360deg);opacity:0} }
          .rs-up{animation:rsFade .9s ease forwards;opacity:0}
          .rs-d1{animation-delay:.25s} .rs-d2{animation-delay:.55s} .rs-d3{animation-delay:.85s} .rs-d4{animation-delay:1.1s}
          .rs-zoom{animation:rsZoom 14s ease-in-out infinite alternate}
          *{box-sizing:border-box;margin:0;padding:0}
        `}</style>
      </Head>
      <div
        style={{
          background: warmWhite,
          fontFamily: "'Source Serif 4', Georgia, serif",
          color: textDark,
          overflowX: 'hidden'
        }}
      >
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
              className='rs-zoom'
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${mergedContent.cover_image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.45) saturate(0.8) sepia(0.2)'
              }}
            />
          )}
          {!mergedContent.cover_image && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(160deg, ${bark} 0%, ${barkMid} 50%, ${bark} 100%)`
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(61,31,10,0.5) 0%, rgba(61,31,10,0.1) 35%, rgba(61,31,10,0.65) 70%, rgba(61,31,10,0.95) 100%)'
            }}
          />

          {/* Rope/twine accent top */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 8,
              background: `repeating-linear-gradient(90deg, ${honey} 0px, ${honeyLight} 8px, ${honey} 16px)`,
              opacity: 0.5
            }}
          />

          {/* Wooden board frame */}
          <div
            style={{
              position: 'absolute',
              inset: '5%',
              border: `2px solid rgba(196,135,58,0.25)`,
              pointerEvents: 'none'
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 'calc(5% + 8px)',
              border: `1px solid rgba(196,135,58,0.12)`,
              pointerEvents: 'none'
            }}
          />

          {/* SVG wheat/leaves top ornament */}
          <div
            className='rs-up rs-d1'
            style={{ position: 'relative', zIndex: 2, marginBottom: 12, marginTop: 'calc(5% + 20px)' }}
          >
            <svg width='120' height='40' viewBox='0 0 120 40' fill='none'>
              <line x1='60' y1='38' x2='60' y2='10' stroke={honey} strokeWidth='0.8' opacity='0.6' />
              {[30, 42, 54, 66, 78, 90].map((x, i) => (
                <ellipse
                  key={i}
                  cx={x}
                  cy={32 - Math.abs(i - 2.5) * 3}
                  rx='5'
                  ry='3'
                  fill={honey}
                  opacity={0.5 - Math.abs(i - 2.5) * 0.05}
                  transform={`rotate(${(x - 60) * 1.2}, ${x}, ${32 - Math.abs(i - 2.5) * 3})`}
                />
              ))}
              <path d='M60 10 C57 6 54 2 50 2 C52 5 56 8 60 10Z' fill={honeyLight} opacity='0.5' />
              <path d='M60 10 C63 6 66 2 70 2 C68 5 64 8 60 10Z' fill={honeyLight} opacity='0.5' />
            </svg>
          </div>

          <div style={{ position: 'relative', zIndex: 2, padding: '0 28px 60px' }}>
            <p
              className='rs-up rs-d1'
              style={{
                fontSize: 9,
                letterSpacing: '0.55em',
                color: honeyLight,
                textTransform: 'uppercase',
                marginBottom: 20,
                fontStyle: 'italic'
              }}
            >
              Together forever
            </p>
            <h1
              className='rs-up rs-d2'
              style={{
                fontSize: 'clamp(2.8rem,11vw,7rem)',
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontWeight: 400,
                color: kraft,
                lineHeight: 1.15,
                marginBottom: 10
              }}
            >
              {mergedContent.groom_name || 'Chú Rể'}
            </h1>
            {/* Ampersand divider */}
            <div
              className='rs-up rs-d2'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '16px 0' }}
            >
              <div
                style={{
                  width: 40,
                  height: '1px',
                  backgroundImage: `repeating-linear-gradient(90deg, ${honey} 0, ${honey} 2px, transparent 2px, transparent 6px)`
                }}
              />
              <p
                style={{
                  fontSize: 'clamp(2rem,7vw,4rem)',
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  color: honey,
                  lineHeight: 1
                }}
              >
                &
              </p>
              <div
                style={{
                  width: 40,
                  height: '1px',
                  backgroundImage: `repeating-linear-gradient(90deg, ${honey} 0, ${honey} 2px, transparent 2px, transparent 6px)`
                }}
              />
            </div>
            <h1
              className='rs-up rs-d3'
              style={{
                fontSize: 'clamp(2.8rem,11vw,7rem)',
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontWeight: 400,
                color: kraft,
                lineHeight: 1.15,
                marginBottom: 28
              }}
            >
              {mergedContent.bride_name || 'Cô Dâu'}
            </h1>

            {/* Bottom wheat ornament */}
            <div className='rs-up rs-d3' style={{ marginBottom: 16 }}>
              <svg width='100' height='24' viewBox='0 0 100 24' fill='none'>
                <line
                  x1='10'
                  y1='12'
                  x2='45'
                  y2='12'
                  stroke={honey}
                  strokeWidth='0.6'
                  strokeDasharray='2 4'
                  opacity='0.6'
                />
                <circle cx='50' cy='12' r='3' fill={honey} opacity='0.5' />
                <line
                  x1='55'
                  y1='12'
                  x2='90'
                  y2='12'
                  stroke={honey}
                  strokeWidth='0.6'
                  strokeDasharray='2 4'
                  opacity='0.6'
                />
                <circle cx='25' cy='12' r='2' fill={honey} opacity='0.35' />
                <circle cx='75' cy='12' r='2' fill={honey} opacity='0.35' />
              </svg>
            </div>

            {mergedContent.wedding_date && (
              <p
                className='rs-up rs-d4'
                style={{
                  fontSize: 13,
                  letterSpacing: '0.12em',
                  color: `rgba(240,220,192,0.75)`,
                  fontStyle: 'italic',
                  fontFamily: "'Playfair Display', serif"
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
          </div>
        </section>

        {/* ── COUNTDOWN ── */}
        {timeRemaining && (
          <section style={{ background: barkMid, padding: '60px 24px', textAlign: 'center' }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.5em',
                color: honey,
                textTransform: 'uppercase',
                fontStyle: 'italic',
                marginBottom: 28
              }}
            >
              Đếm ngược tới ngày cưới
            </p>
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
                      background: 'rgba(196,135,58,0.12)',
                      border: `1px solid rgba(196,135,58,0.3)`,
                      borderRadius: 6,
                      padding: '14px 4px',
                      marginBottom: 8
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontSize: 'clamp(1.8rem,6vw,3rem)',
                        fontFamily: "'Playfair Display', serif",
                        color: honey,
                        lineHeight: 1
                      }}
                    >
                      {String(it.v).padStart(2, '0')}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 9,
                      letterSpacing: '0.2em',
                      color: 'rgba(196,135,58,0.6)',
                      textTransform: 'uppercase'
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
        <section style={{ background: kraftDark, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
              <div
                style={{
                  flex: 1,
                  backgroundImage: `repeating-linear-gradient(90deg, ${honey} 0, ${honey} 1px, transparent 1px, transparent 8px)`,
                  height: 1,
                  opacity: 0.45
                }}
              />
              <div style={{ width: 5, height: 5, background: honey, borderRadius: '50%', opacity: 0.6 }} />
              <div
                style={{
                  flex: 1,
                  backgroundImage: `repeating-linear-gradient(90deg, ${honey} 0, ${honey} 1px, transparent 1px, transparent 8px)`,
                  height: 1,
                  opacity: 0.45
                }}
              />
            </div>
            <h2
              style={{
                fontSize: 'clamp(1.8rem,6vw,3rem)',
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                color: textDark,
                marginBottom: 20
              }}
            >
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: textMid, fontStyle: 'italic' }}>
              {mergedContent.intro_text ||
                'Dưới mái nhà ấm của vùng đất xanh tươi, chúng tôi chọn nhau cho mãi mãi. Mỗi khoảnh khắc bên nhau đều trở thành kỷ niệm đẹp không bao giờ phai.'}
            </p>
          </div>
        </section>

        {/* ── EVENT DETAILS ── */}
        <section style={{ background: warmWhite, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p
                style={{
                  fontSize: 9,
                  letterSpacing: '0.5em',
                  color: honey,
                  textTransform: 'uppercase',
                  fontStyle: 'italic',
                  marginBottom: 10
                }}
              >
                Lễ cưới xin
              </p>
              <h2
                style={{
                  fontSize: 'clamp(1.6rem,5vw,2.6rem)',
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  color: textDark
                }}
              >
                Ngày lành tháng đẹp
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14 }}>
                <div
                  style={{
                    flex: 1,
                    backgroundImage: `repeating-linear-gradient(90deg, ${honey} 0, ${honey} 1px, transparent 1px, transparent 8px)`,
                    height: 1,
                    opacity: 0.4,
                    maxWidth: 60
                  }}
                />
                <div style={{ width: 4, height: 4, background: honey, borderRadius: '50%', opacity: 0.5 }} />
                <div
                  style={{
                    flex: 1,
                    backgroundImage: `repeating-linear-gradient(90deg, ${honey} 0, ${honey} 1px, transparent 1px, transparent 8px)`,
                    height: 1,
                    opacity: 0.4,
                    maxWidth: 60
                  }}
                />
              </div>
            </div>
            {[
              { label: 'Ngày cưới', value: mergedContent.event_date || mergedContent.wedding_date },
              { label: 'Giờ cưới', value: mergedContent.wedding_time },
              { label: 'Địa điểm', value: mergedContent.address },
              { label: 'Lịch âm', value: mergedContent.lunar_date }
            ]
              .filter((it) => it.value)
              .map((it, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 14,
                    padding: '14px 0',
                    borderBottom: `1px dashed rgba(196,135,58,0.25)`
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: kraftDark,
                      border: `1px solid rgba(196,135,58,0.35)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <div style={{ width: 6, height: 6, background: honey, borderRadius: '50%', opacity: 0.7 }} />
                  </div>
                  <div style={{ paddingTop: 2 }}>
                    <p
                      style={{
                        fontSize: 9,
                        letterSpacing: '0.3em',
                        color: honey,
                        textTransform: 'uppercase',
                        fontStyle: 'italic',
                        marginBottom: 3
                      }}
                    >
                      {it.label}
                    </p>
                    <p style={{ fontSize: 15, color: textDark }}>{it.value}</p>
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
                  border: `1px solid ${honey}`,
                  color: honey,
                  textDecoration: 'none',
                  fontSize: 11,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  fontStyle: 'italic',
                  borderRadius: 4,
                  background: 'transparent'
                }}
              >
                Xem bản đồ
              </a>
            )}
          </div>
        </section>

        {/* ── ALBUM ── */}
        {albumImages.length > 0 && (
          <section style={{ background: kraft, padding: '72px 24px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.45em',
                    color: honey,
                    textTransform: 'uppercase',
                    fontStyle: 'italic',
                    marginBottom: 8
                  }}
                >
                  Album ảnh
                </p>
                <h2
                  style={{
                    fontSize: 'clamp(1.6rem,5vw,2.6rem)',
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: 'italic',
                    color: textDark
                  }}
                >
                  Khoảnh khắc đáng nhớ
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                {albumImages.slice(0, 4).map((img: string, i: number) => (
                  <div
                    key={i}
                    style={{
                      aspectRatio: '3/4',
                      overflow: 'hidden',
                      border: `3px solid ${warmWhite}`,
                      boxShadow: `0 4px 16px rgba(61,31,10,0.2)`,
                      transform: i % 2 === 0 ? 'rotate(-0.8deg)' : 'rotate(0.8deg)'
                    }}
                  >
                    <img
                      src={img}
                      alt=''
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'sepia(0.12) saturate(1.05) warm(0.1)'
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
          <section style={{ background: kraftDark, padding: '72px 24px' }}>
            <div style={{ maxWidth: 420, margin: '0 auto', textAlign: 'center' }}>
              <p
                style={{
                  fontSize: 9,
                  letterSpacing: '0.45em',
                  color: honey,
                  textTransform: 'uppercase',
                  fontStyle: 'italic',
                  marginBottom: 14
                }}
              >
                Mừng cưới
              </p>
              <h2
                style={{
                  fontSize: 'clamp(1.6rem,5vw,2.4rem)',
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  color: textDark,
                  marginBottom: 8
                }}
              >
                Tấm lòng thành
              </h2>
              <p style={{ fontSize: 13, color: textMid, fontStyle: 'italic', marginBottom: 28, lineHeight: 1.7 }}>
                Sự hiện diện của quý vị chính là món quà trân quý nhất với chúng tôi.
              </p>
              <div
                style={{
                  border: `1px dashed ${honey}`,
                  borderRadius: 8,
                  padding: '24px 20px',
                  background: warmWhite,
                  opacity: 0.95
                }}
              >
                {mergedContent.account_name && (
                  <p
                    style={{
                      fontSize: 17,
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: 'italic',
                      color: barkMid,
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
                      marginBottom: 6
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
                      fontFamily: "'Playfair Display', serif"
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
            background: bark,
            borderTop: `3px solid rgba(196,135,58,0.3)`,
            padding: '52px 24px',
            textAlign: 'center'
          }}
        >
          <svg width='40' height='20' viewBox='0 0 40 20' fill='none' style={{ marginBottom: 14, opacity: 0.6 }}>
            <line x1='4' y1='10' x2='36' y2='10' stroke={honey} strokeWidth='0.7' strokeDasharray='2 4' />
            <circle cx='20' cy='10' r='3' fill={honey} opacity='0.7' />
            <circle cx='12' cy='10' r='2' fill={honey} opacity='0.4' />
            <circle cx='28' cy='10' r='2' fill={honey} opacity='0.4' />
          </svg>
          <p
            style={{
              fontSize: 'clamp(1.2rem,4vw,2rem)',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              color: kraft,
              marginBottom: 6
            }}
          >
            {mergedContent.groom_name} & {mergedContent.bride_name}
          </p>
          {mergedContent.wedding_date && (
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.3em',
                color: 'rgba(196,135,58,0.5)',
                textTransform: 'uppercase'
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
