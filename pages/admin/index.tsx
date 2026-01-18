import Pagination from '@/components/common/Pagination'
import StudioLayout from '@/components/studio/StudioLayout'
import { Activity, Ban, MoreVertical, Search, Shield, UserCheck } from 'lucide-react'
import { useState } from 'react'

// Mock Data
const MOCK_USERS = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'vana@gmail.com',
    role: 'User',
    status: 'Active',
    plan: 'Free',
    created: '2023-10-10'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'b.tran@yahoo.com',
    role: 'User',
    status: 'Active',
    plan: 'Premium',
    created: '2023-10-12'
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@company.com',
    role: 'User',
    status: 'Banned',
    plan: 'Free',
    created: '2023-10-15'
  },
  {
    id: 4,
    name: 'Admin User',
    email: 'admin@moimoi.vn',
    role: 'Super Admin',
    status: 'Active',
    plan: 'Unlimited',
    created: '2023-01-01'
  },
  {
    id: 5,
    name: 'Finance Staff',
    email: 'finance@moimoi.vn',
    role: 'Accountant',
    status: 'Active',
    plan: 'Unlimited',
    created: '2023-01-01'
  }
]

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  return (
    <StudioLayout>
      <div className='space-y-6'>
        {/* Header inside Content */}
        <div className='flex items-center justify-between mb-2'>
          {/* ... Existing header ... */}
          <div className='flex items-center gap-3'>
            <div className='bg-gray-900 text-white p-2 rounded-lg'>
              <Shield size={24} />
            </div>
            <h1 className='text-2xl font-bold font-serif text-gray-900'>Admin Portal</h1>
          </div>
          <div className='text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm'>Super Admin Mode</div>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-xs font-bold uppercase tracking-wider mb-2'>Tổng User</div>
            <div className='text-3xl font-bold'>12,345</div>
            <div className='text-green-500 text-sm mt-1 flex items-center gap-1'>
              <Activity size={14} /> +12% tháng này
            </div>
          </div>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-xs font-bold uppercase tracking-wider mb-2'>Đám Cưới Mới</div>
            <div className='text-3xl font-bold'>850</div>
            <div className='text-green-500 text-sm mt-1'>+5% tuần này</div>
          </div>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-xs font-bold uppercase tracking-wider mb-2'>User Premium</div>
            <div className='text-3xl font-bold text-pink-600'>432</div>
            <div className='text-gray-400 text-sm mt-1'>3.5% conversion</div>
          </div>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-xs font-bold uppercase tracking-wider mb-2'>Report / Spam</div>
            <div className='text-3xl font-bold text-red-600'>12</div>
            <div className='text-red-400 text-sm mt-1'>Cần xử lý</div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* System Config */}
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <h3 className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
              <Activity size={18} className='text-blue-500' /> System Status
            </h3>
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-3 bg-gray-50 rounded-xl'>
                <div>
                  <div className='font-bold text-sm'>Bảo Trì Hệ Thống</div>
                  <div className='text-xs text-gray-500'>Chặn truy cập user, chỉ admin login</div>
                </div>
                <div className='relative inline-flex items-center cursor-pointer'>
                  <input type='checkbox' className='sr-only peer' />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </div>
              <div className='flex items-center justify-between p-3 bg-gray-50 rounded-xl'>
                <div>
                  <div className='font-bold text-sm'>Cho phép đăng ký mới</div>
                  <div className='text-xs text-gray-500'>Người lạ có thể tạo tài khoản</div>
                </div>
                <div className='relative inline-flex items-center cursor-pointer'>
                  <input type='checkbox' className='sr-only peer' defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Log */}
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <h3 className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
              <Shield size={18} className='text-purple-500' /> Admin Audit Log
            </h3>
            <div className='space-y-3'>
              {[
                { action: 'Approved Refund #TRX-993', user: 'Finance', time: '10 min ago' },
                { action: 'Banned user "Spammer123"', user: 'Super Admin', time: '1 hour ago' },
                { action: 'Updated System Config', user: 'Tech Lead', time: '2 hours ago' }
              ].map((log, i) => (
                <div
                  key={i}
                  className='flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0'
                >
                  <div>
                    <span className='font-medium text-gray-800'>{log.action}</span>
                    <div className='text-xs text-gray-400'>{log.user}</div>
                  </div>
                  <span className='text-xs text-gray-400'>{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
          <div className='p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4'>
            <h2 className='text-lg font-bold'>Quản Lý Người Dùng</h2>
            <div className='relative'>
              <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
              <input
                type='text'
                placeholder='Tìm kiếm user...'
                className='pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead className='bg-gray-50 text-gray-500 text-xs font-bold uppercase'>
                <tr>
                  <th className='px-6 py-4'>User Info</th>
                  <th className='px-6 py-4'>Role</th>
                  <th className='px-6 py-4'>Status</th>
                  <th className='px-6 py-4'>Plan</th>
                  <th className='px-6 py-4'>Joined</th>
                  <th className='px-6 py-4 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {MOCK_USERS.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((user) => (
                  <tr key={user.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4'>
                      <div className='font-bold text-gray-900'>{user.name}</div>
                      <div className='text-gray-500 text-sm'>{user.email}</div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600'>
                        {user.role}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      {user.status === 'Active' ? (
                        <span className='text-green-600 text-xs font-bold flex items-center gap-1'>
                          <UserCheck size={14} /> Active
                        </span>
                      ) : (
                        <span className='text-red-600 text-xs font-bold flex items-center gap-1'>
                          <Ban size={14} /> Banned
                        </span>
                      )}
                    </td>
                    <td className='px-6 py-4'>
                      {user.plan === 'Premium' ? (
                        <span className='text-pink-600 font-bold text-sm'>Premium 👑</span>
                      ) : (
                        <span className='text-gray-500 text-sm'>Free</span>
                      )}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500'>{user.created}</td>
                    <td className='px-6 py-4 text-right'>
                      <button className='p-2 text-blue-600 hover:text-blue-800' onClick={() => setSelectedUser(user)}>
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={MOCK_USERS.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            itemLabel='người dùng'
            accentColor='blue'
          />
        </div>
      </div>

      {/* Subscription Modal */}
      {selectedUser && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
          <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' onClick={() => setSelectedUser(null)}></div>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50'>
              <h3 className='font-bold text-lg'>Quản Lý Gói Dịch Vụ</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className='text-gray-400 hover:text-gray-600 text-2xl leading-none'
              >
                &times;
              </button>
            </div>
            <div className='p-6 space-y-4'>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg'>
                  {selectedUser.name[0]}
                </div>
                <div>
                  <div className='font-bold text-gray-900'>{selectedUser.name}</div>
                  <div className='text-sm text-gray-500'>{selectedUser.email}</div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label className='text-xs font-bold text-gray-500 uppercase'>Gói Hiện Tại</label>
                  <select
                    className='w-full border border-gray-200 rounded-lg p-2 font-medium'
                    defaultValue={selectedUser.plan}
                  >
                    <option value='Free'>Free Plan</option>
                    <option value='Premium'>Premium Plan (1 Year)</option>
                    <option value='Lifetime'>Lifetime Access</option>
                  </select>
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-bold text-gray-500 uppercase'>Trạng Thái</label>
                  <select
                    className='w-full border border-gray-200 rounded-lg p-2 font-medium'
                    defaultValue={selectedUser.status}
                  >
                    <option value='Active'>Active</option>
                    <option value='Suspended'>Suspended</option>
                    <option value='Banned'>Banned</option>
                  </select>
                </div>
              </div>

              <div className='bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-yellow-800'>
                <strong>Lưu ý:</strong> Việc thay đổi gói sẽ có hiệu lực ngay lập tức. Email thông báo sẽ được gửi cho
                khách hàng.
              </div>
            </div>
            <div className='px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3'>
              <button
                onClick={() => setSelectedUser(null)}
                className='px-4 py-2 text-gray-600 font-bold text-sm hover:bg-gray-100 rounded-lg'
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  alert('Cập nhật thành công!')
                  setSelectedUser(null)
                }}
                className='px-4 py-2 bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-200'
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </StudioLayout>
  )
}
