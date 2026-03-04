import { getTemplate } from '@/templates/TemplateRegistry'
import { createClient } from '@supabase/supabase-js'
import { GetServerSideProps } from 'next'

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

  return <SelectedTemplate wedding={wedding} />
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
