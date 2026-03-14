import { useToast } from '@/components/ui/ToastProvider'
import { dataService } from '@/lib/data-service'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

interface RSVPFormProps {
  weddingId: string
  rsvpId?: number | string
  guestName?: string
  primaryColor?: string
  fontFamily?: string
  sectionFontFamily?: string
  isDark?: boolean
}

export default function RSVPForm({
  weddingId,
  rsvpId,
  guestName,
  primaryColor = '#d4507a',
  fontFamily,
  sectionFontFamily,
  isDark = false
}: RSVPFormProps) {
  const [phone, setPhone] = useState('')
  const [isAttending, setIsAttending] = useState<boolean | null>(null)
  const [partySize, setPartySize] = useState(1)
  const [wish, setWish] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const { toast } = useToast()

  const hex2rgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${alpha})`
  }

  // Pre-fill if rsvpId exists
  useEffect(() => {
    if (!rsvpId) return
    supabase
      .from('rsvps')
      .select('phone, is_attending, party_size, wishes')
      .eq('id', rsvpId)
      .single()
      .then(({ data }) => {
        if (!data) return
        if (data.phone) setPhone(data.phone)
        if (data.is_attending != null) setIsAttending(data.is_attending)
        if (data.party_size) setPartySize(data.party_size)
        if (data.wishes) setWish(data.wishes)
      })
  }, [rsvpId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (honeypot) return
    if (isAttending === null) {
      toast('Vui lòng cho biết bạn có tham dự không', 'warning')
      return
    }
    if (phone && !/^(0|\+84)\d{9,10}$/.test(phone.trim())) {
      toast('Số điện thoại chưa đúng định dạng', 'warning')
      return
    }

    setLoading(true)
    setSubmitError('')
    try {
      if (rsvpId) {
        const { error } = await supabase
          .from('rsvps')
          .update({
            phone: phone.trim() || null,
            is_attending: isAttending,
            party_size: isAttending ? partySize : 0,
            wishes: wish.trim() || null
          })
          .eq('id', rsvpId)
        if (error) throw error
      } else {
        const lastSubmitKey = `rsvp_last_submit_${weddingId}`
        const lastSubmit = typeof window !== 'undefined' ? localStorage.getItem(lastSubmitKey) : null
        if (lastSubmit && Date.now() - Number(lastSubmit) < 5 * 60 * 1000) {
          toast('Bạn vừa gửi RSVP gần đây. Vui lòng thử lại sau ít phút.', 'warning')
          setLoading(false)
          return
        }
        const result = await dataService.createRSVP({
          wedding_id: weddingId,
          guest_name: guestName || '',
          phone: phone.trim(),
          is_attending: isAttending,
          party_size: isAttending ? partySize : 0,
          wishes: wish.trim()
        })
        if (!result) throw new Error('failed')
        if (typeof window !== 'undefined') {
          localStorage.setItem(lastSubmitKey, Date.now().toString())
        }
      }
      setSubmitted(true)
    } catch {
      setSubmitError('Có lỗi xảy ra, vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  // ── Theme tokens ──────────────────────────────────────────
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : '#fff'
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : hex2rgba(primaryColor, 0.15)
  const inputBg = isDark ? 'rgba(255,255,255,0.06)' : '#f9fafb'
  const inputBorder = isDark ? 'rgba(255,255,255,0.12)' : '#e5e7eb'
  const inputText = isDark ? '#e2e8f0' : '#111827'
  const labelColor = isDark ? '#94a3b8' : '#6b7280'
  const btnDefaultBg = isDark ? 'rgba(255,255,255,0.04)' : '#fff'
  const btnDefaultBorder = isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'
  const btnDefaultText = isDark ? '#64748b' : '#9ca3af'
  const btnDeclineBorder = isDark ? 'rgba(255,255,255,0.25)' : '#6b7280'
  const btnDeclineBg = isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6'
  const btnDeclineText = isDark ? '#e2e8f0' : '#374151'
  const partySizeBtnEmpty = isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb'
  const partySizeTextEmpty = isDark ? '#64748b' : '#9ca3af'
  const successCardBg = isDark ? 'rgba(255,255,255,0.06)' : '#fff'
  const successBodyText = isDark ? '#94a3b8' : '#9ca3af'
  const wishQuoteText = isDark ? '#cbd5e1' : '#374151'
  const subtitleColor = isDark ? '#fff' : primaryColor
  const disabledBg = isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6'
  const disabledText = isDark ? '#334155' : '#9ca3af'

  // ── Shared style objects ──────────────────────────────────
  const wrapStyle: React.CSSProperties = { ...(fontFamily ? { fontFamily } : {}) }

  const titleStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.4em',
    textTransform: 'uppercase',
    color: primaryColor,
    marginBottom: 8,
    ...(sectionFontFamily ? { fontFamily: sectionFontFamily } : {})
  }

  const subtitleStyle: React.CSSProperties = {
    fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
    fontWeight: 700,
    color: subtitleColor,
    marginBottom: 12,
    ...(sectionFontFamily ? { fontFamily: sectionFontFamily } : {})
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 6,
    fontWeight: 600,
    fontSize: 13,
    color: labelColor,
    letterSpacing: '0.03em'
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    border: `1.5px solid ${inputBorder}`,
    borderRadius: 14,
    fontSize: 15,
    outline: 'none',
    background: inputBg,
    boxSizing: 'border-box',
    fontFamily: fontFamily || 'inherit',
    color: inputText,
    transition: 'border-color 0.2s, box-shadow 0.2s'
  }

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = primaryColor
    e.target.style.boxShadow = `0 0 0 3px ${hex2rgba(primaryColor, 0.18)}`
  }
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = inputBorder
    e.target.style.boxShadow = 'none'
  }

  // ── Section header (shared) ───────────────────────────────
  const SectionHeader = () => (
    <div style={{ textAlign: 'center', marginBottom: 32 }}>
      <p style={titleStyle}>XÁC NHẬN THAM DỰ</p>
      {guestName && <p style={subtitleStyle}>Kính mời {guestName}</p>}
      <div
        style={{
          width: 48,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
          margin: '0 auto'
        }}
      />
    </div>
  )

  // ── Submitted state ───────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ ...wrapStyle, textAlign: 'center' }}>
        <SectionHeader />
        <div
          style={{
            maxWidth: 480,
            margin: '0 auto',
            background: successCardBg,
            borderRadius: 24,
            padding: '48px 28px',
            backdropFilter: isDark ? 'blur(16px)' : undefined,
            WebkitBackdropFilter: isDark ? 'blur(16px)' : undefined,
            boxShadow: `0 8px 40px ${hex2rgba(primaryColor, isDark ? 0.2 : 0.12)}`,
            border: `1px solid ${cardBorder}`
          }}
        >
          <div style={{ fontSize: '3.5rem', marginBottom: 20 }}>{isAttending ? '🎊' : '💜'}</div>
          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: primaryColor,
              marginBottom: 10,
              ...(sectionFontFamily ? { fontFamily: sectionFontFamily } : {})
            }}
          >
            {isAttending ? 'Hẹn gặp bạn tại đám cưới!' : 'Cảm ơn bạn đã phản hồi!'}
          </h3>
          <p style={{ color: successBodyText, fontSize: 15, lineHeight: 1.75, fontStyle: 'italic' }}>
            {isAttending
              ? 'Chúng mình rất vui khi được đón bạn trong ngày trọng đại này!'
              : 'Thông tin của bạn đã được ghi nhận. Mong có dịp gặp bạn lần sau!'}
          </p>
          {wish && (
            <div
              style={{
                marginTop: 24,
                padding: '14px 18px',
                background: hex2rgba(primaryColor, 0.08),
                borderRadius: 12,
                borderLeft: `3px solid ${primaryColor}`,
                textAlign: 'left'
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: labelColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 6
                }}
              >
                Lời chúc của bạn
              </p>
              <p style={{ color: wishQuoteText, fontStyle: 'italic', fontSize: 14, lineHeight: 1.7 }}>
                &ldquo;{wish}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Form ──────────────────────────────────────────────────
  return (
    <div style={wrapStyle}>
      <SectionHeader />

      <div
        style={{
          maxWidth: 540,
          margin: '0 auto',
          background: cardBg,
          borderRadius: 24,
          padding: '28px 24px',
          backdropFilter: isDark ? 'blur(16px)' : undefined,
          WebkitBackdropFilter: isDark ? 'blur(16px)' : undefined,
          boxShadow: `0 8px 40px ${hex2rgba(primaryColor, isDark ? 0.15 : 0.1)}`,
          border: `1px solid ${cardBorder}`
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Attendance */}
          <div>
            <label style={labelStyle}>Bạn có tham dự không? *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                type='button'
                onClick={() => setIsAttending(true)}
                style={{
                  padding: '13px 8px',
                  borderRadius: 14,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  transition: 'all .2s',
                  fontFamily: 'inherit',
                  border: isAttending === true ? `2px solid ${primaryColor}` : `1.5px solid ${btnDefaultBorder}`,
                  background: isAttending === true ? hex2rgba(primaryColor, 0.12) : btnDefaultBg,
                  color: isAttending === true ? primaryColor : btnDefaultText
                }}
              >
                Có, tôi sẽ đến
              </button>
              <button
                type='button'
                onClick={() => setIsAttending(false)}
                style={{
                  padding: '13px 8px',
                  borderRadius: 14,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  transition: 'all .2s',
                  fontFamily: 'inherit',
                  border: isAttending === false ? `2px solid ${btnDeclineBorder}` : `1.5px solid ${btnDefaultBorder}`,
                  background: isAttending === false ? btnDeclineBg : btnDefaultBg,
                  color: isAttending === false ? btnDeclineText : btnDefaultText
                }}
              >
                Xin lỗi, tôi bận
              </button>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label style={labelStyle}>
              Số điện thoại <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.5 }}>(tùy chọn)</span>
            </label>
            <input
              type='tel'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder='0901 234 567'
              style={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          {/* Honeypot */}
          <input
            type='text'
            tabIndex={-1}
            autoComplete='off'
            style={{ display: 'none' }}
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />

          {/* Party size */}
          {isAttending && (
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
                      fontWeight: 700,
                      fontSize: 15,
                      cursor: 'pointer',
                      transition: 'all .2s',
                      fontFamily: 'inherit',
                      border: '1.5px solid',
                      borderColor: partySize === n ? primaryColor : isDark ? 'rgba(255,255,255,0.12)' : '#e5e7eb',
                      borderRight: i < 4 ? 'none' : '1.5px solid',
                      borderRightColor: partySize === n ? primaryColor : isDark ? 'rgba(255,255,255,0.12)' : '#e5e7eb',
                      borderRadius: i === 0 ? '14px 0 0 14px' : i === 4 ? '0 14px 14px 0' : '0',
                      background: partySize === n ? primaryColor : partySizeBtnEmpty,
                      color: partySize === n ? '#fff' : partySizeTextEmpty,
                      boxShadow: partySize === n ? `0 4px 12px ${hex2rgba(primaryColor, 0.35)}` : 'none'
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 12, color: labelColor, marginTop: 5 }}>người tham dự</p>
            </div>
          )}

          {/* Wishes */}
          <div>
            <label style={labelStyle}>
              Lời chúc <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.5 }}>(tùy chọn)</span>
            </label>
            <textarea
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder='Chúc hai bạn trăm năm hạnh phúc...'
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          {/* Submit */}
          <button
            type='submit'
            disabled={loading || isAttending === null}
            style={{
              width: '100%',
              padding: 16,
              border: 'none',
              borderRadius: 16,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: '0.03em',
              transition: 'all .3s',
              fontFamily: 'inherit',
              cursor: loading || isAttending === null ? 'not-allowed' : 'pointer',
              background:
                isAttending === null || loading
                  ? disabledBg
                  : `linear-gradient(135deg, ${primaryColor}, ${hex2rgba(primaryColor, 0.75)})`,
              color: isAttending === null || loading ? disabledText : '#fff',
              boxShadow: isAttending !== null && !loading ? `0 8px 24px ${hex2rgba(primaryColor, 0.4)}` : 'none'
            }}
          >
            {loading ? '⏳ Đang gửi...' : 'Gửi Xác Nhận'}
          </button>

          {submitError && (
            <p style={{ textAlign: 'center', color: '#ef4444', fontSize: 14, fontWeight: 500 }}>❌ {submitError}</p>
          )}
        </form>
      </div>
    </div>
  )
}
