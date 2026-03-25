import MusicPlayer from '@/components/MusicPlayer'
import { createClient } from '@supabase/supabase-js'
import Head from 'next/head'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getImageStyle, resolveImageAdjust } from '../../lib/imageUtils'
import { useMapEmbed } from '../../lib/useMapEmbed'
import { useTemplateViewport } from '../../lib/TemplateViewportContext'
import { TemplateProps } from '../TemplateRegistry'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const flowerDecorUrl = new URL('./bong_hoa.PNG', import.meta.url).toString()

const mockAlbum = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=500&fit=crop'
]

const mockGuestbook = [
  {
    guest_name: 'Thành Phát',
    created_at: '05:31:21 8/3/2026',
    wishes: 'Chúc em hạnh phúc nha, anh đứng từ xa vỗ tay nhiệt tình. Hẹn em kiếp sau nhớ đăng ký sớm với anh!',
    is_attending: true,
    party_size: 2,
    phone: ''
  },
  {
    guest_name: 'Anh Khoa',
    created_at: '05:31:16 8/3/2026',
    wishes: 'Chúc em trăm năm hạnh phúc, còn anh trăm năm vẫn độc thân vui tính. Kiếp sau mình làm lại ván mới nha!',
    is_attending: true,
    party_size: 2,
    phone: ''
  },
  {
    guest_name: 'Thành Đạt',
    created_at: '05:31:11 8/3/2026',
    wishes: 'Chúc em luôn cười tươi mỗi ngày, còn anh xin phép cười trừ. Hẹn gặp em ở kiếp sau bản deluxe!',
    is_attending: true,
    party_size: 2,
    phone: ''
  },
  {
    guest_name: 'Quốc Dửng',
    created_at: '20:07:36 1/3/2026',
    wishes:
      'Chúc em hạnh phúc viên mãn, anh xin làm khách mời danh dự của tuổi trẻ. Kiếp sau anh canh giờ tỏ tình sớm hơn!',
    is_attending: true,
    party_size: 1,
    phone: ''
  },
  {
    guest_name: 'Hữu Thọ',
    created_at: '12:40:14 1/3/2026',
    wishes: 'Chúc mừng hạnh phúc!',
    is_attending: true,
    party_size: 1,
    phone: ''
  }
]

const BANK_MAP: Record<string, string> = {
  Vietcombank: 'VCB',
  Techcombank: 'TCB',
  MBBank: 'MB',
  ACB: 'ACB',
  Vietinbank: 'ICB',
  BIDV: 'BIDV',
  VPBank: 'VPB',
  TPBank: 'TPB'
}

function parseWeddingDate(rawDate: string) {
  if (!rawDate) {
    return {
      day: '01',
      month: '01',
      year: '2026',
      dayName: 'CHỦ NHẬT'
    }
  }

  let d = 1
  let m = 1
  let y = 2026

  if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    const [yy, mm, dd] = rawDate.split('-').map(Number)
    y = yy
    m = mm
    d = dd
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(rawDate)) {
    const [dd, mm, yy] = rawDate.split('/').map(Number)
    y = yy
    m = mm
    d = dd
  }

  const date = new Date(y, Math.max(m - 1, 0), d)
  const weekday = date.toLocaleDateString('vi-VN', { weekday: 'long' })

  return {
    day: String(d).padStart(2, '0'),
    month: String(m).padStart(2, '0'),
    year: String(y),
    dayName: (weekday || 'Chủ nhật').toUpperCase()
  }
}

