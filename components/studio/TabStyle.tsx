import { Check, ChevronDown } from 'lucide-react'
import { useRef, useState } from 'react'

interface TabStyleProps {
  content?: Record<string, any>
  onChange: (key: string, value: string) => void
  onBatchChange: (changes: Record<string, string>) => void
}

const COLOR_PRESETS = [
  { label: 'Hồng ngọt', value: '#e91e8c' },
  { label: 'Đỏ rượu', value: '#9a2a2a' },
  { label: 'Đỏ son', value: '#c41e3a' },
  { label: 'Hồng nhạt', value: '#f48fb1' },
  { label: 'Hồng đất', value: '#c07a85' },
  { label: 'Cam đào', value: '#e07b5a' },
  { label: 'Vàng cưới', value: '#d97706' },
  { label: 'Vàng gold', value: '#C9A84C' },
  { label: 'Tím lavender', value: '#9b72aa' },
  { label: 'Tím nhạt', value: '#9c6fc0' },
  { label: 'Tím indigo', value: '#6366f1' },
  { label: 'Xanh navy', value: '#1e3a8a' },
  { label: 'Xanh biển', value: '#2563eb' },
  { label: 'Xanh teal', value: '#2a9d8f' },
  { label: 'Xanh lá', value: '#2d6a4f' },
  { label: 'Xanh sage', value: '#6b9e78' },
  { label: 'Nâu đất', value: '#8B4513' },
  { label: 'Nâu socola', value: '#4a2c2a' },
  { label: 'Xám bạc', value: '#64748b' },
  { label: 'Đen tuyền', value: '#1a1a1a' }
]

const HEADING_FONT_OPTIONS = [
  { label: 'Quicksand', value: 'Quicksand, sans-serif', preview: 'Nguyễn Thị Lan', description: 'Nhẹ nhàng, lãng mạn' },
  { label: 'Nunito', value: 'Nunito, sans-serif', preview: 'Nguyễn Thị Lan', description: 'Mềm mại, dễ thương' },
  { label: 'Mulish', value: 'Mulish, sans-serif', preview: 'Nguyễn Thị Lan', description: 'Tinh tế, tiếng Việt tốt' },
  {
    label: 'Josefin Sans',
    value: 'Josefin Sans, sans-serif',
    preview: 'Nguyễn Thị Lan',
    description: 'Thanh mảnh, hiện đại'
  },
  {
    label: 'Cormorant Garamond',
    value: 'Cormorant Garamond, serif',
    preview: 'Nguyễn Thị Lan',
    description: 'Cổ điển, lãng mạn'
  },
  {
    label: 'Playfair Display',
    value: 'Playfair Display, serif',
    preview: 'Nguyễn Thị Lan',
    description: 'Sang trọng, tinh tế'
  },
  { label: 'Lora', value: 'Lora, serif', preview: 'Nguyễn Thị Lan', description: 'Nhẹ nhàng, thơ mộng' },
  { label: 'EB Garamond', value: 'EB Garamond, serif', preview: 'Nguyễn Thị Lan', description: 'Cổ điển, thanh lịch' },
  { label: 'Montserrat', value: 'Montserrat, sans-serif', preview: 'Nguyễn Thị Lan', description: 'Hiện đại, mạnh mẽ' },
  { label: 'Outfit', value: 'Outfit, sans-serif', preview: 'Nguyễn Thị Lan', description: 'Trẻ trung, năng động' },
  { label: 'Inter', value: 'Inter, sans-serif', preview: 'Nguyễn Thị Lan', description: 'Hiện đại, tối giản' },
  {
    label: 'Be Vietnam Pro',
    value: 'Be Vietnam Pro, sans-serif',
    preview: 'Nguyễn Thị Lan',
    description: 'Tiếng Việt, hiện đại'
  },
  { label: 'Open Sans', value: 'Open Sans, sans-serif', preview: 'Nguyễn Thị Lan', description: 'Phổ biến, dễ đọc' }
]

