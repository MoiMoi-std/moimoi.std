import { Plan, formatVnd, isDiscountActive, isPlanExpired } from '@/lib/plan-store'
import { useWedding } from '@/lib/useWedding'
import { Check, Clock, X, Sparkles } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

interface ApiPackage {
  id: number
  name: string
  price: number
  original_price: number
  duration_months: number
  max_rsvps: number
  features: any
  promotion_end_date: string
  is_active: boolean
  created_at: string
  templates: any[]
}

const mapApiPackageToPlan = (pkg: ApiPackage): Plan => {
  let featuresArray: string[] = []
  let notIncludedArray: string[] = []
  let highlight = false
  let description = `Tối đa ${pkg.max_rsvps || 0} khách mời`

  if (pkg.features && typeof pkg.features === 'object' && !Array.isArray(pkg.features)) {
    const featureData = pkg.features as any
    featuresArray = Array.isArray(featureData.features) ? featureData.features : []
    notIncludedArray = Array.isArray(featureData.notIncluded) ? featureData.notIncluded : []
    highlight = featureData.highlight || false
    description = featureData.description || description
  } else if (Array.isArray(pkg.features)) {
    featuresArray = pkg.features
  } else if (typeof pkg.features === 'string') {
    try {
      const parsed = JSON.parse(pkg.features)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        featuresArray = Array.isArray(parsed.features) ? parsed.features : []
        notIncludedArray = Array.isArray(parsed.notIncluded) ? parsed.notIncluded : []
        highlight = parsed.highlight || false
        description = parsed.description || description
      } else if (Array.isArray(parsed)) {
        featuresArray = parsed
      }
    } catch {
      // ignore
    }
  }

  if (featuresArray.length === 0) {
    featuresArray = [
      'Thiết kế thiệp cưới online',
      'Quản lý danh sách khách mời',
      'Thu thập xác nhận tham dự',
      'Hỗ trợ kỹ thuật 24/7'
    ]
  }

  return {
    id: String(pkg.id),
    name: pkg.name,
    price: pkg.original_price || pkg.price,
    discountPrice: pkg.price < pkg.original_price ? pkg.price : undefined,
    discountEndsAt:
      pkg.promotion_end_date && pkg.promotion_end_date !== '2100-01-01T00:00:00+00:00'
        ? pkg.promotion_end_date
        : undefined,
    duration: pkg.duration_months >= 60 ? 'Vĩnh viễn' : `${pkg.duration_months} tháng`,
    description: description,
    features: featuresArray,
    notIncluded: notIncludedArray,
    highlight: highlight,
    isActive: pkg.is_active,
    maxRsvps: pkg.max_rsvps
  }
}

