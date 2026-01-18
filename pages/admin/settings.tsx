import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Template, Wedding, dataService } from '../../lib/data-service'

const Settings = () => {
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const weddingData = await dataService.getWedding()
      const templateData = await dataService.getTemplates()
      setWedding(weddingData)
      setTemplates(templateData)
      if (weddingData) {
        setSelectedTemplateId(weddingData.template_id)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const handlePublish = async () => {
    setDeploying(true)
    // Update template if changed
    if (wedding && selectedTemplateId && selectedTemplateId !== wedding.template_id) {
      await dataService.updateWeddingTemplate(wedding.id, selectedTemplateId)
    }

    // Call deploy - using wedding ID as the trigger
    const result = await dataService.deployWedding(wedding?.id || '')

    setDeploying(false)
    if (result.success) {
      alert('Wedding website published successfully!')
      // Update local state to reflect published
      if (wedding) setWedding({ ...wedding, deployment_status: 'published' })
    } else {
      alert('Failed to publish. Please try again.')
    }
  }

  if (loading) return <AdminLayout>Loading...</AdminLayout>
  if (!wedding) return <AdminLayout>Error loading data</AdminLayout>

  return (
    <AdminLayout>
      <div className='mb-8'>
        <h2 className='text-3xl font-bold text-gray-800'>Settings</h2>
        <p className='text-gray-600'>Configuration and Deployment</p>
      </div>

      <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>Choose Template</h3>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className={`border-2 rounded-lg p-2 cursor-pointer transition-all ${selectedTemplateId === tpl.id ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-200 hover:border-gray-300'}`}
              onClick={() => setSelectedTemplateId(tpl.id)}
            >
              <div className='aspect-w-16 aspect-h-9 bg-gray-100 rounded mb-3 overflow-hidden'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tpl.thumbnail_url || 'https://via.placeholder.com/300x200'}
                  alt={tpl.name}
                  className='object-cover w-full h-full'
                />
              </div>
              <div className='flex justify-between items-center px-1'>
                <span className='font-medium text-gray-800'>{tpl.name}</span>
                {selectedTemplateId === tpl.id && <span className='text-pink-600 text-sm font-bold'>Selected</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='bg-white p-6 rounded-lg shadow-md'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>Publication</h3>
        <p className='text-gray-600 mb-6'>
          When you are ready, click Publish to build your wedding website. This process usually takes 2-3 minutes.
        </p>

        <div className='flex items-center space-x-4'>
          <button
            onClick={handlePublish}
            disabled={deploying}
            className={`flex items-center px-6 py-3 rounded-md text-white font-medium transition-colors ${
              deploying ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'
            }`}
          >
            {deploying ? (
              <>
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Publishing...
              </>
            ) : (
              'Publish Website'
            )}
          </button>

          {wedding.deployment_status === 'published' && !deploying && (
            <span className='text-green-600 font-medium flex items-center'>✓ Currently Live</span>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default Settings
