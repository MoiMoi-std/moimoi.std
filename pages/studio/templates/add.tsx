import StudioLayout from '@/components/studio/StudioLayout'
import { useToast } from '@/components/ui/ToastProvider'
import { ArrowLeft, Save } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface Package {
  id: number
  name: string
  price: number
  original_price: number
  duration_months: number
  is_active: boolean
}

export default function AddTemplatePage() {
  const router = useRouter()
  const { success, error } = useToast()
  const [loading, setLoading] = useState(false)
  const [packages, setPackages] = useState<Package[]>([])
  const [formData, setFormData] = useState({
    name: '',
    repo_branch: '',
    thumbnail_url: '',
    is_active: true,
    package_ids: [] as number[]
  })

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const response = await fetch('/api/packages')
        if (response.ok) {
          const result = await response.json()
          setPackages(result.data || [])
        }
      } catch (err) {
        console.error('Load packages error:', err)
      }
    }
    loadPackages()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to create template')
      }

      success('Tạo template thành công!')
      router.push('/studio/templates?admin=1')
    } catch (err) {
      error('Không thể tạo template. Vui lòng thử lại.')
      console.error('Create template error:', err)
    } finally {
      setLoading(false)
    }
  }

  const togglePackage = (pkgId: number) => {
    setFormData((prev) => {
      const ids = new Set(prev.package_ids)
      if (ids.has(pkgId)) {
        ids.delete(pkgId)
      } else {
        ids.add(pkgId)
      }
      return { ...prev, package_ids: Array.from(ids) }
    })
  }

  return (
    <StudioLayout>
      <div className='max-w-4xl mx-auto'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>

        <div className='bg-white rounded-3xl border border-gray-100 shadow-sm p-8'>
          <h1 className='text-2xl font-bold text-gray-900 mb-6'>Thêm Template Mới</h1>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Tên Template *</label>
              <input
                type='text'
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className='w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100'
                placeholder='VD: Mẫu Vintage Hoa'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Repo Branch *</label>
              <input
                type='text'
                required
                value={formData.repo_branch}
                onChange={(e) => setFormData({ ...formData, repo_branch: e.target.value })}
                className='w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100'
                placeholder='VD: theme-vintage'
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-2'>Thumbnail URL</label>
              <input
                type='url'
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                className='w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100'
                placeholder='https://...'
              />
            </div>

            <div>
              <label className='flex items-center gap-3'>
                <input
                  type='checkbox'
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className='w-5 h-5 accent-pink-500'
                />
                <span className='text-sm font-bold text-gray-700'>Hiển thị template</span>
              </label>
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-3'>Gói áp dụng</label>
              <div className='grid grid-cols-2 gap-3'>
                {packages.map((pkg) => {
                  const checked = formData.package_ids.includes(pkg.id)
                  return (
                    <label
                      key={pkg.id}
                      className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                        checked
                          ? 'border-pink-300 bg-pink-50'
                          : 'border-gray-200 bg-white hover:border-pink-200'
                      }`}
                    >
                      <input
                        type='checkbox'
                        checked={checked}
                        onChange={() => togglePackage(pkg.id)}
                        className='w-5 h-5 accent-pink-500'
                      />
                      <div className='flex-1'>
                        <div className='font-bold text-gray-900'>{pkg.name}</div>
                        <div className='text-xs text-gray-500'>{pkg.price.toLocaleString('vi-VN')}đ</div>
                      </div>
                    </label>
                  )
                })}
              </div>
              <p className='mt-2 text-sm text-gray-500'>Không chọn gói nào = áp dụng cho tất cả gói</p>
            </div>

            <div className='flex gap-3 pt-4'>
              <button
                type='button'
                onClick={() => router.back()}
                className='flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50'
              >
                Hủy
              </button>
              <button
                type='submit'
                disabled={loading}
                className='flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50'
              >
                <Save size={20} />
                {loading ? 'Đang lưu...' : 'Tạo Template'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </StudioLayout>
  )
}
