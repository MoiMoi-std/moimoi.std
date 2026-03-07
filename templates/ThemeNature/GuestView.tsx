import { createClient } from '@supabase/supabase-js'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function NatureGuestView({ wedding, guestName = '', rsvpId }: TemplateProps) {
  const [wish, setWish] = useState('')
  const [phone, setPhone] = useState('')
  const [isAttending, setIsAttending] = useState<boolean | null>(null)
  const [partySize, setPartySize] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

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

  const sage = '#4a7c59'
  const sageDark = '#2f5c3e'
  const cream = '#f6f2ea'
  const textDark = '#2a2018'
  const textMid = '#6a5040'

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
          <svg width='48' height='48' viewBox='0 0 48 48' fill='none' style={{ marginBottom: 12, opacity: 0.55 }}>
            <path d='M8 40 Q12 16 40 8 Q24 24 8 40Z' fill='#4a7c59' />
          </svg>
          <h1 style={{ color: sage, fontFamily: "'Lora', serif" }}>Không tìm thấy thiệp mời</h1>
          <p style={{ color: textMid, marginTop: 8 }}>Link mời có thể đã hết hạn hoặc không hợp lệ.</p>
        </div>
      </div>
    )
  }

  const { content, template } = wedding
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }

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
    padding: '13px 16px',
    border: `1.5px solid ${sage}40`,
    borderRadius: 14,
    fontSize: 15,
    outline: 'none',
    background: 'rgba(255,255,255,0.85)',
    boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif",
    color: textDark,
    transition: 'border-color 0.25s, box-shadow 0.25s'
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 7,
    fontWeight: 600,
    fontSize: 11,
    color: sage,
    letterSpacing: '0.16em',
    textTransform: 'uppercase'
  }

  return (
    <>
      <Head>
        <title>Thiệp mời — {guestName}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap'
          rel='stylesheet'
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #f5f0e8; -webkit-font-smoothing: antialiased; }

          input:focus, textarea:focus, select:focus {
            border-color: ${sage} !important;
            box-shadow: 0 0 0 3px ${sage}22 !important;
          }

          @keyframes natFadeUp {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes natFloat {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(-10px); }
          }
          @keyframes natSway {
            0%, 100% { transform: rotate(-5deg); }
            50%       { transform: rotate(5deg) translateY(-6px); }
          }

          .n-fade { animation: natFadeUp 0.7s cubic-bezier(.16,1,.3,1) both; }
          .n-fade:nth-child(2) { animation-delay: .1s; }
          .n-fade:nth-child(3) { animation-delay: .2s; }
          .n-fade:nth-child(4) { animation-delay: .3s; }
          .n-float { animation: natFloat 5s ease-in-out infinite; display: inline-block; }
          .n-sway  { animation: natSway 5s ease-in-out infinite; display: inline-block; }

          .n-card {
            background: rgba(255,255,255,0.85);
            backdrop-filter: blur(12px);
            border: 1.5px solid rgba(125,155,118,0.2);
            border-radius: 22px;
            box-shadow: 0 4px 20px rgba(61,48,37,0.07);
          }

          .btn-nat-yes:hover  { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(34,197,94,.2); }
          .btn-nat-no:hover   { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(239,68,68,.15); }
          .btn-nat-sub:not(:disabled):hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 36px ${sage}45;
          }
        `}</style>
      </Head>

      <div
        style={{
          minHeight: '100vh',
          background: `linear-gradient(160deg, #f5f0e8 0%, #ede8dc 60%, #f5f0e8 100%)`,
          fontFamily: "'DM Sans', sans-serif",
          color: textDark
        }}
      >
        {/* ══ Hero ══ */}
        <div style={{ position: 'relative', overflow: 'hidden', height: 380 }}>
          {mergedContent.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mergedContent.cover_image}
              alt=''
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: sageDark, zIndex: 0 }} />
          )}
          {/* Forest gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(20,38,22,0.18) 0%, rgba(8,20,10,0.75) 100%)',
              zIndex: 1
            }}
          />
          {/* SVG leaf corners */}
          <svg
            style={{ position: 'absolute', top: 18, left: 18, opacity: 0.25, zIndex: 2 }}
            width='44'
            height='44'
            viewBox='0 0 48 48'
            fill='none'
          >
            <path d='M4 4 C4 24,24 44,44 44 C44 24,24 4,4 4Z' fill='#fff' />
          </svg>
          <svg
            style={{ position: 'absolute', top: 18, right: 18, opacity: 0.25, zIndex: 2, transform: 'scaleX(-1)' }}
            width='44'
            height='44'
            viewBox='0 0 48 48'
            fill='none'
          >
            <path d='M4 4 C4 24,24 44,44 44 C44 24,24 4,4 4Z' fill='#fff' />
          </svg>
          {/* Text content */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 24px',
              textAlign: 'center'
            }}
          >
            <p
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.68)',
                letterSpacing: '0.38em',
                textTransform: 'uppercase',
                marginBottom: 20
              }}
            >
              TRÂN TRỌNG KÍNH MỜI
            </p>
            <h1
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: 'clamp(2rem, 7vw, 3.2rem)',
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.15,
                marginBottom: 14,
                textShadow: '0 3px 28px rgba(0,0,0,0.5)'
              }}
            >
              {guestName}
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', fontStyle: 'italic', marginBottom: 10 }}>
              tới tham dự lễ thành hôn của
            </p>
            <p
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: 'clamp(1rem, 3vw, 1.3rem)',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.92)',
                letterSpacing: '0.04em'
              }}
            >
              {mergedContent.groom_name} &amp; {mergedContent.bride_name}
            </p>
            <div style={{ margin: '20px auto 0', width: 56, height: 1, background: 'rgba(255,255,255,0.3)' }} />
          </div>
        </div>

        {/* ══ Cards ══ */}
        <div
          style={{
            maxWidth: 540,
            margin: '0 auto',
            padding: '0 16px 72px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}
        >
          {/* Event info */}
          <div className='n-fade n-card' style={{ padding: '26px 22px' }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: sage,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                textAlign: 'center',
                marginBottom: 18
              }}
            >
              Thông tin sự kiện
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(
                [
                  {
                    icon: (
                      <svg
                        width='18'
                        height='18'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <rect x='3' y='4' width='18' height='18' rx='2' />
                        <line x1='16' y1='2' x2='16' y2='6' />
                        <line x1='8' y1='2' x2='8' y2='6' />
                        <line x1='3' y1='10' x2='21' y2='10' />
                      </svg>
                    ),
                    label: 'Ngày cưới',
                    value: mergedContent.event_date
                  },
                  {
                    icon: (
                      <svg
                        width='18'
                        height='18'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <circle cx='12' cy='12' r='10' />
                        <polyline points='12 6 12 12 16 14' />
                      </svg>
                    ),
                    label: 'Giờ',
                    value: mergedContent.wedding_time
                  },
                  {
                    icon: (
                      <svg
                        width='18'
                        height='18'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' />
                        <circle cx='12' cy='10' r='3' />
                      </svg>
                    ),
                    label: 'Địa điểm',
                    value: mergedContent.address
                  }
                ] as { icon: React.ReactNode; label: string; value: string }[]
              ).map(({ icon, label, value }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '12px 14px',
                    background: `${sage}0f`,
                    borderRadius: 14,
                    border: `1px solid ${sage}20`
                  }}
                >
                  <span style={{ flexShrink: 0, lineHeight: 1, color: sage, marginTop: 1 }}>{icon}</span>
                  <div>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        color: sage,
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        display: 'block',
                        marginBottom: 3
                      }}
                    >
                      {label}
                    </span>
                    <span style={{ fontSize: 15, color: textDark, fontWeight: 500, lineHeight: 1.4 }}>
                      {value || '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RSVP Form */}
          {!submitted ? (
            <div className='n-fade n-card' style={{ padding: '28px 22px' }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: sage,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  marginBottom: 4
                }}
              >
                Xác nhận tham dự
              </p>
              <p style={{ textAlign: 'center', color: textMid, fontSize: 13, marginBottom: 24, fontStyle: 'italic' }}>
                Vui lòng điền thông tin để chúng tôi chuẩn bị đón tiếp
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {/* Tham dự? */}
                <div>
                  <label style={labelStyle}>Bạn có tham dự không? *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button
                      type='button'
                      className='btn-nat-yes'
                      onClick={() => setIsAttending(true)}
                      style={{
                        padding: '13px 8px',
                        borderRadius: 14,
                        border: isAttending === true ? `2px solid #22c55e` : `1.5px solid ${sage}35`,
                        background: isAttending === true ? '#f0fdf4' : 'rgba(255,255,255,0.7)',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 600,
                        color: isAttending === true ? '#15803d' : textMid,
                        transition: 'all .2s',
                        fontFamily: "'DM Sans', sans-serif"
                      }}
                    >
                      Có, tôi sẽ đến
                    </button>
                    <button
                      type='button'
                      className='btn-nat-no'
                      onClick={() => setIsAttending(false)}
                      style={{
                        padding: '13px 8px',
                        borderRadius: 14,
                        border: isAttending === false ? `2px solid #ef4444` : `1.5px solid ${sage}35`,
                        background: isAttending === false ? '#fef2f2' : 'rgba(255,255,255,0.7)',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 600,
                        color: isAttending === false ? '#dc2626' : textMid,
                        transition: 'all .2s',
                        fontFamily: "'DM Sans', sans-serif"
                      }}
                    >
                      Xin lỗi, tôi bận
                    </button>
                  </div>
                </div>

                {/* Số điện thoại */}
                <div>
                  <label style={labelStyle}>
                    Số điện thoại{' '}
                    <span
                      style={{
                        color: '#b0a090',
                        fontSize: 11,
                        fontWeight: 400,
                        textTransform: 'none',
                        letterSpacing: 0
                      }}
                    >
                      (tùy chọn)
                    </span>
                  </label>
                  <input
                    type='tel'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder='0901 234 567'
                    style={inputStyle}
                  />
                </div>

                {/* Số người */}
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
                          border: `1.5px solid`,
                          borderColor: partySize === n ? sage : `${sage}30`,
                          borderRight: i < 4 ? 'none' : '1.5px solid',
                          borderRightColor: partySize === n ? sage : `${sage}30`,
                          borderRadius: i === 0 ? '12px 0 0 12px' : i === 4 ? '0 12px 12px 0' : '0',
                          background: partySize === n ? sage : 'rgba(255,255,255,0.7)',
                          color: partySize === n ? '#fff' : textMid,
                          fontWeight: 700,
                          fontSize: 15,
                          cursor: 'pointer',
                          transition: 'all .18s',
                          fontFamily: "'DM Sans', sans-serif"
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: '#b0a090', marginTop: 5 }}>người tham dự</p>
                </div>

                {/* Lời chúc */}
                <div>
                  <label style={labelStyle}>
                    Lời chúc{' '}
                    <span
                      style={{
                        color: '#b0a090',
                        fontSize: 11,
                        fontWeight: 400,
                        textTransform: 'none',
                        letterSpacing: 0
                      }}
                    >
                      (tùy chọn)
                    </span>
                  </label>
                  <textarea
                    value={wish}
                    onChange={(e) => setWish(e.target.value)}
                    placeholder='Chúc hai bạn trăm năm hạnh phúc, vạn sự như ý...'
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
                  />
                </div>

                {/* Submit */}
                <button
                  type='submit'
                  className='btn-nat-sub'
                  disabled={loading || isAttending === null}
                  style={{
                    width: '100%',
                    padding: 16,
                    background:
                      isAttending === null || loading ? '#e8dfd0' : `linear-gradient(135deg, ${sageDark}, ${sage})`,
                    color: isAttending === null || loading ? '#b0a090' : '#fff',
                    border: 'none',
                    borderRadius: 16,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: loading || isAttending === null ? 'not-allowed' : 'pointer',
                    letterSpacing: '0.04em',
                    transition: 'all .3s',
                    boxShadow: isAttending !== null && !loading ? `0 8px 28px ${sage}45` : 'none',
                    fontFamily: "'DM Sans', sans-serif"
                  }}
                >
                  {loading ? 'Đang gửi...' : 'Gửi xác nhận'}
                </button>

                {submitError && (
                  <div
                    style={{
                      padding: '12px 16px',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: 12,
                      color: '#dc2626',
                      fontSize: 14,
                      textAlign: 'center'
                    }}
                  >
                    {submitError}
                  </div>
                )}
              </form>
            </div>
          ) : (
            /* ══ Success ══ */
            <div className='n-fade n-card' style={{ padding: '52px 28px', textAlign: 'center' }}>
              <svg
                style={{ color: sage, marginBottom: 20, opacity: 0.85 }}
                width='48'
                height='48'
                viewBox='0 0 48 48'
                fill='currentColor'
              >
                <path d='M4 4 C4 24,24 44,44 44 C44 24,24 4,4 4Z' />
              </svg>
              <h3
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: sageDark,
                  marginBottom: 12,
                  lineHeight: 1.3
                }}
              >
                {isAttending ? 'Hẹn gặp bạn tại đám cưới!' : 'Cảm ơn bạn đã phản hồi!'}
              </h3>
              <p style={{ color: textMid, fontSize: 15, lineHeight: 1.75, maxWidth: 300, margin: '0 auto' }}>
                {isAttending
                  ? `Chúng tôi rất vui được đón tiếp ${guestName}. Hẹn gặp trong ngày vui!`
                  : 'Rất tiếc khi bạn không thể tham dự. Mong có dịp gặp nhau trong tương lai!'}
              </p>
              {wish && (
                <div
                  style={{
                    marginTop: 28,
                    padding: '16px 20px',
                    background: `${sage}0f`,
                    borderRadius: 14,
                    borderLeft: `3px solid ${sage}`,
                    textAlign: 'left'
                  }}
                >
                  <p
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: sage,
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      marginBottom: 8
                    }}
                  >
                    Lời chúc của bạn
                  </p>
                  <p style={{ color: textMid, fontStyle: 'italic', fontSize: 14, lineHeight: 1.7 }}>
                    &ldquo;{wish}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
