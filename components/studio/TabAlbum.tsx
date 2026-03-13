import React, { useState, useEffect, useRef } from 'react'
import { ImagePlus, Pencil, Trash2, X } from 'lucide-react'
import { ImageAdjust, ImagePosition, DEFAULT_ADJUST } from '../../lib/imageUtils'

const MAX_ALBUM_IMAGES = 20
const VALID_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/heic',
  'image/heif',
  'image/avif'
]

interface TabAlbumProps {
  images: string[]
  onChange: (images: string[]) => void
  coverImage?: string
  onCoverImageChange: (coverImage: string | null) => void
  groomImage?: string
  onGroomImageChange: (image: string | null) => void
  brideImage?: string
  onBrideImageChange: (image: string | null) => void
  groomName?: string
  brideName?: string
  imagePositions?: (ImagePosition | null)[]
  onImagePositionsChange?: (positions: (ImagePosition | null)[]) => void
  coverImagePosition?: ImagePosition
  onCoverImagePositionChange?: (position: ImagePosition) => void
  onImageDeleted?: (url: string) => void
}

// ── Image position editor modal ───────────────────────────────────────────────

interface EditorModalProps {
  imageUrl: string
  initialPositions: ImagePosition
  onSave: (pos: ImagePosition) => void
  onClose: () => void
  onReplace?: () => void
}

