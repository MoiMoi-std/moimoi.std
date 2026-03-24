import { getTemplate } from '@/templates/TemplateRegistry'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useWedding } from '@/lib/useWedding'
import { useEffect, useState } from 'react'
import { TemplateViewportContext } from '@/lib/TemplateViewportContext'
import MusicPlayer from '@/components/MusicPlayer'

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
    music_url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
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
      background: 'linear-gradient(145deg, rgba(214,131,138,0.96) 0%, rgba(228,157,165,0.95) 100%)',
      textColor: '#fff7f8',
      subTextColor: 'rgba(255,245,246,.86)',
      branchColor: '#fff0f2',
      badgeBackground: 'rgba(255,255,255,.2)',
      badgeBorder: 'rgba(255,255,255,.34)',
      buttonBackground: 'rgba(255,255,255,.16)',
      buttonBackgroundHover: 'rgba(255,255,255,.28)',
      buttonBorder: 'rgba(255,255,255,.34)',
      borderColor: 'rgba(255,255,255,.24)',
      boxShadow: '0 8px 26px rgba(0,0,0,.26), 0 0 24px rgba(255,214,222,.22)',
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

  const [phoneMode, setPhoneMode] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          color: '#64748b',
          fontSize: 14,
          fontFamily: 'system-ui, sans-serif'
        }}
      >
        Đang tải xem trước...
      </div>
    )
  }

  // Lọc lấy các trường có dữ liệu thật của user
  const userContent = wedding?.content || {}
  const validUserContent: any = {}
  Object.keys(userContent).forEach((k) => {
    if (userContent[k]) validUserContent[k] = userContent[k]
  })

  const isIframe = typeof window !== 'undefined' && window.self !== window.top
  const showPreviewBanner = !isIframe

  // Pass demo data with the correct branch on the template object
  const demoWedding = {
    ...DEMO_WEDDING,
    content: {
      ...DEMO_WEDDING.content,
      ...validUserContent,
      music_url: isIframe ? undefined : validUserContent.music_url || DEMO_WEDDING.content.music_url
    },
    template: {
      ...DEMO_WEDDING.template,
      repo_branch: branch
    }
  }

  return (
    <>
      {/* Preview banner */}
      {showPreviewBanner && (
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
            padding: '12px 20px',
            borderRadius: '0 0 12px 12px',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: bannerTheme.fontFamily,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            boxShadow: bannerTheme.boxShadow,
            border: `1px solid ${bannerTheme.borderColor}`,
            borderTop: 'none',
            maxWidth: '90vw'
          }}
        >
          <span style={{ color: bannerTheme.branchColor, fontWeight: 700, fontSize: 14 }}>{branch}</span>
          <button
            onClick={() => window.close()}
            style={{
              padding: '6px 16px',
              background: bannerTheme.buttonBackground,
              border: `1px solid ${bannerTheme.buttonBorder}`,
              borderRadius: 6,
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
      )}

      {/* Toggle button — chỉ hiện trên desktop */}
      {isDesktop && (
        <button
          onClick={() => setPhoneMode((p) => !p)}
          style={{
            position: 'fixed',
            bottom: 88,
            right: 28,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            background: 'rgba(10,10,10,0.85)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 999,
            color: '#f1f5f9',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '0.01em'
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 32px rgba(0,0,0,0.45)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(0,0,0,0.35)'
          }}
        >
          {phoneMode ? (
            <>
              <svg
                width='15'
                height='15'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <rect x='2' y='3' width='20' height='14' rx='2' />
                <line x1='8' y1='21' x2='16' y2='21' />
                <line x1='12' y1='17' x2='12' y2='21' />
              </svg>
              Toàn màn hình
            </>
          ) : (
            <>
              <svg
                width='13'
                height='15'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <rect x='5' y='2' width='14' height='20' rx='2' />
                <line x1='12' y1='18' x2='12.01' y2='18' />
              </svg>
              Xem kiểu điện thoại
            </>
          )}
        </button>
      )}

      {/* Nội dung template */}
      <div>
        {phoneMode && isDesktop ? (
          <TemplateViewportContext.Provider value='phone'>
            <div
              className='template-phone-preview-shell'
              style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                background: 'linear-gradient(160deg, #fdf4f8 0%, #faf5ff 50%, #f0f9ff 100%)',
                padding: '32px 0 80px'
              }}
            >
              <div
                style={{
                  width: 390,
                  minHeight: '85vh',
                  borderRadius: 40,
                  overflow: 'hidden',
                  boxShadow: '0 32px 80px rgba(0,0,0,0.25), 0 0 0 10px #1a1a1a, 0 0 0 11px #333',
                  position: 'relative'
                }}
              >
                <GeneralView wedding={demoWedding as any} musicUrl={demoWedding.content?.music_url} />
              </div>
            </div>
          </TemplateViewportContext.Provider>
        ) : (
          <TemplateViewportContext.Provider value={isDesktop ? 'laptop' : 'phone'}>
            <GeneralView wedding={demoWedding as any} musicUrl={demoWedding.content?.music_url} />
          </TemplateViewportContext.Provider>
        )}
      </div>

      {/* Fix riêng cho chế độ phone preview trên desktop (không ảnh hưởng template gốc) */}
      {phoneMode && isDesktop && branch.toLowerCase().includes('vintage') && (
        <style>{`
          .template-phone-preview-shell .vintage-side-panel { display: none !important; }
          .template-phone-preview-shell .vintage-card {
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            border-radius: 0 !important;
            overflow-x: hidden !important;
          }
          .template-phone-preview-shell .vintage-ornament {
            top: -34px !important;
            height: clamp(96px, 26vw, 134px) !important;
            opacity: 1 !important;
            z-index: 2 !important;
          }
          .template-phone-preview-shell .vintage-ornament-left {
            left: 3% !important;
            right: auto !important;
            transform: none !important;
            animation: none !important;
          }
          .template-phone-preview-shell .vintage-ornament-right {
            right: 3% !important;
            left: auto !important;
            transform: scaleX(-1) !important;
            animation: none !important;
          }
          .template-phone-preview-shell .gift-card-ornament {
            width: 126px !important;
            opacity: 0.96 !important;
            z-index: 3 !important;
            display: block !important;
          }
          .template-phone-preview-shell .gift-card-ornament-left { left: -84px !important; }
          .template-phone-preview-shell .gift-card-ornament-right { right: -84px !important; }
        `}</style>
      )}

      {/* Music player cho các template không tự quản lý nhạc (trừ những template tự nhúng MusicPlayer) */}
      {!['theme-vintage', 'theme-boho', 'theme-royal', 'theme-modern', 'theme-luxury', 'theme-nature'].includes(
        branch
      ) && <MusicPlayer musicUrl={demoWedding.content?.music_url} />}
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
