import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Wedding, RSVP, dataService } from '../../lib/data-service'
import Link from 'next/link'

const Dashboard = () => {
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) return <AdminLayout>Loading...</AdminLayout>
  if (!wedding)
    return <AdminLayout>Error loading data. Are you sure you have set up the seed data correctly?</AdminLayout>

  const attendingCount = rsvps.filter((r) => r.is_attending).reduce((acc, curr) => acc + (curr.party_size || 0), 0)
  const totalGuests = rsvps.reduce((acc, curr) => acc + (curr.party_size || 0), 0)

  // Parse date safely
  const daysLeft = wedding.content.wedding_date
    ? Math.max(
        0,
        Math.ceil((new Date(wedding.content.wedding_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      )
    : 0

  return (
    <AdminLayout>
      <div className='mb-8'>
        <h2 className='text-3xl font-bold text-gray-800'>Dashboard</h2>
        <p className='text-gray-600'>Overview of your wedding invitation</p>
      </div>

      {/* Status Card */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-pink-500'>
        <div className='flex justify-between items-center'>
          <div>
            <h3 className='text-lg font-medium text-gray-900'>Current Status</h3>
            <div className='mt-2 flex items-center space-x-2'>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold 
                ${
                  wedding.deployment_status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : wedding.deployment_status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                }`}
              >
                {(wedding.deployment_status || 'DRAFT').toUpperCase()}
              </span>
              {wedding.deployment_status === 'published' && (
                <span className='text-sm text-gray-500'>Last updated: 2 hours ago</span>
              )}
            </div>
          </div>
          {wedding.deployment_status === 'published' ? (
            <div className='flex flex-col items-end'>
              <a
                href={`https://moimoi.vn/${wedding.slug}`}
                target='_blank'
                rel='noreferrer'
                className='text-pink-600 hover:underline font-medium flex items-center'
              >
                moimoi.vn/{wedding.slug} ↗
              </a>
              <button
                className='text-xs text-gray-500 hover:text-gray-700 mt-1'
                onClick={() => alert('Copied to clipboard!')}
              >
                Copy Link
              </button>
            </div>
          ) : (
            <Link href='/admin/settings'>
              <button className='bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors'>
                Go to Publish
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow-sm'>
          <div className='text-gray-500 text-sm font-medium uppercase'>Total Invitations</div>
          <div className='mt-2 text-3xl font-bold text-gray-900'>{rsvps.length}</div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-sm'>
          <div className='text-gray-500 text-sm font-medium uppercase'>Confirmed Attending</div>
          <div className='mt-2 text-3xl font-bold text-green-600'>{attendingCount}</div>
          <div className='text-xs text-gray-400 mt-1'>Guests</div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-sm'>
          <div className='text-gray-500 text-sm font-medium uppercase'>Days Left</div>
          <div className='mt-2 text-3xl font-bold text-blue-600'>{daysLeft}</div>
          <div className='text-xs text-gray-400 mt-1'>Until Big Day</div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Dashboard
