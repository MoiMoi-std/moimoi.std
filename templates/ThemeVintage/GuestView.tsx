import { createClient } from '@supabase/supabase-js'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// Mock data album ảnh cưới
const mockAlbum = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=500&fit=crop'
]

export default function VintageGuestView({ wedding, guestName = '', rsvpId }: TemplateProps) {
  const [wish, setWish] = useState('')
  const [phone, setPhone] = useState('')
  const [isAttending, setIsAttending] = useState<boolean | null>(null)
  const [partySize, setPartySize] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [showSplash, setShowSplash] = useState(true)
  const [splashFading, setSplashFading] = useState(false)

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

  const red = '#d6838a'
  const cream = '#fde3e9'
  const creamLight = '#feedf1'
  const textDark = '#111111'

  if (!wedding) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: cream,
          fontFamily: "'Playfair Display', serif"
        }}
      >
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>💔</div>
          <h1 style={{ color: red, marginBottom: 8 }}>Không tìm thấy thông tin</h1>
          <p style={{ color: '#888' }}>Thiệp mời có thể đã bị xóa hoặc không hợp lệ.</p>
        </div>
      </div>
    )
  }

  const { content, template } = wedding
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }

  const formattedName = guestName
  const groomName = mergedContent.groom_name || 'Hoàng Nam'
  const brideName = mergedContent.bride_name || 'Thanh Tú'
  const groomImage =
    mergedContent.groom_image ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
  const brideImage =
    mergedContent.bride_image ||
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face'
  const groomParents = mergedContent.groom_parents || 'Nguyễn Văn Tuấn\nTrần Thị Mai'
  const brideParents = mergedContent.bride_parents || 'Lê Văn Hùng\nHồ Thị Lan'
  const groomAddress =
    mergedContent.groom_address || '23 Đường Nguyễn Trãi, Phường Bến Thành, Quận 1, Thành phố\nHồ Chí Minh'
  const brideAddress = mergedContent.bride_address || '68 Đường Sư Vạn Hạnh, Phường 12, Quận 10, Thành phố Hồ\nChí Minh'
  const weddingTime = mergedContent.wedding_time || '09:00'
  const partyTime = mergedContent.party_time || '10:30'
  const eventDate = mergedContent.event_date || '01/02/2026'
  const lunarDate = mergedContent.lunar_date || '14/12 Ất Tỵ'
  const address = mergedContent.address || 'Queen Plaza Kỳ Hòa, 16A Lê Hồng Phong, Phường 12, Quận 10, TP. Hồ Chí Minh'
  const albumImages = mergedContent.album_images?.length > 0 ? mergedContent.album_images : mockAlbum

  const formatParents = (text: string) => {
    const lines = text.split('\n')
    if (lines.length === 2) {
      return (
        <>
          <div>{lines[0]}</div>
          <div>{lines[1]}</div>
        </>
      )
    }
    return text
  }

  const dateParts = eventDate.split('/')
  const day = dateParts[0] || '01'
  const month = dateParts[1] || '02'
  const year = dateParts[2] || '2026'
  const dayName = 'CHỦ NHẬT'

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
      setSubmitError('Có lỗi xảy ra. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenInvitation = () => {
    setSplashFading(true)
    setTimeout(() => setShowSplash(false), 600)
  }

  const redPatternStyle = {
    backgroundColor: red
  }

  const creamPatternStyle = {
    backgroundColor: creamLight,
    backgroundImage: `repeating-linear-gradient(rgba(214,131,138,0.06), rgba(214,131,138,0.06))`
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: `1px solid ${red}50`,
    borderRadius: 4,
    fontSize: 15,
    outline: 'none',
    background: 'rgba(255,255,255,0.8)',
    boxSizing: 'border-box',
    fontFamily: "'Lora', serif",
    color: '#333'
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 8,
    fontWeight: 700,
    fontSize: 11,
    color: textDark,
    letterSpacing: '0.12em',
    textTransform: 'uppercase'
  }

  return (
    <>
      <Head>
        <title>Thiệp cưới - {formattedName}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Great+Vibes&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap'
          rel='stylesheet'
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #fff; -webkit-font-smoothing: antialiased; }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes sealPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(214,131,138,0.45); } 70% { box-shadow: 0 0 0 14px rgba(214,131,138,0); } }
          .splash-card { animation: fadeInUp 0.85s cubic-bezier(.22,.68,0,1.2) both; }
          .btn-open { animation: sealPulse 2.2s ease-out infinite; }
          .btn-calendar:hover { opacity: 0.9; transform: scale(1.02); }
          .btn-attend:hover { transform: translateY(-2px); }
          .btn-decline:hover { transform: translateY(-2px); }
        `}</style>
        <style>{`
          @media (max-width: 768px) {
            .vintage-side-panel { display: none !important; }
          }
        `}</style>
      </Head>

      {/* ═════════ SPLASH SCREEN ═════════ */}
      {showSplash && (
        <div
          onClick={handleOpenInvitation}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9997,
            backgroundColor: cream,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            opacity: splashFading ? 0 : 1,
            transition: 'opacity 0.6s ease',
            fontFamily: "'Lora', serif",
            padding: 20
          }}
        >
          <div className='splash-card' style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
            {/* Top banner */}
            <div
              style={{
                backgroundColor: red,
                height: 90,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: 5,
                  color: 'rgba(255,255,255,0.9)',
                  textTransform: 'uppercase'
                }}
              >
                Thiệp Cưới
              </p>
            </div>

            {/* Card body */}
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.65)',
                border: `1px solid ${red}25`,
                borderTop: 'none',
                borderBottom: 'none',
                padding: '40px 32px 32px'
              }}
            >
              {/* 囍 */}
              <p style={{ fontSize: '2.4rem', color: red, marginBottom: 18, letterSpacing: 8 }}>囍</p>

              {/* Kính mời */}
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '0.6rem',
                  letterSpacing: '0.45em',
                  color: red,
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  marginBottom: 8
                }}
              >
                Trân trọng kính mời
              </p>

              {/* Guest name */}
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: formattedName.length > 22 ? '1.5rem' : '2rem',
                  color: red,
                  fontWeight: 400,
                  lineHeight: 1.2,
                  marginBottom: 18
                }}
              >
                {formattedName || 'Quý Khách'}
              </h2>

              {/* Ornamental divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ flex: 1, height: 1, backgroundColor: `${red}35` }} />
                <span style={{ color: red, fontSize: '0.55rem', letterSpacing: 6 }}>✦ ✦ ✦</span>
                <div style={{ flex: 1, height: 1, backgroundColor: `${red}35` }} />
              </div>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: '0.72rem',
                  color: textDark,
                  fontStyle: 'italic',
                  marginBottom: 20
                }}
              >
                tham dự lễ thành hôn của
              </p>

              {/* Groom name */}
              <h3
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: '3rem',
                  color: red,
                  fontWeight: 400,
                  lineHeight: 1.1
                }}
              >
                {groomName}
              </h3>

              {/* & */}
              <p
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: '2rem',
                  color: textDark,
                  lineHeight: 1
                }}
              >
                &amp;
              </p>

              {/* Bride name */}
              <h3
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: '3rem',
                  color: red,
                  fontWeight: 400,
                  lineHeight: 1.1,
                  marginBottom: 24
                }}
              >
                {brideName}
              </h3>

              {/* Date */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  marginBottom: 30
                }}
              >
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: textDark, letterSpacing: 2 }}>
                  {dayName}
                </span>
                <div style={{ width: 1, height: 18, backgroundColor: '#c8b6a6' }} />
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    color: red,
                    lineHeight: 1
                  }}
                >
                  {day}
                </span>
                <div style={{ width: 1, height: 18, backgroundColor: '#c8b6a6' }} />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: textDark, letterSpacing: 2 }}>
                  THÁNG {month}
                </span>
                <div style={{ width: 1, height: 18, backgroundColor: '#c8b6a6' }} />
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: textDark
                  }}
                >
                  {year}
                </span>
              </div>

              {/* Open button */}
              <div>
                <button
                  className='btn-open'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenInvitation()
                  }}
                  style={{
                    backgroundColor: red,
                    color: '#fff',
                    border: 'none',
                    padding: '13px 44px',
                    borderRadius: 2,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    fontFamily: "'Playfair Display', serif"
                  }}
                >
                  Mở Thiệp
                </button>
              </div>

              {/* Hint */}
              <p style={{ fontSize: '0.6rem', color: '#bbb', letterSpacing: '0.08em', marginTop: 16 }}>
                hoặc chạm vào bất kỳ đâu để mở
              </p>
            </div>

            {/* Bottom bar */}
            <div style={{ height: 8, backgroundColor: red }} />
          </div>
        </div>
      )}

      <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'stretch' }}>
        {/* ═════════ LEFT PANEL ═════════ */}
        <div className='vintage-side-panel' style={{ flex: 1, minHeight: '100vh', background: '#fff' }} />

        {/* ═════════ WEDDING CARD ═════════ */}
        <div
          style={{
            width: 896,
            flexShrink: 0,
            background: cream,
            minHeight: '100vh',
            fontFamily: "'Lora', serif",
            color: textDark,
            paddingBottom: 60,
            boxShadow: '0 0 40px rgba(0,0,0,0.08)'
          }}
        >
          {/* ═════════ HERO SECTION ═════════ */}
          <div style={{ width: '100%', height: 128, ...redPatternStyle }} />

          {/* Avatar section */}
          <div
            style={{
              width: '100%',
              minHeight: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 20px'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8%',
                width: '100%',
                position: 'relative',
                alignItems: 'flex-start'
              }}
            >
              {/* Groom */}
              <div style={{ textAlign: 'center', width: '40%' }}>
                <div
                  style={{
                    width: 240,
                    height: 240,
                    borderRadius: '50%',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    margin: '0 auto 12px'
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={groomImage} alt={groomName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <p
                  style={{
                    fontSize: '0.65rem',
                    color: textDark,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    marginBottom: 2
                  }}
                >
                  Trưởng Nam
                </p>
                <h3
                  style={{
                    fontFamily: "'Great Vibes', cursive",
                    fontSize: '2rem',
                    color: red,
                    fontWeight: 400,
                    marginBottom: 10
                  }}
                >
                  {groomName}
                </h3>
                <div style={{ width: '60%', height: 1, backgroundColor: 'rgba(214,131,138,0.35)', margin: '0 auto' }} />
              </div>

              {/* Center 囍 */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '38%',
                  transform: 'translate(-50%, -50%)',
                  width: 56,
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(214,131,138,0.2)',
                  borderRadius: 4,
                  zIndex: 2
                }}
              >
                <span style={{ fontSize: '2rem', color: '#c46a73' }}>囍</span>
              </div>

              {/* Bride */}
              <div style={{ textAlign: 'center', width: '40%' }}>
                <div
                  style={{
                    width: 240,
                    height: 240,
                    borderRadius: '50%',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    margin: '0 auto 12px'
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={brideImage} alt={brideName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <p
                  style={{
                    fontSize: '0.65rem',
                    color: textDark,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    marginBottom: 2
                  }}
                >
                  Út Nữ
                </p>
                <h3
                  style={{
                    fontFamily: "'Great Vibes', cursive",
                    fontSize: '2rem',
                    color: red,
                    fontWeight: 400,
                    marginBottom: 10
                  }}
                >
                  {brideName}
                </h3>
                <div style={{ width: '60%', height: 1, backgroundColor: 'rgba(214,131,138,0.35)', margin: '0 auto' }} />
              </div>
            </div>
          </div>

          {/* ═════════ THONG TIN LE CUOI BANNER ═════════ */}
          <div
            style={{
              width: '100%',
              height: 68,
              ...redPatternStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: 4,
                color: '#fff',
                textTransform: 'uppercase'
              }}
            >
              Thông Tin Lễ Cưới
            </p>
          </div>

          {/* ═════════ PARENTS INFO ═════════ */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '28px 32px 28px',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            {/* Groom Parents */}
            <div style={{ flex: 1, padding: '0 16px 0 0' }}>
              <p style={{ fontSize: '0.75rem', color: textDark, marginBottom: 6 }}>Ông bà</p>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: red,
                  lineHeight: 1.8
                }}
              >
                {formatParents(groomParents)}
              </div>
              <p
                style={{ fontSize: '0.72rem', color: textDark, lineHeight: 1.5, marginTop: 8, whiteSpace: 'pre-line' }}
              >
                {groomAddress}
              </p>
            </div>

            {/* Vertical divider */}
            <div style={{ width: 1, alignSelf: 'stretch', backgroundColor: '#c8b6a6', flexShrink: 0 }} />

            {/* Bride Parents */}
            <div style={{ flex: 1, padding: '0 0 0 16px' }}>
              <p style={{ fontSize: '0.75rem', color: textDark, marginBottom: 6 }}>Ông bà</p>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: red,
                  lineHeight: 1.8
                }}
              >
                {formatParents(brideParents)}
              </div>
              <p
                style={{ fontSize: '0.72rem', color: textDark, lineHeight: 1.5, marginTop: 8, whiteSpace: 'pre-line' }}
              >
                {brideAddress}
              </p>
            </div>
          </div>

          {/* ═════════ WEDDING ANNOUNCEMENT ═════════ */}
          <div style={{ textAlign: 'center', padding: '16px 32px 32px' }}>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: red,
                letterSpacing: 3,
                textTransform: 'uppercase',
                marginBottom: 4
              }}
            >
              Trân trọng báo tin
            </p>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: red,
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginBottom: 28
              }}
            >
              Lễ thành hôn của con chúng tôi
            </p>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2.6rem',
                fontWeight: 400,
                color: red,
                lineHeight: 1.1,
                marginBottom: 10
              }}
            >
              {groomName}
            </h2>
            <p
              style={{
                fontSize: '0.65rem',
                color: textDark,
                letterSpacing: 4,
                textTransform: 'uppercase',
                marginBottom: 20
              }}
            >
              Trưởng Nam
            </p>

            <p
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: '3rem',
                color: textDark,
                fontWeight: 400,
                lineHeight: 1,
                marginBottom: 20
              }}
            >
              &amp;
            </p>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2.6rem',
                fontWeight: 400,
                color: red,
                lineHeight: 1.1,
                marginBottom: 10
              }}
            >
              {brideName}
            </h2>
            <p
              style={{
                fontSize: '0.65rem',
                color: textDark,
                letterSpacing: 4,
                textTransform: 'uppercase',
                marginBottom: 32
              }}
            >
              Út Nữ
            </p>

            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: red,
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginBottom: 4
              }}
            >
              Lễ thành hôn được cử hành tại
            </p>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: red,
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginBottom: 16
              }}
            >
              Tư Gia
            </p>
            <p style={{ fontSize: '0.8rem', color: textDark, letterSpacing: 1, marginBottom: 20 }}>
              Vào lúc {weddingTime}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 12 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: textDark, letterSpacing: 2 }}>{dayName}</span>
              <div style={{ width: 1, height: 28, backgroundColor: '#c8b6a6' }} />
              <span
                style={{
                  fontSize: '2.8rem',
                  fontWeight: 700,
                  color: textDark,
                  fontFamily: "'Playfair Display', serif",
                  lineHeight: 1
                }}
              >
                {day}
              </span>
              <div style={{ width: 1, height: 28, backgroundColor: '#c8b6a6' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: textDark, letterSpacing: 2 }}>
                THÁNG {month}
              </span>
            </div>

            <p
              style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: textDark,
                fontFamily: "'Playfair Display', serif",
                marginBottom: 8
              }}
            >
              {year}
            </p>
            <p
              style={{
                fontSize: '0.78rem',
                color: textDark,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                letterSpacing: 1
              }}
            >
              (Tức ngày {lunarDate})
            </p>
          </div>

          {/* ═════════ ALBUM BANNER ═════════ */}
          <div
            style={{
              width: '100%',
              height: 68,
              ...redPatternStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: 4,
                color: '#fff',
                textTransform: 'uppercase'
              }}
            >
              Album Ảnh Cưới
            </p>
          </div>

          {/* ═════════ ALBUM ═════════ */}
          <div style={{ padding: '20px 20px', marginBottom: 40 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {albumImages.slice(0, 4).map((img: string, i: number) => {
                const isLast = i === 3
                const extraCount = albumImages.length - 4

                return (
                  <div
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    style={{
                      borderRadius: 8,
                      overflow: 'hidden',
                      aspectRatio: '3/4',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Album ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {isLast && extraCount > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '1.2rem',
                          fontWeight: 700
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

          {/* ═════════ THONG TIN TIEC CUOI BANNER ═════════ */}
          <div
            style={{
              width: '100%',
              height: 68,
              ...redPatternStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: 4,
                color: '#fff',
                textTransform: 'uppercase'
              }}
            >
              Thông Tin Tiệc Cưới
            </p>
          </div>

          {/* ═════════ PARTY EVENT ═════════ */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: '2.2rem',
                color: red,
                fontWeight: 400,
                marginBottom: 16
              }}
            >
              Tiệc cưới sẽ diễn ra vào lúc:
            </h2>
            <p
              style={{
                fontSize: '1.6rem',
                color: red,
                fontWeight: 700,
                fontFamily: "'Playfair Display', serif",
                marginBottom: 16
              }}
            >
              {partyTime}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: textDark }}>{dayName}</span>
              <div style={{ width: 1, height: 24, backgroundColor: '#c8b6a6' }} />
              <span
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: red,
                  fontFamily: "'Playfair Display', serif",
                  lineHeight: 1
                }}
              >
                {day}
              </span>
              <div style={{ width: 1, height: 24, backgroundColor: '#c8b6a6' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: textDark }}>THÁNG {month}</span>
            </div>

            <p
              style={{
                fontSize: '1.1rem',
                color: red,
                fontWeight: 700,
                fontFamily: "'Playfair Display', serif",
                marginBottom: 6
              }}
            >
              {year}
            </p>
            <p style={{ fontSize: '0.9rem', color: textDark, fontStyle: 'italic', marginBottom: 16 }}>
              (Tức ngày {lunarDate})
            </p>

            <p style={{ fontSize: '0.8rem', color: textDark, textTransform: 'uppercase', marginBottom: 4 }}>
              KHAI TIỆC
            </p>
            <p
              style={{
                fontSize: '1.2rem',
                color: red,
                fontWeight: 700,
                fontFamily: "'Playfair Display', serif",
                marginBottom: 20
              }}
            >
              {partyTime}
            </p>

            <button
              className='btn-calendar'
              style={{
                backgroundColor: '#c46a73',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: 20,
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Thêm vào lịch
            </button>
          </div>

          {/* ═════════ VENUE BANNER ═════════ */}
          <div
            style={{
              width: '100%',
              height: 68,
              ...redPatternStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: 4,
                color: '#fff',
                textTransform: 'uppercase'
              }}
            >
              Tiệc Cưới Sẽ Tổ Chức Tại
            </p>
          </div>

          {/* ═════════ VENUE CONTENT ═════════ */}
          <div style={{ padding: '24px 20px 0', textAlign: 'center' }}>
            <p
              style={{
                fontSize: '0.85rem',
                color: textDark,
                fontWeight: 500,
                lineHeight: 1.6,
                marginBottom: 16
              }}
            >
              {address}
            </p>
            <div style={{ width: '100%', borderRadius: 8, overflow: 'hidden', marginBottom: 0 }}>
              <iframe
                title='wedding-venue-map'
                width='100%'
                height='380'
                style={{ border: 0, display: 'block' }}
                loading='lazy'
                allowFullScreen
                referrerPolicy='no-referrer-when-downgrade'
                src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
              />
            </div>
          </div>

          {/* ═════════ XAC NHAN THAM DU BANNER ═════════ */}
          <div
            style={{
              width: '100%',
              height: 68,
              ...redPatternStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 0
            }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: 4,
                color: '#fff',
                textTransform: 'uppercase'
              }}
            >
              Xác Nhận Tham Dự
            </p>
          </div>

          {/* ═════════ RSVP FORM ═════════ */}
          <div style={{ padding: '36px 40px 52px', ...creamPatternStyle }}>
            {/* Lời chào – same style as wedding announcement */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <p
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: red,
                  letterSpacing: 4,
                  textTransform: 'uppercase',
                  marginBottom: 6
                }}
              >
                Kính mời
              </p>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '2.2rem',
                  fontWeight: 400,
                  color: red,
                  lineHeight: 1.2,
                  marginBottom: 10
                }}
              >
                {formattedName}
              </h3>
              <p
                style={{
                  fontSize: '0.78rem',
                  color: textDark,
                  fontStyle: 'italic',
                  letterSpacing: 1
                }}
              >
                vinh dự được đón tiếp tại lễ thành hôn của gia đình chúng tôi
              </p>
              <div style={{ width: 48, height: 1, backgroundColor: red, margin: '16px auto 0', opacity: 0.5 }} />
            </div>

            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}
              >
                <div>
                  <p
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: textDark,
                      letterSpacing: 3,
                      textTransform: 'uppercase',
                      textAlign: 'center',
                      marginBottom: 12
                    }}
                  >
                    Xin quý khách vui lòng xác nhận
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <button
                      type='button'
                      className='btn-attend'
                      onClick={() => setIsAttending(true)}
                      style={{
                        padding: '14px 8px',
                        borderRadius: 4,
                        border: isAttending === true ? `2px solid ${red}` : `1px solid ${red}50`,
                        background: isAttending === true ? `rgba(214,131,138,0.12)` : 'rgba(255,255,255,0.7)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: isAttending === true ? red : textDark,
                        transition: 'all .2s',
                        fontFamily: "'Lora', serif"
                      }}
                    >
                      ✦ Hân hạnh tham dự
                    </button>
                    <button
                      type='button'
                      className='btn-decline'
                      onClick={() => setIsAttending(false)}
                      style={{
                        padding: '14px 8px',
                        borderRadius: 4,
                        border: isAttending === false ? '2px solid #9e8a82' : `1px solid ${red}50`,
                        background: isAttending === false ? 'rgba(158,138,130,0.08)' : 'rgba(255,255,255,0.7)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: isAttending === false ? '#7a6a64' : textDark,
                        transition: 'all .2s',
                        fontFamily: "'Lora', serif"
                      }}
                    >
                      ◦ Thành thật xin lỗi
                    </button>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Số điện thoại</label>
                  <input
                    type='tel'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder='0901 234 567 (không bắt buộc)'
                    style={inputStyle}
                  />
                </div>

                {isAttending !== false && (
                  <div>
                    <label style={labelStyle}>Số lượng khách tham dự</label>
                    <div style={{ display: 'flex' }}>
                      {[1, 2, 3, 4, 5].map((n, i) => (
                        <button
                          key={n}
                          type='button'
                          onClick={() => setPartySize(n)}
                          style={{
                            flex: 1,
                            padding: '11px 4px',
                            border: `1px solid ${partySize === n ? red : red + '40'}`,
                            borderRight: i < 4 ? 'none' : `1px solid ${partySize === n ? red : red + '40'}`,
                            borderRadius: i === 0 ? '4px 0 0 4px' : i === 4 ? '0 4px 4px 0' : '0',
                            background: partySize === n ? red : 'rgba(255,255,255,0.7)',
                            color: partySize === n ? '#fff' : textDark,
                            fontWeight: 700,
                            fontSize: 14,
                            cursor: 'pointer',
                            fontFamily: "'Lora', serif"
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Lời chúc mừng</label>
                  <textarea
                    value={wish}
                    onChange={(e) => setWish(e.target.value)}
                    placeholder='Kính chúc đôi uyên ương trăm năm hạnh phúc...'
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                <button
                  type='submit'
                  disabled={loading || isAttending === null}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: isAttending === null || loading ? '#ccc' : red,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: 3,
                    textTransform: 'uppercase',
                    cursor: loading || isAttending === null ? 'not-allowed' : 'pointer',
                    fontFamily: "'Playfair Display', serif"
                  }}
                >
                  {loading ? 'Đang gửi...' : isAttending === false ? 'Gửi phản hồi' : 'Xác nhận tham dự'}
                </button>

                {submitError && (
                  <p style={{ color: '#dc2626', fontSize: '0.85rem', textAlign: 'center' }}>{submitError}</p>
                )}
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>{isAttending ? '🎊' : '💝'}</div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.4rem',
                    fontWeight: 400,
                    color: isAttending ? red : '#7a6a64',
                    marginBottom: 10
                  }}
                >
                  {isAttending ? 'Hân hạnh được đón tiếp quý khách!' : 'Trân trọng sự phản hồi của quý khách!'}
                </h3>
                <p style={{ color: textDark, fontSize: '0.85rem', fontStyle: 'italic' }}>
                  {isAttending
                    ? `Chúng tôi sẽ sắp xếp chỗ ngồi dành riêng cho ${formattedName}.`
                    : 'Chúc quý khách nhiều sức khỏe và hạnh phúc.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ═════════ RIGHT PANEL ═════════ */}
        <div className='vintage-side-panel' style={{ flex: 1, minHeight: '100vh', background: '#fff' }} />
      </div>

      {/* ═════════ LIGHTBOX ═════════ */}
      {lightboxIndex !== null && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '2rem',
              cursor: 'pointer',
              zIndex: 10000
            }}
          >
            &times;
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : albumImages.length - 1))
            }}
            style={{
              position: 'absolute',
              left: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '3rem',
              cursor: 'pointer',
              zIndex: 10000
            }}
          >
            &#10094;
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((prev) => (prev! < albumImages.length - 1 ? prev! + 1 : 0))
            }}
            style={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '3rem',
              cursor: 'pointer',
              zIndex: 10000
            }}
          >
            &#10095;
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={albumImages[lightboxIndex]}
            alt={`Ảnh phóng to`}
            style={{
              maxWidth: '90%',
              maxHeight: '80vh',
              objectFit: 'contain',
              borderRadius: 8
            }}
          />

          <div style={{ color: '#fff', marginTop: 16, fontSize: '0.9rem', letterSpacing: 2 }}>
            {lightboxIndex + 1} / {albumImages.length}
          </div>
        </div>
      )}
    </>
  )
}
