import React, { useState, useEffect, useRef } from 'react'

interface TabAlbumProps {
  images: string[]
  onChange: (images: string[]) => void
}

const TabAlbum: React.FC<TabAlbumProps> = ({ images, onChange }) => {
  const [albumImages, setAlbumImages] = useState<string[]>(images || [])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    console.log('Upload button clicked')
    console.log('File input ref:', fileInputRef.current)
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File change event triggered')
    const files = event.target.files
    console.log('Files selected:', files?.length)
    if (!files || files.length === 0) return

    // Validate image files only
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    const invalidFiles: string[] = []
    const validFiles: File[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (validImageTypes.includes(file.type)) {
        validFiles.push(file)
      } else {
        invalidFiles.push(file.name)
      }
    }

    if (invalidFiles.length > 0) {
      alert(`Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP, SVG).\n\nFile không hợp lệ:\n${invalidFiles.join('\n')}`)
      if (validFiles.length === 0) {
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }
    }

    setIsUploading(true)

    try {
      const newImageUrls: string[] = []

      for (const file of validFiles) {
        // Convert file to base64 URL for preview
        const reader = new FileReader()
        const imageUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = (e) => {
            resolve(e.target?.result as string)
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        newImageUrls.push(imageUrl)
      }

      const updatedImages = [...albumImages, ...newImageUrls]
      setAlbumImages(updatedImages)
      onChange(updatedImages)
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Có lỗi xảy ra khi tải ảnh lên')
    } finally {
      setIsUploading(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeImage = (indexToRemove: number) => {
    const newImages = albumImages.filter((_, index) => index !== indexToRemove)
    setAlbumImages(newImages)
    onChange(newImages)
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm space-y-6'>
      <h3 className='text-lg font-medium text-gray-900 border-b pb-2'>Album Ảnh Cưới</h3>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {albumImages.map((img, index) => (
          <div key={index} className='relative group aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={`Album ${index}`} className='object-cover w-full h-full' />
            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center'>
              <button
                onClick={() => removeImage(index)}
                className='opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full transform scale-90 group-hover:scale-100 transition-all'
                title='Xóa ảnh'
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        <div
          onClick={handleUploadClick}
          className='aspect-w-4 aspect-h-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors'
        >
          <div className='text-center p-4'>
            {isUploading ? (
              <span className='text-pink-600'>Đang tải...</span>
            ) : (
              <>
                <div className='text-3xl mb-2'>📷</div>
                <span className='text-sm text-gray-500 font-medium'>Thêm Ảnh</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type='file' accept='image/*' multiple onChange={handleFileChange} className='hidden' />
    </div>
  )
}

export default TabAlbum
