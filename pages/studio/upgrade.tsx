import StudioEmptyState from '@/components/studio/StudioEmptyState'
import StudioLayout from '@/components/studio/StudioLayout'
import StudioLoading from '@/components/studio/StudioLoading'
import { useToast } from '@/components/ui/ToastProvider'
import { dataService } from '@/lib/data-service'
import { Plan, formatVnd, isDiscountActive, isPlanExpired } from '@/lib/plan-store'
import { useWedding } from '@/lib/useWedding'
import { useAdmin } from '@/lib/useAdmin'
import { AlertTriangle, Check, Clock, CreditCard, Edit, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

// Interface cho API response
interface ApiPackage {
  id: number
  name: string
  price: number
  original_price: number
  duration_months: number
  max_rsvps: number
  features: any // Can be string[] or object with structure
  promotion_end_date: string
  is_active: boolean
  created_at: string
  templates: any[]
}

// Hàm chuyển đổi data từ API sang format Plan
const mapApiPackageToPlan = (pkg: ApiPackage): Plan => {
  // Check if features is new format (object) or old format (array)
  let featuresArray: string[] = []
  let notIncludedArray: string[] = []
  let highlight = false
  let description = `Tối đa ${pkg.max_rsvps} khách mời`

  if (pkg.features && typeof pkg.features === 'object' && !Array.isArray(pkg.features)) {
    // New format: features is an object with structure
    const featureData = pkg.features as any
    featuresArray = Array.isArray(featureData.features) ? featureData.features : []
    notIncludedArray = Array.isArray(featureData.notIncluded) ? featureData.notIncluded : []
    highlight = featureData.highlight || false
    description = featureData.description || description
  } else if (Array.isArray(pkg.features)) {
    // Old format: features is simple array
    featuresArray = pkg.features
  }

  return {
    id: String(pkg.id),
    name: pkg.name,
    price: pkg.original_price || pkg.price,
    discountPrice: pkg.price < pkg.original_price ? pkg.price : undefined,
    discountEndsAt: pkg.promotion_end_date !== '2100-01-01T00:00:00+00:00' ? pkg.promotion_end_date : undefined,
    duration: pkg.duration_months >= 60 ? 'Vĩnh viễn' : `${pkg.duration_months} tháng`,
    description: description,
    features: featuresArray,
    notIncluded: notIncludedArray,
    highlight: highlight,
    isActive: pkg.is_active,
    maxRsvps: pkg.max_rsvps
  }
}

const fetchPackages = async (): Promise<Plan[]> => {
  try {
    const response = await fetch('/api/packages')
    const result = await response.json()

    if (result.success && result.data) {
      return result.data.map(mapApiPackageToPlan)
    }
    return []
  } catch (error) {
    console.error('Error fetching packages:', error)
    return []
  }
}

const deletePackageAPI = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`/api/packages/${id}`, {
      method: 'DELETE'
    })
    const result = await response.json()
    return result.success
  } catch (error) {
    console.error('Error deleting package:', error)
    return false
  }
}