const SECTION_FONT_OPTIONS = [
  {
    label: 'Playfair Display',
    value: 'Playfair Display, serif',
    preview: 'GIA ĐÌNH · THÔNG TIN',
    description: 'Sang trọng, tinh tế'
  },
  {
    label: 'Cormorant Garamond',
    value: 'Cormorant Garamond, serif',
    preview: 'GIA ĐÌNH · THÔNG TIN',
    description: 'Cổ điển, lãng mạn'
  },
  { label: 'Lora', value: 'Lora, serif', preview: 'GIA ĐÌNH · THÔNG TIN', description: 'Nhẹ nhàng, thơ mộng' },
  {
    label: 'EB Garamond',
    value: 'EB Garamond, serif',
    preview: 'GIA ĐÌNH · THÔNG TIN',
    description: 'Cổ điển, thanh lịch'
  },
  {
    label: 'Josefin Sans',
    value: 'Josefin Sans, sans-serif',
    preview: 'GIA ĐÌNH · THÔNG TIN',
    description: 'Thanh mảnh, hiện đại'
  },
  {
    label: 'Montserrat',
    value: 'Montserrat, sans-serif',
    preview: 'GIA ĐÌNH · THÔNG TIN',
    description: 'Hiện đại, mạnh mẽ'
  },
  {
    label: 'Outfit',
    value: 'Outfit, sans-serif',
    preview: 'GIA ĐÌNH · THÔNG TIN',
    description: 'Trẻ trung, năng động'
  },
  { label: 'Inter', value: 'Inter, sans-serif', preview: 'GIA ĐÌNH · THÔNG TIN', description: 'Hiện đại, tối giản' },
  {
    label: 'Be Vietnam Pro',
    value: 'Be Vietnam Pro, sans-serif',
    preview: 'GIA ĐÌNH · THÔNG TIN',
    description: 'Tiếng Việt, hiện đại'
  },
  {
    label: 'Quicksand',
    value: 'Quicksand, sans-serif',
    preview: 'GIA ĐÌNH · THÔNG TIN',
    description: 'Nhẹ nhàng, thanh thoát'
  },
  { label: 'Nunito', value: 'Nunito, sans-serif', preview: 'GIA ĐÌNH · THÔNG TIN', description: 'Mềm mại, thân thiện' },
  {
    label: 'Mulish',
    value: 'Mulish, sans-serif',
    preview: 'GIA ĐÌNH · THÔNG TIN',
    description: 'Tinh tế, tiếng Việt tốt'
  },
  {
    label: 'Open Sans',
    value: 'Open Sans, sans-serif',
    preview: 'GIA ĐÌNH · THÔNG TIN',
    description: 'Phổ biến, dễ đọc'
  }
]

