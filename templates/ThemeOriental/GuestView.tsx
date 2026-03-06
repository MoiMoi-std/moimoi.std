import Head from 'next/head'
import { TemplateProps } from '../TemplateRegistry'
import RSVPForm from '@/components/guest/RSVPForm'
import Wishes from '@/components/guest/Wishes'
import MoneyGift from '@/components/guest/MoneyGift'

export default function OrientalGuestView({ wedding, rsvpId, guestName }: TemplateProps) {
  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }

  const darkRed = '#5c0a0a'
  const red = mergedContent.primary_color || '#8b1a1a'
  const gold = '#d4a830'
  const goldLight = '#f0cc60'
  const ricePaper = '#fdf5e4'
  const riceDark = '#f0e4c4'
  const textMid = '#6a3a1a'

  if (!wedding) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: darkRed }}>
      <h1 style={{ color: gold, fontFamily: "'Noto Serif SC', serif" }}>Không tìm thấy thiệp cưới</h1>
    </div>
  )

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500&family=Be+Vietnam+Pro:wght@300;400&display=swap" rel="stylesheet" />
        <style>{`*{box-sizing:border-box;margin:0;padding:0}`}</style>
      </Head>
      <div style={{ background: ricePaper, fontFamily: "'Be Vietnam Pro', sans-serif", color: darkRed, overflowX: 'hidden' }}>

        {/* Hero */}
        <section style={{ position: 'relative', minHeight: '58vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', overflow: 'hidden', padding: '60px 24px' }}>
          {mergedContent.cover_image && (
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${mergedContent.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.3) saturate(0.7) sepia(0.3)' }} />
          )}
          {!mergedContent.cover_image && (
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${darkRed}, ${red})` }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(92,10,10,0.55), rgba(92,10,10,0.15) 40%, rgba(92,10,10,0.88))' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(to right, ${gold}, ${goldLight}, ${gold})`, opacity: 0.7 }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, ${gold}, ${goldLight}, ${gold})`, opacity: 0.5 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 9, letterSpacing: '0.5em', color: gold, textTransform: 'uppercase', fontFamily: "'Noto Serif SC', serif", marginBottom: 14 }}>Hân hạnh kính mời</p>
            <h1 style={{ fontSize: 'clamp(2.2rem,8vw,5rem)', fontFamily: "'Noto Serif SC', serif", color: goldLight, lineHeight: 1, marginBottom: 12 }}>
              {mergedContent.groom_name} & {mergedContent.bride_name}
            </h1>
            {mergedContent.wedding_date && (
              <p style={{ fontSize: 13, color: 'rgba(240,204,96,0.7)', letterSpacing: '0.1em', fontFamily: "'Noto Serif SC', serif" }}>
                {new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>
        </section>

        {/* Guest name */}
        {guestName && (
          <section style={{ background: riceDark, padding: '28px 24px', textAlign: 'center', borderBottom: `1px solid rgba(212,168,48,0.25)` }}>
            <p style={{ fontSize: 10, letterSpacing: '0.3em', color: textMid, textTransform: 'uppercase', fontFamily: "'Noto Serif SC', serif", marginBottom: 6 }}>Kính gửi</p>
            <p style={{ fontSize: 'clamp(1.3rem,5vw,2rem)', fontFamily: "'Noto Serif SC', serif", color: red }}>{guestName}</p>
          </section>
        )}

        {/* Event details */}
        <section style={{ background: ricePaper, padding: '40px 24px' }}>
          <div style={{ maxWidth: 460, margin: '0 auto' }}>
            {[
              { label: 'Ngày lành', value: mergedContent.event_date || mergedContent.wedding_date },
              { label: 'Giờ đẹp', value: mergedContent.wedding_time },
              { label: 'Địa điểm', value: mergedContent.address },
              { label: 'Lịch âm', value: mergedContent.lunar_date }
            ].filter(it => it.value).map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: `1px solid rgba(212,168,48,0.18)` }}>
                <div style={{ width: 3, background: gold, borderRadius: 2, flexShrink: 0, opacity: 0.7 }} />
                <div>
                  <p style={{ fontSize: 9, letterSpacing: '0.3em', color: gold, textTransform: 'uppercase', fontFamily: "'Noto Serif SC', serif", marginBottom: 3 }}>{it.label}</p>
                  <p style={{ fontSize: 15, color: darkRed }}>{it.value}</p>
                </div>
              </div>
            ))}
            {mergedContent.map_url && (
              <a href={mergedContent.map_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 18, padding: '10px 22px', border: `1px solid rgba(212,168,48,0.5)`, color: red, textDecoration: 'none', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: "'Noto Serif SC', serif" }}>
                Xem bản đồ
              </a>
            )}
          </div>
        </section>

        {/* RSVP */}
        <section style={{ background: riceDark, padding: '40px 24px' }}>
          <div style={{ maxWidth: 460, margin: '0 auto' }}>
            <RSVPForm weddingId={wedding.id} />
          </div>
        </section>

        {/* MoneyGift */}
        <section style={{ background: ricePaper, padding: '40px 24px' }}>
          <div style={{ maxWidth: 460, margin: '0 auto' }}>
            <MoneyGift content={mergedContent} />
          </div>
        </section>

        {/* Wishes */}
        <section style={{ background: riceDark, padding: '40px 24px' }}>
          <div style={{ maxWidth: 460, margin: '0 auto' }}>
            <Wishes weddingId={wedding.id} />
          </div>
        </section>

        {/* Footer */}
        <section style={{ background: darkRed, borderTop: `2px solid rgba(212,168,48,0.3)`, padding: '36px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 'clamp(1.1rem,4vw,1.8rem)', fontFamily: "'Noto Serif SC', serif", color: goldLight, marginBottom: 6 }}>
            {mergedContent.groom_name} & {mergedContent.bride_name}
          </p>
          <p style={{ fontSize: 8, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase' }}>MoiMoi Studio</p>
        </section>
      </div>
    </>
  )
}
