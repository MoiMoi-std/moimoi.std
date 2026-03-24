import { Plan } from './plan-store'

// Interface cho API response
export interface ApiPackage {
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

// Hàm chuyển đổi data từ API sang format Plan
export const mapApiPackageToPlan = (pkg: ApiPackage): Plan => {
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

export const fetchPackages = async (): Promise<Plan[]> => {
  try {
    const response = await fetch('/api/packages')
    const result = await response.json()
    if (result.success && result.data) {
      return result.data.map(mapApiPackageToPlan)
    }
    // Fallback: result.data may exist without result.success
    const data: ApiPackage[] = result.data || []
    return data.filter((pkg) => pkg.is_active).map(mapApiPackageToPlan)
  } catch (error) {
    console.error('Error fetching packages:', error)
    return []
  }
}
