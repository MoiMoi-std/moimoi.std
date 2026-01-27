import Pagination from '@/components/common/Pagination'
import StudioLayout from '@/components/studio/StudioLayout'
import { ArrowUpRight, CreditCard, DollarSign, Download, FileText, Filter, PlusCircle, Search, X } from 'lucide-react'
import { useState } from 'react'

const TRANSACTIONS = [
  {
    id: 'TRX-9821',
    user: 'vana@gmail.com',
    amount: 490000,
    plan: 'Premium (1 Year)',
    date: '2023-11-20',
    status: 'Success',
    method: 'Momo'
  },
  {
    id: 'TRX-9822',
    user: 'lan.nguyen@test.com',
    amount: 490000,
    plan: 'Premium (1 Year)',
    date: '2023-11-20',
    status: 'Pending',
    method: 'Bank Transfer'
  },
  {
    id: 'TRX-9823',
    user: 'hoang.pham@dev.io',
    amount: 99000,
    plan: 'Template: Vintage',
    date: '2023-11-19',
    status: 'Failed',
    method: 'Visa'
  },
  {
    id: 'TRX-9824',
    user: 'quynh.rose@mail.com',
    amount: 490000,
    plan: 'Premium (1 Year)',
    date: '2023-11-19',
    status: 'Success',
    method: 'VietQR'
  },
  {
    id: 'TRX-9825',
    user: 'minh.tri@startup.co',
    amount: 490000,
    plan: 'Premium (1 Year)',
    date: '2023-11-18',
    status: 'Success',
    method: 'Momo'
  },
  {
    id: 'TRX-9826',
    user: 'minh.tri@startup.co',
    amount: 490000,
    plan: 'Premium (1 Year)',
    date: '2023-11-18',
    status: 'Success',
    method: 'Momo'
  },
  {
    id: 'TRX-9827',
    user: 'minh.tri@startup.co',
    amount: 490000,
    plan: 'Premium (1 Year)',
    date: '2023-11-18',
    status: 'Success',
    method: 'Momo'
  },
  {
    id: 'TRX-9828',
    user: 'minh.tri@startup.co',
    amount: 490000,
    plan: 'Premium (1 Year)',
    date: '2023-11-18',
    status: 'Success',
    method: 'Momo'
  },
  {
    id: 'TRX-9829',
    user: 'minh.tri@startup.co',
    amount: 490000,
    plan: 'Premium (1 Year)',
    date: '2023-11-18',
    status: 'Success',
    method: 'Momo'
  },
  {
    id: 'TRX-9830',
    user: 'minh.tri@startup.co',
    amount: 490000,
    plan: 'Premium (1 Year)',
    date: '2023-11-18',
    status: 'Success',
    method: 'Momo'
  },
  {
    id: 'TRX-9831',
    user: 'minh.tri@startup.co',
    amount: 490000,
    plan: 'Premium (1 Year)',
    date: '2023-11-18',
    status: 'Success',
    method: 'Momo'
  }
]

// Mock data cho nhật ký thu chi
const JOURNAL_ENTRIES = [
  {
    id: 'JNL-001',
    purpose: 'Thanh toán hosting tháng 11',
    amount: -350000,
    content: 'Gia hạn hosting AWS cho hệ thống',
    type: 'expense',
    date: '2023-11-15'
  },
  {
    id: 'JNL-002',
    purpose: 'Doanh thu gói Premium',
    amount: 490000,
    content: 'Khách hàng vana@gmail.com nâng cấp gói Premium',
    type: 'income',
    date: '2023-11-20'
  },
  {
    id: 'JNL-003',
    purpose: 'Chi phí marketing Facebook Ads',
    amount: -800000,
    content: 'Chạy quảng cáo Facebook tháng 11',
    type: 'expense',
    date: '2023-11-12'
  },
  {
    id: 'JNL-004',
    purpose: 'Doanh thu template',
    amount: 99000,
    content: 'Bán template Vintage cho khách hàng',
    type: 'income',
    date: '2023-11-19'
  },
  {
    id: 'JNL-005',
    purpose: 'Chi phí văn phòng',
    amount: -500000,
    content: 'Thuê văn phòng làm việc tháng 11',
    type: 'expense',
    date: '2023-11-01'
  }
]

