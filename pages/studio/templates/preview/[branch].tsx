import { getTemplate } from '@/templates/TemplateRegistry'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useWedding } from '@/lib/useWedding'

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
    groom_role: 'Chú rể',
    bride_name: 'Thu Hiền',
    bride_role: 'Cô dâu',
    wedding_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 60 days from now
    wedding_time: '18:00',
    event_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
    lunar_date: 'Ngày 12 tháng 4 năm Bính Ngọ',
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

type PreviewBannerTheme = {
  background: string
  textColor: string
  subTextColor: string
  branchColor: string
  badgeBackground: string
  badgeBorder: string
  buttonBackground: string
  buttonBackgroundHover: string
  buttonBorder: string
  borderColor: string
  boxShadow: string
  fontFamily: string
}

function getPreviewBannerTheme(branch: string): PreviewBannerTheme {
  const key = branch.toLowerCase()

  if (key.includes('modern')) {
    return {
      background: 'linear-gradient(145deg, rgba(104,14,14,0.96) 0%, rgba(122,26,26,0.94) 100%)',
      textColor: '#e9ce9e',
      subTextColor: 'rgba(233,206,158,.82)',
      branchColor: '#f3dfb8',
      badgeBackground: 'rgba(233,206,158,.16)',
      badgeBorder: 'rgba(233,206,158,.35)',
      buttonBackground: 'rgba(233,206,158,.12)',
      buttonBackgroundHover: 'rgba(233,206,158,.22)',
      buttonBorder: 'rgba(233,206,158,.35)',
      borderColor: 'rgba(233,206,158,.2)',
      boxShadow: '0 8px 26px rgba(0,0,0,.34), 0 0 24px rgba(233,206,158,.14)',
      fontFamily: "'Playfair Display', 'Lora', serif"
    }
  }

  if (key.includes('vintage')) {
    return {
      background: 'linear-gradient(145deg, rgba(76,57,44,0.95) 0%, rgba(112,84,66,0.94) 100%)',
      textColor: '#f2dec2',
      subTextColor: 'rgba(242,222,194,.8)',
      branchColor: '#ffe8cb',
      badgeBackground: 'rgba(242,222,194,.14)',
      badgeBorder: 'rgba(242,222,194,.34)',
      buttonBackground: 'rgba(242,222,194,.1)',
      buttonBackgroundHover: 'rgba(242,222,194,.2)',
      buttonBorder: 'rgba(242,222,194,.32)',
      borderColor: 'rgba(242,222,194,.2)',
      boxShadow: '0 8px 26px rgba(0,0,0,.34), 0 0 24px rgba(242,222,194,.12)',
      fontFamily: "'Playfair Display', 'Lora', serif"
    }
  }

  if (key.includes('luxury')) {
    return {
      background: 'linear-gradient(145deg, rgba(24,24,24,0.96) 0%, rgba(40,40,40,0.94) 100%)',
      textColor: '#f2d38b',
      subTextColor: 'rgba(242,211,139,.84)',
      branchColor: '#ffdf9b',
      badgeBackground: 'rgba(242,211,139,.15)',
      badgeBorder: 'rgba(242,211,139,.4)',
      buttonBackground: 'rgba(242,211,139,.12)',
      buttonBackgroundHover: 'rgba(242,211,139,.24)',
      buttonBorder: 'rgba(242,211,139,.36)',
      borderColor: 'rgba(242,211,139,.2)',
      boxShadow: '0 8px 26px rgba(0,0,0,.42), 0 0 28px rgba(242,211,139,.12)',
      fontFamily: "'Playfair Display', 'Lora', serif"
    }
  }

  return {
    background: 'rgba(15,15,35,0.92)',
    textColor: '#e2e8f0',
    subTextColor: '#94a3b8',
    branchColor: '#a5b4fc',
    badgeBackground: 'rgba(99,102,241,.25)',
    badgeBorder: 'rgba(99,102,241,.4)',
    buttonBackground: 'rgba(255,255,255,.08)',
    buttonBackgroundHover: 'rgba(255,255,255,.15)',
    buttonBorder: 'rgba(255,255,255,.15)',
    borderColor: 'rgba(255,255,255,.08)',
    boxShadow: '0 4px 24px rgba(0,0,0,.3)',
    fontFamily: "'Inter', sans-serif"
  }
}

export default function TemplatePreviewPage({ branch }: Props) {
  const { GeneralView } = getTemplate(branch)
  const { wedding } = useWedding()
  const bannerTheme = getPreviewBannerTheme(branch)

  // Lọc lấy các trường có dữ liệu thật của user
  const userContent = wedding?.content || {}
  const validUserContent: any = {}
  Object.keys(userContent).forEach((k) => {
    if (userContent[k]) validUserContent[k] = userContent[k]
  })

  // Pass demo data with the correct branch on the template object
  const demoWedding = {
    ...DEMO_WEDDING,
    content: {
      ...DEMO_WEDDING.content,
      ...validUserContent
    },
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
          background: bannerTheme.background,
          backdropFilter: 'blur(10px)',
          color: bannerTheme.textColor,
          padding: '8px 24px',
          borderRadius: '0 0 16px 16px',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: bannerTheme.fontFamily,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: bannerTheme.boxShadow,
          border: `1px solid ${bannerTheme.borderColor}`,
          borderTop: 'none'
        }}
      >
        <span style={{ fontSize: 16 }}>👁</span>
        <span style={{ color: bannerTheme.subTextColor }}>Đang xem trước:</span>
        <span style={{ color: bannerTheme.branchColor, fontWeight: 700 }}>{branch}</span>
        <span
          style={{
            marginLeft: 8,
            padding: '3px 10px',
            background: bannerTheme.badgeBackground,
            borderRadius: 20,
            fontSize: 11,
            color: bannerTheme.branchColor,
            border: `1px solid ${bannerTheme.badgeBorder}`
          }}
        >
          DỮ LIỆU DEMO
        </span>
        <button
          onClick={() => window.close()}
          style={{
            marginLeft: 8,
            padding: '4px 14px',
            background: bannerTheme.buttonBackground,
            border: `1px solid ${bannerTheme.buttonBorder}`,
            borderRadius: 8,
            color: bannerTheme.branchColor,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = bannerTheme.buttonBackgroundHover)}
          onMouseOut={(e) => (e.currentTarget.style.background = bannerTheme.buttonBackground)}
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
