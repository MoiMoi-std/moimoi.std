import { Plan, formatVnd, getPlans, isDiscountActive } from '@/lib/plan-store'
import { Check, Clock, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export default function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([])

  useEffect(() => {
    setPlans(getPlans())
  }, [])

  const visiblePlans = useMemo(() => {
    return plans.filter((plan) => plan.isActive !== false)
  }, [plans])

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

        <div className='grid max-w-7xl gap-8 mx-auto md:grid-cols-2 lg:grid-cols-4'>
          {visiblePlans.map((plan) => {
            const discountActive = isDiscountActive(plan)
            const displayPrice = discountActive && plan.discountPrice ? plan.discountPrice : plan.price
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
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

                <h3 className='mb-2 text-xl font-bold text-gray-900'>{plan.name}</h3>
                <div className='mb-2 text-4xl font-bold text-pink-600'>{formatVnd(displayPrice)}</div>
                {plan.duration && (
                  <div className='mb-2 text-sm font-semibold text-gray-500'>Thời gian: {plan.duration}</div>
                )}
                {discountActive && (
                  <div className='text-xs text-gray-400 line-through mb-1 opacity-70'>{formatVnd(plan.price)}</div>
                )}
                {discountActive && plan.discountEndsAt && (
                  <div className='inline-flex items-center gap-2 text-xs font-semibold text-pink-600 bg-pink-50 px-3 py-1 rounded-full mb-3'>
                    <Clock size={14} /> Ưu đãi đến {new Date(plan.discountEndsAt).toLocaleDateString('vi-VN')}
                  </div>
                )}
                <p className='mb-6 text-sm text-gray-500'>{plan.description}</p>

                <button
                  className={`w-full py-3 rounded-xl font-bold mb-8 transition ${
                    plan.highlight
                      ? 'bg-pink-600 text-white hover:bg-pink-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Chọn Gói Này
                </button>

                <div className='space-y-4'>
                  {plan.features.map((feature, i) => (
                    <div key={i} className='flex items-start gap-3 text-sm text-gray-700'>
                      <Check className='w-5 h-5 text-green-500 shrink-0' />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, i) => (
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
