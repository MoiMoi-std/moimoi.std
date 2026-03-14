import Head from 'next/head'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { TemplateProps } from '../TemplateRegistry'
import { getImageStyle, resolveImageAdjust } from '../../lib/imageUtils'
import { useTemplateViewport } from '../../lib/TemplateViewportContext'
import { useMapEmbed } from '../../lib/useMapEmbed'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function OrientalGeneralView({ wedding }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [lanternPos, setLanternPos] = useState(0)
  const viewport = useTemplateViewport()
  const [wishesList, setWishesList] = useState<any[]>([])

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

  const darkRed = '#5c0a0a'
  const red = mergedContent.primary_color || '#8b1a1a'
  const goldDark = '#b08010'
  const gold = '#d4a830'
  const goldLight = '#f0cc60'
  const ricePaper = '#fdf5e4'
  const riceDark = '#f0e4c4'
  const jade = '#2d6e50'
  const textDark = '#1a0a0a'
  const textMid = '#6a3a1a'

  useEffect(() => {
    if (!mergedContent.wedding_date) return
    const interval = setInterval(() => {
      const d = new Date(`${mergedContent.wedding_date}T${mergedContent.wedding_time || '00:00'}`)
      const diff = d.getTime() - Date.now()
      if (diff > 0) {
        setTimeRemaining({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000)
        })
      } else setTimeRemaining(null)
    }, 1000)
    return () => clearInterval(interval)
  }, [mergedContent.wedding_date, mergedContent.wedding_time])

  useEffect(() => {
    const anim = setInterval(() => {
      setLanternPos((p) => (p + 0.5) % 360)
    }, 50)
    return () => clearInterval(anim)
  }, [])

  if (!wedding)
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: darkRed
        }}
      >
        <h1 style={{ color: gold, fontFamily: "'Noto Serif SC', serif" }}>Không tìm thấy thiệp cưới</h1>
      </div>
    )

  const allAlbumImages: string[] = mergedContent.images?.length > 0 ? mergedContent.images : []
  const albumImages = allAlbumImages.slice(0, 20)

  const lotusPath = `M12 2 C10 4 9 7 12 9 C15 7 14 4 12 2Z M12 2 C10 0 7 1 6 4 C8 6 11 5 12 2Z M12 2 C14 0 17 1 18 4 C16 6 13 5 12 2Z M12 9 C11 11 10 14 12 16 C14 14 13 11 12 9Z M7 5 C5 6 3 9 5 11 C7 10 8 7 7 5Z M17 5 C19 6 21 9 19 11 C17 10 16 7 17 5Z`

  return (
    <>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500&family=Be+Vietnam+Pro:wght@300;400&display=swap'
          rel='stylesheet'
        />
        <style>{`
          @keyframes orFade { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes orGlow { 0%,100%{text-shadow:0 0 20px rgba(212,168,48,0.2)} 50%{text-shadow:0 0 50px rgba(212,168,48,0.6),0 0 100px rgba(212,168,48,0.3)} }
          @keyframes orFloat { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-12px) rotate(3deg)} }
          @keyframes orZoom { from{transform:scale(1)} to{transform:scale(1.05)} }
          .or-up{animation:orFade .9s ease forwards;opacity:0}
          .or-d1{animation-delay:.25s} .or-d2{animation-delay:.55s} .or-d3{animation-delay:.85s} .or-d4{animation-delay:1.1s}
          .or-glow{animation:orGlow 2.5s ease-in-out infinite}
          .or-up.or-glow.or-d2{animation:orFade .9s .55s ease forwards, orGlow 2.5s 1.45s ease-in-out infinite}
          .or-up.or-glow.or-d3{animation:orFade .9s .85s ease forwards, orGlow 2.5s 1.75s ease-in-out infinite}
          .or-float{animation:orFloat 4s ease-in-out infinite}
          .or-zoom{animation:orZoom 13s ease-in-out infinite alternate}
          *{box-sizing:border-box;margin:0;padding:0}
        `}</style>
      </Head>
      <div
        style={{
          background: ricePaper,
          fontFamily: "'Be Vietnam Pro', sans-serif",
          color: textDark,
          overflowX: 'hidden'
        }}
      >
        {/* ── HERO ── */}
        <section
          style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            textAlign: 'center'
          }}
        >
          {mergedContent.cover_image && (
            <div
              className='or-zoom'
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${mergedContent.cover_image})`,
                backgroundSize: 'cover',
                ...(() => {
                  const adj = resolveImageAdjust(mergedContent.cover_image_position, viewport)
                  return {
                    backgroundPosition: adj ? `${adj.x}% ${adj.y}%` : 'center',
                    ...(adj && adj.zoom !== 1
                      ? { transform: `scale(${adj.zoom})`, transformOrigin: `${adj.x}% ${adj.y}%` }
                      : {})
                  }
                })(),
                filter: 'brightness(0.35) saturate(0.7) sepia(0.3)'
              }}
            />
          )}
          {!mergedContent.cover_image && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(160deg, ${darkRed} 0%, ${red} 40%, #3a0a0a 100%)`
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to bottom, rgba(92,10,10,0.55) 0%, rgba(92,10,10,0.15) 40%, rgba(92,10,10,0.7) 75%, rgba(92,10,10,0.95) 100%)`
            }}
          />

          {/* Cloud border top */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: `linear-gradient(to right, ${gold}, ${goldLight}, ${gold})`,
              opacity: 0.7
            }}
          />

          {/* Floating lanterns */}
          <div className='or-float' style={{ position: 'absolute', top: '8%', left: '8%', zIndex: 1, opacity: 0.55 }}>
            <svg width='28' height='40' viewBox='0 0 28 40'>
              <ellipse cx='14' cy='20' rx='10' ry='14' fill={red} />
              <ellipse cx='14' cy='20' rx='6' ry='10' fill={goldLight} opacity='0.3' />
              <rect x='12' y='1' width='4' height='5' rx='2' fill={gold} />
              <rect x='12' y='34' width='4' height='6' rx='2' fill={gold} />
              <line x1='14' y1='40' x2='12' y2='45' stroke={gold} strokeWidth='0.8' />
              <line x1='14' y1='40' x2='16' y2='45' stroke={gold} strokeWidth='0.8' />
            </svg>
          </div>
          <div
            className='or-float'
            style={{ position: 'absolute', top: '12%', right: '10%', zIndex: 1, opacity: 0.45, animationDelay: '1.5s' }}
          >
            <svg width='22' height='32' viewBox='0 0 22 32'>
              <ellipse cx='11' cy='16' rx='8' ry='11' fill={gold} />
              <ellipse cx='11' cy='16' rx='5' ry='8' fill={goldLight} opacity='0.35' />
              <rect x='9' y='1' width='4' height='4' rx='2' fill={goldDark} />
              <rect x='9' y='27' width='4' height='5' rx='2' fill={goldDark} />
            </svg>
          </div>

          <div style={{ position: 'relative', zIndex: 2, padding: '60px 28px' }}>
            {/* Lotus ornament */}
            <div className='or-up or-d1' style={{ marginBottom: 20 }}>
              <svg width='60' height='36' viewBox='0 0 24 18' fill='none'>
                <path d='M12 4 C11 2 9 1 7 2 C8 4 10 5 12 4Z' fill={gold} opacity='0.8' />
                <path d='M12 4 C13 2 15 1 17 2 C16 4 14 5 12 4Z' fill={gold} opacity='0.8' />
                <path d='M12 4 C10 3 8 5 8 8 C10 8 11 6 12 4Z' fill={goldLight} opacity='0.7' />
                <path d='M12 4 C14 3 16 5 16 8 C14 8 13 6 12 4Z' fill={goldLight} opacity='0.7' />
                <path d='M12 4 C12 6 12 10 12 12' stroke={gold} strokeWidth='0.6' />
                <path d='M6 10 Q12 6 18 10' stroke={gold} strokeWidth='0.5' fill='none' />
              </svg>
            </div>

            <div
              className='or-up or-d1'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14 }}
            >
              <div style={{ width: 36, height: 1, background: `rgba(212,168,48,0.5)` }} />
              <div style={{ width: 4, height: 4, background: gold, transform: 'rotate(45deg)', opacity: 0.8 }} />
              <div style={{ width: 36, height: 1, background: `rgba(212,168,48,0.5)` }} />
            </div>
            <p
              className='or-up or-d1'
              style={{
                fontSize: 9,
                letterSpacing: '0.55em',
                color: gold,
                textTransform: 'uppercase',
                marginBottom: 20,
                fontFamily: "'Noto Serif SC', serif"
              }}
            >
              Trân trọng kính mời
            </p>
            {mergedContent.groom_role && (
              <p
                className='or-up or-d1'
                style={{
                  fontSize: 10,
                  letterSpacing: '0.4em',
                  color: gold,
                  textTransform: 'uppercase',
                  marginBottom: 6
                }}
              >
                {mergedContent.groom_role}
              </p>
            )}
            <h1
              className='or-up or-glow or-d2'
              style={{
                fontSize: 'clamp(2.8rem,11vw,6.5rem)',
                fontFamily: "'Noto Serif SC', serif",
                fontWeight: 400,
                color: goldLight,
                lineHeight: 1,
                marginBottom: 10,
                letterSpacing: '0.03em'
              }}
            >
              {mergedContent.groom_name || 'Chú Rể'}
            </h1>
            <div
              className='or-up or-d2'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, margin: '16px 0' }}
            >
              <div style={{ width: 32, height: 1, background: `rgba(212,168,48,0.5)` }} />
              <svg width='20' height='20' viewBox='0 0 20 20'>
                <path
                  d='M10 2 C7 2 4 5 4 8 C4 13 10 18 10 18 C10 18 16 13 16 8 C16 5 13 2 10 2 Z'
                  fill='none'
                  stroke={gold}
                  strokeWidth='0.8'
                />
                <circle cx='10' cy='8' r='2' fill={gold} opacity='0.7' />
              </svg>
              <div style={{ width: 32, height: 1, background: `rgba(212,168,48,0.5)` }} />
            </div>
            {mergedContent.bride_role && (
              <p
                className='or-up or-d2'
                style={{
                  fontSize: 10,
                  letterSpacing: '0.4em',
                  color: gold,
                  textTransform: 'uppercase',
                  marginBottom: 6,
                  marginTop: 8
                }}
              >
                {mergedContent.bride_role}
              </p>
            )}
            <h1
              className='or-up or-glow or-d3'
              style={{
                fontSize: 'clamp(2.8rem,11vw,6.5rem)',
                fontFamily: "'Noto Serif SC', serif",
                fontWeight: 400,
                color: goldLight,
                lineHeight: 1,
                marginBottom: 28,
                letterSpacing: '0.03em'
              }}
            >
              {mergedContent.bride_name || 'Cô Dâu'}
            </h1>
            <div
              className='or-up or-d3'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}
            >
              <div style={{ width: 36, height: 1, background: `rgba(212,168,48,0.5)` }} />
              <div style={{ width: 4, height: 4, background: gold, transform: 'rotate(45deg)', opacity: 0.8 }} />
              <div style={{ width: 36, height: 1, background: `rgba(212,168,48,0.5)` }} />
            </div>
            {mergedContent.wedding_date && (
              <p
                className='or-up or-d4'
                style={{
                  fontSize: 13,
                  letterSpacing: '0.12em',
                  color: `rgba(240,204,96,0.75)`,
                  fontFamily: "'Noto Serif SC', serif"
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

          {/* Bottom gold border */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(to right, ${gold}, ${goldLight}, ${gold})`,
              opacity: 0.5
            }}
          />
        </section>

        {/* ── COUNTDOWN ── */}
        {timeRemaining && (
          <section style={{ background: darkRed, padding: '60px 24px', textAlign: 'center' }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.5em',
                color: gold,
                textTransform: 'uppercase',
                fontFamily: "'Noto Serif SC', serif",
                marginBottom: 28
              }}
            >
              Đếm ngược ngày hỷ sự
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, maxWidth: 360, margin: '0 auto' }}>
              {[
                { v: timeRemaining.days, l: 'Ngày' },
                { v: timeRemaining.hours, l: 'Giờ' },
                { v: timeRemaining.minutes, l: 'Phút' },
                { v: timeRemaining.seconds, l: 'Giây' }
              ].map((it, i) => (
                <div key={i} style={{ flex: 1 }}>
                  <div
                    style={{
                      background: 'rgba(212,168,48,0.08)',
                      border: `1px solid rgba(212,168,48,0.35)`,
                      borderRadius: 4,
                      padding: '16px 4px',
                      marginBottom: 8
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontSize: 'clamp(1.8rem,6vw,3rem)',
                        fontFamily: "'Noto Serif SC', serif",
                        color: goldLight,
                        lineHeight: 1
                      }}
                    >
                      {String(it.v).padStart(2, '0')}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 9,
                      letterSpacing: '0.25em',
                      color: 'rgba(212,168,48,0.65)',
                      textTransform: 'uppercase'
                    }}
                  >
                    {it.l}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── STORY ── */}
        <section style={{ background: ricePaper, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ width: 36, height: 1, background: `rgba(212,168,48,0.5)` }} />
              <div style={{ width: 5, height: 5, background: gold, transform: 'rotate(45deg)' }} />
              <div style={{ width: 36, height: 1, background: `rgba(212,168,48,0.5)` }} />
            </div>
            <h2
              style={{
                fontSize: 'clamp(1.8rem,6vw,3.2rem)',
                fontFamily: "'Noto Serif SC', serif",
                color: red,
                marginBottom: 20
              }}
            >
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.9, color: textMid }}>
              {mergedContent.intro_text ||
                'Với tất cả tình yêu và sự trân trọng từ hai gia đình, chúng tôi kính mời quý vị đến chung vui ngày hỷ sự của chúng tôi. Hạnh phúc sẽ được nhân đôi khi có sự hiện diện của quý vị.'}
            </p>
          </div>
        </section>

        {/* ── PARENTS ── */}
        {(mergedContent.groom_father || mergedContent.bride_father) && (
          <section style={{ background: riceDark, padding: '56px 24px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <p
                style={{
                  fontSize: 9,
                  letterSpacing: '0.45em',
                  color: gold,
                  textTransform: 'uppercase',
                  fontFamily: "'Noto Serif SC', serif",
                  marginBottom: 28,
                  textAlign: 'center'
                }}
              >
                Gia đình thông gia
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { side: 'Nhà trai', father: mergedContent.groom_father, mother: mergedContent.groom_mother },
                  { side: 'Nhà gái', father: mergedContent.bride_father, mother: mergedContent.bride_mother }
                ].map((fam, i) => (
                  <div
                    key={i}
                    style={{
                      border: `1px solid rgba(212,168,48,0.3)`,
                      borderRadius: 4,
                      padding: 16,
                      textAlign: 'center',
                      background: ricePaper
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10,
                        letterSpacing: '0.25em',
                        color: red,
                        textTransform: 'uppercase',
                        fontFamily: "'Noto Serif SC', serif",
                        marginBottom: 10
                      }}
                    >
                      {fam.side}
                    </p>
                    {fam.father && <p style={{ fontSize: 13, color: textDark, marginBottom: 4 }}>{fam.father}</p>}
                    {fam.mother && <p style={{ fontSize: 13, color: textDark }}>{fam.mother}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── EVENT DETAILS ── */}
        <section style={{ background: darkRed, padding: '72px 24px', position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              top: -40,
              right: -40,
              width: 150,
              height: 150,
              borderRadius: '50%',
              border: `1px solid rgba(212,168,48,0.15)`
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 120,
              height: 120,
              borderRadius: '50%',
              border: `1px solid rgba(212,168,48,0.1)`
            }}
          />
          <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p
                style={{
                  fontSize: 9,
                  letterSpacing: '0.5em',
                  color: gold,
                  textTransform: 'uppercase',
                  fontFamily: "'Noto Serif SC', serif",
                  marginBottom: 10
                }}
              >
                Kính mời quý vị
              </p>
              <h2
                style={{ fontSize: 'clamp(1.6rem,5vw,2.6rem)', fontFamily: "'Noto Serif SC', serif", color: goldLight }}
              >
                Lễ thành hôn
              </h2>
            </div>
            {[
              { label: 'Ngày lành', value: mergedContent.event_date || mergedContent.wedding_date },
              { label: 'Giờ đẹp', value: mergedContent.wedding_time },
              { label: 'Địa điểm', value: mergedContent.address },
              { label: 'Lịch âm', value: mergedContent.lunar_date }
            ]
              .filter((it) => it.value)
              .map((it, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 14,
                    padding: '14px 0',
                    borderBottom: `1px solid rgba(212,168,48,0.12)`
                  }}
                >
                  <div style={{ width: 3, background: gold, borderRadius: 2, flexShrink: 0, opacity: 0.7 }} />
                  <div>
                    <p
                      style={{
                        fontSize: 9,
                        letterSpacing: '0.3em',
                        color: gold,
                        textTransform: 'uppercase',
                        fontFamily: "'Noto Serif SC', serif",
                        marginBottom: 3
                      }}
                    >
                      {it.label}
                    </p>
                    <p style={{ fontSize: 15, color: ricePaper }}>{it.value}</p>
                  </div>
                </div>
              ))}
            {mergedContent.address && (
              <div
                style={{
                  marginTop: 28,
                  width: '100%',
                  height: 250,
                  borderRadius: 12,
                  overflow: 'hidden',
                  position: 'relative',
                  border: `1px solid rgba(212,168,48,0.3)`
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

        {/* ── ALBUM ── */}
        {albumImages.length > 0 && (
          <section style={{ background: ricePaper, padding: '72px 24px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.45em',
                    color: gold,
                    textTransform: 'uppercase',
                    fontFamily: "'Noto Serif SC', serif",
                    marginBottom: 8
                  }}
                >
                  Album ảnh
                </p>
                <h2 style={{ fontSize: 'clamp(1.6rem,5vw,2.6rem)', fontFamily: "'Noto Serif SC', serif", color: red }}>
                  Kỷ niệm đáng nhớ
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {albumImages.slice(0, 4).map((img: string, i: number) => {
                  const isLast = i === 3
                  const extraCount = albumImages.length - 4
                  return (
                    <div
                      key={i}
                      style={{
                        position: 'relative',
                        aspectRatio: '3/4',
                        overflow: 'hidden',
                        border: `2px solid rgba(212,168,48,0.4)`,
                        boxShadow: '0 4px 16px rgba(92,10,10,0.15)'
                      }}
                    >
                      <img
                        src={img}
                        alt=''
                        style={{
                          width: '100%',
                          height: '100%',
                          filter: 'sepia(0.15) saturate(1.05)',
                          ...getImageStyle(resolveImageAdjust(mergedContent.image_positions?.[i], viewport))
                        }}
                      />
                      {isLast && extraCount > 0 && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: goldLight,
                            fontSize: '1.5rem',
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

        {/* ── GIFT ── */}
        {(mergedContent.bank_name || mergedContent.account_number || mergedContent.qr_image) && (
          <section style={{ background: riceDark, padding: '72px 24px' }}>
            <div style={{ maxWidth: 420, margin: '0 auto', textAlign: 'center' }}>
              <p
                style={{
                  fontSize: 9,
                  letterSpacing: '0.45em',
                  color: gold,
                  textTransform: 'uppercase',
                  fontFamily: "'Noto Serif SC', serif",
                  marginBottom: 14
                }}
              >
                Hộp phong bì mừng cưới
              </p>
              <h2
                style={{
                  fontSize: 'clamp(1.6rem,5vw,2.4rem)',
                  fontFamily: "'Noto Serif SC', serif",
                  color: red,
                  marginBottom: 8
                }}
              >
                Tấm lòng quý khách
              </h2>
              <p style={{ fontSize: 13, color: textMid, marginBottom: 28, fontStyle: 'italic' }}>
                Sự hiện diện của quý vị là niềm vui lớn nhất của đôi uyên ương.
              </p>
              <div
                style={{
                  border: `1px solid rgba(212,168,48,0.4)`,
                  borderRadius: 4,
                  padding: '24px 20px',
                  background: ricePaper,
                  boxShadow: `inset 0 0 0 3px rgba(212,168,48,0.08)`
                }}
              >
                {mergedContent.qr_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mergedContent.qr_image}
                    alt='QR Tiền Mừng'
                    style={{ width: 180, height: 180, objectFit: 'contain', margin: '12px auto 0', display: 'block' }}
                  />
                ) : (
                  mergedContent.account_number && (
                    <p
                      style={{
                        fontSize: 22,
                        color: textDark,
                        letterSpacing: '0.08em',
                        fontFamily: "'Noto Serif SC', serif"
                      }}
                    >
                      {mergedContent.account_number}
                    </p>
                  )
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── GUESTBOOK ── */}
        <section style={{ background: darkRed, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.45em',
                color: gold,
                textTransform: 'uppercase',
                fontFamily: "'Noto Serif SC', serif",
                marginBottom: 10
              }}
            >
              Sổ Lưu Bút
            </p>
            <h2
              style={{
                fontSize: 'clamp(1.6rem,5vw,2.4rem)',
                fontFamily: "'Noto Serif SC', serif",
                color: goldLight,
                marginBottom: 28
              }}
            >
              Lời Chúc Trân Trọng
            </h2>
            <div
              style={{
                border: `1px solid rgba(212,168,48,0.4)`,
                borderRadius: 4,
                padding: '24px 20px',
                background: ricePaper,
                boxShadow: `inset 0 0 0 3px rgba(212,168,48,0.08)`
              }}
            >
              {wishesList.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {wishesList.map((w, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '16px',
                        textAlign: 'left',
                        background: riceDark,
                        borderRadius: 4,
                        borderLeft: `3px solid ${red}`
                      }}
                    >
                      <p
                        style={{ fontStyle: 'italic', color: textMid, marginBottom: 8, fontSize: 14, lineHeight: 1.6 }}
                      >
                        "{w.wishes}"
                      </p>
                      <p
                        style={{
                          fontFamily: "'Be Vietnam Pro', sans-serif",
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

        {/* ── FOOTER ── */}
        <section
          style={{
            background: darkRed,
            borderTop: `2px solid rgba(212,168,48,0.3)`,
            padding: '52px 24px',
            textAlign: 'center'
          }}
        >
          <svg width='40' height='24' viewBox='0 0 24 14' fill='none' style={{ marginBottom: 16 }}>
            <path d='M12 2 C11 1 9.5 0.5 8 1 C9 2.5 10.5 3.5 12 2Z' fill={gold} opacity='0.7' />
            <path d='M12 2 C13 1 14.5 0.5 16 1 C15 2.5 13.5 3.5 12 2Z' fill={gold} opacity='0.7' />
            <path d='M9 3 C8 3 6.5 5 7 7 C8.5 6.5 9.5 4.5 9 3Z' fill={goldLight} opacity='0.6' />
            <path d='M15 3 C16 3 17.5 5 17 7 C15.5 6.5 14.5 4.5 15 3Z' fill={goldLight} opacity='0.6' />
            <line x1='12' y1='2' x2='12' y2='10' stroke={gold} strokeWidth='0.5' opacity='0.6' />
            <ellipse cx='12' cy='11' rx='5' ry='2' fill='none' stroke={gold} strokeWidth='0.5' opacity='0.4' />
          </svg>
          <p
            style={{
              fontSize: 'clamp(1.2rem,4vw,2rem)',
              fontFamily: "'Noto Serif SC', serif",
              color: goldLight,
              marginBottom: 6
            }}
          >
            {mergedContent.groom_name} & {mergedContent.bride_name}
          </p>
          {mergedContent.wedding_date && (
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.3em',
                color: `rgba(212,168,48,0.5)`,
                textTransform: 'uppercase'
              }}
            >
              {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
          <p
            style={{
              fontSize: 8,
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.15)',
              marginTop: 24,
              textTransform: 'uppercase'
            }}
          >
            Made with love · MoiMoi Studio
          </p>
        </section>
      </div>
    </>
  )
}
