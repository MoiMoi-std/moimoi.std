import { useEffect, useMemo, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'

interface Template {
  id: number
  name: string
  repo_branch: string
  thumbnail_url?: string
  is_active: boolean
  packages?: any[]
}

interface Props {
  initialTemplates?: Template[]
}

interface CategoryRule {
  label: string
  keywords: string[]
}

const CATEGORY_RULES: CategoryRule[] = [
  { label: 'Vintage', keywords: ['vintage'] },
  { label: 'Modern', keywords: ['modern'] },
  { label: 'Minimal', keywords: ['minimal', 'minimalist'] },
  { label: 'Luxury', keywords: ['luxury', 'gold', 'premium'] },
  { label: 'Traditional', keywords: ['traditional', 'royal', 'oriental', 'rustic'] },
  { label: 'Nature', keywords: ['nature', 'ocean', 'boho', 'garden', 'forest'] },
  { label: 'Romantic', keywords: ['pastel', 'cherry', 'provence', 'golden-hour'] }
]

const getCategoryLabel = (template: Template): string => {
  const haystack = `${template.name} ${template.repo_branch}`.toLowerCase()
  const matched = CATEGORY_RULES.find((rule) => rule.keywords.some((keyword) => haystack.includes(keyword)))
  return matched?.label || 'Khác'
}

const matchCategory = (template: Template, category: string) => {
  if (category === 'Tất cả') return true
  if (category === 'Khác') {
    return getCategoryLabel(template) === 'Khác'
  }
  return getCategoryLabel(template) === category
}

function TemplatePreviewFrame({ branch, name, eager }: { branch: string; name: string; eager: boolean }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(eager)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (eager) return
    const el = wrapperRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '220px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [eager])

  return (
    <div
      ref={wrapperRef}
      className='relative w-[142px] h-[300px] rounded-[28px] bg-gray-900 p-[6px] shadow-[0_12px_28px_rgba(15,23,42,0.25)]'
    >
      <div className='absolute top-[10px] left-1/2 -translate-x-1/2 w-12 h-4 rounded-full bg-gray-800 z-20' />
      <div className='relative w-full h-full rounded-[22px] overflow-hidden bg-gray-200'>
        {!loaded && (
          <div className='absolute inset-0 bg-gradient-to-r from-gray-100 via-white to-gray-100 animate-pulse' />
        )}
        {shouldLoad && (
          <iframe
            src={`/studio/templates/preview/${encodeURIComponent(branch)}?embed=1`}
            title={`Preview ${name}`}
            scrolling='no'
            loading='lazy'
            onLoad={() => setLoaded(true)}
            style={{
              width: '375px',
              height: '812px',
              transform: 'scale(0.38)',
              transformOrigin: 'top center',
              border: 'none',
              pointerEvents: 'none',
              position: 'absolute',
              top: 0,
              left: '50%',
              marginLeft: '-187.5px',
              backgroundColor: '#fff',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.2s ease'
            }}
          />
        )}
      </div>
    </div>
  )
}

export default function TemplateGallery({ initialTemplates }: Props) {
  const [activeCategory, setActiveCategory] = useState('Tất cả')
  const [templates, setTemplates] = useState<Template[]>(initialTemplates || [])
  const [loading, setLoading] = useState(!initialTemplates)
  const [showAll, setShowAll] = useState(false)

  const INITIAL_VISIBLE_COUNT = 6

  useEffect(() => {
    if (initialTemplates && initialTemplates.length > 0) return
    const loadTemplates = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/templates')
        if (response.ok) {
          const result = await response.json()
          setTemplates(result.data || [])
        }
      } catch (error) {
        console.error('Error fetching templates:', error)
      } finally {
        setLoading(false)
      }
    }
    loadTemplates()
  }, [initialTemplates])

  const categoryStats = useMemo(() => {
    const stats = templates.reduce<Record<string, number>>((acc, template) => {
      const label = getCategoryLabel(template)
      acc[label] = (acc[label] || 0) + 1
      return acc
    }, {})
    return stats
  }, [templates])

  const categories = useMemo(() => {
    const dynamicCategories = Object.keys(categoryStats)
      .sort((a, b) => a.localeCompare(b, 'vi'))
      .filter((label) => categoryStats[label] > 0)
    return ['Tất cả', ...dynamicCategories]
  }, [categoryStats])

  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory('Tất cả')
    }
  }, [activeCategory, categories])

  const filteredTemplates = useMemo(
    () => templates.filter((t) => matchCategory(t, activeCategory)),
    [activeCategory, templates]
  )

  const visibleTemplates = useMemo(
    () => (showAll ? filteredTemplates : filteredTemplates.slice(0, INITIAL_VISIBLE_COUNT)),
    [filteredTemplates, showAll]
  )

  useEffect(() => {
    setShowAll(false)
  }, [activeCategory])

  return (
    <section id='templates' className='py-20 bg-white'>
      <div className='w-full'>
          <div className='mb-12 px-4 text-center'>
          <h2 className='mb-4 text-3xl font-bold'>Kho Giao Diện Đa Dạng</h2>
          <p className='text-gray-600'>Hơn 50+ mẫu thiệp được thiết kế tỉ mỉ, phù hợp mọi phong cách.</p>
        </div>

        <div className='mb-10 px-4 overflow-x-auto'>
          <div className='flex w-max min-w-full justify-center gap-2 px-1'>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{cat}</span>
                {cat !== 'Tất cả' && (
                  <span
                    className={`ml-2 inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] ${
                      activeCategory === cat ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {categoryStats[cat] || 0}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className='text-center text-gray-400 py-16'>Đang tải kho mẫu...</div>
        ) : (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4'>
            {visibleTemplates.map((template, index) => (
              <div
                key={template.id}
                className='bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow'
              >
                {/* Preview area — thumbnail first, iframe loads progressively */}
                <div className='relative aspect-[4/3] bg-gray-100 overflow-hidden rounded-t-3xl flex items-start justify-center pt-3'>
                  <TemplatePreviewFrame branch={template.repo_branch} name={template.name} eager={index < 2} />
                </div>

                {/* Info + actions */}
                <div className='p-5 space-y-3'>
                  <h3 className='font-bold text-gray-900'>{template.name}</h3>

                  {/* Package badge */}
                  <div>
                    {template.packages && template.packages.length > 0 ? (
                      <span className='px-2 py-1 rounded-full text-xs bg-amber-50 text-amber-700'>
                        Gói: {template.packages.map((p: any) => p.name).join(', ')}
                      </span>
                    ) : (
                      <span className='px-2 py-1 rounded-full text-xs bg-green-50 text-green-700'>Tất cả gói</span>
                    )}
                  </div>

                  {/* Xem trước button */}
                  <a
                    href={
                      template.repo_branch
                        ? `/studio/templates/preview/${encodeURIComponent(template.repo_branch)}`
                        : '/studio/login'
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-full py-2.5 bg-gradient-to-r from-violet-600 to-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg shadow-blue-200 transition-all hover:scale-[1.01] active:scale-[0.99]'
                  >
                    <ExternalLink size={16} /> Xem trước
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredTemplates.length > INITIAL_VISIBLE_COUNT && (
          <div className='mt-10 flex justify-center'>
            <button
              type='button'
              onClick={() => setShowAll((prev) => !prev)}
              className='px-6 py-3 rounded-full text-sm font-bold border border-gray-200 text-gray-700 hover:bg-gray-50'
            >
              {showAll ? 'Thu gọn' : 'Xem thêm'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
