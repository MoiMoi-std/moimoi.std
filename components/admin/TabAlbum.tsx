import React, { useState } from 'react'

interface TabAlbumProps {
  images: string[]
  onImagesChange: (images: string[]) => void
}

const TabAlbum: React.FC<TabAlbumProps> = ({ images, onImagesChange }) => {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = () => {
    setIsUploading(true)
    // Simulate upload delay
    setTimeout(() => {
      const newImage = `https://via.placeholder.com/400x300?text=New+Image+${images.length + 1}`
      onImagesChange([...images, newImage])
      setIsUploading(false)
    }, 1000)
  }

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove)
    onImagesChange(newImages)
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm space-y-6'>
      <h3 className='text-lg font-medium text-gray-900 border-b pb-2'>Photo Album</h3>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {images.map((img, index) => (
          <div key={index} className='relative group aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden'>
            <img src={img} alt={`Album ${index}`} className='object-cover w-full h-full' />
            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center'>
              <button
                onClick={() => removeImage(index)}
                className='opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full transform scale-90 group-hover:scale-100 transition-all'
                title='Remove'
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

        <div
          onClick={handleUpload}
          className='aspect-w-4 aspect-h-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors'
        >
          <div className='text-center p-4'>
            {isUploading ? (
              <span className='text-pink-600'>Uploading...</span>
            ) : (
              <>
                <div className='text-3xl mb-2'>📷</div>
                <span className='text-sm text-gray-500 font-medium'>Add Photo</span>
              </>
            )}
          </div>
        </div>
      </div>

      <p className='text-sm text-gray-500 italic'>
        * Note: In this mock version, clicking "Add Photo" simulates a successful upload.
      </p>
    </div>
  )
}

export default TabAlbum
