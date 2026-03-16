import Head from 'next/head'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import RSVPForm from '@/components/guest/RSVPForm'
import { TemplateProps } from '../TemplateRegistry'
import { getImageStyle, resolveImageAdjust } from '../../lib/imageUtils'
import { useTemplateViewport } from '../../lib/TemplateViewportContext'
import { useMapEmbed } from '../../lib/useMapEmbed'

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

export default function BohoGuestView({ wedding, guestName, rsvpId }: TemplateProps) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const viewport = useTemplateViewport()
  const [wishesList, setWishesList] = useState<any[]>([])
  const [showGiftQr, setShowGiftQr] = useState(false)

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
  const fontFamily = mergedContent.font_family || ''
  const sectionFontFamily = mergedContent.section_font_family || fontFamily

  const terra = mergedContent.primary_color || '#b8613a'
  const terraLight = '#d4896a'
  const sand = '#e8d4ad'
  const cream = '#fdf6ec'
  const creamDark = '#f5ead4'
  const olive = '#7a8c5e'
  const textDark = '#2d1f0e'
  const textMid = '#7a5c3a'

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
          background: cream
        }}
      >
        <h1 style={{ color: terra, fontFamily: "'Sacramento', cursive" }}>Không tìm thấy thiệp cưới</h1>
      </div>
    )

  const allAlbumImages: string[] = mergedContent.images?.length > 0 ? mergedContent.images : []
  const albumImages = allAlbumImages.slice(0, 20)

  return (
    <>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Sacramento&family=Josefin+Sans:wght@300;400&family=Playfair+Display:ital@1&display=swap'
          rel='stylesheet'
        />
        <style>{`
          @keyframes bohoSway { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2deg)} }
          @keyframes bohoFade { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
          @keyframes bohoDrift { 0%{transform:translate(0,0) rotate(0deg)} 50%{transform:translate(4px,-8px) rotate(3deg)} 100%{transform:translate(0,0) rotate(0deg)} }
          .bh-up{animation:bohoFade 0.9s ease forwards;opacity:0}
          .bh-d1{animation-delay:.25s} .bh-d2{animation-delay:.5s} .bh-d3{animation-delay:.75s} .bh-d4{animation-delay:1s}
          .bh-sway{animation:bohoSway 5s ease-in-out infinite;transform-origin:top center}
          .bh-drift{animation:bohoDrift 6s ease-in-out infinite}
          
          .gift-card-boho {
            background: ${cream};
            border: 1.5px dashed ${terra}66;
            border-radius: 16px;
            transition: all 0.3s ease;
            cursor: pointer;
            box-shadow: 0 8px 24px rgba(45,31,14,0.06);
          }
          .gift-card-boho:hover {
            transform: translateY(-4px);
            border-style: solid;
            border-color: ${terra};
            box-shadow: 0 12px 32px rgba(45,31,14,0.12);
          }
          
          *{box-sizing:border-box;margin:0;padding:0}
        `}</style>
      </Head>
      <div
        style={{ background: cream, fontFamily: "'Josefin Sans', sans-serif", color: textDark, overflowX: 'hidden' }}
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
          {mergedContent.cover_image ? (
            <div
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
                filter: 'brightness(0.55) saturate(0.75) sepia(0.2)'
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(160deg, ${terra} 0%, #7a4a28 50%, ${olive} 100%)`
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(45,31,14,0.2) 0%, rgba(45,31,14,0.15) 40%, rgba(45,31,14,0.72) 90%, rgba(45,31,14,0.9) 100%)'
            }}
          />

          {/* Floating feather deco */}
          <div className='bh-drift' style={{ position: 'absolute', top: '12%', right: '8%', opacity: 0.3, zIndex: 1 }}>
            <svg width='36' height='80' viewBox='0 0 36 80' fill='none'>
              <path d='M18 0 C18 0 36 20 30 40 C24 60 18 80 18 80 C18 80 12 60 6 40 C0 20 18 0 18 0 Z' fill={sand} />
              <line x1='18' y1='0' x2='18' y2='80' stroke={sand} strokeWidth='0.8' opacity='0.6' />
              {[10, 20, 30, 40, 50, 60, 70].map((y) => (
                <line
                  key={y}
                  x1='18'
                  y1={y}
                  x2={y < 40 ? 18 + (40 - y) * 0.35 : 18 + (y - 40) * 0.25}
                  y2={y}
                  stroke={sand}
                  strokeWidth='0.5'
                  opacity='0.5'
                />
              ))}
            </svg>
          </div>
          <div
            className='bh-drift'
            style={{ position: 'absolute', top: '8%', left: '6%', opacity: 0.25, zIndex: 1, animationDelay: '2s' }}
          >
            <svg width='24' height='56' viewBox='0 0 24 56' fill='none'>
              <path d='M12 0 C12 0 24 14 20 28 C16 42 12 56 12 56 C12 56 8 42 4 28 C0 14 12 0 12 0 Z' fill={sand} />
              <line x1='12' y1='0' x2='12' y2='56' stroke={sand} strokeWidth='0.7' opacity='0.5' />
            </svg>
          </div>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, padding: '40px 24px' }}>
            <p
              className='bh-up bh-d1'
              style={{
                fontSize: 10,
                letterSpacing: '0.45em',
                color: sand,
                textTransform: 'uppercase',
                marginBottom: 20
              }}
            >
              We're getting married
            </p>
            {mergedContent.groom_role && (
              <p
                className='bh-up bh-d1'
                style={{
                  fontSize: 10,
                  letterSpacing: '0.45em',
                  color: sand,
                  textTransform: 'uppercase',
                  marginBottom: 8
                }}
              >
                {mergedContent.groom_role}
              </p>
            )}
            <h1
              className='bh-up bh-d2'
              style={{
                fontSize: 'clamp(3.5rem,14vw,8rem)',
                fontFamily: "'Sacramento', cursive",
                color: '#fff',
                lineHeight: 1.15,
                marginBottom: 4,
                textShadow: `0 2px 30px rgba(0,0,0,0.4)`
              }}
            >
              {mergedContent.groom_name || 'Chú Rể'}
            </h1>
            <p
              className='bh-up bh-d2'
              style={{
                fontSize: 11,
                letterSpacing: '0.4em',
                color: sand,
                textTransform: 'uppercase',
                margin: '14px 0'
              }}
            >
              &
            </p>
            {mergedContent.bride_role && (
              <p
                className='bh-up bh-d2'
                style={{
                  fontSize: 10,
                  letterSpacing: '0.45em',
                  color: sand,
                  textTransform: 'uppercase',
                  marginBottom: 8,
                  marginTop: 8
                }}
              >
                {mergedContent.bride_role}
              </p>
            )}
            <h1
              className='bh-up bh-d3'
              style={{
                fontSize: 'clamp(3.5rem,14vw,8rem)',
                fontFamily: "'Sacramento', cursive",
                color: '#fff',
                lineHeight: 1.15,
                marginBottom: 28,
                textShadow: `0 2px 30px rgba(0,0,0,0.4)`
              }}
            >
              {mergedContent.bride_name || 'Cô Dâu'}
            </h1>

            {/* Diamond divider */}
            <div
              className='bh-up bh-d3'
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}
            >
              <div style={{ width: 32, height: 1, background: `rgba(232,212,173,0.5)` }} />
              <div
                style={{ width: 7, height: 7, border: `1px solid ${sand}`, transform: 'rotate(45deg)', opacity: 0.7 }}
              />
              <div style={{ width: 32, height: 1, background: `rgba(232,212,173,0.5)` }} />
            </div>

            {mergedContent.wedding_date && (
              <p
                className='bh-up bh-d4'
                style={{ fontSize: 12, letterSpacing: '0.2em', color: sand, textTransform: 'uppercase' }}
              >
                {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
            {guestName && (
              <div
                style={{
                  marginTop: 22,
                  padding: '12px 28px',
                  border: `1px solid rgba(232,212,173,0.5)`,
                  display: 'inline-block'
                }}
              >
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.4em',
                    color: sand,
                    textTransform: 'uppercase',
                    marginBottom: 4
                  }}
                >
                  Kính gửi
                </p>
                <p
                  style={{
                    fontSize: 'clamp(1rem,3.5vw,1.6rem)',
                    fontFamily: "'Sacramento', cursive",
                    color: '#fff'
                  }}
                >
                  {guestName}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── COUNTDOWN ── */}
        {timeRemaining && (
          <section style={{ background: creamDark, padding: '60px 24px', textAlign: 'center' }}>
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.4em',
                color: terra,
                textTransform: 'uppercase',
                marginBottom: 28
              }}
            >
              Còn lại
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, maxWidth: 360, margin: '0 auto' }}>
              {[
                { v: timeRemaining.days, l: 'Ngày' },
                { v: timeRemaining.hours, l: 'Giờ' },
                { v: timeRemaining.minutes, l: 'Phút' },
                { v: timeRemaining.seconds, l: 'Giây' }
              ].map((it, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ background: terra, borderRadius: 4, padding: '14px 6px', marginBottom: 8 }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: 'clamp(1.6rem,6vw,2.8rem)',
                        color: '#fff',
                        fontFamily: "'Sacramento', cursive",
                        lineHeight: 1
                      }}
                    >
                      {String(it.v).padStart(2, '0')}
                    </span>
                  </div>
                  <p style={{ fontSize: 9, letterSpacing: '0.2em', color: textMid, textTransform: 'uppercase' }}>
                    {it.l}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── STORY ── */}
        <section style={{ background: cream, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            {/* Boho ornament */}
            <svg
              className='bh-sway'
              width='60'
              height='60'
              viewBox='0 0 60 60'
              fill='none'
              style={{ margin: '0 auto 20px', display: 'block' }}
            >
              <circle cx='30' cy='30' r='22' stroke={terra} strokeWidth='0.8' strokeDasharray='4 3' opacity='0.4' />
              <circle cx='30' cy='30' r='12' stroke={olive} strokeWidth='0.6' opacity='0.35' />
              <circle cx='30' cy='30' r='4' fill={terra} opacity='0.5' />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                <line
                  key={a}
                  x1={30 + 16 * Math.cos((a * Math.PI) / 180)}
                  y1={30 + 16 * Math.sin((a * Math.PI) / 180)}
                  x2={30 + 22 * Math.cos((a * Math.PI) / 180)}
                  y2={30 + 22 * Math.sin((a * Math.PI) / 180)}
                  stroke={terra}
                  strokeWidth='0.7'
                  opacity='0.35'
                />
              ))}
            </svg>
            <h2
              style={{
                fontSize: 'clamp(2rem,7vw,3.5rem)',
                fontFamily: "'Sacramento', cursive",
                color: terra,
                marginBottom: 16
              }}
            >
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </h2>
            <p style={{ fontSize: 13, lineHeight: 1.85, color: textMid, letterSpacing: '0.03em' }}>
              {mergedContent.intro_text ||
                'Chúng tôi tìm thấy nhau giữa muôn vàn điều bình dị của cuộc sống. Và chúng tôi muốn chia sẻ niềm vui này với tất cả những người thân yêu.'}
            </p>
          </div>
        </section>

        {/* ── EVENT DETAILS ── */}
        <section style={{ background: `linear-gradient(135deg, ${terra}18, ${olive}18)`, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: '0.4em',
                  color: terra,
                  textTransform: 'uppercase',
                  marginBottom: 10
                }}
              >
                Ngày trọng đại
              </p>
              <h2 style={{ fontSize: 'clamp(2rem,7vw,3.2rem)', fontFamily: "'Sacramento', cursive", color: textDark }}>
                Tham dự cùng chúng tôi
              </h2>
            </div>
            {[
              { label: 'Thời gian', value: mergedContent.event_date || mergedContent.wedding_date },
              { label: 'Giờ tổ chức', value: mergedContent.wedding_time },
              { label: 'Địa điểm', value: mergedContent.address },
              { label: 'Lịch âm', value: mergedContent.lunar_date }
            ]
              .filter((it) => it.value)
              .map((it, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 16,
                    padding: '16px 0',
                    borderBottom: `1px dashed rgba(184,97,58,0.2)`
                  }}
                >
                  <div
                    style={{
                      width: 4,
                      background: terra,
                      borderRadius: 2,
                      flexShrink: 0,
                      alignSelf: 'stretch',
                      opacity: 0.6
                    }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: 9,
                        letterSpacing: '0.3em',
                        color: textMid,
                        textTransform: 'uppercase',
                        marginBottom: 4
                      }}
                    >
                      {it.label}
                    </p>
                    <p style={{ fontSize: 15, color: textDark, lineHeight: 1.5 }}>{it.value}</p>
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
                  border: `1px dashed rgba(184,97,58,0.2)`
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
          <section style={{ background: creamDark, padding: '72px 24px' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.35em',
                    color: terra,
                    textTransform: 'uppercase',
                    marginBottom: 8
                  }}
                >
                  Kỷ niệm
                </p>
                <h2 style={{ fontSize: 'clamp(2rem,7vw,3rem)', fontFamily: "'Sacramento', cursive", color: textDark }}>
                  Album ảnh cưới
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
                        aspectRatio: '1',
                        overflow: 'hidden',
                        borderRadius: 4,
                        border: `4px solid ${cream}`,
                        boxShadow: '0 4px 14px rgba(45,31,14,0.12)'
                      }}
                    >
                      <img
                        src={img}
                        alt=''
                        style={{
                          width: '100%',
                          height: '100%',
                          filter: 'sepia(0.08) saturate(0.95)',
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
        {(() => {
          const bankName = mergedContent.bank_name || ''
          const accountNumber = mergedContent.account_number || ''
          const accountName = mergedContent.account_name || ''
          const customQrImage = mergedContent.qr_image || mergedContent.qrImage || ''
          const transferNote = `Mung cuoi ${mergedContent.groom_name} ${mergedContent.bride_name}`.trim()
          const bankCode = BANK_MAP[bankName] || bankName
          const generatedQrUrl =
            bankCode && accountNumber
              ? `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.jpg?amount=0&addInfo=${encodeURIComponent(
                  transferNote
                )}&accountName=${encodeURIComponent(accountName)}`
              : ''
          const displayQrUrl = customQrImage || generatedQrUrl
          const hasGiftInfo = Boolean(displayQrUrl || accountNumber || bankName || accountName)

          if (!hasGiftInfo) return null

          return (
            <section style={{ background: cream, padding: '72px 24px' }}>
              <div style={{ maxWidth: 420, margin: '0 auto', textAlign: 'center' }}>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.35em',
                    color: terra,
                    textTransform: 'uppercase',
                    marginBottom: 10
                  }}
                >
                  Hộp quà mừng
                </p>
                <h2
                  style={{
                    fontSize: 'clamp(1.8rem,6vw,3rem)',
                    fontFamily: "'Sacramento', cursive",
                    color: textDark,
                    marginBottom: 12
                  }}
                >
                  Chung vui cùng chúng tôi
                </h2>
                <p style={{ fontSize: 13, color: textMid, marginBottom: 32 }}>
                  Sự hiện diện của bạn là niềm hạnh phúc lớn nhất.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div
                    className='gift-card-boho'
                    onClick={() => setShowGiftQr(true)}
                    style={{ width: '100%', maxWidth: 300, padding: '36px 24px', position: 'relative' }}
                  >
                    {/* Boho decor icons */}
                    <div style={{ position: 'absolute', top: 12, left: 12, opacity: 0.3 }}>
                      <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
                        <path
                          d='M12 2C12 2 15 7 15 11C15 15 12 22 12 22C12 22 9 15 9 11C9 7 12 2 12 2Z'
                          stroke={olive}
                          strokeWidth='1.5'
                        />
                      </svg>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <svg width='44' height='44' viewBox='0 0 24 24' fill='none'>
                        <path
                          d='M20 12V20H4V12'
                          stroke={terra}
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <path
                          d='M22 7H2V12H22V7Z'
                          stroke={terra}
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <path
                          d='M12 20V7'
                          stroke={terra}
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <path
                          d='M12 7C12 7 12 3 9.5 3C7 3 7 7 12 7Z'
                          stroke={terra}
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <path
                          d='M12 7C12 7 12 3 14.5 3C17 3 17 7 12 7Z'
                          stroke={terra}
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </div>

                    <p
                      style={{
                        fontSize: '0.95rem',
                        color: textDark,
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        marginBottom: 6
                      }}
                    >
                      Mở Hộp Mừng Cưới
                    </p>
                    <p style={{ color: textMid, fontSize: 11, fontStyle: 'italic' }}>Chạm vào thiệp để xem chi tiết</p>
                  </div>
                </div>
              </div>

              {/* Gift Modal */}
              {showGiftQr && (
                <div
                  onClick={() => setShowGiftQr(false)}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    backgroundColor: 'rgba(45, 31, 14, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: '100%',
                      maxWidth: 400,
                      backgroundColor: cream,
                      borderRadius: 24,
                      border: `1px solid ${sand}`,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      padding: '32px 24px',
                      position: 'relative'
                    }}
                  >
                    <button
                      onClick={() => setShowGiftQr(false)}
                      style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        background: 'none',
                        border: 'none',
                        fontSize: 28,
                        color: terra,
                        cursor: 'pointer'
                      }}
                    >
                      &times;
                    </button>

                    <h3
                      style={{
                        fontFamily: "'Sacramento', cursive",
                        textAlign: 'center',
                        color: textDark,
                        fontSize: '2rem',
                        marginBottom: 20
                      }}
                    >
                      Hộp Quà Mừng
                    </h3>

                    {displayQrUrl && (
                      <div
                        style={{
                          background: '#fff',
                          padding: 12,
                          borderRadius: 16,
                          marginBottom: 20,
                          display: 'flex',
                          justifyContent: 'center',
                          border: `1px solid ${sand}`
                        }}
                      >
                        <img
                          src={displayQrUrl}
                          alt='QR Code'
                          style={{ width: '100%', maxWidth: 220, height: 'auto' }}
                        />
                      </div>
                    )}

                    <div style={{ display: 'grid', gap: 10, color: textDark }}>
                      {bankName && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                          <span style={{ color: textMid }}>Ngân hàng:</span>
                          <span style={{ fontWeight: 600 }}>{bankName}</span>
                        </div>
                      )}
                      {accountName && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                          <span style={{ color: textMid }}>Chủ TK:</span>
                          <span style={{ fontWeight: 600 }}>{accountName}</span>
                        </div>
                      )}
                      {accountNumber && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                          <span style={{ color: textMid }}>Số TK:</span>
                          <span style={{ fontWeight: 600, letterSpacing: 0.5 }}>{accountNumber}</span>
                        </div>
                      )}
                      <div
                        style={{
                          marginTop: 10,
                          padding: '12px',
                          background: creamDark,
                          borderRadius: 12,
                          fontSize: 13,
                          lineHeight: 1.5,
                          fontStyle: 'italic',
                          color: textMid,
                          textAlign: 'center',
                          border: `1px dashed ${terra}44`
                        }}
                      >
                        Nội dung: {transferNote}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )
        })()}

        {/* ── GUESTBOOK ── */}
        <section style={{ background: creamDark, padding: '72px 24px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.35em',
                color: terra,
                textTransform: 'uppercase',
                marginBottom: 10
              }}
            >
              Sổ Lưu Bút
            </p>
            <h2
              style={{
                fontSize: 'clamp(1.8rem,6vw,3rem)',
                fontFamily: "'Sacramento', cursive",
                color: textDark,
                marginBottom: 28
              }}
            >
              Lời Chúc Trân Trọng
            </h2>
            <div
              style={{
                border: `1.5px dashed rgba(184,97,58,0.35)`,
                borderRadius: 8,
                padding: '28px 20px',
                background: cream
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
                        background: creamDark,
                        borderRadius: 8,
                        borderLeft: `3px solid ${terra}`
                      }}
                    >
                      <p
                        style={{ fontStyle: 'italic', color: textMid, marginBottom: 8, fontSize: 14, lineHeight: 1.6 }}
                      >
                        "{w.wishes}"
                      </p>
                      <p
                        style={{
                          fontFamily: "'Josefin Sans', sans-serif",
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

        {/* ── RSVP ── */}
        <section style={{ padding: '60px 20px 80px', background: 'transparent' }}>
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
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

        {/* ── FOOTER ── */}
        <section style={{ background: terra, padding: '48px 24px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: 'clamp(2rem,7vw,3.5rem)',
              fontFamily: "'Sacramento', cursive",
              color: '#fff',
              marginBottom: 8
            }}
          >
            {mergedContent.groom_name} & {mergedContent.bride_name}
          </p>
          {mergedContent.wedding_date && (
            <p
              style={{
                fontSize: 10,
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
