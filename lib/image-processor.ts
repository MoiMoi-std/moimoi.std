// Helper functions to process images before saving to Supabase

export interface ProcessImagesResult {
  newImages: string[]
  uploadedCount: number
  deletedCount: number
  failedCount: number
}

export interface ProgressCallback {
  (current: number, total: number): void
}

/**
 * Upload a single base64 image directly to Cloudinary from the client.
 * The API route only generates a signature (lightweight, like delete-image),
 * so the actual binary never passes through Vercel's serverless function.
 */
async function uploadImageDirectly(base64: string, slug?: string): Promise<string | null> {
  const folder = slug ? `image/${slug}` : 'image'

  // Step 1: Get a signed upload token from our API (small request, no payload limit issue)
  const signRes = await fetch('/api/sign-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder })
  })
  if (!signRes.ok) {
    console.error('Failed to get upload signature')
    return null
  }
  const { signature, timestamp, api_key, cloud_name } = await signRes.json()

  // Step 2: Convert base64 data URL to Blob
  const [header, data] = base64.split(',')
  const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg'
  const byteChars = atob(data)
  const byteArray = new Uint8Array(byteChars.length)
  for (let i = 0; i < byteChars.length; i++) {
    byteArray[i] = byteChars.charCodeAt(i)
  }
  const blob = new Blob([byteArray], { type: mimeType })

  // Step 3: Upload directly to Cloudinary's REST API (bypasses Vercel completely)
  const formData = new FormData()
  formData.append('file', blob)
  formData.append('api_key', api_key)
  formData.append('timestamp', String(timestamp))
  formData.append('signature', signature)
  formData.append('folder', folder)

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`, {
    method: 'POST',
    body: formData
  })
  if (!uploadRes.ok) {
    console.error('Direct Cloudinary upload failed', await uploadRes.text())
    return null
  }
  const result = await uploadRes.json()
  return result.secure_url || null
}

/**
 * Process images: upload base64 to Cloudinary in parallel, delete removed Cloudinary images
 * @param currentImages - Current images array (may contain base64 and URLs)
 * @param previousImages - Previous images array from Supabase (URLs only)
 * @param onProgress - Optional callback for upload progress
 * @returns Processed images array with all Cloudinary URLs
 */
export async function processImages(
  currentImages: string[],
  previousImages: string[] = [],
  slug?: string,
  onProgress?: ProgressCallback
): Promise<ProcessImagesResult> {
  const newImages: string[] = []
  let uploadedCount = 0
  let failedCount = 0

  // Separate base64 images and existing URLs
  const imagesToUpload: { index: number; base64: string }[] = []
  const existingUrls: { index: number; url: string }[] = []

  currentImages.forEach((img, index) => {
    if (img.startsWith('data:')) {
      imagesToUpload.push({ index, base64: img })
    } else {
      existingUrls.push({ index, url: img })
    }
  })

  // Upload all base64 images in parallel with progress tracking
  if (imagesToUpload.length > 0) {
    let completedUploads = 0
    const uploadPromises = imagesToUpload.map(async ({ index, base64 }) => {
      try {
        const url = await uploadImageDirectly(base64, slug)
        // Report progress after each upload completes
        if (onProgress) {
          completedUploads += 1
          onProgress(completedUploads, imagesToUpload.length)
        }
        return { index, url, success: url !== null }
      } catch (error) {
        console.error('Error uploading base64 image:', error)
        if (onProgress) {
          completedUploads += 1
          onProgress(completedUploads, imagesToUpload.length)
        }
        return { index, url: null, success: false }
      }
    })

    const results = await Promise.all(uploadPromises)

    // Process results
    results.forEach(({ index, url, success }) => {
      if (success && url) {
        newImages[index] = url
        uploadedCount++
      } else {
        failedCount++
      }
    })
  }

  // Add existing URLs back
  existingUrls.forEach(({ index, url }) => {
    newImages[index] = url
  })

  // Filter out undefined entries (failed uploads)
  const finalImages = newImages.filter(Boolean)

  // Delete removed images in parallel
  const removedImages = previousImages.filter(
    (oldImg) => !finalImages.includes(oldImg) && (oldImg.startsWith('http://') || oldImg.startsWith('https://'))
  )

  let deletedCount = 0
  if (removedImages.length > 0) {
    const deletePromises = removedImages.map(async (imageUrl) => {
      try {
        const response = await fetch('/api/delete-image', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl })
        })
        return response.ok
      } catch (error) {
        console.error('Error deleting image:', error)
        return false
      }
    })

    const deleteResults = await Promise.all(deletePromises)
    deletedCount = deleteResults.filter(Boolean).length
  }

  return {
    newImages: finalImages,
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
        const url = await uploadImageDirectly(current, slug)
        if (url) {
          result = url
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
