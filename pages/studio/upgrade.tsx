import StudioEmptyState from '@/components/studio/StudioEmptyState'
import StudioLayout from '@/components/studio/StudioLayout'
import StudioLoading from '@/components/studio/StudioLoading'
import { useToast } from '@/components/ui/ToastProvider'
import { dataService } from '@/lib/data-service'
import { Plan, formatVnd, generatePlanId, isDiscountActive } from '@/lib/plan-store'
import { useWedding } from '@/lib/useWedding'
import { Check, Clock, CreditCard, Save, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export default function UpgradePage() {
  const { wedding, setWedding, loading } = useWedding()
  const [paying, setPaying] = useState(false)
  const [plans, setPlans] = useState<Plan[]>([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [newPlanName, setNewPlanName] = useState('')
  const [newPlanPrice, setNewPlanPrice] = useState(0)
  const [newPlanDuration, setNewPlanDuration] = useState('')
  const [newPlanDescription, setNewPlanDescription] = useState('')
  const [newPlanFeaturesText, setNewPlanFeaturesText] = useState('')
  const [newPlanNotIncludedText, setNewPlanNotIncludedText] = useState('')
  const [saving, setSaving] = useState(false)
  const { success, error } = useToast()

  useEffect(() => {
    fetch('/api/get-packages')
      .then((r) => r.json())
      .then((data) => {
        if (data.plans && data.plans.length > 0) {
          setPlans(data.plans)
        }
      })
      .catch((err) => {
        console.error('Failed to load packages from DB:', err)
      })
      .finally(() => setPlansLoading(false))
  }, [])

  const visiblePlans = useMemo(() => plans.filter((plan) => plan.isActive !== false), [plans])

  // Get current plan and calculate prices (must be before any return statements)
  const currentPlan = wedding?.content?.plan || ''
  
  // Find current plan details
  const currentPlanDetails = useMemo(() => {
    if (!currentPlan || !plans.length) return null
    return plans.find(p => p.id === currentPlan)
  }, [currentPlan, plans])

  // Get the actual price to pay for current plan (considering discount)
  const getCurrentPlanPrice = useMemo(() => {
    if (!currentPlanDetails) return 0
    const discountActive = isDiscountActive(currentPlanDetails)
    return discountActive && currentPlanDetails.discountPrice ? currentPlanDetails.discountPrice : currentPlanDetails.price
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

  const updatePlan = (planId: string, patch: Partial<Plan>) => {
    setPlans((prev) => prev.map((plan) => (plan.id === planId ? { ...plan, ...patch } : plan)))
  }

  const removePlan = async (planId: string) => {
    if (saving) return
    
    // Xác nhận trước khi xóa
    if (!confirm(`Bạn có chắc muốn xóa gói này?`)) {
      return
    }

    setSaving(true)
    try {
      // Lọc bỏ gói cần xóa
      const updatedPlans = plans.filter((plan) => plan.id !== planId)
      
      // Lưu vào database
      const res = await fetch('/api/save-packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plans: updatedPlans })
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.details) {
          console.error('Failed to delete package:', data.details)
        }
        throw new Error(data.error || 'Không thể xóa gói')
      }

      success('Đã xóa gói thành công!')

      // Reload packages from database
      const refreshRes = await fetch('/api/get-packages')
      const refreshData = await refreshRes.json()
      if (refreshData.plans && refreshData.plans.length > 0) {
        setPlans(refreshData.plans)
      }
    } catch (err: any) {
      console.error('Delete package error:', err)
      error(err.message || 'Không thể xóa gói. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  const addPlan = async () => {
    if (!newPlanName.trim()) {
      error('Vui lòng nhập tên gói.')
      return
    }
    
    if (saving) return
    setSaving(true)

    try {
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

      // Lưu vào database ngay
      const res = await fetch('/api/save-packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plans: [...plans, newPlan] })
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.details) {
          console.error('Failed to create package:', data.details)
        }
        throw new Error(data.error || 'Không thể tạo gói mới')
      }

      success('Đã tạo và lưu gói mới vào database thành công!')

      // Reset form
      setNewPlanName('')
      setNewPlanPrice(0)
      setNewPlanDuration('')
      setNewPlanDescription('')
      setNewPlanFeaturesText('')
      setNewPlanNotIncludedText('')

      // Reload packages from database
      const refreshRes = await fetch('/api/get-packages')
      const refreshData = await refreshRes.json()
      if (refreshData.plans && refreshData.plans.length > 0) {
        setPlans(refreshData.plans)
      }
    } catch (err: any) {
      console.error('Create package error:', err)
      error(err.message || 'Không thể tạo gói mới. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  const togglePlanProperty = async (planId: string, property: 'isActive' | 'highlight') => {
    if (saving) return

    setSaving(true)
    try {
      // Cập nhật state local trước
      const updatedPlans = plans.map((plan) =>
        plan.id === planId ? { ...plan, [property]: !plan[property] } : plan
      )
      setPlans(updatedPlans)

      // Lưu vào database
      const res = await fetch('/api/save-packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plans: updatedPlans })
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.details) {
          console.error('Failed to update package:', data.details)
        }
        throw new Error(data.error || 'Không thể cập nhật gói')
      }

      const propertyName = property === 'isActive' ? 'trạng thái' : 'đánh dấu nổi bật'
      success(`Đã cập nhật ${propertyName} thành công!`)

      // Reload packages from database
      const refreshRes = await fetch('/api/get-packages')
      const refreshData = await refreshRes.json()
      if (refreshData.plans && refreshData.plans.length > 0) {
        setPlans(refreshData.plans)
      }
    } catch (err: any) {
      console.error('Toggle property error:', err)
      error(err.message || 'Không thể cập nhật. Vui lòng thử lại.')
      // Revert state on error
      const refreshRes = await fetch('/api/get-packages')
      const refreshData = await refreshRes.json()
      if (refreshData.plans && refreshData.plans.length > 0) {
        setPlans(refreshData.plans)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleSaveChanges = async () => {
    if (saving) return
    setSaving(true)
    try {
      const res = await fetch('/api/save-packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plans })
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.details) {
          console.error('Failed packages details:', data.details)
        }
        throw new Error(data.error || 'Không thể lưu packages')
      }

      success('Đã lưu tất cả thay đổi vào database thành công!')
      
      // Reload packages from database
      const refreshRes = await fetch('/api/get-packages')
      const refreshData = await refreshRes.json()
      if (refreshData.plans && refreshData.plans.length > 0) {
        setPlans(refreshData.plans)
      }
    } catch (err: any) {
      console.error('Save error:', err)
      error(err.message || 'Không thể lưu thay đổi. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
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
              <button 
                onClick={addPlan} 
                disabled={saving}
                className='rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700 px-4 disabled:opacity-60 disabled:cursor-not-allowed'
              >
                {saving ? 'Đang tạo...' : 'Tạo gói'}
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
            let displayPrice = discountActive && plan.discountPrice ? plan.discountPrice : plan.price
            
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
                        onClick={() => togglePlanProperty(plan.id, 'isActive')}
                        disabled={saving}
                        className='px-3 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed'
                      >
                        {plan.isActive === false ? 'Hiện gói' : 'Ẩn gói'}
                      </button>
                      <button
                        onClick={() => togglePlanProperty(plan.id, 'highlight')}
                        disabled={saving}
                        className='px-3 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed'
                      >
                        {plan.highlight ? 'Bỏ nổi bật' : 'Đánh dấu nổi bật'}
                      </button>
                      <button
                        onClick={() => removePlan(plan.id)}
                        disabled={saving}
                        className='px-3 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed'
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
                      onClick={handleSaveChanges}
                      disabled={saving}
                      className='inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed'
                    >
                      <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
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
