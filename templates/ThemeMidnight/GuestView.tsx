import Head from 'next/head'
import { TemplateProps } from '../TemplateRegistry'
import RSVPForm from '@/components/guest/RSVPForm'
import Wishes from '@/components/guest/Wishes'
import MoneyGift from '@/components/guest/MoneyGift'

export default function MidnightGuestView({ wedding, rsvpId, guestName }: TemplateProps) {
  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }

  const midnight = '#06071a'
  const deepBlue = '#0d1130'
  const wine = mergedContent.primary_color || '#7a1a3c'
  const wineLight = '#c04070'
  const candle = '#f0d090'
  const candleLight = '#fff8e8'
  const textMid = '#9088b8'

  if (!wedding)
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: midnight
        }}
      >
        <h1 style={{ color: candle, fontFamily: "'Playfair Display', serif" }}>Không tìm thấy thiệp cưới</h1>
      </div>
    )

  return (
    <>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Montserrat:wght@300;400&display=swap'
          rel='stylesheet'
        />
        <style>{`*{box-sizing:border-box;margin:0;padding:0}`}</style>
      </Head>
      <div
        style={{
          background: midnight,
          fontFamily: "'Montserrat', sans-serif",
          color: candleLight,
          overflowX: 'hidden'
        }}
      >
        {/* Hero */}
        <section
          style={{
            position: 'relative',
            minHeight: '55vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            overflow: 'hidden',
            padding: '60px 24px'
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
                filter: 'brightness(0.25) saturate(0.5) hue-rotate(200deg)'
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to bottom, rgba(6,7,26,0.5), rgba(6,7,26,0.2) 40%, rgba(6,7,26,0.9))`
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.5em',
                color: candle,
                textTransform: 'uppercase',
                marginBottom: 12
              }}
            >
              Trân trọng kính mời
            </p>
            <h1
              style={{
                fontSize: 'clamp(2.4rem,9vw,5rem)',
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                color: candleLight,
                lineHeight: 1,
                marginBottom: 12
              }}
            >
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </h1>
            {mergedContent.wedding_date && (
              <p
                style={{
                  fontSize: 13,
                  color: 'rgba(240,208,144,0.65)',
                  letterSpacing: '0.1em',
                  fontStyle: 'italic',
                  fontFamily: "'Playfair Display', serif"
                }}
              >
                {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
        </section>

        {/* Guest name */}
        {guestName && (
          <section style={{ background: deepBlue, padding: '32px 24px', textAlign: 'center' }}>
            <p
              style={{
                fontSize: 11,
                letterSpacing: '0.3em',
                color: textMid,
                textTransform: 'uppercase',
                marginBottom: 6
              }}
            >
              Kính gửi
            </p>
            <p
              style={{
                fontSize: 'clamp(1.4rem,5vw,2.2rem)',
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                color: candle
              }}
            >
              {guestName}
            </p>
          </section>
        )}

        {/* Event details */}
        <section style={{ background: midnight, padding: '40px 24px' }}>
          <div style={{ maxWidth: 460, margin: '0 auto' }}>
            {[
              { label: 'Ngày cưới', value: mergedContent.event_date || mergedContent.wedding_date },
              { label: 'Giờ lễ', value: mergedContent.wedding_time },
              { label: 'Địa điểm', value: mergedContent.address },
              { label: 'Lịch âm', value: mergedContent.lunar_date }
            ]
              .filter((it) => it.value)
              .map((it, i) => (
                <div key={i} style={{ padding: '12px 0', borderBottom: `1px solid rgba(122,26,60,0.15)` }}>
                  <p
                    style={{
                      fontSize: 9,
                      letterSpacing: '0.35em',
                      color: wineLight,
                      textTransform: 'uppercase',
                      marginBottom: 3
                    }}
                  >
                    {it.label}
                  </p>
                  <p style={{ fontSize: 15, color: candleLight }}>{it.value}</p>
                </div>
              ))}
            {mergedContent.map_url && (
              <a
                href={mergedContent.map_url}
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  display: 'inline-block',
                  marginTop: 20,
                  padding: '10px 24px',
                  border: `1px solid rgba(122,26,60,0.45)`,
                  color: wineLight,
                  textDecoration: 'none',
                  fontSize: 10,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  borderRadius: 4
                }}
              >
                Xem bản đồ
              </a>
            )}
          </div>
        </section>

        {/* RSVP */}
        <section style={{ background: deepBlue, padding: '40px 24px' }}>
          <div style={{ maxWidth: 460, margin: '0 auto' }}>
            <RSVPForm weddingId={wedding.id} />
          </div>
        </section>

        {/* MoneyGift */}
        <section style={{ background: midnight, padding: '40px 24px' }}>
          <div style={{ maxWidth: 460, margin: '0 auto' }}>
            <MoneyGift content={mergedContent} />
          </div>
        </section>

        {/* Wishes */}
        <section style={{ background: deepBlue, padding: '40px 24px' }}>
          <div style={{ maxWidth: 460, margin: '0 auto' }}>
            <Wishes weddingId={wedding.id} />
          </div>
        </section>

        {/* Footer */}
        <section
          style={{
            background: midnight,
            borderTop: `1px solid rgba(122,26,60,0.2)`,
            padding: '36px 24px',
            textAlign: 'center'
          }}
        >
          <p
            style={{
              fontSize: 'clamp(1.1rem,4vw,1.7rem)',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              color: candleLight,
              marginBottom: 6
            }}
          >
            {mergedContent.groom_name} & {mergedContent.bride_name}
          </p>
          <p
            style={{ fontSize: 8, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase' }}
          >
            MoiMoi Studio
          </p>
        </section>
      </div>
    </>
  )
}
