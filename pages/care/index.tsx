import Pagination from '@/components/common/Pagination'
import StudioLayout from '@/components/studio/StudioLayout'
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Eye,
  FileSpreadsheet,
  Flag,
  Headset,
  MessageSquare,
  PlusCircle,
  Search,
  ThumbsDown,
  Upload
} from 'lucide-react'
import { useState } from 'react'

// Mock Data for Tickets
const TICKETS = [
  {
    id: 'TCK-001',
    user: 'vana@gmail.com',
    plan: 'Free',
    subject: 'Lỗi không upload được ảnh',
    priority: 'High',
    status: 'Open',
    created: '10 mins ago'
  },
  {
    id: 'TCK-002',
    user: 'b.tran@yahoo.com',
    plan: 'Premium',
    subject: 'Hỏi về gói Premium',
    priority: 'Medium',
    status: 'In Progress',
    created: '1 hour ago'
  },
  {
    id: 'TCK-003',
    user: 'customer@gmail.com',
    plan: 'Free',
    subject: 'Muốn đổi mẫu thiệp',
    priority: 'Low',
    status: 'Open',
    created: '2 hours ago'
  }
]

// Mock Data for Moderation
const MODERATION_QUEUE = [
  {
    id: 'WED-999',
    user: 'spam_user@bot.com',
    reason: 'Nội dung quảng cáo',
    content_preview: 'Mua bán nhà đất giá rẻ...',
    status: 'Pending'
  },
  {
    id: 'WED-888',
    user: 'couple_autochuyen@gmail.com',
    reason: 'Hình ảnh nhạy cảm',
    content_preview: '[Image attachment]',
    status: 'Pending'
  }
]

// Mock Data for Marketing
const MARKETING_LEADS = [
  {
    id: 'LEA-001',
    name: 'Ngọc Lan',
    source: 'Facebook',
    interest: 'Premium Plan',
    status: 'New',
    last_msg: 'Giá gói Premium bao nhiêu ạ?'
  },
  {
    id: 'LEA-002',
    name: 'Minh Hùng',
    source: 'Zalo',
    interest: 'Custom Domain',
    status: 'Contacted',
    last_msg: 'Đã gửi báo giá, chờ phản hồi.'
  }
]

// Mock Data for Concierge
const CONCIERGE_TASKS = [
  {
    id: 'CON-112',
    user: 'lan.nguyen@test.com',
    type: 'Import Excel',
    count: 145,
    status: 'Pending',
    file: 'danh_sach_khach_moi_v1.xlsx'
  },
  { id: 'CON-113', user: 'tuan.le@gmail.com', type: 'Manual Entry', count: 20, status: 'Completed', file: '-' },
  {
    id: 'CON-114',
    user: 'hoa.pham@test.com',
    type: 'Import Excel',
    count: 89,
    status: 'Pending',
    file: 'guests_export.csv'
  },
  { id: 'CON-115', user: 'minh.vu@gmail.com', type: 'Manual Entry', count: 50, status: 'Completed', file: '-' },
  {
    id: 'CON-116',
    user: 'linh.tran@test.com',
    type: 'Import Excel',
    count: 200,
    status: 'Pending',
    file: 'wedding_guests_final.xlsx'
  },
  {
    id: 'CON-117',
    user: 'quan.do@test.com',
    type: 'Import Excel',
    count: 75,
    status: 'Completed',
    file: 'invite_list.xlsx'
  }
]

