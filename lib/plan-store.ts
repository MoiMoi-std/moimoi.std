export type Plan = {
  id: string
  name: string
  price: number
  duration?: string
  description: string
  features: string[]
  notIncluded: string[]
  highlight?: boolean
  isActive?: boolean
  discountPrice?: number
  discountEndsAt?: string
}

const STORAGE_KEY = 'moimoi_plans_v1'
const FOREVER_DISCOUNT_ENDS_AT = '2099-12-31T23:59:59.999Z'

const DEFAULT_PLANS: Plan[] = [
  {
    id: 'student',
    name: 'Sinh Viên',
    price: 250000,
    duration: '6 tháng',
    description: 'Ưu đãi cho lễ tốt nghiệp, sinh nhật và đám cưới nhỏ',
    features: ['5 Mẫu thiệp cơ bản', 'Giới hạn 50 khách mời RSVP', 'Lưu trữ trong 6 tháng', 'Có logo MoiMoi Studio'],
    notIncluded: ['Nhạc nền', 'Bản đồ chỉ đường', 'QR Mừng cưới', 'Hiệu ứng mở thiệp'],
    highlight: false,
    isActive: true,
    discountPrice: 150000,
    discountEndsAt: FOREVER_DISCOUNT_ENDS_AT
  },
  {
    id: 'basic',
    name: 'Gói Cơ Bản',
    price: 800000,
    duration: '2 năm',
    description: 'Đầy đủ tính năng cần thiết cho một đám cưới.',
    features: [
      'Kho 20+ mẫu thiệp Premium',
      'Giới hạn 100 khách mời RSVP',
      'Không giới hạn khách RSVP',
      'Tích hợp Bản đồ & QR Mừng cưới',
      'Nhạc nền tùy chọn',
      'Lưu trữ 2 năm'
    ],
    notIncluded: ['Hỗ trợ thay đổi thiết kế'],
    highlight: true,
    isActive: true,
    discountPrice: 500000,
    discountEndsAt: FOREVER_DISCOUNT_ENDS_AT
  },
  {
    id: 'advanced',
    name: 'Gói Nâng Cao',
    price: 999000,
    duration: '3 năm',
    description: 'Tùy chỉnh nâng cao, thể hiện phong cách riêng của bạn.',
    features: [
      'Mọi tính năng của Gói Cơ Bản',
      'Giới hạn 250 khách mời RSVP',
      'Hỗ trợ thay đổi thiết kế (màu sắc, font chữ)',
      'Hiệu ứng mở thiệp độc đáo',
      'Lưu trữ 3 năm'
    ],
    notIncluded: ['Sở hữu slug tùy chọn', 'Hỗ trợ setup 1-1', 'Thiết kế theo yêu cầu'],
    highlight: false,
    isActive: true,
    discountPrice: 699000,
    discountEndsAt: FOREVER_DISCOUNT_ENDS_AT
  },
  {
    id: 'premium',
    name: 'Gói Cao Cấp',
    price: 1699000,
    duration: '5 năm',
    description: 'Sự hoàn hảo và hỗ trợ tận răng từ đội ngũ.',
    features: [
      'Mọi tính năng của Gói Cơ Bản & Nâng cao',
      'Giới hạn 500 khách mời RSVP',
      'Thiết kế thiệp theo yêu cầu',
      'Sở hữu slug tùy chọn (moimoi.io.vn/yourname)',
      'Tùy chỉnh màu sắc/font chữ theo yêu cầu',
      'Chuyên viên hỗ trợ setup 1-1',
      'Lưu trữ 5 năm'
    ],
    notIncluded: [],
    highlight: false,
    isActive: true,
    discountPrice: 1299000,
    discountEndsAt: FOREVER_DISCOUNT_ENDS_AT
  }
]

const clonePlans = (plans: Plan[]) =>
  plans.map((plan) => ({
    ...plan,
    features: [...plan.features],
    notIncluded: [...plan.notIncluded]
  }))

export const getDefaultPlans = () => clonePlans(DEFAULT_PLANS)

export const getPlans = (): Plan[] => {
  if (typeof window === 'undefined') {
    return getDefaultPlans()
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return getDefaultPlans()
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return getDefaultPlans()
    return clonePlans(parsed)
  } catch (err) {
    return getDefaultPlans()
  }
}

export const savePlans = (plans: Plan[]) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
}

export const formatVnd = (price: number) => {
  return `${price.toLocaleString('vi-VN')}đ`
}

export const isDiscountActive = (plan: Plan) => {
  if (!plan.discountPrice || !plan.discountEndsAt) return false
  return new Date(plan.discountEndsAt).getTime() > Date.now()
}

export const generatePlanId = (name: string) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
