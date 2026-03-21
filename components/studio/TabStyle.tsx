import { Check, ChevronDown, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface TabStyleProps {
  content?: Record<string, any>
  onChange: (key: string, value: string) => void
  onBatchChange: (changes: Record<string, string>) => void
  onReset?: () => void
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

// ──────────────────────────────────────────────────────────────────────────────
// Font lists – thu gọn font trùng dáng, thêm font đám cưới hỗ trợ tiếng Việt
// ──────────────────────────────────────────────────────────────────────────────

const HEADING_FONT_OPTIONS = [
  // Serif đám cưới – có dấu tiếng Việt
  {
    label: 'Cormorant Garamond',
    value: 'Cormorant Garamond, serif',
    preview: 'Nguyễn Thị Lan',
    description: 'Cổ điển · lãng mạn'
  },
  {
    label: 'Playfair Display',
    value: 'Playfair Display, serif',
    preview: 'Nguyễn Thị Lan',
    description: 'Sang trọng · tinh tế'
  },
  {
    label: 'Lora',
    value: 'Lora, serif',
    preview: 'Nguyễn Thị Lan',
    description: 'Nhẹ nhàng · thơ mộng'
  },
  {
    label: 'Libre Baskerville',
    value: 'Libre Baskerville, serif',
    preview: 'Nguyễn Thị Lan',
    description: 'Uy nghiêm · thanh lịch'
  },
  // Script / hand-lettered – đẹp cho tên cô dâu chú rể
  {
    label: 'Great Vibes',
    value: 'Great Vibes, cursive',
    preview: 'Nguyễn Thị Lan',
    description: 'Chữ thảo · sang trọng'
  },
  {
    label: 'Dancing Script',
    value: 'Dancing Script, cursive',
    preview: 'Nguyễn Thị Lan',
    description: 'Uyển chuyển · lãng mạn'
  },
  {
    label: 'Parisienne',
    value: 'Parisienne, cursive',
    preview: 'Nguyễn Thị Lan',
    description: 'Pháp · tinh tế'
  },
  {
    label: 'Alex Brush',
    value: 'Alex Brush, cursive',
    preview: 'Nguyễn Thị Lan',
    description: 'Thư pháp · nhẹ nhàng'
  },
  // Sans-serif hiện đại – hỗ trợ tốt tiếng Việt
  {
    label: 'Be Vietnam Pro',
    value: 'Be Vietnam Pro, sans-serif',
    preview: 'Nguyễn Thị Lan',
    description: 'Tiếng Việt · hiện đại'
  },
  {
    label: 'Josefin Sans',
    value: 'Josefin Sans, sans-serif',
    preview: 'Nguyễn Thị Lan',
    description: 'Thanh mảnh · hiện đại'
  },
  {
    label: 'Montserrat',
    value: 'Montserrat, sans-serif',
    preview: 'Nguyễn Thị Lan',
    description: 'Mạnh mẽ · hiện đại'
  }
]

const SECTION_FONT_OPTIONS = [
  {
    label: 'Cormorant Garamond',
    value: 'Cormorant Garamond, serif',
    preview: 'GIA ĐÌNH · THÔNG TIN',
    description: 'Cổ điển · lãng mạn'
  },
  {
    label: 'Playfair Display',
    value: 'Playfair Display, serif',
    preview: 'GIA ĐÌNH · THÔNG TIN',
    description: 'Sang trọng · tinh tế'
  },
  {
    label: 'Libre Baskerville',
    value: 'Libre Baskerville, serif',
    preview: 'GIA ĐÌNH · THÔNG TIN',
    description: 'Uy nghiêm · thanh lịch'
  },
  {
    label: 'Dancing Script',
    value: 'Dancing Script, cursive',
    preview: 'Gia đình · Thông tin',
    description: 'Uyển chuyển · lãng mạn'
  },
  {
    label: 'Josefin Sans',
    value: 'Josefin Sans, sans-serif',
    preview: 'GIA ĐÌNH · THÔNG TIN',
    description: 'Thanh mảnh · hiện đại'
  },
  {
    label: 'Montserrat',
    value: 'Montserrat, sans-serif',
    preview: 'GIA ĐÌNH · THÔNG TIN',
    description: 'Mạnh mẽ · hiện đại'
  },
  {
    label: 'Be Vietnam Pro',
    value: 'Be Vietnam Pro, sans-serif',
    preview: 'GIA ĐÌNH · THÔNG TIN',
    description: 'Tiếng Việt · hiện đại'
  },
  {
    label: 'Lora',
    value: 'Lora, serif',
    preview: 'GIA ĐÌNH · THÔNG TIN',
    description: 'Nhẹ nhàng · thơ mộng'
  }
]

const BODY_FONT_OPTIONS = [
  {
    label: 'Lora',
    value: 'Lora, serif',
    preview: 'Trân trọng kính mời quý vị',
    description: 'Nhẹ nhàng · thơ mộng'
  },
  {
    label: 'Cormorant Garamond',
    value: 'Cormorant Garamond, serif',
    preview: 'Trân trọng kính mời quý vị',
    description: 'Cổ điển · lãng mạn'
  },
  {
    label: 'Libre Baskerville',
    value: 'Libre Baskerville, serif',
    preview: 'Trân trọng kính mời quý vị',
    description: 'Uy nghiêm · thanh lịch'
  },
  {
    label: 'Be Vietnam Pro',
    value: 'Be Vietnam Pro, sans-serif',
    preview: 'Trân trọng kính mời quý vị',
    description: 'Tiếng Việt · hiện đại'
  },
  {
    label: 'Montserrat',
    value: 'Montserrat, sans-serif',
    preview: 'Trân trọng kính mời quý vị',
    description: 'Mạnh mẽ · hiện đại'
  },
  {
    label: 'Josefin Sans',
    value: 'Josefin Sans, sans-serif',
    preview: 'Trân trọng kính mời quý vị',
    description: 'Thanh mảnh · hiện đại'
  },
  {
    label: 'Open Sans',
    value: 'Open Sans, sans-serif',
    preview: 'Trân trọng kính mời quý vị',
    description: 'Phổ biến · dễ đọc'
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
    heading_font_family: 'Dancing Script, cursive',
    section_font_family: 'Cormorant Garamond, serif',
    font_family: 'Lora, serif',
    description: 'Hồng ngọt · chữ thảo · lãng mạn',
    swatch: ['#e91e8c', '#fff0f5']
  },
  {
    label: 'Sang Trọng',
    primary_color: '#C9A84C',
    heading_font_family: 'Great Vibes, cursive',
    section_font_family: 'Cormorant Garamond, serif',
    font_family: 'Cormorant Garamond, serif',
    description: 'Vàng gold · chữ thảo · tinh tế',
    swatch: ['#C9A84C', '#141414']
  },
  {
    label: 'Hiện Đại',
    primary_color: '#6366f1',
    heading_font_family: 'Montserrat, sans-serif',
    section_font_family: 'Josefin Sans, sans-serif',
    font_family: 'Be Vietnam Pro, sans-serif',
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
    heading_font_family: 'Libre Baskerville, serif',
    section_font_family: 'Cormorant Garamond, serif',
    font_family: 'Lora, serif',
    description: 'Xanh navy · thanh lịch · hoàng gia',
    swatch: ['#1e3a8a', '#f0f4ff']
  },
  {
    label: 'Đào Hoa',
    primary_color: '#c07a85',
    heading_font_family: 'Parisienne, cursive',
    section_font_family: 'Cormorant Garamond, serif',
    font_family: 'Lora, serif',
    description: 'Hồng đất · chữ Pháp · mộng mơ',
    swatch: ['#c07a85', '#fff5f7']
  },
  {
    label: 'Đại Dương',
    primary_color: '#2a9d8f',
    heading_font_family: 'Alex Brush, cursive',
    section_font_family: 'Montserrat, sans-serif',
    font_family: 'Be Vietnam Pro, sans-serif',
    description: 'Xanh teal · chữ thảo · tươi mát',
    swatch: ['#2a9d8f', '#f0fdfa']
  }
]

// Tab order: Chữ chính → Chữ mục lớn → Chữ phụ
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
  {
    key: 'section',
    label: 'Chữ mục lớn',
    contentKey: 'section_font_family',
    options: SECTION_FONT_OPTIONS,
    previewSize: 'text-sm'
  },
  {
    key: 'body',
    label: 'Chữ phụ',
    contentKey: 'font_family',
    options: BODY_FONT_OPTIONS,
    previewSize: 'text-sm'
  }
]

// ──────────────────────────────────────────────────────────────────────────────
// FontTabsSelector
// ──────────────────────────────────────────────────────────────────────────────
function FontTabsSelector({
  content,
  onChange
}: {
  content?: Record<string, any>
  onChange: (key: string, value: string) => void
}) {
  const [activeTab, setActiveTab] = useState<FontTab | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentValues: Record<FontTab, string> = {
    heading: content?.heading_font_family || '',
    body: content?.font_family || '',
    section: content?.section_font_family || ''
  }

  // Close on click outside
  useEffect(() => {
    if (!activeTab) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveTab(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [activeTab])

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
    <div ref={containerRef}>
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

// ──────────────────────────────────────────────────────────────────────────────
// StylePresetSelect – click outside đóng dropdown
// ──────────────────────────────────────────────────────────────────────────────
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
  const wrapRef = useRef<HTMLDivElement>(null)
  const active = presets.find(isPresetActive)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className='relative' ref={wrapRef}>
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
        <div
          className='absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden'
          style={{ maxHeight: 220, overflowY: 'auto' }}
        >
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

// ──────────────────────────────────────────────────────────────────────────────
// ColorSelect – overlay dropdown, click outside đóng
// ──────────────────────────────────────────────────────────────────────────────
function ColorSelect({
  currentColor,
  onChange
}: {
  currentColor: string
  onChange: (key: string, value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className='relative flex-1 min-w-0' ref={wrapRef}>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-gray-100 bg-white hover:border-pink-200 text-left transition-all'
      >
        <span
          className='w-5 h-5 rounded-full border border-gray-200 shadow-sm shrink-0'
          style={{ background: currentColor }}
        />
        <span className='text-sm font-mono text-gray-700 truncate flex-1'>{currentColor}</span>
        <ChevronDown size={16} className={`text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className='absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-3'
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Color swatches */}
          <div className='flex flex-wrap gap-2 mb-3'>
            {COLOR_PRESETS.map((c) => (
              <button
                key={c.value}
                type='button'
                title={c.label}
                onClick={() => {
                  onChange('primary_color', c.value)
                  setOpen(false)
                }}
                className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                  currentColor === c.value ? 'border-gray-800 scale-110' : 'border-white shadow-sm hover:shadow'
                }`}
                style={{ background: c.value }}
              />
            ))}
          </div>

          {/* Custom color picker */}
          <div className='flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 bg-gray-50'>
            <div className='relative shrink-0'>
              <div
                className='w-9 h-9 rounded-lg border border-gray-200 shadow-sm cursor-pointer'
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
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// Main export
// ──────────────────────────────────────────────────────────────────────────────
export default function TabStyle({ content, onChange, onBatchChange, onReset }: TabStyleProps) {
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
      {/* Header row: Phong cách nhanh + Màu chủ đạo + Khôi phục */}
      <div>
        <div className='flex items-center justify-between mb-1'>
          <div className='grid grid-cols-2 gap-3 flex-1 mr-3'>
            <h3 className='text-base font-semibold text-gray-900'>Phong Cách Nhanh</h3>
            <h3 className='text-base font-semibold text-gray-900'>Màu Chủ Đạo</h3>
          </div>
          {onReset && (
            <button
              type='button'
              onClick={onReset}
              title='Khôi phục về mặc định'
              className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors shrink-0'
            >
              <RotateCcw size={13} />
              Khôi phục
            </button>
          )}
        </div>
        <div className='grid grid-cols-2 gap-3'>
          <StylePresetSelect presets={STYLE_PRESETS} isPresetActive={isPresetActive} onApply={applyPreset} />
          <ColorSelect currentColor={currentColor} onChange={onChange} />
        </div>
      </div>

      <div className='border-t border-gray-100' />

      {/* Kiểu chữ */}
      <div>
        <h3 className='text-base font-semibold text-gray-900 mb-1'>Kiểu Chữ</h3>
        <p className='text-sm text-gray-500 mb-3'>Chọn mục để thay đổi phông chữ tương ứng</p>
        <FontTabsSelector content={content} onChange={onChange} />
      </div>
    </div>
  )
}
