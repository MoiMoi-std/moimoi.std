import { createClient } from '@supabase/supabase-js'
import { Calendar, Clock, Heart, MapPin } from 'lucide-react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { WeddingCalendar } from '../../components/WeddingCalendar'
import { getImageStyle, resolveImageAdjust } from '../../lib/imageUtils'
import { useTemplateViewport } from '../../lib/TemplateViewportContext'
import { TemplateProps } from '../TemplateRegistry'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function ModernGeneralView({ wedding, guestName = '', rsvpId }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // RSVP state
  const [wish, setWish] = useState('')
  const [phone, setPhone] = useState('')
  const [isAttending, setIsAttending] = useState<boolean | null>(null)
  const [partySize, setPartySize] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const { content, template } = wedding || {}
  const viewport = useTemplateViewport()
  const templateData = template as any
  const mergedContent = {
    ...(templateData?.default_content || {}),
    ...content
  }

  const accent = mergedContent.primary_color || '#6366f1'
  const accentLight = '#818cf8'
  const fontFamily = mergedContent.font_family || "'Inter', sans-serif"
  const headingFontFamily = mergedContent.heading_font_family || "'Outfit', sans-serif"
  const sectionFontFamily = mergedContent.section_font_family || "'Outfit', sans-serif"
  const darkBg = '#0f0f23'
  const cardBg = 'rgba(255,255,255,0.06)'

  const coverImage =
    mergedContent.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=533&fit=crop'
  const mockAlbumImages = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1529443132905-8ee5f6e8ed8b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1578730169862-749eae6bc1cc?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1513279922550-250c2129b13a?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1484863137850-59afcfe05386?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=400&fit=crop'
  ]
  const albumImages = mergedContent.images?.length > 0 ? mergedContent.images : mockAlbumImages

  let calYear = 0,
    calMonth = 0,
    calDay = 0
  if (mergedContent.wedding_date) {
    const parts = (mergedContent.wedding_date as string).split('-').map(Number)
    calYear = parts[0]
    calMonth = parts[1]
    calDay = parts[2]
  }

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

  // Pre-fill RSVP
  useEffect(() => {
    if (!rsvpId) return
    supabase
      .from('rsvps')
      .select('wishes, phone, is_attending, party_size')
      .eq('id', rsvpId)
      .single()
      .then(({ data }) => {
        if (!data) return
        if (data.wishes) setWish(data.wishes)
        if (data.phone) setPhone(data.phone)
        if (data.is_attending != null) setIsAttending(data.is_attending)
        if (data.party_size) setPartySize(data.party_size)
      })
  }, [rsvpId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSubmitError('')
    try {
      if (rsvpId) {
        const { error } = await supabase
          .from('rsvps')
          .update({
            phone: phone.trim() || null,
            is_attending: isAttending,
            party_size: isAttending ? partySize : 1,
            wishes: wish.trim() || null
          })
          .eq('id', rsvpId)
        if (error) throw error
      }
      setSubmitted(true)
    } catch (err: any) {
      console.error('RSVP error:', err)
      setSubmitError('Có lỗi xảy ra, vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: 14,
    fontSize: 15,
    outline: 'none',
    background: 'rgba(255,255,255,0.04)',
    boxSizing: 'border-box',
    fontFamily: fontFamily,
    color: '#e2e8f0',
    transition: 'border-color 0.3s, box-shadow 0.3s, background 0.3s'
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 6,
    fontWeight: 600,
    fontSize: 13,
    color: '#94a3b8',
    letterSpacing: '0.04em'
  }

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

          input:focus, textarea:focus {
            border-color: ${accent} !important;
            background: rgba(255,255,255,0.08) !important;
            box-shadow: 0 0 0 3px ${accent}25, 0 0 20px ${accent}15 !important;
          }

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
          @keyframes borderPulse {
            0%, 100% { border-color: rgba(255,255,255,0.08); }
            50%      { border-color: ${accent}40; }
          }
          @keyframes successPop {
            0%   { transform: scale(0) rotate(-180deg); opacity: 0; }
            60%  { transform: scale(1.2) rotate(15deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
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
          .mg-pop    { animation: successPop 0.8s cubic-bezier(.175,.885,.32,1.275) both; }
          .mg-pulse  { animation: pulse3d 3s ease-in-out infinite; }

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

          .mg-glass {
            background: ${cardBg};
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 24px;
            box-shadow: 0 8px 32px rgba(0,0,0,.2);
            animation: borderPulse 4s ease-in-out infinite;
          }

          .gradient-text {
            background: linear-gradient(135deg, ${accent}, ${accentLight}, #c084fc, ${accent});
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradientShift 6s ease infinite;
          }

          .mg-gradient {
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

          .mg-orbit {
            position: absolute;
            border: 1px solid ${accent}10;
            border-radius: 50%;
            animation: orbitSlow 30s linear infinite;
            pointer-events: none;
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

          .btn-mg-attend:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(34,197,94,.25); }
          .btn-mg-decline:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(239,68,68,.2); }
          .btn-mg-submit:not(:disabled):hover { transform: translateY(-3px); box-shadow: 0 12px 40px ${accent}45; }
        `}</style>
      </Head>

      <div
        style={{
          minHeight: '100vh',
          background: darkBg,
          color: '#e2e8f0',
          fontFamily: fontFamily,
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
            height: '100vh',
            minHeight: 600,
            overflow: 'hidden'
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt='Wedding Cover'
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              ...getImageStyle(resolveImageAdjust(mergedContent.cover_image_position, viewport))
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(15,15,35,0.35) 0%, transparent 35%, rgba(15,15,35,0.82) 100%)'
            }}
          />

          <div
            className='orbit-ring'
            style={{
              width: 500,
              height: 500,
              top: '50%',
              left: '50%',
              marginTop: -250,
              marginLeft: -250,
              opacity: 0.25
            }}
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
              animationDirection: 'reverse',
              opacity: 0.15
            }}
          />

          <div style={{ position: 'absolute', top: 28, left: 0, right: 0, textAlign: 'center', zIndex: 1 }}>
            <p
              className='m-fade'
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: accentLight
              }}
            >
              WE ARE GETTING MARRIED
            </p>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1,
              textAlign: 'center',
              padding: '0 24px 40px'
            }}
          >
            {guestName && (
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: `${accentLight}90`,
                  marginBottom: 6
                }}
              >
                WE INVITE YOU
              </p>
            )}
            {guestName && (
              <p
                className='mg-gradient'
                style={{
                  fontFamily: headingFontFamily,
                  fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
                  fontWeight: 700,
                  marginBottom: 12
                }}
              >
                {guestName}
              </p>
            )}
            <h1
              className='gradient-text'
              style={{
                fontFamily: headingFontFamily,
                fontSize: 'clamp(2rem, 8vw, 3.2rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                paddingTop: '0.15em',
                paddingBottom: '0.15em',
                marginBottom: 8
              }}
            >
              {mergedContent.groom_name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '8px 0' }}>
              <div className='neon-line' style={{ width: 40 }} />
              <Heart size={18} fill={accent} color={accent} />
              <div className='neon-line' style={{ width: 40 }} />
            </div>
            <h1
              className='gradient-text'
              style={{
                fontFamily: headingFontFamily,
                fontSize: 'clamp(2rem, 8vw, 3.2rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                paddingTop: '0.15em',
                paddingBottom: '0.15em',
                marginBottom: 12
              }}
            >
              {mergedContent.bride_name}
            </h1>
            {mergedContent.wedding_date && (
              <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 300, letterSpacing: '0.08em' }}>
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

        {/* ══ Parents Info ══ */}
        {(mergedContent.groom_father_name || mergedContent.bride_father_name) && (
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
                FAMILY
              </p>
              <h2
                className='m-fade gradient-text'
                style={{
                  fontFamily: sectionFontFamily,
                  fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                  fontWeight: 700,
                  marginBottom: 40
                }}
              >
                Gia Đình
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div
                  className='glass-card m-fade'
                  style={{ padding: '28px 20px', textAlign: 'center', borderRadius: 20 }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                      color: accentLight,
                      marginBottom: 16
                    }}
                  >
                    Nhà Trai
                  </p>
                  <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.9 }}>
                    {mergedContent.groom_father_name && (
                      <p>
                        Ông: <span style={{ color: '#e2e8f0' }}>{mergedContent.groom_father_name}</span>
                      </p>
                    )}
                    {mergedContent.groom_mother_name && (
                      <p>
                        Bà: <span style={{ color: '#e2e8f0' }}>{mergedContent.groom_mother_name}</span>
                      </p>
                    )}
                    {mergedContent.groom_city && (
                      <p style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>{mergedContent.groom_city}</p>
                    )}
                  </div>
                </div>
                <div
                  className='glass-card m-fade'
                  style={{ padding: '28px 20px', textAlign: 'center', borderRadius: 20 }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                      color: accentLight,
                      marginBottom: 16
                    }}
                  >
                    Nhà Gái
                  </p>
                  <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.9 }}>
                    {mergedContent.bride_father_name && (
                      <p>
                        Ông: <span style={{ color: '#e2e8f0' }}>{mergedContent.bride_father_name}</span>
                      </p>
                    )}
                    {mergedContent.bride_mother_name && (
                      <p>
                        Bà: <span style={{ color: '#e2e8f0' }}>{mergedContent.bride_mother_name}</span>
                      </p>
                    )}
                    {mergedContent.bride_city && (
                      <p style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>{mergedContent.bride_city}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

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
                  fontFamily: sectionFontFamily,
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
                  fontFamily: sectionFontFamily,
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
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: sectionFontFamily }}>
                    Thời Gian
                  </h3>
                </div>
                {calYear > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <WeddingCalendar
                      year={calYear}
                      month={calMonth}
                      day={calDay}
                      primaryColor={accent}
                      variant='dark'
                      fontFamily={fontFamily}
                    />
                  </div>
                )}
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
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: sectionFontFamily }}>
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
                  fontFamily: sectionFontFamily,
                  fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                  fontWeight: 700,
                  marginBottom: 16
                }}
              >
                Khoảnh Khắc Của Chúng Tôi
              </h2>
              <div className='neon-line m-fade' style={{ width: 80, margin: '0 auto' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {albumImages.slice(0, 4).map((img: string, idx: number) => {
                const isLast = idx === 3
                const extraCount = albumImages.length - 4
                return (
                  <div
                    key={idx}
                    className={`photo-grid-item m-fade`}
                    style={{ animationDelay: `${idx * 0.1}s`, aspectRatio: '3/4', cursor: 'pointer' }}
                    onClick={() => {
                      setLightboxIndex(idx)
                      setLightboxOpen(true)
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Photo ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        transition: 'transform 0.6s ease',
                        ...getImageStyle(resolveImageAdjust(mergedContent.image_positions?.[idx], viewport))
                      }}
                    />
                    {isLast && extraCount > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(0,0,0,0.55)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '1.2rem',
                          fontWeight: 700,
                          zIndex: 2
                        }}
                      >
                        +{extraCount}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ══ RSVP Section ══ */}
        <section style={{ padding: '80px 20px', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg, transparent, ${accent}08, transparent)`
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
                  fontFamily: sectionFontFamily,
                  fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                  fontWeight: 700,
                  marginBottom: 16
                }}
              >
                Xác Nhận Tham Dự
              </h2>
              <div className='neon-line m-fade' style={{ width: 80, margin: '0 auto' }} />
              {guestName && (
                <p className='m-fade' style={{ marginTop: 16, color: accentLight, fontSize: 14, fontStyle: 'italic' }}>
                  Kính mời <span style={{ fontWeight: 700, color: '#fff' }}>{guestName}</span>
                </p>
              )}
            </div>

            {!submitted ? (
              <div className='mg-glass' style={{ padding: '28px 24px' }}>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: accentLight,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    marginBottom: 4
                  }}
                >
                  ✦ CONFIRM ATTENDANCE
                </p>
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: 13, marginBottom: 24 }}>
                  Vui lòng điền thông tin để chúng tôi chuẩn bị tốt hơn
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label style={labelStyle}>Bạn có tham dự không? *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <button
                        type='button'
                        className='btn-mg-attend'
                        onClick={() => setIsAttending(true)}
                        style={{
                          padding: '13px 8px',
                          borderRadius: 14,
                          border: isAttending === true ? '2px solid #22c55e' : '1.5px solid rgba(255,255,255,.1)',
                          background: isAttending === true ? 'rgba(34,197,94,.12)' : 'rgba(255,255,255,.03)',
                          cursor: 'pointer',
                          fontSize: 14,
                          fontWeight: 600,
                          color: isAttending === true ? '#4ade80' : '#64748b',
                          transition: 'all .25s',
                          fontFamily: 'inherit'
                        }}
                      >
                        Có, tôi sẽ đến
                      </button>
                      <button
                        type='button'
                        className='btn-mg-decline'
                        onClick={() => setIsAttending(false)}
                        style={{
                          padding: '13px 8px',
                          borderRadius: 14,
                          border: isAttending === false ? '2px solid #ef4444' : '1.5px solid rgba(255,255,255,.1)',
                          background: isAttending === false ? 'rgba(239,68,68,.1)' : 'rgba(255,255,255,.03)',
                          cursor: 'pointer',
                          fontSize: 14,
                          fontWeight: 600,
                          color: isAttending === false ? '#f87171' : '#64748b',
                          transition: 'all .25s',
                          fontFamily: 'inherit'
                        }}
                      >
                        Xin lỗi, tôi bận
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Số điện thoại <span style={{ color: '#475569', fontSize: 12, fontWeight: 400 }}>(tùy chọn)</span>
                    </label>
                    <input
                      type='tel'
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder='0901 234 567'
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Số người tham dự</label>
                    <div style={{ display: 'flex' }}>
                      {[1, 2, 3, 4, 5].map((n, i) => (
                        <button
                          key={n}
                          type='button'
                          onClick={() => setPartySize(n)}
                          style={{
                            flex: 1,
                            padding: '12px 4px',
                            border: '1.5px solid',
                            borderColor: partySize === n ? accent : 'rgba(255,255,255,.1)',
                            borderRight: i < 4 ? 'none' : '1.5px solid',
                            borderRightColor: partySize === n ? accent : 'rgba(255,255,255,.1)',
                            borderRadius: i === 0 ? '14px 0 0 14px' : i === 4 ? '0 14px 14px 0' : '0',
                            background:
                              partySize === n
                                ? `linear-gradient(135deg, ${accent}, ${accentLight})`
                                : 'rgba(255,255,255,.03)',
                            color: partySize === n ? '#fff' : '#64748b',
                            fontWeight: 700,
                            fontSize: 15,
                            cursor: 'pointer',
                            transition: 'all .2s',
                            fontFamily: 'inherit',
                            boxShadow: partySize === n ? `0 4px 16px ${accent}30` : 'none'
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <p style={{ fontSize: 12, color: '#475569', marginTop: 5 }}>người tham dự</p>
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Lời chúc <span style={{ color: '#475569', fontSize: 12, fontWeight: 400 }}>(tùy chọn)</span>
                    </label>
                    <textarea
                      value={wish}
                      onChange={(e) => setWish(e.target.value)}
                      placeholder='Chúc hai bạn trăm năm hạnh phúc...'
                      rows={4}
                      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
                    />
                  </div>

                  <button
                    type='submit'
                    className='btn-mg-submit'
                    disabled={loading || isAttending === null}
                    style={{
                      width: '100%',
                      padding: 16,
                      background:
                        isAttending === null || loading
                          ? 'rgba(255,255,255,.06)'
                          : `linear-gradient(135deg, ${accent}, ${accentLight})`,
                      color: isAttending === null || loading ? '#475569' : '#fff',
                      border: 'none',
                      borderRadius: 16,
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: loading || isAttending === null ? 'not-allowed' : 'pointer',
                      letterSpacing: '0.03em',
                      transition: 'all .3s',
                      boxShadow: isAttending !== null && !loading ? `0 8px 30px ${accent}40` : 'none',
                      fontFamily: 'inherit'
                    }}
                  >
                    {loading ? '⏳ Đang gửi...' : '🚀 Gửi xác nhận'}
                  </button>

                  {submitError && (
                    <div
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(239,68,68,.1)',
                        border: '1px solid rgba(239,68,68,.2)',
                        borderRadius: 12,
                        color: '#f87171',
                        fontSize: 14,
                        textAlign: 'center',
                        fontWeight: 500
                      }}
                    >
                      ❌ {submitError}
                    </div>
                  )}
                </form>
              </div>
            ) : (
              <div className='mg-glass' style={{ padding: '52px 28px', textAlign: 'center' }}>
                <div className='mg-pop' style={{ fontSize: '4rem', marginBottom: 22 }}>
                  {isAttending ? '🎊' : '💜'}
                </div>
                <h3
                  className='mg-gradient'
                  style={{
                    fontFamily: headingFontFamily,
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    marginBottom: 12,
                    lineHeight: 1.3
                  }}
                >
                  {isAttending ? 'Hẹn gặp bạn tại đám cưới!' : 'Cảm ơn bạn đã phản hồi!'}
                </h3>
                <p
                  style={{
                    color: '#94a3b8',
                    fontSize: 15,
                    lineHeight: 1.75,
                    maxWidth: 300,
                    margin: '0 auto',
                    fontStyle: 'italic'
                  }}
                >
                  {isAttending
                    ? `Chúng tôi rất vui được đón tiếp${guestName ? ` ${guestName}` : ''}. Hẹn gặp trong ngày vui! 🥂`
                    : 'Rất tiếc khi bạn không thể tham dự. Mong có dịp gặp nhau trong tương lai! 💕'}
                </p>
                {wish && (
                  <div
                    style={{
                      marginTop: 28,
                      padding: '16px 20px',
                      background: `${accent}10`,
                      borderRadius: 14,
                      borderLeft: `3px solid ${accent}`,
                      textAlign: 'left'
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: accentLight,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: 8
                      }}
                    >
                      Your wishes
                    </p>
                    <p style={{ color: '#cbd5e1', fontStyle: 'italic', fontSize: 14, lineHeight: 1.7 }}>
                      &ldquo;{wish}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            )}
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
              fontFamily: headingFontFamily,
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

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.92)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#fff',
              width: 40,
              height: 40,
              borderRadius: '50%',
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: 0,
              right: 0,
              textAlign: 'center',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.85rem'
            }}
          >
            {lightboxIndex + 1} / {albumImages.length}
          </div>
          {lightboxIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex(lightboxIndex - 1)
              }}
              style={{
                position: 'absolute',
                left: 12,
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#fff',
                width: 44,
                height: 44,
                borderRadius: '50%',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ‹
            </button>
          )}
          <div onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={albumImages[lightboxIndex]}
              alt={`Photo ${lightboxIndex + 1}`}
              style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 8, display: 'block' }}
            />
          </div>
          {lightboxIndex < albumImages.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex(lightboxIndex + 1)
              }}
              style={{
                position: 'absolute',
                right: 12,
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#fff',
                width: 44,
                height: 44,
                borderRadius: '50%',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  )
}
