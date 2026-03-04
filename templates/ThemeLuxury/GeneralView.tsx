import RSVPForm from '@/components/guest/RSVPForm'
import { Calendar, Clock, Heart, MapPin } from 'lucide-react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'

export default function LuxuryGeneralView({ wedding }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }

  const gold = mergedContent.primary_color || '#C9A84C'
  const goldLight = '#E8D5A3'
  const goldDark = '#A08930'
  const darkBg = '#0a0a0a'
  const darkCard = '#141414'

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
          fontFamily: "'Cinzel', serif"
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: gold, marginBottom: 8 }}>404</h1>
          <p style={{ color: '#666' }}>Không tìm thấy thiệp cưới.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>
          {mergedContent.groom_name} &amp; {mergedContent.bride_name} — Royal Wedding
        </title>
        <meta
          name='description'
          content={`Thiệp cưới cao cấp — ${mergedContent.groom_name} và ${mergedContent.bride_name}`}
        />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Inter:wght@300;400;500&display=swap'
          rel='stylesheet'
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${darkBg}; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
          html { scroll-behavior: smooth; }

          @keyframes luxReveal {
            from { opacity: 0; transform: translateY(50px); filter: blur(6px); }
            to   { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          @keyframes luxSlideUp {
            from { opacity: 0; transform: translateY(40px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes luxSlideLeft {
            from { opacity: 0; transform: translateX(-60px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          @keyframes luxSlideRight {
            from { opacity: 0; transform: translateX(60px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          @keyframes goldShimmer {
            0%   { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes goldPulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50%      { opacity: 1; transform: scale(1.04); }
          }
          @keyframes diamondSpin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes borderShine {
            0%   { border-color: ${gold}20; }
            50%  { border-color: ${gold}60; }
            100% { border-color: ${gold}20; }
          }
          @keyframes breathe {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50%      { transform: scale(1.02); opacity: 1; }
          }
          @keyframes tickGold {
            0%, 100% { color: ${gold}; text-shadow: 0 0 20px ${gold}40; }
            50%      { color: ${goldLight}; text-shadow: 0 0 30px ${gold}60; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-10px); }
          }
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.9); }
            to   { opacity: 1; transform: scale(1); }
          }
          @keyframes marqueeGold {
            from { transform: translateX(100%); }
            to   { transform: translateX(-100%); }
          }

          .lx-reveal { animation: luxReveal 1.2s cubic-bezier(.16,1,.3,1) both; }
          .lx-up     { animation: luxSlideUp 0.9s cubic-bezier(.16,1,.3,1) both; }
          .lx-left   { animation: luxSlideLeft 0.9s cubic-bezier(.16,1,.3,1) both; }
          .lx-right  { animation: luxSlideRight 0.9s cubic-bezier(.16,1,.3,1) both; }
          .lx-up-d1  { animation-delay: 0.15s; }
          .lx-up-d2  { animation-delay: 0.3s; }
          .lx-up-d3  { animation-delay: 0.45s; }
          .lx-up-d4  { animation-delay: 0.6s; }
          .lx-pulse  { animation: goldPulse 3s ease-in-out infinite; }
          .lx-breathe { animation: breathe 4s ease-in-out infinite; }
          .lx-float  { animation: float 4s ease-in-out infinite; }
          .lx-tick   { animation: tickGold 2s ease-in-out infinite; }

          .gold-shimmer-text {
            background: linear-gradient(90deg, ${goldDark}, ${gold}, ${goldLight}, ${gold}, ${goldDark});
            background-size: 200% 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: goldShimmer 5s linear infinite;
          }

          .luxury-card {
            background: linear-gradient(145deg, ${darkCard}, #1a1a1a);
            border: 1px solid ${gold}15;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.03);
            transition: transform 0.5s cubic-bezier(.16,1,.3,1), box-shadow 0.5s ease, border-color 0.5s ease;
          }
          .luxury-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 20px 60px rgba(0,0,0,.5), 0 0 30px ${gold}08;
            border-color: ${gold}35;
          }

          .gold-border-glow {
            animation: borderShine 4s ease-in-out infinite;
          }

          .diamond-accent {
            width: 10px; height: 10px;
            background: ${gold};
            transform: rotate(45deg);
            display: inline-block;
            box-shadow: 0 0 12px ${gold}50;
          }

          .photo-lux {
            overflow: hidden;
            border-radius: 16px;
            border: 1px solid ${gold}15;
            position: relative;
            cursor: pointer;
            transition: transform 0.5s cubic-bezier(.16,1,.3,1), border-color 0.4s;
          }
          .photo-lux:hover {
            transform: scale(1.02);
            border-color: ${gold}40;
          }
          .photo-lux::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, ${darkBg}cc 0%, transparent 60%);
            opacity: 0;
            transition: opacity 0.4s;
          }
          .photo-lux:hover::after { opacity: 1; }

          .btn-luxury {
            position: relative;
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .btn-luxury::after {
            content: '';
            position: absolute;
            top: -50%; left: -50%;
            width: 200%; height: 200%;
            background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,.08) 50%, transparent 70%);
            transform: rotate(45deg) translateY(100%);
            transition: transform 0.6s ease;
          }
          .btn-luxury:hover::after { transform: rotate(45deg) translateY(-100%); }
          .btn-luxury:hover { transform: translateY(-3px); box-shadow: 0 12px 40px ${gold}30; }

          .marble-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, ${gold}40 20%, ${gold} 50%, ${gold}40 80%, transparent 100%);
            margin: 0 auto;
          }

          .ornate-corner {
            position: absolute;
            width: 80px; height: 80px;
            opacity: 0.3;
          }
          .ornate-corner::before,
          .ornate-corner::after {
            content: '';
            position: absolute;
            background: ${gold};
          }
          .ornate-corner.tl::before { top: 0; left: 0; width: 40px; height: 1px; }
          .ornate-corner.tl::after  { top: 0; left: 0; width: 1px; height: 40px; }
          .ornate-corner.tr::before { top: 0; right: 0; width: 40px; height: 1px; }
          .ornate-corner.tr::after  { top: 0; right: 0; width: 1px; height: 40px; }
          .ornate-corner.bl::before { bottom: 0; left: 0; width: 40px; height: 1px; }
          .ornate-corner.bl::after  { bottom: 0; left: 0; width: 1px; height: 40px; }
          .ornate-corner.br::before { bottom: 0; right: 0; width: 40px; height: 1px; }
          .ornate-corner.br::after  { bottom: 0; right: 0; width: 1px; height: 40px; }
        `}</style>
      </Head>

      <div
        style={{
          minHeight: '100vh',
          background: darkBg,
          color: '#d4d4d4',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          overflowX: 'hidden'
        }}
      >
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
          {/* Corner ornaments */}
          <div className='ornate-corner tl' style={{ top: 32, left: 32 }} />
          <div className='ornate-corner tr' style={{ top: 32, right: 32 }} />
          <div className='ornate-corner bl' style={{ bottom: 32, left: 32 }} />
          <div className='ornate-corner br' style={{ bottom: 32, right: 32 }} />

          {/* Background glow */}
          <div
            style={{
              position: 'absolute',
              width: 500,
              height: 500,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${gold}08, transparent 70%)`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              filter: 'blur(80px)',
              pointerEvents: 'none'
            }}
          />

          <div
            className='lx-reveal'
            style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '40px 24px', maxWidth: 800 }}
          >
            {/* Diamond accent */}
            <div className='lx-pulse' style={{ marginBottom: 28 }}>
              <span className='diamond-accent' />
            </div>

            <p
              className='lx-up'
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.5em',
                textTransform: 'uppercase',
                color: gold,
                marginBottom: 32
              }}
            >
              THE WEDDING OF
            </p>

            <h1
              className='gold-shimmer-text lx-up lx-up-d1'
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(2.5rem, 9vw, 5rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: 12
              }}
            >
              {mergedContent.groom_name}
            </h1>

            <div
              className='lx-up lx-up-d2'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, margin: '16px 0' }}
            >
              <div className='marble-divider' style={{ width: 80 }} />
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: 20, color: gold, fontWeight: 300 }}>&amp;</span>
              <div className='marble-divider' style={{ width: 80 }} />
            </div>

            <h1
              className='gold-shimmer-text lx-up lx-up-d3'
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(2.5rem, 9vw, 5rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: 28
              }}
            >
              {mergedContent.bride_name}
            </h1>

            {mergedContent.wedding_date && (
              <p
                className='lx-up lx-up-d4'
                style={{ fontSize: 18, color: '#888', fontWeight: 300, letterSpacing: '0.1em', fontStyle: 'italic' }}
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
              className='lx-up lx-up-d4'
              style={{ marginTop: 24, fontSize: 17, color: '#777', fontStyle: 'italic', letterSpacing: '0.03em' }}
            >
              Trân trọng kính mời quý khách đến dự buổi lễ thành hôn
            </p>

            {/* Scroll indicator */}
            <div className='lx-float' style={{ marginTop: 56 }}>
              <div
                style={{
                  width: 1,
                  height: 50,
                  background: `linear-gradient(to bottom, ${gold}60, transparent)`,
                  margin: '0 auto'
                }}
              />
            </div>
          </div>
        </section>

        {/* ══ Countdown ══ */}
        {timeRemaining && (
          <section style={{ padding: '80px 20px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }}>
              <div className='marble-divider' style={{ width: '60%' }} />
            </div>
            <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
              <div className='lx-pulse' style={{ marginBottom: 16 }}>
                <span className='diamond-accent' />
              </div>
              <h2
                className='gold-shimmer-text lx-up'
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 'clamp(1.3rem, 4vw, 2rem)',
                  fontWeight: 700,
                  marginBottom: 8,
                  letterSpacing: '0.1em'
                }}
              >
                COUNTDOWN
              </h2>
              <p className='lx-up' style={{ color: '#666', fontStyle: 'italic', marginBottom: 40, fontSize: 15 }}>
                Đếm ngược đến ngày vui…
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                  { label: 'DAYS', value: timeRemaining.days },
                  { label: 'HOURS', value: timeRemaining.hours },
                  { label: 'MINS', value: timeRemaining.minutes },
                  { label: 'SECS', value: timeRemaining.seconds }
                ].map((item, i) => (
                  <div
                    key={item.label}
                    className={`luxury-card gold-border-glow lx-up lx-up-d${i + 1}`}
                    style={{ padding: '24px 8px', textAlign: 'center' }}
                  >
                    <div
                      className='lx-tick'
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                        fontWeight: 800,
                        lineHeight: 1,
                        marginBottom: 8
                      }}
                    >
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: 9,
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        color: '#555'
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
        <section style={{ padding: '80px 20px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }}>
            <div className='marble-divider' style={{ width: '60%' }} />
          </div>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div className='lx-pulse' style={{ marginBottom: 16 }}>
                <span className='diamond-accent' />
              </div>
              <h2
                className='gold-shimmer-text lx-up'
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 'clamp(1.3rem, 4vw, 2rem)',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  marginBottom: 16
                }}
              >
                EVENT DETAILS
              </h2>
              <div className='marble-divider lx-up' style={{ width: 100 }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              <div className='luxury-card lx-left' style={{ padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: `${gold}10`,
                      border: `1px solid ${gold}25`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Calendar size={24} color={gold} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: 18,
                      fontWeight: 700,
                      color: goldLight,
                      letterSpacing: '0.05em'
                    }}
                  >
                    THỜI GIAN
                  </h3>
                </div>
                <p style={{ color: '#aaa', fontSize: 16, lineHeight: 1.7, marginBottom: 8 }}>
                  {mergedContent.wedding_date &&
                    new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#777' }}>
                  <Clock size={16} color={gold} />
                  <span>Lúc {mergedContent.wedding_time || '00:00'}</span>
                </div>
              </div>

              <div className='luxury-card lx-right' style={{ padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: `${gold}10`,
                      border: `1px solid ${gold}25`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <MapPin size={24} color={gold} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: 18,
                      fontWeight: 700,
                      color: goldLight,
                      letterSpacing: '0.05em'
                    }}
                  >
                    ĐỊA ĐIỂM
                  </h3>
                </div>
                <p style={{ color: '#aaa', fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
                  {mergedContent.address || '—'}
                </p>
                {mergedContent.map_url && (
                  <a
                    href={mergedContent.map_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='btn-luxury'
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '12px 28px',
                      background: `linear-gradient(135deg, ${goldDark}, ${gold})`,
                      color: darkBg,
                      borderRadius: 12,
                      fontSize: 13,
                      fontWeight: 700,
                      textDecoration: 'none',
                      fontFamily: "'Cinzel', serif",
                      letterSpacing: '0.08em'
                    }}
                  >
                    <MapPin size={16} /> XEM BẢN ĐỒ
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ══ Gallery ══ */}
        {mergedContent.images && mergedContent.images.length > 0 && (
          <section style={{ padding: '80px 20px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }}>
              <div className='marble-divider' style={{ width: '60%' }} />
            </div>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div className='lx-pulse' style={{ marginBottom: 16 }}>
                  <span className='diamond-accent' />
                </div>
                <h2
                  className='gold-shimmer-text lx-up'
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: 'clamp(1.3rem, 4vw, 2rem)',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    marginBottom: 16
                  }}
                >
                  OUR MOMENTS
                </h2>
                <div className='marble-divider lx-up' style={{ width: 100 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {mergedContent.images.slice(0, 6).map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className={`photo-lux lx-up`}
                    style={{ animationDelay: `${idx * 0.12}s`, aspectRatio: idx === 0 ? '4/5' : '1/1' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Photo ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'contrast(1.05) brightness(0.95)',
                        transition: 'transform 0.6s ease, filter 0.4s'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ RSVP ══ */}
        <section style={{ padding: '80px 20px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }}>
            <div className='marble-divider' style={{ width: '60%' }} />
          </div>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div className='lx-pulse' style={{ marginBottom: 16 }}>
                <span className='diamond-accent' />
              </div>
              <h2
                className='gold-shimmer-text lx-up'
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 'clamp(1.3rem, 4vw, 2rem)',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  marginBottom: 8
                }}
              >
                RSVP
              </h2>
              <p className='lx-up' style={{ color: '#777', fontStyle: 'italic', fontSize: 15 }}>
                Xin hãy cho chúng tôi biết sự hiện diện quý giá của bạn
              </p>
            </div>
            <div className='luxury-card gold-border-glow lx-up' style={{ padding: 32 }}>
              <RSVPForm weddingId={wedding.id} />
            </div>
          </div>
        </section>

        {/* ══ Footer ══ */}
        <footer style={{ padding: '60px 20px', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }}>
            <div className='marble-divider' style={{ width: '40%' }} />
          </div>
          <div className='lx-pulse' style={{ marginBottom: 16 }}>
            <Heart size={28} fill={gold} color={gold} />
          </div>
          <p
            className='gold-shimmer-text'
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
              fontWeight: 700,
              marginBottom: 8,
              letterSpacing: '0.08em'
            }}
          >
            {mergedContent.groom_name} &amp; {mergedContent.bride_name}
          </p>
          <p style={{ color: '#555', fontSize: 14, fontStyle: 'italic' }}>Cảm ơn quý khách đã đến chung vui</p>
          <div
            style={{
              marginTop: 28,
              fontSize: 11,
              color: '#333',
              letterSpacing: '0.1em',
              fontFamily: "'Cinzel', serif"
            }}
          >
            POWERED BY MOIMOI STUDIO
          </div>
        </footer>
      </div>
    </>
  )
}
