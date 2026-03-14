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

export default function ProvenceGeneralView({ wedding }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
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

  const lavender = mergedContent.primary_color || '#7c6ea8'
  const lavLight = '#b0a4ce'
  const lavBg = '#f5f0fc'
  const lavCard = '#ede6f8'
  const sage = '#8a9e7a'
  const blush = '#f5e8f0'
  const textDark = '#2e1f3e'
  const textMid = '#6b5880'

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

  if (!wedding)
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: lavBg
        }}
      >
        <h1 style={{ color: lavender, fontFamily: "'Great Vibes', cursive" }}>Không tìm thấy thiệp cưới</h1>
      </div>
    )

  const allAlbumImages: string[] = mergedContent.images?.length > 0 ? mergedContent.images : []
  const albumImages = allAlbumImages.slice(0, 20)

  return (
    <>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Great+Vibes&family=Lato:wght@300;400&family=Playfair+Display:ital@1&display=swap'
          rel='stylesheet'
        />
        <style>{`
          @keyframes pvFade { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
          @keyframes pvSway { 0%,100%{transform:rotate(-3deg) translateY(0)} 50%{transform:rotate(3deg) translateY(-5px)} }
          @keyframes pvDrift { 0%{transform:translate(0,0)} 33%{transform:translate(4px,-6px)} 66%{transform:translate(-3px,-10px)} 100%{transform:translate(0,0)} }
          @keyframes pvZoom { from{transform:scale(1)} to{transform:scale(1.05)} }
          .pv-up{animation:pvFade 0.9s ease forwards;opacity:0}
          .pv-d1{animation-delay:.2s} .pv-d2{animation-delay:.45s} .pv-d3{animation-delay:.7s} .pv-d4{animation-delay:.95s}
          .pv-sway{animation:pvSway 4s ease-in-out infinite;display:inline-block}
          .pv-drift{animation:pvDrift 7s ease-in-out infinite}
          .pv-zoom{animation:pvZoom 13s ease-in-out infinite alternate}
          *{box-sizing:border-box;margin:0;padding:0}
        `}</style>
      </Head>
      <div style={{ background: lavBg, fontFamily: "'Lato', sans-serif", color: textDark, overflowX: 'hidden' }}>
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
          {mergedContent.cover_image ? (
            <div
              className='pv-zoom'
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
                filter: 'brightness(0.55) saturate(0.65) hue-rotate(270deg) brightness(0.8)'
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(160deg, #2e1f3e 0%, ${lavender} 50%, ${lavLight} 100%)`
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to bottom, rgba(46,31,62,0.4) 0%, rgba(124,110,168,0.2) 40%, rgba(46,31,62,0.75) 80%, rgba(46,31,62,0.93) 100%)`
            }}
          />

          {/* Floating lavender sprigs */}
          <div className='pv-drift' style={{ position: 'absolute', top: '10%', right: '6%', opacity: 0.3, zIndex: 1 }}>
            <svg width='30' height='60' viewBox='0 0 30 60' fill='none'>
              <line x1='15' y1='0' x2='15' y2='60' stroke='#c4b4d4' strokeWidth='1' />
              {[10, 20, 30, 40, 50].map((y, i) => (
                <ellipse key={i} cx={i % 2 === 0 ? 10 : 20} cy={y} rx='4' ry='6' fill='#c4b4d4' opacity='0.8' />
              ))}
            </svg>
          </div>
          <div
            className='pv-drift'
            style={{ position: 'absolute', top: '15%', left: '5%', opacity: 0.25, zIndex: 1, animationDelay: '3s' }}
          >
            <svg width='20' height='44' viewBox='0 0 20 44' fill='none'>
              <line x1='10' y1='0' x2='10' y2='44' stroke='#c4b4d4' strokeWidth='0.8' />
              {[8, 16, 24, 32].map((y, i) => (
                <ellipse key={i} cx={i % 2 === 0 ? 6 : 14} cy={y} rx='3' ry='4.5' fill='#c4b4d4' opacity='0.8' />
              ))}
            </svg>
          </div>

          <div style={{ position: 'relative', zIndex: 2, padding: '60px 28px' }}>
            <p
              className='pv-up pv-d1'
              style={{
                fontSize: 9,
                letterSpacing: '0.5em',
                color: 'rgba(196,180,212,0.75)',
                textTransform: 'uppercase',
                marginBottom: 18
              }}
            >
              Avec amour
            </p>
            <div
              className='pv-up pv-d1'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 22 }}
            >
              <div style={{ width: 32, height: 1, background: `rgba(196,180,212,0.4)` }} />
              <svg width='14' height='14' viewBox='0 0 14 14'>
                <path
                  d='M7 1 C5 1 3 3 3 5 C3 8 7 12 7 12 C7 12 11 8 11 5 C11 3 9 1 7 1 Z'
                  fill='rgba(196,180,212,0.7)'
                />
              </svg>
              <div style={{ width: 32, height: 1, background: `rgba(196,180,212,0.4)` }} />
            </div>
            {mergedContent.groom_role && (
              <p
                className='pv-up pv-d1'
                style={{
                  fontSize: 10,
                  letterSpacing: '0.4em',
                  color: 'rgba(196,180,212,0.9)',
                  textTransform: 'uppercase',
                  marginBottom: 6
                }}
              >
                {mergedContent.groom_role}
              </p>
            )}
            <h1
              className='pv-up pv-d2'
              style={{
                fontSize: 'clamp(3rem,13vw,7.5rem)',
                fontFamily: "'Great Vibes', cursive",
                color: '#fff',
                lineHeight: 1.15,
                textShadow: '0 2px 30px rgba(124,110,168,0.5)',
                marginBottom: 4
              }}
            >
              {mergedContent.groom_name || 'Chú Rể'}
            </h1>
            <p
              className='pv-up pv-d2'
              style={{
                fontSize: 12,
                letterSpacing: '0.35em',
                color: 'rgba(196,180,212,0.7)',
                textTransform: 'uppercase',
                margin: '14px 0'
              }}
            >
              &{' '}
            </p>
            {mergedContent.bride_role && (
              <p
                className='pv-up pv-d3'
                style={{
                  fontSize: 10,
                  letterSpacing: '0.4em',
                  color: 'rgba(196,180,212,0.9)',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                  marginTop: 8
                }}
              >
                {mergedContent.bride_role}
              </p>
            )}
            <h1
              className='pv-up pv-d3'
              style={{
                fontSize: 'clamp(3rem,13vw,7.5rem)',
                fontFamily: "'Great Vibes', cursive",
                color: '#fff',
                lineHeight: 1.15,
                textShadow: '0 2px 30px rgba(124,110,168,0.5)',
                marginBottom: 28
              }}
            >
              {mergedContent.bride_name || 'Cô Dâu'}
            </h1>
            <div
              className='pv-up pv-d3'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}
            >
              <div style={{ width: 28, height: 1, background: `rgba(196,180,212,0.35)` }} />
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(196,180,212,0.6)' }} />
              <div style={{ width: 28, height: 1, background: `rgba(196,180,212,0.35)` }} />
            </div>
            {mergedContent.wedding_date && (
              <p
                className='pv-up pv-d4'
                style={{
                  fontSize: 13,
                  letterSpacing: '0.12em',
                  color: 'rgba(255,255,255,0.65)',
                  fontFamily: "'Playfair Display', serif",
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

        {/* ── COUNTDOWN ── */}
        {timeRemaining && (
          <section style={{ background: lavCard, padding: '60px 24px', textAlign: 'center' }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.45em',
                color: lavender,
                textTransform: 'uppercase',
                marginBottom: 28
              }}
            >
              Đếm ngược đến ngày hoa nở
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, maxWidth: 360, margin: '0 auto' }}>
              {[
                { v: timeRemaining.days, l: 'Ngày' },
                { v: timeRemaining.hours, l: 'Giờ' },
                { v: timeRemaining.minutes, l: 'Phút' },
                { v: timeRemaining.seconds, l: 'Giây' }
              ].map((it, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div
                    style={{
                      background: `rgba(124,110,168,0.12)`,
                      border: `1px solid rgba(124,110,168,0.2)`,
                      borderRadius: 12,
                      padding: '14px 6px',
                      marginBottom: 8
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        fontSize: 'clamp(1.8rem,6vw,3rem)',
                        fontFamily: "'Great Vibes', cursive",
                        color: lavender,
                        lineHeight: 1
                      }}
                    >
                      {String(it.v).padStart(2, '0')}
                    </span>
                  </div>
                  <p style={{ fontSize: 9, letterSpacing: '0.25em', color: textMid, textTransform: 'uppercase' }}>
                    {it.l}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── STORY ── */}
        <section style={{ background: lavBg, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 22 }}>
              <div style={{ width: 28, height: 1, background: `rgba(124,110,168,0.35)` }} />
              <svg width='16' height='16' viewBox='0 0 16 16'>
                <path
                  d='M8 1 C5.5 1 3 3.5 3 6 C3 9.5 8 14 8 14 C8 14 13 9.5 13 6 C13 3.5 10.5 1 8 1 Z'
                  fill={lavender}
                  opacity='0.55'
                />
              </svg>
              <div style={{ width: 28, height: 1, background: `rgba(124,110,168,0.35)` }} />
            </div>
            <h2
              style={{
                fontSize: 'clamp(2rem,7vw,3.8rem)',
                fontFamily: "'Great Vibes', cursive",
                color: lavender,
                marginBottom: 16
              }}
            >
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.9, color: textMid }}>
              {mergedContent.intro_text ||
                'Như hoa lavande nở rộ dưới nắng Provence, tình yêu của chúng tôi nở trong từng khoảnh khắc bình yên. Chúng tôi mời bạn cùng chứng kiến khoảnh khắc đẹp nhất trong cuộc đời mình.'}
            </p>
          </div>
        </section>

        {/* ── EVENT DETAILS ── */}
        <section style={{ background: lavCard, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p
                style={{
                  fontSize: 9,
                  letterSpacing: '0.45em',
                  color: lavender,
                  textTransform: 'uppercase',
                  marginBottom: 10
                }}
              >
                Ngày trọng đại
              </p>
              <h2 style={{ fontSize: 'clamp(2rem,7vw,3.5rem)', fontFamily: "'Great Vibes', cursive", color: textDark }}>
                Lễ thành hôn
              </h2>
            </div>
            {[
              { label: 'Ngày cưới', value: mergedContent.event_date || mergedContent.wedding_date },
              { label: 'Giờ lễ', value: mergedContent.wedding_time },
              { label: 'Địa điểm', value: mergedContent.address },
              { label: 'Lịch âm', value: mergedContent.lunar_date }
            ]
              .filter((it) => it.value)
              .map((it, i) => (
                <div key={i} style={{ padding: '16px 0', borderBottom: `1px solid rgba(124,110,168,0.14)` }}>
                  <p
                    style={{
                      fontSize: 9,
                      letterSpacing: '0.3em',
                      color: lavender,
                      textTransform: 'uppercase',
                      marginBottom: 4
                    }}
                  >
                    {it.label}
                  </p>
                  <p style={{ fontSize: 15, color: textDark, lineHeight: 1.5 }}>{it.value}</p>
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
                  border: `1px solid rgba(124,110,168,0.2)`
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
          <section style={{ background: lavBg, padding: '72px 24px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.4em',
                    color: lavender,
                    textTransform: 'uppercase',
                    marginBottom: 8
                  }}
                >
                  Kỷ niệm
                </p>
                <h2
                  style={{ fontSize: 'clamp(2rem,6vw,3.2rem)', fontFamily: "'Great Vibes', cursive", color: textDark }}
                >
                  Album ảnh cưới
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {albumImages.slice(0, 4).map((img: string, i: number) => {
                  const isLast = i === 3
                  const extraCount = albumImages.length - 4
                  return (
                    <div
                      key={i}
                      style={{
                        position: 'relative',
                        aspectRatio: '1',
                        overflow: 'hidden',
                        borderRadius: 16,
                        boxShadow: `0 6px 20px rgba(124,110,168,0.18)`,
                        border: `3px solid rgba(124,110,168,0.12)`
                      }}
                    >
                      <img
                        src={img}
                        alt=''
                        style={{
                          width: '100%',
                          height: '100%',
                          filter: 'saturate(0.88) brightness(1.02)',
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
                            color: '#fff',
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
          <section style={{ background: lavCard, padding: '72px 24px' }}>
            <div style={{ maxWidth: 420, margin: '0 auto', textAlign: 'center' }}>
              <p
                style={{
                  fontSize: 9,
                  letterSpacing: '0.4em',
                  color: lavender,
                  textTransform: 'uppercase',
                  marginBottom: 14
                }}
              >
                Hộp mừng cưới
              </p>
              <h2
                style={{
                  fontSize: 'clamp(2rem,6vw,3rem)',
                  fontFamily: "'Great Vibes', cursive",
                  color: textDark,
                  marginBottom: 28
                }}
              >
                Với tấm lòng trân trọng
              </h2>
              <div
                style={{
                  border: `1px solid rgba(124,110,168,0.2)`,
                  borderRadius: 16,
                  padding: '28px 20px',
                  background: lavBg
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
                    <p style={{ fontSize: 20, color: textDark, letterSpacing: '0.1em' }}>
                      {mergedContent.account_number}
                    </p>
                  )
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── GUESTBOOK ── */}
        <section style={{ background: lavBg, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.45em',
                color: lavender,
                textTransform: 'uppercase',
                marginBottom: 10
              }}
            >
              Sổ Lưu Bút
            </p>
            <h2
              style={{
                fontSize: 'clamp(2rem,6vw,3.2rem)',
                fontFamily: "'Great Vibes', cursive",
                color: textDark,
                marginBottom: 28
              }}
            >
              Lời Chúc Trân Trọng
            </h2>
            <div
              style={{
                border: `1px solid rgba(124,110,168,0.2)`,
                borderRadius: 16,
                padding: '28px 20px',
                background: lavCard
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
                        background: lavBg,
                        borderRadius: 12,
                        borderLeft: `3px solid ${lavender}`
                      }}
                    >
                      <p
                        style={{ fontStyle: 'italic', color: textMid, marginBottom: 8, fontSize: 14, lineHeight: 1.6 }}
                      >
                        "{w.wishes}"
                      </p>
                      <p
                        style={{
                          fontFamily: "'Lato', sans-serif",
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
        <section style={{ background: lavender, padding: '52px 24px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: 'clamp(2rem,7vw,4rem)',
              fontFamily: "'Great Vibes', cursive",
              color: '#fff',
              marginBottom: 8
            }}
          >
            {mergedContent.groom_name} & {mergedContent.bride_name}
          </p>
          {mergedContent.wedding_date && (
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.35em',
                color: 'rgba(255,255,255,0.65)',
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
              color: 'rgba(255,255,255,0.3)',
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
