import { Copy, Download, Link as LinkIcon, Search, Share2, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import StudioLayout from '../../components/studio/StudioLayout'
import { useToast } from '../../components/ui/ToastProvider'
import { RSVP, Wedding, dataService } from '../../lib/data-service'

const Guests = () => {
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [filteredRsvps, setFilteredRsvps] = useState<RSVP[]>([])
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [guestName, setGuestName] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const { toast, error } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      const weddingData = await dataService.getWedding()
      let rsvpData: RSVP[] = []
      if (weddingData) {
        rsvpData = await dataService.getRSVPs(weddingData.id)
      }
      setWedding(weddingData)
      setRsvps(rsvpData)
      setFilteredRsvps(rsvpData)
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRsvps(rsvps)
    } else {
      setFilteredRsvps(
        rsvps.filter(
          (r) =>
            r.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.phone && r.phone.includes(searchTerm))
        )
      )
    }
  }, [searchTerm, rsvps])

  const generateLink = () => {
    if (!guestName.trim() || !wedding) return
    const link = `https://moimoi.vn/${wedding.slug}?g=${encodeURIComponent(guestName)}`
    setGeneratedLink(link)
  }

  const copyToClipboard = () => {
    if (!generatedLink) return
    navigator.clipboard
      .writeText(generatedLink)
      .then(() => {
        toast('Đã sao chép liên kết!', 'success')
      })
      .catch(() => {
        error('Sao chép thất bại. Vui lòng thử lại.')
      })
  }

  const handleExport = async () => {
    if (wedding) {
      await dataService.exportRSVPs(wedding.id)
      toast('Đang xuất file! Vui lòng kiểm tra thư mục tải xuống.', 'info')
    }
  }

  if (loading)
    return (
      <StudioLayout>
        <div className='flex items-center justify-center h-full'>
          <div className='text-pink-600 animate-pulse text-lg'>Đang tải danh sách khách...</div>
        </div>
      </StudioLayout>
    )

  if (!wedding)
    return (
      <StudioLayout>
        <div className='text-center mt-10 text-gray-500'>Vui lòng tạo đám cưới trước.</div>
      </StudioLayout>
    )

  return (
    <StudioLayout>
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8'>
        <div>
          <h2 className='text-3xl font-serif font-bold text-gray-900'>Quản Lý Khách Mời</h2>
          <p className='text-gray-500 mt-1'>Theo dõi RSVP và tạo liên kết mời</p>
        </div>
        <button
          onClick={handleExport}
          className='flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm'
        >
          <Download size={18} className='mr-2' /> Xuất Danh Sách
        </button>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Col: Generator */}
        <div className='lg:col-span-1 space-y-6'>
            <div className='bg-white p-6 rounded-3xl shadow-sm border border-pink-100'>
                <div className='flex items-center gap-2 mb-4 text-pink-600 font-bold uppercase text-xs tracking-wider'>
                    <LinkIcon size={16} />
                    <span>Tạo Link Mời</span>
                </div>
                <h3 className='text-lg font-bold text-gray-900 mb-4'>Tạo Link Cá Nhân Hóa</h3>
                <p className='text-sm text-gray-500 mb-4'>Nhập tên khách để tạo link mời riêng, tên khách sẽ được điền sẵn trong thiệp.</p>
                
                <div className='space-y-3'>
                    <div className='relative'>
                        <UserPlus className='absolute left-3 top-3 text-gray-400' size={20} />
                        <input
                            type='text'
                            className='w-full pl-10 pr-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all'
                            placeholder='Ví dụ: Anh Nam & Chị Lan'
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={generateLink}
                        disabled={!guestName.trim()}
                        className='w-full bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700 transition-all font-bold shadow-lg shadow-pink-200 disabled:opacity-50 disabled:shadow-none'
                    >
                        Tạo Link
                    </button>
                </div>

                {generatedLink && (
                <div className='mt-6 p-4 bg-green-50 rounded-2xl border border-green-100 animate-in slide-in-from-top-2'>
                    <div className='text-xs font-bold text-green-700 uppercase mb-2'>Tạo Thành Công</div>
                    <code className='block text-sm text-gray-600 break-all bg-white p-2 rounded border border-green-100 mb-3'>
                        {generatedLink}
                    </code>
                    <div className='flex gap-2'>
                        <button
                            onClick={copyToClipboard}
                            className='flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium'
                        >
                            <Copy size={16} /> Sao chép
                        </button>
                        <button
                            className='flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-md shadow-blue-200'
                            onClick={() => window.open(`http://zalo.me/share/?url=${encodeURIComponent(generatedLink)}`, '_blank')}
                        >
                            <Share2 size={16} /> Zalo
                        </button>
                    </div>
                </div>
                )}
            </div>
        </div>

        {/* Right Col: List */}
        <div className='lg:col-span-2'>
             <div className='bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden'>
                <div className='p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4'>
                    <div className='relative w-full sm:w-auto flex-1'>
                        <Search className='absolute left-3 top-3 text-gray-400' size={18} />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm khách mời..." 
                            className='w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-pink-200 transition-all'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleExport}
                        className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-pink-300 hover:text-pink-600 transition-all'
                    >
                        <Download size={16} />
                        Xuất Excel
                    </button>
                </div>

                <div className='overflow-x-auto'>
                <table className='w-full text-left'>
                    <thead className='bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wider'>
                    <tr>
                        <th className='px-6 py-4'>Tên Khách</th>
                        <th className='px-6 py-4'>SĐT</th>
                        <th className='px-6 py-4'>Trạng Thái</th>
                        <th className='px-6 py-4'>Số Lượng</th>
                        <th className='px-6 py-4'>Lời Chúc</th>
                    </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-50'>
                    {filteredRsvps.map((rsvp) => (
                        <tr key={rsvp.id} className='hover:bg-pink-50/30 transition-colors group'>
                        <td className='px-6 py-4'>
                            <div className='font-bold text-gray-900'>{rsvp.guest_name}</div>
                        </td>
                        <td className='px-6 py-4 text-gray-500 text-sm font-mono'>{rsvp.phone || '-'}</td>
                        <td className='px-6 py-4'>
                            {rsvp.is_attending ? (
                            <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700'>
                                Tham dự
                            </span>
                            ) : (
                            <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600'>
                                Vắng mặt
                            </span>
                            )}
                        </td>
                        <td className='px-6 py-4 text-gray-600 font-medium'>{rsvp.party_size}</td>
                        <td className='px-6 py-4'>
                             <div className='max-w-xs truncate text-gray-500 text-sm italic' title={rsvp.wishes || ''}>
                                {rsvp.wishes || <span className='text-gray-300'>Không có lời nhắn</span>}
                             </div>
                        </td>
                        </tr>
                    ))}
                    {filteredRsvps.length === 0 && (
                        <tr>
                        <td colSpan={5} className='px-6 py-12 text-center text-gray-400'>
                            <div className='flex flex-col items-center'>
                                <div className='mb-2 text-4xl opacity-20'>📭</div>
                                <p>Không tìm thấy khách mời nào phù hợp.</p>
                            </div>
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
      </div>
    </StudioLayout>
  )
}

export default Guests
