import StudioEmptyState from '@/components/studio/StudioEmptyState'
import StudioLayout from '@/components/studio/StudioLayout'
import StudioLoading from '@/components/studio/StudioLoading'
import { useToast } from '@/components/ui/ToastProvider'
import { dataService } from '@/lib/data-service'
import { Plan, formatVnd, generatePlanId, getPlans, isDiscountActive, savePlans } from '@/lib/plan-store'
import { useWedding } from '@/lib/useWedding'
import { Check, Clock, CreditCard, Save, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export default function UpgradePage() {
  const { wedding, setWedding, loading } = useWedding()
  const [paying, setPaying] = useState(false)
  const [plans, setPlans] = useState<Plan[]>([])
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [newPlanName, setNewPlanName] = useState('')
  const [newPlanPrice, setNewPlanPrice] = useState(0)
  const [newPlanDuration, setNewPlanDuration] = useState('')
  const [newPlanDescription, setNewPlanDescription] = useState('')
  const [newPlanFeaturesText, setNewPlanFeaturesText] = useState('')
  const [newPlanNotIncludedText, setNewPlanNotIncludedText] = useState('')
  const { success, error } = useToast()

  useEffect(() => {
    setPlans(getPlans())
  }, [])

  useEffect(() => {
    if (plans.length > 0) {
      savePlans(plans)
    }
  }, [plans])

  const visiblePlans = useMemo(() => plans.filter((plan) => plan.isActive !== false), [plans])

  if (loading) {
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

  const currentPlan = wedding.content?.plan || ''

  const handleUpgrade = async (planId: string) => {
    if (paying) return
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

  const addPlan = () => {
    if (!newPlanName.trim()) {
      error('Vui lòng nhập tên gói.')
      return
    }
    const id = generatePlanId(newPlanName)
    const newPlan: Plan = {
      id,
      name: newPlanName.trim(),
      price: newPlanPrice,
      duration: newPlanDuration.trim() || undefined,
      description: newPlanDescription.trim() || 'Mô tả gói mới.',
      features: newPlanFeaturesText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      notIncluded: newPlanNotIncludedText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      highlight: false,
      isActive: true
    }
    setPlans((prev) => [newPlan, ...prev])
    setNewPlanName('')
    setNewPlanPrice(0)
    setNewPlanDuration('')
    setNewPlanDescription('')
    setNewPlanFeaturesText('')
    setNewPlanNotIncludedText('')
    success('Đã tạo gói mới (mock).')
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

        {isAdminMode && (
          <div className='bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-10'>
            <div className='grid gap-4 md:grid-cols-[1fr_200px_200px_160px]'>
              <input
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                placeholder='Tên gói mới'
                className='rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
              <input
                type='number'
                min={0}
                value={newPlanPrice}
                onChange={(e) => setNewPlanPrice(parseInt(e.target.value) || 0)}
                placeholder='Giá'
                className='rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
              <input
                value={newPlanDuration}
                onChange={(e) => setNewPlanDuration(e.target.value)}
                placeholder='Thời gian (vd: 6 tháng, vĩnh viễn)'
                className='rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
              <button onClick={addPlan} className='rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700 px-4'>
                Tạo gói
              </button>
            </div>
            <div className='grid gap-4 mt-4'>
              <input
                value={newPlanDescription}
                onChange={(e) => setNewPlanDescription(e.target.value)}
                placeholder='Mô tả ngắn'
                className='rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
              <div className='grid gap-4 md:grid-cols-2'>
                <textarea
                  rows={4}
                  value={newPlanFeaturesText}
                  onChange={(e) => setNewPlanFeaturesText(e.target.value)}
                  placeholder='Chi tiết gói (mỗi dòng)'
                  className='rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200'
                />
                <textarea
                  rows={4}
                  value={newPlanNotIncludedText}
                  onChange={(e) => setNewPlanNotIncludedText(e.target.value)}
                  placeholder='Không bao gồm (mỗi dòng)'
                  className='rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200'
                />
              </div>
            </div>
            <p className='mt-3 text-sm text-gray-400'>
              Thay đổi sẽ lưu vào localStorage để đồng bộ giữa landing và studio.
            </p>
          </div>
        )}

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
                  <div className='mt-8 border-t border-gray-100 pt-6 space-y-4 text-sm'>
                    <div className='flex flex-wrap gap-3'>
                      <button
                        onClick={() => updatePlan(plan.id, { isActive: !plan.isActive })}
                        className='px-3 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50'
                      >
                        {plan.isActive === false ? 'Hiện gói' : 'Ẩn gói'}
                      </button>
                      <button
                        onClick={() => updatePlan(plan.id, { highlight: !plan.highlight })}
                        className='px-3 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50'
                      >
                        {plan.highlight ? 'Bỏ nổi bật' : 'Đánh dấu nổi bật'}
                      </button>
                      <button
                        onClick={() => removePlan(plan.id)}
                        className='px-3 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700'
                      >
                        Xóa gói
                      </button>
                    </div>
                    <div className='grid gap-3 md:grid-cols-3'>
                      <label className='flex flex-col gap-2'>
                        <span className='text-sm font-bold text-gray-500 uppercase'>Tên gói</span>
                        <input
                          value={plan.name}
                          onChange={(e) => updatePlan(plan.id, { name: e.target.value })}
                          className='rounded-xl border border-gray-200 px-3 py-2 text-sm'
                        />
                      </label>
                      <label className='flex flex-col gap-2'>
                        <span className='text-sm font-bold text-gray-500 uppercase'>Giá</span>
                        <input
                          type='number'
                          min={0}
                          value={plan.price}
                          onChange={(e) => updatePlan(plan.id, { price: parseInt(e.target.value) || 0 })}
                          className='rounded-xl border border-gray-200 px-3 py-2 text-sm'
                        />
                      </label>
                      <label className='flex flex-col gap-2'>
                        <span className='text-sm font-bold text-gray-500 uppercase'>Thời gian</span>
                        <input
                          value={plan.duration || ''}
                          onChange={(e) => updatePlan(plan.id, { duration: e.target.value || undefined })}
                          className='rounded-xl border border-gray-200 px-3 py-2 text-sm'
                        />
                      </label>
                    </div>
                    <label className='flex flex-col gap-2'>
                      <span className='text-sm font-bold text-gray-500 uppercase'>Mô tả</span>
                      <input
                        value={plan.description}
                        onChange={(e) => updatePlan(plan.id, { description: e.target.value })}
                        className='rounded-xl border border-gray-200 px-3 py-2 text-sm'
                      />
                    </label>
                    <div className='grid gap-3 md:grid-cols-2'>
                      <label className='flex flex-col gap-2'>
                        <span className='text-sm font-bold text-gray-500 uppercase'>Giảm giá</span>
                        <input
                          type='number'
                          min={0}
                          value={plan.discountPrice || 0}
                          onChange={(e) => updatePlan(plan.id, { discountPrice: parseInt(e.target.value) || 0 })}
                          className='rounded-xl border border-gray-200 px-3 py-2 text-sm'
                        />
                      </label>
                      <label className='flex flex-col gap-2'>
                        <span className='text-sm font-bold text-gray-500 uppercase'>Hết hạn ưu đãi</span>
                        <input
                          type='datetime-local'
                          value={plan.discountEndsAt ? plan.discountEndsAt.slice(0, 16) : ''}
                          onChange={(e) =>
                            updatePlan(plan.id, {
                              discountEndsAt: e.target.value ? new Date(e.target.value).toISOString() : undefined
                            })
                          }
                          className='rounded-xl border border-gray-200 px-3 py-2 text-sm'
                        />
                      </label>
                    </div>
                    <div className='grid gap-3 md:grid-cols-2'>
                      <label className='flex flex-col gap-2'>
                        <span className='text-sm font-bold text-gray-500 uppercase'>Tính năng (mỗi dòng)</span>
                        <textarea
                          rows={4}
                          value={plan.features.join('\n')}
                          onChange={(e) =>
                            updatePlan(plan.id, {
                              features: e.target.value
                                .split('\n')
                                .map((item) => item.trim())
                                .filter(Boolean)
                            })
                          }
                          className='rounded-xl border border-gray-200 px-3 py-2 text-sm'
                        />
                      </label>
                      <label className='flex flex-col gap-2'>
                        <span className='text-sm font-bold text-gray-500 uppercase'>Không bao gồm (mỗi dòng)</span>
                        <textarea
                          rows={4}
                          value={plan.notIncluded.join('\n')}
                          onChange={(e) =>
                            updatePlan(plan.id, {
                              notIncluded: e.target.value
                                .split('\n')
                                .map((item) => item.trim())
                                .filter(Boolean)
                            })
                          }
                          className='rounded-xl border border-gray-200 px-3 py-2 text-sm'
                        />
                      </label>
                    </div>
                    <button
                      onClick={() => savePlans(plans)}
                      className='inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800'
                    >
                      <Save size={16} /> Lưu thay đổi
                    </button>
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
