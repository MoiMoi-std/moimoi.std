import { useState, useEffect } from 'react'

/**
 * Resolves a Google Maps URL (including short links like maps.app.goo.gl)
 * to an embeddable iframe src with an accurate marker at the exact coordinates.
 * Falls back to address-based search if no coordinates can be extracted.
 * Also accepts full iframe HTML and extracts the src URL.
 */
export function useMapEmbed(mapUrl?: string, address?: string): string {
  const [embedSrc, setEmbedSrc] = useState<string>(() =>
    address ? `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=15` : ''
  )

  useEffect(() => {
    if (!mapUrl) {
      if (address) {
        setEmbedSrc(`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=15`)
      }
      return
    }

    // Extract src URL from iframe HTML if pasted
    let processedUrl = mapUrl.trim()
    const iframeSrcMatch = processedUrl.match(/src=["']([^"']+)["']/)
    if (iframeSrcMatch) {
      processedUrl = iframeSrcMatch[1]
    }

    // If it's already an embed URL, use it directly
    if (processedUrl.includes('maps.google.com/maps') && processedUrl.includes('output=embed')) {
      setEmbedSrc(processedUrl)
      return
    }

    // Extract @lat,lng from full Google Maps URL directly
    const coordMatch = processedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (coordMatch) {
      setEmbedSrc(`https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed&z=16`)
      return
    }

    // Resolve short URL (maps.app.goo.gl) via API to get coordinates
    fetch(`/api/map-embed?url=${encodeURIComponent(processedUrl)}`)
      .then((r) => r.json())
      .then(({ lat, lng }) => {
        if (lat && lng) {
          setEmbedSrc(`https://maps.google.com/maps?q=${lat},${lng}&output=embed&z=16`)
        } else if (address) {
          setEmbedSrc(`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=15`)
        }
      })
      .catch(() => {
        if (address) {
          setEmbedSrc(`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=15`)
        }
      })
  }, [mapUrl, address])

  return embedSrc
}
