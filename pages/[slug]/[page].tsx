import { GetServerSideProps } from 'next'
import { useState } from 'react'

interface GuestPageProps {
  wedding: any
  guestName: string
  slug: string
}

export default function GuestPage({ wedding, guestName, slug }: GuestPageProps) {
  const [wish, setWish] = useState('')
  const [isAttending, setIsAttending] = useState<boolean | null>(null)
  const [partySize, setPartySize] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // 404 nếu không tìm thấy wedding
  if (!wedding) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        <h1>404 - Wedding not found</h1>
        <p>Không tìm thấy thiệp cưới.</p>
      </div>
    )
  }

  const { content, template } = wedding

  // Merge content
  const mergedContent = {
    ...(template?.default_content || {}),
    ...content
  }

  // Format tên khách mời (capitalize)
  const formattedName = guestName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  // Submit lời chúc
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wedding_id: wedding.id,
          guest_name: formattedName,
          is_attending: isAttending,
          party_size: partySize,
          wishes: wish
        })
      })

      if (response.ok) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        padding: '40px 20px',
        maxWidth: '600px',
        margin: '0 auto',
        fontFamily: mergedContent.font_family || 'Georgia, serif'
      }}
    >
      {/* Header với tên khách */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '40px',
          padding: '40px',
          background: `linear-gradient(135deg, ${mergedContent.primary_color || '#e11d48'}20, ${mergedContent.primary_color || '#e11d48'}40)`,
          borderRadius: '16px'
        }}
      >
        <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>Trân trọng kính mời</p>
        <h1
          style={{
            margin: 0,
            fontSize: '2.5rem',
            color: mergedContent.primary_color || '#e11d48'
          }}
        >
          {formattedName}
        </h1>
        <p style={{ margin: '16px 0 0', fontSize: '14px', color: '#666' }}>đến dự lễ thành hôn của chúng tôi</p>
      </div>

      {/* Thông tin cô dâu chú rể */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ margin: '0 0 8px', color: '#333' }}>
          {mergedContent.groom_name} 💍 {mergedContent.bride_name}
        </h2>
      </div>

      {/* Thông tin sự kiện */}
      <div
        style={{
          background: '#f8f8f8',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '40px'
        }}
      >
        <p style={{ margin: '0 0 12px' }}>
          📅 <strong>Ngày:</strong> {mergedContent.event_date}
        </p>
        <p style={{ margin: '0 0 12px' }}>
          ⏰ <strong>Giờ:</strong> {mergedContent.wedding_time}
        </p>
        <p style={{ margin: 0 }}>
          📍 <strong>Địa điểm:</strong> {mergedContent.address}
        </p>
      </div>

      {/* Cover Image */}
      {mergedContent.cover_image && (
        <img
          src={mergedContent.cover_image}
          alt='Wedding'
          style={{
            width: '100%',
            borderRadius: '12px',
            marginBottom: '40px'
          }}
        />
      )}

      {/* Form gửi lời chúc */}
      {!submitted ? (
        <div
          style={{
            background: '#fff',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #eee'
          }}
        >
          <h3 style={{ margin: '0 0 24px', textAlign: 'center' }}>💌 Gửi lời chúc</h3>

          <form onSubmit={handleSubmit}>
            {/* Xác nhận tham dự */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Bạn có tham dự được không?
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type='button'
                  onClick={() => setIsAttending(true)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: isAttending === true ? '2px solid #22c55e' : '1px solid #ddd',
                    borderRadius: '8px',
                    background: isAttending === true ? '#dcfce7' : '#fff',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  ✅ Có, tôi sẽ đến
                </button>
                <button
                  type='button'
                  onClick={() => setIsAttending(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: isAttending === false ? '2px solid #ef4444' : '1px solid #ddd',
                    borderRadius: '8px',
                    background: isAttending === false ? '#fef2f2' : '#fff',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  ❌ Xin lỗi, tôi bận
                </button>
              </div>
            </div>

            {/* Số người tham dự */}
            {isAttending && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Số người tham dự</label>
                <select
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} người
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Lời chúc */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Lời chúc đến cô dâu chú rể
              </label>
              <textarea
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder='Chúc hai bạn trăm năm hạnh phúc...'
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  minHeight: '120px',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Submit button */}
            <button
              type='submit'
              disabled={loading || isAttending === null}
              style={{
                width: '100%',
                padding: '16px',
                background: mergedContent.primary_color || '#e11d48',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: loading || isAttending === null ? 'not-allowed' : 'pointer',
                opacity: loading || isAttending === null ? 0.6 : 1
              }}
            >
              {loading ? 'Đang gửi...' : '💌 Gửi lời chúc'}
            </button>
          </form>
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            background: '#dcfce7',
            borderRadius: '12px'
          }}
        >
          <h3 style={{ margin: '0 0 16px', color: '#166534' }}>✅ Cảm ơn bạn!</h3>
          <p style={{ margin: 0, color: '#166534' }}>Lời chúc của bạn đã được gửi đến cô dâu chú rể.</p>
        </div>
      )}

      {/* Debug Info */}
      <hr style={{ margin: '40px 0' }} />
      <details>
        <summary style={{ cursor: 'pointer', color: '#666' }}>🔍 Debug Info</summary>
        <pre
          style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', overflow: 'auto', fontSize: '12px' }}
        >
          {JSON.stringify({ slug, guestName, formattedName, wedding }, null, 2)}
        </pre>
      </details>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug, page } = context.params as { slug: string; page: string }

  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )

  // Query 1: Lấy wedding data
  const { data: weddingData, error: weddingError } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', slug)
    .single()

  if (weddingError || !weddingData) {
    return { props: { wedding: null, guestName: page, slug } }
  }

  // Query 2: Lấy template data
  let templateData = null
  if (weddingData.template_id) {
    const { data: template } = await supabase.from('templates').select('*').eq('id', weddingData.template_id).single()
    templateData = template
  }

  // Query 3: Lấy package data
  let packageData = null
  if (weddingData.package_id) {
    const { data: pkg } = await supabase.from('packages').select('*').eq('id', weddingData.package_id).single()
    packageData = pkg
  }

  return {
    props: {
      slug,
      guestName: page, // "phat" từ URL
      wedding: {
        ...weddingData,
        content: weddingData.content || {},
        template: templateData,
        package: packageData
      }
    }
  }
}
