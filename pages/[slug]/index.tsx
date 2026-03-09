import { getTemplate } from '@/templates/TemplateRegistry'
import { createClient } from '@supabase/supabase-js'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { TemplateViewportContext } from '@/lib/TemplateViewportContext'
import MusicPlayer from '@/components/MusicPlayer'

interface Props {
  wedding: any
  slug: string
}

export default function GeneralWeddingPage({ wedding, slug }: Props) {
  const [phoneMode, setPhoneMode] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!wedding) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>404 - Wedding not found</h1>
          <p className='text-gray-500'>Không tìm thấy thiệp cưới với slug này.</p>
        </div>
      </div>
    )
  }

  if (wedding.deployment_status === 'draft') {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50'>
        <div className='text-center px-6'>
          <div className='text-6xl mb-6'>🔒</div>
          <h1 className='text-2xl font-bold text-gray-800 mb-3'>Thiệp mời đang riêng tư</h1>
          <p className='text-gray-500 max-w-sm mx-auto'>
            Thiệp cưới này chưa được công khai. Vui lòng liên hệ chủ nhân để được chia sẻ đường dẫn.
          </p>
        </div>
      </div>
    )
  }

  // Lấy repo_branch từ template host đã chọn, fallback về 'default'
  const branch = wedding.template?.repo_branch || 'default'
  const SelectedTemplate = getTemplate(branch).GeneralView

  // Thông tin cho SEO động
  const groomName: string = wedding.content?.groom_name || ''
  const brideName: string = wedding.content?.bride_name || ''
  const coupleNames = groomName && brideName ? `${groomName} & ${brideName}` : 'Thiệp Cưới'
  const weddingDate: string = wedding.content?.wedding_date || ''
  const pageTitle = `Thiệp Cưới ${coupleNames} | MoiMoi`
  const pageDescription = `Trân trọng kính mời bạn tham dự lễ cưới của ${coupleNames}${weddingDate ? ` vào ngày ${weddingDate}` : ''}. Xem thiệp online trên MoiMoi.`
  const canonicalUrl = `https://www.moimoi.io.vn/${slug}`
  const coverImage = wedding.content?.cover_image || 'https://www.moimoi.io.vn/og-cover.png'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name='description' content={pageDescription} />
        <meta name='robots' content='index, follow' />
        <link rel='canonical' href={canonicalUrl} />

        {/* Open Graph */}
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content='MoiMoi' />
        <meta property='og:title' content={pageTitle} />
        <meta property='og:description' content={pageDescription} />
        <meta property='og:image' content={coverImage} />
        <meta property='og:url' content={canonicalUrl} />
        <meta property='og:locale' content='vi_VN' />

        {/* JSON-LD Schema - Event */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Event',
              name: `Lễ Cưới ${coupleNames}`,
              description: pageDescription,
              url: canonicalUrl,
              ...(weddingDate && { startDate: weddingDate }),
              organizer: {
                '@type': 'Organization',
                name: 'MoiMoi',
                url: 'https://www.moimoi.io.vn'
              }
            })
          }}
        />
      </Head>

      {/* Toggle button — chỉ hiện trên desktop */}
      {isDesktop && (
        <button
          onClick={() => setPhoneMode((p) => !p)}
          style={{
            position: 'fixed',
            bottom: 28,
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
                <SelectedTemplate wedding={wedding} musicUrl={wedding.content?.music_url} />
              </div>
            </div>
          </TemplateViewportContext.Provider>
        ) : (
          <TemplateViewportContext.Provider value={isDesktop ? 'laptop' : 'phone'}>
            <SelectedTemplate wedding={wedding} musicUrl={wedding.content?.music_url} />
          </TemplateViewportContext.Provider>
        )}
      </div>

      {/* Music player cho các template không tự quản lý nhạc */}
      {branch !== 'vintage' && <MusicPlayer musicUrl={wedding.content?.music_url} />}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string }

  const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )

  // Single query with join — lấy wedding + template + package trong 1 lần
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
      wedding: {
        ...weddingData,
        content: weddingData.content || {},
        package: packageData
      }
    }
  }
}
