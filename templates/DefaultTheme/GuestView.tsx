import { createClient } from '@supabase/supabase-js'
import Head from 'next/head'
import { useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function DefaultGuestView({ wedding, guestName = '' }: TemplateProps) {
  const [wish, setWish] = useState('')
  const [phone, setPhone] = useState('')
  const [isAttending, setIsAttending] = useState<boolean | null>(null)
  const [partySize, setPartySize] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // 404
  if (!wedding) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fdf2f8',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>💔</div>
          <h1 style={{ color: '#9f1239', marginBottom: '8px' }}>Không tìm thấy thiệp cưới</h1>
          <p style={{ color: '#6b7280' }}>Link mời có thể đã hết hạn hoặc không hợp lệ.</p>
        </div>
      </div>
    )
  }

  const { content, template } = wedding
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }
  const primary = mergedContent.primary_color || '#e11d48'
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
    border: '1.5px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    background: '#fafafa',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    color: '#111827'
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
    fontSize: '13px',
    color: '#374151',
    letterSpacing: '0.04em'
  }

  return (
    <>
      <Head>
        <title>Thiệp mời — {formattedName}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link
          href='https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap'
          rel='stylesheet'
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #fdf2f8; -webkit-font-smoothing: antialiased; }
          input:focus, textarea:focus, select:focus {
            border-color: ${primary} !important;
            background: #fff !important;
            box-shadow: 0 0 0 3px ${primary}20 !important;
            outline: none;
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes floatY {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(-10px); }
          }
          @keyframes shimmer {
            0%   { background-position: -200% center; }
            100% { background-position:  200% center; }
          }
          .anim-fade { animation: fadeUp 0.55s cubic-bezier(.22,.68,0,1.2) both; }
          .anim-fade:nth-child(2) { animation-delay: .08s; }
          .anim-fade:nth-child(3) { animation-delay: .16s; }
          .anim-fade:nth-child(4) { animation-delay: .24s; }
          .float { animation: floatY 3.2s ease-in-out infinite; display: inline-block; }
          .btn-attend:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(34,197,94,.25); }
          .btn-decline:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(239,68,68,.25); }
          .btn-submit:not(:disabled):hover { transform: translateY(-2px); }
        `}</style>
      </Head>

      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(155deg,#fdf2f8 0%,#fce7f3 45%,#fdf4ff 100%)',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* ── Hero ── */}
        <div style={{ position: 'relative', overflow: 'hidden', padding: '64px 20px 72px', textAlign: 'center' }}>
          {/* background blobs */}
          <div
            style={{
              position: 'absolute',
              top: -80,
              right: -80,
              width: 260,
              height: 260,
              borderRadius: '50%',
              background: `${primary}12`,
              pointerEvents: 'none'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -50,
              left: -50,
              width: 180,
              height: 180,
              borderRadius: '50%',
              background: `${primary}0d`,
              pointerEvents: 'none'
            }}
          />

          <div
            className='float'
            style={{ fontSize: '3.2rem', marginBottom: '22px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,.12))' }}
          >
            💍
          </div>

          <p
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#9ca3af',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '14px'
            }}
          >
            TRÂN TRỌNG KÍNH MỜI
          </p>

          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 7vw, 3.4rem)',
              fontWeight: '700',
              color: primary,
              lineHeight: 1.15,
              marginBottom: '14px',
              textShadow: `0 2px 30px ${primary}35`
            }}
          >
            {formattedName}
          </h1>

          <p style={{ fontSize: '15px', color: '#9ca3af', fontWeight: '300', marginBottom: '10px' }}>
            tới tham dự lễ thành hôn của
          </p>

          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
              fontWeight: '700',
              color: '#1f2937',
              letterSpacing: '0.01em'
            }}
          >
            {mergedContent.groom_name} &amp; {mergedContent.bride_name}
          </h2>

          {/* divider */}
          <div
            style={{
              margin: '24px auto 0',
              width: '60px',
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${primary}, transparent)`
            }}
          />
        </div>

        {/* ── Cards ── */}
        <div
          style={{
            maxWidth: '540px',
            margin: '0 auto',
            padding: '0 16px 70px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Cover image */}
          {mergedContent.cover_image && (
            <div
              className='anim-fade'
              style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,.13)' }}
            >
              <img
                src={mergedContent.cover_image}
                alt='Wedding Cover'
                style={{ width: '100%', display: 'block', maxHeight: '300px', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Event info */}
          <div
            className='anim-fade'
            style={{
              background: 'rgba(255,255,255,.82)',
              backdropFilter: 'blur(16px)',
              borderRadius: '20px',
              padding: '26px 24px',
              border: '1px solid rgba(255,255,255,.95)',
              boxShadow: '0 4px 24px rgba(0,0,0,.05)'
            }}
          >
            <p
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: primary,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                textAlign: 'center',
                marginBottom: '18px'
              }}
            >
              ✨ Thông tin sự kiện
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                    gap: '12px',
                    padding: '12px 14px',
                    background: `${primary}08`,
                    borderRadius: '12px'
                  }}
                >
                  <span style={{ fontSize: '20px', flexShrink: 0, lineHeight: 1 }}>{icon}</span>
                  <div>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        color: primary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        display: 'block',
                        marginBottom: '2px'
                      }}
                    >
                      {label}
                    </span>
                    <span style={{ fontSize: '15px', color: '#111827', fontWeight: '500', lineHeight: 1.4 }}>
                      {value || '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RSVP Form / Success */}
          {!submitted ? (
            <div
              className='anim-fade'
              style={{
                background: 'rgba(255,255,255,.92)',
                backdropFilter: 'blur(16px)',
                borderRadius: '20px',
                padding: '28px 24px',
                border: '1px solid rgba(255,255,255,.95)',
                boxShadow: '0 4px 24px rgba(0,0,0,.05)'
              }}
            >
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: primary,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  marginBottom: '4px'
                }}
              >
                💌 Xác nhận tham dự
              </p>
              <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', marginBottom: '24px' }}>
                Vui lòng điền thông tin để chúng tôi chuẩn bị tốt hơn
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Tham dự? */}
                <div>
                  <label style={labelStyle}>Bạn có tham dự không? *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type='button'
                      className='btn-attend'
                      onClick={() => setIsAttending(true)}
                      style={{
                        padding: '13px 8px',
                        borderRadius: '12px',
                        border: isAttending === true ? '2px solid #22c55e' : '1.5px solid #e5e7eb',
                        background: isAttending === true ? '#f0fdf4' : '#fafafa',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: isAttending === true ? '#15803d' : '#6b7280',
                        transition: 'all .2s',
                        fontFamily: 'inherit'
                      }}
                    >
                      ✅ Có, tôi sẽ đến
                    </button>
                    <button
                      type='button'
                      className='btn-decline'
                      onClick={() => setIsAttending(false)}
                      style={{
                        padding: '13px 8px',
                        borderRadius: '12px',
                        border: isAttending === false ? '2px solid #ef4444' : '1.5px solid #e5e7eb',
                        background: isAttending === false ? '#fef2f2' : '#fafafa',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: isAttending === false ? '#dc2626' : '#6b7280',
                        transition: 'all .2s',
                        fontFamily: 'inherit'
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
                        color: '#9ca3af',
                        fontSize: '12px',
                        fontWeight: '400',
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
                          border: '1.5px solid',
                          borderColor: partySize === n ? primary : '#e5e7eb',
                          borderRight: i < 4 ? 'none' : '1.5px solid',
                          borderRightColor: partySize === n ? primary : '#e5e7eb',
                          borderRadius: i === 0 ? '10px 0 0 10px' : i === 4 ? '0 10px 10px 0' : '0',
                          background: partySize === n ? primary : '#fafafa',
                          color: partySize === n ? '#fff' : '#6b7280',
                          fontWeight: '700',
                          fontSize: '15px',
                          cursor: 'pointer',
                          transition: 'all .18s',
                          fontFamily: 'inherit'
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '5px' }}>người tham dự</p>
                </div>

                {/* Lời chúc */}
                <div>
                  <label style={labelStyle}>
                    Lời chúc&nbsp;
                    <span
                      style={{
                        color: '#9ca3af',
                        fontSize: '12px',
                        fontWeight: '400',
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
                  className='btn-submit'
                  disabled={loading || isAttending === null}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background:
                      isAttending === null || loading
                        ? '#e5e7eb'
                        : `linear-gradient(135deg, ${primary} 0%, ${primary}cc 100%)`,
                    color: isAttending === null || loading ? '#9ca3af' : '#fff',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: loading || isAttending === null ? 'not-allowed' : 'pointer',
                    letterSpacing: '0.03em',
                    transition: 'all .25s',
                    boxShadow: isAttending !== null && !loading ? `0 6px 22px ${primary}45` : 'none',
                    fontFamily: 'inherit'
                  }}
                >
                  {loading ? '⏳ Đang gửi...' : '💌 Gửi xác nhận'}
                </button>

                {/* Error */}
                {submitError && (
                  <div
                    style={{
                      padding: '12px 16px',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '10px',
                      color: '#dc2626',
                      fontSize: '14px',
                      textAlign: 'center',
                      fontWeight: '500'
                    }}
                  >
                    ❌ {submitError}
                  </div>
                )}
              </form>
            </div>
          ) : (
            /* ── Success Screen ── */
            <div
              className='anim-fade'
              style={{
                background: 'rgba(255,255,255,.95)',
                borderRadius: '24px',
                padding: '52px 28px',
                textAlign: 'center',
                boxShadow: '0 10px 48px rgba(0,0,0,.08)',
                border: '1px solid rgba(255,255,255,.95)'
              }}
            >
              <div className='float' style={{ fontSize: '4rem', marginBottom: '22px' }}>
                {isAttending ? '🎊' : '💝'}
              </div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.55rem',
                  fontWeight: '700',
                  color: isAttending ? '#15803d' : primary,
                  marginBottom: '12px',
                  lineHeight: 1.3
                }}
              >
                {isAttending ? 'Hẹn gặp bạn tại đám cưới!' : 'Cảm ơn bạn đã phản hồi!'}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: 1.75, maxWidth: '300px', margin: '0 auto' }}>
                {isAttending
                  ? `Chúng tôi rất vui được đón tiếp ${formattedName}. Hẹn gặp trong ngày vui! 🥂`
                  : 'Rất tiếc khi bạn không thể tham dự. Mong có dịp gặp nhau trong tương lai! 💕'}
              </p>
              {wish && (
                <div
                  style={{
                    marginTop: '28px',
                    padding: '16px 20px',
                    background: `${primary}08`,
                    borderRadius: '14px',
                    borderLeft: `3px solid ${primary}`,
                    textAlign: 'left'
                  }}
                >
                  <p
                    style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      color: primary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: '8px'
                    }}
                  >
                    Lời chúc của bạn
                  </p>
                  <p style={{ color: '#374151', fontStyle: 'italic', fontSize: '14px', lineHeight: 1.7 }}>
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
