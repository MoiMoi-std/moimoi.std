import { createClient } from '@supabase/supabase-js'
import Head from 'next/head'
import { useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function ModernGuestView({ wedding, guestName = '' }: TemplateProps) {
  const [wish, setWish] = useState('')
  const [phone, setPhone] = useState('')
  const [isAttending, setIsAttending] = useState<boolean | null>(null)
  const [partySize, setPartySize] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const accent = '#6366f1'
  const accentLight = '#818cf8'
  const darkBg = '#0f0f23'
  const cardBg = 'rgba(255,255,255,0.06)'

  if (!wedding) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: darkBg,
          fontFamily: "'Inter', sans-serif"
        }}
      >
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🔗</div>
          <h1 style={{ color: '#fff', marginBottom: 8 }}>Không tìm thấy thiệp cưới</h1>
          <p style={{ color: '#64748b' }}>Link mời có thể đã hết hạn hoặc không hợp lệ.</p>
        </div>
      </div>
    )
  }

  const { content, template } = wedding
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }
  const primary = mergedContent.primary_color || accent
  const formattedName = guestName

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSubmitError('')
    try {
      const { error } = await supabase.from('rsvps').insert({
        wedding_id: wedding.id,
        guest_name: formattedName,
        phone: phone.trim() || null,
        is_attending: isAttending,
        party_size: isAttending ? partySize : 1,
        wishes: wish.trim() || null
      })
      if (error) throw error
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
    fontFamily: "'Inter', sans-serif",
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

  return (
    <>
      <Head>
        <title>Thiệp mời — {formattedName}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap'
          rel='stylesheet'
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${darkBg}; -webkit-font-smoothing: antialiased; }

          input:focus, textarea:focus, select:focus {
            border-color: ${primary} !important;
            background: rgba(255,255,255,0.08) !important;
            box-shadow: 0 0 0 3px ${primary}25, 0 0 20px ${primary}15 !important;
          }

          @keyframes heroSlide {
            from { opacity: 0; transform: translateY(50px) scale(0.96); filter: blur(8px); }
            to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes gradientShift {
            0%   { background-position: 0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 15px ${primary}20; }
            50%      { box-shadow: 0 0 30px ${primary}40, 0 0 60px ${primary}15; }
          }
          @keyframes pulse3d {
            0%, 100% { transform: scale(1); }
            50%      { transform: scale(1.06); }
          }
          @keyframes successPop {
            0%   { transform: scale(0) rotate(-180deg); opacity: 0; }
            60%  { transform: scale(1.2) rotate(15deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          @keyframes borderPulse {
            0%, 100% { border-color: rgba(255,255,255,0.08); }
            50%      { border-color: ${primary}40; }
          }
          @keyframes orbitSlow {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }

          .mg-hero  { animation: heroSlide 1s cubic-bezier(.16,1,.3,1) both; }
          .mg-fade  { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) both; }
          .mg-fade:nth-child(2) { animation-delay: .1s; }
          .mg-fade:nth-child(3) { animation-delay: .2s; }
          .mg-fade:nth-child(4) { animation-delay: .3s; }
          .mg-pulse { animation: pulse3d 3s ease-in-out infinite; }
          .mg-pop   { animation: successPop 0.8s cubic-bezier(.175,.885,.32,1.275) both; }
          .mg-glow  { animation: glow 3s ease-in-out infinite; }

          .mg-glass {
            background: ${cardBg};
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 24px;
            box-shadow: 0 8px 32px rgba(0,0,0,.2);
            animation: borderPulse 4s ease-in-out infinite;
          }

          .mg-gradient {
            background: linear-gradient(135deg, ${accent}, ${accentLight}, #c084fc, ${accent});
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradientShift 6s ease infinite;
          }

          .btn-mg-attend:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(34,197,94,.25); }
          .btn-mg-decline:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(239,68,68,.2); }
          .btn-mg-submit:not(:disabled):hover { transform: translateY(-3px); box-shadow: 0 12px 40px ${primary}45; }

          .mg-orbit {
            position: absolute;
            border: 1px solid ${primary}10;
            border-radius: 50%;
            animation: orbitSlow 30s linear infinite;
            pointer-events: none;
          }
        `}</style>
      </Head>

      <div
        style={{
          minHeight: '100vh',
          background: `linear-gradient(170deg, ${darkBg}, #111133, ${darkBg})`,
          fontFamily: "'Inter', sans-serif",
          color: '#e2e8f0'
        }}
      >
        {/* ══ Hero ══ */}
        <div style={{ position: 'relative', overflow: 'hidden', padding: '64px 20px 56px', textAlign: 'center' }}>
          {/* Orbit rings */}
          <div
            className='mg-orbit'
            style={{ width: 300, height: 300, top: '50%', left: '50%', marginTop: -150, marginLeft: -150 }}
          />
          <div
            className='mg-orbit'
            style={{
              width: 500,
              height: 500,
              top: '50%',
              left: '50%',
              marginTop: -250,
              marginLeft: -250,
              animationDirection: 'reverse',
              animationDuration: '45s'
            }}
          />

          {/* Gradient blobs */}
          <div
            style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${primary}20, transparent 70%)`,
              filter: 'blur(40px)',
              pointerEvents: 'none'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -40,
              left: -40,
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(168,85,247,.15), transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none'
            }}
          />

          <div className='mg-hero' style={{ position: 'relative', zIndex: 1 }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: accentLight,
                marginBottom: 16
              }}
            >
              WE INVITE YOU
            </p>

            <h1
              className='mg-gradient'
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(2.5rem, 9vw, 4rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: 14
              }}
            >
              {formattedName}
            </h1>

            <p style={{ fontSize: 15, color: '#64748b', fontStyle: 'italic', marginBottom: 10 }}>
              tới tham dự lễ thành hôn của
            </p>

            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '0.02em'
              }}
            >
              {mergedContent.groom_name} &amp; {mergedContent.bride_name}
            </h2>

            {/* Neon divider */}
            <div
              style={{
                margin: '22px auto 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12
              }}
            >
              <div
                style={{
                  height: 2,
                  width: 50,
                  background: `linear-gradient(to right, transparent, ${primary})`,
                  borderRadius: 2
                }}
              />
              <div
                className='mg-pulse'
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: primary,
                  boxShadow: `0 0 12px ${primary}`
                }}
              />
              <div
                style={{
                  height: 2,
                  width: 50,
                  background: `linear-gradient(to left, transparent, ${primary})`,
                  borderRadius: 2
                }}
              />
            </div>
          </div>
        </div>

        {/* ══ Cards ══ */}
        <div
          style={{
            maxWidth: 540,
            margin: '0 auto',
            padding: '0 16px 70px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}
        >
          {/* Cover image */}
          {mergedContent.cover_image && (
            <div
              className='mg-fade'
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,.08)',
                boxShadow: `0 10px 40px rgba(0,0,0,.3), 0 0 20px ${primary}10`
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mergedContent.cover_image}
                alt='Wedding Cover'
                style={{ width: '100%', display: 'block', maxHeight: 300, objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Event info */}
          <div className='mg-fade mg-glass' style={{ padding: '26px 24px' }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: accentLight,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                textAlign: 'center',
                marginBottom: 18
              }}
            >
              ✦ EVENT DETAILS
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: '📅', label: 'Ngày cưới', value: mergedContent.event_date },
                { icon: '⏰', label: 'Giờ', value: mergedContent.wedding_time },
                { icon: '📍', label: 'Địa điểm', value: mergedContent.address }
              ].map(({ icon, label, value }) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '12px 14px',
                    background: `${primary}08`,
                    borderRadius: 14,
                    border: `1px solid ${primary}12`
                  }}
                >
                  <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1 }}>{icon}</span>
                  <div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: accentLight,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        display: 'block',
                        marginBottom: 2
                      }}
                    >
                      {label}
                    </span>
                    <span style={{ fontSize: 15, color: '#e2e8f0', fontWeight: 500, lineHeight: 1.4 }}>
                      {value || '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RSVP Form / Success */}
          {!submitted ? (
            <div className='mg-fade mg-glass' style={{ padding: '28px 24px' }}>
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
                {/* Attendance */}
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
                      ✅ Có, tôi sẽ đến
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
                      ❌ Xin lỗi, tôi bận
                    </button>
                  </div>
                </div>

                {/* Phone */}
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

                {/* Party size */}
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
                          borderColor: partySize === n ? primary : 'rgba(255,255,255,.1)',
                          borderRight: i < 4 ? 'none' : '1.5px solid',
                          borderRightColor: partySize === n ? primary : 'rgba(255,255,255,.1)',
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
                          boxShadow: partySize === n ? `0 4px 16px ${primary}30` : 'none'
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: '#475569', marginTop: 5 }}>người tham dự</p>
                </div>

                {/* Wishes */}
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

                {/* Submit */}
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
                    boxShadow: isAttending !== null && !loading ? `0 8px 30px ${primary}40` : 'none',
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
            /* ══ Success ══ */
            <div className='mg-fade mg-glass' style={{ padding: '52px 28px', textAlign: 'center' }}>
              <div className='mg-pop' style={{ fontSize: '4rem', marginBottom: 22 }}>
                {isAttending ? '🎊' : '💜'}
              </div>
              <h3
                className='mg-gradient'
                style={{
                  fontFamily: "'Outfit', sans-serif",
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
                  ? `Chúng tôi rất vui được đón tiếp ${formattedName}. Hẹn gặp trong ngày vui! 🥂`
                  : 'Rất tiếc khi bạn không thể tham dự. Mong có dịp gặp nhau trong tương lai! 💕'}
              </p>
              {wish && (
                <div
                  style={{
                    marginTop: 28,
                    padding: '16px 20px',
                    background: `${primary}10`,
                    borderRadius: 14,
                    borderLeft: `3px solid ${primary}`,
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
      </div>
    </>
  )
}
