import { ArrowRight, CheckCircle, Globe, Rocket } from 'lucide-react'
import { useState } from 'react'
import StudioEmptyState from '../../components/studio/StudioEmptyState'
import StudioLayout from '../../components/studio/StudioLayout'
import StudioLoading from '../../components/studio/StudioLoading'
import { useToast } from '../../components/ui/ToastProvider'
import { dataService } from '../../lib/data-service'
import { useWedding } from '../../lib/useWedding'

const Settings = () => {
  const { wedding, setWedding, loading } = useWedding()
  const [deploying, setDeploying] = useState(false)
  const { success, error } = useToast()

  const handlePublish = async () => {
    if (!wedding) return
    setDeploying(true)

    // Simulate deploy
    setTimeout(async () => {
      try {
        const result = await dataService.deployWedding(wedding.id)
        if (result.success) {
          setWedding({ ...wedding, deployment_status: 'published' })
          success('Xuất bản thành công! Đám cưới của bạn đã sẵn sàng.')
        } else {
          error('Xuất bản thất bại. Vui lòng thử lại sau.')
        }
      } catch (e) {
        error('Có lỗi xảy ra. Vui lòng thử lại.')
      } finally {
        setDeploying(false)
      }
    }, 2000)
  }

  if (loading)
    return (
      <StudioLayout>
        <StudioLoading message='Đang tải cài đặt...' />
      </StudioLayout>
    )

  if (!wedding)
    return (
      <StudioLayout>
        <StudioEmptyState />
      </StudioLayout>
    )

  return (
    <StudioLayout>
      <div className='mb-8'>
        <h2 className='text-3xl font-serif font-bold text-gray-900'>Cài Đặt</h2>
        <p className='text-gray-500 mt-1'>Quản lý xuất bản và cấu hình website</p>
      </div>

      <div className='max-w-4xl space-y-8'>
        {/* Publication Section */}
        <div className='bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden'>
          <div className='absolute top-0 right-0 p-12 opacity-5'>
            <Rocket size={200} />
          </div>

          <div className='relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8'>
            <div className='max-w-xl'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='p-2 bg-white/10 text-pink-300 rounded-lg backdrop-blur-sm'>
                  <Globe size={24} />
                </div>
                <h3 className='text-2xl font-bold'>Trạng Thái Xuất Bản</h3>
              </div>
              <p className='text-gray-300 mb-6 text-lg'>
                Sẵn sàng ra mắt? Việc xuất bản chỉ tốn khoảng 2-3 phút. Sau khi xuất bản, khách mời có thể xem thiệp và
                gửi lời chúc ngay lập tức.
              </p>
              {wedding.deployment_status === 'published' && (
                <div className='inline-flex items-center gap-2 bg-green-500/20 border border-green-500/50 px-4 py-2 rounded-full text-green-300 font-medium'>
                  <CheckCircle size={18} />
                  <span>Website đang hoạt động</span>
                </div>
              )}
            </div>

            <div className='flex flex-col gap-3 min-w-[200px]'>
              <button
                onClick={handlePublish}
                disabled={deploying}
                className={`
                  relative overflow-hidden group flex items-center justify-center px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg
                  ${
                    deploying
                      ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                      : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:shadow-pink-500/50 hover:scale-105 active:scale-95'
                  }
                `}
              >
                {deploying ? (
                  <span className='flex items-center'>
                    <svg
                      className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  <span className='flex items-center'>
                    Thực Hiện Xuất Bản{' '}
                    <ArrowRight size={20} className='ml-2 group-hover:translate-x-1 transition-transform' />
                  </span>
                )}
              </button>

              {wedding.deployment_status === 'published' && !deploying && (
                <button
                  onClick={() => window.open(`/${wedding.slug}`, '_blank')}
                  className='text-center text-gray-400 hover:text-white text-sm py-2 transition-colors'
                >
                  Xem thiệp online ↗
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </StudioLayout>
  )
}

export default Settings
