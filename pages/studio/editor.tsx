import {
  Image as ImageIcon,
  Info,
  LayoutList,
  Music,
  Palette,
  Pencil,
  Plus,
  QrCode,
  Save,
  Trash2,
  X
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/initSupabase'
import StudioEmptyState from '../../components/studio/StudioEmptyState'
import LivePreview from '../../components/studio/LivePreview'
import StudioLayout from '../../components/studio/StudioLayout'
import StudioLoading from '../../components/studio/StudioLoading'
import TabAlbum from '../../components/studio/TabAlbum'
import TabQR from '../../components/studio/TabQR'
import TabInfo from '../../components/studio/TabInfo'
import TabStyle from '../../components/studio/TabStyle'
import { useToast } from '../../components/ui/ToastProvider'
import { dataService } from '../../lib/data-service'
import { processImages, processSingleImage } from '../../lib/image-processor'
import type { ImagePosition } from '../../lib/imageUtils'
import { useWedding } from '../../lib/useWedding'
import { useAdmin } from '../../lib/useAdmin'

const Editor = () => {
  const { wedding, setWedding, loading } = useWedding()
  const { isAdmin } = useAdmin()
  const [activeTab, setActiveTab] = useState<'info' | 'album' | 'bank' | 'style' | 'music' | 'admin'>('info')
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const [adminSection, setAdminSection] = useState<'cards' | 'music'>('cards')
  const [allWeddings, setAllWeddings] = useState<
    Array<{
      id: string
      slug: string
      host_id: string
      deployment_status: string | null
      created_at: string
      content: any
    }>
  >([])
  const [loadingWeddings, setLoadingWeddings] = useState(false)
  const [allMusics, setAllMusics] = useState<Array<{ id: number; title: string; artist: string | null; url: string }>>(
    []
  )
  const [loadingMusics, setLoadingMusics] = useState(false)
  const [musicList, setMusicList] = useState<
    Array<{ id: number; title: string; artist: string | null; url: string; is_active: boolean | null }>
  >([])
  const [showAddMusic, setShowAddMusic] = useState(false)
  const [newMusicTitle, setNewMusicTitle] = useState('')
  const [newMusicArtist, setNewMusicArtist] = useState('')
  const [newMusicFile, setNewMusicFile] = useState<File | null>(null)
  const [uploadingMusic, setUploadingMusic] = useState(false)
  const [editingMusicId, setEditingMusicId] = useState<number | null>(null)
  const [editMusicTitle, setEditMusicTitle] = useState('')
  const [editMusicArtist, setEditMusicArtist] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const previewAudioRef = useRef<HTMLAudioElement | null>(null)
  const [playingMusicId, setPlayingMusicId] = useState<number | null>(null)
  const [adminSelectedWedding, setAdminSelectedWedding] = useState<{
    id: string
    slug: string
    host_id: string
    deployment_status: string | null
    created_at: string
    content: any
  } | null>(null)
  const [adminSaving, setAdminSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [originalImages, setOriginalImages] = useState<string[]>([])
  const [originalCoverImage, setOriginalCoverImage] = useState<string | null>(null)
  const [originalQrImage, setOriginalQrImage] = useState<string | null>(null)
  const [originalGroomImage, setOriginalGroomImage] = useState<string | null>(null)
  const [originalBrideImage, setOriginalBrideImage] = useState<string | null>(null)
  const [originalMusicId, setOriginalMusicId] = useState<number | null>(null)
  const [originalStyle, setOriginalStyle] = useState<Record<string, string>>({})
  const [isDirty, setIsDirty] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null)
  const { success, error } = useToast()

  // Store original images when wedding loads
  useEffect(() => {
    if (wedding?.content?.images) {
      setOriginalImages(wedding.content.images)
    }
    setOriginalCoverImage(wedding?.content?.cover_image || null)
    setOriginalQrImage(wedding?.content?.qr_image || null)
    setOriginalGroomImage(wedding?.content?.groom_image || null)
    setOriginalBrideImage(wedding?.content?.bride_image || null)
    setOriginalMusicId(wedding?.music_id ?? null)
    setOriginalStyle({
      primary_color: wedding?.content?.primary_color || '',
      font_family: wedding?.content?.font_family || '',
      heading_font_family: wedding?.content?.heading_font_family || '',
      section_font_family: wedding?.content?.section_font_family || ''
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wedding?.id])

  // Stop preview audio when leaving music tab
  useEffect(() => {
    if (activeTab !== 'music' && previewAudioRef.current) {
      previewAudioRef.current.pause()
      previewAudioRef.current = null
      setPlayingMusicId(null)
    }
  }, [activeTab])

  // Cleanup preview audio on unmount
  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause()
        previewAudioRef.current = null
      }
    }
  }, [])

  const handleInfoChange = (key: string, value: string) => {
    if (!wedding) return
    setIsDirty(true)
    setWedding((prev) => (prev ? { ...prev, content: { ...prev.content, [key]: value } } : prev))
  }

  const handleStyleReset = () => {
    if (!wedding) return
    const clearedStyle: Record<string, string | undefined> = {
      primary_color: originalStyle.primary_color || undefined,
      font_family: originalStyle.font_family || undefined,
      heading_font_family: originalStyle.heading_font_family || undefined,
      section_font_family: originalStyle.section_font_family || undefined
    }
    setWedding((prev) =>
      prev
        ? {
            ...prev,
            content: {
              ...prev.content,
              ...clearedStyle
            }
          }
        : prev
    )
    setIsDirty(true)
  }

  const handleBatchChange = (changes: Record<string, string>) => {
    if (!wedding) return
    setIsDirty(true)
    setWedding((prev) => (prev ? { ...prev, content: { ...prev.content, ...changes } } : prev))
  }

  const handleImagesChange = (images: string[]) => {
    if (!wedding) return
    setIsDirty(true)
    setWedding((prev) => (prev ? { ...prev, content: { ...prev.content, images } } : prev))
  }

  const handleCoverImageChange = (coverImage: string | null) => {
    if (!wedding) return
    setIsDirty(true)
    setWedding((prev) => (prev ? { ...prev, content: { ...prev.content, cover_image: coverImage } } : prev))
  }

  const handleQrImageChange = (qrImage: string | null) => {
    if (!wedding) return
    setIsDirty(true)
    setWedding((prev) => (prev ? { ...prev, content: { ...prev.content, qr_image: qrImage } } : prev))
  }

  const handleImagePositionsChange = (positions: (ImagePosition | null)[]) => {
    if (!wedding) return
    setIsDirty(true)
    setWedding((prev) => (prev ? { ...prev, content: { ...prev.content, image_positions: positions } } : prev))
  }

  const handleCoverImagePositionChange = (position: ImagePosition) => {
    if (!wedding) return
    setIsDirty(true)
    setWedding((prev) => (prev ? { ...prev, content: { ...prev.content, cover_image_position: position } } : prev))
  }

  const handleImageDeleted = (url: string) => {
    setOriginalImages((prev) => prev.filter((img) => img !== url))
    setOriginalCoverImage((prev) => (prev === url ? null : prev))
    setOriginalQrImage((prev) => (prev === url ? null : prev))
    setOriginalGroomImage((prev) => (prev === url ? null : prev))
    setOriginalBrideImage((prev) => (prev === url ? null : prev))
  }

  const handleSave = async () => {
    if (!wedding) return
    setSaving(true)
    setUploadProgress(null)
    try {
      const previousImages = originalImages
      const currentImages = wedding.content.images || []
      const coverIsBase64 = Boolean(wedding.content.cover_image?.startsWith('data:'))
      const qrIsBase64 = Boolean(wedding.content.qr_image?.startsWith('data:'))
      const groomIsBase64 = Boolean(wedding.content.groom_image?.startsWith('data:'))
      const brideIsBase64 = Boolean(wedding.content.bride_image?.startsWith('data:'))

      // Count total images to upload for progress tracking
      const imagesToUploadCount = currentImages.filter((img) => img.startsWith('data:')).length
      const totalToUpload =
        imagesToUploadCount +
        (coverIsBase64 ? 1 : 0) +
        (qrIsBase64 ? 1 : 0) +
        (groomIsBase64 ? 1 : 0) +
        (brideIsBase64 ? 1 : 0)

      if (totalToUpload > 0) {
        setUploadProgress({ current: 0, total: totalToUpload })
      }

      const { newImages, uploadedCount, deletedCount, failedCount } = await processImages(
        currentImages,
        previousImages,
        wedding.slug ?? undefined,
        (current, total) => {
          setUploadProgress({ current, total: totalToUpload })
        }
      )

      let progressCurrent = imagesToUploadCount

      const newCoverImage = await processSingleImage(
        wedding.content.cover_image,
        originalCoverImage,
        wedding.slug ?? undefined
      )
      if (coverIsBase64) {
        progressCurrent++
        setUploadProgress({ current: progressCurrent, total: totalToUpload })
      }

      const newQrImage = await processSingleImage(
        wedding.content.qr_image ?? null,
        originalQrImage,
        wedding.slug ?? undefined
      )
      if (qrIsBase64) {
        progressCurrent++
        setUploadProgress({ current: progressCurrent, total: totalToUpload })
      }

      const newGroomImage = await processSingleImage(
        wedding.content.groom_image ?? null,
        originalGroomImage,
        wedding.slug ?? undefined
      )
      if (groomIsBase64) {
        progressCurrent++
        setUploadProgress({ current: progressCurrent, total: totalToUpload })
      }

      const newBrideImage = await processSingleImage(
        wedding.content.bride_image ?? null,
        originalBrideImage,
        wedding.slug ?? undefined
      )
      if (brideIsBase64) {
        progressCurrent++
        setUploadProgress({ current: progressCurrent, total: totalToUpload })
      }

      const coverUploadFailed = coverIsBase64 && !newCoverImage
      const qrUploadFailed = qrIsBase64 && !newQrImage
      const groomUploadFailed = groomIsBase64 && !newGroomImage
      const brideUploadFailed = brideIsBase64 && !newBrideImage
      if (failedCount > 0 || coverUploadFailed || qrUploadFailed || groomUploadFailed || brideUploadFailed) {
        error('Tải ảnh lên Cloudinary thất bại. Vui lòng kiểm tra kết nối và thử lại.')
        return
      }

      if (uploadedCount > 0 || deletedCount > 0) {
        console.log(`Images processed: +${uploadedCount} uploaded, -${deletedCount} deleted`)
      }

      const updatedContent = {
        ...wedding.content,
        images: newImages,
        cover_image: newCoverImage,
        qr_image: newQrImage,
        groom_image: newGroomImage,
        bride_image: newBrideImage
      }
      await dataService.updateWedding(wedding.id, updatedContent, wedding.music_id ?? null)

      // Update local state and original images
      setWedding({ ...wedding, content: updatedContent })
      setOriginalImages(newImages)
      setOriginalCoverImage(newCoverImage)
      setOriginalQrImage(newQrImage)
      setOriginalGroomImage(newGroomImage)
      setOriginalBrideImage(newBrideImage)
      setOriginalMusicId(wedding.music_id ?? null)
      setIsDirty(false)

      // Dừng nhạc preview sau khi lưu
      if (previewAudioRef.current) {
        previewAudioRef.current.pause()
      }
      setPlayingMusicId(null)

      success('Lưu thay đổi thành công!')
    } catch (e) {
      console.error('Save error:', e)
      error('Lưu thất bại. Vui lòng thử lại.')
    } finally {
      setSaving(false)
      setUploadProgress(null)
    }
  }

  const handleTogglePublish = async () => {
    if (!wedding) return
    setPublishing(true)
    const isPublished = wedding.deployment_status === 'published'
    try {
      const newStatus = isPublished ? 'draft' : 'published'
      const { error: publishError } = await supabase
        .from('weddings')
        .update({ deployment_status: newStatus })
        .eq('id', wedding.id)

      if (publishError) throw publishError

      setWedding({ ...wedding, deployment_status: newStatus })

      if (isPublished) {
        success('Đã tắt công khai. Thiệp của bạn chỉ bạn mới xem được.')
      } else {
        success('Đã công khai! Thiệp của bạn có thể được xem bởi mọi người.')
      }
    } catch (e) {
      console.error('Toggle publish error:', e)
      error('Thao tác thất bại. Vui lòng thử lại.')
    } finally {
      setPublishing(false)
    }
  }

  useEffect(() => {
    if (isAdminMode) {
      setActiveTab('admin')
    } else if (activeTab === 'admin') {
      setActiveTab('info')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdminMode])

  const fetchAllWeddings = async () => {
    setLoadingWeddings(true)
    try {
      const { data } = await supabase
        .from('weddings')
        .select('id, slug, host_id, deployment_status, created_at, content')
        .order('created_at', { ascending: false })
      setAllWeddings(data || [])
    } catch {
      error('Không thể tải danh sách thiệp.')
    } finally {
      setLoadingWeddings(false)
    }
  }

  const fetchAllMusics = async () => {
    setLoadingMusics(true)
    try {
      const res = await fetch('/api/admin/musics')
      if (!res.ok) throw new Error('Fetch failed')
      setAllMusics(await res.json())
    } catch {
      error('Không thể tải danh sách nhạc.')
    } finally {
      setLoadingMusics(false)
    }
  }

  const fetchMusicList = async () => {
    try {
      const res = await fetch('/api/admin/musics')
      if (!res.ok) throw new Error('Fetch failed')
      setMusicList(await res.json())
    } catch {
      error('Không thể tải danh sách nhạc.')
    }
  }

  const handleAddMusic = async () => {
    if (!newMusicTitle.trim() || !newMusicFile) return
    setUploadingMusic(true)
    try {
      const signRes = await fetch('/api/sign-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: 'music' })
      })
      if (!signRes.ok) throw new Error('Failed to get upload signature')
      const { signature, timestamp, api_key, cloud_name } = await signRes.json()

      const formData = new FormData()
      formData.append('file', newMusicFile)
      formData.append('api_key', api_key)
      formData.append('timestamp', String(timestamp))
      formData.append('signature', signature)
      formData.append('folder', 'music')

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`, {
        method: 'POST',
        body: formData
      })
      if (!uploadRes.ok) throw new Error('Cloudinary upload failed')
      const { secure_url } = await uploadRes.json()

      const saveRes = await fetch('/api/admin/musics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newMusicTitle.trim(), artist: newMusicArtist.trim() || null, url: secure_url })
      })
      if (!saveRes.ok) {
        const body = await saveRes.json().catch(() => ({}))
        throw new Error(body.error || `HTTP ${saveRes.status}`)
      }
      const saved = await saveRes.json()

      setMusicList((prev) => [saved, ...prev])
      setNewMusicTitle('')
      setNewMusicArtist('')
      setNewMusicFile(null)
      setShowAddMusic(false)
      success('Đã thêm nhạc.')
    } catch (e: any) {
      console.error('Add music error:', e)
      error(`Thêm nhạc thất bại: ${e?.message || 'Vui lòng thử lại.'}`)
    } finally {
      setUploadingMusic(false)
    }
  }

  const handleRemoveMusic = async (id: number, url: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài nhạc này? File sẽ bị xóa khỏi Cloudinary.')) return
    try {
      const res = await fetch('/api/admin/musics', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, url })
      })
      if (!res.ok) throw new Error('Delete failed')
      setMusicList((prev) => prev.filter((m) => m.id !== id))
    } catch {
      error('Xóa nhạc thất bại.')
    }
  }

  const handleUpdateMusic = async () => {
    if (!editingMusicId || !editMusicTitle.trim()) return
    setSavingEdit(true)
    try {
      const res = await fetch('/api/admin/musics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingMusicId,
          title: editMusicTitle.trim(),
          artist: editMusicArtist.trim() || null
        })
      })
      if (!res.ok) throw new Error('Update failed')
      const updated = await res.json()
      setMusicList((prev) =>
        prev.map((m) => (m.id === updated.id ? { ...m, title: updated.title, artist: updated.artist } : m))
      )
      setEditingMusicId(null)
    } catch {
      error('Cập nhật nhạc thất bại.')
    } finally {
      setSavingEdit(false)
    }
  }

  const handleOpenEdit = (w: (typeof allWeddings)[0]) => {
    setAdminSelectedWedding(w)
    setActiveTab('info')
  }

  const handleAdminContentChange = (key: string, value: string) => {
    if (!adminSelectedWedding) return
    setAdminSelectedWedding((prev) => (prev ? { ...prev, content: { ...prev.content, [key]: value } } : prev))
  }

  const handleAdminSave = async () => {
    if (!adminSelectedWedding) return
    setAdminSaving(true)
    try {
      const { error: saveError } = await supabase
        .from('weddings')
        .update({ content: adminSelectedWedding.content })
        .eq('id', adminSelectedWedding.id)
      if (saveError) throw saveError
      setAllWeddings((prev) => prev.map((w) => (w.id === adminSelectedWedding.id ? adminSelectedWedding : w)))
      success('Đã lưu thay đổi thiệp.')
    } catch {
      error('Lưu thất bại. Vui lòng thử lại.')
    } finally {
      setAdminSaving(false)
    }
  }

  const handleDeleteWedding = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa thiệp này? Hành động này không thể hoàn tác.')) return
    setDeletingId(id)
    try {
      const { error: deleteError } = await supabase.from('weddings').delete().eq('id', id)
      if (deleteError) throw deleteError
      setAllWeddings((prev) => prev.filter((w) => w.id !== id))
      success('Đã xóa thiệp.')
    } catch {
      error('Xóa thất bại. Vui lòng thử lại.')
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    if (activeTab === 'admin' && adminSection === 'cards') {
      fetchAllWeddings()
    }
    if (activeTab === 'admin' && adminSection === 'music') {
      fetchMusicList()
    }
    if (activeTab === 'music' && !isAdminMode) {
      fetchAllMusics()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, adminSection])

  if (loading)
    return (
      <StudioLayout>
        <StudioLoading message='Đang tải trình chỉnh sửa...' />
      </StudioLayout>
    )

  return (
    <StudioLayout>
      <div className='mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <h2 className='text-3xl font-serif font-bold text-gray-900'>Chỉnh Sửa Thiệp</h2>
          <p className='text-gray-500 mt-1'>Tùy chỉnh nội dung thiệp mời của bạn</p>
        </div>
        <div className='flex flex-wrap items-center gap-4'>
          {isAdmin && (
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
          )}
          <button
            onClick={handleTogglePublish}
            disabled={saving || publishing}
            className={`flex items-center justify-center px-6 py-3 text-white rounded-xl transition-all shadow-lg disabled:opacity-50 font-medium ${
              wedding?.deployment_status === 'published'
                ? 'bg-gray-500 hover:bg-gray-600 shadow-gray-200'
                : 'bg-pink-600 hover:bg-pink-700 shadow-pink-200'
            }`}
          >
            {publishing ? (
              wedding?.deployment_status === 'published' ? (
                'Đang tắt...'
              ) : (
                'Đang bật...'
              )
            ) : (
              <>
                <Save size={18} className='mr-2' />
                {wedding?.deployment_status === 'published' ? 'Tắt công khai' : 'Công khai'}
              </>
            )}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || publishing || uploadProgress !== null}
            className='flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl hover:from-indigo-600 hover:to-violet-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 font-medium'
          >
            {saving ? (
              uploadProgress ? (
                `Đang tải (${uploadProgress.current}/${uploadProgress.total})...`
              ) : (
                'Đang lưu...'
              )
            ) : (
              <>
                <Save size={18} className='mr-2' /> Lưu
              </>
            )}
          </button>
        </div>
      </div>

      {/* Upload Progress Bar */}
      {uploadProgress && (
        <div className='mb-4 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-xl p-4 shadow-sm'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-semibold text-indigo-900'>Đang tải ảnh lên Cloudinary...</span>
            <span className='text-sm font-bold text-indigo-700'>
              {uploadProgress.current}/{uploadProgress.total}
            </span>
          </div>
          <div className='w-full bg-indigo-200 rounded-full h-2.5 overflow-hidden shadow-inner'>
            <div
              className='bg-gradient-to-r from-indigo-500 to-violet-600 h-full transition-all duration-500 ease-out shadow-md'
              style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
            />
          </div>
          <p className='text-xs text-indigo-600 mt-2'>Vui lòng không đóng trang...</p>
        </div>
      )}

      <div
        className={`grid gap-8 ${isAdminMode && !adminSelectedWedding ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]'}`}
      >
        <div className='bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden min-h-[600px]'>
          {/* Tab bar - ẩn khi ở chế độ admin thuần, hiện khi đang sửa thiệp cụ thể hoặc chế độ thường */}
          {(!isAdminMode || adminSelectedWedding) && (
            <div className='flex border-b border-gray-100 overflow-x-auto'>
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 min-w-[80px] py-4 text-center font-medium transition-colors border-b-2 ${
                  activeTab === 'info'
                    ? 'border-pink-500 text-pink-600 bg-pink-50/30'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className='flex items-center justify-center gap-1 md:gap-2'>
                  <Info size={18} /> <span className='hidden xl:inline'>Thông Tin</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('album')}
                className={`flex-1 min-w-[80px] py-4 text-center font-medium transition-colors border-b-2 ${
                  activeTab === 'album'
                    ? 'border-pink-500 text-pink-600 bg-pink-50/30'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className='flex items-center justify-center gap-1 md:gap-2'>
                  <ImageIcon size={18} /> <span className='hidden xl:inline'>Album Ảnh</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('bank')}
                className={`flex-1 min-w-[80px] py-4 text-center font-medium transition-colors border-b-2 ${
                  activeTab === 'bank'
                    ? 'border-pink-500 text-pink-600 bg-pink-50/30'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className='flex items-center justify-center gap-1 md:gap-2'>
                  <QrCode size={18} /> <span className='hidden xl:inline'>Tiền mừng</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('style')}
                className={`flex-1 min-w-[80px] py-4 text-center font-medium transition-colors border-b-2 ${
                  activeTab === 'style'
                    ? 'border-pink-500 text-pink-600 bg-pink-50/30'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className='flex items-center justify-center gap-1 md:gap-2'>
                  <Palette size={18} /> <span className='hidden xl:inline'>Kiểu Dáng</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('music')}
                className={`flex-1 min-w-[80px] py-4 text-center font-medium transition-colors border-b-2 ${
                  activeTab === 'music'
                    ? 'border-pink-500 text-pink-600 bg-pink-50/30'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className='flex items-center justify-center gap-1 md:gap-2'>
                  <Music size={18} /> <span className='hidden xl:inline'>Nhạc</span>
                </div>
              </button>
            </div>
          )}

          {/* Tab Content */}
          <div className='p-4 md:p-8'>
            {isAdminMode && adminSelectedWedding ? (
              /* Admin đang sửa thiệp của người dùng */
              <div>
                <div className='flex items-center justify-between mb-6 pb-4 border-b border-gray-100'>
                  <button
                    onClick={() => {
                      setAdminSelectedWedding(null)
                      setActiveTab('info')
                    }}
                    className='flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors'
                  >
                    ← Quay lại quản trị
                  </button>
                  <div className='flex items-center gap-3'>
                    <span className='text-xs text-gray-400'>
                      Thiệp: <span className='font-mono font-semibold text-gray-600'>{adminSelectedWedding.slug}</span>
                    </span>
                    <button
                      onClick={handleAdminSave}
                      disabled={adminSaving}
                      className='flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-xl text-sm font-semibold hover:bg-pink-700 disabled:opacity-50 transition-colors'
                    >
                      <Save size={15} /> {adminSaving ? 'Đang lưu...' : 'Lưu'}
                    </button>
                  </div>
                </div>
                <div className={activeTab === 'info' ? 'block' : 'hidden'}>
                  <TabInfo content={adminSelectedWedding.content} onChange={handleAdminContentChange} />
                </div>
                <div className={activeTab === 'album' ? 'block' : 'hidden'}>
                  <TabAlbum
                    images={adminSelectedWedding.content?.images || []}
                    onChange={(images) =>
                      setAdminSelectedWedding((prev) =>
                        prev ? { ...prev, content: { ...prev.content, images } } : prev
                      )
                    }
                    coverImage={adminSelectedWedding.content?.cover_image || undefined}
                    onCoverImageChange={(ci) =>
                      setAdminSelectedWedding((prev) =>
                        prev ? { ...prev, content: { ...prev.content, cover_image: ci } } : prev
                      )
                    }
                    groomImage={adminSelectedWedding.content?.groom_image || undefined}
                    onGroomImageChange={(gi) =>
                      setAdminSelectedWedding((prev) =>
                        prev ? { ...prev, content: { ...prev.content, groom_image: gi || undefined } } : prev
                      )
                    }
                    brideImage={adminSelectedWedding.content?.bride_image || undefined}
                    onBrideImageChange={(bi) =>
                      setAdminSelectedWedding((prev) =>
                        prev ? { ...prev, content: { ...prev.content, bride_image: bi || undefined } } : prev
                      )
                    }
                    groomName={adminSelectedWedding.content?.groom_name || ''}
                    brideName={adminSelectedWedding.content?.bride_name || ''}
                    imagePositions={adminSelectedWedding.content?.image_positions || []}
                    onImagePositionsChange={(ip) =>
                      setAdminSelectedWedding((prev) =>
                        prev ? { ...prev, content: { ...prev.content, image_positions: ip } } : prev
                      )
                    }
                    coverImagePosition={adminSelectedWedding.content?.cover_image_position || undefined}
                    onCoverImagePositionChange={(cp) =>
                      setAdminSelectedWedding((prev) =>
                        prev ? { ...prev, content: { ...prev.content, cover_image_position: cp } } : prev
                      )
                    }
                    groomImagePosition={adminSelectedWedding.content?.groom_image_position || undefined}
                    onGroomImagePositionChange={(gp) =>
                      setAdminSelectedWedding((prev) =>
                        prev ? { ...prev, content: { ...prev.content, groom_image_position: gp } } : prev
                      )
                    }
                    brideImagePosition={adminSelectedWedding.content?.bride_image_position || undefined}
                    onBrideImagePositionChange={(bp) =>
                      setAdminSelectedWedding((prev) =>
                        prev ? { ...prev, content: { ...prev.content, bride_image_position: bp } } : prev
                      )
                    }
                    onImageDeleted={() => {}}
                  />
                </div>
                <div className={activeTab === 'bank' ? 'block' : 'hidden'}>
                  <TabQR
                    qrImage={adminSelectedWedding.content?.qr_image ?? null}
                    onQrImageChange={(qr) =>
                      setAdminSelectedWedding((prev) =>
                        prev ? { ...prev, content: { ...prev.content, qr_image: qr } } : prev
                      )
                    }
                  />
                </div>
                <div className={activeTab === 'style' ? 'block' : 'hidden'}>
                  <TabStyle
                    content={adminSelectedWedding.content}
                    onChange={handleAdminContentChange}
                    onBatchChange={(changes) =>
                      setAdminSelectedWedding((prev) =>
                        prev ? { ...prev, content: { ...prev.content, ...changes } } : prev
                      )
                    }
                  />
                </div>
              </div>
            ) : isAdminMode ? (
              /* Chế độ admin thuần: quản lý thiệp + nhạc */
              <div className='space-y-6'>
                {/* Sub-tab selector */}
                <div className='flex gap-2 border-b border-gray-100 pb-4'>
                  <button
                    onClick={() => setAdminSection('cards')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                      adminSection === 'cards'
                        ? 'bg-pink-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <LayoutList size={16} /> Quản lý thiệp
                  </button>
                  <button
                    onClick={() => setAdminSection('music')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                      adminSection === 'music'
                        ? 'bg-pink-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Music size={16} /> Nhạc
                  </button>
                </div>

                {/* Quản lý thiệp */}
                {adminSection === 'cards' && (
                  <div>
                    <div className='flex items-center justify-between mb-4'>
                      <h4 className='font-bold text-gray-900 text-lg'>Tất cả thiệp mời</h4>
                      <button
                        onClick={fetchAllWeddings}
                        className='text-sm text-pink-600 hover:text-pink-700 font-medium'
                      >
                        Làm mới
                      </button>
                    </div>
                    {loadingWeddings ? (
                      <div className='text-center py-12 text-gray-400 text-sm'>Đang tải...</div>
                    ) : allWeddings.length === 0 ? (
                      <div className='text-center py-12 text-gray-400 text-sm'>Không có thiệp nào.</div>
                    ) : (
                      <div className='overflow-x-auto rounded-2xl border border-gray-100'>
                        <table className='w-full text-sm'>
                          <thead>
                            <tr className='bg-gray-50 text-gray-500 text-left'>
                              <th className='px-4 py-3 font-semibold'>#</th>
                              <th className='px-4 py-3 font-semibold'>Slug</th>
                              <th className='px-4 py-3 font-semibold'>Cô dâu & Chú rể</th>
                              <th className='px-4 py-3 font-semibold'>Trạng thái</th>
                              <th className='px-4 py-3 font-semibold'>Ngày tạo</th>
                              <th className='px-4 py-3 font-semibold text-center'>Hành động</th>
                            </tr>
                          </thead>
                          <tbody className='divide-y divide-gray-100'>
                            {allWeddings.map((w, idx) => (
                              <tr key={w.id} className='hover:bg-pink-50/30 transition-colors'>
                                <td className='px-4 py-3 text-gray-400'>{idx + 1}</td>
                                <td className='px-4 py-3 font-mono text-xs text-gray-700'>{w.slug}</td>
                                <td className='px-4 py-3 text-gray-800'>
                                  {[w.content?.groom_name, w.content?.bride_name].filter(Boolean).join(' & ') || (
                                    <span className='text-gray-400 italic'>Chưa có</span>
                                  )}
                                </td>
                                <td className='px-4 py-3'>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      w.deployment_status === 'published'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-500'
                                    }`}
                                  >
                                    {w.deployment_status === 'published' ? 'Công khai' : 'Bản nháp'}
                                  </span>
                                </td>
                                <td className='px-4 py-3 text-gray-500'>
                                  {new Date(w.created_at).toLocaleDateString('vi-VN')}
                                </td>
                                <td className='px-4 py-3'>
                                  <div className='flex items-center justify-center gap-2'>
                                    <button
                                      onClick={() => handleOpenEdit(w)}
                                      className='flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-medium transition-colors'
                                    >
                                      <Pencil size={13} /> Sửa
                                    </button>
                                    <button
                                      onClick={() => handleDeleteWedding(w.id)}
                                      disabled={deletingId === w.id}
                                      className='flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-xs font-medium transition-colors disabled:opacity-50'
                                    >
                                      <Trash2 size={13} /> {deletingId === w.id ? '...' : 'Xóa'}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Nhạc */}
                {adminSection === 'music' && (
                  <div>
                    <div className='flex items-center justify-between mb-4'>
                      <h4 className='font-bold text-gray-900 text-lg'>Danh sách nhạc</h4>
                      <button
                        onClick={() => setShowAddMusic(true)}
                        className='flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-xl text-sm font-semibold hover:bg-pink-600 transition-colors'
                      >
                        <Plus size={16} /> Thêm nhạc
                      </button>
                    </div>

                    {showAddMusic && (
                      <div className='bg-pink-50/60 border border-pink-100 rounded-2xl p-5 mb-4'>
                        <div className='flex items-center justify-between mb-3'>
                          <h5 className='font-semibold text-gray-800'>Thêm bài nhạc mới</h5>
                          <button onClick={() => setShowAddMusic(false)} className='text-gray-400 hover:text-gray-600'>
                            <X size={18} />
                          </button>
                        </div>
                        <div className='space-y-3'>
                          <input
                            value={newMusicTitle}
                            onChange={(e) => setNewMusicTitle(e.target.value)}
                            placeholder='Tên bài nhạc'
                            className='w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200'
                          />
                          <input
                            value={newMusicArtist}
                            onChange={(e) => setNewMusicArtist(e.target.value)}
                            placeholder='Ca sĩ (không bắt buộc)'
                            className='w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200'
                          />
                          <div>
                            <label className='block text-xs font-medium text-gray-500 mb-1.5'>File MP3</label>
                            <input
                              type='file'
                              accept='audio/mp3,audio/mpeg'
                              onChange={(e) => setNewMusicFile(e.target.files?.[0] || null)}
                              className='w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100'
                            />
                          </div>
                          <button
                            onClick={handleAddMusic}
                            disabled={uploadingMusic || !newMusicTitle.trim() || !newMusicFile}
                            className='px-5 py-2 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700 text-sm disabled:opacity-50'
                          >
                            {uploadingMusic ? 'Đang tải lên...' : 'Lưu'}
                          </button>
                        </div>
                      </div>
                    )}

                    {musicList.length === 0 ? (
                      <div className='text-center py-12 text-gray-400 text-sm'>Chưa có bài nhạc nào.</div>
                    ) : (
                      <div className='space-y-2'>
                        {musicList.map((m) => (
                          <div
                            key={m.id}
                            className='bg-white border border-gray-100 rounded-2xl px-5 py-3 hover:border-pink-200 transition-colors'
                          >
                            {editingMusicId === m.id ? (
                              <div className='space-y-2'>
                                <input
                                  value={editMusicTitle}
                                  onChange={(e) => setEditMusicTitle(e.target.value)}
                                  placeholder='Tên bài nhạc'
                                  className='w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200'
                                />
                                <input
                                  value={editMusicArtist}
                                  onChange={(e) => setEditMusicArtist(e.target.value)}
                                  placeholder='Ca sĩ (không bắt buộc)'
                                  className='w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200'
                                />
                                <div className='flex gap-2 pt-1'>
                                  <button
                                    onClick={handleUpdateMusic}
                                    disabled={savingEdit || !editMusicTitle.trim()}
                                    className='px-4 py-1.5 rounded-lg bg-pink-600 text-white text-xs font-semibold hover:bg-pink-700 disabled:opacity-50 transition-colors'
                                  >
                                    {savingEdit ? 'Đang lưu...' : 'Lưu'}
                                  </button>
                                  <button
                                    onClick={() => setEditingMusicId(null)}
                                    className='px-4 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition-colors'
                                  >
                                    Huỷ
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                  <Music size={18} className='text-pink-400 shrink-0' />
                                  <div>
                                    <p className='font-medium text-gray-800 text-sm'>{m.title}</p>
                                    {m.artist && <p className='text-xs text-gray-500'>{m.artist}</p>}
                                    <p className='text-xs text-gray-400 truncate max-w-xs'>{m.url}</p>
                                  </div>
                                </div>
                                <div className='flex items-center gap-2 ml-2 shrink-0'>
                                  <button
                                    onClick={() => {
                                      setEditingMusicId(m.id)
                                      setEditMusicTitle(m.title)
                                      setEditMusicArtist(m.artist || '')
                                    }}
                                    className='text-gray-300 hover:text-blue-400 transition-colors'
                                    title='Sửa'
                                  >
                                    <Pencil size={15} />
                                  </button>
                                  <button
                                    onClick={() => handleRemoveMusic(m.id, m.url)}
                                    className='text-gray-300 hover:text-red-400 transition-colors'
                                    title='Xóa'
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Chế độ thường: tabs của người dùng hiện tại */
              <>
                <div className={activeTab === 'info' ? 'block' : 'hidden'}>
                  <TabInfo content={wedding?.content} onChange={handleInfoChange} />
                </div>
                <div className={activeTab === 'album' ? 'block' : 'hidden'}>
                  <TabAlbum
                    images={wedding?.content?.images || []}
                    onChange={handleImagesChange}
                    coverImage={wedding?.content?.cover_image || undefined}
                    onCoverImageChange={handleCoverImageChange}
                    groomImage={wedding?.content?.groom_image || undefined}
                    onGroomImageChange={(ci) => {
                      if (!wedding) return
                      setWedding({ ...wedding, content: { ...wedding.content, groom_image: ci || undefined } })
                      setIsDirty(true)
                    }}
                    brideImage={wedding?.content?.bride_image || undefined}
                    onBrideImageChange={(ci) => {
                      if (!wedding) return
                      setWedding({ ...wedding, content: { ...wedding.content, bride_image: ci || undefined } })
                      setIsDirty(true)
                    }}
                    groomName={wedding?.content?.groom_name || ''}
                    brideName={wedding?.content?.bride_name || ''}
                    imagePositions={wedding?.content?.image_positions || []}
                    onImagePositionsChange={handleImagePositionsChange}
                    coverImagePosition={wedding?.content?.cover_image_position || undefined}
                    onCoverImagePositionChange={handleCoverImagePositionChange}
                    groomImagePosition={wedding?.content?.groom_image_position || undefined}
                    onGroomImagePositionChange={(gp) => {
                      if (!wedding) return
                      setWedding({ ...wedding, content: { ...wedding.content, groom_image_position: gp } })
                      setIsDirty(true)
                    }}
                    brideImagePosition={wedding?.content?.bride_image_position || undefined}
                    onBrideImagePositionChange={(bp) => {
                      if (!wedding) return
                      setWedding({ ...wedding, content: { ...wedding.content, bride_image_position: bp } })
                      setIsDirty(true)
                    }}
                    onImageDeleted={handleImageDeleted}
                  />
                </div>
                <div className={activeTab === 'bank' ? 'block' : 'hidden'}>
                  <TabQR qrImage={wedding?.content?.qr_image ?? null} onQrImageChange={handleQrImageChange} />
                </div>
                <div className={activeTab === 'style' ? 'block' : 'hidden'}>
                  <TabStyle
                    content={wedding?.content}
                    onChange={handleInfoChange}
                    onBatchChange={handleBatchChange}
                    onReset={handleStyleReset}
                  />
                </div>
                <div className={activeTab === 'music' ? 'block' : 'hidden'}>
                  <div>
                    <h3 className='font-bold text-gray-900 text-lg mb-1'>Chọn nhạc nền</h3>
                    <p className='text-sm text-gray-400 mb-5'>Nhạc sẽ tự động phát khi khách mở thiệp của bạn.</p>
                    {loadingMusics ? (
                      <div className='text-center py-12 text-gray-400 text-sm'>Đang tải...</div>
                    ) : (
                      <div className='space-y-2'>
                        {/* Không chọn */}
                        <button
                          type='button'
                          onClick={() => {
                            if (previewAudioRef.current) {
                              previewAudioRef.current.pause()
                              previewAudioRef.current = null
                            }
                            setPlayingMusicId(null)
                            if (!wedding) return
                            setWedding((prev) =>
                              prev ? { ...prev, music_id: null, content: { ...prev.content, music_url: '' } } : prev
                            )
                            // Only mark dirty if different from original
                            if (originalMusicId !== null) {
                              setIsDirty(true)
                            }
                          }}
                          className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl border transition-all text-left ${
                            !wedding?.music_id
                              ? 'border-pink-400 bg-pink-50 shadow-sm shadow-pink-100'
                              : 'border-gray-100 bg-white hover:border-pink-200'
                          }`}
                        >
                          <div className='flex items-center gap-3'>
                            <div
                              className={`flex items-center justify-center w-9 h-9 rounded-full ${!wedding?.music_id ? 'bg-pink-500' : 'bg-gray-100'}`}
                            >
                              <Music size={16} className={!wedding?.music_id ? 'text-white' : 'text-gray-400'} />
                            </div>
                            <p
                              className={`font-medium text-sm ${!wedding?.music_id ? 'text-pink-700' : 'text-gray-800'}`}
                            >
                              Không chọn
                            </p>
                          </div>
                          {!wedding?.music_id && (
                            <span className='text-xs font-semibold text-pink-500 bg-pink-100 px-2.5 py-1 rounded-full'>
                              Đang chọn
                            </span>
                          )}
                        </button>
                        {allMusics.length === 0 ? (
                          <div className='text-center py-8 text-gray-400 text-sm'>Chưa có bài nhạc nào.</div>
                        ) : (
                          allMusics.map((m) => {
                            const isSelected = wedding?.music_id === m.id
                            const isPlaying = playingMusicId === m.id
                            return (
                              <button
                                key={m.id}
                                type='button'
                                onClick={() => {
                                  if (!isSelected) {
                                    // Lần 1: chọn bài mới và phát
                                    if (previewAudioRef.current) {
                                      previewAudioRef.current.pause()
                                      previewAudioRef.current = null
                                    }
                                    const audio = new Audio(m.url)
                                    audio.loop = true
                                    audio.play().catch(() => {})
                                    previewAudioRef.current = audio
                                    setPlayingMusicId(m.id)
                                    if (!wedding) return
                                    setWedding((prev) =>
                                      prev
                                        ? { ...prev, music_id: m.id, content: { ...prev.content, music_url: m.url } }
                                        : prev
                                    )
                                    // Only mark dirty if different from original
                                    if (m.id !== originalMusicId) {
                                      setIsDirty(true)
                                    }
                                  } else if (isPlaying) {
                                    // Lần 2: đang phát → pause, giữ nguyên chọn
                                    if (previewAudioRef.current) {
                                      previewAudioRef.current.pause()
                                    }
                                    setPlayingMusicId(null)
                                  } else {
                                    // Lần 3: đang pause → tiếp tục phát
                                    if (previewAudioRef.current) {
                                      previewAudioRef.current.play().catch(() => {})
                                      setPlayingMusicId(m.id)
                                    }
                                  }
                                }}
                                className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl border transition-all text-left ${
                                  isSelected
                                    ? 'border-pink-400 bg-pink-50 shadow-sm shadow-pink-100'
                                    : 'border-gray-100 bg-white hover:border-pink-200'
                                }`}
                              >
                                <div className='flex items-center gap-3'>
                                  <div
                                    className={`flex items-center justify-center w-9 h-9 rounded-full ${isSelected ? 'bg-pink-500' : 'bg-gray-100'}`}
                                  >
                                    <Music
                                      size={16}
                                      className={`${isSelected ? 'text-white' : 'text-gray-400'} ${isPlaying ? 'animate-spin' : ''}`}
                                      style={isPlaying ? { animationDuration: '3s' } : {}}
                                    />
                                  </div>
                                  <div>
                                    <p
                                      className={`font-medium text-sm ${isSelected ? 'text-pink-700' : 'text-gray-800'}`}
                                    >
                                      {m.title}
                                    </p>
                                    {m.artist && <p className='text-xs text-gray-400'>{m.artist}</p>}
                                  </div>
                                </div>
                                {isSelected && (
                                  <span className='text-xs font-semibold text-pink-500 bg-pink-100 px-2.5 py-1 rounded-full'>
                                    {isPlaying ? 'Đang phát' : 'Đang chọn'}
                                  </span>
                                )}
                              </button>
                            )
                          })
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {(!isAdminMode || adminSelectedWedding) && (
          <LivePreview
            wedding={isAdminMode && adminSelectedWedding ? (adminSelectedWedding as any) : wedding}
            isDirty={isAdminMode ? false : isDirty}
            onUnsavedWarning={() => error('Vui lòng lưu thay đổi trước khi xem thiệp.')}
            onOpen={() => {
              if (previewAudioRef.current) {
                previewAudioRef.current.pause()
              }
              setPlayingMusicId(null)
            }}
          />
        )}
      </div>
    </StudioLayout>
  )
}

export default Editor
