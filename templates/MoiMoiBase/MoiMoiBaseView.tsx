import { createClient } from '@supabase/supabase-js'
import { Calendar, Clock, Heart, MapPin } from 'lucide-react'
import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import RSVPForm from '@/components/guest/RSVPForm'
import { WeddingCalendar } from '@/components/WeddingCalendar'
import { getImageStyle, resolveImageAdjust } from '@/lib/imageUtils'
import { useTemplateViewport } from '@/lib/TemplateViewportContext'
import { useMapEmbed } from '@/lib/useMapEmbed'
import { TemplateProps } from '../TemplateRegistry'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

type Props = TemplateProps & {
  isGuest: boolean
}

export default function MoiMoiBaseView({ wedding, guestName = '', rsvpId, isGuest }: Props) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [wishesList, setWishesList] = useState<any[]>([])
  const viewport = useTemplateViewport()

  const { content, template } = wedding || {}
  const templateData = template as any
  const mergedContent = useMemo(
    () => ({ ...(templateData?.default_content || {}), ...(content || {}) }),
    [templateData, content]
  )

  const mapEmbedSrc = useMapEmbed(mergedContent.map_url, mergedContent.address)
  const primaryColor = mergedContent.primary_color || '#e85c93'
  const headingFont = mergedContent.heading_font_family || 'Playfair Display, serif'
  const scriptFont = mergedContent.section_font_family || 'Great Vibes, cursive'
  const bodyFont = mergedContent.font_family || 'Nunito Sans, sans-serif'

  useEffect(() => {
    if (!wedding?.id) return
    supabase
      .from('rsvps')
      .select('guest_name, wishes')
      .eq('wedding_id', wedding.id)
      .not('wishes', 'is', null)
      .neq('wishes', '')
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => {
        if (data) setWishesList(data)
      })
  }, [wedding?.id])

  useEffect(() => {
    if (!mergedContent.wedding_date) return
    const interval = setInterval(() => {
      const d = new Date(`${mergedContent.wedding_date}T${mergedContent.wedding_time || '00:00'}`)
      const diff = d.getTime() - Date.now()
      if (diff > 0) {
        setTimeRemaining({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000)
        })
      } else {
        setTimeRemaining(null)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [mergedContent.wedding_date, mergedContent.wedding_time])

  const allAlbumImages: string[] = (mergedContent.images || []).filter(Boolean)
  const albumImages = allAlbumImages.slice(0, 8)
  const coverImage =
    mergedContent.cover_image ||
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=1200&fit=crop'

  let calYear = 0
  let calMonth = 0
  let calDay = 0
  if (mergedContent.wedding_date) {
    const parts = String(mergedContent.wedding_date).split('-').map(Number)
    calYear = parts[0] || 0
    calMonth = parts[1] || 0
    calDay = parts[2] || 0
  }

  if (!wedding) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#fff4f8' }}>
        <h1 style={{ color: '#d83d7f', fontFamily: scriptFont, fontSize: '2.2rem' }}>Khong tim thay thiep cuoi</h1>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>
          {mergedContent.groom_name || 'Chu Re'} &amp; {mergedContent.bride_name || 'Co Dau'} - MoiMoiBase
        </title>
        <meta
          name='description'
          content={`Thiep cuoi cua ${mergedContent.groom_name || 'Chu Re'} va ${mergedContent.bride_name || 'Co Dau'}`}
        />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Great+Vibes&family=Nunito+Sans:wght@300;400;500;700;800&family=Playfair+Display:wght@500;600;700;800&display=swap'
          rel='stylesheet'
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            overflow-x: hidden;
            background: radial-gradient(circle at 30% 20%, #ffd7e7 0%, #ffe9f2 32%, #fff6fa 65%, #fffafb 100%);
          }
          html { scroll-behavior: smooth; }
          @keyframes mmFadeUp {
            from { opacity: 0; transform: translateY(28px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes mmFloat {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(1.2deg); }
          }
          @keyframes mmPulse {
            0%, 100% { box-shadow: 0 14px 45px rgba(222, 95, 146, 0.18); }
            50% { box-shadow: 0 20px 60px rgba(222, 95, 146, 0.3); }
          }
          .mm-up { animation: mmFadeUp .8s cubic-bezier(.16,1,.3,1) both; }
          .mm-d1 { animation-delay: .12s; }
          .mm-d2 { animation-delay: .24s; }
          .mm-d3 { animation-delay: .36s; }
          .mm-d4 { animation-delay: .48s; }
          .mm-d5 { animation-delay: .6s; }
          .mm-paper { animation: mmFloat 5s ease-in-out infinite, mmPulse 4s ease-in-out infinite; }
        `}</style>
      </Head>

      <main style={{ fontFamily: bodyFont, color: '#442336' }}>
        <section
          style={{
            minHeight: '100svh',
            display: 'grid',
            placeItems: 'center',
            padding: '24px 16px 40px',
            position: 'relative'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 80% 50% at 20% 20%, rgba(255,181,210,.45), transparent 60%), radial-gradient(ellipse 65% 45% at 80% 75%, rgba(255,210,228,.55), transparent 70%)'
            }}
          />

          <div
            className='mm-paper'
            style={{
              position: 'relative',
              zIndex: 2,
              width: 'min(92vw, 390px)',
              borderRadius: 30,
              background: 'linear-gradient(180deg, rgba(255,255,255,.94) 0%, rgba(255,247,251,.98) 100%)',
              border: '1px solid rgba(255,255,255,.9)',
              boxShadow: '0 12px 40px rgba(218,98,146,.2)',
              padding: '20px 20px 24px',
              transform: 'rotate(-4deg)'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <p
                className='mm-up mm-d1'
                style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#bd6f92' }}
              >
                Wedding Invitation
              </p>
              <h1
                className='mm-up mm-d2'
                style={{
                  fontFamily: headingFont,
                  fontSize: 'clamp(2rem, 8vw, 2.8rem)',
                  marginTop: 8,
                  color: '#302026',
                  letterSpacing: '0.04em'
                }}
              >
                E-INVITE
              </h1>

              <div
                className='mm-up mm-d3'
                style={{
                  width: 152,
                  height: 152,
                  margin: '18px auto 16px',
                  borderRadius: '50%',
                  border: '6px solid #fff',
                  overflow: 'hidden',
                  boxShadow: '0 8px 26px rgba(220,94,145,.24)'
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt='Wedding cover'
                  style={{ width: '100%', height: '100%', ...getImageStyle(resolveImageAdjust(mergedContent.cover_image_position, viewport)) }}
                />
              </div>

              <h2
                className='mm-up mm-d4'
                style={{
                  fontFamily: scriptFont,
                  fontSize: 'clamp(2rem, 8.5vw, 2.8rem)',
                  color: primaryColor,
                  lineHeight: 1.18,
                  marginBottom: 10
                }}
              >
                {mergedContent.groom_name || 'Anh'} &amp; {mergedContent.bride_name || 'Em'}
              </h2>

              {isGuest && guestName && (
                <p className='mm-up mm-d4' style={{ fontSize: 13, color: '#8f5b73', marginBottom: 10 }}>
                  Tran trong kinh moi: <strong>{guestName}</strong>
                </p>
              )}

              <div className='mm-up mm-d5' style={{ color: '#7d5f6d', fontSize: 13, lineHeight: 1.65 }}>
                <p style={{ marginBottom: 5 }}>
                  <Calendar size={14} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
                  {mergedContent.wedding_date
                    ? new Date(mergedContent.wedding_date).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })
                    : 'Ngay se cap nhat'}
                </p>
                <p>
                  <Clock size={14} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
                  {mergedContent.wedding_time || '18:00'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '0 16px 20px' }}>
          <div
            className='mm-up'
            style={{
              maxWidth: 880,
              margin: '0 auto',
              borderRadius: 26,
              background: 'rgba(255,255,255,.86)',
              border: '1px solid rgba(235,153,189,.2)',
              boxShadow: '0 8px 32px rgba(218,98,146,.12)',
              padding: '24px 18px'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#b56b8f' }}>
                Save The Date
              </p>
              <h3 style={{ fontFamily: headingFont, fontSize: '1.9rem', marginTop: 7, color: '#3f2431' }}>
                Dem Nguoc Ngay Cuoi
              </h3>
            </div>

            {timeRemaining ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                  gap: 10,
                  maxWidth: 560,
                  margin: '0 auto'
                }}
              >
                {[
                  { key: 'Ngay', value: timeRemaining.days },
                  { key: 'Gio', value: timeRemaining.hours },
                  { key: 'Phut', value: timeRemaining.minutes },
                  { key: 'Giay', value: timeRemaining.seconds }
                ].map((item) => (
                  <div
                    key={item.key}
                    style={{
                      borderRadius: 16,
                      padding: '12px 8px',
                      background: 'linear-gradient(180deg, #fff, #ffeef5)',
                      border: '1px solid rgba(231,128,173,.2)',
                      textAlign: 'center'
                    }}
                  >
                    <p style={{ fontFamily: headingFont, fontSize: '1.6rem', color: '#3f2431', fontWeight: 700 }}>{item.value}</p>
                    <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#ad6f8f' }}>{item.key}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#8c6477' }}>Ngay vui da den. Hen gap ban!</p>
            )}
          </div>
        </section>

        <section style={{ padding: '0 16px 20px' }}>
          <div
            className='mm-up'
            style={{
              maxWidth: 880,
              margin: '0 auto',
              borderRadius: 26,
              background: '#fff',
              border: '1px solid rgba(235,153,189,.22)',
              boxShadow: '0 8px 32px rgba(218,98,146,.1)',
              padding: '24px 18px'
            }}
          >
            <h3 style={{ fontFamily: headingFont, textAlign: 'center', fontSize: '1.8rem', color: '#3f2431', marginBottom: 14 }}>
              Thong Tin Buoi Le
            </h3>
            <div style={{ display: 'grid', gap: 12, maxWidth: 680, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#6a4758' }}>
                <Calendar size={18} color={primaryColor} />
                <span>{mergedContent.wedding_date || 'Dang cap nhat ngay to chuc'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#6a4758' }}>
                <Clock size={18} color={primaryColor} />
                <span>{mergedContent.wedding_time || '18:00'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#6a4758' }}>
                <MapPin size={18} color={primaryColor} />
                <span>{mergedContent.address || 'Dang cap nhat dia diem'}</span>
              </div>
            </div>

            {calYear > 0 && calMonth > 0 && calDay > 0 && (
              <div style={{ marginTop: 18, maxWidth: 520, marginInline: 'auto' }}>
                <WeddingCalendar year={calYear} month={calMonth} day={calDay} primaryColor={primaryColor} fontFamily={bodyFont} />
              </div>
            )}

            {mapEmbedSrc && (
              <div style={{ marginTop: 16, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(220,120,165,.26)' }}>
                <iframe
                  title='Wedding location map'
                  src={mapEmbedSrc}
                  width='100%'
                  height='260'
                  style={{ border: 0, display: 'block' }}
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                />
              </div>
            )}
          </div>
        </section>

        {albumImages.length > 0 && (
          <section style={{ padding: '0 16px 20px' }}>
            <div
              className='mm-up'
              style={{
                maxWidth: 880,
                margin: '0 auto',
                borderRadius: 26,
                background: '#fff',
                border: '1px solid rgba(235,153,189,.2)',
                boxShadow: '0 8px 32px rgba(218,98,146,.1)',
                padding: '24px 18px'
              }}
            >
              <h3 style={{ fontFamily: headingFont, textAlign: 'center', fontSize: '1.8rem', color: '#3f2431', marginBottom: 14 }}>
                Khoanh Khac
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: 10
                }}
              >
                {albumImages.map((img, idx) => (
                  <div key={`${img}-${idx}`} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #ffd9e8' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Album ${idx + 1}`}
                      style={{ width: '100%', aspectRatio: '1 / 1', ...getImageStyle(resolveImageAdjust(mergedContent.images_position?.[idx], viewport)) }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {isGuest && (
          <section style={{ padding: '0 16px 20px' }}>
            <div
              className='mm-up'
              style={{
                maxWidth: 880,
                margin: '0 auto',
                borderRadius: 26,
                background: '#fff',
                border: '1px solid rgba(235,153,189,.24)',
                boxShadow: '0 8px 32px rgba(218,98,146,.1)',
                padding: '24px 18px'
              }}
            >
              <RSVPForm
                weddingId={wedding.id}
                rsvpId={rsvpId}
                guestName={guestName}
                primaryColor={primaryColor}
                fontFamily={bodyFont}
                sectionFontFamily={headingFont}
              />
            </div>
          </section>
        )}

        {wishesList.length > 0 && (
          <section style={{ padding: '0 16px 20px' }}>
            <div
              className='mm-up'
              style={{
                maxWidth: 880,
                margin: '0 auto',
                borderRadius: 26,
                background: '#fff',
                border: '1px solid rgba(235,153,189,.2)',
                boxShadow: '0 8px 32px rgba(218,98,146,.1)',
                padding: '24px 18px'
              }}
            >
              <h3 style={{ fontFamily: headingFont, textAlign: 'center', fontSize: '1.8rem', color: '#3f2431', marginBottom: 14 }}>
                Loi Chuc
              </h3>
              <div style={{ display: 'grid', gap: 10 }}>
                {wishesList.map((item, idx) => (
                  <div
                    key={`${item.guest_name}-${idx}`}
                    style={{
                      borderRadius: 14,
                      padding: '12px 14px',
                      background: idx % 2 === 0 ? '#fff3f8' : '#ffedf5',
                      border: '1px solid rgba(225,118,164,.18)'
                    }}
                  >
                    <p style={{ color: '#5a3748', fontWeight: 700, marginBottom: 4 }}>
                      <Heart size={14} color={primaryColor} style={{ verticalAlign: 'text-bottom', marginRight: 5 }} />
                      {item.guest_name || 'Khach moi'}
                    </p>
                    <p style={{ color: '#6e4b5c', lineHeight: 1.6 }}>{item.wishes}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {(mergedContent.bank_name || mergedContent.account_number || mergedContent.account_name) && (
          <section style={{ padding: '0 16px 32px' }}>
            <div
              className='mm-up'
              style={{
                maxWidth: 880,
                margin: '0 auto',
                borderRadius: 26,
                background: 'linear-gradient(180deg, #fff 0%, #fff3f8 100%)',
                border: '1px solid rgba(235,153,189,.22)',
                boxShadow: '0 8px 32px rgba(218,98,146,.1)',
                padding: '24px 18px',
                textAlign: 'center'
              }}
            >
              <h3 style={{ fontFamily: headingFont, fontSize: '1.75rem', color: '#3f2431', marginBottom: 8 }}>Mung Cuoi</h3>
              <p style={{ fontSize: 13, color: '#8f6075', marginBottom: 14 }}>
                Neu ban muon gui loi chuc theo cach dac biet, thong tin ben duoi nhe.
              </p>
              <div
                style={{
                  maxWidth: 420,
                  margin: '0 auto',
                  borderRadius: 16,
                  border: '1px solid rgba(221,123,170,.25)',
                  background: '#fff',
                  padding: '14px 12px'
                }}
              >
                <p style={{ marginBottom: 5, color: '#5c3a4b' }}>
                  <strong>Ngan hang:</strong> {mergedContent.bank_name || 'Dang cap nhat'}
                </p>
                <p style={{ marginBottom: 5, color: '#5c3a4b' }}>
                  <strong>So tai khoan:</strong> {mergedContent.account_number || 'Dang cap nhat'}
                </p>
                <p style={{ color: '#5c3a4b' }}>
                  <strong>Chu tai khoan:</strong> {mergedContent.account_name || 'Dang cap nhat'}
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  )
}
