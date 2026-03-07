// Helper functions to process images before saving to Supabase

const UPLOAD_TIMEOUT_MS = 60_000

function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = UPLOAD_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeoutMs)
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(id))
}

export interface ProcessImagesResult {
  newImages: string[]
  uploadedCount: number
  deletedCount: number
  failedCount: number
}

/**
 * Process images: upload base64 to Cloudinary, delete removed Cloudinary images
 * @param currentImages - Current images array (may contain base64 and URLs)
 * @param previousImages - Previous images array from Supabase (URLs only)
 * @returns Processed images array with all Cloudinary URLs
 */
export async function processImages(
  currentImages: string[],
  previousImages: string[] = [],
  slug?: string
): Promise<ProcessImagesResult> {
  const newImages: string[] = []
  let uploadedCount = 0
  let deletedCount = 0
  let failedCount = 0

  for (const img of currentImages) {
    if (img.startsWith('data:')) {
      try {
        const response = await fetchWithTimeout('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ files: [img], slug })
        })

        if (response.ok) {
          const data = await response.json()
          newImages.push(data.urls[0])
          uploadedCount++
        } else {
          console.error('Failed to upload image')
          failedCount++
        }
      } catch (error) {
        console.error('Error uploading base64 image:', error)
        failedCount++
      }
    } else {
      newImages.push(img)
    }
  }

  const removedImages = previousImages.filter(
    (oldImg) => !newImages.includes(oldImg) && (oldImg.startsWith('http://') || oldImg.startsWith('https://'))
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
    deletedCount,
    failedCount
  }
}

/**
 * Process a single image: upload base64 to Cloudinary, delete old if changed
 */
export async function processSingleImage(
  current: string | null | undefined,
  previous: string | null | undefined,
  slug?: string
): Promise<string | null> {
  let result: string | null = null

  if (current) {
    if (current.startsWith('data:')) {
      try {
        const response = await fetchWithTimeout('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ files: [current], slug })
        })
        if (response.ok) {
          const data = await response.json()
          result = data.urls[0]
        } else {
          console.error('Failed to upload cover image')
        }
      } catch (error) {
        console.error('Error uploading cover image:', error)
      }
    } else {
      result = current
    }
  }

  if (previous && previous !== result && (previous.startsWith('http://') || previous.startsWith('https://'))) {
    try {
      await fetch('/api/delete-image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: previous })
      })
    } catch (error) {
      console.error('Error deleting old cover image:', error)
    }
  }

  return result
}
