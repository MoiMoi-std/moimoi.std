import { Plan, formatVnd, isDiscountActive } from '@/lib/plan-store'
import { AlertTriangle, Check, Clock, CreditCard, Edit, Sparkles, Trash2 } from 'lucide-react'

interface PlanCardProps {
  plan: Plan
  currentPlanPrice?: number
  isCurrentPlan?: boolean
  isLowerThanCurrent?: boolean
  isExpiredPlan?: boolean
  paying?: boolean
  onAction: (plan: Plan) => void
  /** Override label cho CTA button */
  actionLabel?: string
  isAdminMode?: boolean
  onEdit?: (plan: Plan) => void
  onDelete?: (plan: Plan) => void
  deleting?: boolean
}

export default function PlanCard({
  plan,
  currentPlanPrice = 0,
  isCurrentPlan = false,
  isLowerThanCurrent = false,
  isExpiredPlan = false,
  paying = false,
  onAction,
  actionLabel,
  isAdminMode = false,
  onEdit,
  onDelete,
  deleting = false
}: PlanCardProps) {
  const discountActive = isDiscountActive(plan)
  const displayPrice = discountActive && plan.discountPrice ? plan.discountPrice : plan.price

  // Tính upgrade price nếu user đang có gói hiện tại
  let upgradePrice = displayPrice
  let showUpgradePrice = false
  if (currentPlanPrice > 0 && !isCurrentPlan && !isLowerThanCurrent) {
    upgradePrice = Math.max(0, displayPrice - currentPlanPrice)
    showUpgradePrice = true
  }

  const isDisabled = isCurrentPlan || !!isLowerThanCurrent || paying || displayPrice === 0

  const buttonLabel = (() => {
    if (actionLabel) return actionLabel
    if (isCurrentPlan) return <><Check size={20} /> Đang sử dụng</>
    if (isLowerThanCurrent) return 'Bạn đã sở hữu gói cao hơn'
    if (paying) return 'Đang chuyển đến VNPay...'
    if (displayPrice === 0) return <><Check size={20} /> Đã sở hữu</>
    return <><CreditCard size={20} /> {showUpgradePrice ? 'Nâng cấp' : 'Thanh Toán qua VNPay'}</>
  })()

  return (
    <div
      className={`bg-white p-8 rounded-3xl border shadow-sm relative flex flex-col ${
        plan.highlight ? 'border-pink-500 shadow-xl' : 'border-gray-100'
      } ${plan.isActive === false ? 'opacity-60' : ''} ${isExpiredPlan ? 'border-amber-300' : ''}`}
    >
      {/* Badge "Phổ Biến Nhất" – ribbon góc trên phải */}
      {plan.highlight && (
        <div className='absolute top-0 right-0 bg-gradient-to-l from-pink-500 to-rose-500 text-white text-sm font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider'>
          Phổ Biến Nhất
        </div>
      )}

      {/* Badge gói đã hết hạn */}
      {isExpiredPlan && (
        <div className='absolute top-0 left-0 bg-gradient-to-r from-amber-500 to-orange-400 text-white text-sm font-bold px-4 py-1 rounded-br-xl uppercase tracking-wider flex items-center gap-1'>
          <AlertTriangle size={13} /> Đã Hết Hạn
        </div>
      )}

      {/* Thông tin gói */}
      <div className='mb-6'>
        <h3 className='text-xl font-bold text-gray-900'>{plan.name}</h3>

        {/* Giá */}
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

        {/* Đã giảm từ gói hiện tại */}
        {showUpgradePrice && (
          <div className='mt-2 text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full inline-flex items-center gap-1'>
            <Sparkles size={14} /> Đã giảm {formatVnd(currentPlanPrice)} từ gói hiện tại
          </div>
        )}

        {/* Thời gian sử dụng */}
        {plan.duration && (
          <div className='mt-2 text-sm font-semibold text-gray-500'>Thời gian: {plan.duration}</div>
        )}

        {/* Ưu đãi có thời hạn */}
        {discountActive && plan.discountEndsAt && (
          <div className='mt-3 inline-flex items-center gap-2 text-sm font-semibold text-pink-600 bg-pink-50 px-3 py-1 rounded-full'>
            <Clock size={14} /> Ưu đãi đến {new Date(plan.discountEndsAt).toLocaleDateString('vi-VN')}
          </div>
        )}

        <p className='mt-4 text-gray-500'>{plan.description}</p>
      </div>

      {/* Danh sách tính năng */}
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

      {/* CTA Button */}
      <div className='space-y-3'>
        <button
          onClick={() => onAction(plan)}
          disabled={isDisabled}
          className='w-full py-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed'
        >
          {buttonLabel}
        </button>
      </div>

      {/* Admin controls */}
      {isAdminMode && (
        <div className='mt-8 border-t border-gray-100 pt-6 space-y-4 text-sm'>
          <div className='flex flex-wrap gap-3'>
            {onEdit && (
              <button
                onClick={() => onEdit(plan)}
                className='px-3 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 flex items-center gap-2'
              >
                <Edit size={16} /> Sửa
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(plan)}
                disabled={deleting}
                className='px-3 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2'
              >
                <Trash2 size={16} /> {deleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
