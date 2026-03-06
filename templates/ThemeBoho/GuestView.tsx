import MoneyGift from '@/components/guest/MoneyGift'
import RSVPForm from '@/components/guest/RSVPForm'
import Wishes from '@/components/guest/Wishes'
import Head from 'next/head'
import { TemplateProps } from '../TemplateRegistry'

export default function BohoGuestView({ wedding, guestName, rsvpId }: TemplateProps) {
  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }

  const terra = mergedContent.primary_color || '#b8613a'
  const cream = '#fdf6ec'
  const creamDark = '#f5ead4'
  const textDark = '#2d1f0e'
  const textMid = '#7a5c3a'

  return (
    <>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Sacramento&family=Josefin+Sans:wght@300;400&display=swap'
          rel='stylesheet'
        />
        <style>{`*{box-sizing:border-box;margin:0;padding:0}`}</style>
      </Head>
      <div
        style={{ background: cream, fontFamily: "'Josefin Sans', sans-serif", color: textDark, overflowX: 'hidden' }}
      >
        {/* ── HERO ── */}
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
                filter: 'brightness(0.48) saturate(0.7) sepia(0.2)'
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(160deg, ${terra} 0%, #6b3f20 100%)`
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(45,31,14,0.3) 0%, rgba(45,31,14,0.75) 100%)'
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.45em',
                color: 'rgba(232,212,173,0.7)',
                textTransform: 'uppercase',
                marginBottom: 14
              }}
            >
              Wedding Invitation
            </p>
            <h1
              style={{
                fontSize: 'clamp(2.2rem,10vw,4.5rem)',
                fontFamily: "'Sacramento', cursive",
                color: '#fff',
                lineHeight: 1.05,
                marginBottom: 10
              }}
            >
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </h1>
            {mergedContent.event_date && (
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: '0.3em',
                  color: 'rgba(232,212,173,0.75)',
                  textTransform: 'uppercase'
                }}
              >
                {mergedContent.event_date}
              </p>
            )}
            {guestName && (
              <div
                style={{
                  marginTop: 22,
                  padding: '12px 20px',
                  border: `1px dashed rgba(232,212,173,0.4)`,
                  borderRadius: 4
                }}
              >
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.3em',
                    color: 'rgba(232,212,173,0.6)',
                    textTransform: 'uppercase',
                    marginBottom: 4
                  }}
                >
                  Kính gửi
                </p>
                <p style={{ fontSize: 'clamp(1.1rem,4vw,1.8rem)', fontFamily: "'Sacramento', cursive", color: '#fff' }}>
                  {guestName}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── EVENT INFO ── */}
        <section style={{ background: creamDark, padding: '48px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.4em',
                color: terra,
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
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 14,
                    padding: '14px 0',
                    borderBottom: `1px dashed rgba(184,97,58,0.2)`
                  }}
                >
                  <div style={{ width: 3, background: terra, borderRadius: 2, flexShrink: 0, opacity: 0.6 }} />
                  <div>
                    <p
                      style={{
                        fontSize: 9,
                        letterSpacing: '0.25em',
                        color: textMid,
                        textTransform: 'uppercase',
                        marginBottom: 3
                      }}
                    >
                      {it.label}
                    </p>
                    <p style={{ fontSize: 15, color: textDark, lineHeight: 1.5 }}>{it.value}</p>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* ── RSVP ── */}
        <section style={{ background: cream, padding: '52px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.4em',
                color: terra,
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

        {/* ── WISHES ── */}
        <section style={{ background: creamDark, padding: '52px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.4em',
                color: terra,
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

        {/* ── MONEY GIFT ── */}
        <section style={{ background: cream, padding: '52px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.4em',
                color: terra,
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

        {/* ── FOOTER ── */}
        <section style={{ background: terra, padding: '36px 24px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: 'clamp(1.5rem,5vw,2.5rem)',
              fontFamily: "'Sacramento', cursive",
              color: '#fff',
              marginBottom: 6
            }}
          >
            {mergedContent.groom_name} & {mergedContent.bride_name}
          </p>
          <p
            style={{ fontSize: 8, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}
          >
            MoiMoi Studio
          </p>
        </section>
      </div>
    </>
  )
}
