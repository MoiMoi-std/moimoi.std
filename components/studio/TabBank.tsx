import React, { useState, useEffect } from 'react'
import { Wedding } from '../../lib/data-service'
import { X, Search, Check } from 'lucide-react'

interface Bank {
  code: string
  name: string
  shortName: string
}

const BANKS: Bank[] = [
  { code: 'Vietcombank', name: 'Ngân hàng TMCP Ngoại thương Việt Nam', shortName: 'Vietcombank' },
  { code: 'BIDV', name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', shortName: 'BIDV' },
  { code: 'Vietinbank', name: 'Ngân hàng TMCP Công thương Việt Nam', shortName: 'VIETINBANK' },
  { code: 'Agribank', name: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam', shortName: 'AGRIBANK' },
  { code: 'ABBank', name: 'Ngân hàng An Bình', shortName: 'ABBANK' },
  { code: 'ACB', name: 'Ngân hàng Á Châu', shortName: 'ACB' },
  { code: 'ANZ', name: 'Ngân hàng TNHH Một Thành Viên ANZ Việt Nam', shortName: 'ANZ' },
  { code: 'BacABank', name: 'Ngân hàng Bắc Á', shortName: 'BAC A BANK' },
  { code: 'Bangkok Bank', name: 'Ngân hàng Bangkok Bank - CN TP Hồ Chí Minh', shortName: 'BANGKOK BANK' },
  { code: 'BaoViet Bank', name: 'Ngân hàng Bảo Việt', shortName: 'BAO VIET BANK' },
  { code: 'DongA Bank', name: 'Ngân hàng TMCP Đông Á', shortName: 'DongA Bank' },
  { code: 'Eximbank', name: 'Ngân hàng TMCP Xuất Nhập khẩu', shortName: 'Eximbank' },
  { code: 'HDBank', name: 'Ngân hàng TMCP Phát triển TP.HCM', shortName: 'HDBank' },
  { code: 'LienVietPostBank', name: 'Ngân hàng TMCP Bưu điện Liên Việt', shortName: 'LienVietPostBank' },
  { code: 'MBBank', name: 'Ngân hàng TMCP Quân đội', shortName: 'MBBank' },
  { code: 'MSB', name: 'Ngân hàng TMCP Hàng Hải', shortName: 'MSB' },
  { code: 'Nam A Bank', name: 'Ngân hàng TMCP Nam Á', shortName: 'Nam A Bank' },
  { code: 'NCB', name: 'Ngân hàng TMCP Quốc Dân', shortName: 'NCB' },
  { code: 'OCB', name: 'Ngân hàng TMCP Phương Đông', shortName: 'OCB' },
  { code: 'PVcomBank', name: 'Ngân hàng TMCP Đại Chúng Việt Nam', shortName: 'PVcomBank' },
  { code: 'Sacombank', name: 'Ngân hàng TMCP Sài Gòn Thương Tín', shortName: 'Sacombank' },
  { code: 'SCB', name: 'Ngân hàng TMCP Sài Gòn', shortName: 'SCB' },
  { code: 'SeABank', name: 'Ngân hàng TMCP Đông Nam Á', shortName: 'SeABank' },
  { code: 'SHB', name: 'Ngân hàng TMCP Sài Gòn - Hà Nội', shortName: 'SHB' },
  { code: 'Techcombank', name: 'Ngân hàng TMCP Kỹ thương Việt Nam', shortName: 'Techcombank' },
  { code: 'TPBank', name: 'Ngân hàng TMCP Tiên Phong', shortName: 'TPBank' },
  { code: 'VIB', name: 'Ngân hàng TMCP Quốc tế', shortName: 'VIB' },
  { code: 'VietABank', name: 'Ngân hàng TMCP Việt Á', shortName: 'VietABank' },
  { code: 'VietBank', name: 'Ngân hàng TMCP Việt Nam Thương Tín', shortName: 'VietBank' },
  { code: 'VietCapital Bank', name: 'Ngân hàng TMCP Bản Việt', shortName: 'VietCapital Bank' },
  { code: 'VPBank', name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng', shortName: 'VPBank' },
  { code: 'Woori Bank', name: 'Ngân hàng TNHH MTV Woori Việt Nam', shortName: 'Woori Bank' }
]

interface TabBankProps {
  content?: Wedding['content']
  onChange: (key: string, value: string) => void
}

const TabBank: React.FC<TabBankProps> = ({ content, onChange }) => {
  const [formData, setFormData] = useState({
    bank_name: content?.bank_name || '',
    account_number: content?.account_number || '',
    account_name: content?.account_name || ''
  })
  const [showBankModal, setShowBankModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const formatAccountNumber = (value: string) => {
    // Loại bỏ khoảng trắng và chỉ lấy số
    const numbersOnly = value.replace(/\D/g, '').slice(0, 12)
    // Format thành nhóm 4 số
    return numbersOnly.replace(/(.{4})/g, '$1 ').trim()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Chỉ cho phép nhập số cho trường account_number và giới hạn 12 ký tự
    if (name === 'account_number') {
      const numbersOnly = value.replace(/\D/g, '').slice(0, 12)
      setFormData((prev) => ({ ...prev, [name]: numbersOnly }))
      onChange(name, numbersOnly)
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
    onChange(name, value)
  }

  const handleBankSelect = (bankCode: string) => {
    setFormData((prev) => ({ ...prev, bank_name: bankCode }))
    onChange('bank_name', bankCode)
    setShowBankModal(false)
    setSearchQuery('')
  }

  // Backend logic: tìm kiếm ngân hàng theo tên đầy đủ, tên viết tắt và code
  const filteredBanks = BANKS.filter((bank) => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return true

    return (
      bank.code.toLowerCase().includes(query) ||
      bank.shortName.toLowerCase().includes(query) ||
      bank.name.toLowerCase().includes(query) ||
      // Tìm kiếm không dấu
      bank.shortName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .includes(query) ||
      bank.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .includes(query)
    )
  })

  const selectedBank = BANKS.find((b) => b.code === formData.bank_name)

  return (
    <>
      <div className='bg-white p-6 rounded-lg shadow-sm space-y-6'>
        <h3 className='text-lg font-medium text-gray-900 border-b pb-2'>Thông Tin Ngân Hàng</h3>

        <div className='space-y-4 max-w-lg'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Tên Ngân Hàng</label>
            <button
              type='button'
              onClick={() => setShowBankModal(true)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-left bg-white hover:bg-gray-50'
            >
              {selectedBank ? (
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm'>
                    {selectedBank.shortName.charAt(0)}
                  </div>
                  <div>
                    <div className='font-medium text-gray-900'>{selectedBank.shortName}</div>
                    <div className='text-xs text-gray-500'>{selectedBank.name}</div>
                  </div>
                </div>
              ) : (
                <span className='text-gray-400'>Chọn ngân hàng</span>
              )}
            </button>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Số Tài Khoản</label>
            <input
              type='text'
              name='account_number'
              value={formatAccountNumber(formData.account_number)}
              onChange={handleChange}
              maxLength={14}
              inputMode='numeric'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono'
              placeholder='0000 0000 0000'
            />
            <p className='mt-1 text-xs text-gray-500'>Chỉ nhập số, tối đa 12 chữ số</p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Tên Chủ Tài Khoản</label>
            <input
              type='text'
              name='account_name'
              value={formData.account_name}
              onChange={handleChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 uppercase'
              placeholder='NGUYEN VAN A'
            />
          </div>
        </div>
      </div>

      {/* Bank Modal */}
      {showBankModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col'>
            {/* Header */}
            <div className='p-4 border-b flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-gray-900'>Chọn ngân hàng</h2>
              <button
                onClick={() => {
                  setShowBankModal(false)
                  setSearchQuery('')
                }}
                className='text-gray-500 hover:text-gray-700'
              >
                <X size={24} />
              </button>
            </div>

            {/* Search */}
            <div className='p-4 border-b'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Nhập tên ngân hàng'
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
                  autoFocus
                />
              </div>
            </div>

            {/* Bank List */}
            <div className='flex-1 overflow-y-auto'>
              {filteredBanks.map((bank) => (
                <button
                  key={bank.code}
                  onClick={() => handleBankSelect(bank.code)}
                  className='w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-100'
                >
                  <div className='w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold flex-shrink-0'>
                    {bank.shortName.charAt(0)}
                  </div>
                  <div className='flex-1 text-left'>
                    <div className='font-medium text-gray-900'>{bank.shortName}</div>
                    <div className='text-sm text-gray-500'>{bank.name}</div>
                  </div>
                  {formData.bank_name === bank.code && <Check className='text-green-500 flex-shrink-0' size={20} />}
                </button>
              ))}
              {filteredBanks.length === 0 && (
                <div className='text-center py-12 text-gray-500'>Không tìm thấy ngân hàng</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TabBank
