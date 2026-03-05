import Head from 'next/head'
import { TemplateProps } from '../TemplateRegistry'

// Mock data album ảnh cưới
const mockAlbum = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=500&fit=crop' // để test vụ +1
]

export default function VintageGeneralView({ wedding }: TemplateProps) {
  const red = '#9a2a2a'
  const cream = '#f2e8de'
  const creamLight = '#f8f1e9'
  const textDark = '#4a4a4a'

  if (!wedding) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: cream,
          fontFamily: "'Playfair Display', serif"
        }}
      >
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>💔</div>
          <h1 style={{ color: red, marginBottom: 8 }}>Không tìm thấy thông tin</h1>
          <p style={{ color: '#888' }}>Thiệp mời có thể đã bị xóa hoặc không hợp lệ.</p>
        </div>
      </div>
    )
  }

  const { content, template } = wedding
  const templateData = template as any
  const mergedContent = { ...(templateData?.default_content || {}), ...content }

  // Mock data cho phần chưa có trong DB
  const groomName = mergedContent.groom_name || 'Hoàng Nam'
  const brideName = mergedContent.bride_name || 'Thanh Tú'
  const groomImage =
    mergedContent.groom_image ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
  const brideImage =
    mergedContent.bride_image ||
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face'
  const groomParents = mergedContent.groom_parents || 'Nguyễn Văn Tuấn\nTrần Thị Mai'
  const brideParents = mergedContent.bride_parents || 'Lê Văn Hùng\nHồ Thị Lan'
  const groomAddress =
    mergedContent.groom_address || '23 Đường Nguyễn Trãi, Phường Bến Thành, Quận 1, Thành phố\nHồ Chí Minh'
  const brideAddress = mergedContent.bride_address || '68 Đường Sư Vạn Hạnh, Phường 12, Quận 10, Thành phố Hồ\nChí Minh'
  const weddingTime = mergedContent.wedding_time || '09:00'
  const partyTime = mergedContent.party_time || '10:30'
  const eventDate = mergedContent.event_date || '01/02/2026'
  const lunarDate = mergedContent.lunar_date || '14/12 Ất Tỵ'
  const address = mergedContent.address || 'Queen Plaza Kỳ Hòa, 16A Lê Hồng Phong, Phường 12, Quận 10, TP. Hồ Chí Minh'
  const albumImages = mergedContent.album_images?.length > 0 ? mergedContent.album_images : mockAlbum

  // Xử lý xuống dòng cho phụ huynh
  const formatParents = (text: string) => {
    const lines = text.split('\n')
    if (lines.length === 2) {
      return (
        <>
          <div>{lines[0]}</div>
          <div>{lines[1]}</div>
        </>
      )
    }
    return text
  }

  // Parse date
  const dateParts = eventDate.split('/')
  const day = dateParts[0] || '01'
  const month = dateParts[1] || '02'
  const year = dateParts[2] || '2026'
  const dayName = 'CHỦ NHẬT'

  // Chữ thập (pattern) có thể giả bằng CSS pattern hoặc overlay màu. Để đơn giản ta dùng gradient css pattern.
  const redPatternStyle = {
    backgroundColor: red,
    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)`
  }

  const creamPatternStyle = {
    backgroundColor: creamLight,
    backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0, ${creamLight} 10px), repeating-linear-gradient(rgba(200,100,100,0.03), rgba(200,100,100,0.03))`
  }

  return (
    <>
      <Head>
        <title>
          Thiệp cưới - {groomName} & {brideName}
        </title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href='https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Great+Vibes&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap'
          rel='stylesheet'
        />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #fff; -webkit-font-smoothing: antialiased; }
          .btn-calendar:hover { opacity: 0.9; transform: scale(1.02); }
        `}</style>
      </Head>

      <div style={{ minHeight: '100vh', background: '#fff' }}>
        <div
          style={{
            maxWidth: 600,
            margin: '0 auto',
            background: cream,
            minHeight: '100vh',
            fontFamily: "'Lora', serif",
            color: textDark,
            paddingBottom: 60,
            boxShadow: '0 0 20px rgba(0,0,0,0.05)'
          }}
        >
          {/* ═════════ HERO SECTION ═════════ */}
          <div style={{ width: '100%', height: 60, ...redPatternStyle }} />

          <div
            style={{
              width: '100%',
              padding: '24px 0',
              textAlign: 'center',
              ...creamPatternStyle
            }}
          >
            <h1
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: '3rem',
                color: red,
                fontWeight: 400
              }}
            >
              Happy Wedding
            </h1>
          </div>

          <div style={{ width: '100%', height: 100, ...redPatternStyle }} />

          {/* avatars overlapping */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8%', marginTop: -80, padding: '0 20px' }}>
            {/* Groom */}
            <div style={{ textAlign: 'center', width: '40%' }}>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '50%',
                  border: '4px solid #fff',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  margin: '0 auto 16px'
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={groomImage} alt={groomName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: '2.2rem',
                  color: red,
                  fontWeight: 400
                }}
              >
                {groomName}
              </h3>
            </div>

            {/* Bride */}
            <div style={{ textAlign: 'center', width: '40%' }}>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '50%',
                  border: '4px solid #fff',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  margin: '0 auto 16px'
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={brideImage} alt={brideName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3
                style={{
                  fontFamily: "'Great Vibes', cursive",
                  fontSize: '2.2rem',
                  color: red,
                  fontWeight: 400
                }}
              >
                {brideName}
              </h3>
            </div>
          </div>

          {/* ═════════ PARENTS INFO ═════════ */}
          <div
            style={{ display: 'flex', justifyContent: 'space-between', padding: '30px 40px 40px', textAlign: 'center' }}
          >
            {/* Groom Parents */}
            <div style={{ flex: 1, padding: '0 10px' }}>
              <div style={{ width: '100%', height: 1, backgroundColor: '#c8b6a6', marginBottom: 16 }} />
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  color: textDark,
                  lineHeight: 1.5,
                  marginBottom: 10
                }}
              >
                {formatParents(groomParents)}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#666', lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                {groomAddress}
              </p>
            </div>
            {/* Bride Parents */}
            <div style={{ flex: 1, padding: '0 10px' }}>
              <div style={{ width: '100%', height: 1, backgroundColor: '#c8b6a6', marginBottom: 16 }} />
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1rem',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  color: textDark,
                  lineHeight: 1.5,
                  marginBottom: 10
                }}
              >
                {formatParents(brideParents)}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#666', lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                {brideAddress}
              </p>
            </div>
          </div>

          {/* ═════════ WEDDING EVENT (Nhà trai/Nhà gái - Lễ Thành Hôn) ═════════ */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontSize: '0.85rem', color: textDark, fontWeight: 500, marginBottom: 4 }}>
              LỄ THÀNH HÔN ĐƯỢC CỬ HÀNH TẠI
            </p>
            <p style={{ fontSize: '1rem', color: textDark, fontWeight: 600, marginBottom: 4 }}>TƯ GIA</p>
            <p style={{ fontSize: '0.85rem', color: textDark, fontWeight: 500, marginBottom: 8 }}>VÀO LÚC</p>
            <p
              style={{
                fontSize: '1.6rem',
                color: red,
                fontWeight: 700,
                fontFamily: "'Playfair Display', serif",
                marginBottom: 16
              }}
            >
              {weddingTime}
            </p>

            {/* Date format: CHỦ NHẬT | 01 | THÁNG 02 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: textDark }}>{dayName}</span>
              <div style={{ width: 1, height: 24, backgroundColor: '#c8b6a6' }} />
              <span
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: red,
                  fontFamily: "'Playfair Display', serif",
                  lineHeight: 1
                }}
              >
                {day}
              </span>
              <div style={{ width: 1, height: 24, backgroundColor: '#c8b6a6' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: textDark }}>THÁNG {month}</span>
            </div>

            <p
              style={{
                fontSize: '1.1rem',
                color: red,
                fontWeight: 700,
                fontFamily: "'Playfair Display', serif",
                marginBottom: 6
              }}
            >
              {year}
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>(Tức ngày {lunarDate})</p>
          </div>

          {/* ═════════ ALBUM ═════════ */}
          <div style={{ padding: '0 20px', marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: '2.5rem',
                color: red,
                fontWeight: 400,
                textAlign: 'center',
                marginBottom: 20
              }}
            >
              Album Ảnh Cưới
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {albumImages.slice(0, 4).map((img: string, i: number) => {
                const isLast = i === 3
                const extraCount = albumImages.length - 4

                return (
                  <div
                    key={i}
                    style={{ borderRadius: 8, overflow: 'hidden', aspectRatio: '3/4', position: 'relative' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Album ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {isLast && extraCount > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '1.2rem',
                          fontWeight: 700
                        }}
                      >
                        +{extraCount}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ═════════ PARTY EVENT ═════════ */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: '2.2rem',
                color: red,
                fontWeight: 400,
                marginBottom: 16
              }}
            >
              Tiệc cưới sẽ diễn ra vào lúc:
            </h2>
            <p
              style={{
                fontSize: '1.6rem',
                color: red,
                fontWeight: 700,
                fontFamily: "'Playfair Display', serif",
                marginBottom: 16
              }}
            >
              {partyTime}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: textDark }}>{dayName}</span>
              <div style={{ width: 1, height: 24, backgroundColor: '#c8b6a6' }} />
              <span
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: red,
                  fontFamily: "'Playfair Display', serif",
                  lineHeight: 1
                }}
              >
                {day}
              </span>
              <div style={{ width: 1, height: 24, backgroundColor: '#c8b6a6' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: textDark }}>THÁNG {month}</span>
            </div>

            <p
              style={{
                fontSize: '1.1rem',
                color: red,
                fontWeight: 700,
                fontFamily: "'Playfair Display', serif",
                marginBottom: 6
              }}
            >
              {year}
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic', marginBottom: 16 }}>
              (Tức ngày {lunarDate})
            </p>

            <p style={{ fontSize: '0.8rem', color: textDark, textTransform: 'uppercase', marginBottom: 4 }}>
              KHAI TIỆC
            </p>
            <p
              style={{
                fontSize: '1.2rem',
                color: red,
                fontWeight: 700,
                fontFamily: "'Playfair Display', serif",
                marginBottom: 20
              }}
            >
              {partyTime}
            </p>

            {/* Nut Thêm vào lịch (fake / mockup action) */}
            <button
              className='btn-calendar'
              style={{
                backgroundColor: '#7e2b2b',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: 20,
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Thêm vào lịch
            </button>
          </div>

          {/* ═════════ VENUE ═════════ */}
          <div style={{ textAlign: 'center', padding: '0 20px', marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: '2.2rem',
                color: red,
                fontWeight: 400,
                marginBottom: 16
              }}
            >
              Tiệc cưới sẽ tổ chức tại
            </h2>
            <div
              style={{
                backgroundColor: '#e6dacb',
                padding: '16px 20px',
                borderRadius: 8,
                fontSize: '0.9rem',
                color: textDark,
                fontWeight: 600,
                lineHeight: 1.5,
                border: '1px solid #d4c4b4'
              }}
            >
              {address}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
