import RSVPForm from '@/components/guest/RSVPForm'
import { Calendar, Clock, Heart, MapPin } from 'lucide-react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'

export default function VintageGeneralView({ wedding }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = {
    ...(templateData?.default_content || {}),
    ...content
  }

  const primaryColor = mergedContent.primary_color || '#8B6914'
  const accentColor = '#D4A853'
  const creamBg = '#FFF8E7'
  const parchment = '#F5E6C8'

  // Countdown timer
  useEffect(() => {
    if (mergedContent.wedding_date) {
      const interval = setInterval(() => {
        const weddingDate = new Date(`${mergedContent.wedding_date}T${mergedContent.wedding_time || '00:00'}`)
        const now = new Date()
        const diff = weddingDate.getTime() - now.getTime()

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)
          setTimeRemaining({ days, hours, minutes, seconds })
        } else {
          setTimeRemaining(null)
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [mergedContent.wedding_date, mergedContent.wedding_time])

  if (!wedding) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: creamBg,
          fontFamily: "'Lora', Georgia, serif"
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: primaryColor, marginBottom: '8px', fontFamily: "'Playfair Display', serif" }}>
            404 — Không tìm thấy thiệp cưới
          </h1>
          <p style={{ color: '#8B7355' }}>Slug này không tồn tại hoặc đã bị xóa.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>
          {mergedContent.groom_name} &amp; {mergedContent.bride_name} — Thiệp Cưới Vintage
        </title>
        <meta
          name='description'
          content={`Trân trọng kính mời bạn đến dự lễ thành hôn của ${mergedContent.groom_name} và ${mergedContent.bride_name}`}
        />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Great+Vibes&display=swap'
          rel='stylesheet'
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${creamBg}; -webkit-font-smoothing: antialiased; }

          @keyframes vintageFadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes gentlePulse {
            0%, 100% { transform: scale(1); }
            50%      { transform: scale(1.05); }
          }
          @keyframes floatSoft {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50%      { transform: translateY(-8px) rotate(1deg); }
          }
          @keyframes shimmerGold {
            0%   { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .v-fade { animation: vintageFadeIn 0.8s cubic-bezier(.22,.68,0,1.1) both; }
          .v-fade-d1 { animation-delay: 0.15s; }
          .v-fade-d2 { animation-delay: 0.3s; }
          .v-fade-d3 { animation-delay: 0.45s; }
          .v-pulse { animation: gentlePulse 3s ease-in-out infinite; }
          .v-float { animation: floatSoft 4s ease-in-out infinite; }

          .ornate-border {
            border: 2px solid ${accentColor};
            border-image: repeating-linear-gradient(
              45deg,
              ${accentColor},
              ${accentColor} 3px,
              transparent 3px,
              transparent 6px
            ) 8;
          }

          .vintage-card {
            background: linear-gradient(145deg, ${creamBg}, ${parchment}90);
            border: 1.5px solid ${accentColor}60;
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(139,105,20,.08), inset 0 1px 0 rgba(255,255,255,.6);
          }

          .gold-shimmer {
            background: linear-gradient(90deg, ${primaryColor}, ${accentColor}, ${primaryColor});
            background-size: 200% 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmerGold 4s linear infinite;
          }

          .polaroid {
            background: #fff;
            padding: 8px 8px 32px;
            box-shadow: 0 6px 24px rgba(0,0,0,.12), 0 2px 6px rgba(0,0,0,.08);
            transform: rotate(var(--rot, 0deg));
            transition: transform 0.4s ease, box-shadow 0.4s ease;
          }
          .polaroid:hover {
            transform: rotate(0deg) scale(1.03);
            box-shadow: 0 12px 40px rgba(0,0,0,.18);
          }

          .parchment-texture {
            position: relative;
          }
          .parchment-texture::before {
            content: '';
            position: absolute;
            inset: 0;
            background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.03'/%3E%3C/svg%3E");
            pointer-events: none;
            border-radius: inherit;
          }
        `}</style>
      </Head>

      <div
        className='parchment-texture'
        style={{
          minHeight: '100vh',
          background: `linear-gradient(170deg, ${creamBg} 0%, #FDF5E6 40%, ${parchment}50 100%)`,
          fontFamily: "'Lora', Georgia, serif",
          color: '#4A3728'
        }}
      >
        {/* ═══ Hero Section ═══ */}
        <section
          style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            padding: '60px 20px'
          }}
        >
          {/* Decorative corner ornaments */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => {
            const isTop = pos.includes('top')
            const isLeft = pos.includes('left')
            return (
              <div
                key={pos}
                style={{
                  position: 'absolute',
                  [isTop ? 'top' : 'bottom']: 24,
                  [isLeft ? 'left' : 'right']: 24,
                  width: 60,
                  height: 60,
                  borderTop: isTop ? `2px solid ${accentColor}70` : 'none',
                  borderBottom: !isTop ? `2px solid ${accentColor}70` : 'none',
                  borderLeft: isLeft ? `2px solid ${accentColor}70` : 'none',
                  borderRight: !isLeft ? `2px solid ${accentColor}70` : 'none',
                  opacity: 0.6
                }}
              />
            )
          })}

          {/* Background decorative circles */}
          <div
            style={{
              position: 'absolute',
              top: '10%',
              right: '-5%',
              width: 300,
              height: 300,
              borderRadius: '50%',
              border: `1px solid ${accentColor}20`,
              pointerEvents: 'none'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '5%',
              left: '-8%',
              width: 250,
              height: 250,
              borderRadius: '50%',
              border: `1px solid ${accentColor}15`,
              pointerEvents: 'none'
            }}
          />

          <div className='v-fade' style={{ textAlign: 'center', maxWidth: 700, position: 'relative', zIndex: 1 }}>
            {/* Flourish top */}
            <div style={{ fontSize: '2rem', marginBottom: 12, opacity: 0.4, color: accentColor }}>✦ ✧ ✦</div>

            {/* Save The Date */}
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: primaryColor,
                marginBottom: 24
              }}
            >
              SAVE THE DATE
            </p>

            {/* Names */}
            <h1
              className='gold-shimmer'
              style={{
                fontFamily: "'Great Vibes', 'Playfair Display', cursive",
                fontSize: 'clamp(3rem, 10vw, 5.5rem)',
                fontWeight: 400,
                lineHeight: 1.2,
                marginBottom: 8
              }}
            >
              {mergedContent.groom_name}
            </h1>

            <div className='v-pulse' style={{ fontSize: '1.5rem', color: accentColor, margin: '8px 0' }}>
              &amp;
            </div>

            <h1
              className='gold-shimmer'
              style={{
                fontFamily: "'Great Vibes', 'Playfair Display', cursive",
                fontSize: 'clamp(3rem, 10vw, 5.5rem)',
                fontWeight: 400,
                lineHeight: 1.2,
                marginBottom: 24
              }}
            >
              {mergedContent.bride_name}
            </h1>

            {/* Ornate divider */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '24px 0' }}>
              <div
                style={{
                  height: 1,
                  width: 80,
                  background: `linear-gradient(to right, transparent, ${accentColor})`
                }}
              />
              <Heart size={20} fill={accentColor} color={accentColor} style={{ opacity: 0.8 }} />
              <div
                style={{
                  height: 1,
                  width: 80,
                  background: `linear-gradient(to left, transparent, ${accentColor})`
                }}
              />
            </div>

            {/* Date */}
            {mergedContent.wedding_date && (
              <p
                style={{
                  fontSize: 18,
                  color: '#6B5B3E',
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  letterSpacing: '0.05em'
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

            {/* Subtitle */}
            <p style={{ marginTop: 20, fontSize: 15, color: '#8B7355', fontStyle: 'italic', lineHeight: 1.7 }}>
              Trân trọng kính mời bạn đến dự buổi lễ thành hôn của chúng tôi
            </p>

            {/* Scroll indicator */}
            <div className='v-float' style={{ marginTop: 48, fontSize: 24, color: accentColor, opacity: 0.5 }}>
              ▽
            </div>
          </div>
        </section>

        {/* ═══ Countdown Section ═══ */}
        {timeRemaining && (
          <section style={{ padding: '64px 20px', background: `linear-gradient(135deg, ${parchment}40, ${creamBg})` }}>
            <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
              <div style={{ fontSize: 14, opacity: 0.35, color: accentColor, marginBottom: 8 }}>── ✦ ──</div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                  fontWeight: 700,
                  color: primaryColor,
                  marginBottom: 8
                }}
              >
                Đếm Ngược Đến Ngày Vui
              </h2>
              <p style={{ color: '#8B7355', fontSize: 15, fontStyle: 'italic', marginBottom: 32 }}>
                Chỉ còn một chút nữa thôi...
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 16,
                  maxWidth: 500,
                  margin: '0 auto'
                }}
              >
                {[
                  { label: 'Ngày', value: timeRemaining.days },
                  { label: 'Giờ', value: timeRemaining.hours },
                  { label: 'Phút', value: timeRemaining.minutes },
                  { label: 'Giây', value: timeRemaining.seconds }
                ].map((item) => (
                  <div key={item.label} className='vintage-card' style={{ padding: '20px 8px', textAlign: 'center' }}>
                    <div
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                        fontWeight: 700,
                        color: primaryColor,
                        lineHeight: 1,
                        marginBottom: 6
                      }}
                    >
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: '#8B7355'
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

        {/* ═══ Event Details Section ═══ */}
        <section style={{ padding: '80px 20px', background: creamBg }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ fontSize: 14, opacity: 0.35, color: accentColor, marginBottom: 8 }}>── ✦ ──</div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                  fontWeight: 700,
                  color: primaryColor,
                  marginBottom: 12
                }}
              >
                Thông Tin Sự Kiện
              </h2>
              <div
                style={{
                  width: 60,
                  height: 2,
                  margin: '0 auto',
                  background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {/* Date & Time Card */}
              <div className='vintage-card v-fade v-fade-d1' style={{ padding: '32px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: `${accentColor}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${accentColor}40`
                    }}
                  >
                    <Calendar size={22} color={primaryColor} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 18,
                      fontWeight: 600,
                      color: '#4A3728'
                    }}
                  >
                    Thời Gian
                  </h3>
                </div>
                <p style={{ color: '#5C4A35', fontSize: 16, lineHeight: 1.6, marginBottom: 8 }}>
                  {mergedContent.wedding_date &&
                    new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8B7355' }}>
                  <Clock size={16} />
                  <span style={{ fontSize: 15 }}>Lúc {mergedContent.wedding_time || '00:00'}</span>
                </div>
              </div>

              {/* Location Card */}
              <div className='vintage-card v-fade v-fade-d2' style={{ padding: '32px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: `${accentColor}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${accentColor}40`
                    }}
                  >
                    <MapPin size={22} color={primaryColor} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 18,
                      fontWeight: 600,
                      color: '#4A3728'
                    }}
                  >
                    Địa Điểm
                  </h3>
                </div>
                <p style={{ color: '#5C4A35', fontSize: 16, lineHeight: 1.6, marginBottom: 12 }}>
                  {mergedContent.address || '—'}
                </p>
                {mergedContent.map_url && (
                  <a
                    href={mergedContent.map_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 20px',
                      background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                      color: '#fff',
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                  >
                    <MapPin size={16} />
                    Xem Bản Đồ
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Gallery Section — Polaroid Style ═══ */}
        {mergedContent.images && mergedContent.images.length > 0 && (
          <section
            style={{ padding: '80px 20px', background: `linear-gradient(to bottom, ${creamBg}, ${parchment}30)` }}
          >
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div style={{ fontSize: 14, opacity: 0.35, color: accentColor, marginBottom: 8 }}>── ✦ ──</div>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                    fontWeight: 700,
                    color: primaryColor,
                    marginBottom: 12
                  }}
                >
                  Khoảnh Khắc Của Chúng Tôi
                </h2>
                <div
                  style={{
                    width: 60,
                    height: 2,
                    margin: '0 auto',
                    background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
                  }}
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: 32,
                  justifyItems: 'center'
                }}
              >
                {mergedContent.images.slice(0, 6).map((img: string, idx: number) => {
                  const rotations = [-3, 2, -1.5, 2.5, -2, 1.5]
                  return (
                    <div
                      key={idx}
                      className='polaroid v-fade'
                      style={
                        {
                          '--rot': `${rotations[idx % rotations.length]}deg`,
                          maxWidth: 280,
                          width: '100%',
                          animationDelay: `${idx * 0.12}s`
                        } as React.CSSProperties
                      }
                    >
                      <div style={{ overflow: 'hidden', aspectRatio: '4/3' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`Wedding photo ${idx + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'sepia(15%) saturate(90%)',
                            transition: 'filter 0.4s ease'
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ═══ RSVP Section ═══ */}
        <section style={{ padding: '80px 20px', background: creamBg }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ fontSize: 14, opacity: 0.35, color: accentColor, marginBottom: 8 }}>── ✦ ──</div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                  fontWeight: 700,
                  color: primaryColor,
                  marginBottom: 8
                }}
              >
                Xác Nhận Tham Dự
              </h2>
              <p style={{ color: '#8B7355', fontSize: 15, fontStyle: 'italic' }}>
                Vui lòng cho chúng tôi biết bạn có thể tham dự hay không
              </p>
            </div>

            <div className='vintage-card' style={{ padding: 32 }}>
              <RSVPForm weddingId={wedding.id} />
            </div>
          </div>
        </section>

        {/* ═══ Footer ═══ */}
        <footer
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            background: `linear-gradient(to bottom, ${creamBg}, ${parchment}50)`
          }}
        >
          {/* Ornate top flourish */}
          <div style={{ fontSize: 14, opacity: 0.35, color: accentColor, marginBottom: 20 }}>═══ ❦ ═══</div>

          <div className='v-pulse' style={{ marginBottom: 16 }}>
            <Heart size={28} fill={accentColor} color={accentColor} />
          </div>

          <p
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              color: primaryColor,
              marginBottom: 8
            }}
          >
            {mergedContent.groom_name} &amp; {mergedContent.bride_name}
          </p>

          <p style={{ color: '#8B7355', fontSize: 14, fontStyle: 'italic', marginBottom: 24 }}>
            Cảm ơn bạn đã đến chung vui cùng chúng tôi
          </p>

          <div
            style={{
              fontSize: 12,
              color: '#B8A88A',
              borderTop: `1px solid ${accentColor}30`,
              paddingTop: 20,
              maxWidth: 300,
              margin: '0 auto'
            }}
          >
            Powered by MoiMoi Studio
          </div>
        </footer>
      </div>
    </>
  )
}