const BODY_FONT_OPTIONS = [
  {
    label: 'Cormorant Garamond',
    value: 'Cormorant Garamond, serif',
    preview: 'Trân trọng kính mời quý vị',
    description: 'Cổ điển, lãng mạn'
  },
  {
    label: 'Playfair Display',
    value: 'Playfair Display, serif',
    preview: 'Trân trọng kính mời quý vị',
    description: 'Sang trọng, tinh tế'
  },
  { label: 'Lora', value: 'Lora, serif', preview: 'Trân trọng kính mời quý vị', description: 'Nhẹ nhàng, thơ mộng' },
  {
    label: 'EB Garamond',
    value: 'EB Garamond, serif',
    preview: 'Trân trọng kính mời quý vị',
    description: 'Cổ điển, thanh lịch'
  },
  {
    label: 'Quicksand',
    value: 'Quicksand, sans-serif',
    preview: 'Trân trọng kính mời quý vị',
    description: 'Nhẹ nhàng, thanh thoát'
  },
  {
    label: 'Nunito',
    value: 'Nunito, sans-serif',
    preview: 'Trân trọng kính mời quý vị',
    description: 'Mềm mại, thân thiện'
  },
  {
    label: 'Mulish',
    value: 'Mulish, sans-serif',
    preview: 'Trân trọng kính mời quý vị',
    description: 'Tinh tế, tiếng Việt tốt'
  },
  {
    label: 'Josefin Sans',
    value: 'Josefin Sans, sans-serif',
    preview: 'Trân trọng kính mời quý vị',
    description: 'Thanh mảnh, hiện đại'
  },
  {
    label: 'Montserrat',
    value: 'Montserrat, sans-serif',
    preview: 'Trân trọng kính mời quý vị',
    description: 'Hiện đại, mạnh mẽ'
  },
  {
    label: 'Outfit',
    value: 'Outfit, sans-serif',
    preview: 'Trân trọng kính mời quý vị',
    description: 'Trẻ trung, năng động'
  },
  {
    label: 'Inter',
    value: 'Inter, sans-serif',
    preview: 'Trân trọng kính mời quý vị',
    description: 'Hiện đại, tối giản'
  },
  {
    label: 'Be Vietnam Pro',
    value: 'Be Vietnam Pro, sans-serif',
    preview: 'Trân trọng kính mời quý vị',
    description: 'Tiếng Việt, hiện đại'
  },
  {
    label: 'Open Sans',
    value: 'Open Sans, sans-serif',
    preview: 'Trân trọng kính mời quý vị',
    description: 'Phổ biến, dễ đọc'
  }
]

const STYLE_PRESETS = [
  {
    label: 'Vintage Cổ Điển',
    primary_color: '#9a2a2a',
    heading_font_family: 'Lora, serif',
    section_font_family: 'Playfair Display, serif',
    font_family: 'Lora, serif',
    description: 'Đỏ trầm · cổ điển · lãng mạn',
    swatch: ['#9a2a2a', '#f2e8de']
  },
  {
    label: 'Lãng Mạn',
    primary_color: '#e91e8c',
    heading_font_family: 'Quicksand, sans-serif',
    section_font_family: 'Cormorant Garamond, serif',
    font_family: 'Cormorant Garamond, serif',
    description: 'Hồng ngọt · nhẹ nhàng · lãng mạn',
    swatch: ['#e91e8c', '#fff0f5']
  },
  {
    label: 'Sang Trọng',
    primary_color: '#C9A84C',
    heading_font_family: 'Cormorant Garamond, serif',
    section_font_family: 'Cormorant Garamond, serif',
    font_family: 'Cormorant Garamond, serif',
    description: 'Vàng gold · cổ điển · tinh tế',
    swatch: ['#C9A84C', '#141414']
  },
  {
    label: 'Hiện Đại',
    primary_color: '#6366f1',
    heading_font_family: 'Inter, sans-serif',
    section_font_family: 'Inter, sans-serif',
    font_family: 'Inter, sans-serif',
    description: 'Tím indigo · tối giản · hiện đại',
    swatch: ['#6366f1', '#0f0f23']
  },
  {
    label: 'Thiên Nhiên',
    primary_color: '#2d6a4f',
    heading_font_family: 'Playfair Display, serif',
    section_font_family: 'Playfair Display, serif',
    font_family: 'Lora, serif',
    description: 'Xanh lá · thanh lịch · tự nhiên',
    swatch: ['#2d6a4f', '#f0fdf4']
  },
  {
    label: 'Tối Giản',
    primary_color: '#64748b',
    heading_font_family: 'Be Vietnam Pro, sans-serif',
    section_font_family: 'Be Vietnam Pro, sans-serif',
    font_family: 'Be Vietnam Pro, sans-serif',
    description: 'Xám bạc · tiếng Việt · tối giản',
    swatch: ['#64748b', '#f8fafc']
  },
  {
    label: 'Hoàng Gia',
    primary_color: '#1e3a8a',
    heading_font_family: 'Nunito, sans-serif',
    section_font_family: 'Nunito, sans-serif',
    font_family: 'Cormorant Garamond, serif',
    description: 'Xanh navy · thanh lịch · hoàng gia',
    swatch: ['#1e3a8a', '#f0f4ff']
  },
  {
    label: 'Đào Hoa',
    primary_color: '#c07a85',
    heading_font_family: 'Mulish, sans-serif',
    section_font_family: 'Mulish, sans-serif',
    font_family: 'Lora, serif',
    description: 'Hồng đất · thanh mảnh · mộng mơ',
    swatch: ['#c07a85', '#fff5f7']
  },
  {
    label: 'Đại Dương',
    primary_color: '#2a9d8f',
    heading_font_family: 'Outfit, sans-serif',
    section_font_family: 'Outfit, sans-serif',
    font_family: 'Outfit, sans-serif',
    description: 'Xanh teal · hiện đại · tươi mát',
    swatch: ['#2a9d8f', '#f0fdfa']
  }
]

