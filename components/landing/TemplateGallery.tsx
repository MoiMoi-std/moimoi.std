import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

// Mock Data (Sau này sẽ fetch từ Supabase)
const TEMPLATES = [
  { id: 1, name: 'Vintage Rose', category: 'Cổ điển', color: 'bg-amber-100' },
  { id: 2, name: 'Modern Minimal', category: 'Hiện đại', color: 'bg-gray-100' },
  { id: 3, name: 'Luxury Gold', category: 'Sang trọng', color: 'bg-yellow-50' },
  { id: 4, name: 'Floral Dream', category: 'Hoa lá', color: 'bg-pink-50' },
  { id: 5, name: 'Korean Style', category: 'Hiện đại', color: 'bg-blue-50' },
  { id: 6, name: 'Traditional Red', category: 'Truyền thống', color: 'bg-red-50' }
]

const CATEGORIES = ['Tất cả', 'Hiện đại', 'Cổ điển', 'Sang trọng', 'Truyền thống']

export default function TemplateGallery() {
  const [activeCategory, setActiveCategory] = useState('Tất cả')

  const filteredTemplates =
    activeCategory === 'Tất cả' ? TEMPLATES : TEMPLATES.filter((t) => t.category === activeCategory)

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
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredTemplates.map((template) => (
            <div key={template.id} className='cursor-pointer group'>
              {/* Card Image Placeholder */}
              <div
                className={`aspect-[3/4] rounded-2xl ${template.color} relative overflow-hidden mb-4 shadow-sm border border-gray-100 transition-transform group-hover:-translate-y-2`}
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
                <span className='px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-md'>{template.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
