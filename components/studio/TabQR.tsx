import React, { useRef } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'

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

interface TabQRProps {
  qrImage?: string | null
  onQrImageChange: (qrImage: string | null) => void
}

const TabQR: React.FC<TabQRProps> = ({ qrImage, onQrImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const readFileAsDataURL = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  // Only compress if file > 8MB — keeps quality for typical images untouched
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      alert('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP, SVG, HEIC, AVIF).')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    const dataUrl = await readFileAsDataURL(await compressIfNeeded(file))
    onQrImageChange(dataUrl)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemove = () => {
    if (qrImage && (qrImage.startsWith('https://') || qrImage.startsWith('http://'))) {
      fetch('/api/delete-image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: qrImage })
      }).catch((err) => console.error('Error deleting QR image from Cloudinary:', err))
    }
    onQrImageChange(null)
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm space-y-6'>
      <h3 className='text-lg font-medium text-gray-900 border-b pb-2'>Ảnh QR Tiền Mừng</h3>
      <p className='text-sm text-gray-500'>
        Upload ảnh mã QR chuyển khoản của bạn. Ảnh sẽ được hiển thị trong thiệp để khách mời quét và chuyển tiền mừng.
      </p>

      <div className='flex flex-col items-start gap-3'>
        {qrImage ? (
          <div className='relative group w-48 aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-md'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrImage} alt='QR Tiền mừng' className='object-contain w-full h-full p-2' />
            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center'>
              <button
                onClick={handleRemove}
                className='opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full transform scale-90 group-hover:scale-100 transition-all'
                title='Xóa ảnh QR'
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className='w-48 aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors'
          >
            <div className='text-center p-4'>
              <div className='flex justify-center mb-2'>
                <ImagePlus size={32} className='text-gray-400' />
              </div>
              <span className='text-sm text-gray-500 font-medium'>Thêm Ảnh QR</span>
              <p className='text-xs text-gray-400 mt-1'>Tối đa 1 ảnh</p>
            </div>
          </div>
        )}

        {qrImage && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className='text-xs text-pink-600 hover:underline font-medium'
          >
            Đổi ảnh QR
          </button>
        )}
      </div>

      <input ref={fileInputRef} type='file' accept='image/*' onChange={handleFileChange} className='hidden' />
    </div>
  )
}

export default TabQR