export default function CustomerCareDashboard() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'moderation' | 'marketing' | 'concierge'>('tickets')
  const [conciergePage, setConciergePage] = useState(1)
  const conciergeItemsPerPage = 3

  return (
    <StudioLayout>
      <div className='space-y-8'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='bg-blue-600 text-white p-2 rounded-lg'>
              <Headset size={24} />
            </div>
            <h1 className='text-2xl font-bold font-serif text-gray-900'>Customer Care & Marketing</h1>
          </div>
          <div className='text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm'>Support Agent</div>
        </div>

        {/* Support Stats */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-xs font-bold uppercase tracking-wider mb-2'>Đang chờ xử lý</div>
            <div className='text-3xl font-bold text-orange-500'>5</div>
            <div className='text-gray-400 text-sm mt-1'>Tickets</div>
          </div>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-xs font-bold uppercase tracking-wider mb-2'>Lead Mới (Fanpage)</div>
            <div className='text-3xl font-bold text-blue-500'>12</div>
            <div className='text-gray-400 text-sm mt-1'>Cần tư vấn ngay</div>
          </div>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-xs font-bold uppercase tracking-wider mb-2'>Duyệt nội dung</div>
            <div className='text-3xl font-bold text-red-500'>{MODERATION_QUEUE.length}</div>
            <div className='text-gray-400 text-sm mt-1'>Pending items</div>
          </div>
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-xs font-bold uppercase tracking-wider mb-2'>Import Data</div>
            <div className='text-3xl font-bold text-indigo-500'>{CONCIERGE_TASKS.length}</div>
            <div className='text-gray-400 text-sm mt-1'>Pending requests</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className='flex space-x-2 border-b border-gray-200 pb-1 overflow-x-auto'>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 font-bold text-sm transition-colors relative whitespace-nowrap ${activeTab === 'tickets' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Hỗ Trợ Kỹ Thuật
            {activeTab === 'tickets' && <div className='absolute bottom-[-5px] left-0 w-full h-0.5 bg-blue-600'></div>}
          </button>
          <button
            onClick={() => setActiveTab('marketing')}
            className={`px-4 py-2 font-bold text-sm transition-colors relative whitespace-nowrap ${activeTab === 'marketing' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Tư Vấn & Marketing
            {activeTab === 'marketing' && (
              <div className='absolute bottom-[-5px] left-0 w-full h-0.5 bg-blue-600'></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('concierge')}
            className={`px-4 py-2 font-bold text-sm transition-colors relative whitespace-nowrap ${activeTab === 'concierge' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Hỗ Trợ Nhập Liệu
            {activeTab === 'concierge' && (
              <div className='absolute bottom-[-5px] left-0 w-full h-0.5 bg-blue-600'></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2 font-bold text-sm transition-colors relative whitespace-nowrap ${activeTab === 'moderation' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Kiểm Duyệt Nội Dung
            {activeTab === 'moderation' && (
              <div className='absolute bottom-[-5px] left-0 w-full h-0.5 bg-blue-600'></div>
            )}
          </button>
        </div>

        {/* Main Content Area */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]'>
          {activeTab === 'tickets' && (
            <div>
              <div className='p-6 border-b border-gray-100 flex justify-between items-center'>
                <h2 className='text-lg font-bold'>Danh Sách Yêu Cầu (Tickets)</h2>
                <button className='flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100'>
                  <Clock size={16} /> History
                </button>
              </div>
              <div className='divide-y divide-gray-50'>
                {TICKETS.map((ticket) => (
                  <div
                    key={ticket.id}
                    className='p-6 hover:bg-gray-50 transition-colors flex justify-between items-center group cursor-pointer'
                  >
                    <div className='flex items-start gap-4'>
                      <div
                        className={`mt-1 p-2 rounded-full ${ticket.status === 'Open' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}
                      >
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <div className='font-bold text-gray-900 mb-1'>
                          {ticket.subject} <span className='text-xs text-gray-400 font-normal'>#{ticket.id}</span>
                        </div>
                        <div className='text-sm text-gray-500 mb-2 flex items-center gap-2'>
                          From: <span className='font-medium text-gray-700'>{ticket.user}</span>
                          {ticket.plan === 'Premium' && (
                            <span className='px-1.5 py-0.5 bg-pink-100 text-pink-700 text-[10px] font-bold uppercase rounded border border-pink-200'>
                              Premium
                            </span>
                          )}
                          {ticket.plan === 'Free' && (
                            <span className='px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded border border-gray-200'>
                              Free
                            </span>
                          )}
                        </div>
                        <div className='flex items-center gap-2'>
                          {ticket.priority === 'High' && (
                            <span className='px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold uppercase rounded'>
                              High Priority
                            </span>
                          )}
                          <span className='text-xs text-gray-400'>{ticket.created}</span>
                        </div>
                      </div>
                    </div>
                    <button className='opacity-0 group-hover:opacity-100 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-blue-700 transition-all'>
                      Phản hồi
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'marketing' && (
            <div>
              <div className='p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4'>
                <div>
                  <h2 className='text-lg font-bold'>Tư Vấn & Leads (Fanpage/Zalo)</h2>
                  <p className='text-sm text-gray-500'>Quản lý tin nhắn từ khách hàng tiềm năng</p>
                </div>
                <div className='flex gap-2'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={16} />
                    <input
                      type='text'
                      placeholder='Tìm tên/sđt...'
                      className='pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm'
                    />
                  </div>
                  <button className='flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-bold hover:bg-pink-700 shadow-sm'>
                    <PlusCircle size={16} /> Tạo Đơn Mới
                  </button>
                </div>
              </div>
              <div className='divide-y divide-gray-50'>
                {MARKETING_LEADS.map((lead) => (
                  <div key={lead.id} className='p-6 hover:bg-gray-50 transition-colors'>
                    <div className='flex justify-between items-start'>
                      <div className='flex gap-4'>
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${lead.source === 'Facebook' ? 'bg-blue-600' : 'bg-blue-400'}`}
                        >
                          {lead.source === 'Facebook' ? 'f' : 'Z'}
                        </div>
                        <div>
                          <div className='font-bold text-gray-900 text-lg'>{lead.name}</div>
                          <div className='text-sm text-gray-500 flex items-center gap-2'>
                            Nguồn: {lead.source}
                            <span className='w-1 h-1 bg-gray-300 rounded-full'></span>
                            Quan tâm: <span className='font-medium text-pink-600'>{lead.interest}</span>
                          </div>
                          <div className='mt-2 bg-gray-100 p-3 rounded-lg rounded-tl-none text-sm text-gray-700 inline-block relative border border-gray-200'>
                            {lead.last_msg}
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-col gap-2'>
                        <button className='px-4 py-2 border border-gray-200 text-gray-700 font-bold text-sm rounded-lg hover:bg-white hover:border-gray-300'>
                          Chat Fanpage
                        </button>
                        <button className='px-4 py-2 bg-green-50 text-green-700 font-bold text-sm rounded-lg hover:bg-green-100 border border-green-100'>
                          Chốt Đơn
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'concierge' && (
            <div>
              <div className='p-6 border-b border-gray-100 flex justify-between items-center'>
                <h2 className='text-lg font-bold'>Dịch Vụ Hỗ Trợ Nhập Liệu (Concierge)</h2>
                <button className='flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm'>
                  <PlusCircle size={16} /> Tạo Yêu Cầu Mới
                </button>
              </div>

              <div className='p-6'>
                {/* Import Tool */}
                <div className='bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8'>
                  <h3 className='font-bold text-indigo-900 mb-2 flex items-center gap-2'>
                    <FileSpreadsheet size={18} /> Công Cụ Import Excel
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='col-span-1'>
                      <label className='block text-xs font-bold text-gray-500 uppercase mb-1'>
                        Bước 1: Chọn Khách Hàng
                      </label>
                      <div className='relative'>
                        <Search className='absolute left-3 top-2.5 text-gray-400' size={16} />
                        <input
                          type='text'
                          placeholder='Email người dùng...'
                          className='w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white'
                        />
                      </div>
                    </div>
                    <div className='col-span-2'>
                      <label className='block text-xs font-bold text-gray-500 uppercase mb-1'>
                        Bước 2: Upload File (.xlsx, .csv)
                      </label>
                      <div className='border-2 border-dashed border-indigo-200 rounded-lg p-4 bg-white flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 transition-colors'>
                        <Upload className='text-indigo-400 mb-2' size={24} />
                        <div className='text-sm font-medium text-indigo-900'>
                          Kéo thả file vào đây hoặc click để chọn
                        </div>
                        <div className='text-xs text-gray-400 mt-1'>Hỗ trợ Excel Template v2.0</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Tasks */}
                <h3 className='font-bold text-gray-900 mb-4'>Hoạt Động Gần Đây</h3>
                <div className='bg-white border border-gray-200 rounded-xl overflow-hidden'>
                  <table className='w-full text-left'>
                    <thead className='bg-gray-50 text-gray-500 text-xs font-bold uppercase'>
                      <tr>
                        <th className='px-6 py-3'>ID</th>
                        <th className='px-6 py-3'>Loại Yêu Cầu</th>
                        <th className='px-6 py-3'>Khách Hàng</th>
                        <th className='px-6 py-3'>Số Lượng</th>
                        <th className='px-6 py-3'>Trạng Thái</th>
                        <th className='px-6 py-3 text-right'>Action</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50'>
                      {CONCIERGE_TASKS.slice(
                        (conciergePage - 1) * conciergeItemsPerPage,
                        conciergePage * conciergeItemsPerPage
                      ).map((task) => (
                        <tr key={task.id} className='hover:bg-gray-50'>
                          <td className='px-6 py-4 font-mono text-xs text-gray-500'>{task.id}</td>
                          <td className='px-6 py-4 font-medium text-gray-900 flex items-center gap-2'>
                            {task.type === 'Import Excel' ? (
                              <FileSpreadsheet size={16} className='text-green-600' />
                            ) : (
                              <Database size={16} className='text-blue-600' />
                            )}
                            {task.type}
                          </td>
                          <td className='px-6 py-4 text-sm text-gray-600'>{task.user}</td>
                          <td className='px-6 py-4 font-bold'>{task.count}</td>
                          <td className='px-6 py-4'>
                            {task.status === 'Completed' ? (
                              <span className='text-green-600 text-xs font-bold border border-green-200 bg-green-50 px-2 py-0.5 rounded'>
                                Hoàn thành
                              </span>
                            ) : (
                              <span className='text-orange-600 text-xs font-bold border border-orange-200 bg-orange-50 px-2 py-0.5 rounded'>
                                Đang xử lý
                              </span>
                            )}
                          </td>
                          <td className='px-6 py-4 text-right'>
                            <button className='text-blue-600 text-xs font-bold hover:underline'>Chi tiết</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={conciergePage}
                  totalItems={CONCIERGE_TASKS.length}
                  itemsPerPage={conciergeItemsPerPage}
                  onPageChange={setConciergePage}
                  itemLabel='yêu cầu'
                  accentColor='indigo'
                />
              </div>
            </div>
          )}

          {activeTab === 'moderation' && (
            <div>
              <div className='p-6 border-b border-gray-100 flex justify-between items-center'>
                <h2 className='text-lg font-bold'>Hàng Chờ Kiểm Duyệt</h2>
                <div className='text-sm text-orange-500 font-medium flex items-center gap-2'>
                  <AlertCircle size={16} /> Cần xử lý gấp
                </div>
              </div>
              <div className='divide-y divide-gray-50'>
                {MODERATION_QUEUE.map((item) => (
                  <div key={item.id} className='p-6'>
                    <div className='flex justify-between items-start mb-4'>
                      <div>
                        <div className='font-bold text-gray-900 flex items-center gap-2'>
                          <Flag size={16} className='text-red-500' />
                          Báo cáo vi phạm: {item.reason}
                        </div>
                        <div className='text-sm text-gray-500 mt-1'>User: {item.user}</div>
                      </div>
                      <a href='#' className='text-blue-600 text-sm font-bold hover:underline flex items-center gap-1'>
                        <Eye size={16} /> Xem trang thật
                      </a>
                    </div>
                    <div className='bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 text-sm text-gray-600 italic'>
                      &quot;{item.content_preview}&quot;
                    </div>
                    <div className='flex justify-end gap-3'>
                      <button className='flex items-center gap-2 px-4 py-2 border border-green-200 bg-green-50 text-green-700 rounded-lg text-sm font-bold hover:bg-green-100'>
                        <CheckCircle size={16} /> Bỏ qua (An toàn)
                      </button>
                      <button className='flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 shadow-sm'>
                        <ThumbsDown size={16} /> Gỡ bỏ & Cảnh báo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </StudioLayout>
  )
}
