import React, { useState, useEffect } from 'react'
import { Wedding } from '../../lib/data-service'

interface TabInfoProps {
  content: Wedding['content']
  onChange: (key: string, value: string) => void
}

const TabInfo: React.FC<TabInfoProps> = ({ content, onChange }) => {
  const [formData, setFormData] = useState({
    groom_name: content?.groom_name || '',
    bride_name: content?.bride_name || '',
    wedding_date: content?.wedding_date || '',
    wedding_time: content?.wedding_time || '',
    address: content?.address || '',
    map_url: content?.map_url || '',
  })

  useEffect(() => {
    setFormData({
      groom_name: content?.groom_name || '',
      bride_name: content?.bride_name || '',
      wedding_date: content?.wedding_date || '',
      wedding_time: content?.wedding_time || '',
      address: content?.address || '',
      map_url: content?.map_url || '',
    })
  }, [content])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    onChange(name, value)
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm space-y-6'>
      <h3 className='text-lg font-medium text-gray-900 border-b pb-2'>Thông Tin Chính</h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Tên Chú Rể</label>
          <input
            type='text'
            name='groom_name'
            value={formData.groom_name}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
            placeholder='Nguyễn Văn A'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Tên Cô Dâu</label>
          <input
            type='text'
            name='bride_name'
            value={formData.bride_name}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
            placeholder='Lê Thị B'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Ngày Cưới</label>
          <input
            type='date'
            name='wedding_date'
            value={formData.wedding_date}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Giờ Cưới</label>
          <input
            type='time'
            name='wedding_time'
            value={formData.wedding_time}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
          />
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Địa Chỉ Tổ Chức</label>
        <input
          type='text'
          name='address'
          value={formData.address}
          onChange={handleChange}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
          placeholder='Số 123, Đường ABC, Quận 1, TP.HCM'
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Link Google Maps</label>
        <input
          type='text'
          name='map_url'
          value={formData.map_url}
          onChange={handleChange}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
          placeholder='https://maps.google.com/...'
        />
      </div>
    </div>
  )
}

export default TabInfo
