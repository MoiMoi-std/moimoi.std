import React, { useState, useEffect, useRef } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'

const MAX_ALBUM_IMAGES = 20
const VALID_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']

interface TabAlbumProps {
  images: string[]
  onChange: (images: string[]) => void
  coverImage?: string
  onCoverImageChange: (coverImage: string | null) => void
}

const TabAlbum: React.FC<TabAlbumProps> = ({ images, onChange, coverImage, onCoverImageChange }) => {
  const [albumImages, setAlbumImages] = useState<string[]>(images || [])
  const [currentCoverImage, setCurrentCoverImage] = useState<string | null>(coverImage || null)
  const albumFileInputRef = useRef<HTMLInputElement>(null)
  const coverFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setAlbumImages(images || [])
  }, [images])

  useEffect(() => {
    setCurrentCoverImage(coverImage || null)
  }, [coverImage])

  const readFileAsDataURL = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleCoverFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      alert('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP, SVG).')
      if (coverFileInputRef.current) coverFileInputRef.current.value = ''
      return
    }
    const dataUrl = await readFileAsDataURL(file)
    setCurrentCoverImage(dataUrl)
    onCoverImageChange(dataUrl)
    if (coverFileInputRef.current) coverFileInputRef.current.value = ''
  }

  const handleRemoveCover = () => {
    setCurrentCoverImage(null)
    onCoverImageChange(null)
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
      if (VALID_IMAGE_TYPES.includes(file.type)) {
        validFiles.push(file)
      } else {
        invalidFiles.push(file.name)
      }
    }

    if (invalidFiles.length > 0) {
      alert(`Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP, SVG).\n\nFile không hợp lệ:\n${invalidFiles.join('\n')}`)
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
      newImageUrls.push(await readFileAsDataURL(file))
    }

    const updatedImages = [...albumImages, ...newImageUrls]
    setAlbumImages(updatedImages)
    onChange(updatedImages)

    if (albumFileInputRef.current) albumFileInputRef.current.value = ''
  }

  const removeImage = (indexToRemove: number) => {
    const newImages = albumImages.filter((_, index) => index !== indexToRemove)
    setAlbumImages(newImages)
    onChange(newImages)
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm space-y-8'>
      {/* Cover Image Section */}
      <div>
        <h3 className='text-lg font-medium text-gray-900 border-b pb-2 mb-4'>Ảnh Bìa</h3>
        {currentCoverImage ? (
          <div className='relative group w-full max-w-sm h-48 bg-gray-100 rounded-lg overflow-hidden'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentCoverImage} alt='Ảnh bìa' className='object-cover w-full h-full' />
            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center'>
              <button
                onClick={handleRemoveCover}
                className='opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full transform scale-90 group-hover:scale-100 transition-all'
                title='Xóa ảnh bìa'
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => coverFileInputRef.current?.click()}
            className='w-full max-w-sm h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors'
          >
            <div className='text-center p-4'>
              <div className='flex justify-center mb-2'>
                <ImagePlus size={32} className='text-gray-400' />
              </div>
              <span className='text-sm text-gray-500 font-medium'>Thêm Ảnh Bìa</span>
              <p className='text-xs text-gray-400 mt-1'>Tối đa 1 ảnh</p>
            </div>
          </div>
        )}
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
              <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center'>
                <button
                  onClick={() => removeImage(index)}
                  className='opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full transform scale-90 group-hover:scale-100 transition-all'
                  title='Xóa ảnh'
                >
                  <Trash2 size={16} />
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
      <input
        ref={albumFileInputRef}
        type='file'
        accept='image/*'
        multiple
        onChange={handleAlbumFileChange}
        className='hidden'
      />
    </div>
  )
}

export default TabAlbum