const ImagePositionEditorModal: React.FC<EditorModalProps> = ({
  imageUrl,
  initialPositions,
  onSave,
  onClose,
  onReplace
}) => {
  const [activeTab, setActiveTab] = useState<'phone' | 'laptop'>('phone')
  const [phoneAdj, setPhoneAdj] = useState<ImageAdjust>(
    initialPositions.phone ?? initialPositions.laptop ?? { ...DEFAULT_ADJUST }
  )
  const [laptopAdj, setLaptopAdj] = useState<ImageAdjust>(
    initialPositions.laptop ?? initialPositions.phone ?? { ...DEFAULT_ADJUST }
  )
  const previewRef = useRef<HTMLDivElement>(null)

  const adj = activeTab === 'phone' ? phoneAdj : laptopAdj
  const setAdj = activeTab === 'phone' ? setPhoneAdj : setLaptopAdj

  const applyPointer = (clientX: number, clientY: number) => {
    const el = previewRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)))
    const y = Math.max(0, Math.min(100, Math.round(((clientY - rect.top) / rect.height) * 100)))
    setAdj((prev) => ({ ...prev, x, y }))
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    applyPointer(e.clientX, e.clientY)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return
    applyPointer(e.clientX, e.clientY)
  }

  const imgStyle: React.CSSProperties = {
    objectFit: 'cover',
    objectPosition: `${adj.x}% ${adj.y}%`,
    ...(adj.zoom !== 1 ? { transform: `scale(${adj.zoom})`, transformOrigin: `${adj.x}% ${adj.y}%` } : {})
  }

  const isLaptop = activeTab === 'laptop'

  return (
    <div className='fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col max-h-[90dvh]'>
        <div className='overflow-y-auto p-5 space-y-4'>
          {/* Header */}
          <div className='flex items-center justify-between'>
            <h3 className='font-bold text-gray-900 text-base'>Chỉnh vị trí &amp; zoom</h3>
            <button onClick={onClose} className='p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors'>
              <X size={18} />
            </button>
          </div>

          {/* Device tabs */}
          <div className='flex rounded-xl bg-gray-100 p-1 gap-1'>
            <button
              onClick={() => setActiveTab('phone')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'phone' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg
                width='14'
                height='14'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <rect x='5' y='2' width='14' height='20' rx='2' />
                <circle cx='12' cy='18' r='1' fill='currentColor' stroke='none' />
              </svg>
              Điện thoại
            </button>
            <button
              onClick={() => setActiveTab('laptop')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'laptop' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg
                width='14'
                height='14'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <rect x='2' y='4' width='20' height='14' rx='2' />
                <path d='M0 21h24' />
              </svg>
              Laptop
            </button>
          </div>

          {/* Preview + focal point drag */}
          <div>
            <p className='text-xs text-gray-400 mb-2'>Nhấp hoặc kéo để đặt điểm căn giữa</p>
            <div className='flex justify-center' style={{ height: isLaptop ? 'auto' : 220 }}>
              <div
                ref={previewRef}
                className='relative overflow-hidden rounded-xl cursor-crosshair select-none'
                style={
                  isLaptop
                    ? { aspectRatio: '320/210', width: '100%' }
                    : { aspectRatio: '260/560', height: 220, maxWidth: '100%' }
                }
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt='preview'
                  className='absolute inset-0 w-full h-full pointer-events-none'
                  style={imgStyle}
                  draggable={false}
                />
                {/* Crosshair dot */}
                <div
                  className='absolute pointer-events-none'
                  style={{
                    left: `${adj.x}%`,
                    top: `${adj.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className='w-5 h-5 rounded-full border-2 border-white shadow-md ring-1 ring-black/30' />
                </div>
              </div>
            </div>
          </div>

          {/* Zoom slider */}
          <div>
            <div className='flex items-center justify-between mb-1.5'>
              <span className='text-sm font-medium text-gray-700'>Zoom</span>
              <span className='text-sm text-pink-600 font-semibold'>{adj.zoom.toFixed(2)}x</span>
            </div>
            <input
              type='range'
              min='1'
              max='3'
              step='0.05'
              value={adj.zoom}
              onChange={(e) => setAdj((prev) => ({ ...prev, zoom: parseFloat(e.target.value) }))}
              className='w-full accent-pink-500'
            />
            <div className='flex justify-between text-xs text-gray-400 mt-0.5'>
              <span>1x</span>
              <span>3x</span>
            </div>
          </div>

          {/* Replace image */}
          {onReplace && (
            <button
              onClick={onReplace}
              className='w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors'
            >
              <ImagePlus size={15} />
              Thay thế ảnh
            </button>
          )}

          {/* Actions */}
          <div className='flex gap-3 pt-1'>
            <button
              onClick={() => setAdj({ ...DEFAULT_ADJUST })}
              className='flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors'
            >
              Đặt lại
            </button>
            <button
              onClick={() => onSave({ phone: phoneAdj, laptop: laptopAdj })}
              className='flex-1 py-2.5 rounded-xl bg-pink-600 text-white text-sm font-bold hover:bg-pink-700 transition-colors'
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── TabAlbum main component ───────────────────────────────────────────────────

const TabAlbum: React.FC<TabAlbumProps> = ({
  images,
  onChange,
  coverImage,
  onCoverImageChange,
  groomImage,
  onGroomImageChange,
  brideImage,
  onBrideImageChange,
  groomName,
  brideName,
  imagePositions,
  onImagePositionsChange,
  coverImagePosition,
  onCoverImagePositionChange,
  onImageDeleted
}) => {
  const [albumImages, setAlbumImages] = useState<string[]>(images || [])
  const [currentCoverImage, setCurrentCoverImage] = useState<string | null>(coverImage || null)
  const [currentGroomImage, setCurrentGroomImage] = useState<string | null>(groomImage || null)
  const [currentBrideImage, setCurrentBrideImage] = useState<string | null>(brideImage || null)
  const [editingTarget, setEditingTarget] = useState<'cover' | 'groom' | 'bride' | number | null>(null)
  const [replacingAlbumIndex, setReplacingAlbumIndex] = useState<number | null>(null)
  const albumFileInputRef = useRef<HTMLInputElement>(null)
  const coverFileInputRef = useRef<HTMLInputElement>(null)
  const groomFileInputRef = useRef<HTMLInputElement>(null)
  const brideFileInputRef = useRef<HTMLInputElement>(null)
  const replaceAlbumFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setAlbumImages(images || [])
  }, [images])
  useEffect(() => {
    setCurrentCoverImage(coverImage || null)
  }, [coverImage])
  useEffect(() => {
    setCurrentGroomImage(groomImage || null)
  }, [groomImage])
  useEffect(() => {
    setCurrentBrideImage(brideImage || null)
  }, [brideImage])

  const readFileAsDataURL = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  // Only compress if file > 8MB — keeps quality for typical phone photos (3-6MB) untouched
  const compressIfNeeded = (file: File): Promise<File> =>
    new Promise((resolve) => {
      const SKIP_TYPES = ['image/svg+xml', 'image/gif', 'image/heic', 'image/heif']
      if (SKIP_TYPES.includes(file.type) || file.size <= 8 * 1024 * 1024) {
        resolve(file)
        return
      }
      const img = new window.Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(url)
        const MAX_DIM = 4096
        let { width, height } = img
        if (width > MAX_DIM || height > MAX_DIM) {
          const ratio = Math.min(MAX_DIM / width, MAX_DIM / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(file)
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) =>
            resolve(blob ? new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }) : file),
          'image/jpeg',
          0.93
        )
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(file)
      }
      img.src = url
    })

  const handleCoverFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      alert('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP, SVG, HEIC, AVIF).')
      if (coverFileInputRef.current) coverFileInputRef.current.value = ''
      return
    }
    const dataUrl = await readFileAsDataURL(await compressIfNeeded(file))
    setCurrentCoverImage(dataUrl)
    onCoverImageChange(dataUrl)
    if (coverFileInputRef.current) coverFileInputRef.current.value = ''
  }

  const handleGroomFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      alert('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP, SVG, HEIC, AVIF).')
      if (groomFileInputRef.current) groomFileInputRef.current.value = ''
      return
    }
    const dataUrl = await readFileAsDataURL(await compressIfNeeded(file))
    setCurrentGroomImage(dataUrl)
    onGroomImageChange(dataUrl)
    if (groomFileInputRef.current) groomFileInputRef.current.value = ''
  }

  const handleBrideFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      alert('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP, SVG, HEIC, AVIF).')
      if (brideFileInputRef.current) brideFileInputRef.current.value = ''
      return
    }
    const dataUrl = await readFileAsDataURL(await compressIfNeeded(file))
    setCurrentBrideImage(dataUrl)
    onBrideImageChange(dataUrl)
    if (brideFileInputRef.current) brideFileInputRef.current.value = ''
  }

  const handleRemoveCover = () => {
    if (currentCoverImage && (currentCoverImage.startsWith('https://') || currentCoverImage.startsWith('http://'))) {
      fetch('/api/delete-image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: currentCoverImage })
      }).catch((err) => console.error('Error deleting cover image from Cloudinary:', err))
      onImageDeleted?.(currentCoverImage)
    }
    setCurrentCoverImage(null)
    onCoverImageChange(null)
  }

  const handleRemoveGroom = () => {
    if (currentGroomImage && (currentGroomImage.startsWith('https://') || currentGroomImage.startsWith('http://'))) {
      fetch('/api/delete-image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: currentGroomImage })
      }).catch((err) => console.error('Error deleting groom image from Cloudinary:', err))
      onImageDeleted?.(currentGroomImage)
    }
    setCurrentGroomImage(null)
    onGroomImageChange(null)
  }

  const handleRemoveBride = () => {
    if (currentBrideImage && (currentBrideImage.startsWith('https://') || currentBrideImage.startsWith('http://'))) {
      fetch('/api/delete-image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: currentBrideImage })
      }).catch((err) => console.error('Error deleting bride image from Cloudinary:', err))
      onImageDeleted?.(currentBrideImage)
    }
    setCurrentBrideImage(null)
    onBrideImageChange(null)
  }

  const handleReplaceAlbumFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || replacingAlbumIndex === null) return
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      alert('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP, SVG, HEIC, AVIF).')
      if (replaceAlbumFileInputRef.current) replaceAlbumFileInputRef.current.value = ''
      return
    }
    const dataUrl = await readFileAsDataURL(await compressIfNeeded(file))
    const newImages = [...albumImages]
    newImages[replacingAlbumIndex] = dataUrl
    setAlbumImages(newImages)
    onChange(newImages)
    setReplacingAlbumIndex(null)
    if (replaceAlbumFileInputRef.current) replaceAlbumFileInputRef.current.value = ''
  }

  const handleAlbumFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return
    const remaining = MAX_ALBUM_IMAGES - albumImages.length
    if (remaining <= 0) {
      alert(`Album đã đạt tối đa ${MAX_ALBUM_IMAGES} ảnh.`)
      if (albumFileInputRef.current) albumFileInputRef.current.value = ''
      return
    }
    const invalidFiles: string[] = []
    const validFiles: File[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (VALID_IMAGE_TYPES.includes(file.type)) validFiles.push(file)
      else invalidFiles.push(file.name)
    }
    if (invalidFiles.length > 0) {
      alert(
        `Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP, SVG, HEIC, AVIF).\n\nFile không hợp lệ:\n${invalidFiles.join('\n')}`
      )
      if (validFiles.length === 0) {
        if (albumFileInputRef.current) albumFileInputRef.current.value = ''
        return
      }
    }
    const filesToUpload = validFiles.slice(0, remaining)
    if (validFiles.length > remaining) {
      alert(
        `Chỉ có thể thêm ${remaining} ảnh nữa (tối đa ${MAX_ALBUM_IMAGES} ảnh). ${validFiles.length - remaining} ảnh bị bỏ qua.`
      )
    }
    const newImageUrls: string[] = []
    for (const file of filesToUpload) {
      newImageUrls.push(await readFileAsDataURL(await compressIfNeeded(file)))
    }
    const updatedImages = [...albumImages, ...newImageUrls]
    setAlbumImages(updatedImages)
    onChange(updatedImages)
    if (albumFileInputRef.current) albumFileInputRef.current.value = ''
  }

  const removeImage = (indexToRemove: number) => {
    const imageToRemove = albumImages[indexToRemove]
    if (imageToRemove && (imageToRemove.startsWith('https://') || imageToRemove.startsWith('http://'))) {
      fetch('/api/delete-image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: imageToRemove })
      }).catch((err) => console.error('Error deleting image from Cloudinary:', err))
      onImageDeleted?.(imageToRemove)
    }
    const newImages = albumImages.filter((_, index) => index !== indexToRemove)
    setAlbumImages(newImages)
    onChange(newImages)
    // Also remove corresponding position entry
    if (onImagePositionsChange && imagePositions) {
      const newPositions = imagePositions.filter((_, index) => index !== indexToRemove)
      onImagePositionsChange(newPositions)
    }
  }

  const handleSavePosition = (pos: ImagePosition) => {
    if (editingTarget === 'cover') {
      onCoverImagePositionChange?.(pos)
    } else if (typeof editingTarget === 'number') {
      const current = imagePositions ? [...imagePositions] : albumImages.map(() => null)
      // Pad if needed
      while (current.length <= editingTarget) current.push(null)
      current[editingTarget] = pos
      onImagePositionsChange?.(current)
    }
    setEditingTarget(null)
  }

  const getPositionForTarget = (target: 'cover' | 'groom' | 'bride' | number): ImagePosition => {
    if (target === 'cover') return coverImagePosition || {}
    if (target === 'groom' || target === 'bride') return {}
    return imagePositions?.[target as number] || {}
  }

  const getEditingImageUrl = (): string => {
    if (editingTarget === 'cover') return currentCoverImage || ''
    if (editingTarget === 'groom') return currentGroomImage || ''
    if (editingTarget === 'bride') return currentBrideImage || ''
    if (typeof editingTarget === 'number') return albumImages[editingTarget] || ''
    return ''
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm space-y-8'>
      {/* Single Images Section */}
      <div>
        <h3 className='text-lg font-medium text-gray-900 border-b pb-2 mb-4'>Ảnh Đại Diện</h3>
        <div className='flex flex-wrap items-start gap-8'>
          {/* Cover Image */}
          <div className='flex flex-col items-center gap-3'>
            {currentCoverImage ? (
              <div className='relative group w-40 aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden shadow-md'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentCoverImage} alt='Ảnh bìa' className='object-cover w-full h-full' />
                <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2'>
                  <button
                    onClick={() => setEditingTarget('cover')}
                    className='opacity-0 group-hover:opacity-100 bg-white text-gray-800 p-2 rounded-full transform scale-90 group-hover:scale-100 transition-all'
                    title='Chỉnh vị trí ảnh'
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={handleRemoveCover}
                    className='opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full transform scale-90 group-hover:scale-100 transition-all'
                    title='Xóa ảnh bìa'
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => coverFileInputRef.current?.click()}
                className='w-40 aspect-[3/4] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors'
              >
                <div className='text-center p-3'>
                  <div className='flex justify-center mb-2'>
                    <ImagePlus size={28} className='text-gray-400' />
                  </div>
                  <span className='text-sm text-gray-500 font-medium'>Ảnh Bìa</span>
                </div>
              </div>
            )}
            {currentCoverImage && (
              <button
                onClick={() => coverFileInputRef.current?.click()}
                className='text-xs text-pink-600 hover:underline font-medium'
              >
                Đổi ảnh bìa
              </button>
            )}
            {groomName || brideName ? (
              <p className='text-sm font-medium text-gray-700 text-center w-40 truncate'>
                {[groomName, brideName].filter(Boolean).join(' & ')}
              </p>
            ) : (
              <p className='text-sm font-medium text-gray-400 text-center w-40'>Ảnh Bìa</p>
            )}
          </div>

          {/* Groom Image */}
          <div className='flex flex-col items-center gap-3'>
            {currentGroomImage ? (
              <div className='relative group w-40 aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden shadow-md'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentGroomImage} alt='Chú rể' className='object-cover w-full h-full' />
                <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2'>
                  <button
                    onClick={handleRemoveGroom}
                    className='opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full transform scale-90 group-hover:scale-100 transition-all'
                    title='Xóa ảnh chú rể'
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => groomFileInputRef.current?.click()}
                className='w-40 aspect-[3/4] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors'
              >
                <div className='text-center p-3'>
                  <div className='flex justify-center mb-2'>
                    <ImagePlus size={28} className='text-gray-400' />
                  </div>
                  <span className='text-sm text-gray-500 font-medium'>Ảnh Chú Rể</span>
                </div>
              </div>
            )}
            {currentGroomImage && (
              <button
                onClick={() => groomFileInputRef.current?.click()}
                className='text-xs text-pink-600 hover:underline font-medium'
              >
                Đổi ảnh
              </button>
            )}
            <p className='text-sm font-medium text-gray-700 text-center w-40 truncate'>{groomName || 'Chú rể'}</p>
          </div>

          {/* Bride Image */}
          <div className='flex flex-col items-center gap-3'>
            {currentBrideImage ? (
              <div className='relative group w-40 aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden shadow-md'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentBrideImage} alt='Cô dâu' className='object-cover w-full h-full' />
                <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2'>
                  <button
                    onClick={handleRemoveBride}
                    className='opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full transform scale-90 group-hover:scale-100 transition-all'
                    title='Xóa ảnh cô dâu'
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => brideFileInputRef.current?.click()}
                className='w-40 aspect-[3/4] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors'
              >
                <div className='text-center p-3'>
                  <div className='flex justify-center mb-2'>
                    <ImagePlus size={28} className='text-gray-400' />
                  </div>
                  <span className='text-sm text-gray-500 font-medium'>Ảnh Cô Dâu</span>
                </div>
              </div>
            )}
            {currentBrideImage && (
              <button
                onClick={() => brideFileInputRef.current?.click()}
                className='text-xs text-pink-600 hover:underline font-medium'
              >
                Đổi ảnh
              </button>
            )}
            <p className='text-sm font-medium text-gray-700 text-center w-40 truncate'>{brideName || 'Cô dâu'}</p>
          </div>
        </div>
      </div>

      {/* Album Section */}
      <div>
        <div className='flex items-center justify-between border-b pb-2 mb-4'>
          <h3 className='text-lg font-medium text-gray-900'>Album Ảnh Cưới</h3>
          <span className='text-sm text-gray-400'>
            {albumImages.length}/{MAX_ALBUM_IMAGES} ảnh
          </span>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {albumImages.map((img, index) => (
            <div key={index} className='relative group aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`Album ${index}`} className='object-cover w-full h-full' />
              <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2'>
                <button
                  onClick={() => setEditingTarget(index)}
                  className='opacity-0 group-hover:opacity-100 bg-white text-gray-800 p-2 rounded-full transform scale-90 group-hover:scale-100 transition-all'
                  title='Chỉnh vị trí ảnh'
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => removeImage(index)}
                  className='opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full transform scale-90 group-hover:scale-100 transition-all'
                  title='Xóa ảnh'
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {albumImages.length < MAX_ALBUM_IMAGES && (
            <div
              onClick={() => albumFileInputRef.current?.click()}
              className='aspect-w-4 aspect-h-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors'
            >
              <div className='text-center p-4'>
                <div className='flex justify-center mb-2'>
                  <ImagePlus size={32} className='text-gray-400' />
                </div>
                <span className='text-sm text-gray-500 font-medium'>Thêm Ảnh</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <input ref={coverFileInputRef} type='file' accept='image/*' onChange={handleCoverFileChange} className='hidden' />
      <input ref={groomFileInputRef} type='file' accept='image/*' onChange={handleGroomFileChange} className='hidden' />
      <input ref={brideFileInputRef} type='file' accept='image/*' onChange={handleBrideFileChange} className='hidden' />
      <input
        ref={albumFileInputRef}
        type='file'
        accept='image/*'
        multiple
        onChange={handleAlbumFileChange}
        className='hidden'
      />
      <input
        ref={replaceAlbumFileInputRef}
        type='file'
        accept='image/*'
        onChange={handleReplaceAlbumFileChange}
        className='hidden'
      />

      {/* Image position editor modal */}
      {editingTarget !== null && getEditingImageUrl() && (
        <ImagePositionEditorModal
          imageUrl={getEditingImageUrl()}
          initialPositions={getPositionForTarget(editingTarget)}
          onSave={handleSavePosition}
          onClose={() => setEditingTarget(null)}
          onReplace={
            editingTarget === 'cover'
              ? () => {
                  setEditingTarget(null)
                  if (editingTarget === 'cover') coverFileInputRef.current?.click()
                }
              : () => {
                  setReplacingAlbumIndex(editingTarget as number)
                  setEditingTarget(null)
                  replaceAlbumFileInputRef.current?.click()
                }
          }
        />
      )}
    </div>
  )
}

export default TabAlbum
