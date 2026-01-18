import Pagination from '@/components/common/Pagination'
import StudioLayout from '@/components/studio/StudioLayout'
import { ArrowUpRight, CreditCard, DollarSign, Download, FileText, Filter } from 'lucide-react'
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

export default function FinanceDashboard() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
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

        {/* Expanded Transaction Log */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
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
            <table className='w-full text-lefts'>
              <thead className='bg-gray-50 text-gray-500 text-xs font-bold uppercase'>
                <tr>
                  <th className='px-6 py-4'>Mã GD</th>
                  <th className='px-6 py-4'>Khách Hàng</th>
                  <th className='px-6 py-4'>Dịch Vụ</th>
                  <th className='px-6 py-4'>Số Tiền</th>
                  <th className='px-6 py-4'>Cổng TT</th>
                  <th className='px-6 py-4'>Trạng Thái</th>
                  <th className='px-6 py-4'>Ngày</th>
                  <th className='px-6 py-4 text-right'>Action</th>
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
                    <td className='px-6 py-4 text-sm text-gray-500'>{trx.date}</td>
                    <td className='px-6 py-4 text-right'>
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
                    </td>
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
      </div>
    </StudioLayout>
  )
}
