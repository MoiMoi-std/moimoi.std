import { ArrowRight, Calendar, Clock, Edit, Gift, Heart, MapPin, Share2, Sparkles, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import StudioLayout from '../../components/studio/StudioLayout'
import StudioLoading from '../../components/studio/StudioLoading'
import { useToast } from '../../components/ui/ToastProvider'
import { dataService } from '../../lib/data-service'
import { useWedding } from '../../lib/useWedding'

const baseUrl = process.env.NEXT_SITE_URL || 'https://www.moimoi.io.vn/'

const Dashboard = () => {
  const { wedding, setWedding, loading } = useWedding()
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [creating, setCreating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (wedding?.content?.wedding_date) {
      const interval = setInterval(() => {
        const weddingDate = new Date(`${wedding.content.wedding_date}T${wedding.content.wedding_time || '00:00'}`)
        const now = new Date()
        const diff = weddingDate.getTime() - now.getTime()

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)
          setTimeRemaining({ days, hours, minutes, seconds })
        } else {
          setTimeRemaining(null)
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [wedding])

  if (loading)
    return (
      <StudioLayout>
        <StudioLoading message='Đang tải studio của bạn...' />
      </StudioLayout>
    )

  if (!wedding)
    return (
      <StudioLayout>
        <div className='flex flex-col items-center justify-center h-[70vh] text-center'>
          <div className='w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-6 animate-pulse'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src='/image/logo-notext.png' alt='MoiMoi' className='w-12 h-12 object-contain' />
          </div>
          <h2 className='text-3xl font-serif font-bold text-gray-900 mb-4'>Chào mừng bạn đến với MoiMoi Studio!</h2>
          <p className='text-gray-500 max-w-md mb-8'>
            Hãy bắt đầu hành trình tạo nên đám cưới trong mơ của bạn. Thiết lập thông tin và gửi lời mời đến những người
            thân yêu.
          </p>
          <button
            onClick={async () => {
              if (creating) return
              setCreating(true)
              await dataService.createWedding()
              const data = await dataService.getWedding()
              setWedding(data)
              setCreating(false)
              toast('Đã khởi tạo đám cưới thành công!', 'success')
            }}
            disabled={creating}
            className='px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-full font-bold shadow-lg hover:shadow-pink-300 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-60 disabled:hover:scale-100'
          >
            <Sparkles size={20} /> {creating ? 'Đang khởi tạo...' : 'Bắt Đầu Ngay'}
          </button>
        </div>
      </StudioLayout>
    )

  const quickStats = [
    {
      label: 'Ngày Còn Lại',
      value: timeRemaining ? timeRemaining.days : '-',
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    { label: 'Khách Đã Mời', value: '0', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Lời Chúc', value: '0', icon: Heart, color: 'text-red-600', bg: 'bg-red-100' }
  ]

  return (
    <StudioLayout>
      {/* Hero Section */}
      <div className='relative overflow-hidden rounded-3xl bg-white shadow-sm border border-pink-100 p-8 md:p-12 mb-8'>
        <div className='relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6'>
          <div className='max-w-2xl'>
            <div className='inline-flex items-center px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider mb-3'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src='/image/logo-notext.png' alt='MoiMoi' className='w-4 h-4 object-contain mr-2' />
              Studio Đám Cưới
            </div>
            <h2 className='font-serif font-bold text-gray-900 mb-2 leading-tight'>
              <span className='block text-xl md:text-2xl text-gray-500 mb-1 font-sans font-medium'>Xin chào,</span>
              <span className='text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500'>
                {wedding.content.groom_name || 'Bạn'} & {wedding.content.bride_name || 'Người Thương'}
              </span>
            </h2>
            <p className='text-gray-500 text-lg mt-2'>Cùng nhau tạo nên những khoảnh khắc tuyệt vời nhất.</p>
          </div>

          <div className='flex gap-3 flex-wrap sm:flex-nowrap'>
            <button
              onClick={() => window.open(window.location.origin + `/${wedding.slug}`, '_blank')}
              className='whitespace-nowrap flex items-center px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm font-medium group'
            >
              Xem Thiệp{' '}
              <ArrowRight size={18} className='ml-2 text-gray-400 group-hover:text-pink-500 transition-colors' />
            </button>
            <Link href='/studio/editor'>
              <button className='whitespace-nowrap flex items-center px-5 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-all shadow-lg shadow-pink-200 font-medium'>
                <Edit size={18} className='mr-2' /> Chỉnh Sửa
              </button>
            </Link>
          </div>
        </div>

        {/* Background Decor */}
        <div className='absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-pink-100/50 to-purple-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none'></div>
      </div>

      {/* Countdown Grid */}
      {!wedding.content.wedding_date ? (
        <div className='bg-white p-8 rounded-2xl shadow-sm border border-pink-100 text-center mb-8'>
          <div className='w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-3 text-pink-500'>
            <Calendar size={24} />
          </div>
          <h3 className='text-lg font-bold text-gray-900 mb-2'>Ngày cưới chưa được thiết lập</h3>
          <p className='text-gray-500 mb-4'>Hãy cập nhật ngày cưới để kích hoạt đồng hồ đếm ngược.</p>
          <Link href='/studio/editor'>
            <button className='px-4 py-2 bg-pink-600 text-white rounded-lg font-bold text-sm hover:bg-pink-700 transition-colors shadow-lg shadow-pink-200'>
              Thiết lập ngày cưới
            </button>
          </Link>
        </div>
      ) : timeRemaining ? (
        <div className='bg-gradient-to-r from-pink-600 to-rose-500 rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-xl shadow-pink-200'>
          {/* Background Pattern */}
          <div className='absolute top-0 right-0 -mr-8 -mt-8 opacity-10 rotate-12'>
            <Clock size={180} />
          </div>
          <div className='absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-white rounded-full opacity-10 blur-2xl'></div>

          <div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-8'>
            <div className='text-center md:text-left'>
              <div className='inline-flex items-center px-2 py-1 rounded-lg bg-pink-500/50 border border-pink-400/50 backdrop-blur-sm text-pink-50 text-[10px] font-bold uppercase tracking-wider mb-2'>
                <Heart size={10} className='mr-1 fill-current' /> Sắp diễn ra
              </div>
              <h3 className='text-2xl font-serif font-bold'>Đếm Ngược Ngày Cưới</h3>
              <p className='text-pink-100 text-sm mt-1 opacity-90'>Chỉ còn một chút thời gian nữa thôi...</p>
            </div>

            <div className='flex items-center gap-2 md:gap-6'>
              {[
                { label: 'Ngày', value: timeRemaining.days },
                { label: 'Giờ', value: timeRemaining.hours },
                { label: 'Phút', value: timeRemaining.minutes },
                { label: 'Giây', value: timeRemaining.seconds }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className='flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-2xl p-3 md:p-4 min-w-[70px] md:min-w-[90px] border border-white/10'
                >
                  <div className='text-2xl md:text-3xl font-serif font-bold mb-0.5 tabular-nums text-white'>
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className='text-[10px] md:text-xs uppercase font-medium tracking-wider text-pink-100'>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className='bg-white p-8 rounded-2xl shadow-sm border border-pink-100 text-center mb-8'>
          <div className='text-4xl mb-2'>🎉</div>
          <h3 className='text-lg font-bold text-gray-900 mb-1'>Đám cưới đã diễn ra!</h3>
          <p className='text-gray-500'>Chúc hai bạn trăm năm hạnh phúc.</p>
        </div>
      )}

      {/* Main Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column: Quick Stats & Actions */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Quick Stats */}
          <div className='grid grid-cols-3 gap-4'>
            {quickStats.map((stat, idx) => (
              <div
                key={idx}
                className='bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-pink-100 transition-colors group'
              >
                <div
                  className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                  <stat.icon size={20} />
                </div>
                <div className='text-2xl font-bold text-gray-900'>{stat.value}</div>
                <div className='text-xs text-gray-500 font-medium uppercase mt-1'>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Wedding Details Card */}
          <div className='bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-bold text-gray-900'>Chi Tiết Lễ Cưới</h3>
              <Link href='/studio/editor' className='text-sm font-bold text-pink-600 hover:text-pink-700'>
                Chỉnh Sửa
              </Link>
            </div>

            <div className='space-y-6'>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 mt-1'>
                  <Calendar size={20} />
                </div>
                <div>
                  <div className='font-bold text-gray-900'>Thời Gian</div>
                  <div className='text-gray-500'>
                    {wedding?.content.wedding_date || 'Chưa thiết lập'} - {wedding?.content.wedding_time || '--:--'}
                  </div>
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mt-1'>
                  <MapPin size={20} />
                </div>
                <div>
                  <div className='font-bold text-gray-900'>Địa Điểm</div>
                  <div className='text-gray-500 max-w-sm'>{wedding?.content.address || 'Chưa thiết lập địa chỉ'}</div>
                  {wedding?.content.map_url && (
                    <a
                      href={wedding.content.map_url}
                      target='_blank'
                      rel='noreferrer'
                      className='text-xs font-bold text-blue-600 hover:underline mt-1 inline-block'
                    >
                      Xem Bản Đồ
                    </a>
                  )}
                </div>
              </div>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mt-1'>
                  <Gift size={20} />
                </div>
                <div>
                  <div className='font-bold text-gray-900'>Ngân Hàng Phản Hồi</div>
                  <div className='text-gray-500'>{wedding?.content.bank_name || 'Chưa thiết lập'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Publish */}
        <div className='space-y-8'>
          {/* Publish Status Card */}
          <div className='bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden'>
            <div className='relative z-10'>
              <div className='flex flex-col items-center py-2 justify-between mb-6'>
                <div className='font-bold text-lg w-full text-center mb-2'>Trạng Thái Website</div>
                <div
                  className={`px-3 w-full rounded-lg text-xs py-2 text-center font-bold uppercase ${wedding.deployment_status === 'published' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}
                >
                  {wedding.deployment_status === 'published' ? 'Đã Xuất Bản' : 'Nháp'}
                </div>
              </div>

              <p className='text-gray-400 text-sm leading-relaxed'>
                {wedding.deployment_status === 'published'
                  ? 'Website của bạn đang hoạt động và sẵn sàng đón khách!'
                  : 'Website của bạn đang ở chế độ nháp. Hãy xuất bản để chia sẻ với mọi người.'}
              </p>

              {/* <Link href='/studio/settings'>
                <button className='w-full py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors'>
                  {wedding.deployment_status === 'published' ? 'Cấu Hình' : 'Xuất Bản Ngay'}
                </button>
              </Link> */}
            </div>

            {/* Decorative Circles */}
            <div className='absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-pink-500 rounded-full opacity-20 blur-3xl'></div>
            <div className='absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-purple-500 rounded-full opacity-20 blur-3xl'></div>
          </div>

          {/* Share Card */}
          <div className='bg-pink-50 p-8 rounded-3xl border border-pink-100'>
            <h3 className='font-bold text-gray-900 mb-2 flex items-center gap-2'>
              <Share2 size={18} className='text-pink-600' /> Chia Sẻ
            </h3>
            <p className='text-sm text-gray-600 mb-4'>Gửi link website cho bạn bè và người thân.</p>
            <div className='bg-white p-3 rounded-xl border border-pink-200 flex items-center justify-between gap-2 shadow-sm'>
              <code className='text-xs text-gray-500 truncate flex-1'>
                {baseUrl}/{wedding.slug}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${baseUrl}/${wedding.slug}`)
                  toast('Đã sao chép liên kết!', 'success')
                }}
                className='text-xs font-bold text-pink-600 hover:text-pink-700 whitespace-nowrap'
              >
                Sao chép
              </button>
            </div>
          </div>
        </div>
      </div>
    </StudioLayout>
  )
}

export default Dashboard
