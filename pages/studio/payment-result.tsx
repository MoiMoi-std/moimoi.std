import StudioLayout from '@/components/studio/StudioLayout'
import StudioLoading from '@/components/studio/StudioLoading'
import { formatVnd, getPlans } from '@/lib/plan-store'
import { useWedding } from '@/lib/useWedding'
import { CheckCircle, XCircle, ArrowLeft, Home } from 'lucide-react'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

export default function PaymentResultPage() {
  const router = useRouter()
  const { status, plan, orderId, transactionNo, amount, message, code } = router.query as Record<string, string>
  const { loading } = useWedding()

  const plans = useMemo(() => getPlans(), [])
  const planInfo = useMemo(() => plans.find((p) => p.id === plan), [plans, plan])

  if (loading) {
    return (
      <StudioLayout>
        <StudioLoading message='Đang xử lý kết quả thanh toán...' />
      </StudioLayout>
    )
  }

  const isSuccess = status === 'success'
  const displayAmount = amount ? formatVnd(parseInt(amount) / 100) : ''

  return (
    <StudioLayout>
      <div className='max-w-lg mx-auto py-20 text-center'>
        {/* Icon */}
        <div
          className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 ${
            isSuccess ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          {isSuccess ? (
            <CheckCircle size={48} className='text-green-600' />
          ) : (
            <XCircle size={48} className='text-red-500' />
          )}
        </div>

        {/* Title */}
        <h1 className={`text-3xl font-bold mb-4 ${isSuccess ? 'text-green-700' : 'text-red-600'}`}>
          {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
        </h1>

        {/* Description */}
        {isSuccess ? (
          <div className='space-y-3'>
            {planInfo && (
              <p className='text-lg text-gray-700'>
                Gói <span className='font-bold text-pink-600'>{planInfo.name}</span> đã được kích hoạt
              </p>
            )}
            {displayAmount && (
              <p className='text-gray-500'>
                Số tiền: <span className='font-semibold'>{displayAmount}</span>
              </p>
            )}
            {transactionNo && <p className='text-sm text-gray-400'>Mã giao dịch VNPay: {transactionNo}</p>}
            {orderId && <p className='text-sm text-gray-400'>Mã đơn hàng: {orderId.slice(0, 8)}...</p>}
            <div className='bg-green-50 border border-green-200 rounded-2xl p-4 mt-4'>
              <p className='text-green-700 font-semibold'>✅ Gói dịch vụ đã được kích hoạt thành công!</p>
            </div>
          </div>
        ) : (
          <div className='space-y-3'>
            <p className='text-gray-500'>{message || 'Giao dịch không thể hoàn tất. Vui lòng thử lại.'}</p>
            {code && code !== 'unknown' && <p className='text-sm text-gray-400'>Mã lỗi: {code}</p>}
          </div>
        )}

        {/* Actions */}
        <div className='mt-10 space-y-4'>
          {isSuccess ? (
            <button
              onClick={() => router.push('/studio')}
              className='w-full py-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2'
            >
              <Home size={20} />
              Về trang quản lý
            </button>
          ) : (
            <button
              onClick={() => router.push('/studio/upgrade')}
              className='w-full py-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2'
            >
              <ArrowLeft size={20} />
              Quay lại trang nâng cấp
            </button>
          )}
        </div>
      </div>
    </StudioLayout>
  )
}
