import StudioEmptyState from '@/components/studio/StudioEmptyState'
import StudioLayout from '@/components/studio/StudioLayout'
import StudioLoading from '@/components/studio/StudioLoading'
import PlanCard from '@/components/ui/PlanCard'
import { useToast } from '@/components/ui/ToastProvider'
import { fetchPackages } from '@/lib/package-utils'
import { Plan, isDiscountActive, isPlanExpired } from '@/lib/plan-store'
import { useWedding } from '@/lib/useWedding'
import { useAdmin } from '@/lib/useAdmin'
import { AlertTriangle, Plus } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

const deletePackageAPI = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/packages/${id}`, { method: 'DELETE' })
    const result = await response.json()
    return result.success
  } catch (error) {
    console.error('Error deleting package:', error)
    return false
  }
}

export default function UpgradePage() {
  const router = useRouter()
  const { wedding, loading } = useWedding()
  const { isAdmin } = useAdmin()
  const [paying, setPaying] = useState(false)
  const [plans, setPlans] = useState<Plan[]>([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { success, error } = useToast()

  const loadPackages = async () => {
    setPlansLoading(true)
    try {
      const data = await fetchPackages()
      setPlans(data)
    } finally {
      setPlansLoading(false)
    }
  }

  useEffect(() => {
    loadPackages()
  }, [])

  const visiblePlans = useMemo(() => plans.filter((plan) => plan.isActive !== false), [plans])

  const planExpiresAt = wedding?.content?.expires_at
  const planExpired = isPlanExpired(planExpiresAt)
  const currentPlan = planExpired ? '' : wedding?.content?.plan || ''

  const currentPlanDetails = useMemo(() => {
    if (!currentPlan || !plans.length) return null
    return plans.find((p) => p.id === currentPlan)
  }, [currentPlan, plans])

  const currentPlanPrice = useMemo(() => {
    if (!currentPlanDetails) return 0
    const discountActive = isDiscountActive(currentPlanDetails)
    return discountActive && currentPlanDetails.discountPrice
      ? currentPlanDetails.discountPrice
      : currentPlanDetails.price
  }, [currentPlanDetails])

  if (loading || plansLoading) {
    return (
      <StudioLayout>
        <StudioLoading message='Đang tải gói dịch vụ...' />
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

  const handleUpgrade = async (plan: Plan) => {
    if (paying) return
    setPaying(true)
    try {
      const discountActive = isDiscountActive(plan)
      let finalPrice = discountActive && plan.discountPrice ? plan.discountPrice : plan.price
      if (currentPlanDetails && currentPlanPrice > 0) {
        finalPrice = Math.max(0, finalPrice - currentPlanPrice)
      }

      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          planName: plan.name,
          amount: finalPrice,
          weddingId: wedding.id
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Lỗi tạo thanh toán')
      window.location.href = data.paymentUrl
    } catch (e: any) {
      error(e.message || 'Không thể tạo thanh toán. Vui lòng thử lại.')
      setPaying(false)
    }
  }

  const handleEdit = (plan: Plan) => {
    router.push({
      pathname: `/studio/upgrade/${plan.id}/edit`,
      query: { packageData: JSON.stringify(plan) }
    })
  }

  const handleDelete = async (plan: Plan) => {
    if (deleting) return
    if (!confirm('Bạn có chắc muốn xóa gói này?')) return

    setDeleting(true)
    try {
      const result = await deletePackageAPI(parseInt(plan.id))
      if (!result) throw new Error('Không thể xóa gói')
      success('Đã xóa gói thành công!')
      await loadPackages()
    } catch (err: any) {
      console.error('Delete package error:', err)
      error(err.message || 'Không thể xóa gói. Vui lòng thử lại.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <StudioLayout fullWidth={true}>
      <div className='max-w-[1400px] mx-auto py-10 px-6 md:px-10 lg:px-16'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-serif font-bold text-gray-900 mb-4'>Nâng Cấp Gói Dịch Vụ</h1>
          <p className='text-gray-500 text-lg'>Mở khóa toàn bộ tính năng cao cấp cho đám cưới của bạn</p>
        </div>

        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-xl font-bold text-gray-900'>Danh sách gói</h2>
          <div className='flex items-center gap-4'>
            {isAdminMode && (
              <button
                onClick={() => router.push('/studio/upgrade/add')}
                className='flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700'
              >
                <Plus size={18} />
                Tạo gói mới
              </button>
            )}
            {isAdmin && (
              <label className='flex items-center gap-3 text-sm font-semibold text-gray-600'>
                <span>Chế độ quản trị</span>
                <button
                  type='button'
                  onClick={() => setIsAdminMode((prev) => !prev)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                    isAdminMode ? 'bg-pink-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                      isAdminMode ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            )}
          </div>
        </div>

        {/* Expired plan warning banner */}
        {planExpired && wedding?.content?.plan && (
          <div className='mb-8 flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800'>
            <AlertTriangle size={20} className='mt-0.5 shrink-0 text-amber-500' />
            <div>
              <p className='font-bold text-sm'>Gói dịch vụ của bạn đã hết hạn</p>
              <p className='text-sm mt-0.5'>
                Gói đã hết hạn vào{' '}
                <span className='font-semibold'>
                  {new Date(planExpiresAt!).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                . Vui lòng chọn một gói bên dưới để tiếp tục sử dụng dịch vụ.
              </p>
            </div>
          </div>
        )}

        <div className='grid md:grid-cols-2 lg:grid-cols-2 gap-8'>
          {(isAdminMode ? plans : visiblePlans).map((plan) => {
            const discountActive = isDiscountActive(plan)
            const displayPrice = discountActive && plan.discountPrice ? plan.discountPrice : plan.price
            const isExpiredPlan = planExpired && wedding?.content?.plan === plan.id
            const isCurrentPlan = currentPlan === plan.id
            const isLowerThanCurrent = !!(currentPlanDetails && displayPrice <= currentPlanPrice)

            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                currentPlanPrice={currentPlanPrice}
                isCurrentPlan={isCurrentPlan}
                isLowerThanCurrent={isLowerThanCurrent}
                isExpiredPlan={isExpiredPlan}
                paying={paying}
                onAction={handleUpgrade}
                isAdminMode={isAdminMode}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deleting={deleting}
              />
            )
          })}
        </div>
      </div>
    </StudioLayout>
  )
}
