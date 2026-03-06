import { createClient } from '@supabase/supabase-js'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TemplateProps } from '../TemplateRegistry'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function MinimalistGuestView({ wedding, guestName = '', rsvpId }: TemplateProps) {
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

  const ink = '#0d0d0d'
  const inkMid = '#444444'
  const inkLight = '#888888'
  const accent = '#b8927a'

  if (!wedding) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.4em', color: inkLight, textTransform: 'uppercase', marginBottom: 16 }}>NOT FOUND</p>
          <h1 style={{ color: ink, fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300 }}>Không tìm thấy thiệp mời</h1>
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
    padding: '14px 0',
    border: 'none',
    borderBottom: `1px solid ${ink}22`,
    borderRadius: 0,
    fontSize: 17,
    outline: 'none',
    background: 'transparent',
    boxSizing: 'border-box',
    fontFamily: "'Cormorant Garamond', serif",
    color: ink,
    transition: 'border-color 0.3s'
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 8,
    fontWeight: 400,
    fontSize: 10,
    color: inkLight,
    letterSpacing: '0.4em',
    textTransform: 'uppercase',
    fontFamily: "'Cormorant Garamond', serif"
  }

  return (
    <>
      <Head>
        <title>Thiệp mời — {guestName}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap'
          rel='stylesheet'
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #ffffff; -webkit-font-smoothing: antialiased; }

          input:focus, textarea:focus {
            border-bottom-color: ${ink} !important;
          }

          @keyframes minFadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .mi-fade { animation: minFadeUp 0.8s cubic-bezier(.16,1,.3,1) both; }
          .mi-fade:nth-child(2) { animation-delay: .1s; }
          .mi-fade:nth-child(3) { animation-delay: .2s; }
          .mi-fade:nth-child(4) { animation-delay: .3s; }

          .mi-btn-att {
            transition: background 0.2s, color 0.2s, border-color 0.2s;
          }
          .mi-btn-sub:not(:disabled):hover {
            background: ${ink} !important;
            color: #fff !important;
          }
        `}</style>
      </Head>

      <div style={{
        minHeight: '100vh',
        background: '#ffffff',
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        color: ink
      }}>

        {/* ══ Hero ══ */}
        <div style={{ position: 'relative', overflow: 'hidden', height: 380, borderBottom: `1px solid ${ink}0d` }}>
          {mergedContent.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mergedContent.cover_image} alt='' style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, filter: 'brightness(0.7) saturate(0.85)' }} />
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: ink, zIndex: 0 }} />
          )}
          {/* Dark editorial overlay - heavier at bottom */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.68) 100%)', zIndex: 1 }} />
          {/* Corner marks */}
          <div style={{ position: 'absolute', top: 20, left: 20, width: 24, height: 24, borderTop: '1px solid rgba(255,255,255,0.3)', borderLeft: '1px solid rgba(255,255,255,0.3)', zIndex: 2 }} />
          <div style={{ position: 'absolute', top: 20, right: 20, width: 24, height: 24, borderTop: '1px solid rgba(255,255,255,0.3)', borderRight: '1px solid rgba(255,255,255,0.3)', zIndex: 2 }} />
          {/* Text at bottom */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 32px 36px', zIndex: 2 }}>
            <p style={{ fontSize: 9, fontWeight: 400, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.5em', textTransform: 'uppercase', marginBottom: 16 }}>
              WEDDING INVITATION
            </p>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.4rem, 8vw, 3.8rem)',
              fontWeight: 300,
              color: '#fff',
              lineHeight: 1.05,
              fontStyle: 'italic',
              marginBottom: 10,
              textShadow: '0 2px 20px rgba(0,0,0,0.4)'
            }}>
              {guestName}
            </h1>
            <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.06em', marginBottom: 6 }}>
              tới tham dự lễ thành hôn của
            </p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1rem, 3vw, 1.25rem)',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.88)',
              letterSpacing: '0.06em'
            }}>
              {mergedContent.groom_name} &amp; {mergedContent.bride_name}
            </p>
            <div style={{ width: 32, height: 2, background: accent, marginTop: 18 }} />
          </div>
        </div>

        {/* ══ Cards ══ */}
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 32px 80px' }}>



          {/* Event info */}
          <div className='mi-fade' style={{ padding: '40px 0', borderBottom: `1px solid ${ink}0d` }}>
            <p style={{ fontSize: 9, letterSpacing: '0.45em', color: accent, textTransform: 'uppercase', marginBottom: 28 }}>
              EVENT DETAILS
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {[
                { label: 'DATE', value: mergedContent.event_date },
                { label: 'TIME', value: mergedContent.wedding_time },
                { label: 'VENUE', value: mergedContent.address }
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', gap: 24, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 9, letterSpacing: '0.35em', color: inkLight, textTransform: 'uppercase', flexShrink: 0, minWidth: 48 }}>
                    {label}
                  </span>
                  <span style={{ fontSize: 17, fontWeight: 400, color: ink, lineHeight: 1.5 }}>
                    {value || '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RSVP Form */}
          {!submitted ? (
            <div className='mi-fade' style={{ paddingTop: 40 }}>
              <p style={{ fontSize: 9, letterSpacing: '0.45em', color: accent, textTransform: 'uppercase', marginBottom: 8 }}>
                RSVP
              </p>
              <p style={{ fontSize: 15, fontWeight: 300, color: inkMid, marginBottom: 36, fontStyle: 'italic', lineHeight: 1.6 }}>
                Vui lòng xác nhận sự tham dự để chúng tôi chuẩn bị đón tiếp
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {/* Tham dự? */}
                <div>
                  <label style={labelStyle}>Tham dự *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <button
                      type='button'
                      className='mi-btn-att'
                      onClick={() => setIsAttending(true)}
                      style={{
                        padding: '14px',
                        border: `1px solid ${isAttending === true ? ink : `${ink}20`}`,
                        background: isAttending === true ? ink : 'transparent',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 400,
                        letterSpacing: '0.1em',
                        color: isAttending === true ? '#fff' : inkMid,
                        fontFamily: "'Cormorant Garamond', serif",
                        textTransform: 'uppercase'
                      }}
                    >
                      Tôi sẽ đến
                    </button>
                    <button
                      type='button'
                      className='mi-btn-att'
                      onClick={() => setIsAttending(false)}
                      style={{
                        padding: '14px',
                        border: `1px solid ${isAttending === false ? `#c53030` : `${ink}20`}`,
                        background: isAttending === false ? '#fff5f5' : 'transparent',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 400,
                        letterSpacing: '0.1em',
                        color: isAttending === false ? '#c53030' : inkMid,
                        fontFamily: "'Cormorant Garamond', serif",
                        textTransform: 'uppercase'
                      }}
                    >
                      Xin lỗi, bận
                    </button>
                  </div>
                </div>

                {/* Điện thoại */}
                <div>
                  <label style={labelStyle}>
                    Điện thoại{' '}
                    <span style={{ letterSpacing: 0, textTransform: 'none', color: inkLight, opacity: 0.7 }}>(tùy chọn)</span>
                  </label>
                  <input type='tel' value={phone} onChange={e => setPhone(e.target.value)} placeholder='0901 234 567' style={inputStyle} />
                </div>

                {/* Số người */}
                <div>
                  <label style={labelStyle}>Số người</label>
                  <div style={{ display: 'flex', gap: 0 }}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type='button'
                        onClick={() => setPartySize(n)}
                        style={{
                          flex: 1,
                          padding: '12px 4px',
                          border: `1px solid ${partySize === n ? ink : `${ink}15`}`,
                          borderRight: 'none',
                          background: partySize === n ? ink : 'transparent',
                          color: partySize === n ? '#fff' : inkMid,
                          fontWeight: 400,
                          fontSize: 17,
                          cursor: 'pointer',
                          transition: 'all .18s',
                          fontFamily: "'Cormorant Garamond', serif"
                        }}
                      >
                        {n}
                      </button>
                    ))}
                    <div style={{ width: 1, background: `${ink}15`, flexShrink: 0 }} />
                  </div>
                </div>

                {/* Lời chúc */}
                <div>
                  <label style={labelStyle}>
                    Lời chúc{' '}
                    <span style={{ letterSpacing: 0, textTransform: 'none', color: inkLight, opacity: 0.7 }}>(tùy chọn)</span>
                  </label>
                  <textarea
                    value={wish}
                    onChange={e => setWish(e.target.value)}
                    placeholder='Chúc hai bạn trăm năm hạnh phúc...'
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7, borderBottom: `1px solid ${ink}22` }}
                  />
                </div>

                {/* Submit */}
                <button
                  type='submit'
                  className='mi-btn-sub'
                  disabled={loading || isAttending === null}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: isAttending === null || loading ? 'transparent' : 'transparent',
                    color: isAttending === null || loading ? inkLight : ink,
                    border: `1px solid ${isAttending === null || loading ? `${ink}20` : ink}`,
                    fontSize: 12,
                    fontWeight: 400,
                    cursor: loading || isAttending === null ? 'not-allowed' : 'pointer',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    fontFamily: "'Cormorant Garamond', serif",
                    transition: 'all .3s'
                  }}
                >
                  {loading ? 'ĐANG GỬI...' : 'GỬI XÁC NHẬN'}
                </button>

                {submitError && (
                  <p style={{ color: '#c53030', fontSize: 13, textAlign: 'center', fontStyle: 'italic' }}>
                    {submitError}
                  </p>
                )}
              </form>
            </div>
          ) : (
            /* ══ Success ══ */
            <div className='mi-fade' style={{ paddingTop: 60, textAlign: 'center' }}>
              <div style={{ width: 40, height: 2, background: accent, margin: '0 auto 40px' }} />
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
                fontWeight: 300,
                color: ink,
                fontStyle: 'italic',
                marginBottom: 16,
                lineHeight: 1.3
              }}>
                {isAttending ? 'Hẹn gặp bạn tại đám cưới' : 'Cảm ơn bạn đã phản hồi'}
              </h3>
              <p style={{ fontSize: 15, fontWeight: 300, color: inkMid, lineHeight: 1.8, maxWidth: 320, margin: '0 auto', fontStyle: 'italic' }}>
                {isAttending
                  ? `Chúng tôi rất hân hạnh được đón tiếp ${guestName}`
                  : 'Rất tiếc khi bạn không thể tham dự. Mong có dịp gặp nhau trong tương lai'}
              </p>
              {wish && (
                <div style={{ marginTop: 40, paddingTop: 32, borderTop: `1px solid ${ink}0d`, textAlign: 'left' }}>
                  <p style={{ fontSize: 9, letterSpacing: '0.4em', color: accent, textTransform: 'uppercase', marginBottom: 16 }}>
                    YOUR WISHES
                  </p>
                  <p style={{ fontSize: 17, fontWeight: 300, color: inkMid, fontStyle: 'italic', lineHeight: 1.75 }}>
                    &ldquo;{wish}&rdquo;
                  </p>
                </div>
              )}
              <div style={{ width: 40, height: 2, background: accent, margin: '40px auto 0' }} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