export default function UpgradePage() {
  const router = useRouter()
  const { wedding, setWedding, loading } = useWedding()
  const { isAdmin } = useAdmin()
  const [paying, setPaying] = useState(false)
  const [plans, setPlans] = useState<Plan[]>([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { success, error } = useToast()

  useEffect(() => {
    const loadPackages = async () => {
      setPlansLoading(true)
      try {
        const data = await fetchPackages()
        setPlans(data)
      } finally {
        setPlansLoading(false)
      }
    }
    loadPackages()
  }, [])

  const visiblePlans = useMemo(() => plans.filter((plan) => plan.isActive !== false), [plans])

  // Get current plan and calculate prices (must be before any return statements)
  const planExpiresAt = wedding?.content?.expires_at
  const planExpired = isPlanExpired(planExpiresAt)
  // If plan is expired, treat as no active plan
  const currentPlan = planExpired ? '' : wedding?.content?.plan || ''

  // Find current plan details
  const currentPlanDetails = useMemo(() => {
    if (!currentPlan || !plans.length) return null
    return plans.find((p) => p.id === currentPlan)
  }, [currentPlan, plans])

  // Get the actual price to pay for current plan (considering discount)
  const getCurrentPlanPrice = useMemo(() => {
    if (!currentPlanDetails) return 0
    const discountActive = isDiscountActive(currentPlanDetails)
    return discountActive && currentPlanDetails.discountPrice
      ? currentPlanDetails.discountPrice
      : currentPlanDetails.price
  }, [currentPlanDetails])

  const currentPlanPrice = getCurrentPlanPrice

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

      // Deduct current plan price if user already has a plan
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

      // Redirect to VNPay payment page
      window.location.href = data.paymentUrl
    } catch (e: any) {
      error(e.message || 'Không thể tạo thanh toán. Vui lòng thử lại.')
      setPaying(false)
    }
  }

  const removePlan = async (packageId: number) => {
    if (deleting) return

    // Xác nhận trước khi xóa
    if (!confirm(`Bạn có chắc muốn xóa gói này?`)) {
      return
    }

    setDeleting(true)
    try {
      const result = await deletePackageAPI(packageId)

      if (!result) {
        throw new Error('Không thể xóa gói')
      }

      success('Đã xóa gói thành công!')

      // Reload packages from database
      const updatedPlans = await fetchPackages()
      setPlans(updatedPlans)
    } catch (err: any) {
      console.error('Delete package error:', err)
      error(err.message || 'Không thể xóa gói. Vui lòng thử lại.')
    } finally {
      setDeleting(false)
    }
  }

  const handleEdit = (plan: Plan) => {
    // Chuyển đến trang edit
    router.push({
      pathname: `/studio/upgrade/${plan.id}/edit`,
      query: { packageData: JSON.stringify(plan) }
    })
  }

  return (
    <StudioLayout>
      <div className='max-w-5xl mx-auto py-10'>
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

        <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8'>
          {(isAdminMode ? plans : visiblePlans).map((plan) => {
            const discountActive = isDiscountActive(plan)
            let displayPrice = discountActive && plan.discountPrice ? plan.discountPrice : plan.price

            // Check if this was the user's expired plan
            const isExpiredPlan = planExpired && wedding?.content?.plan === plan.id
            // Check if this plan is lower than current plan
            const isLowerThanCurrent = currentPlanDetails && displayPrice <= currentPlanPrice
            const isCurrentPlan = currentPlan === plan.id

            // Calculate upgrade price (deduct current plan price)
            let upgradePrice = displayPrice
            let showUpgradePrice = false
            if (currentPlanDetails && !isCurrentPlan && !isLowerThanCurrent && currentPlanPrice > 0) {
              upgradePrice = Math.max(0, displayPrice - currentPlanPrice)
              showUpgradePrice = true
            }

            return (
              <div
                key={plan.id}
                className={`bg-white p-8 rounded-3xl border shadow-sm relative flex flex-col ${
                  plan.highlight ? 'border-pink-500 shadow-xl' : 'border-gray-100'
                } ${plan.isActive === false ? 'opacity-60' : ''} ${isExpiredPlan ? 'border-amber-300' : ''}`}
              >
                {plan.highlight && (
                  <div className='absolute top-0 right-0 bg-gradient-to-l from-pink-500 to-rose-500 text-white text-sm font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider'>
                    Phổ Biến Nhất
                  </div>
                )}
                {isExpiredPlan && (
                  <div className='absolute top-0 left-0 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-sm font-bold px-4 py-1 rounded-br-xl uppercase tracking-wider flex items-center gap-1'>
                    <AlertTriangle size={13} /> Đã Hết Hạn
                  </div>
                )}
                <div className='mb-6'>
                  <h3 className='text-xl font-bold text-gray-900'>{plan.name}</h3>
                  <div className='mt-4 flex items-baseline gap-3 flex-wrap'>
                    {showUpgradePrice ? (
                      <>
                        <span className='text-4xl font-extrabold tracking-tight text-pink-600'>
                          {formatVnd(upgradePrice)}
                        </span>
                        <span className='text-sm font-semibold text-gray-400 line-through opacity-70'>
                          {formatVnd(displayPrice)}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className='text-4xl font-extrabold tracking-tight text-pink-600'>
                          {formatVnd(displayPrice)}
                        </span>
                        {discountActive && (
                          <span className='text-sm font-semibold text-gray-400 line-through opacity-70'>
                            {formatVnd(plan.price)}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {showUpgradePrice && (
                    <div className='mt-2 text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full inline-flex items-center gap-1'>
                      <Sparkles size={14} /> Đã giảm {formatVnd(currentPlanPrice)} từ gói hiện tại
                    </div>
                  )}
                  {plan.duration && (
                    <div className='mt-2 text-sm font-semibold text-gray-500'>Thời gian: {plan.duration}</div>
                  )}
                  {discountActive && plan.discountEndsAt && (
                    <div className='mt-3 inline-flex items-center gap-2 text-sm font-semibold text-pink-600 bg-pink-50 px-3 py-1 rounded-full'>
                      <Clock size={14} /> Ưu đãi đến {new Date(plan.discountEndsAt).toLocaleDateString('vi-VN')}
                    </div>
                  )}
                  <p className='mt-4 text-gray-500'>{plan.description}</p>
                </div>
                <ul className='space-y-4 mb-8 flex-1'>
                  {Array.isArray(plan.features) && plan.features.length > 0 ? (
                    plan.features.map((feature, idx) => (
                      <li key={idx} className='flex items-center text-gray-700 font-medium'>
                        <div className='mr-3 bg-pink-100 rounded-full p-1 text-pink-600'>
                          <Check size={14} />
                        </div>
                        {feature}
                      </li>
                    ))
                  ) : (
                    <li className='text-gray-400 text-sm italic'>Chưa có tính năng nào</li>
                  )}
                  {Array.isArray(plan.notIncluded) &&
                    plan.notIncluded.map((feature, idx) => (
                      <li key={idx} className='flex items-center text-gray-400 text-sm'>
                        <span className='mr-3 text-gray-300'>•</span>
                        <span className='line-through'>{feature}</span>
                      </li>
                    ))}
                </ul>

                <div className='space-y-3'>
                  <button
                    onClick={() => handleUpgrade(plan)}
                    disabled={isCurrentPlan || isLowerThanCurrent || paying}
                    className='w-full py-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed'
                  >
                    {isCurrentPlan ? (
                      <>
                        <Check size={20} /> Đang sử dụng
                      </>
                    ) : isLowerThanCurrent ? (
                      'Bạn đã sở hữu gói cao hơn'
                    ) : paying ? (
                      'Đang chuyển đến VNPay...'
                    ) : (
                      <>
                        <CreditCard size={20} /> {showUpgradePrice ? 'Nâng cấp' : 'Thanh Toán qua VNPay'}
                      </>
                    )}
                  </button>
                  <p className='text-center text-sm text-gray-400'>Hoàn tiền 100% nếu không hài lòng trong 7 ngày.</p>
                </div>

                {isAdminMode && (
                  <div className='mt-8 border-t border-gray-100 pt-6 space-y-4 text-sm'>
                    <div className='flex flex-wrap gap-3'>
                      <button
                        onClick={() => handleEdit(plan)}
                        className='px-3 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 flex items-center gap-2'
                      >
                        <Edit size={16} /> Sửa
                      </button>
                      <button
                        onClick={() => removePlan(parseInt(plan.id))}
                        disabled={deleting}
                        className='px-3 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2'
                      >
                        <Trash2 size={16} /> {deleting ? 'Đang xóa...' : 'Xóa'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </StudioLayout>
  )
}
