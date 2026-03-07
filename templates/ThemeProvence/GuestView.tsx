import MoneyGift from '@/components/guest/MoneyGift'
import RSVPForm from '@/components/guest/RSVPForm'
import Wishes from '@/components/guest/Wishes'
import Head from 'next/head'
import { TemplateProps } from '../TemplateRegistry'

export default function ProvenceGuestView({ wedding, guestName, rsvpId }: TemplateProps) {
  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }
  const lavender = mergedContent.primary_color || '#7c6ea8'
  const lavBg = '#f5f0fc'
  const lavCard = '#ede6f8'
  const textDark = '#2e1f3e'
  const textMid = '#6b5880'

  return (
    <>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Great+Vibes&family=Lato:wght@300;400&display=swap'
          rel='stylesheet'
        />
        <style>{`*{box-sizing:border-box;margin:0;padding:0}`}</style>
      </Head>
      <div style={{ background: lavBg, fontFamily: "'Lato', sans-serif", color: textDark, overflowX: 'hidden' }}>
        <section
          style={{
            position: 'relative',
            minHeight: '55vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            textAlign: 'center',
            padding: '60px 24px'
          }}
        >
          {mergedContent.cover_image ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${mergedContent.cover_image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.48) saturate(0.65) hue-rotate(260deg) brightness(0.85)'
              }}
            />
          ) : (
            <div
              style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, #2e1f3e, ${lavender})` }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(46,31,62,0.4) 0%, rgba(46,31,62,0.8) 100%)'
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.5em',
                color: 'rgba(196,180,212,0.7)',
                textTransform: 'uppercase',
                marginBottom: 14
              }}
            >
              Avec amour
            </p>
            <h1
              style={{
                fontSize: 'clamp(2.2rem,10vw,4.5rem)',
                fontFamily: "'Great Vibes', cursive",
                color: '#fff',
                lineHeight: 1.15,
                marginBottom: 10
              }}
            >
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </h1>
            {mergedContent.event_date && (
              <p style={{ fontSize: 11, letterSpacing: '0.2em', color: 'rgba(196,180,212,0.75)' }}>
                {mergedContent.event_date}
              </p>
            )}
            {guestName && (
              <div
                style={{
                  marginTop: 22,
                  padding: '12px 20px',
                  border: `1px solid rgba(196,180,212,0.3)`,
                  borderRadius: 12
                }}
              >
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.3em',
                    color: 'rgba(196,180,212,0.55)',
                    textTransform: 'uppercase',
                    marginBottom: 4
                  }}
                >
                  Kính gửi
                </p>
                <p
                  style={{ fontSize: 'clamp(1.1rem,4vw,1.8rem)', fontFamily: "'Great Vibes', cursive", color: '#fff' }}
                >
                  {guestName}
                </p>
              </div>
            )}
          </div>
        </section>

        <section style={{ background: lavCard, padding: '48px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.4em',
                color: lavender,
                textTransform: 'uppercase',
                marginBottom: 20,
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
                <div key={i} style={{ padding: '14px 0', borderBottom: `1px solid rgba(124,110,168,0.14)` }}>
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
          </div>
        </section>

        <section style={{ background: lavBg, padding: '52px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.4em',
                color: lavender,
                textTransform: 'uppercase',
                marginBottom: 8,
                textAlign: 'center'
              }}
            >
              Xác nhận tham dự
            </p>
            <RSVPForm weddingId={wedding.id} />
          </div>
        </section>
        <section style={{ background: lavCard, padding: '52px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.4em',
                color: lavender,
                textTransform: 'uppercase',
                marginBottom: 8,
                textAlign: 'center'
              }}
            >
              Lời chúc mừng
            </p>
            <Wishes weddingId={wedding.id} />
          </div>
        </section>
        <section style={{ background: lavBg, padding: '52px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.4em',
                color: lavender,
                textTransform: 'uppercase',
                marginBottom: 8,
                textAlign: 'center'
              }}
            >
              Hộp mừng cưới
            </p>
            <MoneyGift content={mergedContent} />
          </div>
        </section>
        <section style={{ background: lavender, padding: '36px 24px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: 'clamp(1.5rem,5vw,2.8rem)',
              fontFamily: "'Great Vibes', cursive",
              color: '#fff',
              marginBottom: 6
            }}
          >
            {mergedContent.groom_name} & {mergedContent.bride_name}
          </p>
          <p
            style={{ fontSize: 8, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}
          >
            MoiMoi Studio
          </p>
        </section>
      </div>
    </>
  )
}
