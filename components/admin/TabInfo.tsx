import React, { useEffect, useState } from 'react'
import { Wedding } from '../../lib/data-service'

interface TabInfoProps {
  data: Wedding['content']
  onChange: (key: string, value: string) => void
}

const TabInfo: React.FC<TabInfoProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onChange(name, value)
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm space-y-6'>
      <h3 className='text-lg font-medium text-gray-900 border-b pb-2'>Main Information</h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Groom Name</label>
          <input
            type='text'
            name='groom_name'
            value={data?.groom_name || ''}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
            placeholder='Nguyen Van A'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Bride Name</label>
          <input
            type='text'
            name='bride_name'
            value={data?.bride_name || ''}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
            placeholder='Le Thi B'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Wedding Date</label>
          <input
            type='date'
            name='wedding_date'
            value={data?.wedding_date || ''}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Wedding Time</label>
          <input
            type='time'
            name='wedding_time'
            value={data?.wedding_time || ''}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
          />
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
        <input
          type='text'
          name='address'
          value={data?.address || ''}
          onChange={handleChange}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
          placeholder='123 Street, District 1, HCMC'
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Google Maps URL</label>
        <input
          type='text'
          name='map_url'
          value={data?.map_url || ''}
          onChange={handleChange}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
          placeholder='https://maps.google.com/...'
        />
      </div>
    </div>
  )
}

export default TabInfo
