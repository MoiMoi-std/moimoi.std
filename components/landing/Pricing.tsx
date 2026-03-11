import { Plan, formatVnd } from '@/lib/plan-store'
import { Check, Clock, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

interface ApiPackage {
  id: number
  name: string
  price: number
  original_price: number
  duration_months: number
  description?: string
  features?: string[]
  is_active: boolean
}

export default function Pricing() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

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
        const mappedPlans: Plan[] = packages
          .filter((pkg) => pkg.is_active)
          .map((pkg) => {
            // Parse features if it's a JSON string
            let features: string[] = []
            if (Array.isArray(pkg.features)) {
              features = pkg.features
            } else if (typeof pkg.features === 'string') {
              try {
                features = JSON.parse(pkg.features)
              } catch {
                features = []
              }
            }

            // Fallback to default features if empty
            if (features.length === 0) {
              features = [
                'Thiết kế thiệp cưới online',
                'Quản lý danh sách khách mời',
                'Thu thập xác nhận tham dự',
                'Hỗ trợ kỹ thuật 24/7'
              ]
            }

            const hasDiscount = pkg.original_price != null && pkg.original_price > pkg.price
            return {
              id: pkg.id.toString(),
              name: pkg.name,
              price: hasDiscount ? pkg.original_price : pkg.price,
              discountPrice: hasDiscount ? pkg.price : undefined,
              duration: `${pkg.duration_months} tháng`,
              description: pkg.description || 'Gói dịch vụ thiệp cưới trực tuyến',
              features: features,
              notIncluded: [],
              isActive: pkg.is_active,
              highlight: false // Có thể thêm logic để highlight package nào đó
            }
          })

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
            const hasDiscount = plan.discountPrice && plan.discountPrice < plan.price
            const displayPrice = hasDiscount ? plan.discountPrice : plan.price
            const originalPrice = hasDiscount ? plan.price : plan.discountPrice

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
                <div className='mb-2 min-h-[4.5rem]'>
                  <span className='text-4xl font-bold text-pink-600'>{formatVnd(displayPrice || 0)}</span>
                  {hasDiscount && originalPrice && (
                    <div className='mt-1 text-xs text-gray-400 line-through'>{formatVnd(originalPrice)}</div>
                  )}
                </div>
                {plan.duration && (
                  <div className='mb-2 text-sm font-semibold text-gray-500'>Thời gian: {plan.duration}</div>
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
