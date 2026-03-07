import { NextApiRequest, NextApiResponse } from 'next'
import { v2 as cloudinary } from 'cloudinary'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb'
    }
  }
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { files, slug } = req.body

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'No files provided' })
    }

    const folder = slug ? `image/${slug}` : 'image'
    const uploadedUrls: string[] = []

    for (const base64 of files) {
      try {
        const result = await cloudinary.uploader.upload(base64, {
          folder,
          resource_type: 'auto'
        })
        uploadedUrls.push(result.secure_url)
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError)
      }
    }

    if (uploadedUrls.length === 0) {
      return res.status(500).json({ error: 'Failed to upload images to Cloudinary' })
    }
    return res.status(200).json({ success: true, urls: uploadedUrls })
  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
