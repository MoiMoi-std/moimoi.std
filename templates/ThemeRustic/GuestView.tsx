import Head from 'next/head'
import { TemplateProps } from '../TemplateRegistry'
import RSVPForm from '@/components/guest/RSVPForm'
import Wishes from '@/components/guest/Wishes'
import MoneyGift from '@/components/guest/MoneyGift'

export default function RusticGuestView({ wedding, rsvpId, guestName }: TemplateProps) {
  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }

  const bark = '#3d1f0a'
  const barkMid = '#5a2e10'
  const honey = mergedContent.primary_color || '#c4873a'
  const kraft = '#f0dfc0'
  const kraftDark = '#e0ccaa'
  const warmWhite = '#fdf8f0'
  const textDark = '#2a1206'
  const textMid = '#6b3d1a'

  if (!wedding)
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: bark
        }}
      >
        <h1 style={{ color: honey, fontFamily: "'Playfair Display', serif" }}>Không tìm thấy thiệp cưới</h1>
      </div>
    )

  return (
    <>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Source+Serif+4:ital,wght@0,300;1,300&display=swap'
          rel='stylesheet'
        />
        <style>{`*{box-sizing:border-box;margin:0;padding:0}`}</style>
      </Head>
      <div
        style={{
          background: warmWhite,
          fontFamily: "'Source Serif 4', Georgia, serif",
          color: textDark,
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
                filter: 'brightness(0.35) saturate(0.8) sepia(0.2)'
              }}
            />
          )}
          {!mergedContent.cover_image && (
            <div
              style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${bark}, ${barkMid})` }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(61,31,10,0.5), rgba(61,31,10,0.1) 40%, rgba(61,31,10,0.88))'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: `repeating-linear-gradient(90deg, ${honey} 0, ${honey} 6px, transparent 6px, transparent 12px)`,
              opacity: 0.4
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.5em',
                color: 'rgba(232,172,96,0.8)',
                textTransform: 'uppercase',
                fontStyle: 'italic',
                marginBottom: 14
              }}
            >
              Together forever
            </p>
            <h1
              style={{
                fontSize: 'clamp(2.2rem,8vw,5rem)',
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                color: kraft,
                lineHeight: 1.15,
                marginBottom: 12
              }}
            >
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </h1>
            {mergedContent.wedding_date && (
              <p
                style={{
                  fontSize: 13,
                  color: 'rgba(232,172,96,0.65)',
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
          <section
            style={{
              background: kraftDark,
              padding: '26px 24px',
              textAlign: 'center',
              borderBottom: `1px dashed rgba(196,135,58,0.3)`
            }}
          >
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.3em',
                color: textMid,
                textTransform: 'uppercase',
                fontStyle: 'italic',
                marginBottom: 5
              }}
            >
              Thân mời
            </p>
            <p
              style={{
                fontSize: 'clamp(1.3rem,5vw,2rem)',
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                color: barkMid
              }}
            >
              {guestName}
            </p>
          </section>
        )}

        {/* Event details */}
        <section style={{ background: warmWhite, padding: '40px 24px' }}>
          <div style={{ maxWidth: 460, margin: '0 auto' }}>
            {[
              { label: 'Ngày cưới', value: mergedContent.event_date || mergedContent.wedding_date },
              { label: 'Giờ cưới', value: mergedContent.wedding_time },
              { label: 'Địa điểm', value: mergedContent.address },
              { label: 'Lịch âm', value: mergedContent.lunar_date }
            ]
              .filter((it) => it.value)
              .map((it, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 14,
                    padding: '12px 0',
                    borderBottom: `1px dashed rgba(196,135,58,0.2)`
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      background: honey,
                      borderRadius: '50%',
                      marginTop: 6,
                      flexShrink: 0,
                      opacity: 0.7
                    }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: 9,
                        letterSpacing: '0.3em',
                        color: honey,
                        textTransform: 'uppercase',
                        fontStyle: 'italic',
                        marginBottom: 3
                      }}
                    >
                      {it.label}
                    </p>
                    <p style={{ fontSize: 15, color: textDark }}>{it.value}</p>
                  </div>
                </div>
              ))}
            {mergedContent.map_url && (
              <a
                href={mergedContent.map_url}
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  display: 'inline-block',
                  marginTop: 18,
                  padding: '10px 22px',
                  border: `1px solid ${honey}`,
                  color: honey,
                  textDecoration: 'none',
                  fontSize: 10,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  fontStyle: 'italic',
                  borderRadius: 4
                }}
              >
                Xem bản đồ
              </a>
            )}
          </div>
        </section>

        {/* RSVP */}
        <section style={{ background: kraft, padding: '40px 24px' }}>
          <div style={{ maxWidth: 460, margin: '0 auto' }}>
            <RSVPForm weddingId={wedding.id} />
          </div>
        </section>

        {/* MoneyGift */}
        <section style={{ background: warmWhite, padding: '40px 24px' }}>
          <div style={{ maxWidth: 460, margin: '0 auto' }}>
            <MoneyGift content={mergedContent} />
          </div>
        </section>

        {/* Wishes */}
        <section style={{ background: kraft, padding: '40px 24px' }}>
          <div style={{ maxWidth: 460, margin: '0 auto' }}>
            <Wishes weddingId={wedding.id} />
          </div>
        </section>

        {/* Footer */}
        <section
          style={{
            background: bark,
            borderTop: `3px solid rgba(196,135,58,0.3)`,
            padding: '36px 24px',
            textAlign: 'center'
          }}
        >
          <p
            style={{
              fontSize: 'clamp(1.1rem,4vw,1.8rem)',
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              color: kraft,
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
