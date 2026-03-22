'use client'

import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { TemplateProps } from '../TemplateRegistry'
import { useMapEmbed } from '@/lib/useMapEmbed'

export default function MoiMoiBaseGeneralView({
  wedding,
  musicUrl,
  disableSplash = false
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
    groom_father_name: '',
    groom_mother_name: '',
    groom_city: '',
    groom_address: '',
    bride_father_name: '',
    bride_mother_name: '',
    bride_city: '',
    bride_address: '',
    ...wedding?.content
  }

  const [showSplash, setShowSplash] = useState(!disableSplash)
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({})
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const rose = '#e85c93'
  const roseLight = '#f5d8e9'
  const roseMid = '#f0b8d8'
  const white = '#ffffff'
  const darkGray = '#2d2d2d'
  const parchment = '#fff5f9'

  const mapUrl = useMapEmbed(content.address || '')
  const formatParents = (text: string) => text.split('\n').map((line) => line.trim()).filter(Boolean)
  const groomParentLinesFromText = formatParents(content.groom_parents || '')
  const groomParentLines =
    groomParentLinesFromText.length > 0
      ? groomParentLinesFromText
      : [
          content.groom_father_name ? `Ông: ${content.groom_father_name}` : '',
          content.groom_mother_name ? `Bà: ${content.groom_mother_name}` : ''
        ].filter(Boolean)
  const brideParentLinesFromText = formatParents(content.bride_parents || '')
  const brideParentLines =
    brideParentLinesFromText.length > 0
      ? brideParentLinesFromText
      : [
          content.bride_father_name ? `Ông: ${content.bride_father_name}` : '',
          content.bride_mother_name ? `Bà: ${content.bride_mother_name}` : ''
        ].filter(Boolean)
  const groomFamilyAddress = [content.groom_address, content.groom_city].filter(Boolean).join(', ')
  const brideFamilyAddress = [content.bride_address, content.bride_city].filter(Boolean).join(', ')

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

  const eventDate = new Date(content.wedding_date || '2026-03-23')
  const now = new Date()
  const diff = eventDate.getTime() - now.getTime()
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
  const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Great+Vibes&family=Nunito+Sans:wght@400;500;600;700&display=swap');

          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            background:
              radial-gradient(circle at 20% 10%, rgba(255, 203, 227, 0.65), transparent 45%),
              radial-gradient(circle at 80% 80%, rgba(240, 184, 216, 0.5), transparent 40%),
              linear-gradient(160deg, #fff7fb 0%, #fff0f7 48%, #ffe9f4 100%);
            font-family: 'Nunito Sans';
            color: ${darkGray};
          }
          
          .rmb-splash {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background:
              radial-gradient(circle at 15% 15%, rgba(255, 214, 233, 0.9), transparent 40%),
              radial-gradient(circle at 82% 85%, rgba(255, 191, 220, 0.65), transparent 45%),
              linear-gradient(145deg, #fef4fa 0%, #f9d9ea 55%, #f2c4de 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            padding: 24px;
            overflow: hidden;
          }

          .rmb-splash::before,
          .rmb-splash::after {
            content: '';
            position: absolute;
            width: 320px;
            height: 320px;
            border-radius: 999px;
            filter: blur(40px);
            opacity: 0.45;
            pointer-events: none;
          }

          .rmb-splash::before {
            background: #ffc2df;
            top: -100px;
            left: -70px;
            animation: rmb-float-soft 5s ease-in-out infinite;
          }

          .rmb-splash::after {
            background: #f19bc8;
            right: -80px;
            bottom: -110px;
            animation: rmb-float-soft 6.5s ease-in-out infinite;
          }

          @keyframes rmb-float-soft {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-14px); }
          }

          .rmb-open-card {
            width: min(92vw, 430px);
            background: linear-gradient(180deg, #fffdfd 0%, #fff4f9 100%);
            border: 1px solid rgba(232, 92, 147, 0.18);
            border-radius: 22px;
            box-shadow:
              0 22px 56px rgba(188, 86, 130, 0.28),
              0 4px 16px rgba(232, 92, 147, 0.16);
            padding: 22px 18px 18px;
            text-align: center;
            transform: rotate(0deg);
            position: relative;
            animation: rmb-card-in 0.7s ease-out;
            z-index: 1;
          }

          .rmb-open-card::before {
            content: '';
            position: absolute;
            inset: 10px;
            border: 1px dashed rgba(232, 92, 147, 0.25);
            border-radius: 14px;
            pointer-events: none;
          }

          @keyframes rmb-card-in {
            from {
              transform: translateY(18px) scale(0.96);
              opacity: 0;
            }
            to {
              transform: rotate(0deg) scale(1);
              opacity: 1;
            }
          }

          .rmb-open-shimmer {
            height: 1px;
            width: 68%;
            margin: 12px auto 10px;
            background: linear-gradient(90deg, transparent, rgba(232, 92, 147, 0.7), transparent);
            position: relative;
            overflow: hidden;
            z-index: 1;
          }

          .rmb-open-shimmer::after {
            content: '';
            position: absolute;
            top: -1px;
            left: -40%;
            width: 40%;
            height: 3px;
            background: rgba(255, 255, 255, 0.95);
            filter: blur(1px);
            animation: rmb-shine 2.2s ease-in-out infinite;
          }

          @keyframes rmb-shine {
            to { left: 130%; }
          }

          .rmb-open-kicker {
            letter-spacing: 0.28em;
            text-transform: uppercase;
            font-size: 0.72rem;
            color: rgba(140, 75, 106, 0.8);
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
          }

          .rmb-open-photo {
            width: 142px;
            height: 142px;
            margin: 8px auto 14px;
            border-radius: 999px;
            border: 5px solid #fff;
            box-shadow: 0 12px 24px rgba(201, 92, 138, 0.28);
            overflow: hidden;
            position: relative;
            z-index: 1;
          }

          .rmb-open-photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .rmb-splash-names {
            font-family: 'Playfair Display';
            font-size: clamp(1.85rem, 6vw, 2.5rem);
            text-align: center;
            color: #5c2a45;
            font-weight: 800;
            margin: 0.65rem 0 0.2rem;
            line-height: 1.24;
            position: relative;
            z-index: 1;
          }

          .rmb-splash-date {
            font-size: 0.95rem;
            color: rgba(106, 54, 81, 0.86);
            margin-top: 0.45rem;
            position: relative;
            z-index: 1;
          }

          .rmb-open-script {
            font-family: 'Great Vibes';
            color: #d74e87;
            font-size: 1.42rem;
            margin-top: 8px;
            line-height: 1.2;
            position: relative;
            z-index: 1;
            text-shadow: 0 6px 16px rgba(232, 92, 147, 0.18);
          }

          .rmb-open-cta {
            margin-top: 16px;
            background: linear-gradient(135deg, #ef5f98 0%, #df4d87 100%);
            color: #fff;
            border: 0;
            border-radius: 999px;
            padding: 10px 22px;
            font-size: 0.92rem;
            font-weight: 700;
            letter-spacing: 0.03em;
            box-shadow: 0 10px 22px rgba(223, 77, 135, 0.35);
            cursor: pointer;
            position: relative;
            z-index: 1;
          }

          .rmb-open-cta:hover {
            transform: translateY(-1px);
          }

          .rmb-hero-script {
            font-family: 'Great Vibes';
            font-size: clamp(1.25rem, 4.4vw, 1.95rem);
            color: #d84c86;
            text-shadow: 0 8px 18px rgba(232, 92, 147, 0.16);
            margin-top: 0.35rem;
            margin-bottom: 0.3rem;
          }

          .rmb-couple-grid {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            gap: 14px;
            max-width: 760px;
            margin: 0 auto;
            padding: 0 10px;
          }

          .rmb-couple-side {
            text-align: center;
          }

          .rmb-couple-label {
            font-size: 0.76rem;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            color: rgba(143, 53, 95, 0.72);
            margin-bottom: 8px;
          }

          .rmb-couple-name {
            font-family: 'Playfair Display';
            font-size: clamp(2rem, 5vw, 3rem);
            color: #8f355f;
            font-weight: 800;
            line-height: 1.1;
          }

          .rmb-couple-heart {
            font-size: 1.8rem;
            color: #d84c86;
            text-shadow: 0 8px 14px rgba(216, 76, 134, 0.28);
          }

          .rmb-parents-wrap {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 16px;
            align-items: stretch;
            max-width: 860px;
            margin: 1.4rem auto 1.8rem;
            padding: 0 8px;
          }

          .rmb-parents-card {
            background: linear-gradient(180deg, #fffdfd 0%, #fff7fb 100%);
            border: 1px solid rgba(232, 92, 147, 0.18);
            border-radius: 14px;
            padding: 1rem 1.1rem;
            box-shadow: 0 8px 18px rgba(232, 92, 147, 0.1);
            text-align: center;
          }

          .rmb-parents-title {
            font-size: 0.82rem;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: rgba(143, 53, 95, 0.7);
            margin-bottom: 8px;
            font-weight: 700;
          }

          .rmb-parents-line {
            font-family: 'Playfair Display';
            font-size: 1.05rem;
            color: #7c3558;
            line-height: 1.45;
          }

          .rmb-parents-address {
            margin-top: 8px;
            font-size: 0.9rem;
            color: rgba(92, 45, 71, 0.78);
            font-style: italic;
            line-height: 1.35;
          }

          .rmb-parents-divider {
            width: 1px;
            background: linear-gradient(to bottom, transparent, rgba(216, 76, 134, 0.45), transparent);
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
            font-size: clamp(1.8rem, 5vw, 2.8rem);
            text-align: center;
            color: #8f355f;
            margin: 2rem 0 0.85rem;
            position: relative;
            padding: 0 1rem;
          }

          .rmb-divider {
            width: 80px;
            height: 2px;
            background: linear-gradient(90deg, transparent, ${rose}, ${rose}, ${rose}, transparent);
            margin: 1.5rem auto;
          }

          .rmb-card {
            background: linear-gradient(180deg, #ffffff 0%, #fffafc 100%);
            border: 1px solid rgba(232, 92, 147, 0.16);
            padding: 2rem;
            margin: 1.5rem auto;
            border-radius: 16px;
            box-shadow: 0 12px 28px rgba(232, 92, 147, 0.11);
            max-width: 600px;
          }

          .rmb-info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 1rem 0;
            font-size: 1.1rem;
          }

          .rmb-info-label {
            font-weight: 600;
            color: ${rose};
          }

          .rmb-countdown {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin: 2rem 0;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
          }

          .rmb-countdown-item {
            background: linear-gradient(145deg, #fff2f9 0%, #ffd8e9 100%);
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid rgba(232, 92, 147, 0.16);
            text-align: center;
            box-shadow: 0 8px 18px rgba(232, 92, 147, 0.12);
          }

          .rmb-countdown-number {
            font-family: 'Playfair Display';
            font-size: 2.4rem;
            font-weight: 900;
            color: ${rose};
          }

          .rmb-countdown-label {
            font-size: 0.9rem;
            font-weight: 600;
            color: ${darkGray};
            margin-top: 0.5rem;
          }

          .rmb-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin: 2rem 1rem;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
          }

          .rmb-gallery-item {
            position: relative;
            overflow: hidden;
            border-radius: 12px;
            aspect-ratio: 4/3;
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
            transition: transform 0.5s ease;
          }

          .rmb-gallery-item:hover {
            transform: scale(1.05);
          }

          .rmb-gallery-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .rmb-gift-box {
            background: linear-gradient(150deg, #fff7fb 0%, #ffe4f1 100%);
            padding: 2rem;
            border-radius: 16px;
            margin: 1.5rem auto;
            border: 1px solid rgba(232, 92, 147, 0.24);
            max-width: 500px;
            text-align: center;
            box-shadow: 0 10px 26px rgba(232, 92, 147, 0.12);
          }

          .rmb-gift-title {
            font-family: 'Great Vibes';
            font-size: 2rem;
            color: ${rose};
            margin-bottom: 1rem;
          }

          .rmb-bank-info {
            background: ${parchment};
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            font-size: 0.95rem;
          }

          .rmb-button {
            background: linear-gradient(135deg, ${rose}, #d64a7d);
            color: ${white};
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            font-size: 1rem;
            margin: 0.5rem;
          }

          .rmb-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(232, 92, 147, 0.3);
          }

          .rmb-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 2rem 1rem;
          }

          .rmb-main-shell {
            background: rgba(255, 255, 255, 0.55);
            border: 1px solid rgba(232, 92, 147, 0.12);
            border-radius: 24px;
            box-shadow: 0 16px 40px rgba(223, 133, 173, 0.18);
            backdrop-filter: blur(3px);
          }

          @media (max-width: 640px) {
            .rmb-countdown {
              grid-template-columns: 1fr;
            }
            .rmb-gallery {
              grid-template-columns: 1fr;
              gap: 1rem;
            }
            .rmb-heading {
              font-size: 1.6rem;
            }
            .rmb-couple-grid {
              grid-template-columns: 1fr;
              gap: 6px;
            }
            .rmb-couple-heart {
              display: none;
            }
            .rmb-parents-wrap {
              grid-template-columns: 1fr;
            }
            .rmb-parents-divider {
              display: none;
            }
          }
        `}</style>
      </Head>

      {showSplash && (
        <div className="rmb-splash" onClick={() => setShowSplash(false)}>
          <div className="rmb-open-card" onClick={(e) => e.stopPropagation()}>
            <div className="rmb-open-kicker">Wedding Invitation</div>
            <div className="rmb-open-photo">
              {content.images?.[0] ? (
                <img src={content.images[0]} alt="Couple" />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900&q=80"
                  alt="Couple"
                />
              )}
            </div>
            <div className="rmb-splash-names">
              {content.groom_name} <span style={{ color: '#d84c86' }}>&amp;</span> {content.bride_name}
            </div>
            <div className="rmb-open-shimmer" />
            <div className="rmb-splash-date">{eventDate.toLocaleDateString('vi-VN')}</div>
            <div className="rmb-open-script">Save the date</div>
            <button className="rmb-open-cta" onClick={() => setShowSplash(false)}>
              Mở thư mời
            </button>
          </div>
        </div>
      )}

      <main style={{ background: parchment, minHeight: '100vh' }}>
        <div className="rmb-container rmb-main-shell">
          {/* Hero Section */}
          <div
            ref={(el) => {
              if (el) sectionRefs.current['hero'] = el
            }}
            data-section="hero"
            className={`rmb-section ${visibleSections['hero'] ? 'visible' : ''}`}
            style={{ marginTop: '2rem', textAlign: 'center' }}
          >
            {(content.images || [])[0] && (
              <div
                style={{
                  maxWidth: '100%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '2rem',
                  boxShadow: '0 12px 32px rgba(232, 92, 147, 0.15)'
                }}
              >
                <img
                  src={content.images[0]}
                  alt="Couple"
                  style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover' }}
                />
              </div>
            )}
            <div className="rmb-couple-grid" style={{ marginTop: '8px' }}>
              <div className="rmb-couple-side">
                <div className="rmb-couple-label">Nhà trai</div>
                <div className="rmb-couple-name">{content.groom_name}</div>
              </div>
              <div className="rmb-couple-heart">💕</div>
              <div className="rmb-couple-side">
                <div className="rmb-couple-label">Nhà gái</div>
                <div className="rmb-couple-name">{content.bride_name}</div>
              </div>
            </div>
            <div className="rmb-hero-script">Together with all our love</div>
            <div className="rmb-divider" />
            <p
              style={{
                fontSize: '1.2rem',
                fontFamily: "'Great Vibes'",
                color: rose,
                marginBottom: '1rem'
              }}
            >
              Xin kính mời đến dự đám cưới của chúng tôi
            </p>

            <div className="rmb-parents-wrap">
              <div className="rmb-parents-card">
                <div className="rmb-parents-title">Cha mẹ chú rể</div>
                {groomParentLines.length > 0 ? groomParentLines.map((line, idx) => (
                  <div key={idx} className="rmb-parents-line">
                    {line}
                  </div>
                )) : <div className="rmb-parents-line">Đang cập nhật</div>}
                {groomFamilyAddress && <div className="rmb-parents-address">{groomFamilyAddress}</div>}
              </div>
              <div className="rmb-parents-divider" />
              <div className="rmb-parents-card">
                <div className="rmb-parents-title">Cha mẹ cô dâu</div>
                {brideParentLines.length > 0 ? brideParentLines.map((line, idx) => (
                  <div key={idx} className="rmb-parents-line">
                    {line}
                  </div>
                )) : <div className="rmb-parents-line">Đang cập nhật</div>}
                {brideFamilyAddress && <div className="rmb-parents-address">{brideFamilyAddress}</div>}
              </div>
            </div>
          </div>

          {/* Countdown */}
          {days > 0 && (
            <div
              ref={(el) => {
                if (el) sectionRefs.current['countdown'] = el
              }}
              data-section="countdown"
              className={`rmb-section ${visibleSections['countdown'] ? 'visible' : ''}`}
            >
              <h2 className="rmb-heading">Còn lại</h2>
              <div className="rmb-countdown">
                <div className="rmb-countdown-item">
                  <div className="rmb-countdown-number">{days}</div>
                  <div className="rmb-countdown-label">Ngày</div>
                </div>
                <div className="rmb-countdown-item">
                  <div className="rmb-countdown-number">{hours}</div>
                  <div className="rmb-countdown-label">Giờ</div>
                </div>
              </div>
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
                  margin: '2rem auto',
                  maxWidth: '600px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(232, 92, 147, 0.1)'
                }}
              >
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="300"
                  style={{ border: 'none' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          {/* Album */}
          {(content.images || []).length > 0 && (
            <div
              ref={(el) => {
                if (el) sectionRefs.current['album'] = el
              }}
              data-section="album"
              className={`rmb-section ${visibleSections['album'] ? 'visible' : ''}`}
            >
              <h2 className="rmb-heading">Hình Ảnh</h2>
              <div className="rmb-gallery">
                {content.images.slice(0, 6).map((img, idx) => (
                  <div key={idx} className="rmb-gallery-item">
                    <img src={img} alt={`Gallery ${idx}`} className="rmb-gallery-img" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gift Section */}
          <div
            ref={(el) => {
              if (el) sectionRefs.current['gift'] = el
            }}
            data-section="gift"
            className={`rmb-section ${visibleSections['gift'] ? 'visible' : ''}`}
          >
            <h2 className="rmb-heading">Tiền Mừng</h2>
            <div className="rmb-gift-box">
              <div className="rmb-gift-title">🎁 Mừng Cưới</div>
              <p style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
                Xin cảm ơn tình cảm của bạn
              </p>

              {content.bank_name && (
                <div className="rmb-bank-info">
                  <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                    {content.bank_name}
                  </div>
                  <div>{content.account_number}</div>
                  <div style={{ fontSize: '0.85rem', marginTop: '0.25rem', fontStyle: 'italic' }}>
                    {content.account_name}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Audio Player */}
          {musicUrl && (
            <div style={{ textAlign: 'center', margin: '3rem 0', paddingBottom: '2rem' }}>
              <audio controls style={{ width: '100%', maxWidth: '400px' }}>
                <source src={musicUrl} type="audio/mpeg" />
              </audio>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
