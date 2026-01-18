import { useCallback, useEffect, useRef, useState } from 'react'

import { dataService, RSVP } from '../../lib/data-service'

interface WishesProps {
  weddingId: string
}

export default function Wishes({ weddingId }: WishesProps) {
  const [wishes, setWishes] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)
  const scrollerRef = useRef<HTMLDivElement>(null)

  const fetchWishes = useCallback(async () => {
    try {
      const data = await dataService.getRSVPs(weddingId)
      // Filter only those with wishes
      setWishes(data.filter((r) => r.wishes && r.wishes.trim().length > 0))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [weddingId])

  useEffect(() => {
    fetchWishes()
  }, [fetchWishes])

  if (loading) return null // Or skeleton
  if (wishes.length === 0) return null

  return (
    <div className='max-w-5xl mx-auto'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-3xl font-serif font-bold text-gray-900'>Lời Chúc Từ Khách Mời</h2>
        <div className='flex gap-2'>
          <button
            onClick={() => scrollerRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
            className='px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50'
          >
            ←
          </button>
          <button
            onClick={() => scrollerRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
            className='px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50'
          >
            →
          </button>
        </div>
      </div>

      <div ref={scrollerRef} className='flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 scroll-smooth'>
        {wishes.map((wish) => (
          <div
            key={wish.id}
            className='min-w-[260px] max-w-[280px] bg-white p-6 rounded-2xl shadow-sm border border-pink-50 hover:shadow-md transition-shadow relative overflow-hidden snap-start'
          >
            <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-rose-400'></div>
            <div className='mb-4'>
              <div className='w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-xs mb-3'>
                {wish.guest_name.charAt(0).toUpperCase()}
              </div>
              <p className='text-gray-600 italic leading-relaxed'>&quot;{wish.wishes}&quot;</p>
            </div>
            <div className='border-t border-gray-100 pt-4 flex justify-between items-center'>
              <div className='font-bold text-gray-900 text-sm'>{wish.guest_name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
