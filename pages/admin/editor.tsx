import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import TabInfo from '../../components/admin/TabInfo'
import TabAlbum from '../../components/admin/TabAlbum'
import TabBank from '../../components/admin/TabBank'
import { Wedding, dataService } from '../../lib/data-service'

const Editor = () => {
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'info' | 'album' | 'bank'>('info')
  const [saving, setSaving] = useState(false)

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
    await dataService.updateWedding(wedding.id, wedding.content)
    setSaving(false)
    alert('Changes saved successfully!')
  }

  if (loading) return <AdminLayout>Loading...</AdminLayout>
  if (!wedding) return <AdminLayout>Error loading data</AdminLayout>

  return (
    <AdminLayout>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-3xl font-bold text-gray-800'>Editor</h2>
          <p className='text-gray-600'>Update your wedding details</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className='bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors disabled:bg-pink-300'
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className='bg-white rounded-lg shadow-sm mb-6'>
        <div className='flex border-b'>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'info' ? 'text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('info')}
          >
            Info & Location
            {activeTab === 'info' && <div className='absolute bottom-0 left-0 w-full h-0.5 bg-pink-600'></div>}
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'album' ? 'text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('album')}
          >
            Photo Album
            {activeTab === 'album' && <div className='absolute bottom-0 left-0 w-full h-0.5 bg-pink-600'></div>}
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${activeTab === 'bank' ? 'text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('bank')}
          >
            Bank & Gift
            {activeTab === 'bank' && <div className='absolute bottom-0 left-0 w-full h-0.5 bg-pink-600'></div>}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className='transition-all duration-300'>
        {activeTab === 'info' && <TabInfo data={wedding.content} onChange={handleInfoChange} />}
        {activeTab === 'album' && (
          <TabAlbum images={wedding.content.images || []} onImagesChange={handleImagesChange} />
        )}
        {activeTab === 'bank' && <TabBank data={wedding.content} onChange={handleInfoChange} />}
      </div>
    </AdminLayout>
  )
}

export default Editor
