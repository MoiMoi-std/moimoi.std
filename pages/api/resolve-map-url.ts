import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * Resolves a short Google Maps URL (maps.app.goo.gl, goo.gl/maps) to its
 * full redirect destination by following the redirect server-side.
 * This avoids the CORS restriction that prevents the browser from doing it.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url parameter' })
  }
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MoimoiStudio/1.0)' }
    })
    return res.status(200).json({ resolved: response.url })
  } catch {
    return res.status(500).json({ error: 'Failed to resolve URL' })
  }
}
