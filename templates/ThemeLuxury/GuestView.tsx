import { createClient } from '@supabase/supabase-js'
import Head from 'next/head'
import { useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function LuxuryGuestView({ wedding, guestName = '', rsvpId }: TemplateProps) {
  const [wish, setWish] = useState('')
  const [phone, setPhone] = useState('')
  const [isAttending, setIsAttending] = useState<boolean | null>(null)
  const [partySize, setPartySize] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const gold = '#C9A84C'
  const goldLight = '#E8D5A3'
  const goldDark = '#A08930'
  const darkBg = '#0a0a0a'
  const darkCard = '#141414'

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
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>👑</div>
          <h1 style={{ color: gold, marginBottom: 8, letterSpacing: '0.1em' }}>KHÔNG TÌM THẤY</h1>
          <p style={{ color: '#555' }}>Link mời có thể đã hết hạn hoặc không hợp lệ.</p>
        </div>
      </div>
    )
  }

  const { content, template } = wedding
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }
  const primary = mergedContent.primary_color || gold
  const formattedName = guestName

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
    border: `1px solid ${gold}20`,
    borderRadius: 12,
    fontSize: 15,
    outline: 'none',
    background: `${darkBg}`,
    boxSizing: 'border-box',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    color: '#d4d4d4',
    transition: 'border-color 0.3s, box-shadow 0.3s'
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 6,
    fontWeight: 700,
    fontSize: 11,
    color: gold,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontFamily: "'Cinzel', serif"
  }

  return (
    <>
      <Head>
        <title>Thiệp mời — {formattedName}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap'
          rel='stylesheet'
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${darkBg}; -webkit-font-smoothing: antialiased; }

          input:focus, textarea:focus, select:focus {
            border-color: ${gold} !important;
            box-shadow: 0 0 0 3px ${gold}20, 0 0 20px ${gold}10 !important;
          }

          @keyframes luxFadeIn {
            from { opacity: 0; transform: translateY(36px); filter: blur(4px); }
            to   { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          @keyframes goldShimmer {
            0%   { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes goldPulse {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50%      { opacity: 1; transform: scale(1.05); }
          }
          @keyframes breatheGlow {
            0%, 100% { box-shadow: 0 0 15px ${gold}10; border-color: ${gold}15; }
            50%      { box-shadow: 0 0 25px ${gold}25; border-color: ${gold}40; }
          }
          @keyframes crownDrop {
            0%   { transform: scale(0) rotate(-30deg); opacity: 0; }
            60%  { transform: scale(1.2) rotate(10deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-8px); }
          }

          .lg-fade { animation: luxFadeIn 0.8s cubic-bezier(.16,1,.3,1) both; }
          .lg-fade:nth-child(2) { animation-delay: .12s; }
          .lg-fade:nth-child(3) { animation-delay: .24s; }
          .lg-fade:nth-child(4) { animation-delay: .36s; }
          .lg-pulse { animation: goldPulse 3s ease-in-out infinite; }
          .lg-float { animation: float 4s ease-in-out infinite; display: inline-block; }
          .lg-crown { animation: crownDrop 0.9s cubic-bezier(.175,.885,.32,1.275) both; }

          .lg-card {
            background: linear-gradient(145deg, ${darkCard}, #1a1a1a);
            border: 1px solid ${gold}15;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.02);
            animation: breatheGlow 5s ease-in-out infinite;
          }

          .lg-gold-text {
            background: linear-gradient(90deg, ${goldDark}, ${gold}, ${goldLight}, ${gold}, ${goldDark});
            background-size: 200% 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: goldShimmer 5s linear infinite;
          }

          .lg-marble {
            height: 1px;
            background: linear-gradient(90deg, transparent, ${gold}40, ${gold}, ${gold}40, transparent);
          }

          .lg-diamond {
            width: 8px; height: 8px;
            background: ${gold};
            transform: rotate(45deg);
            display: inline-block;
            box-shadow: 0 0 10px ${gold}40;
          }

          .btn-lg-attend:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(34,197,94,.2); }
          .btn-lg-decline:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(239,68,68,.15); }
          .btn-lg-submit:not(:disabled):hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 40px ${gold}35;
          }

          .corner-lux {
            position: absolute; width: 40px; height: 40px; opacity: 0.35;
          }
          .corner-lux.tl { top: 12px; left: 12px; border-top: 1px solid ${gold}; border-left: 1px solid ${gold}; }
          .corner-lux.tr { top: 12px; right: 12px; border-top: 1px solid ${gold}; border-right: 1px solid ${gold}; }
          .corner-lux.bl { bottom: 12px; left: 12px; border-bottom: 1px solid ${gold}; border-left: 1px solid ${gold}; }
          .corner-lux.br { bottom: 12px; right: 12px; border-bottom: 1px solid ${gold}; border-right: 1px solid ${gold}; }
        `}</style>
      </Head>

      <div
        style={{
          minHeight: '100vh',
          background: `linear-gradient(170deg, ${darkBg}, #111, ${darkBg})`,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          color: '#d4d4d4'
        }}
      >
        {/* ══ Hero ══ */}
        <div style={{ position: 'relative', overflow: 'hidden', padding: '64px 20px 56px', textAlign: 'center' }}>
          {/* Corners */}
          <div className='corner-lux tl' />
          <div className='corner-lux tr' />
          <div className='corner-lux bl' />
          <div className='corner-lux br' />

          {/* Background glow */}
          <div
            style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${gold}08, transparent)`,
              filter: 'blur(60px)',
              pointerEvents: 'none'
            }}
          />

          <div
            className='lg-float'
            style={{ fontSize: '2.5rem', marginBottom: 18, filter: `drop-shadow(0 4px 16px ${gold}30)` }}
          >
            👑
          </div>

          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: gold,
              marginBottom: 20
            }}
          >
            CORDIALLY INVITED
          </p>

          <h1
            className='lg-gold-text'
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(2.2rem, 8vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 14,
              letterSpacing: '0.04em'
            }}
          >
            {formattedName}
          </h1>

          <p style={{ fontSize: 15, color: '#666', fontStyle: 'italic', marginBottom: 10 }}>
            tới tham dự lễ thành hôn của
          </p>

          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(1.1rem, 3.5vw, 1.5rem)',
              fontWeight: 700,
              color: goldLight,
              letterSpacing: '0.06em'
            }}
          >
            {mergedContent.groom_name} &amp; {mergedContent.bride_name}
          </h2>

          {/* Gold divider */}
          <div
            style={{ margin: '22px auto 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}
          >
            <div className='lg-marble' style={{ width: 50 }} />
            <span className='lg-diamond' />
            <div className='lg-marble' style={{ width: 50 }} />
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
              className='lg-fade'
              style={{
                borderRadius: 18,
                overflow: 'hidden',
                border: `1px solid ${gold}20`,
                boxShadow: `0 10px 40px rgba(0,0,0,.5), 0 0 20px ${gold}06`
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mergedContent.cover_image}
                alt='Wedding Cover'
                style={{
                  width: '100%',
                  display: 'block',
                  maxHeight: 300,
                  objectFit: 'cover',
                  filter: 'contrast(1.05) brightness(0.9)'
                }}
              />
            </div>
          )}

          {/* Event info */}
          <div className='lg-fade lg-card' style={{ padding: '26px 24px' }}>
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 9,
                fontWeight: 700,
                color: gold,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                textAlign: 'center',
                marginBottom: 18
              }}
            >
              ◆ EVENT DETAILS ◆
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
                    background: `${gold}06`,
                    borderRadius: 12,
                    border: `1px solid ${gold}10`
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1 }}>{icon}</span>
                  <div>
                    <span
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: 9,
                        fontWeight: 700,
                        color: gold,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        display: 'block',
                        marginBottom: 3
                      }}
                    >
                      {label}
                    </span>
                    <span style={{ fontSize: 15, color: '#bbb', fontWeight: 500, lineHeight: 1.4 }}>
                      {value || '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RSVP Form / Success */}
          {!submitted ? (
            <div className='lg-fade lg-card' style={{ padding: '28px 24px' }}>
              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: 9,
                  fontWeight: 700,
                  color: gold,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  marginBottom: 4
                }}
              >
                ◆ CONFIRM ATTENDANCE ◆
              </p>
              <p style={{ textAlign: 'center', color: '#666', fontSize: 13, marginBottom: 24, fontStyle: 'italic' }}>
                Vui lòng điền thông tin để chúng tôi chuẩn bị đón tiếp quý khách
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {/* Attendance */}
                <div>
                  <label style={labelStyle}>Tham dự *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button
                      type='button'
                      className='btn-lg-attend'
                      onClick={() => setIsAttending(true)}
                      style={{
                        padding: '14px 8px',
                        borderRadius: 12,
                        border: isAttending === true ? '2px solid #22c55e' : `1px solid ${gold}20`,
                        background: isAttending === true ? 'rgba(34,197,94,.08)' : darkBg,
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 600,
                        color: isAttending === true ? '#4ade80' : '#666',
                        transition: 'all .25s',
                        fontFamily: "'Cormorant Garamond', serif"
                      }}
                    >
                      ✅ Tôi sẽ đến
                    </button>
                    <button
                      type='button'
                      className='btn-lg-decline'
                      onClick={() => setIsAttending(false)}
                      style={{
                        padding: '14px 8px',
                        borderRadius: 12,
                        border: isAttending === false ? '2px solid #b91c1c' : `1px solid ${gold}20`,
                        background: isAttending === false ? 'rgba(185,28,28,.06)' : darkBg,
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 600,
                        color: isAttending === false ? '#f87171' : '#666',
                        transition: 'all .25s',
                        fontFamily: "'Cormorant Garamond', serif"
                      }}
                    >
                      ❌ Xin lỗi, bận
                    </button>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label style={labelStyle}>
                    Điện thoại{' '}
                    <span
                      style={{
                        color: '#555',
                        fontWeight: 400,
                        letterSpacing: 0,
                        textTransform: 'none',
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 12
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

                {/* Party size */}
                <div>
                  <label style={labelStyle}>Số người</label>
                  <div style={{ display: 'flex' }}>
                    {[1, 2, 3, 4, 5].map((n, i) => (
                      <button
                        key={n}
                        type='button'
                        onClick={() => setPartySize(n)}
                        style={{
                          flex: 1,
                          padding: '12px 4px',
                          border: `1px solid`,
                          borderColor: partySize === n ? gold : `${gold}20`,
                          borderRight: i < 4 ? 'none' : `1px solid`,
                          borderRightColor: partySize === n ? gold : `${gold}20`,
                          borderRadius: i === 0 ? '12px 0 0 12px' : i === 4 ? '0 12px 12px 0' : '0',
                          background: partySize === n ? `linear-gradient(135deg, ${goldDark}, ${gold})` : darkBg,
                          color: partySize === n ? darkBg : '#666',
                          fontWeight: 800,
                          fontSize: 15,
                          cursor: 'pointer',
                          transition: 'all .2s',
                          fontFamily: "'Cinzel', serif",
                          boxShadow: partySize === n ? `0 4px 16px ${gold}25` : 'none'
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: '#555', marginTop: 5, fontStyle: 'italic' }}>người tham dự</p>
                </div>

                {/* Wishes */}
                <div>
                  <label style={labelStyle}>
                    Lời chúc{' '}
                    <span
                      style={{
                        color: '#555',
                        fontWeight: 400,
                        letterSpacing: 0,
                        textTransform: 'none',
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 12
                      }}
                    >
                      (tùy chọn)
                    </span>
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
                  className='btn-lg-submit'
                  disabled={loading || isAttending === null}
                  style={{
                    width: '100%',
                    padding: 16,
                    background:
                      isAttending === null || loading
                        ? `${gold}15`
                        : `linear-gradient(135deg, ${goldDark}, ${gold}, ${goldLight})`,
                    color: isAttending === null || loading ? '#555' : darkBg,
                    border: 'none',
                    borderRadius: 14,
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: loading || isAttending === null ? 'not-allowed' : 'pointer',
                    letterSpacing: '0.1em',
                    transition: 'all .3s',
                    boxShadow: isAttending !== null && !loading ? `0 8px 30px ${gold}30` : 'none',
                    fontFamily: "'Cinzel', serif",
                    textTransform: 'uppercase'
                  }}
                >
                  {loading ? '⏳ ĐANG GỬI...' : '✦ GỬI XÁC NHẬN'}
                </button>

                {submitError && (
                  <div
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(185,28,28,.08)',
                      border: '1px solid rgba(185,28,28,.2)',
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
            /* ══ Success — Crown Drop ══ */
            <div className='lg-fade lg-card' style={{ padding: '52px 28px', textAlign: 'center' }}>
              <div className='lg-crown' style={{ fontSize: '4rem', marginBottom: 22 }}>
                {isAttending ? '🎊' : '👑'}
              </div>
              <h3
                className='lg-gold-text'
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  marginBottom: 12,
                  lineHeight: 1.3,
                  letterSpacing: '0.05em'
                }}
              >
                {isAttending ? 'HẸN GẶP TẠI ĐÁM CƯỚI' : 'CẢM ƠN QUÝ KHÁCH'}
              </h3>
              <p
                style={{
                  color: '#888',
                  fontSize: 15,
                  lineHeight: 1.75,
                  maxWidth: 300,
                  margin: '0 auto',
                  fontStyle: 'italic'
                }}
              >
                {isAttending
                  ? `Chúng tôi rất vinh hạnh được đón tiếp ${formattedName}. Hẹn gặp trong ngày trọng đại! 🥂`
                  : 'Rất tiếc khi quý khách không thể tham dự. Mong có dịp gặp nhau trong tương lai! 💕'}
              </p>
              {wish && (
                <div
                  style={{
                    marginTop: 28,
                    padding: '16px 20px',
                    background: `${gold}06`,
                    borderRadius: 14,
                    borderLeft: `2px solid ${gold}`,
                    textAlign: 'left'
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: 9,
                      fontWeight: 700,
                      color: gold,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      marginBottom: 8
                    }}
                  >
                    YOUR WISHES
                  </p>
                  <p style={{ color: '#aaa', fontStyle: 'italic', fontSize: 14, lineHeight: 1.7 }}>
                    &ldquo;{wish}&rdquo;
                  </p>
                </div>
              )}

              {/* Diamond accent footer */}
              <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                <div className='lg-marble' style={{ width: 40 }} />
                <span className='lg-diamond' style={{ width: 6, height: 6 }} />
                <div className='lg-marble' style={{ width: 40 }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
