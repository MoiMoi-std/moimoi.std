import {
  Check,
  Copy,
  Download,
  Edit,
  FileSpreadsheet,
  Link as LinkIcon,
  MessageSquare,
  Phone,
  QrCode,
  Search,
  Share2,
  Trash2,
  Upload,
  UserPlus,
  Users,
  X
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Pagination from '../../components/common/Pagination'
import StudioEmptyState from '../../components/studio/StudioEmptyState'
import StudioLayout from '../../components/studio/StudioLayout'
import StudioLoading from '../../components/studio/StudioLoading'
import { useToast } from '../../components/ui/ToastProvider'
import { RSVP, dataService } from '../../lib/data-service'
import { useWedding } from '../../lib/useWedding'

interface ImportedGuest {
  guest_name: string
  phone?: string
  party_size: number
}

interface LinkFormData {
  name: string
  phone: string
  partySize: number
}

const Guests = () => {
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [filteredRsvps, setFilteredRsvps] = useState<RSVP[]>([])
  const { wedding, loading: weddingLoading } = useWedding()
  const [loading, setLoading] = useState(true)
  const [linkFormData, setLinkFormData] = useState<LinkFormData>({ name: '', phone: '', partySize: 2 })
  const [generatedLink, setGeneratedLink] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [importedGuests, setImportedGuests] = useState<ImportedGuest[]>([])
  const [editingGuest, setEditingGuest] = useState<{ index: number; guest: ImportedGuest } | null>(null)
  const [editingRSVP, setEditingRSVP] = useState<RSVP | null>(null)
  const [qrGuest, setQrGuest] = useState<{ name: string; link: string } | null>(null)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [selectedRsvpIds, setSelectedRsvpIds] = useState<number[]>([])
  const [visibleColumns, setVisibleColumns] = useState({
    phone: true,
    status: true,
    party: true,
    wishes: true
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const qrCanvasRef = useRef<HTMLCanvasElement>(null)
  const { toast, error } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (!wedding || weddingLoading) {
        setLoading(false)
        return
      }
      setLoading(true)
      const rsvpData = await dataService.getRSVPs(wedding.id)
      setRsvps(rsvpData)
      setFilteredRsvps(rsvpData)
      setLoading(false)
    }
    fetchData()
  }, [wedding, weddingLoading])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRsvps(rsvps)
    } else {
      setFilteredRsvps(
        rsvps.filter(
          (r) =>
            r.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) || (r.phone && r.phone.includes(searchTerm))
        )
      )
    }
  }, [searchTerm, rsvps])

  // Generate QR Code when qrGuest changes
  useEffect(() => {
    if (qrGuest && qrCanvasRef.current) {
      import('qrcode').then((QRCode) => {
        QRCode.toCanvas(qrCanvasRef.current, qrGuest.link, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
      })
    }
  }, [qrGuest])

  const generateLink = () => {
    if (!linkFormData.name.trim() || !wedding) return

    const params = new URLSearchParams()
    params.set('g', linkFormData.name)
    if (linkFormData.phone) params.set('p', linkFormData.phone)
    if (linkFormData.partySize > 1) params.set('n', linkFormData.partySize.toString())

    const link = `https://moimoi.vn/${wedding.slug}?${params.toString()}`
    setGeneratedLink(link)
  }

  const copyToClipboard = (text: string, label: string = 'liên kết') => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast(`Đã sao chép ${label}!`, 'success')
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

  const downloadTemplate = () => {
    const csvContent = 'Tên Khách Mời,Số Điện Thoại,Số Lượng\nNguyễn Văn A,0901234567,2\nTrần Thị B,0987654321,4'
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'mau_danh_sach_khach_moi.csv'
    link.click()
    toast('Đã tải xuống mẫu Excel!', 'success')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const lines = text.split('\n').filter((line) => line.trim())

        const guests: ImportedGuest[] = lines
          .slice(1)
          .map((line) => {
            const [name, phone, size] = line.split(',').map((s) => s.trim())
            return {
              guest_name: name || '',
              phone: phone || undefined,
              party_size: parseInt(size) || 1
            }
          })
          .filter((g) => g.guest_name)

        setImportedGuests(guests)
        toast(`Đã nhập ${guests.length} khách mời!`, 'success')
      } catch (err) {
        error('Lỗi đọc file. Vui lòng kiểm tra định dạng!')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleEditImportedGuest = (index: number) => {
    setEditingGuest({ index, guest: { ...importedGuests[index] } })
  }

  const handleSaveImportedEdit = () => {
    if (!editingGuest) return
    const newGuests = [...importedGuests]
    newGuests[editingGuest.index] = editingGuest.guest
    setImportedGuests(newGuests)
    setEditingGuest(null)
    toast('Đã cập nhật thông tin!', 'success')
  }

  const handleDeleteImportedGuest = (index: number) => {
    setImportedGuests(importedGuests.filter((_, i) => i !== index))
    toast('Đã xóa khách mời!', 'info')
  }

  const handleConfirmImport = async () => {
    if (!wedding || importedGuests.length === 0) return

    try {
      // TODO: Call API to save imported guests
      toast(`Đã thêm ${importedGuests.length} khách mời vào danh sách!`, 'success')
      setImportedGuests([])

      const rsvpData = await dataService.getRSVPs(wedding.id)
      setRsvps(rsvpData)
      setFilteredRsvps(rsvpData)
    } catch (err) {
      error('Có lỗi xảy ra khi lưu danh sách!')
    }
  }

  const handleEditRSVP = (rsvp: RSVP) => {
    setEditingRSVP({ ...rsvp })
  }

  const handleSaveRSVPEdit = async () => {
    if (!editingRSVP || !wedding) return

    try {
      // TODO: Call API to update RSVP
      // await dataService.updateRSVP(editingRSVP.id, editingRSVP)

      const updatedRsvps = rsvps.map((r) => (r.id === editingRSVP.id ? editingRSVP : r))
      setRsvps(updatedRsvps)
      setFilteredRsvps(updatedRsvps)
      setEditingRSVP(null)
      toast('Đã cập nhật thông tin khách mời!', 'success')
    } catch (err) {
      error('Có lỗi xảy ra khi cập nhật!')
    }
  }

  const handleDeleteRSVP = async (rsvp: RSVP) => {
    if (!confirm(`Xác nhận xóa khách mời "${rsvp.guest_name}"?`)) return

    try {
      // TODO: Call API to delete RSVP
      // await dataService.deleteRSVP(rsvp.id)

      const newRsvps = rsvps.filter((r) => r.id !== rsvp.id)
      setRsvps(newRsvps)
      setFilteredRsvps(newRsvps)
      toast('Đã xóa khách mời!', 'info')
    } catch (err) {
      error('Có lỗi xảy ra khi xóa!')
    }
  }

  const toggleRsvpSelection = (id: number) => {
    setSelectedRsvpIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleSelectAll = (checked: boolean, ids: number[]) => {
    setSelectedRsvpIds((prev) => {
      if (checked) {
        const merged = new Set([...prev, ...ids])
        return Array.from(merged)
      }
      return prev.filter((id) => !ids.includes(id))
    })
  }

  const bulkUpdateAttendance = (isAttending: boolean) => {
    if (selectedRsvpIds.length === 0) {
      toast('Chưa chọn khách mời nào.', 'info')
      return
    }
    const updatedRsvps = rsvps.map((r) => (selectedRsvpIds.includes(r.id) ? { ...r, is_attending: isAttending } : r))
    setRsvps(updatedRsvps)
    setFilteredRsvps(updatedRsvps)
    toast(`Đã cập nhật trạng thái cho ${selectedRsvpIds.length} khách.`, 'success')
  }

  const bulkDelete = () => {
    if (selectedRsvpIds.length === 0) {
      toast('Chưa chọn khách mời nào.', 'info')
      return
    }
    if (!confirm(`Xác nhận xóa ${selectedRsvpIds.length} khách mời đã chọn?`)) return
    const updatedRsvps = rsvps.filter((r) => !selectedRsvpIds.includes(r.id))
    setRsvps(updatedRsvps)
    setFilteredRsvps(updatedRsvps)
    setSelectedRsvpIds([])
    toast('Đã xóa khách mời đã chọn!', 'info')
  }

  const bulkExport = () => {
    if (selectedRsvpIds.length === 0) {
      toast('Chưa chọn khách mời nào.', 'info')
      return
    }
    toast(`Đang xuất ${selectedRsvpIds.length} khách (mock).`, 'info')
  }

  const bulkGenerateQr = () => {
    if (selectedRsvpIds.length === 0) {
      toast('Chưa chọn khách mời nào.', 'info')
      return
    }
    toast(`Đã tạo QR hàng loạt cho ${selectedRsvpIds.length} khách (mock).`, 'success')
  }

  const toggleColumn = (key: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleShowQR = (rsvp: RSVP) => {
    if (!wedding) return
    const params = new URLSearchParams()
    params.set('g', rsvp.guest_name)
    if (rsvp.phone) params.set('p', rsvp.phone)
    const link = `https://moimoi.vn/${wedding.slug}?${params.toString()}`
    setQrGuest({ name: rsvp.guest_name, link })
  }

  const downloadQR = () => {
    if (!qrCanvasRef.current || !qrGuest) return
    const url = qrCanvasRef.current.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `QR_${qrGuest.name.replace(/\s/g, '_')}.png`
    link.href = url
    link.click()
    toast('Đã tải QR Code!', 'success')
  }

  const getGuestLink = (rsvp: RSVP) => {
    if (!wedding) return ''
    const params = new URLSearchParams()
    params.set('g', rsvp.guest_name)
    if (rsvp.phone) params.set('p', rsvp.phone)
    return `https://moimoi.vn/${wedding.slug}?${params.toString()}`
  }

  useEffect(() => {
    if (!isAdminMode) setSelectedRsvpIds([])
  }, [isAdminMode])

  useEffect(() => {
    setSelectedRsvpIds((prev) => prev.filter((id) => filteredRsvps.some((r) => r.id === id)))
  }, [filteredRsvps])

  if (weddingLoading || loading) {
    return (
      <StudioLayout>
        <StudioLoading message='Đang tải danh sách khách...' />
      </StudioLayout>
    )
  }

  if (!wedding) {
    return (
      <StudioLayout>
        <StudioEmptyState />
      </StudioLayout>
    )
  }

  const paginatedRsvps = filteredRsvps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const pageIds = paginatedRsvps.map((rsvp) => rsvp.id)
  const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedRsvpIds.includes(id))
  const columnCount =
    (isAdminMode ? 1 : 0) +
    1 +
    (visibleColumns.phone ? 1 : 0) +
    (visibleColumns.status ? 1 : 0) +
    (visibleColumns.party ? 1 : 0) +
    (visibleColumns.wishes ? 1 : 0) +
    1

  return (
    <StudioLayout>
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8'>
        <div>
          <h2 className='text-3xl font-serif font-bold text-gray-900'>Quản Lý Khách Mời</h2>
          <p className='text-gray-500 mt-1'>Theo dõi RSVP và tạo liên kết mời ({rsvps.length} khách)</p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <button
            onClick={downloadTemplate}
            className='flex items-center px-6 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl hover:bg-green-100 transition-all shadow-sm'
          >
            <FileSpreadsheet size={18} className='mr-2' /> Tải Mẫu Excel
          </button>
          <button
            onClick={handleExport}
            className='flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm'
          >
            <Download size={18} className='mr-2' /> Xuất Danh Sách
          </button>
          <label className='flex items-center gap-3 text-sm font-semibold text-gray-600'>
            <span>Chế độ quản trị</span>
            <button
              type='button'
              onClick={() => setIsAdminMode((prev) => !prev)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                isAdminMode ? 'bg-pink-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                  isAdminMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
        </div>
      </div>

      {isAdminMode && (
        <div className='bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <h3 className='text-lg font-bold text-gray-900'>Quản trị nhanh</h3>
              <p className='text-sm text-gray-500'>Đã chọn {selectedRsvpIds.length} khách</p>
            </div>
            <div className='flex flex-wrap gap-3'>
              <button
                onClick={() => toggleSelectAll(true, pageIds)}
                className='px-4 py-2 text-sm font-bold border border-gray-200 rounded-lg hover:bg-gray-50'
              >
                Chọn trang này
              </button>
              <button
                onClick={() => setSelectedRsvpIds([])}
                className='px-4 py-2 text-sm font-bold border border-gray-200 rounded-lg hover:bg-gray-50'
              >
                Bỏ chọn
              </button>
              <button
                onClick={() => bulkUpdateAttendance(true)}
                className='px-4 py-2 text-sm font-bold bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100'
              >
                Đánh dấu tham dự
              </button>
              <button
                onClick={() => bulkUpdateAttendance(false)}
                className='px-4 py-2 text-sm font-bold bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100'
              >
                Đánh dấu vắng
              </button>
              <button
                onClick={bulkGenerateQr}
                className='px-4 py-2 text-sm font-bold bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100'
              >
                QR hàng loạt
              </button>
              <button
                onClick={bulkExport}
                className='px-4 py-2 text-sm font-bold bg-white text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50'
              >
                Xuất đã chọn
              </button>
              <button
                onClick={bulkDelete}
                className='px-4 py-2 text-sm font-bold bg-red-600 text-white rounded-lg hover:bg-red-700'
              >
                Xóa đã chọn
              </button>
            </div>
          </div>
          <div className='mt-4 flex flex-wrap gap-4 text-sm text-gray-600'>
            <label className='flex items-center gap-2'>
              <input type='checkbox' checked={visibleColumns.phone} onChange={() => toggleColumn('phone')} />
              Hiện cột SĐT
            </label>
            <label className='flex items-center gap-2'>
              <input type='checkbox' checked={visibleColumns.status} onChange={() => toggleColumn('status')} />
              Hiện trạng thái
            </label>
            <label className='flex items-center gap-2'>
              <input type='checkbox' checked={visibleColumns.party} onChange={() => toggleColumn('party')} />
              Hiện số lượng
            </label>
            <label className='flex items-center gap-2'>
              <input type='checkbox' checked={visibleColumns.wishes} onChange={() => toggleColumn('wishes')} />
              Hiện lời chúc
            </label>
          </div>
        </div>
      )}

      {/* Import Excel Section */}
      {importedGuests.length === 0 && (
        <div className='bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 mb-8 border border-pink-100'>
          <div className='flex flex-col md:flex-row items-center gap-6'>
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-3'>
                <Upload className='text-pink-600' size={24} />
                <h3 className='text-xl font-bold text-gray-900'>Nhập Hàng Loạt Từ Excel</h3>
              </div>
              <p className='text-gray-600 mb-4'>
                Tải lên file Excel/CSV để thêm nhiều khách mời cùng lúc. Bạn có thể chỉnh sửa thông tin trước khi xác
                nhận.
              </p>
              <div className='flex gap-3'>
                <label className='cursor-pointer'>
                  <input type='file' accept='.csv,.xlsx,.xls' onChange={handleFileUpload} className='hidden' />
                  <div className='flex items-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-all font-bold shadow-lg shadow-pink-200'>
                    <Upload size={18} /> Chọn File Excel
                  </div>
                </label>
                <button
                  onClick={downloadTemplate}
                  className='flex items-center gap-2 px-6 py-3 bg-white border-2 border-pink-200 text-pink-700 rounded-xl hover:bg-pink-50 transition-all font-bold'
                >
                  <FileSpreadsheet size={18} /> Tải Mẫu
                </button>
              </div>
            </div>
            <div className='w-full md:w-64 bg-white rounded-2xl p-4 border border-pink-100 shadow-sm'>
              <div className='text-sm font-bold text-pink-600 uppercase mb-2'>Định dạng file</div>
              <div className='space-y-1 text-sm text-gray-600'>
                <div>• Tên Khách Mời</div>
                <div>• Số Điện Thoại (tùy chọn)</div>
                <div>• Số Lượng Người</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Imported Guests */}
      {importedGuests.length > 0 && (
        <div className='bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8'>
          <div className='p-6 border-b border-gray-100 flex justify-between items-center'>
            <div>
              <h3 className='text-lg font-bold text-gray-900'>Danh Sách Đã Nhập ({importedGuests.length} khách)</h3>
              <p className='text-sm text-gray-500'>Kiểm tra và chỉnh sửa thông tin trước khi xác nhận</p>
            </div>
            <div className='flex gap-3'>
              <button
                onClick={() => setImportedGuests([])}
                className='px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium'
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmImport}
                className='px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-lg shadow-green-200'
              >
                Xác Nhận Thêm Vào Danh Sách
              </button>
            </div>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 text-gray-600 text-sm font-bold uppercase'>
                <tr>
                  <th className='px-6 py-3 text-left'>STT</th>
                  <th className='px-6 py-3 text-left'>Tên Khách Mời</th>
                  <th className='px-6 py-3 text-left'>Số Điện Thoại</th>
                  <th className='px-6 py-3 text-left'>Số Lượng</th>
                  <th className='px-6 py-3 text-right'>Thao Tác</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {importedGuests.map((guest, idx) => (
                  <tr key={idx} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 text-gray-500 font-mono text-sm'>{idx + 1}</td>
                    <td className='px-6 py-4 font-bold text-gray-900'>{guest.guest_name}</td>
                    <td className='px-6 py-4 text-gray-600 font-mono'>{guest.phone || '-'}</td>
                    <td className='px-6 py-4 text-gray-900 font-medium'>{guest.party_size}</td>
                    <td className='px-6 py-4 text-right'>
                      <div className='flex gap-2 justify-end'>
                        <button
                          onClick={() => handleEditImportedGuest(idx)}
                          className='p-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors'
                          title='Chỉnh sửa'
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteImportedGuest(idx)}
                          className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                          title='Xóa'
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className='space-y-8'>
        {/* Link Generator - Full Width */}
        <div className='bg-white p-6 rounded-3xl shadow-sm border border-pink-100'>
          <div className='flex items-center gap-2 mb-4 text-pink-600 font-bold uppercase text-xs tracking-wider'>
            <LinkIcon size={16} />
            <span>Tạo Link Mời</span>
          </div>
          <h3 className='text-lg font-bold text-gray-900 mb-4'>Tạo Link Cá Nhân Hóa</h3>
          <p className='text-sm text-gray-500 mb-4'>Nhập đầy đủ thông tin khách để tạo link mời riêng.</p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-bold text-gray-700 mb-1'>Tên Khách Mời (*)</label>
              <div className='relative'>
                <UserPlus className='absolute left-3 top-3 text-gray-400' size={20} />
                <input
                  type='text'
                  className='w-full pl-10 pr-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all'
                  placeholder='Ví dụ: Anh Nam & Chị Lan'
                  value={linkFormData.name}
                  onChange={(e) => setLinkFormData({ ...linkFormData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-1'>Số Điện Thoại (tùy chọn)</label>
              <input
                type='tel'
                className='w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all'
                placeholder='0901234567'
                value={linkFormData.phone}
                onChange={(e) => setLinkFormData({ ...linkFormData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className='block text-sm font-bold text-gray-700 mb-1'>Số Lượng Người</label>
              <input
                type='number'
                min='1'
                className='w-full px-4 py-3 bg-gray-50 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all'
                value={linkFormData.partySize}
                onChange={(e) => setLinkFormData({ ...linkFormData, partySize: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>

          <button
            onClick={generateLink}
            disabled={!linkFormData.name.trim()}
            className='mt-4 w-full md:w-auto px-8 bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700 transition-all font-bold shadow-lg shadow-pink-200 disabled:opacity-50 disabled:shadow-none'
          >
            Tạo Link
          </button>

          {generatedLink && (
            <div className='mt-6 p-4 bg-green-50 rounded-2xl border border-green-100 animate-in slide-in-from-top-2'>
              <div className='text-xs font-bold text-green-700 uppercase mb-2'>Tạo Thành Công</div>
              <code className='block text-sm text-gray-600 break-all bg-white p-2 rounded border border-green-100 mb-3'>
                {generatedLink}
              </code>
              <div className='flex gap-2'>
                <button
                  onClick={() => copyToClipboard(generatedLink)}
                  className='flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium'
                >
                  <Copy size={16} /> Sao chép
                </button>
                <button
                  className='flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-md shadow-blue-200'
                  onClick={() =>
                    window.open(`http://zalo.me/share/?url=${encodeURIComponent(generatedLink)}`, '_blank')
                  }
                >
                  <Share2 size={16} /> Zalo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RSVP List - Full Width */}
        <div className='bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden'>
          <div className='p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4'>
            <div className='relative w-full sm:w-auto flex-1'>
              <Search className='absolute left-3 top-3 text-gray-400' size={18} />
              <input
                type='text'
                placeholder='Tìm kiếm khách mời...'
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

          <div className='bg-gray-50/50 p-6 rounded-b-3xl min-h-[400px]'>
            {paginatedRsvps.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-12 text-center'>
                <div className='w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-gray-300 shadow-sm'>
                  <Search size={24} />
                </div>
                <h3 className='text-lg font-bold text-gray-900'>Không tìm thấy khách mời</h3>
                <p className='text-gray-500 max-w-xs mx-auto mt-1'>
                  Thử tìm kiếm với từ khóa khác hoặc thêm khách mời mới vào danh sách.
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                {paginatedRsvps.map((rsvp) => {
                  const isSelected = selectedRsvpIds.includes(rsvp.id)
                  return (
                    <div
                      key={rsvp.id}
                      className={`group relative bg-white rounded-2xl p-5 border transition-all hover:shadow-lg ${
                        isSelected
                          ? 'border-pink-500 ring-1 ring-pink-500 shadow-pink-100'
                          : 'border-gray-100 shadow-sm'
                      }`}
                      onClick={() => isAdminMode && toggleRsvpSelection(rsvp.id)}
                    >
                      {/* Flex Container for Horizontal Layout */}
                      <div className='flex flex-col sm:flex-row gap-4 h-full'>
                        {/* Left Side: Info */}
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-start justify-between gap-2 mb-2'>
                            <h3 className='font-bold text-gray-900 text-lg truncate' title={rsvp.guest_name}>
                              {rsvp.guest_name}
                            </h3>
                            {/* Mobile Checkbox (if needed) or Status for Mobile Layout */}
                          </div>

                          {/* Details Row: Inline on Desktop */}
                          <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-3'>
                            {visibleColumns.phone && (
                              <div className='flex items-center gap-1.5'>
                                <Phone size={14} className='text-gray-400' />
                                {rsvp.phone ? (
                                  <span className='font-mono font-medium'>{rsvp.phone}</span>
                                ) : (
                                  <span className='text-gray-300 italic text-xs'>Trống</span>
                                )}
                              </div>
                            )}
                            {visibleColumns.party && (
                              <div className='flex items-center gap-1.5'>
                                <Users size={14} className='text-gray-400' />
                                <div className='flex items-center gap-2'>
                                  <span className='hidden sm:inline text-gray-500'>Khách:</span>
                                  {isAdminMode ? (
                                    <input
                                      type='number'
                                      min={1}
                                      value={rsvp.party_size ?? 1}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) => {
                                        const updatedRsvps = rsvps.map((r) =>
                                          r.id === rsvp.id ? { ...r, party_size: parseInt(e.target.value) || 1 } : r
                                        )
                                        setRsvps(updatedRsvps)
                                        setFilteredRsvps(updatedRsvps)
                                      }}
                                      className='w-12 h-6 text-center border border-gray-200 rounded text-xs font-bold focus:border-pink-500 focus:outline-none bg-gray-50 focus:bg-white'
                                    />
                                  ) : (
                                    <span className='font-bold text-gray-900'>{rsvp.party_size}</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Wishes / Message */}
                          {visibleColumns.wishes && (rsvp.wishes || isAdminMode) && (
                            <div className='flex items-start gap-2 text-sm text-gray-500 bg-gray-50/80 rounded-lg p-2.5'>
                              <MessageSquare size={14} className='mt-0.5 text-gray-400 shrink-0' />
                              <p className='line-clamp-2 italic text-xs w-full'>
                                {rsvp.wishes || <span className='text-gray-300'>Chưa có lời chúc</span>}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Right Side: Status & Actions */}
                        <div className='flex flex-row sm:flex-col sm:items-end justify-between sm:justify-start gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 sm:pl-4 sm:border-l border-gray-50 min-w-[120px]'>
                          {/* Status Badge */}
                          <div className='flex items-center gap-2'>
                            {isAdminMode && (
                              <div onClick={(e) => e.stopPropagation()} className='sm:hidden'>
                                <input
                                  type='checkbox'
                                  checked={isSelected}
                                  onChange={() => toggleRsvpSelection(rsvp.id)}
                                  className='w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500'
                                />
                              </div>
                            )}

                            {rsvp.is_attending ? (
                              <span className='inline-flex items-center px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold border border-green-100 whitespace-nowrap'>
                                Tham dự
                              </span>
                            ) : (
                              <span className='inline-flex items-center px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold border border-red-100 whitespace-nowrap'>
                                Vắng mặt
                              </span>
                            )}

                            {isAdminMode && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const updatedRsvps = rsvps.map((r) =>
                                    r.id === rsvp.id ? { ...r, is_attending: !r.is_attending } : r
                                  )
                                  setRsvps(updatedRsvps)
                                  setFilteredRsvps(updatedRsvps)
                                }}
                                className='hidden sm:block text-xs text-gray-400 hover:text-pink-600 underline decoration-dotted'
                              >
                                Đổi
                              </button>
                            )}
                          </div>

                          {/* Actions Row */}
                          <div className='flex gap-1 justify-end mt-auto'>
                            {isAdminMode && (
                              <div className='hidden sm:flex items-center justify-center w-8 h-8 mr-2 absolute top-4 right-4'>
                                <div
                                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'bg-pink-500 border-pink-500 text-white'
                                      : 'bg-white border-gray-300 text-transparent hover:border-pink-300'
                                  }`}
                                >
                                  <Check size={14} strokeWidth={3} />
                                </div>
                              </div>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                copyToClipboard(getGuestLink(rsvp), 'link')
                              }}
                              className='w-8 h-8 flex items-center justify-center text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors'
                              title='Sao chép link mời'
                            >
                              <LinkIcon size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleShowQR(rsvp)
                              }}
                              className='w-8 h-8 flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors'
                              title='Xem mã QR'
                            >
                              <QrCode size={16} />
                            </button>

                            {isAdminMode && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditRSVP(rsvp)
                                  }}
                                  className='w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                                  title='Chỉnh sửa'
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteRSVP(rsvp)
                                  }}
                                  className='w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                                  title='Xóa khách'
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {filteredRsvps.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredRsvps.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              itemLabel='khách mời'
              accentColor='pink'
            />
          )}
        </div>
      </div>

      {/* Edit Imported Guest Modal */}
      {editingGuest && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-2xl max-w-md w-full shadow-2xl'>
            <div className='p-6 border-b border-gray-100 flex justify-between items-center'>
              <h3 className='text-lg font-bold text-gray-900'>Chỉnh Sửa Thông Tin</h3>
              <button
                onClick={() => setEditingGuest(null)}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <X size={20} />
              </button>
            </div>
            <div className='p-6 space-y-4'>
              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Tên Khách Mời</label>
                <input
                  type='text'
                  value={editingGuest.guest.guest_name}
                  onChange={(e) =>
                    setEditingGuest({
                      ...editingGuest,
                      guest: { ...editingGuest.guest, guest_name: e.target.value }
                    })
                  }
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none'
                />
              </div>
              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Số Điện Thoại</label>
                <input
                  type='text'
                  value={editingGuest.guest.phone || ''}
                  onChange={(e) =>
                    setEditingGuest({
                      ...editingGuest,
                      guest: { ...editingGuest.guest, phone: e.target.value }
                    })
                  }
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none'
                />
              </div>
              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Số Lượng Người</label>
                <input
                  type='number'
                  min='1'
                  value={editingGuest.guest.party_size}
                  onChange={(e) =>
                    setEditingGuest({
                      ...editingGuest,
                      guest: { ...editingGuest.guest, party_size: parseInt(e.target.value) || 1 }
                    })
                  }
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none'
                />
              </div>
            </div>
            <div className='p-6 border-t border-gray-100 flex gap-3 justify-end'>
              <button
                onClick={() => setEditingGuest(null)}
                className='px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium'
              >
                Hủy
              </button>
              <button
                onClick={handleSaveImportedEdit}
                className='px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-bold'
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit RSVP Modal */}
      {editingRSVP && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-2xl max-w-md w-full shadow-2xl'>
            <div className='p-6 border-b border-gray-100 flex justify-between items-center'>
              <h3 className='text-lg font-bold text-gray-900'>Chỉnh Sửa Khách Mời</h3>
              <button
                onClick={() => setEditingRSVP(null)}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <X size={20} />
              </button>
            </div>
            <div className='p-6 space-y-4'>
              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Tên Khách Mời</label>
                <input
                  type='text'
                  value={editingRSVP.guest_name}
                  onChange={(e) => setEditingRSVP({ ...editingRSVP, guest_name: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none'
                />
              </div>
              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Số Điện Thoại</label>
                <input
                  type='text'
                  value={editingRSVP.phone || ''}
                  onChange={(e) => setEditingRSVP({ ...editingRSVP, phone: e.target.value })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none'
                />
              </div>
              <div>
                <label className='block text-sm font-bold text-gray-700 mb-2'>Số Lượng Người</label>
                <input
                  type='number'
                  min='1'
                  value={editingRSVP.party_size ?? 1}
                  onChange={(e) => setEditingRSVP({ ...editingRSVP, party_size: parseInt(e.target.value) || 1 })}
                  className='w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none'
                />
              </div>
            </div>
            <div className='p-6 border-t border-gray-100 flex gap-3 justify-end'>
              <button
                onClick={() => setEditingRSVP(null)}
                className='px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium'
              >
                Hủy
              </button>
              <button
                onClick={handleSaveRSVPEdit}
                className='px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-bold'
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrGuest && (
        <div
          className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'
          onClick={() => setQrGuest(null)}
        >
          <div className='bg-white rounded-2xl max-w-md w-full shadow-2xl' onClick={(e) => e.stopPropagation()}>
            <div className='p-6 border-b border-gray-100 flex justify-between items-center'>
              <h3 className='text-lg font-bold text-gray-900'>QR Code - {qrGuest.name}</h3>
              <button onClick={() => setQrGuest(null)} className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                <X size={20} />
              </button>
            </div>
            <div className='p-8 flex flex-col items-center'>
              <canvas ref={qrCanvasRef} className='border-4 border-gray-200 rounded-xl shadow-lg mb-4' />
              <p className='text-sm text-gray-500 text-center mb-4 break-all'>{qrGuest.link}</p>
              <div className='flex gap-3 w-full'>
                <button
                  onClick={() => copyToClipboard(qrGuest.link, 'link')}
                  className='flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 font-medium'
                >
                  <Copy size={16} /> Sao chép Link
                </button>
                <button
                  onClick={downloadQR}
                  className='flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold shadow-lg shadow-purple-200'
                >
                  <Download size={16} /> Tải QR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StudioLayout>
  )
}

export default Guests
