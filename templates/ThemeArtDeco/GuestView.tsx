import MoneyGift from '@/components/guest/MoneyGift'
import RSVPForm from '@/components/guest/RSVPForm'
import Wishes from '@/components/guest/Wishes'
import Head from 'next/head'
import { TemplateProps } from '../TemplateRegistry'

export default function ArtDecoGuestView({ wedding, guestName, rsvpId }: TemplateProps) {
  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }
  const black = '#0e0e18'
  const darkCard = '#16162a'
  const gold = mergedContent.primary_color || '#d4ac4e'
  const textLight = '#f0e8d4'

  return (
    <>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;500&family=Raleway:wght@300;400&display=swap'
          rel='stylesheet'
        />
        <style>{`*{box-sizing:border-box;margin:0;padding:0}`}</style>
      </Head>
      <div style={{ background: black, fontFamily: "'Raleway', sans-serif", color: textLight, overflowX: 'hidden' }}>
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
            padding: '60px 32px'
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
                filter: 'brightness(0.28) saturate(0.4)'
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(14,14,24,0.6) 0%, rgba(14,14,24,0.88) 100%)'
            }}
          />
          {/* Decorative corners */}
          {[
            { top: 20, left: 20 },
            { top: 20, right: 20 },
            { bottom: 20, left: 20 },
            { bottom: 20, right: 20 }
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                ...(pos as any),
                width: 8,
                height: 8,
                border: `1px solid rgba(212,172,78,0.4)`,
                transform: 'rotate(45deg)',
                zIndex: 1
              }}
            />
          ))}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <p
              style={{
                fontSize: 8,
                letterSpacing: '0.7em',
                color: `rgba(212,172,78,0.6)`,
                textTransform: 'uppercase',
                fontFamily: "'Cinzel', serif",
                marginBottom: 16
              }}
            >
              Wedding Invitation
            </p>
            <h1
              style={{
                fontSize: 'clamp(1.8rem,8vw,3.5rem)',
                fontFamily: "'Cinzel Decorative', cursive",
                color: textLight,
                fontWeight: 400,
                lineHeight: 1.15,
                marginBottom: 10
              }}
            >
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </h1>
            {mergedContent.event_date && (
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: '0.35em',
                  color: gold,
                  fontFamily: "'Cinzel', serif",
                  textTransform: 'uppercase'
                }}
              >
                {mergedContent.event_date}
              </p>
            )}
            {guestName && (
              <div style={{ marginTop: 22, padding: '12px 24px', border: `1px solid rgba(212,172,78,0.3)` }}>
                <p
                  style={{
                    fontSize: 8,
                    letterSpacing: '0.45em',
                    color: `rgba(212,172,78,0.55)`,
                    textTransform: 'uppercase',
                    fontFamily: "'Cinzel', serif",
                    marginBottom: 4
                  }}
                >
                  Kính gửi
                </p>
                <p
                  style={{
                    fontSize: 'clamp(1rem,3.5vw,1.6rem)',
                    fontFamily: "'Cinzel Decorative', cursive",
                    color: gold,
                    fontWeight: 400
                  }}
                >
                  {guestName}
                </p>
              </div>
            )}
          </div>
        </section>

        <section style={{ background: darkCard, padding: '48px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 8,
                letterSpacing: '0.55em',
                color: gold,
                textTransform: 'uppercase',
                fontFamily: "'Cinzel', serif",
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
                <div key={i} style={{ padding: '14px 0', borderBottom: `1px solid rgba(212,172,78,0.1)` }}>
                  <p
                    style={{
                      fontSize: 8,
                      letterSpacing: '0.45em',
                      color: gold,
                      textTransform: 'uppercase',
                      fontFamily: "'Cinzel', serif",
                      marginBottom: 4
                    }}
                  >
                    {it.label}
                  </p>
                  <p style={{ fontSize: 14, color: textLight, lineHeight: 1.5 }}>{it.value}</p>
                </div>
              ))}
          </div>
        </section>

        <section style={{ background: black, padding: '52px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 8,
                letterSpacing: '0.55em',
                color: gold,
                textTransform: 'uppercase',
                fontFamily: "'Cinzel', serif",
                marginBottom: 8,
                textAlign: 'center'
              }}
            >
              Xác nhận tham dự
            </p>
            <RSVPForm weddingId={wedding.id} />
          </div>
        </section>
        <section style={{ background: darkCard, padding: '52px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 8,
                letterSpacing: '0.55em',
                color: gold,
                textTransform: 'uppercase',
                fontFamily: "'Cinzel', serif",
                marginBottom: 8,
                textAlign: 'center'
              }}
            >
              Lời chúc mừng
            </p>
            <Wishes weddingId={wedding.id} />
          </div>
        </section>
        <section style={{ background: black, padding: '52px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 8,
                letterSpacing: '0.55em',
                color: gold,
                textTransform: 'uppercase',
                fontFamily: "'Cinzel', serif",
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
            background: darkCard,
            borderTop: `1px solid rgba(212,172,78,0.12)`,
            padding: '36px 24px',
            textAlign: 'center'
          }}
        >
          <p
            style={{
              fontSize: 'clamp(1rem,3.5vw,1.8rem)',
              fontFamily: "'Cinzel Decorative', cursive",
              color: gold,
              fontWeight: 400,
              marginBottom: 6
            }}
          >
            {mergedContent.groom_name} & {mergedContent.bride_name}
          </p>
          <p
            style={{
              fontSize: 8,
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.18)',
              textTransform: 'uppercase',
              fontFamily: "'Cinzel', serif"
            }}
          >
            MoiMoi Studio
          </p>
        </section>
      </div>
    </>
  )
}
