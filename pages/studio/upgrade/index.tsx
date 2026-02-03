import StudioEmptyState from '@/components/studio/StudioEmptyState'
import StudioLayout from '@/components/studio/StudioLayout'
import StudioLoading from '@/components/studio/StudioLoading'
import { useToast } from '@/components/ui/ToastProvider'
import { dataService } from '@/lib/data-service'
import { Plan, formatVnd, generatePlanId, getPlans, isDiscountActive, savePlans } from '@/lib/plan-store'
import { useWedding } from '@/lib/useWedding'
import { Check, Clock, CreditCard, Edit, Plus, Save, Sparkles, Trash2 } from 'lucide-react'
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
  features: string[]
  promotion_end_date: string
  is_active: boolean
  created_at: string
  templates: any[]
}

// Hàm chuyển đổi data từ API sang format Plan
const mapApiPackageToPlan = (pkg: ApiPackage): Plan => ({
  id: String(pkg.id),
  name: pkg.name,
  price: pkg.original_price || pkg.price,
  discountPrice: pkg.price < pkg.original_price ? pkg.price : undefined,
  discountEndsAt: pkg.promotion_end_date !== '2100-01-01T00:00:00+00:00' ? pkg.promotion_end_date : undefined,
  duration: pkg.duration_months >= 60 ? 'Vĩnh viễn' : `${pkg.duration_months} tháng`,
  description: `Tối đa ${pkg.max_rsvps} khách mời`,
  features: pkg.features || [],
  notIncluded: [],
  highlight: pkg.id === 7, // Gói Nâng Cao là highlight
  isActive: pkg.is_active
})

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
    return getPlans() // Fallback về localStorage nếu API lỗi
  }
}

export default function UpgradePage() {
  const router = useRouter()
  const { wedding, setWedding, loading } = useWedding()
  const [paying, setPaying] = useState(false)
  const [plans, setPlans] = useState<Plan[]>([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [isAdminMode, setIsAdminMode] = useState(false)
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

  if (plansLoading) {
    return (
      <StudioLayout>
        <StudioLoading message='Đang tải gói dịch vụ...' />
      </StudioLayout>
    )
  }

  const currentPlan = wedding?.content?.plan || ''

  const handleUpgrade = async (planId: string) => {
    if (paying) return

    // Kiểm tra wedding khi thanh toán
    if (!wedding) {
      error('Vui lòng tạo đám cưới trước khi nâng cấp gói.')
      return
    }

    setPaying(true)
    try {
      const updated = await dataService.updateWedding(wedding.id, {
        ...wedding.content,
        plan: planId,
        plan_activated_at: new Date().toISOString()
      })
      if (updated) {
        setWedding(updated)
        success('Thanh toán demo thành công! Gói dịch vụ đã được kích hoạt.')
      }
    } catch (e) {
      error('Không thể nâng cấp. Vui lòng thử lại.')
    } finally {
      setPaying(false)
    }
  }

  const updatePlan = (planId: string, patch: Partial<Plan>) => {
    setPlans((prev) => prev.map((plan) => (plan.id === planId ? { ...plan, ...patch } : plan)))
  }

  const removePlan = (planId: string) => {
    setPlans((prev) => prev.filter((plan) => plan.id !== planId))
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
          </div>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 items-start'>
          {(isAdminMode ? plans : visiblePlans).map((plan) => {
            const discountActive = isDiscountActive(plan)
            const displayPrice = discountActive && plan.discountPrice ? plan.discountPrice : plan.price
            return (
              <div
                key={plan.id}
                className={`bg-white p-8 rounded-3xl border shadow-sm relative ${
                  plan.highlight ? 'border-pink-500 shadow-xl' : 'border-gray-100'
                } ${plan.isActive === false ? 'opacity-60' : ''}`}
              >
                {plan.highlight && (
                  <div className='absolute top-0 right-0 bg-gradient-to-l from-pink-500 to-rose-500 text-white text-sm font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider'>
                    Phổ Biến Nhất
                  </div>
                )}
                <div className='mb-6'>
                  <h3 className='text-xl font-bold text-gray-900'>{plan.name}</h3>
                  <div className='mt-4 flex items-baseline gap-3 flex-wrap'>
                    <span className='text-4xl font-extrabold tracking-tight text-pink-600'>
                      {formatVnd(displayPrice)}
                    </span>
                    {discountActive && (
                      <span className='text-sm font-semibold text-gray-400 line-through opacity-70'>
                        {formatVnd(plan.price)}
                      </span>
                    )}
                  </div>
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
                <ul className='space-y-4 mb-8'>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className='flex items-center text-gray-700 font-medium'>
                      <div className='mr-3 bg-pink-100 rounded-full p-1 text-pink-600'>
                        <Check size={14} />
                      </div>
                      {feature}
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, idx) => (
                    <li key={idx} className='flex items-center text-gray-400 text-sm'>
                      <span className='mr-3 text-gray-300'>•</span>
                      <span className='line-through'>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className='space-y-3'>
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={currentPlan === plan.id || paying}
                    className='w-full py-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:scale-100'
                  >
                    {currentPlan === plan.id ? (
                      <>
                        <Check size={20} /> Đang sử dụng
                      </>
                    ) : paying ? (
                      'Đang xử lý...'
                    ) : (
                      <>
                        <CreditCard size={20} /> Thanh Toán Ngay (Demo)
                      </>
                    )}
                  </button>
                  {currentPlan !== plan.id && (
                    <div className='flex items-center justify-center gap-2 text-sm text-gray-400'>
                      <Sparkles size={14} /> Demo kích hoạt gói để test nhanh.
                    </div>
                  )}
                  <p className='text-center text-sm text-gray-400'>Hoàn tiền 100% nếu không hài lòng trong 7 ngày.</p>
                </div>

                {isAdminMode && (
                  <div className='mt-8 border-t border-gray-100 pt-6'>
                    <div className='flex flex-wrap gap-3 items-center'>
                      <button
                        onClick={() =>
                          router.push({
                            pathname: `/studio/upgrade/${plan.id}/edit`,
                            query: { packageData: JSON.stringify(plan) }
                          })
                        }
                        className='flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50'
                      >
                        <Edit size={16} />
                        Chỉnh sửa
                      </button>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm text-gray-600'>Hiển thị:</span>
                        <button
                          onClick={async () => {
                            const newStatus = !plan.isActive
                            try {
                              const response = await fetch(`/api/packages/${plan.id}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ is_active: newStatus })
                              })
                              const result = await response.json()
                              if (result.success) {
                                // Reload packages
                                const updatedPackages = await fetchPackages()
                                setPlans(updatedPackages)
                                success(newStatus ? 'Đã kích hoạt gói' : 'Đã ẩn gói')
                              } else {
                                error('Không thể thay đổi trạng thái')
                              }
                            } catch (e) {
                              error('Có lỗi xảy ra')
                            }
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            plan.isActive ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              plan.isActive ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
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
