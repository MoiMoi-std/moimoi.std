/**
 * Build a Google Maps iframe embed URL from any map_url format.
 * Supports: /maps/embed, @lat,lng coords, ?q= param, /place/ path.
 * Falls back to address if no usable data found in raw URL.
 */
export function buildMapEmbedUrl(raw: string, address: string): string {
  if (raw) {
    if (raw.includes('/maps/embed')) return raw
    const coordMatch = raw.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (coordMatch) {
      return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed&hl=vi&z=16`
    }
    try {
      const u = new URL(raw)
      const q = u.searchParams.get('q')
      if (q) return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed&hl=vi&z=16`
    } catch (_) {}
    const placeMatch = raw.match(/\/place\/([^/@?]+)/)
    if (placeMatch) {
      const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
      return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&output=embed&hl=vi&z=16`
    }
  }
  return address ? `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&hl=vi&z=16` : ''
}

export function isShortMapUrl(url: string): boolean {
  return url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')
}