export default function FinanceDashboard() {
  const [activeTab, setActiveTab] = useState<'history' | 'journal'>('history')
  const [currentPage, setCurrentPage] = useState(1)
  const [journalPage, setJournalPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [entries, setEntries] = useState(JOURNAL_ENTRIES)
  const [searchTerm, setSearchTerm] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    purpose: '',
    amount: '',
    content: '',
    type: 'income' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0]
  })

  // Filter state
  const [filterData, setFilterData] = useState({
    startDate: '',
    endDate: '',
    type: 'all' as 'all' | 'income' | 'expense'
  })

  // Filtered entries
  const filteredEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date)
    const start = filterData.startDate ? new Date(filterData.startDate) : null
    const end = filterData.endDate ? new Date(filterData.endDate) : null

    const dateMatch = (!start || entryDate >= start) && (!end || entryDate <= end)
    const typeMatch = filterData.type === 'all' || entry.type === filterData.type
    const searchMatch = searchTerm === '' || entry.id.toLowerCase().includes(searchTerm.toLowerCase())

    return dateMatch && typeMatch && searchMatch
  })

  const itemsPerPage = 5

  const handleAddEntry = () => {
    const newEntry = {
      id: `JNL-${String(entries.length + 1).padStart(3, '0')}`,
      purpose: formData.purpose,
      amount: formData.type === 'income' ? Number(formData.amount) : -Number(formData.amount),
      content: formData.content,
      type: formData.type,
      date: formData.date
    }
    setEntries([newEntry, ...entries])
    setShowAddModal(false)
    // Reset form
    setFormData({
      purpose: '',
      amount: '',
      content: '',
      type: 'income',
      date: new Date().toISOString().split('T')[0]
    })
  }

  const exportToExcel = () => {
    // Tạo CSV content
    const headers = ['Mã GD', 'Mục đích', 'Số tiền', 'Nội dung', 'Loại', 'Ngày']
    const rows = entries.map((entry) => [
      entry.id,
      entry.purpose,
      entry.amount.toLocaleString('vi-VN'),
      entry.content,
      entry.type === 'income' ? 'Thu' : 'Chi',
      entry.date
    ])

    let csvContent = headers.join(',') + '\n'
    rows.forEach((row) => {
      csvContent += row.map((cell) => `"${cell}"`).join(',') + '\n'
    })

    // Download file
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `nhat-ky-thu-chi-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <StudioLayout>
      <div className='space-y-8'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='bg-green-600 text-white p-2 rounded-lg'>
              <DollarSign size={24} />
            </div>
            <h1 className='text-2xl font-bold font-serif text-gray-900'>Finance Dashboard</h1>
          </div>
          <div className='text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm'>Kế Toán Viên</div>
        </div>

        {/* Revenue Overview */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <div className='text-gray-500 text-xs font-bold uppercase tracking-wider'>Doanh Thu Tháng</div>
                <div className='text-3xl font-bold text-gray-900 mt-1'>45,290,000 ₫</div>
              </div>
              <div className='bg-green-50 text-green-600 p-2 rounded-lg'>
                <ArrowUpRight size={20} />
              </div>
            </div>
            <div className='text-sm text-green-600 font-medium'>+18.2% so với tháng trước</div>
          </div>

          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <div className='text-gray-500 text-xs font-bold uppercase tracking-wider'>Giao Dịch Chờ Duyệt</div>
                <div className='text-3xl font-bold text-orange-500 mt-1'>12</div>
              </div>
              <div className='bg-orange-50 text-orange-500 p-2 rounded-lg'>
                <FileText size={20} />
              </div>
            </div>
            <div className='text-sm text-gray-500 font-medium'>Cần xử lý trong 24h</div>
          </div>

          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <div className='text-gray-500 text-xs font-bold uppercase tracking-wider'>Tổng Đơn Hàng</div>
                <div className='text-3xl font-bold text-gray-900 mt-1'>1,204</div>
              </div>
              <div className='bg-purple-50 text-purple-600 p-2 rounded-lg'>
                <CreditCard size={20} />
              </div>
            </div>
            <div className='text-sm text-gray-500 font-medium'>Conversion rate: 4.2%</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className='flex space-x-2 border-b border-gray-200 pb-1 overflow-x-auto'>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-bold text-sm transition-colors relative whitespace-nowrap ${
              activeTab === 'history' ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Lịch Sử Giao Dịch
            {activeTab === 'history' && <div className='absolute bottom-[-5px] left-0 w-full h-0.5 bg-green-600'></div>}
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-4 py-2 font-bold text-sm transition-colors relative whitespace-nowrap ${
              activeTab === 'journal' ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Nhật Ký Thu Chi
            {activeTab === 'journal' && <div className='absolute bottom-[-5px] left-0 w-full h-0.5 bg-green-600'></div>}
          </button>
        </div>

        {/* Tab Content */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]'>
          {activeTab === 'history' && (
            <div>
              <div className='p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4'>
                <h2 className='text-lg font-bold'>Lịch Sử Giao Dịch</h2>
                <div className='flex gap-2'>
                  <button className='flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-bold hover:bg-pink-700 shadow-sm'>
                    <FileText size={16} /> Tạo Hóa Đơn Mới
                  </button>
                  <button className='flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50'>
                    <Filter size={16} /> Lọc
                  </button>
                  <button className='flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800'>
                    <Download size={16} /> Xuất Báo Cáo
                  </button>
                </div>
              </div>

              <div className='overflow-x-auto'>
                <table className='w-full text-left'>
                  <thead className='bg-gray-50 text-gray-500 text-xs font-bold uppercase'>
                    <tr>
                      <th className='px-6 py-4'>Mã GD</th>
                      <th className='px-6 py-4'>Khách Hàng</th>
                      <th className='px-6 py-4'>Dịch Vụ</th>
                      <th className='px-6 py-4'>Số Tiền</th>
                      <th className='px-6 py-4'>Cổng TT</th>
                      <th className='px-6 py-4'>Trạng Thái</th>
                      <th className='px-6 py-4 min-w-[140px]'>Ngày</th>
                      {/* <th className='px-6 py-4 text-right'>Action</th> */}
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-50'>
                    {TRANSACTIONS.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((trx) => (
                      <tr key={trx.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 font-mono text-sm text-gray-600'>{trx.id}</td>
                        <td className='px-6 py-4 font-medium text-gray-900'>{trx.user}</td>
                        <td className='px-6 py-4 text-sm text-gray-600'>{trx.plan}</td>
                        <td className='px-6 py-4 font-bold text-gray-900'>{trx.amount.toLocaleString('vi-VN')} ₫</td>
                        <td className='px-6 py-4 text-sm text-gray-500'>{trx.method}</td>
                        <td className='px-6 py-4'>
                          {trx.status === 'Success' && (
                            <span className='inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold'>
                              Success
                            </span>
                          )}
                          {trx.status === 'Pending' && (
                            <span className='inline-flex items-center px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-bold'>
                              Pending
                            </span>
                          )}
                          {trx.status === 'Failed' && (
                            <span className='inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold'>
                              Failed
                            </span>
                          )}
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-500 min-w-[140px] whitespace-nowrap'>{trx.date}</td>
                        {/* <td className='px-6 py-4 text-right'>
                          <div className='flex justify-end gap-2'>
                            {trx.status === 'Pending' ? (
                              <button className='px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700'>
                                Duyệt
                              </button>
                            ) : trx.status === 'Success' ? (
                              <>
                                <button
                                  className='px-3 py-1 border border-gray-300 text-gray-600 text-xs font-bold rounded hover:bg-gray-50'
                                  title='Xuất hóa đơn'
                                >
                                  <FileText size={14} />
                                </button>
                                <button
                                  className='px-3 py-1 border border-red-200 text-red-600 text-xs font-bold rounded hover:bg-red-50'
                                  title='Hoàn tiền'
                                >
                                  Refund
                                </button>
                              </>
                            ) : (
                              <button className='text-gray-400 text-xs hover:text-gray-600'>Chi tiết</button>
                            )}
                          </div>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={currentPage}
                totalItems={TRANSACTIONS.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                itemLabel='giao dịch'
                accentColor='green'
              />
            </div>
          )}

          {activeTab === 'journal' && (
            <div>
              <div className='p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4'>
                <h2 className='text-lg font-bold'>Nhật Ký Thu Chi</h2>
                <div className='flex gap-2 flex-wrap'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                    <input
                      type='text'
                      placeholder='Tìm mã giao dịch...'
                      className='pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className='flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-bold hover:bg-pink-700 shadow-sm'
                  >
                    <PlusCircle size={16} /> Thêm Giao Dịch
                  </button>
                  <button
                    onClick={() => setShowFilterModal(true)}
                    className='flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50'
                  >
                    <Filter size={16} /> Lọc
                  </button>
                  <button
                    onClick={exportToExcel}
                    className='flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800'
                  >
                    <Download size={16} /> Xuất Excel
                  </button>
                </div>
              </div>

              <div className='overflow-x-auto'>
                <table className='w-full text-left'>
                  <thead className='bg-gray-50 text-gray-500 text-xs font-bold uppercase'>
                    <tr>
                      <th className='px-6 py-4'>Mã GD</th>
                      <th className='px-6 py-4'>Mục Đích</th>
                      <th className='px-6 py-4'>Số Tiền</th>
                      <th className='px-6 py-4'>Nội Dung</th>
                      <th className='px-6 py-4'>Loại</th>
                      <th className='px-6 py-4 min-w-[140px]'>Ngày</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-50'>
                    {filteredEntries
                      .slice((journalPage - 1) * itemsPerPage, journalPage * itemsPerPage)
                      .map((entry) => (
                        <tr key={entry.id} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 font-mono text-sm text-gray-600'>{entry.id}</td>
                          <td className='px-6 py-4 font-medium text-gray-900'>{entry.purpose}</td>
                          <td className='px-6 py-4'>
                            <span className={`font-bold ${entry.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {entry.amount > 0 ? '+' : ''}
                              {entry.amount.toLocaleString('vi-VN')} ₫
                            </span>
                          </td>
                          <td className='px-6 py-4 text-sm text-gray-600'>{entry.content}</td>
                          <td className='px-6 py-4'>
                            {entry.type === 'income' ? (
                              <span className='inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold'>
                                Thu
                              </span>
                            ) : (
                              <span className='inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold'>
                                Chi
                              </span>
                            )}
                          </td>
                          <td className='px-6 py-4 text-sm text-gray-500 min-w-[140px] whitespace-nowrap'>
                            {entry.date}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={journalPage}
                totalItems={filteredEntries.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setJournalPage}
                itemLabel='giao dịch'
                accentColor='green'
              />
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={() => setShowAddModal(false)}></div>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-pink-600'>
              <h3 className='font-bold text-lg text-white'>Thêm Giao Dịch Thu Chi</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className='text-white hover:text-pink-100 text-2xl leading-none'
              >
                <X size={24} />
              </button>
            </div>
            <div className='p-6 space-y-4'>
              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Loại Giao Dịch</label>
                <div className='grid grid-cols-2 gap-3'>
                  <button
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                      formData.type === 'income'
                        ? 'bg-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Thu
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                      formData.type === 'expense'
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Chi
                  </button>
                </div>
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Mục Đích</label>
                <input
                  type='text'
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                  placeholder='VD: Thanh toán hosting'
                />
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Số Tiền (₫)</label>
                <input
                  type='number'
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                  placeholder='500000'
                />
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Nội Dung</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                  placeholder='Mô tả chi tiết về giao dịch'
                  rows={3}
                />
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Ngày</label>
                <input
                  type='date'
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                />
              </div>
            </div>
            <div className='px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3'>
              <button
                onClick={() => setShowAddModal(false)}
                className='px-4 py-2 text-gray-600 font-bold text-sm hover:bg-gray-100 rounded-lg'
              >
                Hủy
              </button>
              <button
                onClick={handleAddEntry}
                className='px-4 py-2 bg-pink-600 text-white font-bold text-sm hover:bg-pink-700 rounded-lg shadow-lg shadow-pink-200'
                disabled={!formData.purpose || !formData.amount || !formData.content}
              >
                Lưu Giao Dịch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          <div
            className='absolute inset-0 bg-black/40 backdrop-blur-sm'
            onClick={() => setShowFilterModal(false)}
          ></div>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-pink-600'>
              <h3 className='font-bold text-lg text-white'>Lọc Giao Dịch</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className='text-white hover:text-pink-100 text-2xl leading-none'
              >
                <X size={24} />
              </button>
            </div>
            <div className='p-6 space-y-4'>
              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Loại Giao Dịch</label>
                <div className='grid grid-cols-3 gap-3'>
                  <button
                    onClick={() => setFilterData({ ...filterData, type: 'all' })}
                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                      filterData.type === 'all'
                        ? 'bg-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setFilterData({ ...filterData, type: 'income' })}
                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                      filterData.type === 'income'
                        ? 'bg-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Thu
                  </button>
                  <button
                    onClick={() => setFilterData({ ...filterData, type: 'expense' })}
                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                      filterData.type === 'expense'
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Chi
                  </button>
                </div>
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Từ Ngày</label>
                <input
                  type='date'
                  value={filterData.startDate}
                  onChange={(e) => setFilterData({ ...filterData, startDate: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                />
              </div>

              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Đến Ngày</label>
                <input
                  type='date'
                  value={filterData.endDate}
                  onChange={(e) => setFilterData({ ...filterData, endDate: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                />
              </div>
            </div>
            <div className='px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3'>
              <button
                onClick={() => {
                  setFilterData({ startDate: '', endDate: '', type: 'all' })
                  setSearchTerm('')
                  setShowFilterModal(false)
                }}
                className='px-4 py-2 text-gray-600 font-bold text-sm hover:bg-gray-100 rounded-lg'
              >
                Xóa Bộ Lọc
              </button>
              <button
                onClick={() => {
                  setShowFilterModal(false)
                  setJournalPage(1) // Reset to first page when filter applied
                }}
                className='px-4 py-2 bg-pink-600 text-white font-bold text-sm hover:bg-pink-700 rounded-lg shadow-lg shadow-pink-200'
              >
                Áp Dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </StudioLayout>
  )
}
