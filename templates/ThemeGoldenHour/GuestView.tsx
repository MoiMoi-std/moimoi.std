import MoneyGift from '@/components/guest/MoneyGift'
import RSVPForm from '@/components/guest/RSVPForm'
import Wishes from '@/components/guest/Wishes'
import Head from 'next/head'
import { TemplateProps } from '../TemplateRegistry'

export default function GoldenHourGuestView({ wedding, guestName, rsvpId }: TemplateProps) {
  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }
  const amber = mergedContent.primary_color || '#c96a2a'
  const amberLight = '#e8925a'
  const cream = '#fff8f0'
  const creamDark = '#fdecd8'
  const textDark = '#2a1400'

  return (
    <>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;1,400&family=Lato:wght@300;400&display=swap'
          rel='stylesheet'
        />
        <style>{`*{box-sizing:border-box;margin:0;padding:0}`}</style>
      </Head>
      <div style={{ background: cream, fontFamily: "'Lato', sans-serif", color: textDark, overflowX: 'hidden' }}>
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
                filter: 'brightness(0.48) saturate(0.8) sepia(0.2)'
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(135deg, #4a1800, ${amber}, ${amberLight})`
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(42,20,0,0.3) 0%, rgba(42,20,0,0.78) 100%)'
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.45em',
                color: 'rgba(240,192,96,0.7)',
                textTransform: 'uppercase',
                marginBottom: 14
              }}
            >
              Wedding Invitation
            </p>
            <h1
              style={{
                fontSize: 'clamp(2rem,9vw,4rem)',
                fontFamily: "'Libre Baskerville', serif",
                fontStyle: 'italic',
                color: '#fff',
                marginBottom: 8
              }}
            >
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </h1>
            {mergedContent.event_date && (
              <p style={{ fontSize: 11, letterSpacing: '0.2em', color: 'rgba(240,192,96,0.8)' }}>
                {mergedContent.event_date}
              </p>
            )}
            {guestName && (
              <div
                style={{
                  marginTop: 22,
                  padding: '12px 22px',
                  border: `1px solid rgba(240,192,96,0.35)`,
                  borderRadius: 4
                }}
              >
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.3em',
                    color: 'rgba(240,192,96,0.6)',
                    textTransform: 'uppercase',
                    marginBottom: 4
                  }}
                >
                  Kính gửi
                </p>
                <p
                  style={{
                    fontSize: 'clamp(1.1rem,4vw,1.8rem)',
                    fontFamily: "'Libre Baskerville', serif",
                    fontStyle: 'italic',
                    color: '#fff'
                  }}
                >
                  {guestName}
                </p>
              </div>
            )}
          </div>
        </section>

        <section style={{ background: creamDark, padding: '48px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.4em',
                color: amber,
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
                <div key={i} style={{ padding: '14px 0', borderBottom: `1px solid rgba(201,106,42,0.12)` }}>
                  <p
                    style={{
                      fontSize: 9,
                      letterSpacing: '0.3em',
                      color: amber,
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

        <section style={{ background: cream, padding: '52px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.4em',
                color: amber,
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
        <section style={{ background: creamDark, padding: '52px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.4em',
                color: amber,
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
        <section style={{ background: cream, padding: '52px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.4em',
                color: amber,
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
        <section
          style={{
            background: `linear-gradient(135deg, ${amber}, ${amberLight})`,
            padding: '36px 24px',
            textAlign: 'center'
          }}
        >
          <p
            style={{
              fontSize: 'clamp(1rem,3.5vw,1.6rem)',
              fontFamily: "'Libre Baskerville', serif",
              fontStyle: 'italic',
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
