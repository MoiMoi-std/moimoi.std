import React from 'react'
import { Wedding } from '../../lib/data-service'

interface TabBankProps {
  data: Wedding['content']
  onChange: (key: string, value: string) => void
}

const TabBank: React.FC<TabBankProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    onChange(name, value)
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm space-y-6'>
      <h3 className='text-lg font-medium text-gray-900 border-b pb-2'>Banking Info</h3>

      <div className='space-y-4 max-w-lg'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Bank Name</label>
          <select
            name='bank_name'
            value={data?.bank_name || ''}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
          >
            <option value=''>Select Bank</option>
            <option value='Vietcombank'>Vietcombank</option>
            <option value='Techcombank'>Techcombank</option>
            <option value='MBBank'>MBBank</option>
            <option value='ACB'>ACB</option>
            <option value='Vietinbank'>Vietinbank</option>
            <option value='BIDV'>BIDV</option>
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Account Number</label>
          <input
            type='text'
            name='account_number'
            value={data?.account_number || ''}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono'
            placeholder='0000 0000 0000'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Account Name (Holder)</label>
          <input
            type='text'
            name='account_name'
            value={data?.account_name || ''}
            onChange={handleChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 uppercase'
            placeholder='NGUYEN VAN A'
          />
        </div>
      </div>

      <div className='bg-blue-50 border-l-4 border-blue-400 p-4 mt-4'>
        <div className='flex'>
          <div className='flex-shrink-0'>ℹ️</div>
          <div className='ml-3'>
            <p className='text-sm text-blue-700'>
              In the real version, we will call VietQR API to verify the account owner's name automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TabBank
