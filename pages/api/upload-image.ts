import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

// Disable bodyParser to use formidable
export const config = {
  api: {
    bodyParser: false
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
    const form = formidable({
      multiples: true,
      maxFileSize: 10 * 1024 * 1024
    })

    const [fields, files] = await form.parse(req)
    
    const uploadedFiles = files.file
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const uploadedUrls: string[] = []

    for (const file of uploadedFiles) {
      try {
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: 'moimoi',
          resource_type: 'auto',
          transformation: [
            { width: 1920, height: 1080, crop: 'limit' },
            { quality: 'auto:good' }
          ]
        })

        uploadedUrls.push(result.secure_url)
        fs.unlinkSync(file.filepath)
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError)
      }
    }

    if (uploadedUrls.length === 0) {
      return res.status(500).json({ error: 'Failed to upload images to Cloudinary' })
    }
    return res.status(200).json({ 
      success: true, 
      urls: uploadedUrls 
    })

  } catch (error) {
    console.error('Upload error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
