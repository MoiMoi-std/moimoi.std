import Pagination from '@/components/common/Pagination'
import StudioLayout from '@/components/studio/StudioLayout'
import StudioLoading from '@/components/studio/StudioLoading'
import { useToast } from '@/components/ui/ToastProvider'
import { dataService, Template } from '@/lib/data-service'
import { useWedding } from '@/lib/useWedding'
import { Check, Eye, LayoutTemplate, Search, Sparkles } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

type TemplateAdminMeta = {
  is_active: boolean
  price: number
  allowed_plans: string[]
  sort_order: number
  tags?: any[]
}

const DEFAULT_META: TemplateAdminMeta = {
  is_active: true,
  price: 0,
  allowed_plans: [],
  sort_order: 0
}

const formatPrice = (price: number) => {
  if (!price) return 'Miễn phí'
  return `${price.toLocaleString('vi-VN')}đ`
}

export default function TemplatesPage() {
  const router = useRouter()
  const { wedding, setWedding, loading } = useWedding()
  const [templates, setTemplates] = useState<Template[]>([])
  const [templateMeta, setTemplateMeta] = useState<Record<number, TemplateAdminMeta>>({})
  const [selectedStyle, setSelectedStyle] = useState('all')
  const [loadingTemplates, setLoadingTemplates] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [ownershipFilter, setOwnershipFilter] = useState<'all' | 'mine'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9
  const { toast, success, error } = useToast()

  // Derived from wedding join — user's currently active package
  const userPackageId = (wedding as any)?.package?.id as number | null | undefined
  const userPackageName = (wedding as any)?.package?.name as string | undefined

  useEffect(() => {
    const loadTemplates = async () => {
      setLoadingTemplates(true)
      try {
        const response = await fetch('/api/templates')
        if (!response.ok) {
          error('Không thể tải danh sách templates')
          setLoadingTemplates(false)
          return
        }
        const result = await response.json()
        const data = result.success && result.data ? result.data : []

        setTemplates(data)
        setTemplateMeta((prev) => {
          const next = { ...prev }
          data.forEach((template: any, index: number) => {
            if (!next[template.id]) {
              // Extract packages info from API response
              const packages = template.packages || []
              const allowed_plans = packages.map((pkg: any) => pkg.name)
              const price = packages.length > 0 ? packages[0].price : 0

              next[template.id] = {
                ...DEFAULT_META,
                is_active: template.is_active !== undefined ? template.is_active : true,
                sort_order: index + 1,
                price: price,
                allowed_plans: allowed_plans,
                tags: template.tags || []
              }
            }
          })
          return next
        })
      } catch (err) {
        error('Lỗi khi tải templates')
        console.error('Load templates error:', err)
      } finally {
        setLoadingTemplates(false)
      }
    }
    loadTemplates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const templatesWithMeta = useMemo(() => {
    return templates.map((template) => ({
      ...template,
      meta: templateMeta[template.id] || DEFAULT_META
    }))
  }, [templates, templateMeta])

  const filteredTemplates = useMemo(() => {
    let data = templatesWithMeta.filter((template) => template.meta.is_active)

    if (selectedStyle !== 'all') {
      const keyword = selectedStyle.toLowerCase()
      data = data.filter((template) => template.name.toLowerCase().includes(keyword))
    }

    if (searchTerm.trim()) {
      const keyword = searchTerm.toLowerCase()
      data = data.filter((template) => {
        return template.name.toLowerCase().includes(keyword)
      })
    }

    return data.sort((a, b) => a.meta.sort_order - b.meta.sort_order)
  }, [templatesWithMeta, searchTerm, selectedStyle])

  const pagedTemplates = useMemo(() => {
    let owned = filteredTemplates
    if (ownershipFilter === 'mine') {
      owned = filteredTemplates.filter((t) => {
        const pkgs: any[] = (t as any).packages || []
        if (pkgs.length === 0) return true // free templates belong to everyone
        if (!userPackageId) return false
        return pkgs.some((p: any) => p.id === userPackageId)
      })
    }
    const start = (currentPage - 1) * itemsPerPage
    return owned.slice(start, start + itemsPerPage)
  }, [currentPage, filteredTemplates, itemsPerPage, ownershipFilter, userPackageId])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStyle, ownershipFilter])

  if (loadingTemplates) {
    return (
      <StudioLayout>
        <StudioLoading message='Đang tải thư viện mẫu...' />
      </StudioLayout>
    )
  }

  const applyTemplate = async (templateId: number) => {
    try {
      if (wedding) {
        await dataService.updateWeddingTemplate(wedding.id, templateId)
        const tpl = templates.find((t) => t.id === templateId) as any
        setWedding({
          ...wedding,
          template_id: templateId,
          template: tpl
            ? { id: tpl.id, name: tpl.name, repo_branch: tpl.repo_branch, thumbnail_url: tpl.thumbnail_url }
            : wedding.template
        })
        success('Đã áp dụng mẫu thiệp!')
      }
    } catch (e) {
      error('Không thể áp dụng mẫu. Vui lòng thử lại.')
    }
  }

  // Returns true if user can apply this template
  // (free template = no packages attached, OR user's package is in the allowed list)
  const canUseTemplate = (templateId: number): boolean => {
    const tpl = templates.find((t) => t.id === templateId) as any
    if (!tpl) return false
    const pkgs: any[] = tpl.packages || []
    if (pkgs.length === 0) return true // free template — accessible by all
    if (!userPackageId) return false
    return pkgs.some((p: any) => p.id === userPackageId)
  }

  const previewTemplate = (templateId: number) => {
    const tpl = templates.find((t) => t.id === templateId)
    const branch = (tpl as any)?.repo_branch || 'default'
    window.open(`/studio/templates/preview/${encodeURIComponent(branch)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <StudioLayout>
      <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-3xl font-serif font-bold text-gray-900'>Kho Giao Diện</h1>
          <p className='text-gray-500'>Chọn mẫu thiệp phù hợp với phong cách của bạn</p>
        </div>
      </div>

      <div className='mt-6 flex flex-wrap items-center gap-3'>
        <div className='relative'>
          <Search size={16} className='absolute left-3 top-2.5 text-gray-400' />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Tìm mẫu theo tên hoặc tag...'
            className='pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100'
          />
        </div>
        <div className='flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2'>
          <LayoutTemplate size={16} className='text-gray-400' />
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className='text-sm font-medium text-gray-700 focus:outline-none'
          >
            <option value='all'>Tất cả</option>
            <option value='vintage'>Vintage</option>
            <option value='modern'>Modern</option>
            <option value='minimal'>Minimal</option>
          </select>
        </div>
        {/* Ownership filter */}
        <div className='flex gap-1 bg-gray-100 rounded-xl p-1'>
          <button
            onClick={() => setOwnershipFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              ownershipFilter === 'all' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setOwnershipFilter('mine')}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              ownershipFilter === 'mine' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Gói của tôi
            {userPackageName && (
              <span className='ml-1.5 px-1.5 py-0.5 bg-pink-100 text-pink-600 rounded-full text-xs'>
                {userPackageName}
              </span>
            )}
          </button>
        </div>
        <button
          onClick={() => toast('Bộ lọc demo dựa theo tên mẫu', 'info')}
          className='px-4 py-2 bg-pink-50 text-pink-600 rounded-xl text-sm font-bold'
        >
          Mẹo chọn mẫu
        </button>
      </div>

      <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {pagedTemplates.map((template) => {
          const meta = template.meta
          const isActive = wedding?.template_id === template.id
          const hasPlanLimit = meta.allowed_plans.length > 0
          return (
            <div
              key={template.id}
              className='bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow'
            >
              <div className='aspect-[4/3] bg-gray-100'>
                {template.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={template.thumbnail_url} alt={template.name} className='w-full h-full object-cover' />
                ) : (
                  <div className='h-full w-full flex items-center justify-center text-gray-400 text-sm'>
                    Chưa có ảnh mẫu
                  </div>
                )}
              </div>
              <div className='p-5 space-y-3'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-bold text-gray-900'>{template.name}</h3>
                  {isActive && (
                    <span className='inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full'>
                      <Check size={12} /> Đang dùng
                    </span>
                  )}
                </div>
                {/* <p className='text-sm text-gray-500'>Gợi ý phong cách: {template.repo_branch}</p> */}
                <div className='flex flex-wrap gap-2 text-sm'>
                  <span className='px-2 py-1 rounded-full bg-gray-100 text-gray-600'>
                    Gói giá: {formatPrice(meta.price)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full ${
                      hasPlanLimit ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                    }`}
                  >
                    {hasPlanLimit ? `Gói: ${meta.allowed_plans.join(', ')}` : 'Tất cả gói'}
                  </span>
                </div>
                {/* Preview template button */}
                <button
                  onClick={() => previewTemplate(template.id)}
                  className='w-full py-2.5 bg-gradient-to-r from-violet-600 to-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg shadow-blue-200 transition-all hover:scale-[1.01] active:scale-[0.99]'
                >
                  <Eye size={16} /> Xem trước
                </button>

                {/* Apply / Upgrade / Active button */}
                {!canUseTemplate(template.id) ? (
                  // User doesn't own the required plan
                  <div>
                    <button
                      onClick={() => router.push('/studio/upgrade')}
                      className='w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg shadow-amber-200 hover:scale-[1.01] active:scale-[0.99] transition-all'
                    >
                      ⚡ Nâng cấp gói
                    </button>
                    <p className='mt-2 text-xs text-center text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2'>
                      Bạn cần nâng cấp gói để sử dụng mẫu này
                      {meta.allowed_plans.length > 0 && (
                        <>
                          <br />
                          <span className='font-semibold'>{meta.allowed_plans.join(', ')}</span>
                        </>
                      )}
                    </p>
                  </div>
                ) : (
                  <button
                    disabled={isActive}
                    onClick={() => !isActive && applyTemplate(template.id)}
                    className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      isActive
                        ? 'bg-green-50 text-green-600 border-2 border-green-200 cursor-default'
                        : 'bg-gradient-to-r from-pink-600 to-rose-500 text-white hover:shadow-lg shadow-pink-200 hover:scale-[1.01] active:scale-[0.99]'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Check size={16} /> Đang áp dụng
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} /> Áp Dụng Mẫu
                      </>
                    )}
                  </button>
                )}
                {hasPlanLimit && (
                  <div className='text-sm text-gray-500 bg-pink-50/60 border border-pink-100 rounded-lg p-3'>
                    Mẫu này thuộc gói trả phí. Nâng cấp để mở khóa và được giảm giá bằng với gói đã mua trước đó.
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <Pagination
        currentPage={currentPage}
        totalItems={filteredTemplates.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        itemLabel='mẫu thiệp'
        accentColor='pink'
      />
    </StudioLayout>
  )
}
