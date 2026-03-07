import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'

export default function OceanGeneralView({ wedding }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }

  const teal = mergedContent.primary_color || '#0a7b96'
  const tealDark = '#065a70'
  const aqua = '#4ec6d8'
  const seafoam = '#e0f6fa'
  const deep = '#0a2435'
  const textDark = '#0d2d38'
  const textMid = '#2a6878'
  const white = '#ffffff'

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
          background: deep
        }}
      >
        <h1 style={{ color: aqua, fontFamily: "'Playfair Display', serif" }}>Không tìm thấy thiệp cưới</h1>
      </div>
    )

  const albumImages: string[] = mergedContent.images?.length > 0 ? mergedContent.images : []

  return (
    <>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Nunito:wght@300;400&display=swap'
          rel='stylesheet'
        />
        <style>{`
          @keyframes waveMove { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
          @keyframes oceanFade { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
          @keyframes bubbleRise { 0%{transform:translateY(0) scale(1);opacity:0.6} 100%{transform:translateY(-80px) scale(0.4);opacity:0} }
          .oc-up{animation:oceanFade 1s ease forwards;opacity:0}
          .oc-d1{animation-delay:.2s} .oc-d2{animation-delay:.5s} .oc-d3{animation-delay:.8s} .oc-d4{animation-delay:1.1s}
          .oc-wave{animation:waveMove 8s linear infinite}
          *{box-sizing:border-box;margin:0;padding:0}
        `}</style>
      </Head>
      <div style={{ background: seafoam, fontFamily: "'Nunito', sans-serif", color: textDark, overflowX: 'hidden' }}>
        {/* ── HERO ── */}
        <section
          style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: deep,
            overflow: 'hidden',
            textAlign: 'center'
          }}
        >
          {mergedContent.cover_image && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${mergedContent.cover_image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.4) saturate(0.7) hue-rotate(10deg)'
              }}
            />
          )}
          {/* Ocean gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to bottom, rgba(10,36,53,0.5) 0%, rgba(10,36,53,0.2) 35%, rgba(10,36,53,0.7) 75%, rgba(10,36,53,0.95) 100%)`
            }}
          />

          {/* Animated wave at bottom */}
          <div
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, overflow: 'hidden', height: 80, zIndex: 2 }}
          >
            <svg className='oc-wave' width='200%' height='80' viewBox='0 0 1440 80' preserveAspectRatio='none'>
              <path
                d='M0 40 C180 10 360 70 540 40 C720 10 900 70 1080 40 C1260 10 1440 70 1440 40 L1440 80 L0 80 Z'
                fill={seafoam}
                opacity='0.15'
              />
              <path
                d='M0 55 C240 25 480 75 720 50 C960 25 1200 70 1440 55 L1440 80 L0 80 Z'
                fill={seafoam}
                opacity='0.1'
              />
            </svg>
          </div>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 3, padding: '60px 28px' }}>
            {/* Shell ornament */}
            <div className='oc-up oc-d1' style={{ marginBottom: 20 }}>
              <svg width='44' height='44' viewBox='0 0 44 44' fill='none'>
                <path
                  d='M22 4 C12 4 4 12 4 22 C4 32 12 40 22 40 C32 40 40 32 40 22'
                  stroke={aqua}
                  strokeWidth='0.8'
                  fill='none'
                  opacity='0.6'
                />
                <path
                  d='M22 8 C15 8 8 15 8 22 C8 29 15 36 22 36'
                  stroke={aqua}
                  strokeWidth='0.6'
                  fill='none'
                  opacity='0.4'
                />
                <path
                  d='M22 12 C18 12 12 18 12 22 C12 26 18 32 22 32'
                  stroke={aqua}
                  strokeWidth='0.5'
                  fill='none'
                  opacity='0.3'
                />
                <circle cx='22' cy='22' r='2.5' fill={aqua} opacity='0.6' />
              </svg>
            </div>
            <p
              className='oc-up oc-d1'
              style={{
                fontSize: 9,
                letterSpacing: '0.5em',
                color: 'rgba(78,198,216,0.7)',
                textTransform: 'uppercase',
                marginBottom: 20
              }}
            >
              Wedding Invitation
            </p>
            <h1
              className='oc-up oc-d2'
              style={{
                fontSize: 'clamp(2.8rem,11vw,6.5rem)',
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
                fontStyle: 'italic',
                color: white,
                lineHeight: 1.15,
                textShadow: '0 2px 30px rgba(10,123,150,0.5)',
                marginBottom: 6
              }}
            >
              {mergedContent.groom_name || 'Chú Rể'}
            </h1>
            <div
              className='oc-up oc-d2'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '16px 0' }}
            >
              <div style={{ width: 36, height: 1, background: `rgba(78,198,216,0.4)` }} />
              <svg width='20' height='10' viewBox='0 0 20 10'>
                <path
                  d='M0 5 C5 0 15 0 20 5 C15 10 5 10 0 5 Z'
                  fill='none'
                  stroke={aqua}
                  strokeWidth='0.7'
                  opacity='0.7'
                />
              </svg>
              <div style={{ width: 36, height: 1, background: `rgba(78,198,216,0.4)` }} />
            </div>
            <h1
              className='oc-up oc-d3'
              style={{
                fontSize: 'clamp(2.8rem,11vw,6.5rem)',
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
                fontStyle: 'italic',
                color: white,
                lineHeight: 1.15,
                textShadow: '0 2px 30px rgba(10,123,150,0.5)',
                marginBottom: 28
              }}
            >
              {mergedContent.bride_name || 'Cô Dâu'}
            </h1>
            <div
              className='oc-up oc-d3'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 18 }}
            >
              <div style={{ width: 28, height: 1, background: `rgba(78,198,216,0.35)` }} />
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: aqua, opacity: 0.6 }} />
              <div style={{ width: 28, height: 1, background: `rgba(78,198,216,0.35)` }} />
            </div>
            {mergedContent.wedding_date && (
              <p
                className='oc-up oc-d4'
                style={{
                  fontSize: 13,
                  letterSpacing: '0.15em',
                  color: 'rgba(255,255,255,0.65)',
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
          <section style={{ background: tealDark, padding: '60px 24px', textAlign: 'center' }}>
            <p
              style={{ fontSize: 9, letterSpacing: '0.5em', color: aqua, textTransform: 'uppercase', marginBottom: 30 }}
            >
              Đếm ngược đến ngày hạnh phúc
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, maxWidth: 360, margin: '0 auto' }}>
              {[
                { v: timeRemaining.days, l: 'Ngày' },
                { v: timeRemaining.hours, l: 'Giờ' },
                { v: timeRemaining.minutes, l: 'Phút' },
                { v: timeRemaining.seconds, l: 'Giây' }
              ].map((it, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div
                    style={{
                      background: 'rgba(78,198,216,0.1)',
                      border: `1px solid rgba(78,198,216,0.25)`,
                      borderRadius: 8,
                      padding: '14px 6px',
                      marginBottom: 8
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontSize: 'clamp(1.8rem,6vw,3rem)',
                        fontFamily: "'Playfair Display', serif",
                        color: aqua,
                        lineHeight: 1
                      }}
                    >
                      {String(it.v).padStart(2, '0')}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 9,
                      letterSpacing: '0.25em',
                      color: 'rgba(78,198,216,0.55)',
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
        <section style={{ background: seafoam, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                width: 48,
                height: 2,
                background: `linear-gradient(to right, transparent, ${teal}, transparent)`,
                margin: '0 auto 24px'
              }}
            />
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
            <p style={{ fontSize: 14, lineHeight: 1.85, color: textMid }}>
              {mergedContent.intro_text ||
                'Giữa muôn trùng đại dương cuộc đời, chúng tôi tìm thấy nhau. Như sóng biển gặp bờ, như thủy triều đến đúng lúc — tình yêu của chúng tôi là mãi mãi.'}
            </p>
          </div>
        </section>

        {/* ── EVENT DETAILS ── */}
        <section style={{ background: `linear-gradient(160deg, ${teal}22 0%, ${aqua}15 100%)`, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p
                style={{
                  fontSize: 9,
                  letterSpacing: '0.5em',
                  color: teal,
                  textTransform: 'uppercase',
                  marginBottom: 10
                }}
              >
                Thông tin lễ cưới
              </p>
              <h2
                style={{
                  fontSize: 'clamp(1.6rem,5vw,2.6rem)',
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  color: textDark
                }}
              >
                Sự kiện trọng đại
              </h2>
            </div>
            {[
              { label: 'Ngày tổ chức', value: mergedContent.event_date || mergedContent.wedding_date },
              { label: 'Giờ lễ cưới', value: mergedContent.wedding_time },
              { label: 'Địa điểm', value: mergedContent.address },
              { label: 'Lịch âm', value: mergedContent.lunar_date }
            ]
              .filter((it) => it.value)
              .map((it, i) => (
                <div key={i} style={{ padding: '16px 0', borderBottom: `1px solid rgba(10,123,150,0.12)` }}>
                  <p
                    style={{
                      fontSize: 9,
                      letterSpacing: '0.3em',
                      color: teal,
                      textTransform: 'uppercase',
                      marginBottom: 4
                    }}
                  >
                    {it.label}
                  </p>
                  <p style={{ fontSize: 15, color: textDark, lineHeight: 1.5 }}>{it.value}</p>
                </div>
              ))}
            {mergedContent.map_url && (
              <a
                href={mergedContent.map_url}
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  display: 'inline-block',
                  marginTop: 28,
                  padding: '12px 32px',
                  background: teal,
                  color: white,
                  textDecoration: 'none',
                  fontSize: 10,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  borderRadius: 24
                }}
              >
                Xem bản đồ
              </a>
            )}
          </div>
        </section>

        {/* ── ALBUM ── */}
        {albumImages.length > 0 && (
          <section style={{ background: seafoam, padding: '72px 24px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.4em',
                    color: teal,
                    textTransform: 'uppercase',
                    marginBottom: 8
                  }}
                >
                  Kỷ niệm
                </p>
                <h2
                  style={{
                    fontSize: 'clamp(1.6rem,5vw,2.6rem)',
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: 'italic',
                    color: textDark
                  }}
                >
                  Album ảnh cưới
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {albumImages.slice(0, 4).map((img: string, i: number) => (
                  <div
                    key={i}
                    style={{
                      aspectRatio: '1',
                      overflow: 'hidden',
                      borderRadius: 12,
                      border: `3px solid rgba(10,123,150,0.12)`,
                      boxShadow: '0 4px 18px rgba(10,123,150,0.12)'
                    }}
                  >
                    <img src={img} alt='' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── GIFT ── */}
        {(mergedContent.bank_name || mergedContent.account_number) && (
          <section style={{ background: tealDark, padding: '72px 24px' }}>
            <div style={{ maxWidth: 420, margin: '0 auto', textAlign: 'center' }}>
              <p
                style={{
                  fontSize: 9,
                  letterSpacing: '0.4em',
                  color: aqua,
                  textTransform: 'uppercase',
                  marginBottom: 14
                }}
              >
                Hộp mừng cưới
              </p>
              <h2
                style={{
                  fontSize: 'clamp(1.6rem,5vw,2.4rem)',
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  color: white,
                  marginBottom: 8
                }}
              >
                Tấm lòng quý khách
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 28, fontStyle: 'italic' }}>
                Sự hiện diện của bạn là điều quý giá nhất.
              </p>
              <div
                style={{
                  border: `1px solid rgba(78,198,216,0.25)`,
                  borderRadius: 12,
                  padding: '28px 20px',
                  background: 'rgba(78,198,216,0.06)'
                }}
              >
                {mergedContent.account_name && (
                  <p
                    style={{
                      fontSize: 18,
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: 'italic',
                      color: aqua,
                      marginBottom: 8
                    }}
                  >
                    {mergedContent.account_name}
                  </p>
                )}
                {mergedContent.bank_name && (
                  <p
                    style={{
                      fontSize: 10,
                      letterSpacing: '0.25em',
                      color: 'rgba(255,255,255,0.45)',
                      textTransform: 'uppercase',
                      marginBottom: 6
                    }}
                  >
                    {mergedContent.bank_name}
                  </p>
                )}
                {mergedContent.account_number && (
                  <p style={{ fontSize: 22, color: white, letterSpacing: '0.1em' }}>{mergedContent.account_number}</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── FOOTER ── */}
        <section style={{ background: deep, padding: '52px 24px', textAlign: 'center' }}>
          <div style={{ position: 'relative', overflow: 'hidden', marginBottom: 20 }}>
            <svg
              className='oc-wave'
              width='200%'
              height='30'
              viewBox='0 0 1440 30'
              preserveAspectRatio='none'
              style={{ opacity: 0.15 }}
            >
              <path
                d='M0 15 C180 5 360 25 540 15 C720 5 900 25 1080 15 C1260 5 1440 25 1440 15 L1440 30 L0 30 Z'
                fill={aqua}
              />
            </svg>
          </div>
          <p
            style={{
              fontSize: 'clamp(1.2rem,4vw,2rem)',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              color: white,
              marginBottom: 8
            }}
          >
            {mergedContent.groom_name} & {mergedContent.bride_name}
          </p>
          {mergedContent.wedding_date && (
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.35em',
                color: `rgba(78,198,216,0.5)`,
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
              color: 'rgba(255,255,255,0.18)',
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
