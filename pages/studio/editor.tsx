import { CreditCard, Image as ImageIcon, Info, Save, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import StudioEmptyState from '../../components/studio/StudioEmptyState'
import LivePreview from '../../components/studio/LivePreview'
import StudioLayout from '../../components/studio/StudioLayout'
import StudioLoading from '../../components/studio/StudioLoading'
import TabAlbum from '../../components/studio/TabAlbum'
import TabBank from '../../components/studio/TabBank'
import TabInfo from '../../components/studio/TabInfo'
import { useToast } from '../../components/ui/ToastProvider'
import { dataService } from '../../lib/data-service'
import { useWedding } from '../../lib/useWedding'

const Editor = () => {
  const { wedding, setWedding, loading } = useWedding()
  const [activeTab, setActiveTab] = useState<'info' | 'album' | 'bank' | 'admin'>('info')
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [adminJsonDraft, setAdminJsonDraft] = useState('')
  const [customFieldKey, setCustomFieldKey] = useState('')
  const [customFieldValue, setCustomFieldValue] = useState('')
  const [adminLogs, setAdminLogs] = useState<string[]>([])
  const { success, error } = useToast()

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

  const handlePublish = async () => {
    if (!wedding) return
    setPublishing(true)
    try {
      // Lưu content trước
      await dataService.updateWedding(wedding.id, wedding.content)

      // Cập nhật deployment_status sang published
      const supabase = (await import('../../lib/initSupabase')).supabase
      const { error: publishError } = await supabase
        .from('weddings')
        .update({ deployment_status: 'published' })
        .eq('id', wedding.id)

      if (publishError) throw publishError

      setWedding({ ...wedding, deployment_status: 'published' })
      success('Xuất bản thành công! Thiệp của bạn đã được công khai.')
    } catch (e) {
      error('Xuất bản thất bại. Vui lòng thử lại.')
    } finally {
      setPublishing(false)
    }
  }

  useEffect(() => {
    if (isAdminMode && wedding) {
      setAdminJsonDraft(JSON.stringify(wedding.content || {}, null, 2))
    }
  }, [isAdminMode, wedding])

  useEffect(() => {
    if (!isAdminMode && activeTab === 'admin') {
      setActiveTab('info')
    }
  }, [isAdminMode, activeTab])

  const applyAdminJson = () => {
    if (!wedding) return
    try {
      const parsed = JSON.parse(adminJsonDraft || '{}')
      setWedding({ ...wedding, content: parsed })
      setAdminLogs((prev) => [`Cập nhật JSON lúc ${new Date().toLocaleTimeString()}`, ...prev])
      success('Đã áp dụng JSON nâng cao!')
    } catch (err) {
      error('JSON không hợp lệ. Vui lòng kiểm tra lại.')
    }
  }

  const addCustomField = () => {
    if (!wedding || !customFieldKey.trim()) return
    const updated = {
      ...wedding.content,
      [customFieldKey]: customFieldValue
    }
    setWedding({ ...wedding, content: updated })
    setAdminJsonDraft(JSON.stringify(updated || {}, null, 2))
    setAdminLogs((prev) => [`Thêm field "${customFieldKey}"`, ...prev])
    setCustomFieldKey('')
    setCustomFieldValue('')
    success('Đã thêm field tùy chỉnh.')
  }

  if (loading)
    return (
      <StudioLayout>
        <StudioLoading message='Đang tải trình chỉnh sửa...' />
      </StudioLayout>
    )

  return (
    <StudioLayout>
      <div className='mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <h2 className='text-3xl font-serif font-bold text-gray-900'>Chỉnh Sửa Thiệp</h2>
          <p className='text-gray-500 mt-1'>Tùy chỉnh nội dung thiệp mời của bạn</p>
        </div>
        <div className='flex flex-wrap items-center gap-4'>
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
          <button
            onClick={handleSave}
            disabled={saving || publishing}
            className='flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all shadow-lg shadow-gray-200 disabled:opacity-50 font-medium'
          >
            {saving ? (
              'Đang lưu...'
            ) : (
              <>
                <Save size={18} className='mr-2' /> Lưu bản nháp
              </>
            )}
          </button>
          <button
            onClick={handlePublish}
            disabled={saving || publishing}
            className='flex items-center justify-center px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-all shadow-lg shadow-pink-200 disabled:opacity-50 font-medium'
          >
            {publishing ? (
              'Đang xuất bản...'
            ) : (
              <>
                <Save size={18} className='mr-2' /> Xuất Bản
              </>
            )}
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8'>
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
            {isAdminMode && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 py-4 text-center font-medium transition-colors border-b-2 ${
                  activeTab === 'admin'
                    ? 'border-pink-500 text-pink-600 bg-pink-50/30'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className='flex items-center justify-center gap-2'>
                  <Shield size={18} /> Quản Trị
                </div>
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className='p-8'>
            <div className={activeTab === 'info' ? 'block' : 'hidden'}>
              <TabInfo content={wedding?.content} onChange={handleInfoChange} />
            </div>
            <div className={activeTab === 'album' ? 'block' : 'hidden'}>
              <TabAlbum images={wedding?.content?.images || []} onChange={handleImagesChange} />
            </div>
            <div className={activeTab === 'bank' ? 'block' : 'hidden'}>
              <TabBank content={wedding?.content} onChange={handleInfoChange} />
            </div>
            {activeTab === 'admin' && (
              <div className='space-y-6'>
                <div className='bg-pink-50/60 border border-pink-100 rounded-2xl p-5'>
                  <h4 className='font-bold text-gray-900 mb-2'>JSON nội dung (nâng cao)</h4>
                  <p className='text-sm text-gray-500 mb-4'>Dành cho dev chỉnh sửa trực tiếp cấu trúc dữ liệu thiệp.</p>
                  <textarea
                    value={adminJsonDraft}
                    onChange={(e) => setAdminJsonDraft(e.target.value)}
                    rows={12}
                    className='w-full rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pink-200'
                  />
                  <div className='mt-4 flex flex-wrap gap-3'>
                    <button
                      onClick={applyAdminJson}
                      className='px-5 py-2 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700'
                    >
                      Áp dụng JSON
                    </button>
                    <button
                      onClick={() => setAdminJsonDraft(JSON.stringify(wedding?.content || {}, null, 2))}
                      className='px-5 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-50'
                    >
                      Reset JSON
                    </button>
                  </div>
                </div>

                <div className='grid gap-4 md:grid-cols-2'>
                  <div className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'>
                    <h4 className='font-bold text-gray-900 mb-3'>Thêm field tùy chỉnh</h4>
                    <div className='space-y-3'>
                      <input
                        value={customFieldKey}
                        onChange={(e) => setCustomFieldKey(e.target.value)}
                        placeholder='Tên field (vd: theme_color)'
                        className='w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200'
                      />
                      <input
                        value={customFieldValue}
                        onChange={(e) => setCustomFieldValue(e.target.value)}
                        placeholder='Giá trị'
                        className='w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200'
                      />
                      <button
                        onClick={addCustomField}
                        className='w-full px-4 py-2 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800'
                      >
                        Thêm field
                      </button>
                    </div>
                  </div>

                  <div className='bg-white border border-gray-100 rounded-2xl p-5 shadow-sm'>
                    <h4 className='font-bold text-gray-900 mb-3'>Log thay đổi (mock)</h4>
                    <div className='space-y-2 text-sm text-gray-500 max-h-48 overflow-auto'>
                      {adminLogs.length === 0 ? (
                        <div className='text-gray-400'>Chưa có thay đổi nào.</div>
                      ) : (
                        adminLogs.map((log, index) => (
                          <div key={index} className='border-b border-gray-100 pb-2'>
                            {log}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <LivePreview content={wedding?.content} />
      </div>
    </StudioLayout>
  )
}

export default Editor
