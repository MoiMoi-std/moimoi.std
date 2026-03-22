'use client'

import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { TemplateProps } from '../TemplateRegistry'
import RSVPForm from '@/components/guest/RSVPForm'
import { createClient } from '@supabase/supabase-js'
import { useMapEmbed } from '@/lib/useMapEmbed'

export default function MoiMoiBaseGuestView({
  wedding,
  guestName = 'Quý khách',
  rsvpId,
  musicUrl
}: TemplateProps) {
  const content = {
    groom_name: 'Chú Rể',
    bride_name: 'Cô Dâu',
    wedding_date: '2026-03-23',
    wedding_time: '18:00',
    address: 'Nhà hàng tiệc cưới',
    images: [],
    bank_name: 'Ngân hàng',
    account_number: '0123456789',
    account_name: 'Chủ nhân tài khoản',
    ...wedding?.content
  }

  const [wishesList, setWishesList] = useState<any[]>([])
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({})
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const rose = '#e85c93'
  const roseLight = '#f5d8e9'
  const roseMid = '#f0b8d8'
  const white = '#ffffff'
  const darkGray = '#2d2d2d'
  const parchment = '#fff5f9'

  const mapUrl = useMapEmbed(content.address || '')
  const eventDate = new Date(content.wedding_date || '2026-03-23')

  // Fetch wishes from Supabase
  useEffect(() => {
    const fetchWishes = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        )

        if (!wedding?.id) return

        const { data, error } = await supabase
          .from('rsvps')
          .select('guest_name, wishes')
          .eq('wedding_id', wedding.id)
          .not('wishes', 'is', null)
          .limit(10)

        if (!error && data) {
          setWishesList(data)
        }
      } catch (err) {
        console.log('Failed to fetch wishes:', err)
      }
    }

    fetchWishes()
  }, [wedding?.id])

  // Scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section')
            if (id) {
              setVisibleSections((prev) => ({ ...prev, [id]: true }))
            }
          }
        })
      },
      { threshold: 0.3 }
    )

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Great+Vibes&family=Nunito+Sans:wght@400;500;600;700&display=swap');

          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            background:
              radial-gradient(circle at 22% 8%, rgba(255, 208, 230, 0.62), transparent 44%),
              radial-gradient(circle at 82% 82%, rgba(240, 184, 216, 0.45), transparent 40%),
              linear-gradient(160deg, #fff7fb 0%, #fff0f7 48%, #ffe9f4 100%);
            font-family: 'Nunito Sans';
            color: ${darkGray};
          }
          
          .rmb-guest-header {
            background: transparent;
            color: ${darkGray};
            padding: 1.25rem 1rem 0.2rem;
            text-align: center;
          }

          .rmb-guest-hero-card {
            max-width: 640px;
            margin: 0 auto;
            border-radius: 22px;
            border: 1px solid rgba(232, 92, 147, 0.2);
            background: linear-gradient(180deg, #fffdfd 0%, #fff3f8 100%);
            box-shadow: 0 18px 40px rgba(214, 110, 157, 0.22);
            padding: 1.3rem 1rem 1.15rem;
            position: relative;
          }

          .rmb-guest-hero-card::before {
            content: '';
            position: absolute;
            inset: 10px;
            border: 1px dashed rgba(232, 92, 147, 0.2);
            border-radius: 14px;
            pointer-events: none;
          }

          .rmb-guest-title {
            letter-spacing: 0.23em;
            text-transform: uppercase;
            font-size: 0.72rem;
            color: rgba(130, 70, 98, 0.84);
            margin-bottom: 0.7rem;
            position: relative;
            z-index: 1;
          }

          .rmb-guest-names {
            font-family: 'Playfair Display';
            font-size: clamp(1.4rem, 4vw, 2.2rem);
            font-weight: 800;
            margin-bottom: 0.7rem;
            color: #5c2a45;
            position: relative;
            z-index: 1;
          }

          .rmb-guest-invite {
            font-size: 0.97rem;
            font-weight: 600;
            margin-bottom: 0.65rem;
            padding: 0.62rem 0.92rem;
            background: rgba(255, 255, 255, 0.72);
            border: 1px solid rgba(232, 92, 147, 0.16);
            border-radius: 999px;
            display: inline-block;
            position: relative;
            z-index: 1;
          }

          .rmb-guest-name-box {
            background: ${white};
            color: #8f355f;
            padding: 0.68rem 1.25rem;
            border-radius: 999px;
            border: 1px solid rgba(232, 92, 147, 0.2);
            font-weight: 700;
            font-size: 0.98rem;
            display: inline-block;
            margin: 0.75rem auto 0.35rem;
            position: relative;
            z-index: 1;
          }

          .rmb-section {
            opacity: 0;
            transform: translateY(40px);
            transition: all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          .rmb-section.visible {
            opacity: 1;
            transform: translateY(0);
          }

          .rmb-heading {
            font-family: 'Playfair Display';
            font-weight: 800;
            font-size: clamp(1.6rem, 4vw, 2.4rem);
            text-align: center;
            color: #8f355f;
            margin: 2rem 0 1rem;
            position: relative;
          }

          .rmb-divider {
            width: 60px;
            height: 2px;
            background: linear-gradient(90deg, transparent, ${rose}, ${rose}, ${rose}, transparent);
            margin: 1rem auto;
          }

          .rmb-card {
            background: linear-gradient(180deg, #ffffff 0%, #fffafc 100%);
            border: 1px solid rgba(232, 92, 147, 0.16);
            padding: 1.5rem;
            margin: 1.5rem auto;
            border-radius: 14px;
            box-shadow: 0 10px 24px rgba(232, 92, 147, 0.11);
            max-width: 600px;
          }

          .rmb-info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0.8rem 0;
            font-size: 1rem;
          }

          .rmb-info-label {
            font-weight: 600;
            color: ${rose};
          }

          .rmb-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin: 1.5rem 1rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }

          .rmb-gallery-item {
            position: relative;
            overflow: hidden;
            border-radius: 8px;
            aspect-ratio: 1;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
          }

          .rmb-gallery-item:hover {
            transform: scale(1.03);
          }

          .rmb-gallery-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .rmb-wishes-container {
            max-width: 600px;
            margin: 1.5rem auto;
            padding: 0 1rem;
          }

          .rmb-wish-item {
            background: ${white};
            border-left: 4px solid ${roseMid};
            padding: 1rem 1.5rem;
            margin-bottom: 1rem;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(232, 92, 147, 0.06);
          }

          .rmb-wish-text {
            font-style: italic;
            margin-bottom: 0.5rem;
            color: ${darkGray};
            line-height: 1.6;
          }

          .rmb-wish-author {
            text-align: right;
            font-size: 0.9rem;
            font-weight: 600;
            color: ${rose};
          }

          .rmb-gift-box {
            background: linear-gradient(150deg, #fff7fb 0%, #ffe4f1 100%);
            padding: 1.5rem;
            border-radius: 14px;
            margin: 1.5rem auto;
            border: 1px solid rgba(232, 92, 147, 0.24);
            max-width: 500px;
            text-align: center;
            box-shadow: 0 10px 24px rgba(232, 92, 147, 0.12);
          }

          .rmb-gift-title {
            font-family: 'Great Vibes';
            font-size: 1.8rem;
            color: ${rose};
            margin-bottom: 0.5rem;
          }

          .rmb-bank-info {
            background: ${parchment};
            padding: 0.8rem;
            border-radius: 6px;
            margin: 0.8rem 0;
            font-size: 0.9rem;
          }

          .rmb-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 1.5rem 0;
          }

          .rmb-main-shell {
            background: rgba(255, 255, 255, 0.55);
            border: 1px solid rgba(232, 92, 147, 0.12);
            border-radius: 24px;
            box-shadow: 0 16px 40px rgba(223, 133, 173, 0.18);
            backdrop-filter: blur(3px);
          }

          @media (max-width: 640px) {
            .rmb-gallery {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}</style>
      </Head>

      <main style={{ background: parchment, minHeight: '100vh' }}>
        {/* Header */}
        <div className="rmb-guest-header">
          <div className="rmb-guest-hero-card">
            <div className="rmb-guest-title">Wedding Invitation</div>
            <div className="rmb-guest-names">
              {content.groom_name} <span style={{ color: '#d84c86' }}>&amp;</span> {content.bride_name}
            </div>
            <div className="rmb-guest-invite">Xin kính mời quý khách dự lễ cưới của chúng tôi</div>
            <div className="rmb-guest-name-box">{guestName}</div>
          </div>
        </div>

        <div className="rmb-container rmb-main-shell">
          {/* Hero Image */}
          {(content.images || [])[0] && (
            <div
              ref={(el) => {
                if (el) sectionRefs.current['hero'] = el
              }}
              data-section="hero"
              className={`rmb-section ${visibleSections['hero'] ? 'visible' : ''}`}
              style={{
                marginTop: '1.5rem',
                marginBottom: '2rem',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 8px 20px rgba(232, 92, 147, 0.1)'
              }}
            >
              <img
                src={content.images[0]}
                alt="Couple"
                style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Event Details */}
          <div
            ref={(el) => {
              if (el) sectionRefs.current['details'] = el
            }}
            data-section="details"
            className={`rmb-section ${visibleSections['details'] ? 'visible' : ''}`}
          >
            <h2 className="rmb-heading">Lễ Cưới</h2>
            <div className="rmb-divider" />
            <div className="rmb-card">
              <div className="rmb-info-row">
                <span className="rmb-info-label">📅 Ngày</span>
                <span>{eventDate.toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="rmb-info-row">
                <span className="rmb-info-label">🕐 Giờ</span>
                <span>{content.wedding_time || '18:00'}</span>
              </div>
              <div className="rmb-info-row">
                <span className="rmb-info-label">📍 Địa điểm</span>
                <span>{content.address}</span>
              </div>
            </div>

            {mapUrl && (
              <div
                style={{
                  margin: '1.5rem auto',
                  maxWidth: '600px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(232, 92, 147, 0.1)'
                }}
              >
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="250"
                  style={{ border: 'none' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          {/* Album */}
          {(content.images || []).length > 1 && (
            <div
              ref={(el) => {
                if (el) sectionRefs.current['album'] = el
              }}
              data-section="album"
              className={`rmb-section ${visibleSections['album'] ? 'visible' : ''}`}
            >
              <h2 className="rmb-heading">Hình Ảnh</h2>
              <div className="rmb-divider" />
              <div className="rmb-gallery">
                {content.images.slice(1, 7).map((img, idx) => (
                  <div key={idx} className="rmb-gallery-item">
                    <img src={img} alt={`Gallery ${idx}`} className="rmb-gallery-img" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wishes */}
          {wishesList.length > 0 && (
            <div
              ref={(el) => {
                if (el) sectionRefs.current['wishes'] = el
              }}
              data-section="wishes"
              className={`rmb-section ${visibleSections['wishes'] ? 'visible' : ''}`}
            >
              <h2 className="rmb-heading">Lời Chúc</h2>
              <div className="rmb-divider" />
              <div className="rmb-wishes-container">
                {wishesList.map((wish, idx) => (
                  <div key={idx} className="rmb-wish-item">
                    <div className="rmb-wish-text">"{wish.wishes}"</div>
                    <div className="rmb-wish-author">- {wish.guest_name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gift Section */}
          {content.bank_name && (
            <div
              ref={(el) => {
                if (el) sectionRefs.current['gift'] = el
              }}
              data-section="gift"
              className={`rmb-section ${visibleSections['gift'] ? 'visible' : ''}`}
            >
              <h2 className="rmb-heading">Tiền Mừng</h2>
              <div className="rmb-divider" />
              <div className="rmb-gift-box">
                <div className="rmb-gift-title">🎁 Mừng Cưới</div>
                <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                  Xin cảm ơn tình cảm của bạn
                </p>
                <div className="rmb-bank-info">
                  <div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>
                    {content.bank_name}
                  </div>
                  <div style={{ fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                    {content.account_number}
                  </div>
                  <div style={{ fontSize: '0.8rem', marginTop: '0.3rem', fontStyle: 'italic' }}>
                    {content.account_name}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RSVP Form */}
          <div
            ref={(el) => {
              if (el) sectionRefs.current['rsvp'] = el
            }}
            data-section="rsvp"
            className={`rmb-section ${visibleSections['rsvp'] ? 'visible' : ''}`}
            style={{ marginBottom: '3rem' }}
          >
            <h2 className="rmb-heading">Xác Nhận Dự Tiệc</h2>
            <div className="rmb-divider" />
            {wedding?.id && (
              <RSVPForm
                weddingId={wedding.id}
                rsvpId={rsvpId}
                guestName={guestName}
                primaryColor={rose}
                fontFamily="Nunito Sans"
                sectionFontFamily="Great Vibes"
              />
            )}
          </div>

          {/* Audio Player */}
          {musicUrl && (
            <div style={{ textAlign: 'center', margin: '2rem 0', paddingBottom: '2rem' }}>
              <audio controls style={{ width: '100%', maxWidth: '300px' }}>
                <source src={musicUrl} type="audio/mpeg" />
              </audio>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
