import Head from 'next/head'
import { TemplateProps } from '../TemplateRegistry'
import RSVPForm from '@/components/guest/RSVPForm'
import Wishes from '@/components/guest/Wishes'
import MoneyGift from '@/components/guest/MoneyGift'

export default function PastelGuestView({ wedding, rsvpId, guestName }: TemplateProps) {
  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }

  const blush = '#f7c5d0'
  const sky = '#c0d8f4'
  const mint = '#baf0d8'
  const lavender = '#d8c0f4'
  const white = '#fdfaff'
  const softWhite = '#f5f0fa'
  const accent1 = mergedContent.primary_color || '#e890b0'
  const textDark = '#2a1a30'
  const textMid = '#7060a0'

  if (!wedding)
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: white
        }}
      >
        <h1 style={{ color: accent1, fontFamily: "'Dancing Script', cursive" }}>Không tìm thấy thiệp cưới</h1>
      </div>
    )

  return (
    <>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600&family=Poppins:wght@300;400&display=swap'
          rel='stylesheet'
        />
        <style>{`
          @keyframes psBlob{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}}
          .ps-blob{animation:psBlob 8s ease-in-out infinite}
          *{box-sizing:border-box;margin:0;padding:0}
        `}</style>
      </Head>
      <div style={{ background: white, fontFamily: "'Poppins', sans-serif", color: textDark, overflowX: 'hidden' }}>
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
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, rgba(247,197,208,0.55) 0%, rgba(192,216,244,0.45) 30%, rgba(216,192,244,0.45) 60%, rgba(186,240,216,0.5) 100%)`
            }}
          />
          {mergedContent.cover_image && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${mergedContent.cover_image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.2,
                filter: 'saturate(0.7)'
              }}
            />
          )}
          {/* Blobs */}
          <div
            className='ps-blob'
            style={{
              position: 'absolute',
              top: '5%',
              left: '5%',
              width: 80,
              height: 80,
              background: blush,
              opacity: 0.3,
              filter: 'blur(20px)'
            }}
          />
          <div
            className='ps-blob'
            style={{
              position: 'absolute',
              bottom: '10%',
              right: '8%',
              width: 90,
              height: 70,
              background: sky,
              opacity: 0.25,
              filter: 'blur(20px)',
              animationDelay: '2s'
            }}
          />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
              {[blush, sky, lavender, mint].map((c, i) => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />
              ))}
            </div>
            <p
              style={{
                fontSize: 9,
                letterSpacing: '0.4em',
                color: accent1,
                textTransform: 'uppercase',
                marginBottom: 12,
                fontWeight: 400
              }}
            >
              Trân trọng kính mời
            </p>
            <h1
              style={{
                fontSize: 'clamp(2.2rem,8vw,5rem)',
                fontFamily: "'Dancing Script', cursive",
                fontWeight: 600,
                color: textDark,
                lineHeight: 1,
                marginBottom: 12
              }}
            >
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </h1>
            {mergedContent.wedding_date && (
              <p style={{ fontSize: 13, color: textMid, letterSpacing: '0.05em', fontWeight: 300 }}>
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
              background: softWhite,
              padding: '26px 24px',
              textAlign: 'center',
              borderBottom: `2px solid ${blush}`
            }}
          >
            <p
              style={{
                fontSize: 10,
                letterSpacing: '0.3em',
                color: textMid,
                textTransform: 'uppercase',
                marginBottom: 5,
                fontWeight: 400
              }}
            >
              Kính gửi
            </p>
            <p
              style={{
                fontSize: 'clamp(1.3rem,5vw,2rem)',
                fontFamily: "'Dancing Script', cursive",
                fontWeight: 600,
                color: textDark
              }}
            >
              {guestName}
            </p>
          </section>
        )}

        {/* Event details */}
        <section style={{ background: white, padding: '40px 24px' }}>
          <div style={{ maxWidth: 460, margin: '0 auto' }}>
            {[
              { label: 'Ngày cưới', value: mergedContent.event_date || mergedContent.wedding_date, c: blush },
              { label: 'Giờ cưới', value: mergedContent.wedding_time, c: sky },
              { label: 'Địa điểm', value: mergedContent.address, c: lavender },
              { label: 'Lịch âm', value: mergedContent.lunar_date, c: mint }
            ]
              .filter((it) => it.value)
              .map((it, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: '12px 0',
                    borderBottom: `1px solid rgba(216,192,244,0.2)`
                  }}
                >
                  <div
                    style={{ width: 6, height: 34, borderRadius: 3, background: it.c, flexShrink: 0, opacity: 0.8 }}
                  />
                  <div style={{ paddingTop: 4 }}>
                    <p
                      style={{
                        fontSize: 9,
                        letterSpacing: '0.3em',
                        color: accent1,
                        textTransform: 'uppercase',
                        marginBottom: 3,
                        fontWeight: 400
                      }}
                    >
                      {it.label}
                    </p>
                    <p style={{ fontSize: 15, color: textDark, fontWeight: 300 }}>{it.value}</p>
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
                  padding: '10px 24px',
                  background: blush,
                  color: textDark,
                  textDecoration: 'none',
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  borderRadius: 24,
                  fontWeight: 400
                }}
              >
                Xem bản đồ
              </a>
            )}
          </div>
        </section>

        {/* RSVP */}
        <section style={{ background: softWhite, padding: '40px 24px' }}>
          <div style={{ maxWidth: 460, margin: '0 auto' }}>
            <RSVPForm weddingId={wedding.id} />
          </div>
        </section>

        {/* MoneyGift */}
        <section style={{ background: white, padding: '40px 24px' }}>
          <div style={{ maxWidth: 460, margin: '0 auto' }}>
            <MoneyGift content={mergedContent} />
          </div>
        </section>

        {/* Wishes */}
        <section style={{ background: softWhite, padding: '40px 24px' }}>
          <div style={{ maxWidth: 460, margin: '0 auto' }}>
            <Wishes weddingId={wedding.id} />
          </div>
        </section>

        {/* Footer */}
        <section
          style={{
            background: `linear-gradient(135deg, ${blush} 0%, ${sky} 50%, ${lavender} 100%)`,
            padding: '36px 24px',
            textAlign: 'center'
          }}
        >
          <p
            style={{
              fontSize: 'clamp(1.1rem,4vw,1.8rem)',
              fontFamily: "'Dancing Script', cursive",
              fontWeight: 600,
              color: textDark,
              marginBottom: 6
            }}
          >
            {mergedContent.groom_name} & {mergedContent.bride_name}
          </p>
          <p style={{ fontSize: 8, letterSpacing: '0.3em', color: 'rgba(42,26,48,0.3)', textTransform: 'uppercase' }}>
            MoiMoi Studio
          </p>
        </section>
      </div>
    </>
  )
}
