import React from 'react'

export interface ImageAdjust {
  x: number // 0–100, focal point horizontal %
  y: number // 0–100, focal point vertical %
  zoom: number // 1.0 – 3.0
}

export interface ImagePosition {
  phone?: ImageAdjust
  laptop?: ImageAdjust
}

export const DEFAULT_ADJUST: ImageAdjust = { x: 50, y: 50, zoom: 1 }

/** Resolve the best ImageAdjust for a given viewport, with cross-device fallback. */
export function resolveImageAdjust(
  position?: ImagePosition | null,
  viewport?: 'phone' | 'laptop' | null
): ImageAdjust | null {
  if (!position) return null
  if (viewport && position[viewport]) return position[viewport]!
  // Fallback to whichever device was set
  return position.phone || position.laptop || null
}

export function getImageStyle(adj?: ImageAdjust | null): React.CSSProperties {
  const a = adj || DEFAULT_ADJUST
  const style: React.CSSProperties = {
    objectFit: 'cover',
    objectPosition: `${a.x}% ${a.y}%`
  }
  if (a.zoom !== 1) {
    style.transform = `scale(${a.zoom})`
    style.transformOrigin = `${a.x}% ${a.y}%`
  }
  return style
}
