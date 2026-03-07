import { createClient } from '@supabase/supabase-js'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function CherryBlossomGuestView({ wedding, guestName = '', rsvpId }: TemplateProps) {
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

  const pink = '#d4507a'
  const pinkDark = '#a83258'
  const pinkLight = '#f9a8c9'
  const textDark = '#2d1020'
  const textMid = '#8a5065'

  if (!wedding) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff5f9'
        }}
      >
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div
            style={{
              width: 48,
              height: 48,
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                width: 24,
                height: 32,
                borderRadius: '50% 0 50% 0',
                background: '#d4507a',
                opacity: 0.6,
                transform: 'rotate(-15deg)'
              }}
            />
          </div>
          <h1 style={{ color: pink, fontFamily: "'Quicksand', sans-serif" }}>Không tìm thấy thiệp mời</h1>
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
    border: `1.5px solid ${pink}35`,
    borderRadius: 16,
    fontSize: 15,
    outline: 'none',
    background: 'rgba(255,255,255,0.9)',
    boxSizing: 'border-box',
    fontFamily: "'Quicksand', sans-serif",
    color: textDark,
    transition: 'border-color 0.25s, box-shadow 0.25s'
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 7,
    fontWeight: 700,
    fontSize: 11,
    color: pink,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    fontFamily: "'Quicksand', sans-serif"
  }

  return (
    <>
      <Head>
        <title>Thiệp mời — {guestName}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Noto+Serif+JP:wght@300;400;500;600;700&display=swap'
          rel='stylesheet'
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #fff5f9; -webkit-font-smoothing: antialiased; }

          input:focus, textarea:focus {
            border-color: ${pink} !important;
            box-shadow: 0 0 0 3px ${pink}22 !important;
          }

          @keyframes cbFadeUp {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes cbPetalFall {
            0%   { transform: translateY(-5vh) translateX(0) rotate(0deg); opacity: 0.7; }
            100% { transform: translateY(110vh) translateX(40px) rotate(540deg); opacity: 0; }
          }
          @keyframes cbFloat {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(-10px); }
          }
          @keyframes cbGlow {
            0%, 100% { box-shadow: 0 4px 20px ${pink}14; }
            50%       { box-shadow: 0 8px 36px ${pink}30; }
          }

          .c-fade { animation: cbFadeUp 0.75s cubic-bezier(.16,1,.3,1) both; }
          .c-fade:nth-child(2) { animation-delay: .1s; }
          .c-fade:nth-child(3) { animation-delay: .2s; }
          .c-fade:nth-child(4) { animation-delay: .3s; }
          .c-float { animation: cbFloat 5s ease-in-out infinite; display: inline-block; }

          .c-petal {
            position: absolute;
            font-size: 1.1rem;
            animation: cbPetalFall linear infinite;
            opacity: 0.5;
            pointer-events: none;
            user-select: none;
          }

          .c-card {
            background: rgba(255,255,255,0.9);
            backdrop-filter: blur(16px);
            border: 1.5px solid ${pink}20;
            border-radius: 24px;
            box-shadow: 0 6px 28px ${pink}0e;
            animation: cbGlow 5s ease-in-out infinite;
          }

          .btn-cb-yes:hover  { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(34,197,94,0.25); }
          .btn-cb-no:hover   { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(239,68,68,0.2); }
          .btn-cb-sub:not(:disabled):hover {
            transform: translateY(-3px);
            box-shadow: 0 14px 40px ${pink}50;
          }
        `}</style>
      </Head>

      <div
        style={{
          minHeight: '100vh',
          background: `linear-gradient(165deg, #fff5f9 0%, #fce4ec 55%, #f3e5f5 100%)`,
          fontFamily: "'Quicksand', sans-serif",
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
            <div style={{ position: 'absolute', inset: 0, background: pinkDark, zIndex: 0 }} />
          )}
          {/* Romantic dark overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(90,20,45,0.22) 0%, rgba(30,5,18,0.78) 100%)',
              zIndex: 1
            }}
          />
          {/* CSS petal shapes in corners */}
          {[
            { top: 12, left: 12 },
            { top: 12, right: 12 },
            { bottom: 12, left: 12 },
            { bottom: 12, right: 12 }
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                zIndex: 2,
                width: 22,
                height: 28,
                opacity: 0.28,
                background: '#fff',
                clipPath: 'ellipse(40% 50% at 50% 50%)',
                transform: `rotate(${i * 90}deg)`,
                ...pos
              }}
            />
          ))}
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
                fontWeight: 700,
                color: 'rgba(255,255,255,0.65)',
                letterSpacing: '0.38em',
                textTransform: 'uppercase',
                marginBottom: 20
              }}
            >
              TRÂN TRỌNG KÍNH MỜI
            </p>
            <h1
              style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: 'clamp(2rem, 7vw, 3.2rem)',
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.15,
                marginBottom: 14,
                textShadow: '0 3px 32px rgba(0,0,0,0.55)'
              }}
            >
              {guestName}
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', marginBottom: 10 }}>
              tới tham dự lễ thành hôn của
            </p>
            <p
              style={{
                fontFamily: "'Noto Serif JP', serif",
                fontSize: 'clamp(1rem, 3vw, 1.3rem)',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.92)',
                letterSpacing: '0.04em'
              }}
            >
              {mergedContent.groom_name} &amp; {mergedContent.bride_name}
            </p>
            <div style={{ margin: '20px auto 0', width: 56, height: 1, background: `rgba(255,200,220,0.5)` }} />
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
          <div className='c-fade c-card' style={{ padding: '26px 22px' }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: pink,
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
                    background: `${pink}0c`,
                    borderRadius: 14,
                    border: `1px solid ${pink}18`
                  }}
                >
                  <span style={{ flexShrink: 0, lineHeight: 1, color: pink, marginTop: 1 }}>{icon}</span>
                  <div>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: pink,
                        textTransform: 'uppercase',
                        letterSpacing: '0.14em',
                        display: 'block',
                        marginBottom: 3
                      }}
                    >
                      {label}
                    </span>
                    <span style={{ fontSize: 15, color: textDark, fontWeight: 600, lineHeight: 1.4 }}>
                      {value || '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RSVP Form */}
          {!submitted ? (
            <div className='c-fade c-card' style={{ padding: '28px 22px' }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: pink,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  marginBottom: 4
                }}
              >
                Xác nhận tham dự
              </p>
              <p style={{ textAlign: 'center', color: textMid, fontSize: 13, marginBottom: 24 }}>
                Vui lòng điền thông tin để chúng tôi chuẩn bị đón tiếp
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {/* Tham dự? */}
                <div>
                  <label style={labelStyle}>Bạn có tham dự không? *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button
                      type='button'
                      className='btn-cb-yes'
                      onClick={() => setIsAttending(true)}
                      style={{
                        padding: '13px 8px',
                        borderRadius: 16,
                        border: isAttending === true ? `2px solid #22c55e` : `1.5px solid ${pink}28`,
                        background: isAttending === true ? '#f0fdf4' : 'rgba(255,255,255,0.7)',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 700,
                        color: isAttending === true ? '#15803d' : textMid,
                        transition: 'all .2s',
                        fontFamily: "'Quicksand', sans-serif"
                      }}
                    >
                      Có, tôi sẽ đến
                    </button>
                    <button
                      type='button'
                      className='btn-cb-no'
                      onClick={() => setIsAttending(false)}
                      style={{
                        padding: '13px 8px',
                        borderRadius: 16,
                        border: isAttending === false ? `2px solid #ef4444` : `1.5px solid ${pink}28`,
                        background: isAttending === false ? '#fef2f2' : 'rgba(255,255,255,0.7)',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 700,
                        color: isAttending === false ? '#dc2626' : textMid,
                        transition: 'all .2s',
                        fontFamily: "'Quicksand', sans-serif"
                      }}
                    >
                      Xin lỗi, tôi bận
                    </button>
                  </div>
                </div>

                {/* Điện thoại */}
                <div>
                  <label style={labelStyle}>
                    Số điện thoại{' '}
                    <span
                      style={{
                        color: '#c9a0b4',
                        fontSize: 11,
                        fontWeight: 500,
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
                          border: '1.5px solid',
                          borderColor: partySize === n ? pink : `${pink}28`,
                          borderRight: i < 4 ? 'none' : '1.5px solid',
                          borderRightColor: partySize === n ? pink : `${pink}28`,
                          borderRadius: i === 0 ? '14px 0 0 14px' : i === 4 ? '0 14px 14px 0' : '0',
                          background:
                            partySize === n ? `linear-gradient(135deg, ${pinkDark}, ${pink})` : 'rgba(255,255,255,0.7)',
                          color: partySize === n ? '#fff' : textMid,
                          fontWeight: 700,
                          fontSize: 15,
                          cursor: 'pointer',
                          transition: 'all .2s',
                          fontFamily: "'Quicksand', sans-serif",
                          boxShadow: partySize === n ? `0 4px 16px ${pink}35` : 'none'
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: '#c9a0b4', marginTop: 5 }}>người tham dự</p>
                </div>

                {/* Lời chúc */}
                <div>
                  <label style={labelStyle}>
                    Lời chúc{' '}
                    <span
                      style={{
                        color: '#c9a0b4',
                        fontSize: 11,
                        fontWeight: 500,
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
                    placeholder='Chúc hai bạn trăm năm hạnh phúc, ngọt ngào như hoa anh đào...'
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
                  />
                </div>

                {/* Submit */}
                <button
                  type='submit'
                  className='btn-cb-sub'
                  disabled={loading || isAttending === null}
                  style={{
                    width: '100%',
                    padding: 16,
                    background:
                      isAttending === null || loading
                        ? '#f0d5e0'
                        : `linear-gradient(135deg, ${pinkDark}, ${pink}, ${pinkLight})`,
                    color: isAttending === null || loading ? '#c9a0b4' : '#fff',
                    border: 'none',
                    borderRadius: 18,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: loading || isAttending === null ? 'not-allowed' : 'pointer',
                    letterSpacing: '0.05em',
                    transition: 'all .3s',
                    boxShadow: isAttending !== null && !loading ? `0 8px 30px ${pink}45` : 'none',
                    fontFamily: "'Quicksand', sans-serif"
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
                      borderRadius: 14,
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
            <div className='c-fade c-card' style={{ padding: '52px 28px', textAlign: 'center' }}>
              <svg
                style={{ color: pinkDark, marginBottom: 20, opacity: 0.7 }}
                width='44'
                height='44'
                viewBox='0 0 48 48'
                fill='currentColor'
              >
                <ellipse cx='24' cy='24' rx='10' ry='22' />
                <ellipse cx='24' cy='24' rx='22' ry='10' />
              </svg>
              <h3
                style={{
                  fontFamily: "'Noto Serif JP', serif",
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: pink,
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
                    padding: '14px 20px',
                    background: `${pink}0d`,
                    borderRadius: 16,
                    borderLeft: `3px solid ${pink}`,
                    textAlign: 'left'
                  }}
                >
                  <p
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: pink,
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
              <div style={{ marginTop: 28, fontSize: '0.1rem' }}></div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
