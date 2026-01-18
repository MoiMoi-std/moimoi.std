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

      <div className='min-h-screen font-sans text-gray-800 bg-[#FDFBF7]'>
        {/* Banner / Hero */}
        <div className='h-[60vh] bg-gray-200 relative overflow-hidden'>
          {content.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={content.images[0]} alt='Cover' className='w-full h-full object-cover' />
          ) : (
            <div className='w-full h-full bg-gradient-to-b from-pink-200 to-rose-300 flex items-center justify-center'>
              <span className='text-white text-6xl font-serif opacity-50'>Save the Date</span>
            </div>
          )}
          <div className='absolute inset-0 bg-black/30 flex items-center justify-center'>
            <div className='text-center text-white p-8'>
              <p className='text-xl tracking-widest uppercase mb-4'>We Are Getting Married</p>
              <h1 className='text-6xl md:text-8xl font-serif font-bold mb-6'>
                {content.groom_name} <span className='text-pink-300'>&</span> {content.bride_name}
              </h1>
              <div className='inline-block border-y border-white/50 py-3 px-8 text-xl'>
                {content.wedding_date ? new Date(content.wedding_date).toLocaleDateString() : 'Date TBD'}
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className='max-w-4xl mx-auto py-20 px-6'>
          <div className='grid md:grid-cols-2 gap-12 text-center md:text-left'>
            <div className='space-y-6'>
              <h2 className='text-3xl font-serif font-bold text-pink-600'>The Groom</h2>
              <p className='text-gray-600 leading-relaxed text-lg'>{content.groom_name || 'Groom Name'}</p>
              <p className='text-gray-500 italic'>"Can't wait to see you all!"</p>
            </div>
            <div className='space-y-6 md:text-right'>
              <h2 className='text-3xl font-serif font-bold text-pink-600'>The Bride</h2>
              <p className='text-gray-600 leading-relaxed text-lg'>{content.bride_name || 'Bride Name'}</p>
              <p className='text-gray-500 italic'>"Best day ever loading..."</p>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className='bg-white py-20 px-6'>
          <div className='max-w-4xl mx-auto text-center space-y-12'>
            <h2 className='text-4xl font-serif font-bold text-gray-900 icon-heading'>Event Details</h2>

            <div className='grid md:grid-cols-3 gap-8'>
              <div className='p-8 rounded-2xl bg-pink-50 hover:shadow-lg transition'>
                <Calendar className='w-10 h-10 text-pink-600 mx-auto mb-4' />
                <h3 className='text-xl font-bold mb-2'>When</h3>
                <p className='text-gray-600'>
                  {content.wedding_date ? new Date(content.wedding_date).toLocaleDateString() : 'TBD'}
                </p>
              </div>
              <div className='p-8 rounded-2xl bg-pink-50 hover:shadow-lg transition'>
                <Clock className='w-10 h-10 text-pink-600 mx-auto mb-4' />
                <h3 className='text-xl font-bold mb-2'>Time</h3>
                <p className='text-gray-600'>{content.wedding_time || 'TBD'}</p>
              </div>
              <div className='p-8 rounded-2xl bg-pink-50 hover:shadow-lg transition'>
                <MapPin className='w-10 h-10 text-pink-600 mx-auto mb-4' />
                <h3 className='text-xl font-bold mb-2'>Where</h3>
                <p className='text-gray-600'>{content.address || 'Address TBD'}</p>
                {content.map_url && (
                  <a
                    href={content.map_url}
                    target='_blank'
                    rel='noreferrer'
                    className='text-pink-600 text-sm font-bold underline mt-2 block'
                  >
                    View Map
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RSVP Form (Placeholder) */}
        <div className='py-20 px-6 bg-gray-900 text-white text-center'>
          <h2 className='text-4xl font-serif font-bold mb-6'>Are you attending?</h2>
          <p className='mb-8 text-gray-300'>Please let us know before the big day!</p>
          <button className='bg-pink-600 text-white px-10 py-4 rounded-full font-bold hover:bg-pink-700 transition'>
            RSVP Now
          </button>
        </div>

        <footer className='py-8 text-center text-gray-400 text-sm'>Created with MoiMoi</footer>
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
