import React, { useState, useEffect } from 'react'
import { Wedding } from '../../lib/data-service'
import { Solar, Lunar } from 'lunar-javascript'

interface TabInfoProps {
  content?: Wedding['content']
  onChange: (key: string, value: string) => void
}

const TabInfo: React.FC<TabInfoProps> = ({ content, onChange }) => {
  const [formData, setFormData] = useState({
    groom_name: content?.groom_name || '',
    groom_role: content?.groom_role || '',
    groom_image: content?.groom_image || '',
    groom_address: content?.groom_address || '',
    bride_name: content?.bride_name || '',
    bride_role: content?.bride_role || '',
    bride_image: content?.bride_image || '',
    bride_address: content?.bride_address || '',
    wedding_date: content?.wedding_date || '',
    lunar_date: content?.lunar_date || '',
    wedding_time: content?.wedding_time || '',
    event_date: content?.event_date || '',
    party_time: content?.party_time || '',
    address: content?.address || '',
    map_url: content?.map_url || '',
    groom_father_name: content?.groom_father_name || '',
    groom_mother_name: content?.groom_mother_name || '',
    groom_city: content?.groom_city || '',
    bride_father_name: content?.bride_father_name || '',
    bride_mother_name: content?.bride_mother_name || '',
    bride_city: content?.bride_city || ''
  })

  useEffect(() => {
    setFormData({
      groom_name: content?.groom_name || '',
      groom_role: content?.groom_role || '',
      groom_image: content?.groom_image || '',
      groom_address: content?.groom_address || '',
      bride_name: content?.bride_name || '',
      bride_role: content?.bride_role || '',
      bride_image: content?.bride_image || '',
      bride_address: content?.bride_address || '',
      wedding_date: content?.wedding_date || '',
      lunar_date: content?.lunar_date || '',
      wedding_time: content?.wedding_time || '',
      event_date: content?.event_date || '',
      party_time: content?.party_time || '',
      address: content?.address || '',
      map_url: content?.map_url || '',
      groom_father_name: content?.groom_father_name || '',
      groom_mother_name: content?.groom_mother_name || '',
      groom_city: content?.groom_city || '',
      bride_father_name: content?.bride_father_name || '',
      bride_mother_name: content?.bride_mother_name || '',
      bride_city: content?.bride_city || ''
    })
  }, [content])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === 'wedding_date') {
      try {
        const [year, month, day] = value.split('-').map(Number)
        if (year && month && day) {
          const solar = Solar.fromYmd(year, month, day)
          const lunar = solar.getLunar()
          const lunarStr = `${lunar.getYear()}-${String(lunar.getMonth()).padStart(2, '0')}-${String(lunar.getDay()).padStart(2, '0')}`

          setFormData((prev) => ({ ...prev, wedding_date: value, lunar_date: lunarStr }))
          onChange('wedding_date', value)
          onChange('lunar_date', lunarStr)
          return
        }
      } catch (err) {}
    } else if (name === 'lunar_date') {
      try {
        const [year, month, day] = value.split('-').map(Number)
        if (year && month && day) {
          const lunar = Lunar.fromYmd(year, month, day)
          const solar = lunar.getSolar()
          const solarStr = `${solar.getYear()}-${String(solar.getMonth()).padStart(2, '0')}-${String(solar.getDay()).padStart(2, '0')}`

          setFormData((prev) => ({ ...prev, lunar_date: value, wedding_date: solarStr }))
          onChange('lunar_date', value)
          onChange('wedding_date', solarStr)
          return
        }
      } catch (err) {}
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
    onChange(name, value)
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm space-y-6'>
      <h3 className='text-lg font-medium text-gray-900 border-b pb-2'>Thông Tin Chính</h3>

      <div className='grid grid-cols-1 md:grid-cols-1 gap-6'>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Tên & Vai trò (Chú Rể)</label>
            <div className='flex gap-2'>
              <input
                type='text'
                name='groom_name'
                value={formData.groom_name}
                onChange={handleChange}
                className='w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
                placeholder='Nguyễn Văn A'
              />
              <input
                type='text'
                name='groom_role'
                value={formData.groom_role}
                onChange={handleChange}
                className='w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
                placeholder='Trưởng nam'
              />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Địa chỉ (Chú Rể)</label>
            <input
              type='text'
              name='groom_address'
              value={formData.groom_address}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
              placeholder='Số 1, Đường 2...'
            />
          </div>
        </div>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Tên & Vai trò (Cô Dâu)</label>
            <div className='flex gap-2'>
              <input
                type='text'
                name='bride_name'
                value={formData.bride_name}
                onChange={handleChange}
                className='w-2/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
                placeholder='Lê Thị B'
              />
              <input
                type='text'
                name='bride_role'
                value={formData.bride_role}
                onChange={handleChange}
                className='w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
                placeholder='Trưởng nữ'
              />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Địa chỉ (Cô Dâu)</label>
            <input
              type='text'
              name='bride_address'
              value={formData.bride_address}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
              placeholder='Số 1, Đường 2...'
            />
          </div>
        </div>
      </div>

      {/* Family Info */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Nhà Trai */}
        <div className='space-y-4'>
          <h4 className='text-sm font-semibold text-gray-800 border-b pb-1'>Nhà Trai</h4>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Tên Cha</label>
            <input
              type='text'
              name='groom_father_name'
              value={formData.groom_father_name}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
              placeholder='Nguyễn Văn X'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Tên Mẹ</label>
            <input
              type='text'
              name='groom_mother_name'
              value={formData.groom_mother_name}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
              placeholder='Trần Thị Y'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Thành Phố</label>
            <input
              type='text'
              name='groom_city'
              value={formData.groom_city}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
              placeholder='TP. Hồ Chí Minh'
            />
          </div>
        </div>

        {/* Nhà Gái */}
        <div className='space-y-4'>
          <h4 className='text-sm font-semibold text-gray-800 border-b pb-1'>Nhà Gái</h4>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Tên Cha</label>
            <input
              type='text'
              name='bride_father_name'
              value={formData.bride_father_name}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
              placeholder='Lê Văn X'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Tên Mẹ</label>
            <input
              type='text'
              name='bride_mother_name'
              value={formData.bride_mother_name}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
              placeholder='Phạm Thị Y'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Thành Phố</label>
            <input
              type='text'
              name='bride_city'
              value={formData.bride_city}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
              placeholder='Hà Nội'
            />
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Ngày Cưới (Dương)</label>
          <input
            type='date'
            name='wedding_date'
            value={formData.wedding_date}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Ngày Cưới (Âm)</label>
          <input
            type='date'
            name='lunar_date'
            value={formData.lunar_date}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Ngày Đón Khách</label>
          <input
            type='date'
            name='event_date'
            value={formData.event_date}
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
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Giờ Đón Khách</label>
          <input
            type='time'
            name='party_time'
            value={formData.party_time}
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
        <label className='block text-sm font-medium text-gray-700 mb-1'>Google Maps Embed</label>
        <textarea
          name='map_url'
          value={formData.map_url}
          onChange={handleChange}
          rows={3}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none text-xs'
          placeholder='Dán thẻ <iframe> hoặc link embed từ Google Maps (Share → Embed a map)'
        />
        <p className='text-xs text-gray-400 mt-1'>
          Vào Google Maps → Chia sẻ → Nhúng bản đồ → Sao chép thẻ &lt;iframe&gt; và dán vào đây
        </p>
      </div>
    </div>
  )
}

export default TabInfo
