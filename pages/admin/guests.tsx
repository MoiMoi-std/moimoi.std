import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { RSVP, Wedding, dataService } from '../../lib/data-service'

const Guests = () => {
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [guestName, setGuestName] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const weddingData = await dataService.getWedding()
      let rsvpData: RSVP[] = []
      if (weddingData) {
        rsvpData = await dataService.getRSVPs(weddingData.id)
      }
      setWedding(weddingData)
      setRsvps(rsvpData)
      setLoading(false)
    }
    fetchData()
  }, [])

  const generateLink = () => {
    if (!guestName.trim() || !wedding) return
    const link = `https://moimoi.vn/${wedding.slug}?g=${encodeURIComponent(guestName)}`
    setGeneratedLink(link)
  }

  const copyToClipboard = () => {
    if (!generatedLink) return
    // In a real browser this works, but for mock sometimes we need clipboard API support.
    // We'll assume simplest fallback or just alert for now since permissions might vary.
    navigator.clipboard
      .writeText(generatedLink)
      .then(() => {
        alert('Link copied to clipboard!')
      })
      .catch(() => {
        alert('Failed to copy. Please manually copy the link.')
      })
  }

  const handleExport = async () => {
    if (wedding) {
      await dataService.exportRSVPs(wedding.id)
    }
  }

  if (loading) return <AdminLayout>Loading...</AdminLayout>

  return (
    <AdminLayout>
      <div className='mb-8'>
        <h2 className='text-3xl font-bold text-gray-800'>Guest Manager</h2>
        <p className='text-gray-600'>Manage invitations and RSVPs</p>
      </div>

      {/* Link Generator */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>Create Invitation Link</h3>
        <div className='flex flex-col md:flex-row gap-4'>
          <input
            type='text'
            className='flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
            placeholder='Enter guest name (e.g. Anh Nam)'
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
          <button
            onClick={generateLink}
            disabled={!guestName.trim()}
            className='bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 transition-colors disabled:bg-gray-400'
          >
            Generate Link
          </button>
        </div>

        {generatedLink && (
          <div className='mt-4 p-4 bg-green-50 rounded-md border border-green-200 flex flex-col md:flex-row justify-between items-center gap-4'>
            <code className='text-green-800 break-all'>{generatedLink}</code>
            <div className='flex gap-2'>
              <button
                onClick={copyToClipboard}
                className='text-sm bg-white border border-green-300 text-green-700 px-3 py-1 rounded hover:bg-green-100 transition-colors'
              >
                Copy
              </button>
              <button
                className='text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors'
                onClick={() => window.open(`http://zalo.me/share/?url=${encodeURIComponent(generatedLink)}`, '_blank')}
              >
                Share Zalo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RSVP Table */}
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-100 flex justify-between items-center'>
          <h3 className='text-lg font-medium text-gray-900'>RSVP List</h3>
          <button
            onClick={handleExport}
            className='text-sm text-gray-600 hover:text-pink-600 flex items-center font-medium border px-3 py-1 rounded hover:border-pink-600 transition-colors'
          >
            📥 Export Excel
          </button>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left'>
            <thead className='bg-gray-50 text-gray-600 text-sm uppercase'>
              <tr>
                <th className='px-6 py-3'>Guest Name</th>
                <th className='px-6 py-3'>Phone</th>
                <th className='px-6 py-3'>Attending</th>
                <th className='px-6 py-3'>Party Size</th>
                <th className='px-6 py-3'>Wishes</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {rsvps.map((rsvp) => (
                <tr key={rsvp.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 font-medium text-gray-900'>{rsvp.guest_name}</td>
                  <td className='px-6 py-4 text-gray-600'>{rsvp.phone}</td>
                  <td className='px-6 py-4'>
                    {rsvp.is_attending ? (
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                        Yes
                      </span>
                    ) : (
                      <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                        No
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4 text-gray-600'>{rsvp.party_size}</td>
                  <td className='px-6 py-4 text-gray-500 text-sm max-w-xs truncate' title={rsvp.wishes || ''}>
                    {rsvp.wishes || '-'}
                  </td>
                </tr>
              ))}
              {rsvps.length === 0 && (
                <tr>
                  <td colSpan={5} className='px-6 py-8 text-center text-gray-500'>
                    No RSVPs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Guests
