import RSVPForm from '@/components/guest/RSVPForm'
import MusicPlayer from '@/components/MusicPlayer'
import { createClient } from '@supabase/supabase-js'
import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import { getImageStyle, resolveImageAdjust } from '../../lib/imageUtils'
import { useMapEmbed } from '../../lib/useMapEmbed'
import { useTemplateViewport } from '../../lib/TemplateViewportContext'
import { TemplateProps } from '../TemplateRegistry'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const peachDecorUrl = new URL('./anh_dao_1.png', import.meta.url).toString()
const hoaDao1Url = new URL('./hoa_dao_1.png', import.meta.url).toString()

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
    guest_name: 'Quốc Dũng',
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

export default function VintageGuestView({ wedding, disableSplash, musicUrl, guestName = '', rsvpId }: TemplateProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [showGiftQr, setShowGiftQr] = useState(false)
  const [showSplash, setShowSplash] = useState(!disableSplash)
  const [splashFading, setSplashFading] = useState(false)
  const [guestWishes, setGuestWishes] = useState<any[]>([])

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
      console.log('[ThemeVintage][Guestbook] Skip RSVP fetch for non-UUID wedding id', { weddingId })
      setGuestWishes([])
      return
    }

    console.log('[ThemeVintage][Guestbook] Fetch RSVP start', { weddingId })

    supabase
      .from('rsvps')
      .select('guest_name, wishes, created_at, is_attending, party_size, phone')
      .eq('wedding_id', weddingId)
      .order('created_at', { ascending: false })
      .then(
        ({ data, error }) => {
          console.log('[ThemeVintage][Guestbook] Fetch RSVP result', {
            weddingId,
            count: data?.length || 0,
            data,
            error
          })

          if (error) {
            console.error('[ThemeVintage][Guestbook] Fetch RSVP error', error)
            return
          }

          if (data) setGuestWishes(data)
        },
        (err: unknown) => {
          console.error('[ThemeVintage][Guestbook] Unexpected fetch exception', err)
        }
      )
  }, [wedding?.id])

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

  const red = mergedContent.primary_color || '#9a2c35'
  const cream = '#f7ecee'
  const creamLight = '#f2e3e5'
  const textDark = mergedContent.primary_color || '#9a2c35'
  const fontFamily = mergedContent.font_family || "'Lora', serif"
  const headingFontFamily = mergedContent.heading_font_family || "'Great Vibes', cursive"
  const sectionFontFamily = mergedContent.section_font_family || "'Playfair Display', serif"

  const displayedGuestWishes = guestWishes.length > 0 ? guestWishes : mockGuestbook

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

  const redPatternStyle = {
    backgroundColor: cream
  }

  const creamPatternStyle = {
    backgroundColor: creamLight,
    backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, ${creamLight} 10px), repeating-linear-gradient(rgba(200,100,100,0.03), rgba(200,100,100,0.03))`
  }

  if (!wedding) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: cream,
          fontFamily: sectionFontFamily
        }}
      >
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>💔</div>
          <h1 style={{ color: red, marginBottom: 8 }}>Không tìm thấy thông tin</h1>
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
            border-color: ${red};
            box-shadow: 0 0 0 2px ${red}30;
          }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes sealPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(214,131,138,0.45); } 70% { box-shadow: 0 0 0 14px rgba(214,131,138,0); } }
          @keyframes splashCardShakeFast {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-1px) rotate(-0.85deg); }
            50% { transform: translateY(0) rotate(0.55deg); }
            75% { transform: translateY(-1px) rotate(-0.65deg); }
          }
          @keyframes splashCardPinkPulse {
            0%, 100% {
              box-shadow: 0 14px 30px rgba(198,106,115,0.28), 0 0 0 rgba(214,131,138,0), 0 0 0 rgba(214,131,138,0);
            }
            50% {
              box-shadow: 0 20px 44px rgba(198,106,115,0.36), 0 0 30px rgba(214,131,138,0.42), 0 0 58px rgba(214,131,138,0.24);
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
            animation: splashCardPinkPulse 2s ease-in-out 1s infinite;
            filter: drop-shadow(0 10px 22px rgba(214,131,138,0.34));
          }
          .btn-open { animation: sealPulse 2.2s ease-out infinite; }
          .btn-calendar:hover { opacity: 0.9; transform: scale(1.02); }
          @keyframes petalFall {
            0% { transform: translateY(-40px) rotate(0deg) scale(1); opacity: 0; }
            5% { opacity: 1; }
            85% { opacity: 0.8; }
            100% { transform: translateY(110vh) rotate(720deg) scale(0.6); opacity: 0; }
          }
          @keyframes petalSway {
            0%, 100% { margin-left: 0px; }
            25% { margin-left: 18px; }
            75% { margin-left: -14px; }
          }
          .petal {
            position: absolute;
            top: -40px;
            border-radius: 150% 0 150% 0;
            background: radial-gradient(ellipse at 30% 30%, #ffb8cc, #e8748a);
            opacity: 0;
            pointer-events: none;
            animation: petalFall linear infinite, petalSway ease-in-out infinite;
            box-shadow: inset 0 0 4px rgba(255,255,255,0.4);
          }
          .vintage-splash-decor-wrap {
            position: absolute;
            inset: 0;
            pointer-events: none;
            overflow: hidden;
          }
          @keyframes splashDaoSwayLeft {
            0%, 100% { transform: translateY(-54%) rotate(0deg); }
            30% { transform: translateY(-54%) rotate(-2.5deg); }
            70% { transform: translateY(-54%) rotate(1.8deg); }
          }
          @keyframes splashDaoSwayRight {
            0%, 100% { transform: translateY(-54%) scaleX(-1) rotate(0deg); }
            30% { transform: translateY(-54%) scaleX(-1) rotate(-2.5deg); }
            70% { transform: translateY(-54%) scaleX(-1) rotate(1.8deg); }
          }
          .vintage-splash-dao {
            position: absolute;
            top: 50%;
            width: clamp(270px, 33vw, 460px);
            height: auto;
            opacity: 0.92;
            filter: saturate(1.12) contrast(1.06) drop-shadow(0 10px 20px rgba(0,0,0,0.24));
            transform-origin: bottom center;
          }
          .vintage-splash-dao-left {
            left: max(0px, calc(50% - 680px));
            animation: splashDaoSwayLeft 5s ease-in-out infinite;
          }
          .vintage-splash-dao-right {
            right: max(0px, calc(50% - 680px));
            animation: splashDaoSwayRight 5.8s ease-in-out 0.6s infinite;
          }
          .vintage-splash-hy-wrap {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 18px;
          }
          .vintage-splash-hy-symbol {
            font-size: 2.4rem;
            color: ${red};
            letter-spacing: 8px;
            line-height: 1;
          }
          .vintage-splash-hy-ornament {
            display: none;
            position: absolute;
            top: 50%;
            width: 62px;
            height: auto;
            opacity: 0.84;
            filter: saturate(1.1) contrast(1.04) drop-shadow(0 4px 10px rgba(0,0,0,0.26));
            pointer-events: none;
          }
          .vintage-splash-hy-ornament-left {
            left: 50%;
            transform: translate(-124px, -50%);
          }
          .vintage-splash-hy-ornament-right {
            left: 50%;
            transform: translate(62px, -50%) scaleX(-1);
          }
          .vintage-ornament {
            position: absolute;
            width: auto;
            pointer-events: none;
          }
          .vintage-ornament-left {
            left: 1%;
            top: -132px;
            height: clamp(180px, 26vw, 290px);
            opacity: 0.88;
            z-index: 1;
            transform-origin: bottom center;
            animation: ornamentSwayLeft 5s ease-in-out infinite;
          }
          .vintage-ornament-right {
            right: 1%;
            top: -132px;
            height: clamp(180px, 26vw, 290px);
            opacity: 0.88;
            z-index: 1;
            transform-origin: bottom center;
            animation: ornamentSwayRight 5.8s ease-in-out 0.7s infinite;
          }
          @keyframes ornamentSwayLeft {
            0%, 100% { transform: rotate(0deg); }
            30% { transform: rotate(-3deg); }
            70% { transform: rotate(2deg); }
          }
          @keyframes ornamentSwayRight {
            0%, 100% { transform: rotate(0deg) scaleX(-1); }
            30% { transform: rotate(3deg) scaleX(-1); }
            70% { transform: rotate(-2deg) scaleX(-1); }
          }
          @keyframes avatarSway {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-2.5deg); }
            75% { transform: rotate(2deg); }
          }
          .vintage-avatar {
            transform-origin: bottom center;
            animation: avatarSway 5.5s ease-in-out infinite;
          }
          .card-petal-wrap {
            position: absolute;
            inset: 0;
            pointer-events: none;
            overflow: hidden;
            z-index: 10;
          }
          .vintage-guestbook-scroll {
            scrollbar-width: thin;
            scrollbar-color: #bb7a82 #f1e3e6;
          }
          .vintage-guestbook-scroll::-webkit-scrollbar { width: 10px; }
          .vintage-guestbook-scroll::-webkit-scrollbar-track {
            background: #f1e3e6;
            border-radius: 999px;
          }
          .vintage-guestbook-scroll::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #cf9aa1, #bb7a82);
            border-radius: 999px;
            border: 1px solid #ffffff66;
          }
          @keyframes vuquyBadgeSway {
            0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
            25% { transform: translate(-50%, calc(-50% - 1px)) rotate(-0.85deg); }
            50% { transform: translate(-50%, -50%) rotate(0.55deg); }
            75% { transform: translate(-50%, calc(-50% - 1px)) rotate(-0.65deg); }
          }
          @keyframes vuquyBadgeGlow {
            0%, 100% { box-shadow: 0 12px 24px rgba(0,0,0,0.18), 0 0 0 rgba(214,131,138,0); }
            50% { box-shadow: 0 14px 30px rgba(0,0,0,0.24), 0 0 18px rgba(214,131,138,0.33); }
          }
          .vintage-vuquy-badge {
            animation: vuquyBadgeSway 1.25s ease-in-out 1s infinite, vuquyBadgeGlow 2s ease-in-out 1s infinite;
          }
          .gift-mini-card {
            animation: splashCardShakeFast 1.25s ease-in-out 1s infinite, splashCardPinkPulse 2s ease-in-out 1s infinite;
            transform-origin: center 85%;
            transition: transform .24s ease;
            filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));
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
          @keyframes giftOrnamentSwayLeft {
            0%, 100% { transform: translateY(-55%) rotate(-4deg); }
            30% { transform: translateY(-55%) rotate(-7deg); }
            70% { transform: translateY(-55%) rotate(-2deg); }
          }
          @keyframes giftOrnamentSwayRight {
            0%, 100% { transform: translateY(-55%) rotate(4deg) scaleX(-1); }
            30% { transform: translateY(-55%) rotate(7deg) scaleX(-1); }
            70% { transform: translateY(-55%) rotate(2deg) scaleX(-1); }
          }
          .gift-card-ornament {
            position: absolute;
            top: 50%;
            width: clamp(188px, 24vw, 320px);
            height: auto;
            transform: translateY(-55%);
            opacity: 0.98;
            pointer-events: none;
            filter: saturate(1.18) contrast(1.08) brightness(0.98) drop-shadow(0 10px 18px rgba(0,0,0,0.26));
            z-index: 1;
          }
          .gift-card-ornament-left {
            left: -278px;
            transform: translateY(-55%) rotate(-4deg);
            animation: giftOrnamentSwayLeft 4.8s ease-in-out infinite;
            transform-origin: bottom center;
          }
          .gift-card-ornament-right {
            right: -278px;
            transform: translateY(-55%) rotate(4deg) scaleX(-1);
            animation: giftOrnamentSwayRight 5.2s ease-in-out 0.35s infinite;
            transform-origin: bottom center;
          }
          @keyframes splashBannerPetalFall {
            0% { transform: translateY(-12px) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            85% { opacity: 0.92; }
            100% { transform: translateY(82px) rotate(360deg); opacity: 0; }
          }
          @keyframes splashBannerPetalSway {
            0%, 100% { margin-left: 0; }
            50% { margin-left: 8px; }
          }
          .splash-banner-petal {
            position: absolute;
            top: -12px;
            border-radius: 150% 0 150% 0;
            background: radial-gradient(ellipse at 30% 30%, #ffd5e0, #ee96ab);
            pointer-events: none;
            opacity: 0;
            animation: splashBannerPetalFall linear infinite, splashBannerPetalSway ease-in-out infinite;
            box-shadow: inset 0 0 3px rgba(255,255,255,0.44);
          }

          @media (max-width: 768px) {
            .vintage-side-panel { display: none !important; }
            .vintage-card { width: 100% !important; max-width: 100% !important; }
            .vintage-card { overflow-x: hidden !important; }
            .vintage-avatar { width: 120px !important; height: 120px !important; }
            .vintage-couple-name { font-size: 1.8rem !important; }
            .vintage-couple-name-lg { font-size: 2rem !important; }
            .vintage-section-padding { padding-left: 16px !important; padding-right: 16px !important; }
            .vintage-parents-flex { flex-direction: column !important; gap: 20px !important; }
            .vintage-parents-flex > div { padding: 0 !important; width: 100% !important; }
            .vintage-parents-divider { display: none !important; }
            .vintage-date-flex { gap: 8px !important; }
            .vintage-date-day { font-size: 2rem !important; }
            .vintage-album-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .vintage-splash-decor-wrap { display: none !important; }
            .vintage-splash-hy-wrap { margin-bottom: 28px; }
            .vintage-splash-hy-symbol { font-size: 2.32rem; letter-spacing: 5px; }
            .vintage-splash-hy-ornament { display: block; width: 68px; }
            .vintage-splash-hy-ornament-left { transform: translate(-132px, -50%); }
            .vintage-splash-hy-ornament-right { transform: translate(64px, -50%) scaleX(-1); }
            .vintage-ornament {
              display: block !important;
              top: -72px !important;
              height: clamp(122px, 31vw, 162px) !important;
              opacity: 1 !important;
              z-index: 2 !important;
            }
            .vintage-ornament-left { left: 3% !important; right: auto !important; }
            .vintage-ornament-right { right: 3% !important; left: auto !important; }
            .gift-card-ornament {
              width: clamp(112px, 28vw, 158px);
              opacity: 0.96;
              z-index: 3;
              display: block;
            }
            .gift-card-ornament-left { left: -118px; }
            .gift-card-ornament-right { right: -118px; }
            .gift-mini-card {
              width: 196px !important;
              height: 136px !important;
            }
            .vintage-date-flex {
              flex-wrap: wrap !important;
              justify-content: center !important;
              row-gap: 6px !important;
            }
            .vintage-date-divider { height: 22px !important; }
            .vintage-date-label {
              font-size: 0.76rem !important;
              letter-spacing: 1.2px !important;
            }
            .vintage-map-wrap,
            .vintage-guestbook-wrap {
              max-width: 540px !important;
            }
            .vintage-map-frame {
              height: 340px !important;
            }
            .vintage-guestbook-wrap {
              max-height: 410px !important;
            }
          }
          @media (max-width: 420px) {
            .vintage-splash-hy-wrap { margin-bottom: 24px; }
            .vintage-splash-hy-symbol { font-size: 2.14rem; letter-spacing: 4px; }
            .vintage-splash-hy-ornament { width: 62px; opacity: 1; }
            .vintage-splash-hy-ornament-left { transform: translate(-114px, -50%); }
            .vintage-splash-hy-ornament-right { transform: translate(56px, -50%) scaleX(-1); }
            .vintage-ornament {
              top: -68px !important;
              height: clamp(106px, 30vw, 132px) !important;
              opacity: 1 !important;
            }
            .vintage-ornament-left { left: 2% !important; }
            .vintage-ornament-right { right: 2% !important; }
            .gift-card-ornament {
              width: clamp(98px, 30vw, 132px);
              opacity: 0.94;
              z-index: 3;
              display: block;
            }
            .gift-card-ornament-left { left: -92px; }
            .gift-card-ornament-right { right: -92px; }
            .gift-mini-card {
              width: 184px !important;
              height: 128px !important;
            }
            .vintage-date-flex {
              flex-direction: column !important;
              gap: 6px !important;
            }
            .vintage-date-divider { display: none !important; }
            .vintage-date-label { letter-spacing: 1px !important; }
            .vintage-map-wrap,
            .vintage-guestbook-wrap {
              max-width: 320px !important;
            }
            .vintage-map-frame {
              height: 300px !important;
            }
            .vintage-guestbook-wrap {
              max-height: 360px !important;
            }
          }

          .vintage-container {
            container-type: inline-size;
          }

          @container (max-width: 896px) {
            .vintage-side-panel { display: none !important; }
            .vintage-card { width: 100% !important; max-width: 100% !important; border: none !important; border-radius: 0 !important; }
            .vintage-avatar { width: 120px !important; height: 120px !important; }
            .vintage-ornament {
              display: block !important;
              top: -96px !important;
              height: clamp(96px, 24vw, 124px) !important;
              opacity: 0.76 !important;
              z-index: 2 !important;
            }
            .vintage-ornament-left { left: 3% !important; right: auto !important; }
            .vintage-ornament-right { right: 3% !important; left: auto !important; }
            .vintage-vuquy-badge {
              top: 58px !important;
              min-width: 238px !important;
              padding: 10px 22px 8px !important;
            }
            .vintage-vuquy-title {
              font-size: 1.55rem !important;
              letter-spacing: 2px !important;
            }
            .vintage-parents-flex {
              flex-direction: column !important;
              gap: 20px !important;
              align-items: center !important;
              text-align: center !important;
            }
            .vintage-parents-col {
              padding: 0 !important;
              width: 100% !important;
              max-width: 320px;
              margin: 0 auto;
              text-align: center;
            }
            .vintage-parents-divider { display: none !important; }
            .vintage-album-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .vintage-section-padding { padding-left: 16px !important; padding-right: 16px !important; }
            .vintage-splash-decor-wrap { display: none !important; }
            .vintage-splash-hy-wrap { margin-bottom: 28px; }
            .vintage-splash-hy-symbol { font-size: 2.32rem; letter-spacing: 5px; }
            .vintage-splash-hy-ornament { display: block; width: 68px; }
            .vintage-splash-hy-ornament-left { transform: translate(-132px, -50%); }
            .vintage-splash-hy-ornament-right { transform: translate(64px, -50%) scaleX(-1); }
          }

          @container (max-width: 440px) {
            .vintage-ornament {
              top: -68px !important;
              height: clamp(106px, 30vw, 132px) !important;
              opacity: 0.68 !important;
            }
            .vintage-ornament-left { left: 2% !important; }
            .vintage-ornament-right { right: 2% !important; }
            .vintage-vuquy-badge {
              top: 75px !important;
              min-width: 218px !important;
              padding: 9px 18px 8px !important;
            }
            .vintage-vuquy-title {
              font-size: 1.34rem !important;
              letter-spacing: 1.5px !important;
            }
            .vintage-map-wrap,
            .vintage-guestbook-wrap {
              max-width: 320px !important;
            }
            .vintage-map-frame {
              height: 300px !important;
            }
            .vintage-guestbook-wrap {
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
            backgroundColor: '#f8ecef',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            opacity: splashFading ? 0 : 1,
            transition: 'opacity 0.6s ease',
            fontFamily: fontFamily,
            padding: 20,
            overflow: 'hidden'
          }}
        >
          <div aria-hidden='true' className='vintage-splash-decor-wrap'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className='vintage-splash-dao vintage-splash-dao-left' src={peachDecorUrl} alt='' />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className='vintage-splash-dao vintage-splash-dao-right' src={peachDecorUrl} alt='' />
            {[
              { left: '2%', size: 10, dur: 6.2, delay: 0 },
              { left: '7%', size: 8, dur: 7.1, delay: 1.2 },
              { left: '12%', size: 12, dur: 5.8, delay: 0.5 },
              { left: '17%', size: 7, dur: 8.0, delay: 2.1 },
              { left: '22%', size: 9, dur: 6.5, delay: 0.8 },
              { left: '27%', size: 11, dur: 7.4, delay: 1.6 },
              { left: '32%', size: 8, dur: 5.5, delay: 3.0 },
              { left: '37%', size: 13, dur: 6.8, delay: 0.3 },
              { left: '42%', size: 7, dur: 7.9, delay: 1.9 },
              { left: '47%', size: 10, dur: 6.1, delay: 0.7 },
              { left: '52%', size: 9, dur: 8.3, delay: 2.5 },
              { left: '57%', size: 11, dur: 5.9, delay: 1.1 },
              { left: '62%', size: 8, dur: 7.2, delay: 0.4 },
              { left: '67%', size: 12, dur: 6.6, delay: 3.5 },
              { left: '72%', size: 7, dur: 8.1, delay: 2.8 },
              { left: '77%', size: 10, dur: 5.7, delay: 1.4 },
              { left: '82%', size: 8, dur: 7.6, delay: 0.9 },
              { left: '87%', size: 11, dur: 6.3, delay: 4.1 },
              { left: '92%', size: 9, dur: 7.8, delay: 2.3 },
              { left: '97%', size: 13, dur: 6.0, delay: 3.2 }
            ].map((p, i) => (
              <div
                key={i}
                className='petal'
                style={{
                  left: p.left,
                  width: p.size,
                  height: p.size * 0.7,
                  animationDuration: `${p.dur}s, ${p.dur * 0.6}s`,
                  animationDelay: `${p.delay}s, ${p.delay}s`
                }}
              />
            ))}
          </div>

          <div className='splash-card-motion'>
            <div className='splash-card splash-card-glow' style={{ textAlign: 'center', position: 'relative' }}>
              <div
                style={{
                  backgroundColor: '#d6838a',
                  height: 90,
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                {[
                  { left: '8%', size: 7, dur: 2.9, delay: 0.15 },
                  { left: '21%', size: 6, dur: 3.2, delay: 1.1 },
                  { left: '37%', size: 8, dur: 2.8, delay: 0.55 },
                  { left: '53%', size: 7, dur: 3.1, delay: 1.45 },
                  { left: '68%', size: 6, dur: 2.7, delay: 0.85 },
                  { left: '84%', size: 8, dur: 3.3, delay: 1.95 }
                ].map((p, i) => (
                  <div
                    key={`splash-banner-petal-${i}`}
                    className='splash-banner-petal'
                    style={{
                      left: p.left,
                      width: p.size,
                      height: p.size * 0.7,
                      animationDuration: `${p.dur}s, ${p.dur * 0.65}s`,
                      animationDelay: `${p.delay}s, ${p.delay}s`
                    }}
                  />
                ))}
                <p
                  style={{
                    fontFamily: sectionFontFamily,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: 5,
                    color: 'rgba(255,255,255,0.9)',
                    textTransform: 'uppercase'
                  }}
                >
                  Thiệp Cưới
                </p>
                <div style={{ width: 168, height: 1, marginTop: 4, backgroundColor: 'rgba(255,255,255,0.9)' }} />
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.78)',
                  border: `1px solid ${red}25`,
                  borderTop: 'none',
                  borderBottom: 'none',
                  padding: '40px 32px 32px'
                }}
              >
                <div className='vintage-splash-hy-wrap'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className='vintage-splash-hy-ornament vintage-splash-hy-ornament-left'
                    src={peachDecorUrl}
                    alt=''
                  />
                  <p className='vintage-splash-hy-symbol'>囍</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className='vintage-splash-hy-ornament vintage-splash-hy-ornament-right'
                    src={peachDecorUrl}
                    alt=''
                  />
                </div>

                <p
                  style={{
                    fontFamily: sectionFontFamily,
                    fontSize: '0.6rem',
                    letterSpacing: '0.45em',
                    color: red,
                    textTransform: 'uppercase',
                    fontWeight: 600,
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
                  <div style={{ flex: 1, height: 1, backgroundColor: `${red}35` }} />
                  <span style={{ color: red, fontSize: '0.55rem', letterSpacing: 6 }}>✦ ✦ ✦</span>
                  <div style={{ flex: 1, height: 1, backgroundColor: `${red}35` }} />
                </div>

                <p style={{ fontSize: '0.84rem', color: textDark, fontStyle: 'italic', marginBottom: 16 }}>
                  Lễ thành hôn của
                </p>

                <h3
                  style={{
                    fontFamily: headingFontFamily,
                    fontSize: '3rem',
                    color: red,
                    fontWeight: 400,
                    lineHeight: 1.1
                  }}
                >
                  {groomName}
                </h3>
                <p style={{ fontFamily: headingFontFamily, fontSize: '2rem', color: textDark, lineHeight: 1 }}>&amp;</p>
                <h3
                  style={{
                    fontFamily: headingFontFamily,
                    fontSize: '3rem',
                    color: red,
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
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: textDark, letterSpacing: 2 }}>
                    {dayName}
                  </span>
                  <div style={{ width: 1, height: 18, backgroundColor: '#c8b6a6' }} />
                  <span
                    style={{
                      fontFamily: sectionFontFamily,
                      fontSize: '1.8rem',
                      fontWeight: 700,
                      color: red,
                      lineHeight: 1
                    }}
                  >
                    {day}
                  </span>
                  <div style={{ width: 1, height: 18, backgroundColor: '#c8b6a6' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: textDark, letterSpacing: 2 }}>
                    THÁNG {month}
                  </span>
                  <div style={{ width: 1, height: 18, backgroundColor: '#c8b6a6' }} />
                  <span
                    style={{ fontFamily: sectionFontFamily, fontSize: '1.08rem', fontWeight: 700, color: textDark }}
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
                    backgroundColor: '#d6838a',
                    color: '#fff',
                    border: 'none',
                    padding: '13px 44px',
                    borderRadius: 2,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    fontFamily: sectionFontFamily
                  }}
                >
                  Mở Thiệp
                </button>
              </div>

              <div style={{ height: 8, backgroundColor: '#d6838a' }} />
            </div>
          </div>
        </div>
      )}

      <div
        className='vintage-container'
        style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'stretch' }}
      >
        <div className='vintage-side-panel' style={{ flex: 1, minHeight: '100vh', background: '#fff' }} />

        <div
          className='vintage-card'
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
            position: 'relative'
          }}
        >
          <div className='card-petal-wrap'>
            {[
              { left: '3%', size: 9, dur: 7.2, delay: 0 },
              { left: '10%', size: 7, dur: 6.5, delay: 1.4 },
              { left: '18%', size: 11, dur: 8.1, delay: 0.6 },
              { left: '26%', size: 8, dur: 6.9, delay: 2.3 },
              { left: '34%', size: 10, dur: 7.6, delay: 0.9 },
              { left: '42%', size: 7, dur: 5.8, delay: 3.1 },
              { left: '50%', size: 12, dur: 7.3, delay: 1.7 },
              { left: '58%', size: 8, dur: 8.4, delay: 0.3 },
              { left: '66%', size: 10, dur: 6.7, delay: 2.8 },
              { left: '74%', size: 7, dur: 7.9, delay: 1.1 },
              { left: '82%', size: 11, dur: 6.2, delay: 3.6 },
              { left: '90%', size: 9, dur: 8.0, delay: 0.5 }
            ].map((p, i) => (
              <div
                key={i}
                className='petal'
                style={{
                  left: p.left,
                  width: p.size,
                  height: p.size * 0.7,
                  animationDuration: `${p.dur}s, ${p.dur * 0.6}s`,
                  animationDelay: `${p.delay}s, ${p.delay}s`
                }}
              />
            ))}
          </div>

          <div style={{ width: '100%', height: 128, ...redPatternStyle }} />

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
                className='vintage-ornament vintage-ornament-left'
                src={hoaDao1Url}
                alt='Trang tri hoa dao ben trai'
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className='vintage-ornament vintage-ornament-right'
                src={hoaDao1Url}
                alt='Trang tri hoa dao ben phai'
                style={{ transform: 'scaleX(-1)' }}
              />

              <div style={{ textAlign: 'center', width: '40%', position: 'relative', zIndex: 3, marginTop: 150 }}>
                <div
                  className='vintage-avatar'
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
                    color: red,
                    fontWeight: 400,
                    marginBottom: 10
                  }}
                >
                  {groomName}
                </h3>
                <div style={{ width: '60%', height: 1, backgroundColor: `${red}55`, margin: '0 auto' }} />
              </div>

              <div
                className='vintage-vuquy-badge'
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '48px',
                  transform: 'translate(-50%, -50%)',
                  minWidth: 260,
                  padding: '12px 28px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  borderRadius: 999,
                  background: `linear-gradient(145deg, ${red}cc 0%, #7b1f2ae6 100%)`,
                  border: '1px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.18)',
                  zIndex: 5
                }}
              >
                <div
                  className='vintage-vuquy-title'
                  style={{
                    fontFamily: sectionFontFamily,
                    fontSize: '1.7rem',
                    color: '#fff',
                    lineHeight: 1,
                    fontWeight: 700,
                    letterSpacing: 2.6,
                    textTransform: 'uppercase',
                    textShadow: '0 1px 0 rgba(0,0,0,0.15)'
                  }}
                >
                  Lễ Vu Quy
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ width: 28, height: 1, backgroundColor: 'rgba(255,255,255,0.7)' }} />
                  <span style={{ fontSize: '1.1rem', color: '#fff', lineHeight: 1 }}>囍</span>
                  <span style={{ width: 28, height: 1, backgroundColor: 'rgba(255,255,255,0.7)' }} />
                </div>
              </div>

              <div style={{ textAlign: 'center', width: '40%', position: 'relative', zIndex: 3, marginTop: 150 }}>
                <div
                  className='vintage-avatar'
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
                    color: red,
                    fontWeight: 400,
                    marginBottom: 10
                  }}
                >
                  {brideName}
                </h3>
                <div style={{ width: '60%', height: 1, backgroundColor: `${red}55`, margin: '0 auto' }} />
              </div>
            </div>
          </div>

          <div style={{ width: '100%', padding: '16px 0 4px', textAlign: 'center' }}>
            <p
              style={{
                fontFamily: sectionFontFamily,
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: 4,
                color: red,
                textTransform: 'uppercase'
              }}
            >
              Thông Tin Lễ Cưới
            </p>
          </div>

          <div
            className='vintage-parents-flex vintage-section-padding'
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '28px 32px 28px',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <div className='vintage-parents-col' style={{ flex: 1, padding: '0 16px 0 0' }}>
              <p style={{ fontSize: '0.75rem', color: textDark, marginBottom: 6 }}>Ông bà</p>
              <div
                style={{
                  fontFamily: sectionFontFamily,
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

            <div
              className='vintage-parents-divider'
              style={{ width: 1, alignSelf: 'stretch', backgroundColor: '#c8b6a6', flexShrink: 0 }}
            />

            <div className='vintage-parents-col' style={{ flex: 1, padding: '0 0 0 16px' }}>
              <p style={{ fontSize: '0.75rem', color: textDark, marginBottom: 6 }}>Ông bà</p>
              <div
                style={{
                  fontFamily: sectionFontFamily,
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

          <div className='vintage-section-padding' style={{ textAlign: 'center', padding: '16px 32px 32px' }}>
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
                fontFamily: sectionFontFamily,
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
              {brideRole}
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

            <div
              className='vintage-date-flex'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 12 }}
            >
              <span
                className='vintage-date-label'
                style={{ fontSize: '0.8rem', fontWeight: 700, color: textDark, letterSpacing: 2 }}
              >
                {dayName}
              </span>
              <div className='vintage-date-divider' style={{ width: 1, height: 28, backgroundColor: '#c8b6a6' }} />
              <span
                className='vintage-date-day'
                style={{
                  fontSize: '2.8rem',
                  fontWeight: 700,
                  color: textDark,
                  fontFamily: sectionFontFamily,
                  lineHeight: 1
                }}
              >
                {day}
              </span>
              <div className='vintage-date-divider' style={{ width: 1, height: 28, backgroundColor: '#c8b6a6' }} />
              <span
                className='vintage-date-label'
                style={{ fontSize: '0.8rem', fontWeight: 700, color: textDark, letterSpacing: 2 }}
              >
                THÁNG {month}
              </span>
            </div>

            <p
              style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: textDark,
                fontFamily: sectionFontFamily,
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

          <div style={{ width: '100%', padding: '16px 0 4px', textAlign: 'center' }}>
            <p
              style={{
                fontFamily: sectionFontFamily,
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: 4,
                color: red,
                textTransform: 'uppercase'
              }}
            >
              Album Ảnh Cưới
            </p>
          </div>

          <div style={{ padding: '24px 20px 10px', marginBottom: 40 }}>
            <div
              className='vintage-album-grid'
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
                      border: `1px solid ${red}66`,
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

          <div style={{ width: '100%', padding: '16px 0 4px', textAlign: 'center' }}>
            <p
              style={{
                fontFamily: sectionFontFamily,
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: 4,
                color: red,
                textTransform: 'uppercase'
              }}
            >
              Thông Tin Tiệc Cưới
            </p>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: headingFontFamily,
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
                fontFamily: sectionFontFamily,
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
                  fontFamily: sectionFontFamily,
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
                fontFamily: sectionFontFamily,
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
                fontFamily: sectionFontFamily,
                marginBottom: 20
              }}
            >
              {partyTime}
            </p>

            <button
              className='btn-calendar'
              style={{
                backgroundColor: red,
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

          <div style={{ width: '100%', padding: '16px 0 4px', textAlign: 'center' }}>
            <p
              style={{
                fontFamily: sectionFontFamily,
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: 4,
                color: red,
                textTransform: 'uppercase'
              }}
            >
              Tiệc Cưới Sẽ Tổ Chức Tại
            </p>
          </div>

          <div style={{ padding: '24px 20px 0', textAlign: 'center' }}>
            <div className='vintage-map-wrap' style={{ maxWidth: 620, margin: '0 auto' }}>
              <p style={{ fontSize: '0.85rem', color: textDark, fontWeight: 500, lineHeight: 1.6, marginBottom: 16 }}>
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
                  className='vintage-map-frame'
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

          <div style={{ width: '100%', padding: '16px 0 4px', textAlign: 'center', marginTop: 0 }}>
            <p
              style={{
                fontFamily: sectionFontFamily,
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: 4,
                color: red,
                textTransform: 'uppercase'
              }}
            >
              Sổ Lưu Bút
            </p>
          </div>

          <div style={{ padding: '24px 20px 40px' }}>
            <div style={{ maxWidth: 620, margin: '0 auto' }}>
              <RSVPForm
                weddingId={wedding?.id}
                rsvpId={rsvpId}
                guestName={guestName}
                primaryColor={red}
                fontFamily={fontFamily}
                sectionFontFamily={sectionFontFamily}
                isDark={false}
                cardBackground='#eed7db'
              />
            </div>
          </div>

          <div style={{ padding: '24px 20px' }}>
            <div
              className='vintage-guestbook-scroll vintage-guestbook-wrap'
              style={{
                maxWidth: 620,
                margin: '0 auto',
                maxHeight: 450,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                ...creamPatternStyle
              }}
            >
              {displayedGuestWishes.map((comment, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 12,
                    padding: '16px 20px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    borderLeft: `4px solid ${red}`,
                    fontFamily: sectionFontFamily
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
                    <span style={{ fontWeight: 700, color: red, fontSize: '0.95rem' }}>
                      {comment.guest_name || 'Khách mời'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: `${textDark}bb`, fontFamily: fontFamily }}>
                      {typeof comment.created_at === 'string' && comment.created_at.includes(':')
                        ? comment.created_at
                        : new Date(comment.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                    <span
                      style={{
                        border: `1px solid ${red}66`,
                        color: red,
                        borderRadius: 999,
                        padding: '3px 10px',
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}
                    >
                      {comment.is_attending ? 'Sẽ tham dự' : 'Không tham dự'}
                    </span>
                    {comment.is_attending && (
                      <span
                        style={{
                          border: `1px solid ${red}55`,
                          color: `${red}dd`,
                          borderRadius: 999,
                          padding: '3px 10px',
                          fontSize: '0.72rem'
                        }}
                      >
                        {`Số người: ${comment.party_size || 1}`}
                      </span>
                    )}
                    {comment.phone && (
                      <span
                        style={{
                          border: `1px solid ${red}55`,
                          color: `${red}dd`,
                          borderRadius: 999,
                          padding: '3px 10px',
                          fontSize: '0.72rem'
                        }}
                      >
                        {`SĐT: ${comment.phone}`}
                      </span>
                    )}
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
              className='vintage-section-padding'
              style={{
                padding: '30px 18px 44px',
                textAlign: 'center',
                backgroundColor: '#fdf6f7',
                backgroundImage: `radial-gradient(circle at 12% 18%, ${red}1a 0, transparent 130px), radial-gradient(circle at 78% 20%, ${red}14 0, transparent 170px), radial-gradient(circle at 84% 75%, ${red}10 0, transparent 210px)`
              }}
            >
              <p
                style={{
                  color: red,
                  fontSize: '1.9rem',
                  fontFamily: sectionFontFamily,
                  marginBottom: 18,
                  letterSpacing: 1
                }}
              >
                Hộp Mừng Cưới
              </p>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className='gift-card-wrap'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className='gift-card-ornament gift-card-ornament-left' src={peachDecorUrl} alt='' />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className='gift-card-ornament gift-card-ornament-right' src={peachDecorUrl} alt='' />

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
                        background: `linear-gradient(150deg, ${red}cc 0%, ${red}99 100%)`,
                        borderRadius: 14,
                        position: 'relative',
                        border: '1px solid rgba(255,255,255,0.44)',
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
                          border: '1px dashed rgba(255,255,255,0.66)',
                          pointerEvents: 'none'
                        }}
                      />

                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          border: '2px solid rgba(255,255,255,0.88)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '1.7rem',
                          fontWeight: 700
                        }}
                      >
                        囍
                      </div>

                      <p
                        style={{
                          marginLeft: 12,
                          color: '#fff',
                          fontFamily: sectionFontFamily,
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

              <p style={{ marginTop: 16, color: red, fontSize: '0.85rem', fontFamily: fontFamily }}>
                Nhấn vào tấm thiệp nhỏ để mở mã QR
              </p>
            </div>
          )}
        </div>

        <div className='vintage-side-panel' style={{ flex: 1, minHeight: '100vh', background: '#fff' }} />
      </div>

      {/* Music auto-plays when splash is dismissed */}
      <MusicPlayer musicUrl={musicUrl || mergedContent.music_url} forceHide={showSplash} />

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
              backgroundColor: '#cc747d',
              borderRadius: 18,
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.42)',
              padding: '22px 20px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <p
                style={{
                  color: '#fff',
                  fontFamily: sectionFontFamily,
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
                  color: '#fff',
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

            <div style={{ display: 'grid', gap: 8, color: '#fff' }}>
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
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.82)', marginTop: 4 }}>
                Nội dung chuyển khoản: {transferNote}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
