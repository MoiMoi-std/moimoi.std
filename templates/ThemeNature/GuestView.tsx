import Head from 'next/head'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { TemplateProps } from '../TemplateRegistry'
import { getImageStyle, resolveImageAdjust } from '../../lib/imageUtils'
import { useTemplateViewport } from '../../lib/TemplateViewportContext'
import { useMapEmbed } from '../../lib/useMapEmbed'
import RSVPForm from '@/components/guest/RSVPForm'

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

// Leaf SVG path for floating petals
const LEAF_PATH = 'M10,1 Q18,5 18,12 Q18,20 10,23 Q2,20 2,12 Q2,5 10,1Z'

const NaturePetals = () => {
  const [petals, setPetals] = useState<
    { left: string; size: number; dur: number; delay: number; drift: number; spin: number; color: string }[]
  >([])
  useEffect(() => {
    const colors = ['#7aab8a', '#4a7c59', '#a8d5b5', '#c8e6c9', '#81c784']
    setPetals(
      [...Array(16)].map(() => ({
        left: `${Math.random() * 100}%`,
        size: 8 + Math.random() * 10,
        dur: 8 + Math.random() * 10,
        delay: Math.random() * 12,
        drift: (Math.random() - 0.5) * 100,
        spin: Math.random() > 0.5 ? 360 : -360,
        color: colors[Math.floor(Math.random() * colors.length)]
      }))
    )
  }, [])
  if (petals.length === 0) return null
  return (
    <>
      {petals.map((p, i) => (
        <div
          key={i}
          className='nat-petal'
          style={
            {
              left: p.left,
              '--size': `${p.size}px`,
              '--dur': `${p.dur}s`,
              '--delay': `${p.delay}s`,
              '--drift': `${p.drift}px`,
              '--spin': `${p.spin}deg`
            } as React.CSSProperties
          }
        >
          <svg width={p.size} height={p.size} viewBox='0 0 20 24' fill={p.color} opacity='0.7'>
            <path d={LEAF_PATH} />
          </svg>
        </div>
      ))}
    </>
  )
}

