import MoneyGift from '@/components/guest/MoneyGift'
import RSVPForm from '@/components/guest/RSVPForm'
import Wishes from '@/components/guest/Wishes'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Wedding } from '../lib/data-service'

// Mock fetching for now or use dataService if compatible with SSR
// Note: dataService uses supabase-js which works server-side too.

interface WeddingPageProps {
  wedding: Wedding | null
}

export default function WeddingPage({ wedding }: WeddingPageProps) {
  if (!wedding) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-pink-50'>
        <div className='text-center'>
          <h1 className='text-4xl font-serif text-gray-800 mb-4'>404</h1>
          <p className='text-gray-600'>Wedding not found.</p>
        </div>
      </div>
    )
  }

  const { content } = wedding

  return (
    <>
      <Head>
        <title>
          {content.groom_name} & {content.bride_name} - Wedding Invitation
        </title>
        <meta
          name='description'
          content={`Join us for the wedding of ${content.groom_name} and ${content.bride_name}`}
        />
      </Head>

      <div className='min-h-screen font-sans text-gray-800 bg-[#FDFBF7] selection:bg-pink-200 selection:text-pink-900'>
        {/* Banner / Hero */}
        <div className='h-[70vh] md:h-[85vh] bg-gray-200 relative overflow-hidden'>
          {content.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={content.images[0]} alt='Cover' className='w-full h-full object-cover' />
          ) : (
            <div className='w-full h-full bg-gradient-to-b from-pink-100 to-rose-200 flex items-center justify-center relative'>
              {/* Abstract Patterns */}
              <div className='absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2'></div>
              <div className='absolute bottom-0 right-0 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2'></div>
              <span className='text-white text-4xl md:text-6xl font-serif opacity-60 tracking-widest uppercase'>
                Save the Date
              </span>
            </div>
          )}
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-20 md:pb-32'>
            <div className='text-center text-white px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000'>
              <p className='text-lg md:text-2xl tracking-[0.2em] uppercase mb-4 opacity-90 font-light'>
                We Are Getting Married
              </p>
              <h1 className='text-5xl md:text-9xl font-serif font-bold mb-6 drop-shadow-lg leading-none'>
                {content.groom_name} <br className='md:hidden' /> <span className='text-pink-300 font-light'>&</span>{' '}
                <br className='md:hidden' /> {content.bride_name}
              </h1>
              <div className='inline-flex items-center gap-4 text-xl md:text-3xl font-serif border-t md:border-y border-white/50 pt-4 md:py-4 px-12'>
                <span>
                  {content.wedding_date
                    ? new Date(content.wedding_date).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })
                    : 'Date TBD'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section (Groom & Bride) */}
        <section className='max-w-6xl mx-auto py-24 px-6'>
          <div className='grid md:grid-cols-2 gap-16 md:gap-24 relative'>
            {/* Center Line Decoration */}
            <div className='hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-pink-200 to-transparent -translate-x-1/2'></div>
            <div className='hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-pink-200 bg-[#FDFBF7] rounded-full items-center justify-center text-2xl text-pink-500 font-serif'>
              &
            </div>

            <div className='space-y-6 text-center md:text-right group'>
              <div className='aspect-[3/4] bg-gray-200 rounded-full overflow-hidden w-48 h-48 md:w-80 md:h-80 mx-auto md:ml-auto md:mr-0 shadow-xl border-4 border-white rotate-3 transition-transform group-hover:rotate-0 duration-500'>
                {/* Placeholder for Groom Image */}
                <div className='w-full h-full bg-slate-300 flex items-center justify-center text-slate-400'>Groom</div>
              </div>
              <div>
                <h2 className='text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2'>The Groom</h2>
                <h3 className='text-xl font-bold text-pink-600 mb-4 font-sans uppercase tracking-wider'>
                  {content.groom_name || 'Groom Name'}
                </h3>
                <p className='text-gray-500 italic font-serif text-lg leading-relaxed'>
                  &quot;Hạnh phúc không phải là điểm đến, mà là hành trình chúng ta đi cùng nhau.&quot;
                </p>
              </div>
            </div>

            <div className='space-y-6 text-center md:text-left group'>
              <div className='aspect-[3/4] bg-gray-200 rounded-full overflow-hidden w-48 h-48 md:w-80 md:h-80 mx-auto md:mr-auto md:ml-0 shadow-xl border-4 border-white -rotate-3 transition-transform group-hover:rotate-0 duration-500'>
                {/* Placeholder for Bride Image */}
                <div className='w-full h-full bg-pink-200 flex items-center justify-center text-pink-400'>Bride</div>
              </div>
              <div>
                <h2 className='text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2'>The Bride</h2>
                <h3 className='text-xl font-bold text-pink-600 mb-4 font-sans uppercase tracking-wider'>
                  {content.bride_name || 'Bride Name'}
                </h3>
                <p className='text-gray-500 italic font-serif text-lg leading-relaxed'>
                  &quot;Em tìm thấy anh, là tìm thấy một nửa tuyệt vời nhất của cuộc đời mình.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Event Details */}
        <section className='bg-white py-24 px-6 relative'>
          <div className='absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-100 to-transparent'></div>
          <div className='max-w-5xl mx-auto'>
            <div className='text-center mb-16 space-y-4'>
              <span className='text-pink-600 font-bold tracking-[0.2em] uppercase text-sm'>Invitation</span>
              <h2 className='text-4xl md:text-6xl font-serif font-bold text-gray-900'>Sự Kiện Tiệc Cưới</h2>
              <div className='w-24 h-1 bg-pink-600 mx-auto rounded-full'></div>
            </div>

            <div className='grid md:grid-cols-3 gap-8'>
              {/* Time */}
              <div className='p-8 rounded-3xl bg-pink-50 border border-pink-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300'>
                <div className='w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-pink-600'>
                  <Calendar size={32} />
                </div>
                <h3 className='text-xl font-bold mb-2 uppercase tracking-wide text-gray-900'>Thời Gian</h3>
                <p className='text-gray-600 text-lg'>
                  {content.wedding_date
                    ? new Date(content.wedding_date).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                    : 'Đang cập nhật'}
                </p>
              </div>

              {/* Clock */}
              <div className='p-8 rounded-3xl bg-white border border-gray-100 shadow-xl text-center md:scale-110 z-10'>
                <div className='w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-200 text-white'>
                  <Clock size={32} />
                </div>
                <h3 className='text-xl font-bold mb-2 uppercase tracking-wide text-gray-900'>Giờ Nhập Tiệc</h3>
                <div className='text-4xl font-serif font-bold text-pink-600 mb-2'>
                  {content.wedding_time || '--:--'}
                </div>
                <p className='text-gray-500 text-sm'>Vui lòng đến đúng giờ để buổi lễ thêm phần trọn vẹn</p>
              </div>

              {/* Location */}
              <div className='p-8 rounded-3xl bg-blue-50 border border-blue-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300'>
                <div className='w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-blue-600'>
                  <MapPin size={32} />
                </div>
                <h3 className='text-xl font-bold mb-2 uppercase tracking-wide text-gray-900'>Địa Điểm</h3>
                <p className='text-gray-600 text-lg mb-4'>{content.address || 'Đang cập nhật địa chỉ'}</p>
                {content.map_url && (
                  <a
                    href={content.map_url}
                    target='_blank'
                    rel='noreferrer'
                    className='inline-flex items-center text-blue-600 text-sm font-bold hover:underline'
                  >
                    Xem bản đồ <MapPin size={14} className='ml-1' />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Wishes & RSVP Container */}
        <div className='relative py-24 px-6 bg-[#FDFBF7]'>
          {/* Background Decor */}
          <div className='absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white to-transparent pointer-events-none'></div>

          <div className='max-w-5xl mx-auto space-y-24'>
            {/* RSVP Form */}
            <section id='rsvp'>
              <RSVPForm weddingId={wedding.id} />
            </section>

            {/* Money Gift */}
            <section>
              <MoneyGift content={content} />
            </section>

            {/* Wishes */}
            <section>
              <Wishes weddingId={wedding.id} />
            </section>
          </div>
        </div>

        <footer className='bg-gray-900 py-12 text-center text-gray-400'>
          <div className='mb-4 text-2xl font-serif text-white'>
            {content.groom_name} <span className='text-pink-500'>&</span> {content.bride_name}
          </div>
          <p className='text-sm opacity-50'>Created with MoiMoi Studio</p>
        </footer>
      </div>
    </>
  )
}

// Minimal SSR to get wedding data by Slug
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string }
  // We need a method to get wedding by SLUG, not by user ID.
  // Assuming Supabase table has 'slug' column.

  // Note: We can't use dataService.getWedding() because it relies on Auth.
  // We need a public fetch.

  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )

  const { data, error } = await supabase.from('weddings').select('*').eq('slug', slug).single()

  if (error || !data) {
    return {
      props: {
        wedding: null
      }
    }
  }

  return {
    props: {
      wedding: {
        ...data,
        content: data.content || {}
      }
    }
  }
}