type FontTab = 'heading' | 'section' | 'body'

const FONT_TABS: {
  key: FontTab
  label: string
  contentKey: string
  options: typeof HEADING_FONT_OPTIONS
  previewSize: string
}[] = [
  {
    key: 'heading',
    label: 'Chữ chính',
    contentKey: 'heading_font_family',
    options: HEADING_FONT_OPTIONS,
    previewSize: 'text-xl'
  },
  { key: 'body', label: 'Chữ phụ', contentKey: 'font_family', options: BODY_FONT_OPTIONS, previewSize: 'text-sm' },
  {
    key: 'section',
    label: 'Chữ mục lớn',
    contentKey: 'section_font_family',
    options: SECTION_FONT_OPTIONS,
    previewSize: 'text-sm'
  }
]

function FontTabsSelector({
  content,
  onChange
}: {
  content?: Record<string, any>
  onChange: (key: string, value: string) => void
}) {
  const [activeTab, setActiveTab] = useState<FontTab | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const currentValues: Record<FontTab, string> = {
    heading: content?.heading_font_family || '',
    body: content?.font_family || '',
    section: content?.section_font_family || ''
  }

  function getLabelFor(tab: FontTab) {
    const val = currentValues[tab]
    const opt = FONT_TABS.find((t) => t.key === tab)?.options.find((o) => o.value === val)
    return opt?.label || 'Chưa chọn'
  }

  function getPreviewFor(tab: FontTab) {
    const val = currentValues[tab]
    const opt = FONT_TABS.find((t) => t.key === tab)?.options.find((o) => o.value === val)
    return val ? opt?.preview || '' : ''
  }

  const activeTabData = activeTab ? FONT_TABS.find((t) => t.key === activeTab) : null

  return (
    <div>
      {/* 3 horizontal tab buttons */}
      <div className='grid grid-cols-3 gap-1.5 mb-2'>
        {FONT_TABS.map((tab) => {
          const isActive = activeTab === tab.key
          const fontVal = currentValues[tab.key]
          return (
            <button
              key={tab.key}
              type='button'
              onClick={() => setActiveTab(isActive ? null : tab.key)}
              className={`flex flex-col items-center text-center px-2 py-2 rounded-xl border-2 transition-all min-w-0 ${
                isActive
                  ? 'border-pink-500 bg-pink-50/50'
                  : 'border-gray-100 bg-white hover:border-pink-200 hover:bg-pink-50/20'
              }`}
            >
              <span className='text-[10px] font-semibold text-gray-500 uppercase tracking-wide leading-none mb-1.5 truncate w-full block'>
                {tab.label}
              </span>
              <span
                className='text-sm leading-tight truncate w-full block text-gray-800'
                style={{ fontFamily: fontVal }}
              >
                {getPreviewFor(tab.key) || 'Aa'}
              </span>
              <span className='text-[10px] text-gray-400 mt-0.5 truncate w-full block'>{getLabelFor(tab.key)}</span>
              <ChevronDown
                size={12}
                className={`text-gray-400 mt-1 transition-transform ${isActive ? 'rotate-180' : ''}`}
              />
            </button>
          )
        })}
      </div>

      {/* Fixed-height scrollable font list */}
      {activeTabData && (
        <div
          ref={listRef}
          className='border-2 border-pink-200 rounded-xl bg-white'
          style={{ maxHeight: 260, overflowY: 'auto', overscrollBehavior: 'contain' }}
          onWheel={(e) => e.stopPropagation()}
        >
          <div className='p-2 space-y-1'>
            {activeTabData.options.map((font) => {
              const isSelected = currentValues[activeTab!] === font.value
              return (
                <button
                  key={font.value}
                  type='button'
                  onClick={() => onChange(activeTabData.contentKey, font.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'border-pink-400 bg-pink-50/60'
                      : 'border-transparent hover:border-pink-100 hover:bg-pink-50/20'
                  }`}
                >
                  <div className='flex-1 min-w-0'>
                    <div
                      className={`${activeTabData.previewSize} text-gray-800 truncate leading-snug`}
                      style={{ fontFamily: font.value }}
                    >
                      {font.preview}
                    </div>
                    <div className='text-xs text-gray-400 mt-0.5'>
                      {font.label} · {font.description}
                    </div>
                  </div>
                  {isSelected && <Check size={14} className='text-pink-500 shrink-0 ml-2' />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function StylePresetSelect({
  presets,
  isPresetActive,
  onApply
}: {
  presets: typeof STYLE_PRESETS
  isPresetActive: (p: (typeof STYLE_PRESETS)[0]) => boolean
  onApply: (p: (typeof STYLE_PRESETS)[0]) => void
}) {
  const [open, setOpen] = useState(false)
  const active = presets.find(isPresetActive)

  return (
    <div className='relative'>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 border-gray-100 bg-white hover:border-pink-200 text-left transition-all'
      >
        {active ? (
          <>
            <div className='flex gap-1 shrink-0'>
              {active.swatch.map((color, i) => (
                <span
                  key={i}
                  className='w-4 h-4 rounded-full border border-white shadow-sm'
                  style={{ background: color }}
                />
              ))}
            </div>
            <div className='flex-1 min-w-0 flex items-baseline gap-1.5'>
              <span className='text-sm font-semibold text-gray-800'>{active.label}</span>
              <span className='text-xs text-gray-400 truncate'>{active.description}</span>
            </div>
          </>
        ) : (
          <span className='text-sm text-gray-400 flex-1'>Chọn phong cách...</span>
        )}
        <ChevronDown size={16} className={`text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className='absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden'>
          {presets.map((preset) => (
            <button
              key={preset.label}
              type='button'
              onClick={() => {
                onApply(preset)
                setOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                isPresetActive(preset) ? 'bg-pink-50/60' : 'hover:bg-pink-50/30'
              }`}
            >
              <div className='flex gap-1 shrink-0'>
                {preset.swatch.map((color, i) => (
                  <span
                    key={i}
                    className='w-4 h-4 rounded-full border border-white shadow-sm'
                    style={{ background: color }}
                  />
                ))}
              </div>
              <div className='flex-1 min-w-0 flex items-baseline gap-1.5'>
                <span className='text-sm font-medium text-gray-800'>{preset.label}</span>
                <span className='text-xs text-gray-400 truncate'>{preset.description}</span>
              </div>
              {isPresetActive(preset) && <Check size={14} className='text-pink-500 shrink-0' />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function CollapsibleSection({
  title,
  description,
  summary,
  children
}: {
  title: string
  description: string
  summary?: React.ReactNode
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='w-full flex items-center justify-between text-left group'
      >
        <div className='min-w-0 flex-1'>
          <h3 className='text-base font-semibold text-gray-900'>{title}</h3>
          {open ? (
            <p className='text-sm text-gray-500 mt-0.5'>{description}</p>
          ) : (
            summary && <div className='text-sm text-gray-500 mt-0.5 truncate'>{summary}</div>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform shrink-0 ml-2 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className='mt-3'>{children}</div>}
    </div>
  )
}

export default function TabStyle({ content, onChange, onBatchChange }: TabStyleProps) {
  const currentColor = content?.primary_color || '#d97706'

  const applyPreset = (preset: (typeof STYLE_PRESETS)[0]) => {
    onBatchChange({
      primary_color: preset.primary_color,
      heading_font_family: preset.heading_font_family,
      section_font_family: preset.section_font_family,
      font_family: preset.font_family
    })
  }

  const isPresetActive = (preset: (typeof STYLE_PRESETS)[0]) =>
    content?.primary_color === preset.primary_color &&
    content?.heading_font_family === preset.heading_font_family &&
    content?.section_font_family === preset.section_font_family &&
    content?.font_family === preset.font_family

  return (
    <div className='space-y-6'>
      {/* Style Presets */}
      <div>
        <h3 className='text-base font-semibold text-gray-900 mb-1'>Phong Cách Nhanh</h3>
        <p className='text-sm text-gray-500 mb-3'>Áp dụng cùng lúc màu sắc và kiểu chữ</p>
        <StylePresetSelect presets={STYLE_PRESETS} isPresetActive={isPresetActive} onApply={applyPreset} />
      </div>

      <div className='border-t border-gray-100' />

      {/* Primary Color */}
      <CollapsibleSection
        title='Màu Chủ Đạo'
        description='Màu dùng cho tiêu đề, nút bấm và các điểm nhấn'
        summary={
          <span className='flex items-center gap-1.5'>
            <span
              className='inline-block w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0'
              style={{ background: currentColor }}
            />
            <span className='font-mono'>{currentColor}</span>
          </span>
        }
      >
        <div className='flex flex-wrap gap-2 mb-3'>
          {COLOR_PRESETS.map((c) => (
            <button
              key={c.value}
              type='button'
              title={c.label}
              onClick={() => onChange('primary_color', c.value)}
              className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                currentColor === c.value ? 'border-gray-800 scale-110' : 'border-white shadow-sm hover:shadow'
              }`}
              style={{ background: c.value }}
            />
          ))}
        </div>
        <div className='flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50'>
          <div className='relative shrink-0'>
            <div
              className='w-10 h-10 rounded-lg border border-gray-200 shadow-sm cursor-pointer'
              style={{ background: currentColor }}
              onClick={() => document.getElementById('color-picker-input')?.click()}
            />
            <input
              id='color-picker-input'
              type='color'
              value={currentColor}
              onChange={(e) => onChange('primary_color', e.target.value)}
              className='absolute inset-0 opacity-0 cursor-pointer w-full h-full'
            />
          </div>
          <div className='flex-1'>
            <div className='text-xs text-gray-500 mb-1'>Màu tùy chỉnh</div>
            <input
              type='text'
              value={currentColor}
              onChange={(e) => {
                if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) {
                  onChange('primary_color', e.target.value)
                }
              }}
              className='w-full text-sm font-mono rounded-lg border border-gray-200 bg-white px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-pink-200'
              placeholder='#d97706'
            />
          </div>
        </div>
      </CollapsibleSection>

      <div className='border-t border-gray-100' />

      {/* Font Tabs */}
      <div>
        <h3 className='text-base font-semibold text-gray-900 mb-1'>Kiểu Chữ</h3>
        <p className='text-sm text-gray-500 mb-3'>Chọn mục để thay đổi phông chữ tương ứng</p>
        <FontTabsSelector content={content} onChange={onChange} />
      </div>
    </div>
  )
}
