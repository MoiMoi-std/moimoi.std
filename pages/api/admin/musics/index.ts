import { v2 as cloudinary } from 'cloudinary'
import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase env vars')
  return createClient(url, key)
}

function extractCloudinaryPublicId(url: string): string | null {
  const parts = url.split('/upload/')
  if (parts.length < 2) return null
  const pathAfterUpload = parts[1]
  const pathParts = pathAfterUpload.split('/')
  const publicIdParts = pathParts.slice(1) // bỏ version (v123456789)
  const publicIdWithExt = publicIdParts.join('/')
  return publicIdWithExt.replace(/\.[^/.]+$/, '')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const supabase = getSupabase()

    if (req.method === 'GET') {
      const { data, error } = await supabase.from('musics').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return res.status(200).json(data)
    }

    if (req.method === 'POST') {
      const { title, artist, url } = req.body
      if (!title || !url) {
        return res.status(400).json({ error: 'title and url are required' })
      }
      const { data, error } = await supabase
        .from('musics')
        .insert({ title, artist: artist || null, url })
        .select()
        .single()
      if (error) throw error
      return res.status(200).json(data)
    }

    if (req.method === 'PUT') {
      const { id, title, artist } = req.body
      if (!id || !title) return res.status(400).json({ error: 'id and title are required' })
      const { data, error } = await supabase
        .from('musics')
        .update({ title, artist: artist || null })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return res.status(200).json(data)
    }

    if (req.method === 'DELETE') {
      const { id, url } = req.body
      if (!id) return res.status(400).json({ error: 'id is required' })

      // Xóa file nhạc khỏi Cloudinary
      if (url) {
        const publicId = extractCloudinaryPublicId(url)
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, { resource_type: 'video' })
        }
      }

      const { error } = await supabase.from('musics').delete().eq('id', id)
      if (error) throw error
      return res.status(200).json({ success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err: any) {
    console.error('Musics API error:', err)
    return res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
}
