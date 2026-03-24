import { getTemplate } from '@/templates/TemplateRegistry'
import { createClient } from '@supabase/supabase-js'
import { GetServerSideProps } from 'next'
import MusicPlayer from '@/components/MusicPlayer'

interface Props {
  wedding: any
  guestName: string
  slug: string
  rsvpId: number
}

export default function GuestWeddingPage({ wedding, guestName, slug, rsvpId }: Props) {
  if (!wedding) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fdf2f8',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>💔</div>
          <h1 style={{ color: '#9f1239', marginBottom: '8px' }}>Không tìm thấy thiệp cưới</h1>
          <p style={{ color: '#6b7280' }}>Link mời có thể đã hết hạn hoặc không hợp lệ.</p>
        </div>
      </div>
    )
  }

  if (wedding.deployment_status === 'draft') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fff1f5 0%, #f5f0ff 100%)',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔒</div>
          <h1 style={{ color: '#1f2937', marginBottom: '8px', fontSize: '1.5rem' }}>Thiệp mời đang riêng tư</h1>
          <p style={{ color: '#6b7280', maxWidth: 360, margin: '0 auto' }}>
            Thiệp cưới này chưa được công khai. Vui lòng liên hệ chủ nhân để được chia sẻ đường dẫn.
          </p>
        </div>
      </div>
    )
  }

  // Lấy repo_branch từ template host đã chọn, fallback về 'default'
  const branch = wedding.template?.repo_branch || 'default'
  const SelectedTemplate = getTemplate(branch).GuestView

  const groomName: string = wedding.content?.groom_name || ''
  const brideName: string = wedding.content?.bride_name || ''
  const coupleNames = groomName && brideName ? `${groomName} & ${brideName}` : 'Thiệp Cưới'

  return (
    <>
      <SelectedTemplate wedding={wedding} guestName={guestName} rsvpId={rsvpId} musicUrl={wedding.content?.music_url} />
      {!['theme-vintage', 'theme-boho', 'theme-royal', 'theme-modern', 'theme-luxury', 'theme-nature', 'theme-cherry-blossom'].includes(
        branch
      ) && <MusicPlayer musicUrl={wedding.content?.music_url} />}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug, page } = context.params as { slug: string; page: string }

  const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )

  // Chỉ chấp nhận RSVP id hợp lệ — mọi dạng khác → 404
  const rsvpId = parseInt(page, 10)
  if (isNaN(rsvpId) || page !== String(rsvpId)) {
    return { notFound: true }
  }

  const { data: rsvpData } = await supabaseServer.from('rsvps').select('guest_name').eq('id', rsvpId).single()

  if (!rsvpData?.guest_name) {
    return { notFound: true }
  }

  const guestName = rsvpData.guest_name

  // Single query with join — lấy wedding + template trong 1 lần
  const { data: weddingData, error: weddingError } = await supabaseServer
    .from('weddings')
    .select('*, template:templates(*)')
    .eq('slug', slug)
    .single()

  if (weddingError || !weddingData) {
    return { notFound: true }
  }

  // Lấy package data nếu có
  let packageData = null
  if (weddingData.package_id) {
    const { data: pkg } = await supabaseServer.from('packages').select('*').eq('id', weddingData.package_id).single()
    packageData = pkg
  }

  return {
    props: {
      slug,
      guestName,
      rsvpId,
      wedding: {
        ...weddingData,
        content: weddingData.content || {},
        package: packageData
      }
    }
  }
}
