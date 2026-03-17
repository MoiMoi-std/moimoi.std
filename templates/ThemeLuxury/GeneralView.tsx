import { createClient } from '@supabase/supabase-js'
import { Calendar, Clock, Heart, MapPin } from 'lucide-react'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { WeddingCalendar } from '../../components/WeddingCalendar'
import { getImageStyle, resolveImageAdjust } from '../../lib/imageUtils'
import { useTemplateViewport } from '../../lib/TemplateViewportContext'
import { TemplateProps } from '../TemplateRegistry'
import { useMapEmbed } from '../../lib/useMapEmbed'
import MusicPlayer from '@/components/MusicPlayer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

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

const LuxurySparkles = () => {
  const [items, setItems] = useState<{ left: string; top: string; delay: string; dur: string; size: number }[]>([])
  useEffect(() => {
    setItems(
      [...Array(24)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 6}s`,
        dur: `${3 + Math.random() * 4}s`,
        size: 4 + Math.random() * 6
      }))
    )
  }, [])
  if (items.length === 0) return null
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      {items.map((s, i) => (
        <div
          key={i}
          className='lx-star'
          style={
            {
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              '--tw-dur': s.dur,
              animationDelay: s.delay
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

export default function LuxuryGeneralView({ wedding, guestName = '', rsvpId, disableSplash, musicUrl }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [showSplash, setShowSplash] = useState(!disableSplash)
  const [splashFading, setSplashFading] = useState(false)
  const [showGiftQr, setShowGiftQr] = useState(false)

  // Guestbook state
  const [wishesList, setWishesList] = useState<any[]>([])

  const { content, template } = wedding || {}
  const viewport = useTemplateViewport()
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }
  const mapEmbedSrc = useMapEmbed(mergedContent.map_url, mergedContent.address)

  const gold = mergedContent.primary_color || '#C9A84C'
  const goldLight = '#E8D5A3'
  const goldDark = '#A08930'
  const darkBg = '#0a0a0a'
  const darkCard = '#141414'
  const fontFamily = mergedContent.font_family || "'Cormorant Garamond', Georgia, serif"
  const headingFontFamily = mergedContent.heading_font_family || "'Cinzel', serif"
  const sectionFontFamily = mergedContent.section_font_family || "'Cinzel', serif"

  const coverImage =
    mergedContent.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=533&fit=crop'
  const mockAlbumImages = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1529443132905-8ee5f6e8ed8b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1578730169862-749eae6bc1cc?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1513279922550-250c2129b13a?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1484863137850-59afcfe05386?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=400&fit=crop'
  ]
  const allAlbumImages = mergedContent.images?.length > 0 ? mergedContent.images : mockAlbumImages
  const albumImages = allAlbumImages.slice(0, 20)

  let calYear = 0,
    calMonth = 0,
    calDay = 0
  if (mergedContent.wedding_date) {
    const parts = (mergedContent.wedding_date as string).split('-').map(Number)
    calYear = parts[0]
    calMonth = parts[1]
    calDay = parts[2]
  }

  useEffect(() => {
    if (mergedContent.wedding_date) {
      const interval = setInterval(() => {
        const weddingDate = new Date(`${mergedContent.wedding_date}T${mergedContent.wedding_time || '00:00'}`)
        const now = new Date()
        const diff = weddingDate.getTime() - now.getTime()
        if (diff > 0) {
          setTimeRemaining({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000)
          })
        } else {
          setTimeRemaining(null)
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [mergedContent.wedding_date, mergedContent.wedding_time])

  // Fetch Wishes
  useEffect(() => {
    if (wedding?.id) {
      supabase
        .from('rsvps')
        .select('guest_name, wishes')
        .eq('wedding_id', wedding.id)
        .not('wishes', 'is', null)
        .neq('wishes', '')
        .then(({ data }) => {
          if (data) setWishesList(data)
        })
    }
  }, [wedding?.id])

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    border: `1px solid ${gold}20`,
    borderRadius: 12,
    fontSize: 15,
    outline: 'none',
    background: darkBg,
    boxSizing: 'border-box',
    fontFamily: fontFamily,
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

  const handleOpenInvitation = () => {
    setSplashFading(true)
    setTimeout(() => setShowSplash(false), 700)
  }

  if (!wedding) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: darkBg,
          fontFamily: headingFontFamily
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: gold, marginBottom: 8 }}>404</h1>
          <p style={{ color: '#666' }}>Không tìm thấy thiệp cưới.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>
          {mergedContent.groom_name} &amp; {mergedContent.bride_name} — Royal Wedding
        </title>
        <meta
          name='description'
          content={`Thiệp cưới cao cấp — ${mergedContent.groom_name} và ${mergedContent.bride_name}`}
        />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Inter:wght@300;400;500&display=swap'
          rel='stylesheet'
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${darkBg}; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
          html { scroll-behavior: smooth; }

          input:focus, textarea:focus {
            border-color: ${gold} !important;
            box-shadow: 0 0 0 3px ${gold}20, 0 0 20px ${gold}10 !important;
          }

          @keyframes luxReveal {
            from { opacity: 0; transform: translateY(50px); filter: blur(6px); }
            to   { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          @keyframes luxSlideUp {
            from { opacity: 0; transform: translateY(40px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes luxSlideLeft {
            from { opacity: 0; transform: translateX(-60px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          @keyframes luxSlideRight {
            from { opacity: 0; transform: translateX(60px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          @keyframes goldShimmer {
            0%   { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes goldPulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50%      { opacity: 1; transform: scale(1.04); }
          }
          @keyframes borderShine {
            0%   { border-color: ${gold}20; }
            50%  { border-color: ${gold}60; }
            100% { border-color: ${gold}20; }
          }
          @keyframes breathe {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50%      { transform: scale(1.02); opacity: 1; }
          }
          @keyframes tickGold {
            0%, 100% { color: ${gold}; text-shadow: 0 0 20px ${gold}40; }
            50%      { color: ${goldLight}; text-shadow: 0 0 30px ${gold}60; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-10px); }
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

          .lx-reveal { animation: luxReveal 1.2s cubic-bezier(.16,1,.3,1) both; }
          .lx-up     { animation: luxSlideUp 0.9s cubic-bezier(.16,1,.3,1) both; }
          .lx-left   { animation: luxSlideLeft 0.9s cubic-bezier(.16,1,.3,1) both; }
          .lx-right  { animation: luxSlideRight 0.9s cubic-bezier(.16,1,.3,1) both; }
          .lx-up-d1  { animation-delay: 0.15s; }
          .lx-up-d2  { animation-delay: 0.3s; }
          .lx-up-d3  { animation-delay: 0.45s; }
          .lx-up-d4  { animation-delay: 0.6s; }
          .lx-pulse  { animation: goldPulse 3s ease-in-out infinite; }
          .lx-breathe { animation: breathe 4s ease-in-out infinite; }
          .lx-float  { animation: float 4s ease-in-out infinite; }
          .lx-tick   { animation: tickGold 2s ease-in-out infinite; }
          .lx-crown  { animation: crownDrop 0.9s cubic-bezier(.175,.885,.32,1.275) both; }

          .gold-shimmer-text {
            background: linear-gradient(90deg, ${goldDark}, ${gold}, ${goldLight}, ${gold}, ${goldDark});
            background-size: 200% 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: goldShimmer 5s linear infinite;
          }

          .luxury-card {
            background: linear-gradient(145deg, ${darkCard}, #1a1a1a);
            border: 1px solid ${gold}15;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.03);
            transition: transform 0.5s cubic-bezier(.16,1,.3,1), box-shadow 0.5s ease, border-color 0.5s ease;
          }
          .luxury-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 20px 60px rgba(0,0,0,.5), 0 0 30px ${gold}08;
            border-color: ${gold}35;
          }

          .lg-card {
            background: linear-gradient(145deg, ${darkCard}, #1a1a1a);
            border: 1px solid ${gold}15;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.02);
            animation: breatheGlow 5s ease-in-out infinite;
          }

          .gold-border-glow {
            animation: borderShine 4s ease-in-out infinite;
          }

          .diamond-accent {
            width: 10px; height: 10px;
            background: ${gold};
            transform: rotate(45deg);
            display: inline-block;
            box-shadow: 0 0 12px ${gold}50;
          }

          .lg-diamond {
            width: 8px; height: 8px;
            background: ${gold};
            transform: rotate(45deg);
            display: inline-block;
            box-shadow: 0 0 10px ${gold}40;
          }

          .photo-lux {
            overflow: hidden;
            border-radius: 16px;
            border: 1px solid ${gold}15;
            position: relative;
            cursor: pointer;
            transition: transform 0.5s cubic-bezier(.16,1,.3,1), border-color 0.4s;
          }
          .photo-lux:hover {
            transform: scale(1.02);
            border-color: ${gold}40;
          }
          .photo-lux::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, ${darkBg}cc 0%, transparent 60%);
            opacity: 0;
            transition: opacity 0.4s;
          }
          .photo-lux:hover::after { opacity: 1; }

          .btn-luxury {
            position: relative;
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .btn-luxury::after {
            content: '';
            position: absolute;
            top: -50%; left: -50%;
            width: 200%; height: 200%;
            background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,.08) 50%, transparent 70%);
            transform: rotate(45deg) translateY(100%);
            transition: transform 0.6s ease;
          }
          .btn-luxury:hover::after { transform: rotate(45deg) translateY(-100%); }
          .btn-luxury:hover { transform: translateY(-3px); box-shadow: 0 12px 40px ${gold}30; }

          .marble-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, ${gold}40 20%, ${gold} 50%, ${gold}40 80%, transparent 100%);
            margin: 0 auto;
          }

          .lg-marble {
            height: 1px;
            background: linear-gradient(90deg, transparent, ${gold}40, ${gold}, ${gold}40, transparent);
          }

          .ornate-corner {
            position: absolute;
            width: 80px; height: 80px;
            opacity: 0.3;
          }
          .ornate-corner::before,
          .ornate-corner::after {
            content: '';
            position: absolute;
            background: ${gold};
          }
          .ornate-corner.tl::before { top: 0; left: 0; width: 40px; height: 1px; }
          .ornate-corner.tl::after  { top: 0; left: 0; width: 1px; height: 40px; }
          .ornate-corner.tr::before { top: 0; right: 0; width: 40px; height: 1px; }
          .ornate-corner.tr::after  { top: 0; right: 0; width: 1px; height: 40px; }
          .ornate-corner.bl::before { bottom: 0; left: 0; width: 40px; height: 1px; }
          .ornate-corner.bl::after  { bottom: 0; left: 0; width: 1px; height: 40px; }
          .ornate-corner.br::before { bottom: 0; right: 0; width: 40px; height: 1px; }
          .ornate-corner.br::after  { bottom: 0; right: 0; width: 1px; height: 40px; }

          .corner-lux {
            position: absolute; width: 40px; height: 40px; opacity: 0.35;
          }
          .corner-lux.tl { top: 12px; left: 12px; border-top: 1px solid ${gold}; border-left: 1px solid ${gold}; }
          .corner-lux.tr { top: 12px; right: 12px; border-top: 1px solid ${gold}; border-right: 1px solid ${gold}; }
          .corner-lux.bl { bottom: 12px; left: 12px; border-bottom: 1px solid ${gold}; border-left: 1px solid ${gold}; }
          .corner-lux.br { bottom: 12px; right: 12px; border-bottom: 1px solid ${gold}; border-right: 1px solid ${gold}; }

          .btn-lg-attend:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(34,197,94,.2); }
          .btn-lg-decline:hover { transform: translateY(-2px); box-shadow: 0 4px 20px rgba(239,68,68,.15); }
          .btn-lg-submit:not(:disabled):hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 40px ${gold}35;
          }

          /* ── Splash ── */
          @keyframes splashFadeOut {
            to { opacity: 0; transform: scale(1.03); }
          }
          @keyframes splashCardIn {
            from { opacity: 0; transform: translateY(30px) scale(0.96); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          .splash-card-lx {
            animation: splashCardIn 0.9s cubic-bezier(.16,1,.3,1) both;
          }
          .splash-fading {
            animation: splashFadeOut 0.7s cubic-bezier(.4,0,.6,1) forwards;
          }

          /* ── Gift box ── */
          @keyframes giftFloat {
            0%, 100% { transform: translateY(0) rotate(-1deg); }
            50%       { transform: translateY(-12px) rotate(1deg); }
          }
          @keyframes giftGlow {
            0%, 100% { box-shadow: 0 0 20px ${gold}20, 0 8px 40px rgba(0,0,0,.4); }
            50%       { box-shadow: 0 0 40px ${gold}50, 0 8px 60px rgba(0,0,0,.5); }
          }
          @keyframes ribbonShine {
            0%   { opacity: 0.6; }
            50%  { opacity: 1; }
            100% { opacity: 0.6; }
          }
          .gift-box-lx {
            animation: giftFloat 3s ease-in-out infinite, giftGlow 3s ease-in-out infinite;
            cursor: pointer;
            transition: transform 0.3s ease;
          }
          .gift-box-lx:hover {
            animation-play-state: paused;
            transform: scale(1.08) !important;
          }

          /* ── Floating orbs ── */
          @keyframes orbDrift {
            0%   { transform: translate(0, 0) scale(1); opacity: 0.18; }
            33%  { transform: translate(20px, -30px) scale(1.08); opacity: 0.28; }
            66%  { transform: translate(-15px, -50px) scale(0.95); opacity: 0.15; }
            100% { transform: translate(0, 0) scale(1); opacity: 0.18; }
          }
          .lx-orb {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            filter: blur(40px);
            animation: orbDrift var(--dur, 12s) ease-in-out infinite;
          }

          /* ── Image sweep shimmer ── */
          @keyframes lxSweep {
            0%   { left: -60%; }
            100% { left: 120%; }
          }
          .photo-lux::before {
            content: '';
            position: absolute;
            top: 0; left: -60%;
            width: 40%; height: 100%;
            background: linear-gradient(100deg, transparent 20%, rgba(201,168,76,0.18) 50%, transparent 80%);
            z-index: 3;
            animation: lxSweep 4s ease-in-out infinite;
            animation-play-state: paused;
          }
          .photo-lux:hover::before { animation-play-state: running; }

          /* ── Section glow line ── */
          @keyframes glowLine {
            0%, 100% { opacity: 0.4; transform: scaleX(0.6); }
            50%       { opacity: 1; transform: scaleX(1); }
          }
          .marble-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, ${gold}99, ${goldLight}, ${gold}99, transparent);
            animation: glowLine 4s ease-in-out infinite;
            margin: 0 auto;
          }

          /* ── Twinkle stars ── */
          @keyframes lxTwinkle {
            0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
            50%       { opacity: 1; transform: scale(1) rotate(180deg); }
          }
          .lx-star {
            position: absolute;
            width: 6px; height: 6px;
            background: ${gold};
            clip-path: polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
            animation: lxTwinkle var(--tw-dur, 3s) ease-in-out infinite;
            pointer-events: none;
          }

          /* ── Section fade in on scroll ── */
          @keyframes lxFadeSection {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .lx-section-in { animation: lxFadeSection 1s cubic-bezier(.16,1,.3,1) both; }
        `}</style>
      </Head>

      <div
        style={{
          minHeight: '100vh',
          background: darkBg,
          color: '#d4d4d4',
          fontFamily: fontFamily,
          overflowX: 'hidden'
        }}
      >
        {/* ══ Splash Screen ══ */}
        {showSplash && (
          <div
            onClick={handleOpenInvitation}
            className={splashFading ? 'splash-fading' : ''}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9997,
              backgroundColor: darkBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              cursor: 'pointer'
            }}
          >
            {/* Bg shimmer circles */}
            <div
              style={{
                position: 'absolute',
                top: '20%',
                left: '15%',
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${gold}08 0%, transparent 70%)`,
                pointerEvents: 'none'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '15%',
                right: '10%',
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${gold}06 0%, transparent 70%)`,
                pointerEvents: 'none'
              }}
            />

            <div
              className='splash-card-lx'
              style={{
                maxWidth: 420,
                width: '100%',
                padding: '52px 36px',
                textAlign: 'center',
                border: `1px solid ${gold}35`,
                borderRadius: 4,
                outline: `1px solid ${gold}15`,
                outlineOffset: 8,
                background: 'linear-gradient(145deg, #111111, #0d0d0d)',
                boxShadow: `0 40px 120px rgba(0,0,0,.8), 0 0 60px ${gold}10`,
                position: 'relative'
              }}
            >
              {/* Corner ornaments */}
              <div className='corner-lux tl' />
              <div className='corner-lux tr' />
              <div className='corner-lux bl' />
              <div className='corner-lux br' />

              {/* Crown SVG */}
              <div style={{ marginBottom: 20 }}>
                <svg width='40' height='28' viewBox='0 0 40 28' fill='none'>
                  <path d='M4 24L8 8L16 18L20 4L24 18L32 8L36 24H4Z' fill={gold} opacity='0.9' />
                  <path d='M4 24L8 8L16 18L20 4L24 18L32 8L36 24H4Z' stroke={goldLight} strokeWidth='0.8' fill='none' />
                  <circle cx='8' cy='8' r='2' fill={goldLight} />
                  <circle cx='20' cy='4' r='2' fill={goldLight} />
                  <circle cx='32' cy='8' r='2' fill={goldLight} />
                </svg>
              </div>

              <p
                style={{
                  fontFamily: sectionFontFamily,
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: '0.55em',
                  textTransform: 'uppercase',
                  color: `${gold}80`,
                  marginBottom: 28
                }}
              >
                WEDDING INVITATION
              </p>

              <div className='marble-divider' style={{ width: '60%', margin: '0 auto 28px' }} />

              <h2
                className='gold-shimmer-text'
                style={{
                  fontFamily: headingFontFamily,
                  fontSize: 'clamp(1.6rem, 6vw, 2.4rem)',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  marginBottom: 4
                }}
              >
                {mergedContent.groom_name}
              </h2>
              <p
                style={{
                  fontFamily: sectionFontFamily,
                  fontSize: 20,
                  color: gold,
                  fontWeight: 300,
                  margin: '8px 0'
                }}
              >
                &amp;
              </p>
              <h2
                className='gold-shimmer-text'
                style={{
                  fontFamily: headingFontFamily,
                  fontSize: 'clamp(1.6rem, 6vw, 2.4rem)',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  marginBottom: 24
                }}
              >
                {mergedContent.bride_name}
              </h2>

              <div className='marble-divider' style={{ width: '60%', margin: '0 auto 24px' }} />

              {mergedContent.wedding_date && (
                <p
                  style={{
                    fontFamily: fontFamily,
                    fontSize: 14,
                    color: goldLight,
                    fontStyle: 'italic',
                    marginBottom: 32,
                    letterSpacing: '0.04em'
                  }}
                >
                  {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}

              <button
                className='btn-luxury'
                style={{
                  padding: '14px 40px',
                  background: `linear-gradient(135deg, ${goldDark}, ${gold}, ${goldLight}, ${gold})`,
                  backgroundSize: '300% 100%',
                  animation: 'goldShimmer 4s linear infinite',
                  border: 'none',
                  borderRadius: 2,
                  color: '#0a0a0a',
                  fontFamily: sectionFontFamily,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                MỞ THIỆP
              </button>

              <p
                style={{
                  marginTop: 20,
                  fontSize: 11,
                  color: `${gold}40`,
                  letterSpacing: '0.1em'
                }}
              >
                Nhấn để mở thiệp
              </p>
            </div>
          </div>
        )}

        {/* ══ Hero Section ══ */}
        <section
          style={{
            position: 'relative',
            height: '100vh',
            minHeight: 600,
            overflow: 'hidden'
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt='Wedding Cover'
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              filter: 'contrast(1.02) brightness(0.88)',
              ...getImageStyle(resolveImageAdjust(mergedContent.cover_image_position, viewport))
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, transparent 35%, rgba(10,10,10,0.82) 100%)'
            }}
          />

          {/* Floating gold orbs */}
          <div
            className='lx-orb'
            style={
              {
                width: 300,
                height: 300,
                background: `radial-gradient(circle,${gold}22,transparent 70%)`,
                bottom: '10%',
                right: '-5%',
                '--dur': '14s'
              } as React.CSSProperties
            }
          />
          <div
            className='lx-orb'
            style={
              {
                width: 200,
                height: 200,
                background: `radial-gradient(circle,${goldLight}18,transparent 70%)`,
                top: '15%',
                left: '-5%',
                '--dur': '10s',
                animationDelay: '3s'
              } as React.CSSProperties
            }
          />
          <div
            className='lx-orb'
            style={
              {
                width: 150,
                height: 150,
                background: `radial-gradient(circle,${gold}15,transparent 70%)`,
                top: '40%',
                right: '10%',
                '--dur': '18s',
                animationDelay: '7s'
              } as React.CSSProperties
            }
          />

          <LuxurySparkles />

          <div className='ornate-corner tl' style={{ top: 32, left: 32 }} />
          <div className='ornate-corner tr' style={{ top: 32, right: 32 }} />
          <div className='ornate-corner bl' style={{ bottom: 32, left: 32 }} />
          <div className='ornate-corner br' style={{ bottom: 32, right: 32 }} />

          <div style={{ position: 'absolute', top: 28, left: 0, right: 0, textAlign: 'center', zIndex: 1 }}>
            <p
              className='lx-up'
              style={{
                fontFamily: sectionFontFamily,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.5em',
                textTransform: 'uppercase',
                color: gold
              }}
            >
              THE WEDDING OF
            </p>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1,
              textAlign: 'center',
              padding: '0 24px 40px'
            }}
          >
            {guestName && (
              <p
                className='lx-up'
                style={{
                  fontFamily: sectionFontFamily,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: `${gold}90`,
                  marginBottom: 8
                }}
              >
                TRÂN TRỌNG KÍNH MỜI
              </p>
            )}
            {guestName && (
              <p
                className='lx-up gold-shimmer-text'
                style={{
                  fontFamily: headingFontFamily,
                  fontSize: 'clamp(1rem, 4vw, 1.4rem)',
                  fontWeight: 700,
                  marginBottom: 12
                }}
              >
                {guestName}
              </p>
            )}
            <h1
              className='gold-shimmer-text lx-up'
              style={{
                fontFamily: headingFontFamily,
                fontSize: viewport === 'laptop' ? 'clamp(2.8rem, 4vw, 4.5rem)' : 'clamp(1.8rem, 7vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                paddingTop: '0.15em',
                paddingBottom: '0.15em',
                marginBottom: mergedContent.groom_role ? 0 : 10
              }}
            >
              {mergedContent.groom_name}
            </h1>
            {mergedContent.groom_role && (
              <p
                className='lx-up'
                style={{
                  fontFamily: sectionFontFamily,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: goldLight,
                  marginBottom: 10
                }}
              >
                {mergedContent.groom_role}
              </p>
            )}
            <div
              className='lx-up'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '10px 0' }}
            >
              <div className='marble-divider' style={{ width: 60 }} />
              <span style={{ fontFamily: headingFontFamily, fontSize: 16, color: gold, fontWeight: 300 }}>&amp;</span>
              <div className='marble-divider' style={{ width: 60 }} />
            </div>
            <h1
              className='gold-shimmer-text lx-up'
              style={{
                fontFamily: headingFontFamily,
                fontSize: viewport === 'laptop' ? 'clamp(2.8rem, 4vw, 4.5rem)' : 'clamp(1.8rem, 7vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                paddingTop: '0.15em',
                paddingBottom: '0.15em',
                marginBottom: mergedContent.bride_role ? 0 : 14
              }}
            >
              {mergedContent.bride_name}
            </h1>
            {mergedContent.bride_role && (
              <p
                className='lx-up'
                style={{
                  fontFamily: sectionFontFamily,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: goldLight,
                  marginBottom: 14
                }}
              >
                {mergedContent.bride_role}
              </p>
            )}
            {mergedContent.wedding_date && (
              <p
                className='lx-up'
                style={{
                  fontSize: 12,
                  color: 'rgba(200,165,75,0.8)',
                  fontWeight: 300,
                  letterSpacing: '0.1em',
                  fontStyle: 'italic'
                }}
              >
                {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
        </section>

        {/* ══ Parents Info ══ */}
        {(mergedContent.groom_father_name || mergedContent.bride_father_name) && (
          <section style={{ padding: '80px 20px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }}>
              <div className='marble-divider' style={{ width: '60%' }} />
            </div>
            <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
              <div className='lx-pulse' style={{ marginBottom: 16 }}>
                <span className='diamond-accent' />
              </div>
              <h2
                className='gold-shimmer-text lx-up'
                style={{
                  fontFamily: sectionFontFamily,
                  fontSize: 'clamp(1.3rem, 4vw, 2rem)',
                  fontWeight: 700,
                  marginBottom: 40,
                  letterSpacing: '0.1em'
                }}
              >
                GIA ĐÌNH
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                <div className='luxury-card lx-up' style={{ padding: '28px 20px', textAlign: 'center' }}>
                  <p
                    style={{
                      fontFamily: sectionFontFamily,
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: '0.4em',
                      textTransform: 'uppercase',
                      color: gold,
                      marginBottom: 16
                    }}
                  >
                    NHÀ TRAI
                  </p>
                  <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.8 }}>
                    {mergedContent.groom_father_name && (
                      <p>
                        Ông: <span style={{ color: gold }}>{mergedContent.groom_father_name}</span>
                      </p>
                    )}
                    {mergedContent.groom_mother_name && (
                      <p>
                        Bà: <span style={{ color: gold }}>{mergedContent.groom_mother_name}</span>
                      </p>
                    )}
                    {mergedContent.groom_city && (
                      <p style={{ fontSize: 11, color: '#666', marginTop: 6 }}>{mergedContent.groom_city}</p>
                    )}
                  </div>
                </div>
                <div className='luxury-card lx-up' style={{ padding: '28px 20px', textAlign: 'center' }}>
                  <p
                    style={{
                      fontFamily: sectionFontFamily,
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: '0.4em',
                      textTransform: 'uppercase',
                      color: gold,
                      marginBottom: 16
                    }}
                  >
                    NHÀ GÁI
                  </p>
                  <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.8 }}>
                    {mergedContent.bride_father_name && (
                      <p>
                        Ông: <span style={{ color: gold }}>{mergedContent.bride_father_name}</span>
                      </p>
                    )}
                    {mergedContent.bride_mother_name && (
                      <p>
                        Bà: <span style={{ color: gold }}>{mergedContent.bride_mother_name}</span>
                      </p>
                    )}
                    {mergedContent.bride_city && (
                      <p style={{ fontSize: 11, color: '#666', marginTop: 6 }}>{mergedContent.bride_city}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══ Countdown ══ */}
        {timeRemaining && (
          <section style={{ padding: '80px 20px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }}>
              <div className='marble-divider' style={{ width: '60%' }} />
            </div>
            <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
              <div className='lx-pulse' style={{ marginBottom: 16 }}>
                <span className='diamond-accent' />
              </div>
              <h2
                className='gold-shimmer-text lx-up'
                style={{
                  fontFamily: sectionFontFamily,
                  fontSize: 'clamp(1.3rem, 4vw, 2rem)',
                  fontWeight: 700,
                  marginBottom: 8,
                  letterSpacing: '0.1em'
                }}
              >
                COUNTDOWN
              </h2>
              <p className='lx-up' style={{ color: '#666', fontStyle: 'italic', marginBottom: 40, fontSize: 15 }}>
                Đếm ngược đến ngày vui…
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                  { label: 'DAYS', value: timeRemaining.days },
                  { label: 'HOURS', value: timeRemaining.hours },
                  { label: 'MINS', value: timeRemaining.minutes },
                  { label: 'SECS', value: timeRemaining.seconds }
                ].map((item, i) => (
                  <div
                    key={item.label}
                    className={`luxury-card gold-border-glow lx-up lx-up-d${i + 1}`}
                    style={{ padding: '24px 8px', textAlign: 'center' }}
                  >
                    <div
                      className='lx-tick'
                      style={{
                        fontFamily: sectionFontFamily,
                        fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                        fontWeight: 800,
                        lineHeight: 1,
                        marginBottom: 8
                      }}
                    >
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div
                      style={{
                        fontFamily: sectionFontFamily,
                        fontSize: 9,
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        color: '#555'
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ Event Details ══ */}
        <section style={{ padding: '80px 20px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }}>
            <div className='marble-divider' style={{ width: '60%' }} />
          </div>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div className='lx-pulse' style={{ marginBottom: 16 }}>
                <span className='diamond-accent' />
              </div>
              <h2
                className='gold-shimmer-text lx-up'
                style={{
                  fontFamily: sectionFontFamily,
                  fontSize: 'clamp(1.3rem, 4vw, 2rem)',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  marginBottom: 16
                }}
              >
                EVENT DETAILS
              </h2>
              <div className='marble-divider lx-up' style={{ width: 100 }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              <div className='luxury-card lx-left' style={{ padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: `${gold}10`,
                      border: `1px solid ${gold}25`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Calendar size={24} color={gold} />
                  </div>
                  <h3
                    style={{
                      fontFamily: sectionFontFamily,
                      fontSize: 18,
                      fontWeight: 700,
                      color: goldLight,
                      letterSpacing: '0.05em'
                    }}
                  >
                    THỜI GIAN
                  </h3>
                </div>
                {calYear > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <WeddingCalendar
                      year={calYear}
                      month={calMonth}
                      day={calDay}
                      primaryColor={gold}
                      variant='dark'
                      fontFamily={fontFamily}
                    />
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#777' }}>
                  <Clock size={16} color={gold} />
                  <span>Lúc {mergedContent.wedding_time || '00:00'}</span>
                </div>
                {mergedContent.lunar_date && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#777', marginTop: 8 }}>
                    <Calendar size={16} color={gold} />
                    <span>Âm lịch: {mergedContent.lunar_date}</span>
                  </div>
                )}
              </div>

              <div className='luxury-card lx-right' style={{ padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: `${gold}10`,
                      border: `1px solid ${gold}25`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <MapPin size={24} color={gold} />
                  </div>
                  <h3
                    style={{
                      fontFamily: sectionFontFamily,
                      fontSize: 18,
                      fontWeight: 700,
                      color: goldLight,
                      letterSpacing: '0.05em'
                    }}
                  >
                    ĐỊA ĐIỂM
                  </h3>
                </div>
                <p style={{ color: '#aaa', fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
                  {mergedContent.address || '—'}
                </p>
                {mergedContent.address && (
                  <div
                    style={{
                      marginTop: 24,
                      width: '100%',
                      height: 250,
                      borderRadius: 12,
                      overflow: 'hidden',
                      position: 'relative',
                      border: `1px solid ${gold}25`
                    }}
                  >
                    <iframe
                      width='100%'
                      height='100%'
                      style={{ border: 0 }}
                      loading='lazy'
                      allowFullScreen
                      referrerPolicy='no-referrer-when-downgrade'
                      src={mapEmbedSrc}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ══ Gallery ══ */}
        <section style={{ padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
          {/* Background orb */}
          <div
            className='lx-orb'
            style={
              {
                width: 400,
                height: 400,
                background: `radial-gradient(circle,${gold}10,transparent 70%)`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                '--dur': '16s'
              } as React.CSSProperties
            }
          />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }}>
            <div className='marble-divider' style={{ width: '60%' }} />
          </div>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div
                className='lx-pulse'
                style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
              >
                <span
                  className='lx-star'
                  style={{ '--tw-dur': '2.5s', animationDelay: '0.5s', width: 8, height: 8 } as React.CSSProperties}
                />
                <span className='diamond-accent' />
                <span
                  className='lx-star'
                  style={{ '--tw-dur': '3s', animationDelay: '1s', width: 6, height: 6 } as React.CSSProperties}
                />
              </div>
              <h2
                className='gold-shimmer-text lx-up'
                style={{
                  fontFamily: sectionFontFamily,
                  fontSize: 'clamp(1.3rem, 4vw, 2rem)',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  marginBottom: 16
                }}
              >
                OUR MOMENTS
              </h2>
              <div className='marble-divider lx-up' style={{ width: 100 }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {albumImages.slice(0, 4).map((img: string, idx: number) => {
                const isLast = idx === 3 && albumImages.length > 4
                const extraCount = albumImages.length - 4
                return (
                  <div
                    key={idx}
                    className={`photo-lux lx-up`}
                    style={{ animationDelay: `${idx * 0.1}s`, cursor: 'pointer', aspectRatio: '3/4' }}
                    onClick={() => {
                      setLightboxIndex(idx)
                      setLightboxOpen(true)
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Photo ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        filter: 'contrast(1.05) brightness(0.95)',
                        transition: 'transform 0.6s ease, filter 0.4s',
                        ...getImageStyle(resolveImageAdjust(mergedContent.image_positions?.[idx], viewport))
                      }}
                    />
                    {isLast && extraCount > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(0,0,0,0.55)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: gold,
                          fontSize: '1.5rem',
                          fontFamily: sectionFontFamily,
                          fontWeight: 700,
                          zIndex: 2
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
        </section>

        {/* ══ RSVP Section ══ */}
        <section style={{ padding: '80px 20px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }}>
            <div className='marble-divider' style={{ width: '60%' }} />
          </div>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div className='lx-pulse' style={{ marginBottom: 16 }}>
                <span className='diamond-accent' />
              </div>
              <h2
                className='gold-shimmer-text lx-up'
                style={{
                  fontFamily: sectionFontFamily,
                  fontSize: 'clamp(1.3rem, 4vw, 2rem)',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  marginBottom: 16
                }}
              >
                SỔ LƯU BÚT
              </h2>
              <div className='marble-divider lx-up' style={{ width: 100 }} />
              {guestName && (
                <p
                  className='lx-up'
                  style={{
                    marginTop: 16,
                    color: gold,
                    fontSize: 14,
                    fontStyle: 'italic',
                    fontFamily: "'Cormorant Garamond', serif"
                  }}
                >
                  Kính mời <span style={{ fontWeight: 700 }}>{guestName}</span>
                </p>
              )}
            </div>

            <div className='lg-card' style={{ padding: '28px 24px' }}>
              {wishesList.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {wishesList.map((w, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '20px',
                        textAlign: 'left',
                        background: `${gold}06`,
                        borderRadius: 12,
                        borderLeft: `2px solid ${gold}`
                      }}
                    >
                      <p style={{ fontStyle: 'italic', color: '#ccc', marginBottom: 8, fontSize: 14, lineHeight: 1.6 }}>
                        "{w.wishes}"
                      </p>
                      <p
                        style={{
                          fontFamily: sectionFontFamily,
                          color: gold,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase'
                        }}
                      >
                        - {w.guest_name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center' }}>Chưa có lời chúc nào.</p>
              )}
            </div>
          </div>
        </section>

        {/* ══ Gift ══ */}
        {(() => {
          const bankName = mergedContent.bank_name || ''
          const accountNumber = mergedContent.account_number || ''
          const accountName = mergedContent.account_name || ''
          const customQrImage = mergedContent.qr_image || ''
          const transferNote = `Mừng cưới ${mergedContent.groom_name} ${mergedContent.bride_name}`.trim()
          const bankCode = BANK_MAP[bankName] || bankName
          const generatedQrUrl =
            bankCode && accountNumber
              ? `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.jpg?amount=0&addInfo=${encodeURIComponent(transferNote)}&accountName=${encodeURIComponent(accountName)}`
              : ''
          const displayQrUrl = customQrImage || generatedQrUrl
          const hasGiftInfo = Boolean(displayQrUrl || accountNumber || bankName || accountName)
          if (!hasGiftInfo) return null

          return (
            <section style={{ background: darkCard, padding: '80px 24px', textAlign: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }}>
                <div className='marble-divider' style={{ width: '60%' }} />
              </div>
              <div style={{ maxWidth: 480, margin: '0 auto' }}>
                <div className='lx-pulse' style={{ marginBottom: 16 }}>
                  <span className='diamond-accent' />
                </div>
                <h2
                  className='gold-shimmer-text lx-up'
                  style={{
                    fontFamily: sectionFontFamily,
                    fontSize: 'clamp(1.1rem, 3.5vw, 1.8rem)',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    marginBottom: 8
                  }}
                >
                  HỘP MỪNG CƯỚI
                </h2>
                <p className='lx-up' style={{ color: '#888', fontSize: 14, fontStyle: 'italic', marginBottom: 48 }}>
                  Sự hiện diện của bạn là món quà quý giá nhất
                </p>

                {/* Animated Gift Box */}
                <div
                  className='gift-box-lx'
                  onClick={() => setShowGiftQr(true)}
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12,
                    padding: '32px 40px',
                    border: `1px solid ${gold}30`,
                    borderRadius: 16,
                    background: `linear-gradient(145deg, #1a1500, #0f0d00, #1a1500)`,
                    position: 'relative'
                  }}
                >
                  <div className='corner-lux tl' style={{ width: 24, height: 24 }} />
                  <div className='corner-lux tr' style={{ width: 24, height: 24 }} />
                  <div className='corner-lux bl' style={{ width: 24, height: 24 }} />
                  <div className='corner-lux br' style={{ width: 24, height: 24 }} />

                  {/* Gift box SVG */}
                  <svg width='80' height='88' viewBox='0 0 80 88' fill='none'>
                    {/* Box body */}
                    <rect
                      x='8'
                      y='36'
                      width='64'
                      height='48'
                      rx='3'
                      fill={`${gold}20`}
                      stroke={gold}
                      strokeWidth='1.5'
                    />
                    {/* Box lid */}
                    <rect
                      x='4'
                      y='24'
                      width='72'
                      height='16'
                      rx='3'
                      fill={`${gold}30`}
                      stroke={gold}
                      strokeWidth='1.5'
                    />
                    {/* Vertical ribbon on body */}
                    <rect x='36' y='36' width='8' height='48' fill={`${gold}60`} />
                    {/* Horizontal ribbon on lid */}
                    <rect x='4' y='29' width='72' height='6' fill={`${gold}60`} />
                    {/* Bow left loop */}
                    <ellipse cx='30' cy='20' rx='12' ry='8' fill={gold} opacity='0.85' transform='rotate(-20 30 20)' />
                    {/* Bow right loop */}
                    <ellipse cx='50' cy='20' rx='12' ry='8' fill={gold} opacity='0.85' transform='rotate(20 50 20)' />
                    {/* Bow center */}
                    <circle cx='40' cy='22' r='5' fill={goldLight} />
                    {/* Glow dot at top */}
                    <circle cx='40' cy='22' r='3' fill='white' opacity='0.4' />
                    {/* Sparkle dots */}
                    <circle cx='20' cy='55' r='1.5' fill={gold} opacity='0.5' />
                    <circle cx='60' cy='65' r='1.5' fill={gold} opacity='0.5' />
                    <circle cx='55' cy='48' r='1' fill={goldLight} opacity='0.6' />
                  </svg>

                  <p
                    style={{
                      fontFamily: sectionFontFamily,
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.3em',
                      color: gold,
                      textTransform: 'uppercase'
                    }}
                  >
                    Nhấn để xem
                  </p>
                </div>
              </div>

              {/* Gift Modal */}
              {showGiftQr && (
                <div
                  onClick={() => setShowGiftQr(false)}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9998,
                    background: 'rgba(0,0,0,0.88)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 24
                  }}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      maxWidth: 380,
                      width: '100%',
                      background: 'linear-gradient(145deg, #141414, #111)',
                      border: `1px solid ${gold}40`,
                      borderRadius: 4,
                      outline: `1px solid ${gold}12`,
                      outlineOffset: 6,
                      padding: '40px 28px 32px',
                      textAlign: 'center',
                      position: 'relative'
                    }}
                  >
                    <div className='corner-lux tl' />
                    <div className='corner-lux tr' />
                    <div className='corner-lux bl' />
                    <div className='corner-lux br' />

                    <button
                      onClick={() => setShowGiftQr(false)}
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: `${gold}20`,
                        border: `1px solid ${gold}30`,
                        color: gold,
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        fontSize: 14,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ✕
                    </button>

                    <p
                      style={{
                        fontFamily: sectionFontFamily,
                        fontSize: 9,
                        letterSpacing: '0.45em',
                        color: `${gold}80`,
                        textTransform: 'uppercase',
                        marginBottom: 20
                      }}
                    >
                      HỘP MỪNG CƯỚI
                    </p>
                    <div className='marble-divider' style={{ width: '50%', margin: '0 auto 24px' }} />

                    {displayQrUrl && (
                      <div style={{ marginBottom: 20 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={displayQrUrl}
                          alt='QR Tiền Mừng'
                          style={{
                            width: 200,
                            height: 200,
                            objectFit: 'contain',
                            margin: '0 auto',
                            display: 'block',
                            border: `1px solid ${gold}20`,
                            borderRadius: 8,
                            padding: 8,
                            background: '#fff'
                          }}
                        />
                      </div>
                    )}

                    {(bankName || accountNumber || accountName) && (
                      <div style={{ fontSize: 13, color: '#bbb', lineHeight: 2, marginTop: 8 }}>
                        {bankName && <p style={{ color: gold, fontWeight: 600 }}>{bankName}</p>}
                        {accountNumber && (
                          <p
                            style={{
                              fontFamily: sectionFontFamily,
                              fontSize: 18,
                              letterSpacing: '0.1em',
                              color: goldLight,
                              fontWeight: 700
                            }}
                          >
                            {accountNumber}
                          </p>
                        )}
                        {accountName && <p style={{ color: '#ccc' }}>{accountName}</p>}
                      </div>
                    )}

                    <div className='marble-divider' style={{ width: '50%', margin: '20px auto 0' }} />
                  </div>
                </div>
              )}
            </section>
          )
        })()}

        {/* ══ Footer ══ */}
        <footer style={{ padding: '60px 20px', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1 }}>
            <div className='marble-divider' style={{ width: '40%' }} />
          </div>
          <div className='lx-pulse' style={{ marginBottom: 16 }}>
            <Heart size={28} fill={gold} color={gold} />
          </div>
          <p
            className='gold-shimmer-text'
            style={{
              fontFamily: headingFontFamily,
              fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
              fontWeight: 700,
              marginBottom: 8,
              letterSpacing: '0.08em'
            }}
          >
            {mergedContent.groom_name} &amp; {mergedContent.bride_name}
          </p>
          <p style={{ color: '#555', fontSize: 14, fontStyle: 'italic' }}>Cảm ơn quý khách đã đến chung vui</p>
          <div
            style={{
              marginTop: 28,
              fontSize: 11,
              color: '#333',
              letterSpacing: '0.1em',
              fontFamily: sectionFontFamily
            }}
          >
            POWERED BY MOIMOI STUDIO
          </div>
        </footer>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.92)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#fff',
              width: 40,
              height: 40,
              borderRadius: '50%',
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: 0,
              right: 0,
              textAlign: 'center',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.85rem'
            }}
          >
            {lightboxIndex + 1} / {albumImages.length}
          </div>
          {lightboxIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex(lightboxIndex - 1)
              }}
              style={{
                position: 'absolute',
                left: 12,
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#fff',
                width: 44,
                height: 44,
                borderRadius: '50%',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ‹
            </button>
          )}
          <div onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={albumImages[lightboxIndex]}
              alt={`Photo ${lightboxIndex + 1}`}
              style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 8, display: 'block' }}
            />
          </div>
          {lightboxIndex < albumImages.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex(lightboxIndex + 1)
              }}
              style={{
                position: 'absolute',
                right: 12,
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#fff',
                width: 44,
                height: 44,
                borderRadius: '50%',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ›
            </button>
          )}
        </div>
      )}

      {/* ═════════ MUSIC PLAYER ═════════ */}
      {!showSplash && <MusicPlayer musicUrl={musicUrl} />}
    </>
  )
}
