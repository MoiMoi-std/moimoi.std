import { createClient } from '@supabase/supabase-js'
import Head from 'next/head'
import { useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function VintageGuestView({ wedding, guestName = '' }: TemplateProps) {
  const [wish, setWish] = useState('')
  const [phone, setPhone] = useState('')
  const [isAttending, setIsAttending] = useState<boolean | null>(null)
  const [partySize, setPartySize] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const primaryColor = '#8B6914'
  const accentColor = '#D4A853'
  const creamBg = '#FFF8E7'
  const parchment = '#F5E6C8'

  // 404
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
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>📜</div>
          <h1 style={{ color: primaryColor, marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>
            Không tìm thấy thiệp cưới
          </h1>
          <p style={{ color: '#8B7355' }}>Link mời có thể đã hết hạn hoặc không hợp lệ.</p>
        </div>
      </div>
    )
  }

  const { content, template } = wedding
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }
  const primary = mergedContent.primary_color || primaryColor
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
    border: `1.5px solid ${accentColor}50`,
    borderRadius: 10,
    fontSize: 15,
    outline: 'none',
    background: `${creamBg}`,
    boxSizing: 'border-box',
    fontFamily: "'Lora', Georgia, serif",
    color: '#4A3728',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 6,
    fontWeight: 600,
    fontSize: 13,
    color: '#5C4A35',
    letterSpacing: '0.04em',
    fontFamily: "'Playfair Display', serif"
  }

  return (
    <>
      <Head>
        <title>Thiệp mời — {formattedName}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Great+Vibes&display=swap'
          rel='stylesheet'
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${creamBg}; -webkit-font-smoothing: antialiased; }

          input:focus, textarea:focus, select:focus {
            border-color: ${primary} !important;
            background: #fff !important;
            box-shadow: 0 0 0 3px ${accentColor}25 !important;
            outline: none;
          }

          @keyframes vintageFadeUp {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes gentlePulse {
            0%, 100% { transform: scale(1); }
            50%      { transform: scale(1.06); }
          }
          @keyframes floatSoft {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-8px); }
          }
          @keyframes shimmerGold {
            0%   { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes waxSeal {
            0%   { transform: scale(0) rotate(-180deg); opacity: 0; }
            60%  { transform: scale(1.15) rotate(10deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }

          .vg-fade { animation: vintageFadeUp 0.7s cubic-bezier(.22,.68,0,1.15) both; }
          .vg-fade:nth-child(2) { animation-delay: .1s; }
          .vg-fade:nth-child(3) { animation-delay: .2s; }
          .vg-fade:nth-child(4) { animation-delay: .3s; }
          .vg-pulse { animation: gentlePulse 3s ease-in-out infinite; }
          .vg-float { animation: floatSoft 3.5s ease-in-out infinite; display: inline-block; }
          .vg-seal  { animation: waxSeal 0.8s cubic-bezier(.175,.885,.32,1.275) both; }

          .vg-card {
            background: linear-gradient(145deg, #FFFDF7, ${parchment}70);
            border: 1.5px solid ${accentColor}50;
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(139,105,20,.06), inset 0 1px 0 rgba(255,255,255,.6);
          }

          .gold-text {
            background: linear-gradient(90deg, ${primary}, ${accentColor}, ${primary});
            background-size: 200% 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmerGold 4s linear infinite;
          }

          .btn-vintage-attend:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 16px rgba(34,139,20,.15);
          }
          .btn-vintage-decline:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 16px rgba(180,80,40,.15);
          }
          .btn-vintage-submit:not(:disabled):hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 28px ${accentColor}50;
          }
        `}</style>
      </Head>

      <div
        style={{
          minHeight: '100vh',
          background: `linear-gradient(170deg, ${creamBg} 0%, #FDF5E6 40%, ${parchment}40 100%)`,
          fontFamily: "'Lora', Georgia, serif",
          color: '#4A3728'
        }}
      >
        {/* ═══ Hero ═══ */}
        <div style={{ position: 'relative', overflow: 'hidden', padding: '64px 20px 56px', textAlign: 'center' }}>
          {/* Corner ornaments */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => {
            const isTop = pos.includes('top')
            const isLeft = pos.includes('left')
            return (
              <div
                key={pos}
                style={{
                  position: 'absolute',
                  [isTop ? 'top' : 'bottom']: 16,
                  [isLeft ? 'left' : 'right']: 16,
                  width: 40,
                  height: 40,
                  borderTop: isTop ? `2px solid ${accentColor}50` : 'none',
                  borderBottom: !isTop ? `2px solid ${accentColor}50` : 'none',
                  borderLeft: isLeft ? `2px solid ${accentColor}50` : 'none',
                  borderRight: !isLeft ? `2px solid ${accentColor}50` : 'none'
                }}
              />
            )
          })}

          {/* Decorative blobs */}
          <div
            style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              borderRadius: '50%',
              border: `1px solid ${accentColor}15`,
              pointerEvents: 'none'
            }}
          />

          <div
            className='vg-float'
            style={{
              fontSize: '2.8rem',
              marginBottom: 18,
              filter: 'drop-shadow(0 4px 12px rgba(139,105,20,.15))'
            }}
          >
            📜
          </div>

          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: '#8B7355',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              marginBottom: 16,
              fontFamily: "'Playfair Display', serif"
            }}
          >
            TRÂN TRỌNG KÍNH MỜI
          </p>

          <h1
            className='gold-text'
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: 'clamp(2.2rem, 8vw, 3.8rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              marginBottom: 14
            }}
          >
            {formattedName}
          </h1>

          <p style={{ fontSize: 15, color: '#8B7355', fontStyle: 'italic', marginBottom: 10 }}>
            tới tham dự lễ thành hôn của
          </p>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.2rem, 4vw, 1.65rem)',
              fontWeight: 700,
              color: '#4A3728',
              letterSpacing: '0.02em'
            }}
          >
            {mergedContent.groom_name} &amp; {mergedContent.bride_name}
          </h2>

          {/* Ornate divider */}
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
                height: 1,
                width: 50,
                background: `linear-gradient(to right, transparent, ${accentColor})`
              }}
            />
            <span style={{ color: accentColor, fontSize: 14, opacity: 0.6 }}>❦</span>
            <div
              style={{
                height: 1,
                width: 50,
                background: `linear-gradient(to left, transparent, ${accentColor})`
              }}
            />
          </div>
        </div>

        {/* ═══ Cards ═══ */}
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
              className='vg-fade'
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(139,105,20,.12)',
                border: `1.5px solid ${accentColor}40`
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
                  filter: 'sepia(12%) saturate(90%)'
                }}
              />
            </div>
          )}

          {/* Event info */}
          <div className='vg-fade vg-card' style={{ padding: '26px 24px' }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: primary,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                textAlign: 'center',
                marginBottom: 18,
                fontFamily: "'Playfair Display', serif"
              }}
            >
              ✦ Thông tin sự kiện
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
                    background: `${accentColor}0a`,
                    borderRadius: 10,
                    border: `1px solid ${accentColor}18`
                  }}
                >
                  <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1 }}>{icon}</span>
                  <div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: primary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        display: 'block',
                        marginBottom: 2,
                        fontFamily: "'Playfair Display', serif"
                      }}
                    >
                      {label}
                    </span>
                    <span style={{ fontSize: 15, color: '#4A3728', fontWeight: 500, lineHeight: 1.4 }}>
                      {value || '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RSVP Form / Success */}
          {!submitted ? (
            <div className='vg-fade vg-card' style={{ padding: '28px 24px' }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: primary,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  marginBottom: 4,
                  fontFamily: "'Playfair Display', serif"
                }}
              >
                ✉ Xác nhận tham dự
              </p>
              <p style={{ textAlign: 'center', color: '#8B7355', fontSize: 13, marginBottom: 24, fontStyle: 'italic' }}>
                Vui lòng điền thông tin để chúng tôi chuẩn bị tốt hơn
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {/* Tham dự? */}
                <div>
                  <label style={labelStyle}>Bạn có tham dự không? *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button
                      type='button'
                      className='btn-vintage-attend'
                      onClick={() => setIsAttending(true)}
                      style={{
                        padding: '13px 8px',
                        borderRadius: 10,
                        border: isAttending === true ? '2px solid #6B8E23' : `1.5px solid ${accentColor}50`,
                        background: isAttending === true ? '#F5F9E8' : `${creamBg}`,
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 600,
                        color: isAttending === true ? '#4A6B0A' : '#8B7355',
                        transition: 'all .2s',
                        fontFamily: "'Lora', serif"
                      }}
                    >
                      ✅ Có, tôi sẽ đến
                    </button>
                    <button
                      type='button'
                      className='btn-vintage-decline'
                      onClick={() => setIsAttending(false)}
                      style={{
                        padding: '13px 8px',
                        borderRadius: 10,
                        border: isAttending === false ? '2px solid #B45028' : `1.5px solid ${accentColor}50`,
                        background: isAttending === false ? '#FDF0EC' : `${creamBg}`,
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 600,
                        color: isAttending === false ? '#8B3A1C' : '#8B7355',
                        transition: 'all .2s',
                        fontFamily: "'Lora', serif"
                      }}
                    >
                      ❌ Xin lỗi, tôi bận
                    </button>
                  </div>
                </div>

                {/* Số điện thoại */}
                <div>
                  <label style={labelStyle}>
                    Số điện thoại&nbsp;
                    <span
                      style={{
                        color: '#B8A88A',
                        fontSize: 12,
                        fontWeight: 400,
                        textTransform: 'none',
                        letterSpacing: 0,
                        fontFamily: "'Lora', serif"
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

                {/* Số người tham dự */}
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
                          borderColor: partySize === n ? primary : `${accentColor}50`,
                          borderRight: i < 4 ? 'none' : '1.5px solid',
                          borderRightColor: partySize === n ? primary : `${accentColor}50`,
                          borderRadius: i === 0 ? '10px 0 0 10px' : i === 4 ? '0 10px 10px 0' : '0',
                          background: partySize === n ? `linear-gradient(135deg, ${primary}, ${accentColor})` : creamBg,
                          color: partySize === n ? '#fff' : '#8B7355',
                          fontWeight: 700,
                          fontSize: 15,
                          cursor: 'pointer',
                          transition: 'all .18s',
                          fontFamily: "'Lora', serif"
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: '#B8A88A', marginTop: 5, fontStyle: 'italic' }}>người tham dự</p>
                </div>

                {/* Lời chúc */}
                <div>
                  <label style={labelStyle}>
                    Lời chúc&nbsp;
                    <span
                      style={{
                        color: '#B8A88A',
                        fontSize: 12,
                        fontWeight: 400,
                        textTransform: 'none',
                        letterSpacing: 0,
                        fontFamily: "'Lora', serif"
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
                  className='btn-vintage-submit'
                  disabled={loading || isAttending === null}
                  style={{
                    width: '100%',
                    padding: 16,
                    background:
                      isAttending === null || loading
                        ? `${accentColor}40`
                        : `linear-gradient(135deg, ${primary} 0%, ${accentColor} 100%)`,
                    color: isAttending === null || loading ? '#B8A88A' : '#fff',
                    border: 'none',
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: loading || isAttending === null ? 'not-allowed' : 'pointer',
                    letterSpacing: '0.04em',
                    transition: 'all .25s',
                    boxShadow: isAttending !== null && !loading ? `0 6px 22px ${accentColor}40` : 'none',
                    fontFamily: "'Playfair Display', serif"
                  }}
                >
                  {loading ? '⏳ Đang gửi...' : '✉ Gửi xác nhận'}
                </button>

                {/* Error */}
                {submitError && (
                  <div
                    style={{
                      padding: '12px 16px',
                      background: '#FDF0EC',
                      border: '1px solid #E8C4B4',
                      borderRadius: 10,
                      color: '#8B3A1C',
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
            /* ═══ Success Screen — Wax Seal ═══ */
            <div
              className='vg-fade vg-card'
              style={{
                padding: '52px 28px',
                textAlign: 'center'
              }}
            >
              <div className='vg-seal' style={{ fontSize: '4rem', marginBottom: 22 }}>
                {isAttending ? '🎊' : '💌'}
              </div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: isAttending ? '#4A6B0A' : primary,
                  marginBottom: 12,
                  lineHeight: 1.3
                }}
              >
                {isAttending ? 'Hẹn gặp bạn tại đám cưới!' : 'Cảm ơn bạn đã phản hồi!'}
              </h3>
              <p
                style={{
                  color: '#8B7355',
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
                    background: `${accentColor}0c`,
                    borderRadius: 12,
                    borderLeft: `3px solid ${accentColor}`,
                    textAlign: 'left'
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: primary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: 8,
                      fontFamily: "'Playfair Display', serif"
                    }}
                  >
                    Lời chúc của bạn
                  </p>
                  <p style={{ color: '#5C4A35', fontStyle: 'italic', fontSize: 14, lineHeight: 1.7 }}>
                    &ldquo;{wish}&rdquo;
                  </p>
                </div>
              )}

              {/* Wax seal decoration */}
              <div
                style={{
                  marginTop: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12
                }}
              >
                <div
                  style={{
                    height: 1,
                    width: 40,
                    background: `linear-gradient(to right, transparent, ${accentColor}60)`
                  }}
                />
                <span style={{ color: accentColor, fontSize: 12, opacity: 0.5 }}>❦</span>
                <div
                  style={{
                    height: 1,
                    width: 40,
                    background: `linear-gradient(to left, transparent, ${accentColor}60)`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
