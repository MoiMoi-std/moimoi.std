import MoneyGift from '@/components/guest/MoneyGift'
import RSVPForm from '@/components/guest/RSVPForm'
import Wishes from '@/components/guest/Wishes'
import Head from 'next/head'
import { TemplateProps } from '../TemplateRegistry'

export default function OceanGuestView({ wedding, guestName, rsvpId }: TemplateProps) {
  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }

  const teal = mergedContent.primary_color || '#0a7b96'
  const tealDark = '#065a70'
  const aqua = '#4ec6d8'
  const seafoam = '#e0f6fa'
  const deep = '#0a2435'
  const textDark = '#0d2d38'

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Nunito:wght@300;400&display=swap" rel="stylesheet" />
        <style>{`*{box-sizing:border-box;margin:0;padding:0}`}</style>
      </Head>
      <div style={{ background: seafoam, fontFamily: "'Nunito', sans-serif", color: textDark, overflowX: 'hidden' }}>

        {/* ── HERO ── */}
        <section style={{ position: 'relative', minHeight: '55vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: deep, overflow: 'hidden', textAlign: 'center', padding: '60px 24px' }}>
          {mergedContent.cover_image && (
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${mergedContent.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.38) saturate(0.7) hue-rotate(10deg)' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,36,53,0.4) 0%, rgba(10,36,53,0.82) 100%)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 9, letterSpacing: '0.5em', color: `rgba(78,198,216,0.65)`, textTransform: 'uppercase', marginBottom: 16 }}>Wedding Invitation</p>
            <h1 style={{ fontSize: 'clamp(2rem,9vw,4rem)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#fff', marginBottom: 8 }}>
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </h1>
            {mergedContent.event_date && (
              <p style={{ fontSize: 11, letterSpacing: '0.2em', color: aqua }}>{mergedContent.event_date}</p>
            )}
            {guestName && (
              <div style={{ marginTop: 22, padding: '12px 22px', border: `1px solid rgba(78,198,216,0.3)`, borderRadius: 24 }}>
                <p style={{ fontSize: 9, letterSpacing: '0.3em', color: `rgba(78,198,216,0.6)`, textTransform: 'uppercase', marginBottom: 4 }}>Kính gửi</p>
                <p style={{ fontSize: 'clamp(1.1rem,4vw,1.7rem)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#fff' }}>{guestName}</p>
              </div>
            )}
          </div>
        </section>

        {/* ── EVENT INFO ── */}
        <section style={{ background: `linear-gradient(160deg, ${teal}18 0%, ${aqua}12 100%)`, padding: '48px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p style={{ fontSize: 9, letterSpacing: '0.5em', color: teal, textTransform: 'uppercase', marginBottom: 20, textAlign: 'center' }}>Chi tiết sự kiện</p>
            {[
              { label: 'Thời gian', value: mergedContent.event_date && mergedContent.wedding_time ? `${mergedContent.event_date} · ${mergedContent.wedding_time}` : mergedContent.event_date },
              { label: 'Địa điểm', value: mergedContent.address }
            ].filter(it => it.value).map((it, i) => (
              <div key={i} style={{ padding: '14px 0', borderBottom: `1px solid rgba(10,123,150,0.12)` }}>
                <p style={{ fontSize: 9, letterSpacing: '0.3em', color: teal, textTransform: 'uppercase', marginBottom: 4 }}>{it.label}</p>
                <p style={{ fontSize: 15, color: textDark, lineHeight: 1.5 }}>{it.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── RSVP ── */}
        <section style={{ background: seafoam, padding: '52px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p style={{ fontSize: 9, letterSpacing: '0.5em', color: teal, textTransform: 'uppercase', marginBottom: 8, textAlign: 'center' }}>Xác nhận tham dự</p>
            <RSVPForm weddingId={wedding.id} />
          </div>
        </section>

        <section style={{ background: `${teal}12`, padding: '52px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p style={{ fontSize: 9, letterSpacing: '0.5em', color: teal, textTransform: 'uppercase', marginBottom: 8, textAlign: 'center' }}>Lời chúc mừng</p>
            <Wishes weddingId={wedding.id} />
          </div>
        </section>

        <section style={{ background: seafoam, padding: '52px 24px' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <p style={{ fontSize: 9, letterSpacing: '0.5em', color: teal, textTransform: 'uppercase', marginBottom: 8, textAlign: 'center' }}>Hộp mừng cưới</p>
            <MoneyGift content={mergedContent} />
          </div>
        </section>

        <section style={{ background: tealDark, padding: '36px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 'clamp(1rem,3.5vw,1.6rem)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#fff', marginBottom: 6 }}>{mergedContent.groom_name} & {mergedContent.bride_name}</p>
          <p style={{ fontSize: 8, letterSpacing: '0.3em', color: `rgba(78,198,216,0.3)`, textTransform: 'uppercase' }}>MoiMoi Studio</p>
        </section>
      </div>
    </>
  )
}
