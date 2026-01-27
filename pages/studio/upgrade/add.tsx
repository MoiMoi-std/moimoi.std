import StudioLayout from '@/components/studio/StudioLayout'
import { useToast } from '@/components/ui/ToastProvider'
import { ArrowLeft, Save } from 'lucide-react'
import { useRouter } from 'next/router'
import { useState } from 'react'

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

// API function
const createPackageAPI = async (packageData: {
  name: string
  price: number
  original_price: number
  duration_months: number
  max_rsvps: number
  features: string[]
}): Promise<ApiPackage | null> => {
  try {
    const response = await fetch('/api/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(packageData)
    })
    const result = await response.json()
    return result.success && result.data ? result.data : null
  } catch (error) {
    console.error('Error creating package:', error)
    return null
  }
}

export default function AddPackagePage() {
  const router = useRouter()
  const { success, error } = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    originalPrice: 0,
    price: 0,
    durationText: '',
    maxRsvps: 100,
    featuresText: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      error('Vui lòng nhập tên gói.')
      return
    }
    if (formData.originalPrice <= 0) {
      error('Vui lòng nhập giá gốc.')
      return
    }

    setSaving(true)
    try {
      const features = formData.featuresText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)

      let durationMonths = 12
      if (formData.durationText.toLowerCase().includes('vĩnh viễn')) {
        durationMonths = 60
      } else {
        const match = formData.durationText.match(/\d+/)
        if (match) {
          durationMonths = parseInt(match[0])
        }
      }

      const packageData = {
        name: formData.name.trim(),
        price: formData.price || formData.originalPrice,
        original_price: formData.originalPrice,
        duration_months: durationMonths,
        max_rsvps: formData.maxRsvps,
        features
      }

      const result = await createPackageAPI(packageData)

      if (result) {
        success('Đã tạo gói mới thành công!')
        router.push('/studio/upgrade')
      } else {
        error('Không thể tạo gói. Vui lòng thử lại.')
      }
    } catch (e) {
      error('Có lỗi xảy ra khi tạo gói.')
    } finally {
      setSaving(false)
    }
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

        <h1 className='text-3xl font-bold text-gray-900 mb-8'>Tạo gói mới</h1>

        <form onSubmit={handleSubmit} className='bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6'>
          <div className='grid gap-6 md:grid-cols-2'>
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Tên gói *</label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder='Vd: Gói Premium'
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Thời gian *</label>
              <input
                type='text'
                value={formData.durationText}
                onChange={(e) => setFormData({ ...formData, durationText: e.target.value })}
                placeholder='Vd: 12 tháng hoặc Vĩnh viễn'
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Giá gốc (VNĐ) *</label>
              <input
                type='number'
                min={0}
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value) || 0 })}
                placeholder='999000'
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
                placeholder='0 nếu không có khuyến mãi'
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
                placeholder='100'
                className='w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-200'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Tính năng (mỗi dòng 1 tính năng) *</label>
              <textarea
                rows={8}
                value={formData.featuresText}
                onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                placeholder='Tất cả mẫu thiệp&#10;Không giới hạn khách mời&#10;Tích hợp bản đồ&#10;...'
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
              {saving ? 'Đang lưu...' : 'Tạo gói'}
            </button>
          </div>
        </form>
      </div>
    </StudioLayout>
  )
}
