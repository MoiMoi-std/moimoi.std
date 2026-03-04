import { getTemplate } from '@/templates/TemplateRegistry'
import { GetStaticPaths, GetStaticProps } from 'next'

// Demo wedding data used for previewing any template
const DEMO_WEDDING = {
  id: 'preview-demo',
  slug: 'preview-demo',
  host_id: 'demo',
  template_id: 0,
  package_id: null,
  is_published: false,
  deployment_status: 'draft' as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  content: {
    groom_name: 'Minh Tuấn',
    bride_name: 'Thu Hiền',
    wedding_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 60 days from now
    wedding_time: '18:00',
    event_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
    address: 'Trung Tâm Tiệc Cưới Grand Palace, 142 Công Hòa, Q.Tân Bình, TP.HCM',
    map_url: 'https://maps.google.com',
    cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80',
      'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=600&q=80',
      'https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=600&q=80',
      'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80'
    ],
    primary_color: undefined, // let each template use its own default
    bank_name: 'Vietcombank',
    account_number: '1234567890',
    account_name: 'NGUYEN MINH TUAN'
  },
  template: {
    id: 0,
    name: 'Demo',
    repo_branch: 'default',
    thumbnail_url: null,
    is_active: true,
    default_content: {}
  },
  package: null
}

interface Props {
  branch: string
}

export default function TemplatePreviewPage({ branch }: Props) {
  const { GeneralView } = getTemplate(branch)

  // Pass demo data with the correct branch on the template object
  const demoWedding = {
    ...DEMO_WEDDING,
    template: {
      ...DEMO_WEDDING.template,
      repo_branch: branch
    }
  }

  return (
    <>
      {/* Preview banner */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: 'rgba(15,15,35,0.92)',
          backdropFilter: 'blur(12px)',
          color: '#fff',
          padding: '8px 24px',
          borderRadius: '0 0 16px 16px',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 4px 24px rgba(0,0,0,.3)',
          border: '1px solid rgba(255,255,255,.08)',
          borderTop: 'none'
        }}
      >
        <span style={{ fontSize: 16 }}>👁</span>
        <span style={{ color: '#94a3b8' }}>Đang xem trước:</span>
        <span style={{ color: '#818cf8', fontWeight: 700 }}>{branch}</span>
        <span
          style={{
            marginLeft: 8,
            padding: '3px 10px',
            background: 'rgba(99,102,241,.25)',
            borderRadius: 20,
            fontSize: 11,
            color: '#a5b4fc',
            border: '1px solid rgba(99,102,241,.4)'
          }}
        >
          DỮ LIỆU DEMO
        </span>
        <button
          onClick={() => window.close()}
          style={{
            marginLeft: 8,
            padding: '4px 14px',
            background: 'rgba(255,255,255,.08)',
            border: '1px solid rgba(255,255,255,.15)',
            borderRadius: 8,
            color: '#cbd5e1',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.15)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.08)')}
        >
          Đóng
        </button>
      </div>

      {/* Render the actual template */}
      <GeneralView wedding={demoWedding as any} />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const branches = ['default', 'theme-vintage', 'theme-modern', 'theme-luxury']
  return {
    paths: branches.map((branch) => ({ params: { branch } })),
    fallback: 'blocking' // allows new templates to be previewed without rebuilding
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const branch = (params?.branch as string) || 'default'
  return {
    props: { branch }
  }
}