export default function ModernGeneralView({ wedding, disableSplash, musicUrl, guestName = '', rsvpId }: TemplateProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [showGiftQr, setShowGiftQr] = useState(false)
  const [showSplash, setShowSplash] = useState(!disableSplash)
  const [splashFading, setSplashFading] = useState(false)
  const [guestWishes, setGuestWishes] = useState<any[]>([])

  const [wish, setWish] = useState('')
  const [phone, setPhone] = useState('')
  const [isAttending, setIsAttending] = useState<boolean | null>(null)
  const [partySize, setPartySize] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [demoRsvpName, setDemoRsvpName] = useState(guestName || '')
  const [demoAttend, setDemoAttend] = useState<'yes' | 'no' | ''>('')
  const [demoPartySize, setDemoPartySize] = useState(1)
  const [demoRsvpMessage, setDemoRsvpMessage] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const toastTimerRef = useRef<number | null>(null)

  const viewport = useTemplateViewport()

  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = {
    ...(templateData?.default_content || {}),
    ...content
  }

  const groomName = mergedContent.groom_name || 'Hoàng Nam'
  const brideName = mergedContent.bride_name || 'Thanh Tú'

  const groomImage =
    mergedContent.groom_image ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
  const brideImage =
    mergedContent.bride_image ||
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face'

  const groomRole = mergedContent.groom_role || 'Chú rể'
  const brideRole = mergedContent.bride_role || 'Cô dâu'

  const groomParents =
    mergedContent.groom_parents ||
    [mergedContent.groom_father_name, mergedContent.groom_mother_name].filter(Boolean).join('\n') ||
    'Ông bà thông gia'

  const brideParents =
    mergedContent.bride_parents ||
    [mergedContent.bride_father_name, mergedContent.bride_mother_name].filter(Boolean).join('\n') ||
    'Ông bà thông gia'

  const groomAddress = mergedContent.groom_address || mergedContent.groom_city || 'Gia đình chú rể'
  const brideAddress = mergedContent.bride_address || mergedContent.bride_city || 'Gia đình cô dâu'

  const weddingTime = mergedContent.wedding_time || '09:00'
  const partyTime = mergedContent.party_time || weddingTime
  const weddingDateRaw = mergedContent.wedding_date || mergedContent.event_date || '01/02/2026'
  const lunarDate = mergedContent.lunar_date || '14/12 Ất Tỵ'
  const address = mergedContent.address || 'Queen Plaza Kỳ Hòa, 16A Lê Hồng Phong, Phường 12, Quận 10, TP. Hồ Chí Minh'

  const { day, month, year, dayName } = useMemo(() => parseWeddingDate(weddingDateRaw), [weddingDateRaw])

  const mapUrl = useMapEmbed(mergedContent.map_url, address)

  const albumImages = (mergedContent.images?.length > 0 ? mergedContent.images : mockAlbum).slice(0, 15)

  const handleOpenInvitation = () => {
    setSplashFading(true)
    setTimeout(() => setShowSplash(false), 600)
  }

  useEffect(() => {
    if (!wedding?.id) return

    const weddingId = String(wedding.id)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(weddingId)

    if (!isUuid) {
      console.log('[ThemeModern][Guestbook] Skip RSVP fetch for non-UUID wedding id', { weddingId })
      setGuestWishes([])
      return
    }

    console.log('[ThemeModern][Guestbook] Fetch RSVP start', { weddingId })

    supabase
      .from('rsvps')
      .select('guest_name, wishes, created_at, is_attending, party_size, phone')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: false })
      .then(
        ({ data, error }) => {
          console.log('[ThemeModern][Guestbook] Fetch RSVP result', {
            weddingId,
            count: data?.length || 0,
            data,
            error
          })

          if (error) {
            console.error('[ThemeModern][Guestbook] Fetch RSVP error', error)
            return
          }

          if (data) setGuestWishes(data)
        },
        (err: unknown) => {
          console.error('[ThemeModern][Guestbook] Unexpected fetch exception', err)
        }
      )
  }, [wedding?.id])

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

  const handleDemoRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedName = demoRsvpName.trim()
    if (!trimmedName) {
      showThemeToast('Vui lòng nhập tên khách mời.')
      return
    }

    if (!demoAttend) {
      showThemeToast('Vui lòng chọn tình trạng tham dự.')
      return
    }

    const partyCount = demoAttend === 'yes' ? Math.max(1, demoPartySize) : 0
    const attendText = demoAttend === 'yes' ? 'Sẽ tham dự' : 'Không tham dự'
    const note = demoRsvpMessage.trim() || 'Không có lời nhắn'

    showThemeToast(`Demo RSVP: ${trimmedName} | ${attendText} | SL: ${partyCount} | ${note}`)
  }

  const formatParents = (text: string) => {
    const lines = text.split('\n').filter(Boolean)
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

  const rose = '#680e0e'
  const cream = rose
  const creamLight = '#7a1a1a'
  const textDark = mergedContent.primary_color || '#e9ce9e'
  const fontFamily = mergedContent.font_family || "'Lora', serif"
  const headingFontFamily = mergedContent.heading_font_family || "'Great Vibes', cursive"
  const sectionFontFamily = mergedContent.section_font_family || "'Playfair Display', serif"
  const displayedGuestWishes = (guestWishes.length > 0 ? guestWishes : mockGuestbook).filter(
    (w) => w.wishes && w.wishes.trim() !== ''
  )

  const bankName = mergedContent.bank_name || ''
  const accountNumber = mergedContent.account_number || ''
  const accountName = mergedContent.account_name || ''
  const customQrImage = mergedContent.qr_image || mergedContent.qrImage || ''
  const transferNote = `Mung cuoi ${guestName || groomName} ${brideName}`.trim()
  const bankCode = BANK_MAP[bankName] || bankName
  const generatedQrUrl =
    bankCode && accountNumber
      ? `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.jpg?amount=0&addInfo=${encodeURIComponent(transferNote)}&accountName=${encodeURIComponent(accountName)}`
      : ''
  const displayQrUrl = customQrImage || generatedQrUrl
  const hasGiftInfo = Boolean(displayQrUrl || accountNumber || bankName || accountName)

  const ribbonStyle = {
    backgroundColor: rose
  }

  const flowerMaskBase = {
    backgroundColor: textDark,
    WebkitMaskImage: `url(${flowerDecorUrl})`,
    maskImage: `url(${flowerDecorUrl})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: 'contain',
    maskSize: 'contain'
  }

  const panelPatternStyle = {
    backgroundColor: creamLight,
    backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, ${creamLight} 10px), repeating-linear-gradient(rgba(200,100,100,0.03), rgba(200,100,100,0.03))`
  }

  const showThemeToast = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setShowToast(false), 3200)
  }

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    }
  }, [])

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
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>💔</div>
          <h1 style={{ color: textDark, marginBottom: 8 }}>Không tìm thấy thông tin</h1>
          <p style={{ color: textDark }}>Thiệp mời có thể đã bị xóa hoặc không hợp lệ.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>
          Thiệp cưới - {groomName} &amp; {brideName}
        </title>
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
          input:focus, textarea:focus {
            outline: none;
            border-color: ${rose};
            box-shadow: 0 0 0 2px ${rose}30;
          }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes sealPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(214,131,138,0.45); } 70% { box-shadow: 0 0 0 14px rgba(214,131,138,0); } }
          @keyframes cardGlow { 0%, 100% { box-shadow: 0 12px 26px rgba(0,0,0,0.2), 0 0 0 rgba(233,206,158,0); } 50% { box-shadow: 0 14px 28px rgba(0,0,0,0.24), 0 0 28px rgba(233,206,158,0.2); } }
          @keyframes giftWiggle {
            0%, 100% { transform: rotate(0deg) translateY(0); }
            25% { transform: rotate(-1.1deg) translateY(-1px); }
            75% { transform: rotate(1.1deg) translateY(-1px); }
          }
          @keyframes giftCardLightPulse {
            0%, 100% { box-shadow: 0 16px 34px rgba(0,0,0,0.28), 0 0 0 rgba(233,206,158,0), 0 0 0 rgba(233,206,158,0); }
            50% { box-shadow: 0 22px 46px rgba(0,0,0,0.38), 0 0 28px ${textDark}66, 0 0 56px ${textDark}33; }
          }
          @keyframes splashCardShakeFast {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-1px) rotate(-0.85deg); }
            50% { transform: translateY(0) rotate(0.55deg); }
            75% { transform: translateY(-1px) rotate(-0.65deg); }
          }
          @keyframes splashCardLightPulse {
            0%, 100% { box-shadow: 0 18px 38px rgba(0,0,0,0.34), 0 0 0 rgba(233,206,158,0), 0 0 0 rgba(233,206,158,0); }
            50% { box-shadow: 0 24px 52px rgba(0,0,0,0.46), 0 0 34px ${textDark}66, 0 0 64px ${textDark}30; }
          }
          @keyframes vuquyBadgeSway {
            0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
            25% { transform: translate(-50%, calc(-50% - 1px)) rotate(-0.85deg); }
            50% { transform: translate(-50%, -50%) rotate(0.55deg); }
            75% { transform: translate(-50%, calc(-50% - 1px)) rotate(-0.65deg); }
          }
          @keyframes vuquyBadgeGlow {
            0%, 100% {
              box-shadow: 0 12px 24px rgba(0,0,0,0.18), 0 0 0 rgba(233,206,158,0), inset 0 0 0 rgba(233,206,158,0);
            }
            50% {
              box-shadow: 0 14px 30px rgba(0,0,0,0.24), 0 0 18px ${textDark}33, inset 0 0 12px ${textDark}1a;
            }
          }
          .splash-card-motion {
            width: 100%;
            max-width: 480px;
            animation: splashCardShakeFast 1.25s ease-in-out 1s infinite;
            transform-origin: center 85%;
          }
          .splash-card { animation: fadeInUp 0.85s cubic-bezier(.22,.68,0,1.2) both; }
          .splash-card-glow {
            animation: splashCardLightPulse 2s ease-in-out 1s infinite;
            filter: drop-shadow(0 10px 22px rgba(0,0,0,0.38));
          }
          .splash-hy-wrap {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
          }
          .splash-hy-symbol {
            font-size: 2.55rem;
            color: ${textDark};
            letter-spacing: 6px;
            line-height: 1;
            font-weight: 700;
          }
          .splash-hy-ornament {
            display: none;
            position: absolute;
            top: 50%;
            width: 62px;
            height: auto;
            opacity: 0.72;
            filter: drop-shadow(0 4px 10px rgba(0,0,0,0.26));
            pointer-events: none;
          }
          .splash-hy-ornament-left {
            left: 50%;
            transform: translate(-124px, -50%);
          }
          .splash-hy-ornament-right {
            left: 50%;
            transform: translate(62px, -50%);
          }
          .splash-decor-wrap {
            position: absolute;
            inset: 0;
            pointer-events: none;
          }
          .splash-ornament {
            position: absolute;
            width: clamp(170px, 20vw, 270px);
            height: auto;
            opacity: 0.72;
            filter: drop-shadow(0 10px 20px rgba(0,0,0,0.25));
          }
          .splash-ornament-left {
            left: max(8px, calc(50% - 508px));
            top: 50%;
            transform: translateY(-54%) rotate(-2deg);
          }
          .splash-ornament-right {
            right: max(8px, calc(50% - 508px));
            top: 50%;
            transform: translateY(-52%) rotate(2deg) scaleX(-1);
          }
          .splash-flower {
            position: absolute;
            width: clamp(84px, 8vw, 126px);
            height: clamp(84px, 8vw, 126px);
            opacity: 0.26;
            filter: drop-shadow(0 8px 18px rgba(0,0,0,0.25));
          }
          .splash-flower-left {
            left: max(4px, calc(50% - 330px));
            top: calc(50% - 246px);
            transform: rotate(-18deg);
          }
          .splash-flower-right {
            right: max(4px, calc(50% - 330px));
            bottom: calc(50% - 246px);
            transform: rotate(18deg) scaleX(-1);
          }
          .btn-open { animation: sealPulse 2.2s ease-out infinite; }
          .btn-calendar:hover { opacity: 0.9; transform: scale(1.02); }
          .gift-mini-card {
            animation: splashCardShakeFast 1.25s ease-in-out 1s infinite, giftCardLightPulse 2s ease-in-out 1s infinite;
            transform-origin: center 85%;
            transition: transform .24s ease;
            filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
          }
          .gift-mini-card:hover { transform: translateY(-4px); }
          .gift-card-wrap {
            position: relative;
            width: fit-content;
            margin: 0 auto;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .gift-card-ornament {
            position: absolute;
            top: 50%;
            width: clamp(102px, 13vw, 146px);
            height: auto;
            transform: translateY(-55%);
            opacity: 0.8;
            pointer-events: none;
            filter: drop-shadow(0 8px 14px rgba(0,0,0,0.28));
            z-index: 1;
          }
          .gift-card-ornament-left {
            left: -158px;
            transform: translateY(-55%) rotate(-4deg);
          }
          .gift-card-ornament-right {
            right: -158px;
            transform: translateY(-55%) rotate(4deg) scaleX(-1);
          }
          .gift-card-flower {
            position: absolute;
            width: clamp(52px, 6.8vw, 82px);
            height: clamp(52px, 6.8vw, 82px);
            opacity: 0.28;
            pointer-events: none;
            filter: drop-shadow(0 6px 12px rgba(0,0,0,0.24));
            z-index: 1;
          }
          .gift-card-flower-left {
            left: -44px;
            top: -24px;
            transform: rotate(-24deg);
          }
          .gift-card-flower-right {
            right: -44px;
            bottom: -24px;
            transform: rotate(24deg) scaleX(-1);
          }
          .modern-rsvp-control {
            width: 100%;
            min-height: 42px;
            line-height: 1.25;
          }
          .modern-rsvp-submit {
            width: 100%;
            min-height: 44px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .modern-card-content { position: relative; z-index: 2; }
          .modern-flower {
            position: absolute;
            pointer-events: none;
            user-select: none;
            z-index: 1;
            opacity: 0.2;
            filter: drop-shadow(0 6px 14px rgba(0,0,0,0.2));
          }
          .modern-flower-soft { opacity: 0.13; }
          .modern-guestbook-scroll {
            scrollbar-width: thin;
            scrollbar-color: ${creamLight} ${rose};
          }
          .modern-guestbook-scroll::-webkit-scrollbar { width: 10px; }
          .modern-guestbook-scroll::-webkit-scrollbar-track {
            background: ${rose};
            border-radius: 999px;
          }
          .modern-guestbook-scroll::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, ${creamLight}, #5b1010);
            border-radius: 999px;
            border: 1px solid ${textDark}33;
          }
          .modern-guestbook-scroll::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #872020, ${creamLight});
          }
          .modern-section-floral {
            position: relative;
            overflow: hidden;
          }
          .modern-section-floral::before,
          .modern-section-floral::after {
            content: '';
            position: absolute;
            top: 50%;
            width: 104px;
            height: 104px;
            background-color: ${textDark};
            opacity: 0.12;
            pointer-events: none;
            transform: translateY(-50%);
            z-index: 0;
            -webkit-mask-image: url(${flowerDecorUrl});
            mask-image: url(${flowerDecorUrl});
            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
            -webkit-mask-position: center;
            mask-position: center;
            -webkit-mask-size: contain;
            mask-size: contain;
          }
          .modern-section-floral::before {
            left: -26px;
            transform: translateY(-50%) rotate(-18deg);
          }
          .modern-section-floral::after {
            right: -26px;
            transform: translateY(-50%) rotate(18deg) scaleX(-1);
          }
          .modern-section-floral > * {
            position: relative;
            z-index: 1;
          }
          .modern-vuquy-flower {
            position: absolute;
            top: 50%;
            width: 50px;
            height: 50px;
            background-color: ${textDark};
            opacity: 0.26;
            pointer-events: none;
            -webkit-mask-image: url(${flowerDecorUrl});
            mask-image: url(${flowerDecorUrl});
            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
            -webkit-mask-position: center;
            mask-position: center;
            -webkit-mask-size: contain;
            mask-size: contain;
          }
          .modern-vuquy-flower-left {
            left: 14px;
            transform: translateY(-50%) rotate(-20deg);
          }
          .modern-vuquy-flower-right {
            right: 14px;
            transform: translateY(-50%) rotate(20deg) scaleX(-1);
          }

          @media (max-width: 768px) {
            .modern-side-panel { display: none !important; }
            .modern-card { width: 100% !important; max-width: 100% !important; }
            .modern-avatar { width: 120px !important; height: 120px !important; }
            .modern-ornament {
              display: block !important;
              top: -72px !important;
              height: clamp(122px, 31vw, 162px) !important;
              opacity: 0.76 !important;
              z-index: 2 !important;
            }
            .modern-ornament-left { left: 3% !important; right: auto !important; }
            .modern-ornament-right { right: 3% !important; left: auto !important; }
            .modern-vuquy-badge {
              top: 75px !important;
              min-width: 238px !important;
              padding: 10px 22px 8px !important;
            }
            .modern-vuquy-title {
              font-size: 1.55rem !important;
              letter-spacing: 2px !important;
            }
            .modern-vuquy-flower {
              width: 34px;
              height: 34px;
              opacity: 0.22;
            }
            .modern-vuquy-flower-left { left: 10px; }
            .modern-vuquy-flower-right { right: 10px; }
            .modern-parents-flex {
              flex-direction: column !important;
              gap: 20px !important;
              align-items: center !important;
              text-align: center !important;
            }
            .modern-parents-col {
              padding: 0 !important;
              width: 100% !important;
              max-width: 320px;
              margin: 0 auto;
              text-align: center;
            }
            .modern-parents-divider { display: none !important; }
            .modern-album-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .modern-section-padding { padding-left: 16px !important; padding-right: 16px !important; }
            .modern-flower-soft { display: none !important; }
            .splash-decor-wrap { display: none !important; }
            .splash-hy-wrap { margin-bottom: 28px; }
            .splash-hy-symbol { font-size: 2.32rem; letter-spacing: 5px; }
            .splash-hy-ornament { display: block; width: 68px; }
            .splash-hy-ornament-left { transform: translate(-132px, -50%); }
            .splash-hy-ornament-right { transform: translate(64px, -50%); }
            .modern-section-floral::before,
            .modern-section-floral::after {
              width: 82px;
              height: 82px;
              opacity: 0.11;
            }
            .modern-section-floral::before { left: -24px; }
            .modern-section-floral::after { right: -24px; }
            .gift-card-ornament {
              width: clamp(90px, 22vw, 124px);
              opacity: 0.74;
            }
            .gift-card-ornament-left { left: -88px; }
            .gift-card-ornament-right { right: -88px; }
            .gift-mini-card {
              width: 196px !important;
              height: 136px !important;
            }
            .gift-card-flower {
              width: clamp(50px, 11vw, 72px);
              height: clamp(50px, 11vw, 72px);
              opacity: 0.24;
            }
            .gift-card-flower-left { left: -36px; top: -20px; }
            .gift-card-flower-right { right: -36px; bottom: -20px; }
            .modern-rsvp-form {
              max-width: 540px !important;
              padding: 14px 16px !important;
            }
            .modern-rsvp-row {
              grid-template-columns: 1fr 1fr !important;
            }
            .modern-map-wrap,
            .modern-guestbook-wrap {
              max-width: 540px !important;
            }
            .modern-map-frame {
              height: 340px !important;
            }
            .modern-guestbook-wrap {
              max-height: 410px !important;
            }
          }
          
          .modern-container {
            container-type: inline-size;
          }

          @container (max-width: 896px) {
             .modern-side-panel { display: none !important; }
             .modern-card { width: 100% !important; max-width: 100% !important; border: none !important; border-radius: 0 !important; }
             .modern-avatar { width: 120px !important; height: 120px !important; }
             .modern-ornament {
                display: block !important;
                top: -96px !important;
                height: clamp(96px, 24vw, 124px) !important;
                opacity: 0.76 !important;
                z-index: 2 !important;
             }
             .modern-ornament-left { left: 3% !important; right: auto !important; }
             .modern-ornament-right { right: 3% !important; left: auto !important; }
             .modern-vuquy-badge {
                top: 58px !important;
                min-width: 238px !important;
                padding: 10px 22px 8px !important;
             }
             .modern-vuquy-title {
                font-size: 1.55rem !important;
                letter-spacing: 2px !important;
             }
             .modern-parents-flex {
                flex-direction: column !important;
                gap: 20px !important;
                align-items: center !important;
                text-align: center !important;
             }
             .modern-parents-col {
                padding: 0 !important;
                width: 100% !important;
                max-width: 320px;
                margin: 0 auto;
                text-align: center;
             }
             .modern-parents-divider { display: none !important; }
             .modern-album-grid { grid-template-columns: repeat(2, 1fr) !important; }
             .modern-section-padding { padding-left: 16px !important; padding-right: 16px !important; }
             .modern-flower-soft { display: none !important; }
             .splash-decor-wrap { display: none !important; }
             .splash-hy-wrap { margin-bottom: 28px; }
             .splash-hy-symbol { font-size: 2.32rem; letter-spacing: 5px; }
             .splash-hy-ornament { display: block; width: 68px; }
             .splash-hy-ornament-left { transform: translate(-132px, -50%); }
             .splash-hy-ornament-right { transform: translate(64px, -50%); }
             .modern-rsvp-grid { grid-template-columns: 1fr !important; }
             .modern-section-floral::before,
             .modern-section-floral::after {
                width: 82px;
                height: 82px;
                opacity: 0.11;
             }
             .modern-section-floral::before { left: -24px; }
             .modern-section-floral::after { right: -24px; }
          }

          @container (max-width: 440px) {
            .modern-ornament {
              top: -68px !important;
              height: clamp(106px, 30vw, 132px) !important;
              opacity: 0.68 !important;
            }
            .modern-ornament-left { left: 2% !important; }
            .modern-ornament-right { right: 2% !important; }
            .modern-vuquy-badge {
              top: 75px !important;
              min-width: 218px !important;
              padding: 9px 18px 8px !important;
            }
            .modern-vuquy-title {
              font-size: 1.34rem !important;
              letter-spacing: 1.5px !important;
            }
            .modern-vuquy-flower {
              width: 30px;
              height: 30px;
              opacity: 0.2;
            }
            .modern-vuquy-flower-left { left: 8px; }
            .modern-vuquy-flower-right { right: 8px; }
            .splash-hy-wrap { margin-bottom: 24px; }
            .splash-hy-symbol { font-size: 2.14rem; letter-spacing: 4px; }
            .splash-hy-ornament { width: 62px; opacity: 0.72; }
            .splash-hy-ornament-left { transform: translate(-114px, -50%); }
            .splash-hy-ornament-right { transform: translate(56px, -50%); }
            .splash-ornament {
              width: clamp(124px, 28vw, 170px);
              opacity: 0.56;
            }
            .splash-ornament-left {
              left: max(0px, calc(50% - 446px));
            }
            .splash-ornament-right {
              right: max(0px, calc(50% - 466px));
            }
            .splash-flower {
              width: 74px;
              height: 74px;
              opacity: 0.2;
            }
            .splash-flower-left {
              left: max(0px, calc(50% - 192px));
              top: calc(50% - 226px);
            }
            .splash-flower-right {
              right: max(0px, calc(50% - 192px));
              bottom: calc(50% - 226px);
            }
            .modern-section-floral::before,
            .modern-section-floral::after {
              width: 70px;
              height: 70px;
              opacity: 0.1;
            }
            .gift-card-ornament {
              width: 78px;
              opacity: 0.68;
              top: 52%;
            }
            .gift-card-ornament-left { left: -78px; }
            .gift-card-ornament-right { right: -78px; }
            .gift-mini-card {
              width: 182px !important;
              height: 126px !important;
            }
            .gift-card-flower {
              width: 46px;
              height: 46px;
              opacity: 0.2;
            }
            .gift-card-flower-left { left: -28px; top: -16px; }
            .gift-card-flower-right { right: -28px; bottom: -16px; }
            .modern-rsvp-form {
              max-width: 340px !important;
              padding: 12px !important;
            }
            .modern-rsvp-row {
              grid-template-columns: 1fr !important;
              gap: 8px !important;
            }
            .modern-rsvp-submit {
              border-radius: 12px !important;
              padding: 10px 12px !important;
              font-size: 0.84rem !important;
              letter-spacing: 0.3px !important;
            }
            .modern-map-wrap,
            .modern-guestbook-wrap {
              max-width: 320px !important;
            }
            .modern-map-frame {
              height: 300px !important;
            }
            .modern-guestbook-wrap {
              max-height: 360px !important;
            }
          }
        `}</style>
      </Head>

      {showSplash && (
        <div
          onClick={handleOpenInvitation}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9997,
            backgroundColor: 'rgba(110, 37, 37, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            opacity: splashFading ? 0 : 1,
            transition: 'opacity 0.6s ease',
            fontFamily: "'Lora', serif",
            padding: 20,
            overflow: 'hidden'
          }}
        >
          <div aria-hidden='true' className='splash-decor-wrap'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className='splash-ornament splash-ornament-left' src='/image/rong.webp' alt='' />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className='splash-ornament splash-ornament-right' src='/image/phung.webp' alt='' />
            <div className='splash-flower splash-flower-left' style={flowerMaskBase} />
            <div className='splash-flower splash-flower-right' style={flowerMaskBase} />
          </div>

          <div className='splash-card-motion'>
            <div
              className='splash-card splash-card-glow'
              style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}
            >
              <div
                style={{
                  backgroundColor: rose,
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

              <div
                style={{
                  backgroundColor: '#6a131a',
                  border: `1px solid ${textDark}2f`,
                  borderTop: 'none',
                  borderBottom: 'none',
                  padding: '40px 32px 32px'
                }}
              >
                <div className='splash-hy-wrap'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className='splash-hy-ornament splash-hy-ornament-left' src='/image/rong.webp' alt='' />
                  <p className='splash-hy-symbol'>囍</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className='splash-hy-ornament splash-hy-ornament-right' src='/image/phung.webp' alt='' />
                </div>

                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '0.6rem',
                    letterSpacing: '0.45em',
                    color: textDark,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    marginTop: 30,
                    marginBottom: 20
                  }}
                >
                  Trân trọng kính báo
                </p>

                {guestName && (
                  <p style={{ fontSize: '0.7rem', color: textDark, marginBottom: 16 }}>
                    Kính mời: <strong>{guestName}</strong>
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, backgroundColor: `${rose}35` }} />
                  <span style={{ color: textDark, fontSize: '0.55rem', letterSpacing: 6 }}>✦ ✦ ✦</span>
                  <div style={{ flex: 1, height: 1, backgroundColor: `${rose}35` }} />
                </div>

                <p style={{ fontSize: '0.72rem', color: textDark, fontStyle: 'italic', marginBottom: 16 }}>
                  Lễ thành hôn của
                </p>

                <h3
                  style={{
                    fontFamily: "'Great Vibes', cursive",
                    fontSize: '3rem',
                    color: textDark,
                    fontWeight: 400,
                    lineHeight: 1.1
                  }}
                >
                  {groomName}
                </h3>
                <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2rem', color: textDark, lineHeight: 1 }}>
                  &amp;
                </p>
                <h3
                  style={{
                    fontFamily: "'Great Vibes', cursive",
                    fontSize: '3rem',
                    color: textDark,
                    fontWeight: 400,
                    lineHeight: 1.1,
                    marginBottom: 24
                  }}
                >
                  {brideName}
                </h3>

                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 30 }}
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
                      color: textDark,
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

                <button
                  className='btn-open'
                  onClick={() => {
                    handleOpenInvitation()
                  }}
                  style={{
                    backgroundColor: rose,
                    color: textDark,
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

              <div style={{ height: 8, backgroundColor: rose }} />
            </div>
          </div>
        </div>
      )}

      <div
        className='modern-container'
        style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'stretch' }}
      >
        <div className='modern-side-panel' style={{ flex: 1, minHeight: '100vh', background: '#fff' }} />

        <div
          className='modern-card'
          style={{
            width: 896,
            maxWidth: '100%',
            flexShrink: 0,
            background: cream,
            minHeight: '100vh',
            fontFamily: fontFamily,
            color: textDark,
            paddingBottom: 60,
            boxShadow: '0 0 40px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            aria-hidden='true'
            className='modern-flower modern-flower-soft'
            style={{
              ...flowerMaskBase,
              top: -42,
              left: -26,
              width: 168,
              height: 168,
              transform: 'rotate(-12deg)'
            }}
          />
          <div
            aria-hidden='true'
            className='modern-flower'
            style={{
              ...flowerMaskBase,
              top: 332,
              right: -48,
              width: 190,
              height: 190,
              transform: 'rotate(102deg)'
            }}
          />
          <div
            aria-hidden='true'
            className='modern-flower modern-flower-soft'
            style={{
              ...flowerMaskBase,
              top: 876,
              left: -58,
              width: 176,
              height: 176,
              transform: 'rotate(24deg)'
            }}
          />
          <div
            aria-hidden='true'
            className='modern-flower'
            style={{
              ...flowerMaskBase,
              bottom: 548,
              right: -52,
              width: 182,
              height: 182,
              transform: 'rotate(148deg)'
            }}
          />
          <div
            aria-hidden='true'
            className='modern-flower modern-flower-soft'
            style={{
              ...flowerMaskBase,
              bottom: 236,
              left: -40,
              width: 160,
              height: 160,
              transform: 'rotate(-26deg)'
            }}
          />
          <div
            aria-hidden='true'
            className='modern-flower'
            style={{
              ...flowerMaskBase,
              bottom: -34,
              right: -26,
              width: 170,
              height: 170,
              transform: 'rotate(194deg)'
            }}
          />
          <div
            aria-hidden='true'
            className='modern-flower modern-flower-soft'
            style={{
              ...flowerMaskBase,
              top: 174,
              left: -56,
              width: 140,
              height: 140,
              transform: 'rotate(-132deg)'
            }}
          />
          <div
            aria-hidden='true'
            className='modern-flower'
            style={{
              ...flowerMaskBase,
              top: 690,
              right: -52,
              width: 148,
              height: 148,
              transform: 'rotate(32deg)'
            }}
          />
          <div
            aria-hidden='true'
            className='modern-flower modern-flower-soft'
            style={{
              ...flowerMaskBase,
              bottom: 62,
              left: -34,
              width: 138,
              height: 138,
              transform: 'rotate(18deg)'
            }}
          />

          <div className='modern-card-content'>
            <div style={{ width: '100%', height: 128, ...ribbonStyle }} />

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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className='modern-ornament modern-ornament-left'
                  src='/image/rong.webp'
                  alt='Rong trang tri'
                  style={{
                    position: 'absolute',
                    left: '1%',
                    top: '-132px',
                    height: 240,
                    width: 'auto',
                    pointerEvents: 'none',
                    opacity: 0.88,
                    zIndex: 1
                  }}
                />

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className='modern-ornament modern-ornament-right'
                  src='/image/phung.webp'
                  alt='Phung trang tri'
                  style={{
                    position: 'absolute',
                    right: '1%',
                    top: '-132px',
                    height: 240,
                    width: 'auto',
                    pointerEvents: 'none',
                    opacity: 0.88,
                    zIndex: 1
                  }}
                />

                <div style={{ textAlign: 'center', width: '40%', position: 'relative', zIndex: 3, marginTop: 150 }}>
                  <div
                    className='modern-avatar'
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
                    <img
                      src={groomImage}
                      alt={groomName}
                      style={{
                        width: '100%',
                        height: '100%',
                        ...getImageStyle(resolveImageAdjust(mergedContent.groom_image_position, viewport))
                      }}
                    />
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
                    {groomRole}
                  </p>
                  <h3
                    style={{
                      fontFamily: headingFontFamily,
                      fontSize: '2rem',
                      color: textDark,
                      fontWeight: 400,
                      marginBottom: 10
                    }}
                  >
                    {groomName}
                  </h3>
                  <div style={{ width: '60%', height: 1, backgroundColor: `${rose}55`, margin: '0 auto' }} />
                </div>

                <div
                  className='modern-vuquy-badge'
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '48px',
                    transform: 'translate(-50%, -50%)',
                    minWidth: 286,
                    padding: '12px 34px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    borderRadius: 999,
                    background: `linear-gradient(145deg, ${rose}dd 0%, ${creamLight}e6 100%)`,
                    border: `1px solid ${textDark}66`,
                    boxShadow: '0 12px 24px rgba(0,0,0,0.18), 0 0 14px rgba(233,206,158,0.18)',
                    animation:
                      'vuquyBadgeSway 1.25s ease-in-out 1s infinite, vuquyBadgeGlow 2s ease-in-out 1s infinite',
                    zIndex: 5
                  }}
                >
                  <span className='modern-vuquy-flower modern-vuquy-flower-left' aria-hidden='true' />
                  <span className='modern-vuquy-flower modern-vuquy-flower-right' aria-hidden='true' />
                  <div
                    className='modern-vuquy-title'
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.9rem',
                      color: textDark,
                      lineHeight: 1,
                      fontWeight: 700,
                      letterSpacing: 2.6,
                      textTransform: 'uppercase',
                      textShadow: `0 1px 0 rgba(0,0,0,0.15), 0 0 10px ${textDark}33`
                    }}
                  >
                    Lễ Vu Quy
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span style={{ width: 30, height: 1, backgroundColor: `${textDark}88` }} />
                    <span style={{ fontSize: '1.2rem', color: textDark, lineHeight: 1 }}>囍</span>
                    <span style={{ width: 30, height: 1, backgroundColor: `${textDark}88` }} />
                  </div>
                </div>

                <div style={{ textAlign: 'center', width: '40%', position: 'relative', zIndex: 3, marginTop: 150 }}>
                  <div
                    className='modern-avatar'
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
                    <img
                      src={brideImage}
                      alt={brideName}
                      style={{
                        width: '100%',
                        height: '100%',
                        ...getImageStyle(resolveImageAdjust(mergedContent.bride_image_position, viewport))
                      }}
                    />
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
                    {brideRole}
                  </p>
                  <h3
                    style={{
                      fontFamily: headingFontFamily,
                      fontSize: '2rem',
                      color: textDark,
                      fontWeight: 400,
                      marginBottom: 10
                    }}
                  >
                    {brideName}
                  </h3>
                  <div style={{ width: '60%', height: 1, backgroundColor: `${rose}55`, margin: '0 auto' }} />
                </div>
              </div>
            </div>

            <div
              style={{
                width: '100%',
                height: 68,
                ...ribbonStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <p
                style={{
                  fontFamily: sectionFontFamily,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: 4,
                  color: textDark,
                  textTransform: 'uppercase'
                }}
              >
                Thông Tin Lễ Cưới
              </p>
            </div>

            <div
              className='modern-parents-flex modern-section-padding modern-section-floral'
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: '28px 32px 28px',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <div className='modern-parents-col' style={{ flex: 1, padding: '0 16px 0 0' }}>
                <p style={{ fontSize: '0.75rem', color: textDark, marginBottom: 6 }}>Ông bà</p>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: textDark,
                    lineHeight: 1.8
                  }}
                >
                  {formatParents(groomParents)}
                </div>
                <p
                  style={{
                    fontSize: '0.72rem',
                    color: textDark,
                    lineHeight: 1.5,
                    marginTop: 8,
                    whiteSpace: 'pre-line'
                  }}
                >
                  {groomAddress}
                </p>
              </div>

              <div
                className='modern-parents-divider'
                style={{ width: 1, alignSelf: 'stretch', backgroundColor: '#c8b6a6', flexShrink: 0 }}
              />

              <div className='modern-parents-col' style={{ flex: 1, padding: '0 0 0 16px' }}>
                <p style={{ fontSize: '0.75rem', color: textDark, marginBottom: 6 }}>Ông bà</p>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: textDark,
                    lineHeight: 1.8
                  }}
                >
                  {formatParents(brideParents)}
                </div>
                <p
                  style={{
                    fontSize: '0.72rem',
                    color: textDark,
                    lineHeight: 1.5,
                    marginTop: 8,
                    whiteSpace: 'pre-line'
                  }}
                >
                  {brideAddress}
                </p>
              </div>
            </div>

            <div
              className='modern-section-padding modern-section-floral'
              style={{ textAlign: 'center', padding: '16px 32px 32px' }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: textDark,
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
                  color: textDark,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  marginBottom: 28
                }}
              >
                Lễ thành hôn của con chúng tôi
              </p>

              <h2
                style={{
                  fontFamily: sectionFontFamily,
                  fontSize: '2.6rem',
                  fontWeight: 400,
                  color: textDark,
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
                {groomRole}
              </p>

              <p
                style={{
                  fontFamily: headingFontFamily,
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
                  fontFamily: sectionFontFamily,
                  fontSize: '2.6rem',
                  fontWeight: 400,
                  color: textDark,
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
                {brideRole}
              </p>

              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: textDark,
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
                  color: textDark,
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

              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 12 }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: textDark, letterSpacing: 2 }}>
                  {dayName}
                </span>
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

            <div
              style={{
                width: '100%',
                height: 68,
                ...ribbonStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <p
                style={{
                  fontFamily: sectionFontFamily,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: 4,
                  color: textDark,
                  textTransform: 'uppercase'
                }}
              >
                Album Ảnh Cưới
              </p>
            </div>

            <div className='modern-section-floral' style={{ padding: '24px 20px 10px', marginBottom: 40 }}>
              <div
                className='modern-album-grid'
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: 16,
                  maxWidth: 620,
                  margin: '0 auto'
                }}
              >
                {albumImages.slice(0, 4).map((img: string, i: number) => {
                  const isLast = i === 3
                  const extraCount = albumImages.length - 4

                  return (
                    <div
                      key={i}
                      onClick={() => setLightboxIndex(i)}
                      style={{
                        borderRadius: 14,
                        border: `1px solid ${textDark}66`,
                        overflow: 'hidden',
                        aspectRatio: '1 / 1',
                        position: 'relative',
                        cursor: 'pointer',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.22)'
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`Album ${i + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          ...getImageStyle(resolveImageAdjust(mergedContent.image_positions?.[i], viewport))
                        }}
                      />
                      {isLast && extraCount > 0 && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '2rem',
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

            <div
              style={{
                width: '100%',
                height: 68,
                ...ribbonStyle,
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
                  color: textDark,
                  textTransform: 'uppercase'
                }}
              >
                Thông Tin Tiệc Cưới
              </p>
            </div>

            <div className='modern-section-floral' style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: '2.2rem',
                  color: textDark,
                  fontWeight: 400,
                  marginBottom: 16
                }}
              >
                Tiệc cưới sẽ diễn ra vào lúc:
              </h2>
              <p
                style={{
                  fontSize: '1.6rem',
                  color: textDark,
                  fontWeight: 700,
                  fontFamily: "'Playfair Display', serif",
                  marginBottom: 16
                }}
              >
                {partyTime}
              </p>

              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: textDark }}>{dayName}</span>
                <div style={{ width: 1, height: 24, backgroundColor: '#c8b6a6' }} />
                <span
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: textDark,
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
                  color: textDark,
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
                  color: textDark,
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
                  backgroundColor: rose,
                  color: textDark,
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

            <div
              style={{
                width: '100%',
                height: 68,
                ...ribbonStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <p
                style={{
                  fontFamily: sectionFontFamily,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: 4,
                  color: textDark,
                  textTransform: 'uppercase'
                }}
              >
                Tiệc Cưới Sẽ Tổ Chức Tại
              </p>
            </div>

            <div className='modern-section-floral' style={{ padding: '24px 20px 0', textAlign: 'center' }}>
              <div className='modern-map-wrap' style={{ maxWidth: 620, margin: '0 auto' }}>
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
                <div
                  style={{
                    width: '100%',
                    borderRadius: 12,
                    overflow: 'hidden',
                    marginBottom: 0,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.08)'
                  }}
                >
                  <iframe
                    className='modern-map-frame'
                    title='wedding-venue-map'
                    width='100%'
                    height='380'
                    style={{ border: 0, display: 'block' }}
                    loading='lazy'
                    allowFullScreen
                    referrerPolicy='no-referrer-when-downgrade'
                    src={mapUrl}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                width: '100%',
                height: 68,
                ...ribbonStyle,
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
                  color: textDark,
                  textTransform: 'uppercase'
                }}
              >
                Sổ Lưu Bút
              </p>
            </div>

            <div className='modern-section-floral' style={{ padding: '24px 20px 10px' }}>
              <form
                className='modern-rsvp-form'
                onSubmit={handleDemoRsvpSubmit}
                style={{
                  maxWidth: 620,
                  margin: '0 auto',
                  backgroundColor: '#5b1010',
                  borderRadius: 12,
                  padding: '16px 20px',
                  border: `1px solid ${textDark}33`,
                  boxShadow: '0 6px 14px rgba(0,0,0,0.12)'
                }}
              >
                <p
                  style={{
                    color: textDark,
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1rem',
                    marginBottom: 10,
                    letterSpacing: 1
                  }}
                >
                  RSVP
                </p>

                <div style={{ display: 'grid', gap: 10 }}>
                  <input
                    className='modern-rsvp-control'
                    type='text'
                    value={demoRsvpName}
                    onChange={(e) => setDemoRsvpName(e.target.value)}
                    placeholder='Tên khách mời'
                    style={{
                      width: '100%',
                      backgroundColor: '#721515',
                      color: textDark,
                      border: `1px solid ${textDark}55`,
                      borderRadius: 8,
                      padding: '10px 12px',
                      fontSize: '0.86rem'
                    }}
                  />

                  <div
                    className='modern-rsvp-grid'
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}
                  >
                    <select
                      className='modern-rsvp-control'
                      value={demoAttend}
                      onChange={(e) => setDemoAttend(e.target.value as 'yes' | 'no' | '')}
                      style={{
                        backgroundColor: '#721515',
                        color: textDark,
                        border: `1px solid ${textDark}55`,
                        borderRadius: 8,
                        padding: '10px 12px',
                        fontSize: '0.84rem'
                      }}
                    >
                      <option value=''>Chọn tham dự</option>
                      <option value='yes'>Sẽ tham dự</option>
                      <option value='no'>Không tham dự</option>
                    </select>

                    <select
                      className='modern-rsvp-control'
                      value={demoPartySize}
                      onChange={(e) => setDemoPartySize(Number(e.target.value))}
                      disabled={demoAttend !== 'yes'}
                      style={{
                        backgroundColor: demoAttend === 'yes' ? '#721515' : '#5b1010',
                        color: textDark,
                        border: `1px solid ${textDark}55`,
                        borderRadius: 8,
                        padding: '10px 12px',
                        fontSize: '0.84rem'
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} người
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    className='modern-rsvp-control'
                    value={demoRsvpMessage}
                    onChange={(e) => setDemoRsvpMessage(e.target.value)}
                    rows={3}
                    placeholder='Lời nhắn gửi cô dâu chú rể (tuỳ chọn)'
                    style={{
                      width: '100%',
                      resize: 'vertical',
                      backgroundColor: '#721515',
                      color: textDark,
                      border: `1px solid ${textDark}55`,
                      borderRadius: 8,
                      padding: '10px 12px',
                      fontSize: '0.85rem',
                      fontFamily: "'Lora', serif"
                    }}
                  />

                  <button
                    className='modern-rsvp-submit'
                    type='submit'
                    style={{
                      border: 'none',
                      borderRadius: 999,
                      background: `linear-gradient(180deg, ${textDark}, #d9b77f)`,
                      color: rose,
                      fontWeight: 700,
                      letterSpacing: 0.6,
                      padding: '10px 14px',
                      cursor: 'pointer'
                    }}
                  >
                    Gửi xác nhận
                  </button>
                </div>
              </form>
            </div>

            <div className='modern-section-floral' style={{ padding: '24px 20px' }}>
              <div
                className='modern-guestbook-scroll modern-guestbook-wrap'
                style={{
                  maxWidth: 620,
                  margin: '0 auto',
                  maxHeight: 450,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  ...panelPatternStyle
                }}
              >
                {displayedGuestWishes.map((comment, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: '#5b1010',
                      borderRadius: 12,
                      padding: '16px 20px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      borderLeft: `4px solid ${rose}`,
                      fontFamily: "'Playfair Display', serif"
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        marginBottom: 8
                      }}
                    >
                      <span style={{ fontWeight: 700, color: textDark, fontSize: '0.95rem' }}>
                        {comment.guest_name || 'Khách mời'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.95rem', color: textDark, lineHeight: 1.6, fontStyle: 'italic' }}>
                      {comment.wishes ? `"${comment.wishes}"` : 'Đã gửi phản hồi RSVP.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {hasGiftInfo && (
              <div
                className='modern-section-padding'
                style={{
                  padding: '30px 18px 44px',
                  textAlign: 'center',
                  backgroundColor: cream,
                  backgroundImage: `radial-gradient(circle at 12% 18%, ${textDark}1a 0, transparent 130px), radial-gradient(circle at 78% 20%, ${textDark}14 0, transparent 170px), radial-gradient(circle at 84% 75%, ${textDark}10 0, transparent 210px)`
                }}
              >
                <p
                  style={{
                    color: textDark,
                    fontSize: '1.9rem',
                    fontFamily: "'Playfair Display', serif",
                    marginBottom: 18,
                    letterSpacing: 1
                  }}
                >
                  Hộp Mừng Cưới
                </p>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div className='gift-card-wrap'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className='gift-card-ornament gift-card-ornament-left' src='/image/rong.webp' alt='' />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className='gift-card-ornament gift-card-ornament-right' src='/image/phung.webp' alt='' />
                    <div aria-hidden='true' className='gift-card-flower gift-card-flower-left' style={flowerMaskBase} />
                    <div
                      aria-hidden='true'
                      className='gift-card-flower gift-card-flower-right'
                      style={flowerMaskBase}
                    />

                    <button
                      onClick={() => setShowGiftQr(true)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        position: 'relative',
                        zIndex: 2
                      }}
                      aria-label='Mở hộp mừng cưới'
                    >
                      <div
                        className='gift-mini-card'
                        style={{
                          width: 210,
                          height: 144,
                          background: 'linear-gradient(150deg, #7e1717 0%, #a14343 100%)',
                          borderRadius: 14,
                          position: 'relative',
                          border: `1px solid ${textDark}44`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0 18px'
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            inset: 10,
                            borderRadius: 10,
                            border: `1px dashed ${textDark}66`,
                            pointerEvents: 'none'
                          }}
                        />

                        <div
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: '50%',
                            backgroundColor: `${textDark}20`,
                            border: `2px solid ${textDark}88`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: textDark,
                            fontSize: '1.7rem',
                            fontWeight: 700
                          }}
                        >
                          囍
                        </div>

                        <p
                          style={{
                            marginLeft: 12,
                            color: textDark,
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '0.95rem',
                            letterSpacing: 1.4,
                            textTransform: 'uppercase',
                            textAlign: 'left',
                            lineHeight: 1.35
                          }}
                        >
                          Mở Thiệp
                          <br />
                          Mừng Cưới
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                <p
                  style={{
                    marginTop: 16,
                    color: `${textDark}cc`,
                    fontSize: '0.95rem',
                    fontFamily: "'Lora', serif"
                  }}
                >
                  Nhấn vào tấm thiệp nhỏ để mở mã QR
                </p>
              </div>
            )}
          </div>
        </div>

        <div className='modern-side-panel' style={{ flex: 1, minHeight: '100vh', background: '#fff' }} />
      </div>

      <MusicPlayer musicUrl={musicUrl} forceHide={showSplash} />

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
              top: 48,
              right: 20,
              background: 'transparent',
              border: 'none',
              color: textDark,
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
              color: textDark,
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
              color: textDark,
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
            alt='Ảnh phóng to'
            style={{
              maxWidth: '90%',
              maxHeight: '80vh',
              objectFit: 'contain',
              borderRadius: 8
            }}
          />

          <div style={{ color: textDark, marginTop: 16, fontSize: '0.9rem', letterSpacing: 2 }}>
            {lightboxIndex + 1} / {albumImages.length}
          </div>
        </div>
      )}

      {showGiftQr && hasGiftInfo && (
        <div
          onClick={() => setShowGiftQr(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.74)',
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 420,
              backgroundColor: '#5b1010',
              borderRadius: 18,
              border: `1px solid ${textDark}44`,
              boxShadow: '0 24px 60px rgba(0,0,0,0.42)',
              padding: '22px 20px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <p
                style={{
                  color: textDark,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1rem',
                  letterSpacing: 1.4,
                  textTransform: 'uppercase',
                  fontWeight: 700
                }}
              >
                QR Mừng Cưới
              </p>
              <button
                onClick={() => setShowGiftQr(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: textDark,
                  fontSize: '1.6rem',
                  cursor: 'pointer',
                  lineHeight: 1
                }}
              >
                &times;
              </button>
            </div>

            {displayQrUrl && (
              <div
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 14,
                  padding: 12,
                  marginBottom: 14,
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayQrUrl}
                  alt='QR mừng cưới'
                  style={{ width: '100%', maxWidth: 260, aspectRatio: '1 / 1', objectFit: 'contain' }}
                />
              </div>
            )}

            <div style={{ display: 'grid', gap: 8, color: textDark }}>
              {bankName && (
                <p style={{ fontSize: '0.82rem' }}>
                  Ngân hàng: <strong>{bankName}</strong>
                </p>
              )}
              {accountName && (
                <p style={{ fontSize: '0.82rem' }}>
                  Chủ tài khoản: <strong>{accountName}</strong>
                </p>
              )}
              {accountNumber && (
                <p style={{ fontSize: '0.82rem' }}>
                  Số tài khoản: <strong>{accountNumber}</strong>
                </p>
              )}
              <p style={{ fontSize: '0.78rem', color: `${textDark}cc`, marginTop: 4 }}>
                Nội dung chuyển khoản: {transferNote}
              </p>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div
          style={{
            position: 'fixed',
            top: 18,
            right: 18,
            zIndex: 10001,
            maxWidth: 460,
            background: `linear-gradient(145deg, ${rose}f2 0%, #7a1a1af2 100%)`,
            color: textDark,
            border: `1px solid ${textDark}55`,
            borderRadius: 12,
            padding: '12px 14px',
            boxShadow: '0 14px 34px rgba(0,0,0,0.35)',
            backdropFilter: 'blur(4px)',
            fontFamily: sectionFontFamily,
            fontSize: '0.88rem',
            lineHeight: 1.45,
            letterSpacing: 0.15,
            cursor: 'pointer'
          }}
          onClick={() => setShowToast(false)}
          role='status'
          aria-live='polite'
        >
          {toastMessage}
        </div>
      )}
    </>
  )
}