export default function NatureGeneralView({ wedding, guestName = '', rsvpId, disableSplash }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const viewport = useTemplateViewport()
  const [wishesList, setWishesList] = useState<any[]>([])
  const [showSplash, setShowSplash] = useState(!disableSplash)
  const [splashFading, setSplashFading] = useState(false)
  const [showGiftQr, setShowGiftQr] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const { content, template } = wedding || {}

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
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }
  const mapEmbedSrc = useMapEmbed(mergedContent.map_url, mergedContent.address)

  const sage = mergedContent.primary_color || '#4a7c59'
  const sageDark = '#2f5c3e'
  const sageLight = '#7aab8a'
  const cream = '#f6f2ea'
  const creamDark = '#ede5d4'
  const textDark = '#1e2b1a'
  const textMid = '#5a6e52'
  const headingFontFamily = mergedContent.heading_font_family || "'Lora', Georgia, serif"
  const sectionFontFamily = mergedContent.section_font_family || "'Lora', serif"
  const fontFamily = mergedContent.font_family || "'DM Sans', sans-serif"

  useEffect(() => {
    if (!mergedContent.wedding_date) return
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
  }, [mergedContent.wedding_date, mergedContent.wedding_time])

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
          background: cream
        }}
      >
        <div style={{ textAlign: 'center', padding: 40 }}>
          <svg width='48' height='48' viewBox='0 0 48 48' fill='none' style={{ marginBottom: 12, opacity: 0.6 }}>
            <path d='M8 40 Q12 16 40 8 Q24 24 8 40Z' fill={sage} />
            <path d='M16 40 Q20 24 36 16' stroke={sage} strokeWidth='1.2' fill='none' opacity='0.5' />
          </svg>
          <h1 style={{ color: sage, fontFamily: "'Lora', serif" }}>Không tìm thấy thiệp cưới</h1>
        </div>
      </div>
    )
  }

  const allAlbumImages: string[] = (mergedContent.images || []).filter(Boolean)
  const albumImages = allAlbumImages.slice(0, 20)

  return (
    <>
      <Head>
        <title>
          {mergedContent.groom_name} &amp; {mergedContent.bride_name} — Garden Wedding
        </title>
        <meta name='description' content={`Thiệp cưới — ${mergedContent.groom_name} và ${mergedContent.bride_name}`} />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap'
          rel='stylesheet'
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${cream}; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
          html { scroll-behavior: smooth; }

          @keyframes natFadeUp {
            from { opacity: 0; transform: translateY(40px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes natHeroZoom {
            from { transform: scale(1.08); }
            to   { transform: scale(1); }
          }
          @keyframes natLeafSway {
            0%, 100% { transform: rotate(-6deg) translateY(0); }
            50%       { transform: rotate(6deg) translateY(-10px); }
          }
          @keyframes natFloat {
            0%, 100% { transform: translateY(0px) rotate(-1deg); }
            50%       { transform: translateY(-14px) rotate(1deg); }
          }
          @keyframes natScrollPulse {
            0%   { opacity: 1; transform: scaleY(1); transform-origin: top; }
            100% { opacity: 0; transform: scaleY(0); transform-origin: top; }
          }
          @keyframes natPulse {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50%       { opacity: 1; transform: scale(1.06); }
          }

          .nat-up     { animation: natFadeUp 0.9s cubic-bezier(.16,1,.3,1) both; }
          .nat-scale  { animation: natHeroZoom 2s cubic-bezier(.16,1,.3,1) both; }
          .nat-d1     { animation-delay: 0.15s; }
          .nat-d2     { animation-delay: 0.3s; }
          .nat-d3     { animation-delay: 0.45s; }
          .nat-d4     { animation-delay: 0.6s; }
          .nat-d5     { animation-delay: 0.75s; }
          .nat-float  { animation: natFloat 7s ease-in-out infinite; }
          .nat-sway   { animation: natLeafSway 5s ease-in-out infinite; }
          .nat-pulse  { animation: natPulse 3.5s ease-in-out infinite; }

          .nat-card {
            background: rgba(255,255,255,0.93);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(74,124,89,0.12);
            border-radius: 20px;
            box-shadow: 0 2px 16px rgba(30,43,26,0.07), 0 0 0 1px rgba(255,255,255,0.8) inset;
            transition: transform 0.4s cubic-bezier(.16,1,.3,1), box-shadow 0.4s;
          }
          .nat-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(30,43,26,0.12); }

          .nat-photo {
            overflow: hidden;
            border-radius: 16px;
            box-shadow: 0 6px 28px rgba(30,43,26,0.14);
            transition: transform 0.5s cubic-bezier(.16,1,.3,1), box-shadow 0.5s;
            cursor: pointer;
          }
          .nat-photo:hover { transform: scale(1.025); box-shadow: 0 16px 48px rgba(30,43,26,0.2); }

          .nat-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, ${sage}50, ${sage}90, ${sage}50, transparent);
          }

          .nat-btn {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .nat-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 32px ${sage}45; }

          .nat-scroll-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: rgba(255,255,255,0.8);
            margin: 0 auto;
            animation: natScrollPulse 1.8s ease-in-out infinite;
          }

          /* ── Splash ── */
          @keyframes splashFadeOutNat {
            to { opacity: 0; transform: scale(1.02); }
          }
          @keyframes splashCardInNat {
            from { opacity: 0; transform: translateY(24px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          .splash-card-nat { animation: splashCardInNat 0.9s cubic-bezier(.16,1,.3,1) both; }
          .splash-fading-nat { animation: splashFadeOutNat 0.7s cubic-bezier(.4,0,.6,1) forwards; }

          /* ── Gift box ── */
          @keyframes natGiftFloat {
            0%, 100% { transform: translateY(0) rotate(-0.5deg); }
            50%       { transform: translateY(-10px) rotate(0.5deg); }
          }
          @keyframes natGiftGlow {
            0%, 100% { box-shadow: 0 4px 24px ${sage}20; border-color: ${sage}20; }
            50%       { box-shadow: 0 8px 40px ${sage}40; border-color: ${sage}50; }
          }
          .nat-gift-box {
            animation: natGiftFloat 3.5s ease-in-out infinite, natGiftGlow 3.5s ease-in-out infinite;
            cursor: pointer;
            transition: transform 0.3s ease;
          }
          .nat-gift-box:hover {
            animation-play-state: paused;
            transform: scale(1.07) !important;
          }

          /* ── Floating petals/leaves ── */
          @keyframes petalFall {
            0%   { transform: translateX(0) translateY(-20px) rotate(0deg); opacity: 0; }
            10%  { opacity: 0.7; }
            80%  { opacity: 0.5; }
            100% { transform: translateX(var(--drift, 40px)) translateY(110vh) rotate(var(--spin, 360deg)); opacity: 0; }
          }
          .nat-petal {
            position: fixed;
            width: var(--size, 10px);
            height: var(--size, 10px);
            pointer-events: none;
            z-index: 9990;
            animation: petalFall var(--dur, 10s) linear infinite;
            animation-delay: var(--delay, 0s);
          }

          /* ── Shimmer on nat-photo ── */
          @keyframes natSweep {
            0%   { left: -60%; }
            100% { left: 120%; }
          }
          .nat-photo::before {
            content: '';
            position: absolute;
            top: 0; left: -60%;
            width: 35%; height: 100%;
            background: linear-gradient(100deg, transparent, rgba(255,255,255,0.15) 50%, transparent);
            z-index: 2;
            animation: natSweep 3.5s ease-in-out infinite;
            animation-play-state: paused;
          }
          .nat-photo:hover::before { animation-play-state: running; }

          /* ── Pulsing sage glow on divider ── */
          @keyframes sagePulse {
            0%, 100% { opacity: 0.4; }
            50%       { opacity: 1; }
          }
          .nat-divider-anim {
            height: 1px;
            background: linear-gradient(90deg, transparent, ${sage}80, ${sage}, ${sage}80, transparent);
            animation: sagePulse 4s ease-in-out infinite;
          }

          /* ── Sparkle twinkle ── */
          @keyframes natTwinkle {
            0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
            50%       { opacity: 0.8; transform: scale(1) rotate(90deg); }
          }
          .nat-sparkle {
            width: 8px; height: 8px;
            background: ${sage};
            clip-path: polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
            animation: natTwinkle var(--ns-dur, 3s) ease-in-out infinite;
          }

          /* ── Soft glow orb ── */
          @keyframes natOrbDrift {
            0%, 100% { transform: translate(0, 0); opacity: 0.12; }
            50%        { transform: translate(15px, -25px); opacity: 0.22; }
          }
          .nat-orb {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            filter: blur(50px);
            animation: natOrbDrift var(--nor-dur, 14s) ease-in-out infinite;
          }
        `}</style>
      </Head>

      <div
        style={{
          minHeight: '100vh',
          background: cream,
          fontFamily: fontFamily,
          color: textDark,
          overflowX: 'hidden'
        }}
      >
        <NaturePetals />
        {/* ══ Splash Screen ══ */}
        {showSplash && (
          <div
            onClick={handleOpenInvitation}
            className={splashFading ? 'splash-fading-nat' : ''}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9997,
              background: cream,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              cursor: 'pointer'
            }}
          >
            {/* Background botanical deco */}
            <svg
              style={{ position: 'absolute', top: 0, left: 0, width: 280, opacity: 0.06, pointerEvents: 'none' }}
              viewBox='0 0 200 200'
            >
              <path d='M12,188 Q18,52 178,12 Q88,76 12,188Z' fill={sageDark} />
              <path d='M30,188 Q38,80 160,36' stroke={sageDark} strokeWidth='1' fill='none' />
            </svg>
            <svg
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 240,
                opacity: 0.06,
                transform: 'rotate(180deg)',
                pointerEvents: 'none'
              }}
              viewBox='0 0 200 200'
            >
              <path d='M12,188 Q18,52 178,12 Q88,76 12,188Z' fill={sageDark} />
            </svg>

            <div
              className='splash-card-nat nat-card'
              style={{
                maxWidth: 400,
                width: '100%',
                padding: '52px 36px',
                textAlign: 'center',
                position: 'relative',
                border: `1.5px solid ${sage}35`,
                background: 'rgba(255,255,255,0.97)'
              }}
            >
              {/* Botanical corner motifs */}
              <svg
                className='nat-sway'
                style={{
                  position: 'absolute',
                  top: -8,
                  left: -8,
                  width: 90,
                  height: 90,
                  opacity: 0.2,
                  pointerEvents: 'none'
                }}
                viewBox='0 0 100 100'
              >
                <path d='M8,92 Q12,28 88,8 Q44,44 8,92Z' fill={sage} />
                <path d='M18,92 Q22,44 80,22' stroke={sage} strokeWidth='0.8' fill='none' opacity='0.6' />
              </svg>
              <svg
                className='nat-sway nat-d2'
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  width: 80,
                  height: 80,
                  opacity: 0.15,
                  transform: 'scaleX(-1)',
                  pointerEvents: 'none'
                }}
                viewBox='0 0 100 100'
              >
                <path d='M8,92 Q12,28 88,8 Q44,44 8,92Z' fill={sage} />
              </svg>

              {/* Leaf icon */}
              <div style={{ marginBottom: 20 }}>
                <svg width='36' height='36' viewBox='0 0 36 36' fill='none'>
                  <path d='M18,3 Q6,12 6,22a12 12 0 0024 0Q30,12 18,3Z' fill={sage} opacity='0.85' />
                  <path d='M18,34 Q10,26 8,20' stroke={sageLight} strokeWidth='1' fill='none' opacity='0.7' />
                  <path d='M18,34 Q26,26 28,20' stroke={sageLight} strokeWidth='0.8' fill='none' opacity='0.5' />
                </svg>
              </div>

              <p
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: '0.5em',
                  textTransform: 'uppercase',
                  color: `${sage}80`,
                  marginBottom: 28
                }}
              >
                WEDDING INVITATION
              </p>

              <div
                style={{
                  width: 60,
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${sage}, transparent)`,
                  margin: '0 auto 28px'
                }}
              />

              <h2
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: 'clamp(1.6rem, 6vw, 2.4rem)',
                  fontWeight: 600,
                  fontStyle: 'italic',
                  color: textDark,
                  lineHeight: 1.15,
                  marginBottom: 4
                }}
              >
                {mergedContent.groom_name}
              </h2>
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '12px 0' }}
              >
                <div style={{ flex: 1, maxWidth: 60, height: 1, background: `${sage}40` }} />
                <svg width='20' height='20' viewBox='0 0 24 24' fill={sage} opacity='0.7'>
                  <path d='M12,2 Q5,8 5,14a7 7 0 0014 0Q19,8 12,2Z' />
                </svg>
                <div style={{ flex: 1, maxWidth: 60, height: 1, background: `${sage}40` }} />
              </div>
              <h2
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: 'clamp(1.6rem, 6vw, 2.4rem)',
                  fontWeight: 600,
                  fontStyle: 'italic',
                  color: textDark,
                  lineHeight: 1.15,
                  marginBottom: 28
                }}
              >
                {mergedContent.bride_name}
              </h2>

              <div
                style={{
                  width: 60,
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${sage}, transparent)`,
                  margin: '0 auto 24px'
                }}
              />

              {mergedContent.wedding_date && (
                <p
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: 14,
                    fontStyle: 'italic',
                    color: textMid,
                    marginBottom: 36,
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
                className='nat-btn'
                style={{
                  padding: '14px 40px',
                  background: sage,
                  border: 'none',
                  borderRadius: 50,
                  color: '#fff',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  boxShadow: `0 8px 24px ${sage}40`
                }}
              >
                Mở Thiệp
              </button>

              <p style={{ marginTop: 20, fontSize: 11, color: `${sage}50`, letterSpacing: '0.08em' }}>
                Nhấn để mở thiệp
              </p>
            </div>
          </div>
        )}

        {/* ══ Hero ══ */}
        <section
          style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Cover image background */}
          {mergedContent.cover_image ? (
            <div
              className='nat-scale'
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${mergedContent.cover_image})`,
                backgroundSize: 'cover',
                ...(() => {
                  const adj = resolveImageAdjust(mergedContent.cover_image_position, viewport)
                  return {
                    backgroundPosition: adj ? `${adj.x}% ${adj.y}%` : 'center top',
                    ...(adj && adj.zoom !== 1
                      ? { transform: `scale(${adj.zoom})`, transformOrigin: `${adj.x}% ${adj.y}%` }
                      : {})
                  }
                })()
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(160deg, ${sageDark} 0%, ${sage} 60%, ${sageLight} 100%)`
              }}
            />
          )}

          {/* Forest gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: mergedContent.cover_image
                ? `linear-gradient(to bottom, rgba(20,38,22,0.3) 0%, rgba(15,30,18,0.52) 45%, rgba(8,20,10,0.78) 100%)`
                : `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)`
            }}
          />

          {/* SVG botanical corners */}
          <svg
            className='nat-sway'
            style={{
              position: 'absolute',
              top: -8,
              left: -8,
              width: 200,
              height: 200,
              opacity: 0.15,
              pointerEvents: 'none'
            }}
            viewBox='0 0 200 200'
          >
            <path d='M12,188 Q18,52 178,12 Q88,76 12,188Z' fill='white' />
            <path d='M30,188 Q38,80 160,36' stroke='white' strokeWidth='0.8' fill='none' opacity='0.5' />
          </svg>
          <svg
            className='nat-sway nat-d2'
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              width: 180,
              height: 180,
              opacity: 0.12,
              transform: 'scaleX(-1)',
              pointerEvents: 'none'
            }}
            viewBox='0 0 200 200'
          >
            <path d='M12,188 Q18,52 178,12 Q88,76 12,188Z' fill='white' />
          </svg>
          <svg
            style={{
              position: 'absolute',
              bottom: -8,
              left: -8,
              width: 160,
              height: 160,
              opacity: 0.1,
              transform: 'rotate(180deg) scaleX(-1)',
              pointerEvents: 'none'
            }}
            viewBox='0 0 200 200'
          >
            <path d='M12,188 Q18,52 178,12 Q88,76 12,188Z' fill='white' />
          </svg>

          {/* Hero text */}
          <div
            style={{ textAlign: 'center', maxWidth: 720, padding: '80px 28px 100px', position: 'relative', zIndex: 1 }}
          >
            <p
              className='nat-up'
              style={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.55em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.65)',
                marginBottom: 40
              }}
            >
              WEDDING INVITATION
            </p>

            {mergedContent.groom_role && (
              <p
                className='nat-up'
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.85)',
                  marginBottom: 8
                }}
              >
                {mergedContent.groom_role}
              </p>
            )}
            <h1
              className='nat-up nat-d1'
              style={{
                fontFamily: headingFontFamily,
                fontSize: viewport === 'laptop' ? 'clamp(2.8rem, 4vw, 4.5rem)' : 'clamp(1.8rem, 7vw, 3rem)',
                fontWeight: 700,
                fontStyle: 'italic',
                color: '#fff',
                lineHeight: 1.15,
                textShadow: '0 4px 40px rgba(0,0,0,0.35)'
              }}
            >
              {mergedContent.groom_name}
            </h1>

            <div
              className='nat-up nat-d2'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, margin: '22px 0' }}
            >
              <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'rgba(255,255,255,0.35)' }} />
              <svg width='32' height='32' viewBox='0 0 32 32' fill='none'>
                <path d='M16,3 Q7,11 7,18a9 9 0 0018 0Q25,11 16,3Z' fill='rgba(255,255,255,0.85)' />
                <path d='M16,29 Q9,23 7,18' stroke='rgba(255,255,255,0.4)' strokeWidth='1' fill='none' />
              </svg>
              <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'rgba(255,255,255,0.35)' }} />
            </div>

            {mergedContent.bride_role && (
              <p
                className='nat-up nat-d2'
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.85)',
                  marginBottom: 8,
                  marginTop: 8
                }}
              >
                {mergedContent.bride_role}
              </p>
            )}
            <h1
              className='nat-up nat-d3'
              style={{
                fontFamily: headingFontFamily,
                fontSize: viewport === 'laptop' ? 'clamp(2.8rem, 4vw, 4.5rem)' : 'clamp(1.8rem, 7vw, 3rem)',
                fontWeight: 700,
                fontStyle: 'italic',
                color: '#fff',
                lineHeight: 1.15,
                textShadow: '0 4px 40px rgba(0,0,0,0.35)',
                marginBottom: 36
              }}
            >
              {mergedContent.bride_name}
            </h1>

            {mergedContent.wedding_date && (
              <p
                className='nat-up nat-d4'
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: 17,
                  fontStyle: 'italic',
                  color: 'rgba(255,255,255,0.82)',
                  letterSpacing: '0.04em',
                  marginBottom: 10
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
            {mergedContent.address && (
              <p
                className='nat-up nat-d5'
                style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' }}
              >
                {mergedContent.address}
              </p>
            )}

            <div
              className='nat-up nat-d5'
              style={{ marginTop: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            >
              <div
                style={{
                  width: 1,
                  height: 48,
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)'
                }}
              />
              <div className='nat-scroll-dot' />
            </div>
          </div>
        </section>

        {/* ══ Quote ══ */}
        <section
          style={{ padding: '80px 24px', background: `linear-gradient(135deg, ${cream} 0%, ${creamDark} 100%)` }}
        >
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <svg style={{ marginBottom: 32, opacity: 0.5 }} width='28' height='28' viewBox='0 0 28 28' fill={sage}>
              <path d='M14,2 Q5,9 5,16a9 9 0 0018 0Q23,9 14,2Z' />
            </svg>
            <p
              style={{
                fontFamily: "'Lora', serif",
                fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: textMid,
                lineHeight: 2,
                letterSpacing: '0.02em'
              }}
            >
              Hai gia đình trân trọng kính mời quý vị đến chung vui
              <br />
              trong ngày lễ thành hôn của
            </p>
            <p
              style={{
                fontFamily: "'Lora', serif",
                fontSize: 'clamp(1.3rem, 4vw, 1.7rem)',
                fontWeight: 600,
                color: sageDark,
                marginTop: 16,
                letterSpacing: '0.03em'
              }}
            >
              {mergedContent.groom_name} &amp; {mergedContent.bride_name}
            </p>
            <svg
              style={{ marginTop: 32, opacity: 0.5, transform: 'rotate(180deg)' }}
              width='28'
              height='28'
              viewBox='0 0 28 28'
              fill={sage}
            >
              <path d='M14,2 Q5,9 5,16a9 9 0 0018 0Q23,9 14,2Z' />
            </svg>
          </div>
        </section>

        {/* ══ Countdown ══ */}
        {timeRemaining && (
          <section style={{ padding: '80px 20px', background: sageDark, position: 'relative', overflow: 'hidden' }}>
            {/* bg leaf deco */}
            <svg
              style={{
                position: 'absolute',
                bottom: -20,
                right: -20,
                width: 260,
                opacity: 0.07,
                pointerEvents: 'none'
              }}
              viewBox='0 0 200 200'
            >
              <path d='M20,180 Q30,50 180,20 Q90,90 20,180Z' fill='white' />
            </svg>
            <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.5em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.45)',
                  marginBottom: 48
                }}
              >
                ĐẾM NGƯỢC NGÀY VUI
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 1,
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: 20,
                  overflow: 'hidden'
                }}
              >
                {[
                  { label: 'Ngày', value: timeRemaining.days },
                  { label: 'Giờ', value: timeRemaining.hours },
                  { label: 'Phút', value: timeRemaining.minutes },
                  { label: 'Giây', value: timeRemaining.seconds }
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{ padding: '32px 8px', textAlign: 'center', background: 'rgba(0,0,0,0.3)' }}
                  >
                    <div
                      style={{
                        fontFamily: "'Lora', serif",
                        fontSize: 'clamp(2.5rem, 7vw, 4rem)',
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                        color: '#fff',
                        lineHeight: 1,
                        marginBottom: 10
                      }}
                    >
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 500,
                        letterSpacing: '0.22em',
                        color: 'rgba(255,255,255,0.45)',
                        textTransform: 'uppercase'
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
        <section style={{ padding: '90px 20px' }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '0.5em',
                  textTransform: 'uppercase',
                  color: sage,
                  marginBottom: 14
                }}
              >
                THÔNG TIN LỄ CƯỚI
              </p>
              <h2
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: 'clamp(1.6rem, 5vw, 2.5rem)',
                  fontWeight: 600,
                  color: textDark
                }}
              >
                Ngày trọng đại
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
              {[
                {
                  icon: (
                    <svg
                      width='22'
                      height='22'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke={sage}
                      strokeWidth='1.5'
                      strokeLinecap='round'
                    >
                      <rect x='3' y='4' width='18' height='18' rx='2' />
                      <path d='M16 2v4M8 2v4M3 10h18' />
                    </svg>
                  ),
                  title: 'Ngày cưới',
                  value: mergedContent.wedding_date
                    ? new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : null
                },
                {
                  icon: (
                    <svg
                      width='22'
                      height='22'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke={sage}
                      strokeWidth='1.5'
                      strokeLinecap='round'
                    >
                      <circle cx='12' cy='12' r='9' />
                      <path d='M12 7v5l3 3' />
                    </svg>
                  ),
                  title: 'Giờ tổ chức',
                  value: mergedContent.wedding_time
                },
                {
                  icon: (
                    <svg
                      width='22'
                      height='22'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke={sage}
                      strokeWidth='1.5'
                      strokeLinecap='round'
                    >
                      <path d='M12 22s-8-6.5-8-12a8 8 0 0116 0c0 5.5-8 12-8 12Z' />
                      <circle cx='12' cy='10' r='2.5' />
                    </svg>
                  ),
                  title: 'Địa điểm',
                  value: mergedContent.address
                },
                {
                  icon: (
                    <svg
                      width='22'
                      height='22'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke={sage}
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <rect width='18' height='18' x='3' y='4' rx='2' ry='2' />
                      <line x1='16' x2='16' y1='2' y2='6' />
                      <line x1='8' x2='8' y1='2' y2='6' />
                      <line x1='3' x2='21' y1='10' y2='10' />
                      <path d='m9 16 2 2 4-4' />
                    </svg>
                  ),
                  title: 'Lịch âm',
                  value: mergedContent.lunar_date
                }
              ]
                .filter((it) => it.value)
                .map(({ icon, title, value }) => (
                  <div
                    key={title}
                    className='nat-card nat-up'
                    style={{ padding: '28px 24px', display: 'flex', alignItems: 'flex-start', gap: 18 }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        background: `${sage}10`,
                        border: `1px solid ${sage}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {icon}
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: sage,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          marginBottom: 8
                        }}
                      >
                        {title}
                      </p>
                      <p style={{ fontSize: 16, fontWeight: 500, color: textDark, lineHeight: 1.6 }}>{value || '—'}</p>
                    </div>
                  </div>
                ))}
            </div>

            {mergedContent.address && (
              <div
                style={{
                  marginTop: 28,
                  width: '100%',
                  height: 250,
                  borderRadius: 12,
                  overflow: 'hidden',
                  position: 'relative',
                  border: `1px solid rgba(74,124,89,0.12)`
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
        </section>

        {/* ══ Album ══ */}
        {albumImages.length > 0 && (
          <section
            style={{
              padding: '90px 20px',
              background: `linear-gradient(135deg, ${cream} 0%, ${creamDark} 100%)`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Soft orb background */}
            <div
              className='nat-orb'
              style={
                {
                  width: 350,
                  height: 350,
                  background: `radial-gradient(circle,${sage}18,transparent 70%)`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%,-50%)',
                  '--nor-dur': '16s'
                } as React.CSSProperties
              }
            />
            <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: 52 }}>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '0.5em',
                    textTransform: 'uppercase',
                    color: sage,
                    marginBottom: 12
                  }}
                >
                  KHOẢNH KHẮC
                </p>
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}
                >
                  <span
                    className='nat-sparkle'
                    style={{ '--ns-dur': '2.5s', animationDelay: '0.3s', width: 8, height: 8 } as React.CSSProperties}
                  />
                  <h2
                    style={{
                      fontFamily: sectionFontFamily,
                      fontSize: 'clamp(1.6rem, 5vw, 2.5rem)',
                      fontWeight: 600,
                      color: textDark
                    }}
                  >
                    Album cưới
                  </h2>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {albumImages.slice(0, 4).map((img: string, i: number) => {
                  const isLast = i === 3 && albumImages.length > 4
                  const extraCount = albumImages.length - 4
                  return (
                    <div
                      key={i}
                      className='nat-photo'
                      style={{ position: 'relative', aspectRatio: '1' }}
                      onClick={() => {
                        setLightboxIndex(i)
                        setLightboxOpen(true)
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`Ảnh cưới ${i + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'block',
                          ...getImageStyle(resolveImageAdjust(mergedContent.image_positions?.[i], viewport))
                        }}
                      />
                      {isLast && extraCount > 0 && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(30,43,26,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '1.5rem',
                            fontFamily: "'Lora', serif",
                            fontWeight: 600
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
        )}

        {/* ══ Gift / Bank ══ */}
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
            <section style={{ padding: '90px 20px', textAlign: 'center' }}>
              <div style={{ maxWidth: 520, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                  <p
                    style={{
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: '0.5em',
                      textTransform: 'uppercase',
                      color: sage,
                      marginBottom: 12
                    }}
                  >
                    MỪNG CƯỚI
                  </p>
                  <h2
                    style={{
                      fontFamily: "'Lora', serif",
                      fontSize: 'clamp(1.6rem, 5vw, 2.5rem)',
                      fontWeight: 600,
                      color: textDark,
                      marginBottom: 12
                    }}
                  >
                    Tấm lòng thơm thảo
                  </h2>
                  <p
                    style={{
                      color: textMid,
                      fontSize: 14,
                      fontStyle: 'italic',
                      fontFamily: "'Lora', serif",
                      lineHeight: 1.8
                    }}
                  >
                    Sự hiện diện của bạn là món quà quý giá nhất.
                    <br />
                    Nếu muốn gửi tặng thêm, xin trân trọng cảm ơn!
                  </p>
                </div>

                {/* Animated Gift Box */}
                <div
                  className='nat-gift-box nat-card'
                  onClick={() => setShowGiftQr(true)}
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 14,
                    padding: '36px 48px',
                    cursor: 'pointer'
                  }}
                >
                  {/* Gift box SVG with Nature colors */}
                  <svg width='80' height='88' viewBox='0 0 80 88' fill='none'>
                    {/* Box body */}
                    <rect
                      x='8'
                      y='36'
                      width='64'
                      height='48'
                      rx='3'
                      fill={`${sage}15`}
                      stroke={sage}
                      strokeWidth='1.5'
                    />
                    {/* Box lid */}
                    <rect
                      x='4'
                      y='24'
                      width='72'
                      height='16'
                      rx='3'
                      fill={`${sage}25`}
                      stroke={sage}
                      strokeWidth='1.5'
                    />
                    {/* Vertical ribbon */}
                    <rect x='36' y='36' width='8' height='48' fill={`${sage}50`} />
                    {/* Horizontal ribbon on lid */}
                    <rect x='4' y='29' width='72' height='6' fill={`${sage}50`} />
                    {/* Bow left loop */}
                    <ellipse cx='30' cy='20' rx='12' ry='8' fill={sage} opacity='0.75' transform='rotate(-20 30 20)' />
                    {/* Bow right loop */}
                    <ellipse cx='50' cy='20' rx='12' ry='8' fill={sage} opacity='0.75' transform='rotate(20 50 20)' />
                    {/* Bow center with leaf */}
                    <path d='M40,14 Q35,19 40,26 Q45,19 40,14Z' fill={sageLight} />
                    {/* Leaf decorations on box */}
                    <path d='M18,50 Q22,45 26,50 Q22,55 18,50Z' fill={sage} opacity='0.3' />
                    <path d='M54,62 Q58,57 62,62 Q58,67 54,62Z' fill={sage} opacity='0.3' />
                    <path d='M15,68 Q18,64 21,68' stroke={sageLight} strokeWidth='1' fill='none' opacity='0.5' />
                  </svg>

                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.25em',
                      color: sage,
                      textTransform: 'uppercase'
                    }}
                  >
                    Nhấn để xem
                  </p>
                </div>
              </div>

              {/* Gift QR Modal */}
              {showGiftQr && (
                <div
                  onClick={() => setShowGiftQr(false)}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9998,
                    background: 'rgba(20,38,22,0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 24
                  }}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className='nat-card'
                    style={{
                      maxWidth: 360,
                      width: '100%',
                      padding: '40px 28px 32px',
                      textAlign: 'center',
                      position: 'relative'
                    }}
                  >
                    <button
                      onClick={() => setShowGiftQr(false)}
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: `${sage}15`,
                        border: `1px solid ${sage}25`,
                        color: sage,
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

                    {/* Leaf icon */}
                    <div style={{ marginBottom: 16 }}>
                      <svg width='28' height='28' viewBox='0 0 28 28' fill={sage} opacity='0.6'>
                        <path d='M14,2 Q5,9 5,16a9 9 0 0018 0Q23,9 14,2Z' />
                      </svg>
                    </div>

                    <p
                      style={{
                        fontSize: 9,
                        fontWeight: 500,
                        letterSpacing: '0.45em',
                        color: sage,
                        textTransform: 'uppercase',
                        marginBottom: 20
                      }}
                    >
                      MỪNG CƯỚI
                    </p>

                    <div
                      style={{
                        width: 50,
                        height: 1,
                        background: `linear-gradient(90deg, transparent, ${sage}, transparent)`,
                        margin: '0 auto 24px'
                      }}
                    />

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
                            border: `1px solid ${sage}20`,
                            borderRadius: 8,
                            padding: 8,
                            background: '#fff'
                          }}
                        />
                      </div>
                    )}

                    {(bankName || accountNumber || accountName) && (
                      <div style={{ fontSize: 13, color: textMid, lineHeight: 2, marginTop: 8 }}>
                        {bankName && <p style={{ color: sageDark, fontWeight: 600 }}>{bankName}</p>}
                        {accountNumber && (
                          <p
                            style={{
                              fontFamily: "'Lora', serif",
                              fontSize: 18,
                              letterSpacing: '0.08em',
                              color: textDark,
                              fontWeight: 700
                            }}
                          >
                            {accountNumber}
                          </p>
                        )}
                        {accountName && <p style={{ color: textMid }}>{accountName}</p>}
                      </div>
                    )}

                    <div
                      style={{
                        width: 50,
                        height: 1,
                        background: `linear-gradient(90deg, transparent, ${sage}, transparent)`,
                        margin: '20px auto 0'
                      }}
                    />
                  </div>
                </div>
              )}
            </section>
          )
        })()}

        {/* ══ GUESTBOOK ══ */}
        <section
          style={{ padding: '90px 20px', background: `linear-gradient(135deg, ${creamDark} 0%, ${cream} 100%)` }}
        >
          <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.5em',
                textTransform: 'uppercase',
                color: sage,
                marginBottom: 12
              }}
            >
              SỔ LƯU BÚT
            </p>
            <h2
              style={{
                fontFamily: "'Lora', serif",
                fontSize: 'clamp(1.6rem, 5vw, 2.5rem)',
                fontWeight: 600,
                color: textDark,
                marginBottom: 32
              }}
            >
              Lời Chúc Trân Trọng
            </h2>
            <div className='nat-card' style={{ padding: '36px 32px' }}>
              {wishesList.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {wishesList.map((w, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '16px',
                        textAlign: 'left',
                        background: `${sage}10`,
                        borderRadius: 12,
                        borderLeft: `3px solid ${sage}`
                      }}
                    >
                      <p
                        style={{ fontStyle: 'italic', color: textMid, marginBottom: 8, fontSize: 14, lineHeight: 1.6 }}
                      >
                        "{w.wishes}"
                      </p>
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          color: textDark,
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}
                      >
                        - {w.guest_name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: textMid, fontStyle: 'italic' }}>Chưa có lời chúc nào.</p>
              )}
            </div>
          </div>
        </section>

        {/* ══ RSVP ══ */}
        <section style={{ padding: '60px 20px 80px', background: cream }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <RSVPForm
              weddingId={wedding?.id}
              rsvpId={rsvpId}
              guestName={guestName}
              primaryColor={mergedContent.primary_color}
              fontFamily={fontFamily}
              sectionFontFamily={sectionFontFamily}
            />
          </div>
        </section>

        {/* ══ Footer ══ */}
        <footer
          style={{
            padding: '72px 24px 80px',
            textAlign: 'center',
            background: sageDark,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <svg
            style={{ position: 'absolute', bottom: -16, right: -16, width: 220, opacity: 0.07, pointerEvents: 'none' }}
            viewBox='0 0 200 200'
          >
            <path d='M20,180 Q30,50 180,20 Q90,90 20,180Z' fill='white' />
          </svg>
          <svg
            style={{
              position: 'absolute',
              top: -16,
              left: -16,
              width: 180,
              opacity: 0.05,
              transform: 'rotate(180deg)',
              pointerEvents: 'none'
            }}
            viewBox='0 0 200 200'
          >
            <path d='M20,180 Q30,50 180,20 Q90,90 20,180Z' fill='white' />
          </svg>
          <div className='nat-float' style={{ display: 'inline-block', marginBottom: 24, position: 'relative' }}>
            <svg width='32' height='32' viewBox='0 0 32 32' fill='rgba(255,255,255,0.65)'>
              <path d='M16,3 Q7,10 7,18a9 9 0 0018 0Q25,10 16,3Z' />
            </svg>
          </div>
          <p
            style={{
              fontFamily: "'Lora', serif",
              fontSize: 22,
              fontWeight: 600,
              fontStyle: 'italic',
              color: '#fff',
              marginBottom: 8,
              position: 'relative'
            }}
          >
            {mergedContent.groom_name} &amp; {mergedContent.bride_name}
          </p>
          <p
            style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              position: 'relative'
            }}
          >
            MoiMoi Studio
          </p>
        </footer>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(12,24,14,0.95)',
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
              color: 'rgba(255,255,255,0.6)',
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
                background: 'rgba(255,255,255,0.12)',
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
              alt={`Ảnh cưới ${lightboxIndex + 1}`}
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
                background: 'rgba(255,255,255,0.12)',
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
    </>
  )
}
