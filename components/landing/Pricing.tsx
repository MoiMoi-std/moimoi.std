import { fetchPackages } from '@/lib/package-utils'
import { Plan, isDiscountActive, isPlanExpired } from '@/lib/plan-store'
import PlanCard from '@/components/ui/PlanCard'
import { useWedding } from '@/lib/useWedding'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

export default function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const { wedding } = useWedding()
  const router = useRouter()

  useEffect(() => {
    fetchPackages()
      .then((data) => setPlans(data))
      .finally(() => setLoading(false))
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
            MoiMoi giúp bạn thong dong<br />
            Giá mềm như bún, hài lòng khách qua
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-2 gap-8 mx-auto max-w-4xl'>
          {visiblePlans.map((plan) => {
            const discountActive = isDiscountActive(plan)
            const displayPrice = discountActive && plan.discountPrice ? plan.discountPrice : plan.price
            const isCurrentPlan = currentPlan === plan.id
            const isLowerThanCurrent = !!(currentPlanDetails && displayPrice <= currentPlanPrice)

            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                currentPlanPrice={currentPlanPrice}
                isCurrentPlan={isCurrentPlan}
                isLowerThanCurrent={isLowerThanCurrent}
                onAction={() => router.push('/studio/upgrade')}
                actionLabel={
                  isCurrentPlan
                    ? undefined
                    : isLowerThanCurrent
                    ? 'Bạn đã sở hữu gói hiện tại hoặc cao hơn'
                    : undefined
                }
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
