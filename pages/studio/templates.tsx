import Pagination from '@/components/common/Pagination'
import StudioEmptyState from '@/components/studio/StudioEmptyState'
import StudioLayout from '@/components/studio/StudioLayout'
import StudioLoading from '@/components/studio/StudioLoading'
import { useToast } from '@/components/ui/ToastProvider'
import { dataService, Template } from '@/lib/data-service'
import { useWedding } from '@/lib/useWedding'
import { Check, Eye, EyeOff, LayoutTemplate, Search, Sparkles } from 'lucide-react'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

const PLAN_OPTIONS = ['Sinh Viên', 'Gói Cơ Bản', 'Gói Nâng Cao', 'Gói Cao Cấp']

type TemplateAdminMeta = {
  is_active: boolean
  price: number
  allowed_plans: string[]
  sort_order: number
  tags: string[]
}

const DEFAULT_META: TemplateAdminMeta = {
  is_active: true,
  price: 0,
  allowed_plans: [],
  sort_order: 0,
  tags: []
}

const MOCK_TEMPLATE_META: Record<number, Partial<TemplateAdminMeta>> = {
  1: { price: 150000, allowed_plans: ['Sinh Viên'], tags: ['vintage', 'hoa'] },
  2: { price: 500000, allowed_plans: ['Gói Cơ Bản'], tags: ['minimal', 'modern'] },
  3: { price: 699000, allowed_plans: ['Gói Nâng Cao'], tags: ['luxury'] },
  4: { price: 1299000, allowed_plans: ['Gói Cao Cấp'], tags: ['premium', 'gold'] }
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
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'hidden'>('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = isAdminMode ? 6 : 9
  const { toast, success, error } = useToast()

  useEffect(() => {
    if (router.query.admin === '1' || router.query.admin === 'true') {
      setIsAdminMode(true)
    }
  }, [router.query.admin])

  useEffect(() => {
    const loadTemplates = async () => {
      setLoadingTemplates(true)
      const data = await dataService.getTemplates()
      setTemplates(data)
      setTemplateMeta((prev) => {
        const next = { ...prev }
        data.forEach((template, index) => {
          if (!next[template.id]) {
            next[template.id] = {
              ...DEFAULT_META,
              sort_order: index + 1,
              ...(MOCK_TEMPLATE_META[template.id] || {})
            }
          }
        })
        return next
      })
      setLoadingTemplates(false)
    }
    loadTemplates()
  }, [])

  const updateMeta = (templateId: number, patch: Partial<TemplateAdminMeta>) => {
    setTemplateMeta((prev) => {
      const current = prev[templateId] || DEFAULT_META
      return {
        ...prev,
        [templateId]: { ...current, ...patch }
      }
    })
  }

  const togglePlan = (templateId: number, plan: string) => {
    setTemplateMeta((prev) => {
      const current = prev[templateId] || DEFAULT_META
      const allowed = new Set(current.allowed_plans)
      if (allowed.has(plan)) {
        allowed.delete(plan)
      } else {
        allowed.add(plan)
      }
      return {
        ...prev,
        [templateId]: { ...current, allowed_plans: Array.from(allowed) }
      }
    })
  }

  const templatesWithMeta = useMemo(() => {
    return templates.map((template) => ({
      ...template,
      meta: templateMeta[template.id] || DEFAULT_META
    }))
  }, [templates, templateMeta])

  const filteredTemplates = useMemo(() => {
    let data = templatesWithMeta
    if (!isAdminMode) {
      data = data.filter((template) => template.meta.is_active)
    }

    if (selectedStyle !== 'all') {
      const keyword = selectedStyle.toLowerCase()
      data = data.filter((template) => template.name.toLowerCase().includes(keyword))
    }

    if (searchTerm.trim()) {
      const keyword = searchTerm.toLowerCase()
      data = data.filter((template) => {
        const nameMatch = template.name.toLowerCase().includes(keyword)
        const tagMatch = template.meta.tags.some((tag) => tag.toLowerCase().includes(keyword))
        return nameMatch || tagMatch
      })
    }

    if (isAdminMode) {
      if (statusFilter !== 'all') {
        data = data.filter((template) =>
          statusFilter === 'active' ? template.meta.is_active : !template.meta.is_active
        )
      }
      if (planFilter !== 'all') {
        data = data.filter((template) => template.meta.allowed_plans.includes(planFilter))
      }
    }

    return data.sort((a, b) => a.meta.sort_order - b.meta.sort_order)
  }, [templatesWithMeta, isAdminMode, planFilter, searchTerm, selectedStyle, statusFilter])

  const pagedTemplates = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredTemplates.slice(start, start + itemsPerPage)
  }, [currentPage, filteredTemplates, itemsPerPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedStyle, statusFilter, planFilter, isAdminMode])

  if (loadingTemplates) {
    return (
      <StudioLayout>
        <StudioLoading message='Đang tải thư viện mẫu...' />
      </StudioLayout>
    )
  }

  const applyTemplate = async (templateId: number) => {
    const meta = templateMeta[templateId] || DEFAULT_META
    if (!isAdminMode && meta.allowed_plans.length > 0) {
      toast(`Mẫu này thuộc gói: ${meta.allowed_plans.join(', ')}. Hãy nâng cấp để mở khóa đầy đủ.`, 'info')
    }
    try {
      if (wedding) {
        await dataService.updateWeddingTemplate(wedding.id, templateId)
        setWedding({ ...wedding, template_id: templateId })
        success('Đã áp dụng mẫu thiệp!')
      }
    } catch (e) {
      error('Không thể áp dụng mẫu. Vui lòng thử lại.')
    }
  }

  return (
    <StudioLayout>
      <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-3xl font-serif font-bold text-gray-900'>Kho Giao Diện</h1>
          <p className='text-gray-500'>Chọn mẫu thiệp phù hợp với phong cách của bạn</p>
          {isAdminMode && <p className='mt-2 text-xs text-pink-600 font-semibold'>Đang bật chế độ quản trị (mock)</p>}
        </div>
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
        {isAdminMode && (
          <>
            <div className='flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2'>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'hidden')}
                className='text-sm font-medium text-gray-700 focus:outline-none'
              >
                <option value='all'>Tất cả trạng thái</option>
                <option value='active'>Đang hiển thị</option>
                <option value='hidden'>Đang ẩn</option>
              </select>
            </div>
            <div className='flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2'>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className='text-sm font-medium text-gray-700 focus:outline-none'
              >
                <option value='all'>Tất cả gói</option>
                {PLAN_OPTIONS.map((plan) => (
                  <option key={plan} value={plan}>
                    {plan}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        <button
          onClick={() => toast('Bộ lọc demo dựa theo tên mẫu', 'info')}
          className='px-4 py-2 bg-pink-50 text-pink-600 rounded-xl text-sm font-bold'
        >
          Mẹo chọn mẫu
        </button>
        {isAdminMode && (
          <button
            onClick={() => toast('Đã lưu thay đổi (mock).', 'success')}
            className='px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-xl text-sm font-bold'
          >
            Lưu thay đổi
          </button>
        )}
      </div>

      <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {pagedTemplates.map((template) => {
          const meta = template.meta
          const isActive = wedding?.template_id === template.id
          const hasPlanLimit = meta.allowed_plans.length > 0
          return (
            <div
              key={template.id}
              className={`bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
                !meta.is_active && isAdminMode ? 'opacity-80 border-dashed' : ''
              }`}
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
                <p className='text-sm text-gray-500'>Gợi ý phong cách: {template.repo_branch}</p>
                <div className='flex flex-wrap gap-2 text-sm'>
                  <span className='px-2 py-1 rounded-full bg-gray-100 text-gray-600'>
                    Giá: {formatPrice(meta.price)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full ${
                      hasPlanLimit ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                    }`}
                  >
                    {hasPlanLimit ? `Gói: ${meta.allowed_plans.join(', ')}` : 'Tất cả gói'}
                  </span>
                </div>
                <button
                  onClick={() => applyTemplate(template.id)}
                  className='w-full py-2.5 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg shadow-pink-200'
                >
                  <Sparkles size={16} /> Áp Dụng Mẫu
                </button>
                {!isAdminMode && hasPlanLimit && (
                  <div className='text-sm text-gray-500 bg-pink-50/60 border border-pink-100 rounded-lg p-3'>
                    Mẫu này thuộc gói trả phí. Nâng cấp để mở khóa và được giảm giá bằng với gói đã mua trước đó.
                  </div>
                )}
                {isAdminMode && (
                  <div className='mt-4 border-t border-gray-100 pt-4 space-y-4 text-sm'>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium text-gray-600'>Trạng thái hiển thị</span>
                      <button
                        onClick={() => updateMeta(template.id, { is_active: !meta.is_active })}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${
                          meta.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {meta.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                        {meta.is_active ? 'Đang hiển thị' : 'Đang ẩn'}
                      </button>
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                      <label className='flex flex-col gap-1'>
                        <span className='text-sm font-bold text-gray-500 uppercase'>Giá (VNĐ)</span>
                        <input
                          type='number'
                          min={0}
                          value={meta.price}
                          onChange={(e) => updateMeta(template.id, { price: Number(e.target.value) })}
                          className='border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-100'
                        />
                      </label>
                      <label className='flex flex-col gap-1'>
                        <span className='text-sm font-bold text-gray-500 uppercase'>Thứ tự</span>
                        <input
                          type='number'
                          min={0}
                          value={meta.sort_order}
                          onChange={(e) => updateMeta(template.id, { sort_order: Number(e.target.value) })}
                          className='border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-100'
                        />
                      </label>
                    </div>
                    <div className='space-y-2'>
                      <div className='text-sm font-bold text-gray-500 uppercase'>Gói áp dụng</div>
                      <div className='flex flex-wrap gap-2'>
                        {PLAN_OPTIONS.map((plan) => {
                          const checked = meta.allowed_plans.includes(plan)
                          return (
                            <label
                              key={plan}
                              className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold cursor-pointer ${
                                checked
                                  ? 'border-pink-300 bg-pink-50 text-pink-700'
                                  : 'border-gray-200 bg-white text-gray-600'
                              }`}
                            >
                              <input
                                type='checkbox'
                                checked={checked}
                                onChange={() => togglePlan(template.id, plan)}
                                className='accent-pink-500'
                              />
                              {plan}
                            </label>
                          )
                        })}
                      </div>
                      <p className='text-sm text-gray-400'>
                        Không chọn gói nào đồng nghĩa với việc áp dụng cho tất cả gói.
                      </p>
                    </div>
                    <label className='flex flex-col gap-1'>
                      <span className='text-sm font-bold text-gray-500 uppercase'>Tags</span>
                      <input
                        type='text'
                        value={meta.tags.join(', ')}
                        onChange={(e) =>
                          updateMeta(template.id, {
                            tags: e.target.value
                              .split(',')
                              .map((tag) => tag.trim())
                              .filter(Boolean)
                          })
                        }
                        placeholder='vd: vintage, hoa, luxury'
                        className='border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-100'
                      />
                    </label>
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
