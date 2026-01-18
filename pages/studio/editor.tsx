import { CreditCard, Image as ImageIcon, Info, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import StudioLayout from '../../components/studio/StudioLayout'
import TabAlbum from '../../components/studio/TabAlbum'
import TabBank from '../../components/studio/TabBank'
import TabInfo from '../../components/studio/TabInfo'
import { useToast } from '../../components/ui/ToastProvider'
import { Wedding, dataService } from '../../lib/data-service'

const Editor = () => {
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'info' | 'album' | 'bank'>('info')
  const [saving, setSaving] = useState(false)
  const { success, error } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      const data = await dataService.getWedding()
      setWedding(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleInfoChange = (key: string, value: string) => {
    if (!wedding) return
    setWedding({
      ...wedding,
      content: { ...wedding.content, [key]: value }
    })
  }

  const handleImagesChange = (images: string[]) => {
    if (!wedding) return
    setWedding({
      ...wedding,
      content: { ...wedding.content, images }
    })
  }

  const handleSave = async () => {
    if (!wedding) return
    setSaving(true)
    try {
      await dataService.updateWedding(wedding.id, wedding.content)
      success('Lưu thay đổi thành công!')
    } catch (e) {
      error('Lưu thất bại. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <StudioLayout>
        <div className='flex items-center justify-center h-full'>
          <div className='text-pink-600 animate-pulse text-lg'>Đang tải trình chỉnh sửa...</div>
        </div>
      </StudioLayout>
    )

  if (!wedding)
    return (
      <StudioLayout>
        <div className='text-center mt-10 text-gray-500'>Vui lòng tạo đám cưới trước.</div>
      </StudioLayout>
    )

  return (
    <StudioLayout>
      <div className='mb-8 flex justify-between items-end'>
        <div>
          <h2 className='text-3xl font-serif font-bold text-gray-900'>Chỉnh Sửa Thiệp</h2>
          <p className='text-gray-500 mt-1'>Tùy chỉnh nội dung thiệp mời của bạn</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className='flex items-center px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-all shadow-lg shadow-pink-200 disabled:opacity-50 font-medium'
        >
          {saving ? (
            'Đang lưu...'
          ) : (
            <>
              <Save size={18} className='mr-2' /> Lưu thay đổi
            </>
          )}
        </button>
      </div>

      <div className='bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden min-h-[600px]'>
        {/* Modern Tabs */}
        <div className='flex border-b border-gray-100'>
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-4 text-center font-medium transition-colors border-b-2 ${
              activeTab === 'info'
                ? 'border-pink-500 text-pink-600 bg-pink-50/30'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className='flex items-center justify-center gap-2'>
              <Info size={18} /> Thông Tin & Địa Điểm
            </div>
          </button>
          <button
            onClick={() => setActiveTab('album')}
            className={`flex-1 py-4 text-center font-medium transition-colors border-b-2 ${
              activeTab === 'album'
                ? 'border-pink-500 text-pink-600 bg-pink-50/30'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className='flex items-center justify-center gap-2'>
              <ImageIcon size={18} /> Album Ảnh
            </div>
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`flex-1 py-4 text-center font-medium transition-colors border-b-2 ${
              activeTab === 'bank'
                ? 'border-pink-500 text-pink-600 bg-pink-50/30'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className='flex items-center justify-center gap-2'>
              <CreditCard size={18} /> Ngân Hàng & Quà
            </div>
          </button>
        </div>

        {/* Tab Content with Animation Placeholder */}
        <div className='p-8 animate-in fade-in slide-in-from-bottom-2 duration-300'>
          {activeTab === 'info' && <TabInfo content={wedding.content} onChange={handleInfoChange} />}
          {activeTab === 'album' && <TabAlbum images={wedding.content.images || []} onChange={handleImagesChange} />}
          {activeTab === 'bank' && <TabBank content={wedding.content} onChange={handleInfoChange} />}
        </div>
      </div>
    </StudioLayout>
  )
}

export default Editor
