import RSVPForm from '@/components/guest/RSVPForm'
import { Calendar, Clock, Heart, MapPin } from 'lucide-react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'

export default function ModernGeneralView({ wedding }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [scrolled, setScrolled] = useState(false)

  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = {
    ...(templateData?.default_content || {}),
    ...content
  }

  const accent = mergedContent.primary_color || '#6366f1'
  const accentLight = '#818cf8'
  const darkBg = '#0f0f23'
  const cardBg = 'rgba(255,255,255,0.06)'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mergedContent.wedding_date) {
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
          background: darkBg,
          color: '#fff',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>404</h1>
          <p style={{ color: '#64748b' }}>Không tìm thấy thiệp cưới.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>
          {mergedContent.groom_name} &amp; {mergedContent.bride_name} — Modern Wedding
        </title>
        <meta
          name='description'
          content={`Thiệp cưới của ${mergedContent.groom_name} và ${mergedContent.bride_name}`}
        />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap'
          rel='stylesheet'
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${darkBg}; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
          html { scroll-behavior: smooth; }

          @keyframes heroReveal {
            from { opacity: 0; transform: translateY(60px) scale(0.95); filter: blur(10px); }
            to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          }
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-80px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(80px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(40px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px ${accent}30, 0 0 60px ${accent}10; }
            50%      { box-shadow: 0 0 40px ${accent}50, 0 0 80px ${accent}20; }
          }
          @keyframes pulse3d {
            0%, 100% { transform: scale(1) rotateZ(0deg); }
            25%  { transform: scale(1.05) rotateZ(1deg); }
            75%  { transform: scale(0.98) rotateZ(-1deg); }
          }
          @keyframes gradientShift {
            0%   { background-position: 0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes float3d {
            0%, 100% { transform: translateY(0) rotateX(0); }
            50%      { transform: translateY(-12px) rotateX(2deg); }
          }
          @keyframes countTick {
            0%   { transform: scale(1); }
            50%  { transform: scale(1.08); }
            100% { transform: scale(1); }
          }
          @keyframes orbitSlow {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes borderGlow {
            0%, 100% { border-color: ${accent}40; }
            50%      { border-color: ${accentLight}80; }
          }

          .m-hero    { animation: heroReveal 1.2s cubic-bezier(.16,1,.3,1) both; }
          .m-left    { animation: slideInLeft 0.9s cubic-bezier(.16,1,.3,1) both; }
          .m-right   { animation: slideInRight 0.9s cubic-bezier(.16,1,.3,1) both; }
          .m-fade    { animation: fadeUp 0.8s cubic-bezier(.16,1,.3,1) both; }
          .m-fade-d1 { animation-delay: 0.1s; }
          .m-fade-d2 { animation-delay: 0.2s; }
          .m-fade-d3 { animation-delay: 0.35s; }
          .m-fade-d4 { animation-delay: 0.5s; }
          .m-glow    { animation: glow 3s ease-in-out infinite; }
          .m-pulse3d { animation: pulse3d 4s ease-in-out infinite; }
          .m-float   { animation: float3d 5s ease-in-out infinite; }
          .m-tick    { animation: countTick 1s ease-in-out infinite; }

          .glass-card {
            background: ${cardBg};
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 24px;
            transition: transform 0.4s cubic-bezier(.16,1,.3,1), box-shadow 0.4s ease, border-color 0.4s ease;
          }
          .glass-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 60px rgba(0,0,0,.3), 0 0 30px ${accent}15;
            border-color: ${accent}30;
          }

          .gradient-text {
            background: linear-gradient(135deg, ${accent}, ${accentLight}, #c084fc, ${accent});
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradientShift 6s ease infinite;
          }

          .orbit-ring {
            position: absolute;
            border: 1px solid ${accent}15;
            border-radius: 50%;
            animation: orbitSlow 30s linear infinite;
          }

          .neon-line {
            height: 2px;
            background: linear-gradient(90deg, transparent, ${accent}, ${accentLight}, transparent);
            border-radius: 2px;
          }

          .photo-grid-item {
            overflow: hidden;
            border-radius: 20px;
            position: relative;
            cursor: pointer;
            transition: transform 0.5s cubic-bezier(.16,1,.3,1);
          }
          .photo-grid-item:hover {
            transform: scale(1.03);
          }
          .photo-grid-item::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,.6) 0%, transparent 50%);
            opacity: 0;
            transition: opacity 0.4s ease;
          }
          .photo-grid-item:hover::after {
            opacity: 1;
          }

          .btn-modern {
            position: relative;
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .btn-modern::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,.15), transparent);
            opacity: 0;
            transition: opacity 0.3s;
          }
          .btn-modern:hover::before { opacity: 1; }
          .btn-modern:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px ${accent}40;
          }
        `}</style>
      </Head>

      <div
        style={{
          minHeight: '100vh',
          background: darkBg,
          color: '#e2e8f0',
          fontFamily: "'Inter', sans-serif",
          overflowX: 'hidden'
        }}
      >
        {/* ══ Floating Nav Pill ══ */}
        <nav
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            padding: '10px 28px',
            background: scrolled ? 'rgba(15,15,35,.85)' : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            borderRadius: 50,
            border: scrolled ? '1px solid rgba(255,255,255,.08)' : '1px solid transparent',
            transition: 'all 0.5s cubic-bezier(.16,1,.3,1)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            opacity: scrolled ? 1 : 0,
            pointerEvents: scrolled ? 'auto' : 'none'
          }}
        >
          <Heart size={14} fill={accent} color={accent} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: '0.05em' }}>
            {mergedContent.groom_name} & {mergedContent.bride_name}
          </span>
        </nav>

        {/* ══ Hero Section ══ */}
        <section
          style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Orbit rings */}
          <div
            className='orbit-ring'
            style={{ width: 500, height: 500, top: '50%', left: '50%', marginTop: -250, marginLeft: -250 }}
          />
          <div
            className='orbit-ring'
            style={{
              width: 700,
              height: 700,
              top: '50%',
              left: '50%',
              marginTop: -350,
              marginLeft: -350,
              animationDuration: '45s',
              animationDirection: 'reverse'
            }}
          />
          <div
            className='orbit-ring'
            style={{
              width: 900,
              height: 900,
              top: '50%',
              left: '50%',
              marginTop: -450,
              marginLeft: -450,
              animationDuration: '60s'
            }}
          />

          {/* Gradient blobs */}
          <div
            style={{
              position: 'absolute',
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${accent}15, transparent 70%)`,
              top: '20%',
              right: '-10%',
              filter: 'blur(60px)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: 350,
              height: 350,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(168,85,247,.12), transparent 70%)',
              bottom: '10%',
              left: '-5%',
              filter: 'blur(60px)'
            }}
          />

          <div
            className='m-hero'
            style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '40px 20px', maxWidth: 800 }}
          >
            <p
              className='m-fade'
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: accentLight,
                marginBottom: 32
              }}
            >
              WE ARE GETTING MARRIED
            </p>

            <h1
              className='gradient-text m-fade m-fade-d1'
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(3rem, 10vw, 6rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                marginBottom: 16
              }}
            >
              {mergedContent.groom_name}
            </h1>

            <div
              className='m-pulse3d m-fade m-fade-d2'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '12px 0' }}
            >
              <div className='neon-line' style={{ width: 60 }} />
              <Heart size={24} fill={accent} color={accent} />
              <div className='neon-line' style={{ width: 60 }} />
            </div>

            <h1
              className='gradient-text m-fade m-fade-d3'
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(3rem, 10vw, 6rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                marginBottom: 32
              }}
            >
              {mergedContent.bride_name}
            </h1>

            {mergedContent.wedding_date && (
              <p
                className='m-fade m-fade-d4'
                style={{ fontSize: 18, color: '#94a3b8', fontWeight: 300, letterSpacing: '0.08em' }}
              >
                {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}

            <p
              className='m-fade m-fade-d4'
              style={{
                marginTop: 20,
                fontSize: 16,
                color: '#64748b',
                fontStyle: 'italic',
                maxWidth: 500,
                margin: '20px auto 0'
              }}
            >
              Trân trọng kính mời bạn đến dự buổi lễ thành hôn của chúng tôi
            </p>

            {/* Scroll indicator */}
            <div className='m-float' style={{ marginTop: 56 }}>
              <div
                style={{
                  width: 24,
                  height: 40,
                  border: `2px solid ${accent}50`,
                  borderRadius: 12,
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  padding: 6
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 10,
                    borderRadius: 4,
                    background: accent,
                    animation: 'fadeUp 1.5s ease-in-out infinite'
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ══ Countdown ══ */}
        {timeRemaining && (
          <section style={{ padding: '80px 20px', position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(180deg, transparent, ${accent}08, transparent)`
              }}
            />
            <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
              <p
                className='m-fade'
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: accentLight,
                  marginBottom: 12
                }}
              >
                COUNTDOWN
              </p>
              <h2
                className='m-fade gradient-text'
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                  fontWeight: 700,
                  marginBottom: 8
                }}
              >
                Đếm Ngược Đến Ngày Vui
              </h2>
              <p className='m-fade' style={{ color: '#64748b', marginBottom: 40 }}>
                Mỗi giây trôi qua là gần hơn một bước…
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                  { label: 'Ngày', value: timeRemaining.days },
                  { label: 'Giờ', value: timeRemaining.hours },
                  { label: 'Phút', value: timeRemaining.minutes },
                  { label: 'Giây', value: timeRemaining.seconds }
                ].map((item, i) => (
                  <div
                    key={item.label}
                    className={`glass-card m-fade m-fade-d${i + 1}`}
                    style={{ padding: '28px 12px', textAlign: 'center' }}
                  >
                    <div
                      className='m-tick'
                      style={{
                        fontFamily: "'Space Grotesk', monospace",
                        fontSize: 'clamp(2rem, 6vw, 3.2rem)',
                        fontWeight: 700,
                        color: '#fff',
                        lineHeight: 1,
                        marginBottom: 8,
                        textShadow: `0 0 20px ${accent}40`
                      }}
                    >
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: '#64748b'
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
        <section style={{ padding: '80px 20px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p
                className='m-fade'
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: accentLight,
                  marginBottom: 12
                }}
              >
                DETAILS
              </p>
              <h2
                className='gradient-text m-fade'
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                  fontWeight: 700,
                  marginBottom: 16
                }}
              >
                Thông Tin Sự Kiện
              </h2>
              <div className='neon-line m-fade' style={{ width: 80, margin: '0 auto' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              <div className='glass-card m-left' style={{ padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div
                    className='m-glow'
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      background: `${accent}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Calendar size={24} color={accent} />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
                    Thời Gian
                  </h3>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: 16, lineHeight: 1.7, marginBottom: 8 }}>
                  {mergedContent.wedding_date &&
                    new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8' }}>
                  <Clock size={16} />
                  <span>Lúc {mergedContent.wedding_time || '00:00'}</span>
                </div>
              </div>

              <div className='glass-card m-right' style={{ padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div
                    className='m-glow'
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      background: `${accent}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <MapPin size={24} color={accent} />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
                    Địa Điểm
                  </h3>
                </div>
                <p style={{ color: '#cbd5e1', fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
                  {mergedContent.address || '—'}
                </p>
                {mergedContent.map_url && (
                  <a
                    href={mergedContent.map_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='btn-modern'
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '12px 24px',
                      background: `linear-gradient(135deg, ${accent}, ${accentLight})`,
                      color: '#fff',
                      borderRadius: 14,
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    <MapPin size={16} /> Xem Bản Đồ
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ══ Gallery ══ */}
        {mergedContent.images && mergedContent.images.length > 0 && (
          <section style={{ padding: '80px 20px' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <p
                  className='m-fade'
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: accentLight,
                    marginBottom: 12
                  }}
                >
                  GALLERY
                </p>
                <h2
                  className='gradient-text m-fade'
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                    fontWeight: 700,
                    marginBottom: 16
                  }}
                >
                  Khoảnh Khắc Của Chúng Tôi
                </h2>
                <div className='neon-line m-fade' style={{ width: 80, margin: '0 auto' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {mergedContent.images.slice(0, 6).map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className={`photo-grid-item m-fade`}
                    style={{ animationDelay: `${idx * 0.1}s`, aspectRatio: idx === 0 || idx === 5 ? '4/5' : '1/1' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Photo ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ RSVP ══ */}
        <section style={{ padding: '80px 20px', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg, transparent, ${accent}06, transparent)`
            }}
          />
          <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p
                className='m-fade'
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: accentLight,
                  marginBottom: 12
                }}
              >
                RSVP
              </p>
              <h2
                className='gradient-text m-fade'
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                  fontWeight: 700,
                  marginBottom: 8
                }}
              >
                Xác Nhận Tham Dự
              </h2>
              <p className='m-fade' style={{ color: '#64748b', fontSize: 15 }}>
                Vui lòng cho chúng tôi biết bạn có thể tham dự
              </p>
            </div>
            <div className='glass-card m-fade' style={{ padding: 32, animation: 'borderGlow 3s ease-in-out infinite' }}>
              <RSVPForm weddingId={wedding.id} />
            </div>
          </div>
        </section>

        {/* ══ Footer ══ */}
        <footer style={{ padding: '60px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,.05)' }}>
          <div className='m-pulse3d' style={{ marginBottom: 16 }}>
            <Heart size={28} fill={accent} color={accent} />
          </div>
          <p
            className='gradient-text'
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
              fontWeight: 700,
              marginBottom: 8
            }}
          >
            {mergedContent.groom_name} &amp; {mergedContent.bride_name}
          </p>
          <p style={{ color: '#475569', fontSize: 14 }}>Cảm ơn bạn đã đến chung vui cùng chúng tôi</p>
          <div style={{ marginTop: 24, fontSize: 12, color: '#334155' }}>Powered by MoiMoi Studio</div>
        </footer>
      </div>
    </>
  )
}
