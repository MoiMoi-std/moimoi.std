import MoneyGift from '@/components/guest/MoneyGift'
import RSVPForm from '@/components/guest/RSVPForm'
import Wishes from '@/components/guest/Wishes'
import Head from 'next/head'
import { TemplateProps } from '../TemplateRegistry'

export default function RoyalGuestView({ wedding, guestName, rsvpId }: TemplateProps) {
  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }

  const navy = '#0f1b35'
  const navyMid = '#162548'
  const gold = mergedContent.primary_color || '#c9a227'
  const parchment = '#f9f4e8'
  const parchmentDark = '#f0e8d0'
  const textDark = '#1e1a0f'
  const textMid = '#5c4f2a'

  return (
    <>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Cinzel:wght@400;500&display=swap'
          rel='stylesheet'
        />
        <style>{`*{box-sizing:border-box;margin:0;padding:0}`}</style>
      </Head>
      <div
        style={{
          background: parchment,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          color: textDark,
          overflowX: 'hidden'
        }}
      >
        {/* ── HERO ── */}
        <section
          style={{
            position: 'relative',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: navy,
            overflow: 'hidden',
            textAlign: 'center',
            padding: '64px 28px'
          }}
        >
          {mergedContent.cover_image && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${mergedContent.cover_image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.3) saturate(0.5)'
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(15,27,53,0.5) 0%, rgba(15,27,53,0.85) 100%)'
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p
              style={{
                fontSize: 8,
                letterSpacing: '0.6em',
                color: `rgba(201,162,39,0.65)`,
                textTransform: 'uppercase',
                fontFamily: "'Cinzel',serif",
                marginBottom: 20
              }}
            >
              Wedding Invitation
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 1, background: `linear-gradient(to right, transparent, ${gold})` }} />
              <svg width='12' height='12' viewBox='0 0 12 12'>
                <path
                  d='M6 0 L7.2 3.8 L11.4 3.8 L8 6.2 L9.2 10.5 L6 8 L2.8 10.5 L4 6.2 L0.6 3.8 L4.8 3.8 Z'
                  fill={gold}
                  opacity='0.7'
                />
              </svg>
              <div style={{ width: 36, height: 1, background: `linear-gradient(to left, transparent, ${gold})` }} />
            </div>
            <h1
              style={{
                fontSize: 'clamp(2rem,9vw,4rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: '#fff',
                marginBottom: 8
              }}
            >
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </h1>
            {mergedContent.event_date && (
              <p style={{ fontSize: 12, letterSpacing: '0.2em', color: gold, fontFamily: "'Cinzel',serif" }}>
                {mergedContent.event_date}
              </p>
            )}
            {guestName && (
              <div style={{ marginTop: 24, padding: '12px 24px', border: `1px solid rgba(201,162,39,0.35)` }}>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.3em',
                    color: `rgba(201,162,39,0.6)`,
                    textTransform: 'uppercase',
                    fontFamily: "'Cinzel',serif",
                    marginBottom: 4
                  }}
                >
                  Kính gửi
                </p>
                <p style={{ fontSize: 'clamp(1.1rem,4vw,1.7rem)', fontStyle: 'italic', color: parchment }}>
                  {guestName}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── EVENT INFO ── */}
        <section style={{ background: parchmentDark, padding: '48px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.5em',
                color: gold,
                textTransform: 'uppercase',
                fontFamily: "'Cinzel',serif",
                marginBottom: 24,
                textAlign: 'center'
              }}
            >
              Chi tiết sự kiện
            </p>
            {[
              {
                label: 'Thời gian',
                value:
                  mergedContent.event_date && mergedContent.wedding_time
                    ? `${mergedContent.event_date} · ${mergedContent.wedding_time}`
                    : mergedContent.event_date
              },
              { label: 'Địa điểm', value: mergedContent.address }
            ]
              .filter((it) => it.value)
              .map((it, i) => (
                <div key={i} style={{ padding: '14px 0', borderBottom: `1px solid rgba(201,162,39,0.18)` }}>
                  <p
                    style={{
                      fontSize: 8,
                      letterSpacing: '0.3em',
                      color: textMid,
                      textTransform: 'uppercase',
                      fontFamily: "'Cinzel',serif",
                      marginBottom: 4
                    }}
                  >
                    {it.label}
                  </p>
                  <p style={{ fontSize: 15, color: textDark, lineHeight: 1.5 }}>{it.value}</p>
                </div>
              ))}
          </div>
        </section>

        {/* ── RSVP ── */}
        <section style={{ background: navy, padding: '52px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.5em',
                color: gold,
                textTransform: 'uppercase',
                fontFamily: "'Cinzel',serif",
                marginBottom: 8,
                textAlign: 'center'
              }}
            >
              Xác nhận tham dự
            </p>
            <RSVPForm weddingId={wedding.id} />
          </div>
        </section>

        {/* ── WISHES ── */}
        <section style={{ background: parchmentDark, padding: '52px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.5em',
                color: gold,
                textTransform: 'uppercase',
                fontFamily: "'Cinzel',serif",
                marginBottom: 8,
                textAlign: 'center'
              }}
            >
              Lời chúc mừng
            </p>
            <Wishes weddingId={wedding.id} />
          </div>
        </section>

        {/* ── MONEY GIFT ── */}
        <section style={{ background: navy, padding: '52px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.5em',
                color: gold,
                textTransform: 'uppercase',
                fontFamily: "'Cinzel',serif",
                marginBottom: 8,
                textAlign: 'center'
              }}
            >
              Hộp mừng cưới
            </p>
            <MoneyGift content={mergedContent} />
          </div>
        </section>

        {/* ── FOOTER ── */}
        <section style={{ background: navyMid, padding: '36px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 'clamp(1rem,3.5vw,1.5rem)', fontStyle: 'italic', color: parchment, marginBottom: 6 }}>
            {mergedContent.groom_name} & {mergedContent.bride_name}
          </p>
          <p
            style={{
              fontSize: 8,
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase',
              fontFamily: "'Cinzel',serif"
            }}
          >
            MoiMoi Studio
          </p>
        </section>
      </div>
    </>
  )
}
