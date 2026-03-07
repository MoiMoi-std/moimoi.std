// Helper functions to process images before saving to Supabase

export interface ProcessImagesResult {
  newImages: string[]
  uploadedCount: number
  deletedCount: number
  failedCount: number
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
        const url = await uploadImageDirectly(img, slug)
        if (url) {
          newImages.push(url)
          uploadedCount++
        } else {
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