export default function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const { wedding } = useWedding()
  const router = useRouter()

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/api/packages')
        if (!response.ok) {
          console.error('Failed to fetch packages')
          return
        }
        const result = await response.json()
        const packages: ApiPackage[] = result.data || []

        // Map API data to Plan format
        const mappedPlans: Plan[] = packages.filter((pkg) => pkg.is_active).map(mapApiPackageToPlan)

        setPlans(mappedPlans)
      } catch (error) {
        console.error('Error fetching packages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  const visiblePlans = useMemo(() => {
    return plans.filter((plan) => plan.isActive !== false)
  }, [plans])

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

  if (loading) {
    return (
      <section id='pricing' className='py-20 bg-gray-50'>
        <div className='container px-4 mx-auto'>
          <div className='mb-16 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-gray-900 md:text-4xl'>Bảng Giá Dịch Vụ</h2>
            <p className='max-w-2xl mx-auto text-gray-600'>Đang tải...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id='pricing' className='py-20 bg-gray-50'>
      <div className='container px-4 mx-auto'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-gray-900 md:text-4xl'>Bảng Giá Dịch Vụ</h2>
          <p className='max-w-2xl mx-auto text-gray-600'>
            MoiMoi giúp bạn thong dong<br></br>
            Giá mềm như bún, hài lòng khách qua
          </p>
        </div>

        <div className='flex flex-wrap justify-center items-stretch gap-5 mx-auto max-w-7xl'>
          {visiblePlans.map((plan) => {
            const hasDiscount = isDiscountActive(plan) && plan.discountPrice && plan.discountPrice < plan.price
            const displayPrice = hasDiscount ? plan.discountPrice! : plan.price

            const isCurrentPlan = currentPlan === plan.id
            const isLowerThanCurrent = currentPlanDetails && displayPrice <= currentPlanPrice

            let upgradePrice = displayPrice
            let showUpgradePrice = false
            if (currentPlanDetails && !isCurrentPlan && !isLowerThanCurrent && currentPlanPrice > 0) {
              upgradePrice = Math.max(0, displayPrice - currentPlanPrice)
              showUpgradePrice = true
            }

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 w-full sm:w-72 lg:w-64 xl:w-72 ${
                  plan.highlight
                    ? 'bg-white border-2 border-pink-500 shadow-xl scale-105 z-10'
                    : 'bg-white border border-gray-100 hover:shadow-lg'
                }`}
              >
                {plan.highlight && (
                  <div className='absolute top-0 px-4 py-1 text-sm font-bold text-white -translate-x-1/2 -translate-y-1/2 bg-pink-600 rounded-full left-1/2'>
                    Khuyên Dùng
                  </div>
                )}

                {/khuyến mãi/i.test(plan.name) && (
                  <span className='absolute top-8 right-6 text-[10px] font-semibold text-pink-600 bg-pink-50 border border-pink-200 rounded-full px-1.5 py-0.5 whitespace-nowrap'>
                    Khuyến mãi
                  </span>
                )}

                <div className='mb-2'>
                  <h3 className='text-xl font-bold text-gray-900 pr-16'>
                    {plan.name.replace(/\s*[–-]\s*Khuyến Mãi/i, '').replace(/\s*Khuyến Mãi/i, '')}
                  </h3>
                </div>
                <div className='mb-2 min-h-[4.5rem] flex flex-col justify-center'>
                  {showUpgradePrice ? (
                    <>
                      <div className='flex flex-col items-baseline gap-2'>
                        <span className='text-4xl font-bold text-pink-600'>{formatVnd(upgradePrice || 0)}</span>
                        <span className='text-sm text-gray-400 line-through opacity-70'>{formatVnd(displayPrice)}</span>
                      </div>
                      <div className='mt-2 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full inline-flex items-center gap-1 w-fit'>
                        <Sparkles size={12} /> Đã giảm {formatVnd(currentPlanPrice)} từ gói hiện tại
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='flex flex-col items-baseline gap-2'>
                        <span className='text-4xl font-bold text-pink-600'>{formatVnd(displayPrice || 0)}</span>
                        {hasDiscount && (
                          <span className='text-sm text-gray-400 line-through opacity-70'>{formatVnd(plan.price)}</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
                {plan.duration && (
                  <div className='mb-2 text-sm font-semibold text-gray-500'>Thời gian: {plan.duration}</div>
                )}
                <p className='mb-6 text-sm text-gray-500'>{plan.description}</p>

                <button
                  onClick={() => router.push('/studio/upgrade')}
                  disabled={isCurrentPlan || !!isLowerThanCurrent}
                  className={`w-full py-3 rounded-xl font-bold mb-8 transition flex items-center justify-center gap-2 ${
                    isCurrentPlan || isLowerThanCurrent
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : plan.highlight
                        ? 'bg-pink-600 text-white hover:bg-pink-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {isCurrentPlan ? (
                    <>
                      <Check size={18} /> Đang sử dụng
                    </>
                  ) : isLowerThanCurrent ? (
                    'Bạn đã sở hữu gói hiện tại hoặc cao hơn'
                  ) : showUpgradePrice ? (
                    'Nâng cấp ngay'
                  ) : (
                    'Chọn Gói Này'
                  )}
                </button>

                <div className='space-y-4 mt-auto'>
                  {Array.isArray(plan.features) &&
                    plan.features.map((feature, i) => (
                      <div key={i} className='flex items-start gap-3 text-sm text-gray-700'>
                        <Check className='w-5 h-5 text-green-500 shrink-0' />
                        <span>{feature}</span>
                      </div>
                    ))}
                  {Array.isArray(plan.notIncluded) &&
                    plan.notIncluded.map((feature, i) => (
                      <div key={i} className='flex items-start gap-3 text-sm text-gray-400'>
                        <X className='w-5 h-5 text-gray-300 shrink-0' />
                        <span className='line-through'>{feature}</span>
                      </div>
                    ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
