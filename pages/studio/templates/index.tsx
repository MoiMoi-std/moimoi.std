import Pagination from '@/components/common/Pagination'
import LazyIframePreview from '@/components/studio/LazyIframePreview'
import StudioLayout from '@/components/studio/StudioLayout'
import StudioLoading from '@/components/studio/StudioLoading'
import { useToast } from '@/components/ui/ToastProvider'
import { dataService, Template } from '@/lib/data-service'
import { isPlanExpired } from '@/lib/plan-store'
import { useWedding } from '@/lib/useWedding'
import { Check, Eye, LayoutTemplate, Search, Sparkles, Monitor, Smartphone } from 'lucide-react'
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

const PLAN_RANK: { keyword: string; rank: number }[] = [
  { keyword: 'premium', rank: 4 },
  { keyword: 'nâng cao', rank: 3 },
  { keyword: 'cơ bản', rank: 2 },
  { keyword: 'sinh viên', rank: 1 }
]

const getPlanRank = (name: string): number => PLAN_RANK.find((r) => name.toLowerCase().includes(r.keyword))?.rank ?? 0

const isStudentPromoPlan = (name: string | undefined): boolean => {
  if (!name) return false
  return name.toLowerCase().includes('sinh viên')
}

const getHighestPlan = (plans: string[]): string => {
  if (plans.length === 0) return ''
  return plans.reduce((best, current) => (getPlanRank(current) > getPlanRank(best) ? current : best))
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
  const [packages, setPackages] = useState<{ id: number; name: string }[]>([])
  const [selectedPlan, setSelectedPlan] = useState('all')
  const [loadingTemplates, setLoadingTemplates] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const itemsPerPage = 9
  const { toast, success, error } = useToast()

  // wedding.package (FK join) is set at account creation and never updated on plan purchase.
  // wedding.content.plan is the authoritative active plan ID (set by payment callback).
  const userPackageId = (wedding as any)?.package?.id as number | null | undefined
  const userPackageName = (wedding as any)?.package?.name as string | undefined
  const contentPlanId = (wedding as any)?.content?.plan as string | undefined
  // Effective plan: content.plan takes priority over stale FK join
  const effectivePlanId: number | null | undefined = contentPlanId ? parseInt(contentPlanId) : userPackageId
  const planExpired = isPlanExpired((wedding as any)?.content?.expires_at)

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

  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await fetch('/api/get-packages')
        if (!res.ok) return
        const result = await res.json()
        const plans: any[] = result.plans || []
        setPackages(plans.map((p) => ({ id: p.id, name: p.name })))
      } catch {
        // silent — filter sẽ fallback về packages từ templates
      }
    }
    loadPackages()
  }, [])

  // Build a map of package id → name from all loaded templates
  const allPackagesMap = useMemo(() => {
    const map: Record<number, string> = {}
    templates.forEach((t: any) => {
      ;(t.packages || []).forEach((p: any) => {
        if (p.id != null && p.name) map[Number(p.id)] = p.name
      })
    })
    return map
  }, [templates])

  // The effective plan name — only set when user has actually paid (contentPlanId exists).
  // We intentionally do NOT fall back to userPackageName because wedding.package FK is
  // assigned at account creation (default free/student package) and does NOT indicate payment.
  const effectivePackageName = contentPlanId ? (allPackagesMap[parseInt(contentPlanId)] ?? userPackageName) : null

  // Unique plan names from packages table, sorted high → low for the dropdown.
  // Falls back to packages derived from templates if API hasn't loaded yet.
  const availablePlans = useMemo(() => {
    const source =
      packages.length > 0
        ? packages.map((p) => p.name)
        : (() => {
            const planSet = new Set<string>()
            templates.forEach((t: any) => {
              ;(t.packages || []).forEach((p: any) => {
                if (p.name) planSet.add(p.name)
              })
            })
            return Array.from(planSet)
          })()
    return source.sort((a, b) => getPlanRank(b) - getPlanRank(a))
  }, [packages, templates])

  const templatesWithMeta = useMemo(() => {
    return templates.map((template) => ({
      ...template,
      meta: templateMeta[template.id] || DEFAULT_META
    }))
  }, [templates, templateMeta])

  const filteredTemplates = useMemo(() => {
    let data = templatesWithMeta.filter((template) => template.meta.is_active)

    if (selectedPlan !== 'all') {
      data = data.filter((template) => {
        const pkgs: any[] = (template as any).packages || []
        return pkgs.some((p: any) => p.name === selectedPlan)
      })
    }

    if (searchTerm.trim()) {
      const keyword = searchTerm.toLowerCase()
      data = data.filter((template) => template.name.toLowerCase().includes(keyword))
    }

    return data.sort((a, b) => a.meta.sort_order - b.meta.sort_order)
  }, [templatesWithMeta, searchTerm, selectedPlan])

  const pagedTemplates = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredTemplates.slice(start, start + itemsPerPage)
  }, [currentPage, filteredTemplates, itemsPerPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedPlan])

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
            ? {
                id: tpl.id,
                name: tpl.name,
                repo_branch: tpl.repo_branch,
                thumbnail_url: tpl.thumbnail_url,
                created_at: tpl.created_at ?? ''
              }
            : wedding.template
        })
        success('Đã áp dụng mẫu thiệp!')
      }
    } catch (e) {
      error('Không thể áp dụng mẫu. Vui lòng thử lại.')
    }
  }

  // Returns true if user can apply this template.
  // Higher-tier users can access templates from lower-tier plans as well.
  const canUseTemplate = (templateId: number): boolean => {
    // Block only if user has NOT paid for any plan AND default package is student
    if (!contentPlanId && isStudentPromoPlan(userPackageName)) return false
    const tpl = templates.find((t) => t.id === templateId) as any
    if (!tpl) return false
    const pkgs: any[] = tpl.packages || []
    if (pkgs.length === 0) return true // free template — accessible by all
    if (planExpired) return false // plan expired — block paid templates
    if (!effectivePlanId) return false
    const userRank = getPlanRank(effectivePackageName ?? '')
    return pkgs.some((p: any) => {
      if (p.id === effectivePlanId) return true // exact match
      if (userRank === 0) return false
      const pRank = getPlanRank(p.name ?? '')
      return pRank > 0 && pRank <= userRank // lower-tier plan templates also accessible
    })
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

      {planExpired && (
        <div className='mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800'>
          <span className='text-lg leading-none'>⚠️</span>
          <div className='flex-1'>
            <p className='font-semibold'>Gói dịch vụ của bạn đã hết hạn</p>
            <p className='mt-0.5 text-amber-700'>
              Các mẫu thiệp cao cấp đã bị khóa. Vui lòng gia hạn để tiếp tục sử dụng.
            </p>
          </div>
          <button
            onClick={() => router.push('/studio/upgrade')}
            className='shrink-0 rounded-xl bg-amber-500 px-4 py-1.5 text-sm font-bold text-white hover:bg-amber-600 transition-colors'
          >
            Gia hạn ngay
          </button>
        </div>
      )}

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
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className='text-sm font-medium text-gray-700 focus:outline-none'
          >
            <option value='all'>Tất cả gói</option>
            {availablePlans.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>
        </div>
        {/* Current plan badge — informational only */}
        {effectivePackageName && (
          <div className='flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 border border-pink-100 rounded-xl text-sm text-pink-700 select-none'>
            Gói của bạn:
            <span className='font-semibold'>{effectivePackageName}</span>
          </div>
        )}
        <div className='flex items-center bg-gray-100 p-1 rounded-xl ml-auto'>
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'desktop' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-400 hover:text-gray-600'}`}
            title='Xem giao diện Máy tính'
          >
            <Monitor size={18} />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'mobile' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-400 hover:text-gray-600'}`}
            title='Xem giao diện Điện thoại'
          >
            <Smartphone size={18} />
          </button>
        </div>
      </div>

      <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {pagedTemplates.map((template) => {
          const meta = template.meta
          // Only show "Đang dùng" when a template_id is explicitly set (not null).
          // New accounts have template_id = null thanks to create-wedding.ts fix.
          const isActive = !!wedding?.template_id && wedding.template_id === template.id
          const hasPlanLimit = meta.allowed_plans.length > 0
          return (
            <div
              key={template.id}
              className='bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow'
            >
              {/* Live iframe thumbnail — lazy loaded */}
              {(template as any).repo_branch ? (
                <LazyIframePreview
                  src={`/studio/templates/preview/${encodeURIComponent((template as any).repo_branch)}`}
                  title={`Preview ${template.name}`}
                  viewMode={viewMode}
                />
              ) : (
                <div className='aspect-[4/3] bg-gray-100 rounded-t-3xl flex items-center justify-center text-gray-400 text-sm'>
                  Chưa có mẫu xem trước
                </div>
              )}
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
                  <span
                    className={`px-2 py-1 rounded-full ${
                      hasPlanLimit ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                    }`}
                  >
                    {hasPlanLimit ? `Gói: ${getHighestPlan(meta.allowed_plans)}` : 'Tất cả gói'}
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
                  // User doesn't own the required plan or plan expired
                  <div>
                    <button
                      onClick={() => {
                        const requiredPlan = getHighestPlan(meta.allowed_plans)
                        router.push(
                          requiredPlan ? `/studio/upgrade?plan=${encodeURIComponent(requiredPlan)}` : '/studio/upgrade'
                        )
                      }}
                      className='w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg shadow-amber-200 hover:scale-[1.01] active:scale-[0.99] transition-all'
                    >
                      ⚡ {planExpired ? 'Gia hạn gói' : 'Nâng cấp gói'}
                    </button>
                    <p className='mt-2 text-xs text-center text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2'>
                      {planExpired ? (
                        <>Gói của bạn đã hết hạn. Vui lòng gia hạn để sử dụng mẫu này.</>
                      ) : !contentPlanId && isStudentPromoPlan(userPackageName) ? (
                        <>Vui lòng nâng cấp để sử dụng tính năng này.</>
                      ) : (
                        <>
                          Bạn cần nâng cấp gói để sử dụng mẫu này
                          {meta.allowed_plans.length > 0 && (
                            <>
                              <br />
                              <span className='font-semibold'>{getHighestPlan(meta.allowed_plans)}</span>
                            </>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
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

                    {/* Button push to https://www.moimoi.io.vn/studio/editor để chỉnh sửa template nếu cần*/}
                    <button
                      onClick={() => router.push('/studio/editor')}
                      className='w-12 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-pink-600 to-rose-500 text-white hover:shadow-lg shadow-pink-200 hover:scale-[1.01] active:scale-[0.99]'
                    >
                      <Sparkles size={16} />
                    </button>
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
