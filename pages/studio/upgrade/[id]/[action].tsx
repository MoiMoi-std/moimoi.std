import StudioLayout from '@/components/studio/StudioLayout'
import { useToast } from '@/components/ui/ToastProvider'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

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
  created_at: string
  templates: any[]
}

// API functions
const updatePackageAPI = async (id: number, packageData: Partial<ApiPackage>): Promise<ApiPackage | null> => {
  try {
    const response = await fetch(`/api/packages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(packageData)
    })
    const result = await response.json()
    return result.success && result.data ? result.data : null
  } catch (error) {
    console.error('Error updating package:', error)
    return null
  }
}

const getPackageById = async (id: number): Promise<ApiPackage | null> => {
  try {
    const response = await fetch(`/api/packages/${id}`)
    const result = await response.json()
    return result.success && result.data ? result.data : null
  } catch (error) {
    console.error('Error fetching package:', error)
    return null
  }
}

export default function UpgradeActionPage() {
  const router = useRouter()
  const { action, id } = router.query

  if (!router.isReady) return null

  const packageId = parseInt(id as string)

  if (action === 'edit') {
    return <EditPackagePage packageId={packageId} />
  }

  // Invalid action, redirect
  router.push('/studio/upgrade')
  return null
}

// Component: Edit Package
function EditPackagePage({ packageId }: { packageId: number }) {
  const router = useRouter()
  const { success, error } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    originalPrice: 0,
    price: 0,
    durationMonths: 12,
    maxRsvps: 100,
    featuresText: ''
  })

  useEffect(() => {
    const loadPackage = async () => {
      // Thử lấy data từ router query trước (đã có từ listing page)
      const { packageData } = router.query
      if (packageData && typeof packageData === 'string') {
        try {
          const plan = JSON.parse(packageData)
          setFormData({
            name: plan.name,
            originalPrice: plan.price,
            price: plan.discountPrice || plan.price,
            durationMonths: parseInt(plan.duration) || 12,
            maxRsvps: plan.maxRsvps || 100,
            featuresText: plan.features.join('\n')
          })
          setLoading(false)
          return
        } catch (e) {
          console.error('Parse packageData error:', e)
        }
      }

      // Fallback: Gọi API nếu không có data (user refresh/bookmark)
      const pkg = await getPackageById(packageId)
      if (pkg) {
        setFormData({
          name: pkg.name,
          originalPrice: pkg.original_price,
          price: pkg.price,
          durationMonths: pkg.duration_months,
          maxRsvps: pkg.max_rsvps,
          featuresText: pkg.features.join('\n')
        })
      } else {
        error('Không tìm thấy gói này.')
        router.push('/studio/upgrade')
      }
      setLoading(false)
    }
    loadPackage()
  }, [packageId, router.query])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      error('Vui lòng nhập tên gói.')
      return
    }

    setSaving(true)
    try {
      const features = formData.featuresText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)

      const packageData = {
        name: formData.name.trim(),
        price: formData.price || formData.originalPrice,
        original_price: formData.originalPrice,
        duration_months: formData.durationMonths,
        max_rsvps: formData.maxRsvps,
        features
      }

      const result = await updatePackageAPI(packageId, packageData)

      if (result) {
        success('Đã cập nhật gói thành công!')
        router.push('/studio/upgrade')
      } else {
        error('Không thể cập nhật gói. Vui lòng thử lại.')
      }
    } catch (e) {
      error('Có lỗi xảy ra khi cập nhật gói.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <StudioLayout>
        <div className='max-w-3xl mx-auto py-10'>
          <p className='text-center text-gray-500'>Đang tải...</p>
        </div>
      </StudioLayout>
    )
  }

  return (
    <StudioLayout>
      <div className='max-w-3xl mx-auto py-10'>
        <button
          onClick={() => router.push('/studio/upgrade')}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'
        >
          <ArrowLeft size={20} />
          Quay lại danh sách
        </button>

        <h1 className='text-3xl font-bold text-gray-900 mb-8'>Chỉnh sửa gói</h1>

        <form onSubmit={handleSubmit} className='bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6'>
          <div className='grid gap-6 md:grid-cols-2'>
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Tên gói *</label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Thời gian (tháng) *</label>
              <input
                type='number'
                min={1}
                value={formData.durationMonths}
                onChange={(e) => setFormData({ ...formData, durationMonths: parseInt(e.target.value) || 12 })}
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
              <p className='text-xs text-gray-400 mt-1'>60 = Vĩnh viễn</p>
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Giá gốc (VNĐ) *</label>
              <input
                type='number'
                min={0}
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value) || 0 })}
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Giá khuyến mãi (VNĐ)</label>
              <input
                type='number'
                min={0}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Tối đa khách mời *</label>
              <input
                type='number'
                min={0}
                value={formData.maxRsvps}
                onChange={(e) => setFormData({ ...formData, maxRsvps: parseInt(e.target.value) || 100 })}
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Tính năng (mỗi dòng 1 tính năng) *</label>
              <textarea
                rows={8}
                value={formData.featuresText}
                onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
            </div>
          </div>

          <div className='flex items-center justify-between pt-6 border-t border-gray-100'>
            <button
              type='button'
              onClick={() => router.push('/studio/upgrade')}
              className='px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50'
            >
              Hủy
            </button>
            <button
              type='submit'
              disabled={saving}
              className='flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <Save size={20} />
              {saving ? 'Đang lưu...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </StudioLayout>
  )
}
