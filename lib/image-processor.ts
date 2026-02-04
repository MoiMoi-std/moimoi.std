// Helper functions to process images before saving to Supabase

export interface ProcessImagesResult {
  newImages: string[]
  uploadedCount: number
  deletedCount: number
}

/**
 * Process images: upload base64 to Cloudinary, delete removed Cloudinary images
 * @param currentImages - Current images array (may contain base64 and URLs)
 * @param previousImages - Previous images array from Supabase (URLs only)
 * @returns Processed images array with all Cloudinary URLs
 */
export async function processImages(
  currentImages: string[],
  previousImages: string[] = []
): Promise<ProcessImagesResult> {
  const newImages: string[] = []
  let uploadedCount = 0
  let deletedCount = 0

  for (const img of currentImages) {
    if (img.startsWith('data:')) {
      try {
        const blob = await fetch(img).then(r => r.blob())
        const file = new File([blob], 'image.jpg', { type: blob.type })
        
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const data = await response.json()
          newImages.push(data.urls[0])
          uploadedCount++
        } else {
          console.error('Failed to upload image')
        }
      } catch (error) {
        console.error('Error uploading base64 image:', error)
      }
    } else {
      newImages.push(img)
    }
  }

  const removedImages = previousImages.filter(
    oldImg => !newImages.includes(oldImg) && (oldImg.startsWith('http://') || oldImg.startsWith('https://'))
  )

  for (const imageUrl of removedImages) {
    try {
      const response = await fetch('/api/delete-image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageUrl })
      })

      if (response.ok) {
        deletedCount++
      }
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  return {
    newImages,
    uploadedCount,
    deletedCount
  }
}
