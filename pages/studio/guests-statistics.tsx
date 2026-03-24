import { Check, MessageSquare, Users, X } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import StudioEmptyState from '../../components/studio/StudioEmptyState'
import StudioLayout from '../../components/studio/StudioLayout'
import StudioLoading from '../../components/studio/StudioLoading'
import { RSVP, dataService } from '../../lib/data-service'
import { useWedding } from '../../lib/useWedding'

const GuestsStatistics = () => {
  const router = useRouter()
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const { wedding, loading: weddingLoading } = useWedding()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!wedding || weddingLoading) {
        setLoading(false)
        return
      }
      setLoading(true)
      const rsvpData = await dataService.getRSVPs(wedding.id)
      setRsvps(rsvpData)
      setLoading(false)
    }
    fetchData()
  }, [wedding, weddingLoading])

  const responseByDate = Array.from(
    rsvps.reduce((acc, r) => {
      if (!r.created_at || r.is_attending === null) return acc
      const dateKey = new Date(r.created_at).toISOString().slice(0, 10)
      acc.set(dateKey, (acc.get(dateKey) || 0) + 1)
      return acc
    }, new Map<string, number>())
  )
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([dateKey, count]) => ({
      dateKey,
      label: new Date(dateKey).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      count
    }))
  const maxDailyResponse = responseByDate.length ? Math.max(...responseByDate.map((item) => item.count)) : 0
  const noResponseGuests = rsvps.filter((r) => r.is_attending === null)

  if (weddingLoading || loading) {
    return (
      <StudioLayout>
        <StudioLoading message='Đang tải thống kê...' />
      </StudioLayout>
    )
  }

  if (!wedding) {
    return (
      <StudioLayout>
        <StudioEmptyState />
      </StudioLayout>
    )
  }

  return (
    <StudioLayout>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h2 className='text-3xl font-serif font-bold text-gray-900'>Thống Kê Khách Mời</h2>
          <p className='text-gray-500 mt-1'>Theo dõi tình hình xác nhận tham dự và các thông tin chi tiết.</p>
        </div>
        <button
          onClick={() => router.push('/studio/guests')}
          className='px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm'
        >
          ← Quay lại
        </button>
      </div>

      {/* Summary Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
        <div className='bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-pink-100 shadow-sm'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-sm font-semibold text-rose-700 uppercase tracking-wide'>Tổng Khách</h3>
            <div className='w-10 h-10 bg-white/80 rounded-lg flex items-center justify-center'>
              <Users size={20} className='text-rose-500' />
            </div>
          </div>
          <p className='text-3xl font-bold text-gray-900'>{rsvps.length}</p>
          <p className='text-xs text-gray-500 mt-2'>người</p>
        </div>

        <div className='bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100 shadow-sm'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-sm font-semibold text-pink-700 uppercase tracking-wide'>Tham Dự</h3>
            <div className='w-10 h-10 bg-white/80 rounded-lg flex items-center justify-center'>
              <Check size={20} className='text-pink-600' />
            </div>
          </div>
          <p className='text-3xl font-bold text-pink-700'>{rsvps.filter((r) => r.is_attending === true).length}</p>
          <p className='text-xs text-gray-500 mt-2'>
            {rsvps.length > 0
              ? ((rsvps.filter((r) => r.is_attending === true).length / rsvps.length) * 100).toFixed(0)
              : 0}
            %
          </p>
        </div>

        <div className='bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100 shadow-sm'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-sm font-semibold text-rose-700 uppercase tracking-wide'>Vắng Mặt</h3>
            <div className='w-10 h-10 bg-white/80 rounded-lg flex items-center justify-center'>
              <X size={20} className='text-rose-500' />
            </div>
          </div>
          <p className='text-3xl font-bold text-rose-700'>{rsvps.filter((r) => r.is_attending === false).length}</p>
          <p className='text-xs text-gray-500 mt-2'>
            {rsvps.length > 0
              ? ((rsvps.filter((r) => r.is_attending === false).length / rsvps.length) * 100).toFixed(0)
              : 0}
            %
          </p>
        </div>

        <div className='bg-gradient-to-br from-fuchsia-50 to-pink-50 rounded-2xl p-6 border border-fuchsia-100 shadow-sm'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-sm font-semibold text-fuchsia-700 uppercase tracking-wide'>Chưa Trả Lời</h3>
            <div className='w-10 h-10 bg-white/80 rounded-lg flex items-center justify-center'>
              <MessageSquare size={20} className='text-fuchsia-600' />
            </div>
          </div>
          <p className='text-3xl font-bold text-fuchsia-700'>{rsvps.filter((r) => r.is_attending === null).length}</p>
          <p className='text-xs text-gray-500 mt-2'>
            {rsvps.length > 0
              ? ((rsvps.filter((r) => r.is_attending === null).length / rsvps.length) * 100).toFixed(0)
              : 0}
            %
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
        <div className='bg-gradient-to-br from-white to-rose-50 rounded-2xl p-8 border border-pink-100 shadow-sm'>
          <h3 className='text-lg font-bold text-gray-900 mb-8'>Xác Nhận Tham Dự</h3>
          <div className='flex flex-col items-center justify-center h-80'>
            {rsvps.length > 0 ? (
              <div className='flex flex-col items-center w-full'>
                <div
                  className='w-56 h-56 rounded-full shadow-lg flex items-center justify-center relative'
                  style={{
                    background: `conic-gradient(
                      rgb(236, 72, 153) 0deg,
                      rgb(236, 72, 153) ${((rsvps.filter((r) => r.is_attending === true).length / rsvps.length) * 360).toFixed(0)}deg,
                      rgb(251, 113, 133) ${((rsvps.filter((r) => r.is_attending === true).length / rsvps.length) * 360).toFixed(0)}deg,
                      rgb(251, 113, 133) ${(((rsvps.filter((r) => r.is_attending === true).length + rsvps.filter((r) => r.is_attending === false).length) / rsvps.length) * 360).toFixed(0)}deg,
                      rgb(217, 70, 239) ${(((rsvps.filter((r) => r.is_attending === true).length + rsvps.filter((r) => r.is_attending === false).length) / rsvps.length) * 360).toFixed(0)}deg,
                      rgb(217, 70, 239) 360deg
                    )`
                  }}
                >
                  <div className='w-40 h-40 bg-white rounded-full flex items-center justify-center flex-col shadow-md'>
                    <p className='text-3xl font-bold text-gray-900'>{rsvps.length}</p>
                    <p className='text-xs text-gray-500'>tổng khách</p>
                  </div>
                </div>

                <div className='mt-6 space-y-2 w-full max-w-md'>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 bg-pink-500 rounded-full'></div>
                      <span className='text-gray-700'>Tham dự</span>
                    </div>
                    <span className='font-bold text-pink-600'>
                      {rsvps.filter((r) => r.is_attending === true).length}
                    </span>
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 bg-rose-400 rounded-full'></div>
                      <span className='text-gray-700'>Vắng mặt</span>
                    </div>
                    <span className='font-bold text-rose-500'>
                      {rsvps.filter((r) => r.is_attending === false).length}
                    </span>
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 bg-fuchsia-500 rounded-full'></div>
                      <span className='text-gray-700'>Chưa trả lời</span>
                    </div>
                    <span className='font-bold text-fuchsia-600'>
                      {rsvps.filter((r) => r.is_attending === null).length}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center'>
                <div className='w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4'>
                  <Users size={48} />
                </div>
                <p className='text-gray-500 text-center'>Chưa có dữ liệu khách mời</p>
              </div>
            )}
          </div>
        </div>

        <div className='bg-gradient-to-br from-white to-rose-50 rounded-2xl p-8 border border-pink-100 shadow-sm'>
          <h3 className='text-lg font-bold text-gray-900 mb-8'>Phản Hồi</h3>
          <div className='flex items-end justify-center gap-8 h-80'>
            <div className='flex flex-col items-center flex-1 max-w-[100px]'>
              <div className='relative w-full h-80 flex flex-col justify-end items-center'>
                <div
                  className='w-12 bg-gradient-to-t from-pink-600 to-pink-400 rounded-t-xl shadow-lg transition-all duration-500'
                  style={{
                    height: `${rsvps.length > 0 ? ((rsvps.filter((r) => r.is_attending === true).length / rsvps.length) * 100).toFixed(0) : 0}%`
                  }}
                />
                <div className='mt-3 text-center'>
                  <p className='text-xs font-bold text-gray-700 uppercase'>Tham Dự</p>
                  <p className='text-xl font-bold text-pink-600'>
                    {rsvps.filter((r) => r.is_attending === true).length}
                  </p>
                </div>
              </div>
            </div>

            <div className='flex flex-col items-center flex-1 max-w-[100px]'>
              <div className='relative w-full h-80 flex flex-col justify-end items-center'>
                <div
                  className='w-12 bg-gradient-to-t from-rose-500 to-rose-300 rounded-t-xl shadow-lg transition-all duration-500'
                  style={{
                    height: `${rsvps.length > 0 ? ((rsvps.filter((r) => r.is_attending === false).length / rsvps.length) * 100).toFixed(0) : 0}%`
                  }}
                />
                <div className='mt-3 text-center'>
                  <p className='text-xs font-bold text-gray-700 uppercase'>Vắng Mặt</p>
                  <p className='text-xl font-bold text-rose-500'>
                    {rsvps.filter((r) => r.is_attending === false).length}
                  </p>
                </div>
              </div>
            </div>

            <div className='flex flex-col items-center flex-1 max-w-[100px]'>
              <div className='relative w-full h-80 flex flex-col justify-end items-center'>
                <div
                  className='w-12 bg-gradient-to-t from-fuchsia-500 to-fuchsia-300 rounded-t-xl shadow-lg transition-all duration-500'
                  style={{
                    height: `${rsvps.length > 0 ? ((rsvps.filter((r) => r.is_attending === null).length / rsvps.length) * 100).toFixed(0) : 0}%`
                  }}
                />
                <div className='mt-3 text-center'>
                  <p className='text-xs font-bold text-gray-700 uppercase'>Chưa Trả Lời</p>
                  <p className='text-xl font-bold text-fuchsia-600'>
                    {rsvps.filter((r) => r.is_attending === null).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='bg-gradient-to-br from-white to-rose-50 rounded-2xl p-8 border border-pink-100 shadow-sm'>
          <h3 className='text-lg font-bold text-gray-900 mb-8'>Phản Hồi Theo Ngày</h3>
          {responseByDate.length === 0 ? (
            <div className='h-80 flex items-center justify-center text-center'>
              <p className='text-gray-500'>Chưa có dữ liệu phản hồi theo ngày</p>
            </div>
          ) : (
            <div className='space-y-4'>
              <svg viewBox='0 0 100 100' className='w-full h-64'>
                <line x1='0' y1='90' x2='100' y2='90' stroke='#e5e7eb' strokeWidth='1' />
                <line x1='0' y1='10' x2='0' y2='90' stroke='#e5e7eb' strokeWidth='1' />
                <polyline
                  fill='none'
                  stroke='#ec4899'
                  strokeWidth='2.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  points={responseByDate
                    .map((item, idx) => {
                      const x = responseByDate.length === 1 ? 50 : (idx / (responseByDate.length - 1)) * 100
                      const y = 90 - (item.count / maxDailyResponse) * 70
                      return `${x},${y}`
                    })
                    .join(' ')}
                />
                {responseByDate.map((item, idx) => {
                  const x = responseByDate.length === 1 ? 50 : (idx / (responseByDate.length - 1)) * 100
                  const y = 90 - (item.count / maxDailyResponse) * 70
                  return <circle key={item.dateKey} cx={x} cy={y} r='2.4' fill='#ec4899' />
                })}
              </svg>

              <div
                className='grid gap-2'
                style={{ gridTemplateColumns: `repeat(${responseByDate.length}, minmax(0, 1fr))` }}
              >
                {responseByDate.map((item) => (
                  <div key={item.dateKey} className='text-center'>
                    <p className='text-xs font-bold text-gray-700'>{item.label}</p>
                    <p className='text-xs text-pink-600 font-semibold'>{item.count} phản hồi</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className='bg-gradient-to-br from-white to-rose-50 rounded-2xl p-8 border border-pink-100 shadow-sm'>
          <h3 className='text-lg font-bold text-gray-900 mb-6'>Danh Sách Người Chưa Phản Hồi</h3>
          {noResponseGuests.length > 0 ? (
            <div className='space-y-3 max-h-[600px] overflow-y-auto pr-2'>
              {noResponseGuests.map((rsvp, idx) => (
                <div
                  key={rsvp.id}
                  className='flex gap-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-pink-100 hover:shadow-md transition-shadow'
                >
                  <div className='flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-600 font-bold border border-pink-200'>
                    {idx + 1}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='font-semibold text-gray-900'>{rsvp.guest_name}</p>
                    <p className='text-sm text-gray-500 mt-1'>
                      {rsvp.phone ? `SĐT: ${rsvp.phone}` : 'Chưa có số điện thoại'}
                    </p>
                    <p className='text-xs text-gray-400 mt-1'>Trạng thái: chưa xác nhận tham dự</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <div className='w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-4 text-pink-500'>
                <Check size={24} />
              </div>
              <p className='text-gray-500'>Tất cả khách đã phản hồi</p>
            </div>
          )}
        </div>
      </div>
    </StudioLayout>
  )
}

export default GuestsStatistics
