// pages/index.tsx trên nhánh theme-vintage
import { GetStaticProps } from 'next'
import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/supabase'

type Wedding = Database['public']['Tables']['weddings']['Row']

interface Props {
  wedding: Wedding | null
}

export default function WeddingTemplate({ wedding }: Props) {
  if (!wedding) return <div className='text-center p-10'>Đang tải thông tin đám cưới...</div>

  const content = wedding.content as any // Cast sang any hoặc type cụ thể của bạn

  return (
    <div className='min-h-screen bg-rose-50 font-serif'>
      {/* Hero Section */}
      <header className='h-screen flex flex-col items-center justify-center text-center p-4'>
        <h1 className='text-5xl text-rose-800 mb-4'>
          {content.groom_name} & {content.bride_name}
        </h1>
        <p className='text-xl text-gray-600'>Trân trọng kính mời</p>
        <div className='mt-8'>
          {/* Logic hiển thị tên khách từ URL sẽ nằm ở đây (Client-side) */}
          <p className='text-2xl font-bold' id='guest-name'>
            Bạn và Người thương
          </p>
        </div>
      </header>

      {/* Các phần khác: Album, Time, Location... */}
      <section className='p-10 text-center'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={content.images?.[0]} alt='Wedding Photo' className='w-full max-w-2xl mx-auto rounded shadow' />
        <p className='mt-4'>{content.wishes}</p>
      </section>
    </div>
  )
}

// Hàm này chạy trên Server của GitHub Actions khi Build
export const getStaticProps: GetStaticProps = async () => {
  // Lấy Wedding ID từ biến môi trường (được bơm vào từ GitHub Action)
  const weddingId = process.env.NEXT_PUBLIC_WEDDING_ID

  if (!weddingId) {
    return { notFound: true }
  }

  const supabase = createClient()
  const { data: wedding } = await supabase.from('weddings').select('*').eq('id', weddingId).single()

  return {
    props: {
      wedding
    }
    // Không dùng revalidate vì đây là Static Site hoàn toàn
  }
}
