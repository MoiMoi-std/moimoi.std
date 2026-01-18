import { useEffect, useMemo, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { dataService, Template } from '@/lib/data-service'

const CATEGORIES = ['Tất cả', 'Vintage', 'Modern', 'Minimal', 'Luxury', 'Traditional']
const CARD_COLORS = ['bg-amber-100', 'bg-gray-100', 'bg-yellow-50', 'bg-pink-50', 'bg-blue-50', 'bg-red-50']

const matchCategory = (template: Template, category: string) => {
  if (category === 'Tất cả') return true
  const keyword = category.toLowerCase()
  return template.name.toLowerCase().includes(keyword) || template.repo_branch.toLowerCase().includes(keyword)
}

export default function TemplateGallery() {
  const [activeCategory, setActiveCategory] = useState('Tất cả')
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  const INITIAL_VISIBLE_COUNT = 6

  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true)
      const data = await dataService.getTemplates()
      setTemplates(data)
      setLoading(false)
    }
    loadTemplates()
  }, [])

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => matchCategory(template, activeCategory))
  }, [activeCategory, templates])

  const visibleTemplates = useMemo(() => {
    if (showAll) return filteredTemplates
    return filteredTemplates.slice(0, INITIAL_VISIBLE_COUNT)
  }, [filteredTemplates, showAll])

  useEffect(() => {
    setShowAll(false)
  }, [activeCategory])

  return (
    <section id='templates' className='py-20 bg-white'>
      <div className='container px-4 mx-auto'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold'>Kho Giao Diện Đa Dạng</h2>
          <p className='text-gray-600'>Hơn 50+ mẫu thiệp được thiết kế tỉ mỉ, phù hợp mọi phong cách.</p>
        </div>

        {/* Filter Tabs */}
        <div className='flex flex-wrap justify-center gap-2 mb-10'>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Templates */}
        {loading ? (
          <div className='text-center text-gray-400 py-16'>Đang tải kho mẫu...</div>
        ) : (
          <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
            {visibleTemplates.map((template, index) => (
              <div key={template.id} className='cursor-pointer group'>
                {/* Card Image Placeholder */}
                <div
                  className={`aspect-[3/4] rounded-2xl ${CARD_COLORS[index % CARD_COLORS.length]} relative overflow-hidden mb-4 shadow-sm border border-gray-100 transition-transform group-hover:-translate-y-2`}
                >
                  <div className='absolute inset-0 flex items-center justify-center font-medium text-gray-400'>
                    Ảnh Mẫu: {template.name}
                  </div>

                  {/* Hover Overlay */}
                  <div className='absolute inset-0 flex items-center justify-center gap-3 transition-opacity opacity-0 bg-black/40 group-hover:opacity-100'>
                    <button className='flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-900 bg-white rounded-full hover:bg-pink-50'>
                      <ExternalLink className='w-4 h-4' /> Xem Demo
                    </button>
                  </div>
                </div>

                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-bold text-gray-900'>{template.name}</h3>
                  <span className='px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-md'>{template.repo_branch}</span>
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
