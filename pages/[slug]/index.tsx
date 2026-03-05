import { getTemplate } from '@/templates/TemplateRegistry'
import { createClient } from '@supabase/supabase-js'
import { GetServerSideProps } from 'next'
import Head from 'next/head'

interface Props {
  wedding: any
  slug: string
}

export default function GeneralWeddingPage({ wedding, slug }: Props) {
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
      <SelectedTemplate wedding={wedding} />
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
