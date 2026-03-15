import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url' })
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MoiMoiBot/1.0)' }
    })
    const finalUrl = response.url
    const m = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (m) {
      return res.json({ lat: m[1], lng: m[2] })
    }
    return res.json({ lat: null, lng: null })
  } catch {
    return res.json({ lat: null, lng: null })
  }
}
