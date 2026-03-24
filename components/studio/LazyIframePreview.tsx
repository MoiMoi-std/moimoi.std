import { useEffect, useRef, useState } from 'react'

interface LazyIframePreviewProps {
  src: string
  title: string
  viewMode?: 'desktop' | 'mobile'
}

/**
 * Renders a scaled-down iframe preview that:
 *  - Only mounts once the card enters the viewport (IntersectionObserver).
 *  - Shows a shimmer skeleton while the iframe is still loading.
 *  - Disables pointer events on the iframe so the parent card stays clickable.
 */
export default function LazyIframePreview({ src, title, viewMode = 'desktop' }: LazyIframePreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' } // start loading 200px before it enters the viewport
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    const updateSize = () => {
      setFrameSize({ width: el.clientWidth, height: el.clientHeight })
    }

    updateSize()
    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(el)

    return () => resizeObserver.disconnect()
  }, [])

  const isMobilePreview = viewMode === 'mobile'
  const desktopBase = { width: 1280, height: 960 }
  const mobileBase = { width: 375, height: 812 }

  const desktopScale = frameSize.width > 0 ? frameSize.width / desktopBase.width : 0.25
  const mobileScale =
    frameSize.width > 0 && frameSize.height > 0
      ? Math.min((frameSize.width - 24) / (mobileBase.width + 24), (frameSize.height - 24) / (mobileBase.height + 24))
      : 0.32

  return (
    <div ref={wrapperRef} className='relative aspect-[4/3] bg-gray-100 overflow-hidden rounded-t-3xl'>
      {/* Shimmer skeleton — visible until iframe fires onLoad */}
      {!loaded && (
        <div className='absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-[shimmer_1.4s_infinite]' />
      )}

      {shouldLoad && (
        <>
          <iframe
            src={src}
            title={title}
            scrolling='no'
            // @ts-ignore – importance is a valid fetch-priority hint
            importance='low'
            onLoad={() => setLoaded(true)}
            style={{
              width: `${isMobilePreview ? mobileBase.width : desktopBase.width}px`,
              height: `${isMobilePreview ? mobileBase.height : desktopBase.height}px`,
              transform: isMobilePreview ? `translate(-50%, -50%) scale(${mobileScale})` : `scale(${desktopScale})`,
              transformOrigin: 'top left',
              border: isMobilePreview ? '12px solid #222' : 'none',
              borderRadius: isMobilePreview ? '36px' : '0',
              pointerEvents: 'none',
              position: 'absolute',
              top: isMobilePreview ? '50%' : 0,
              left: isMobilePreview ? '50%' : 0,
              marginLeft: 0,
              marginTop: 0,
              backgroundColor: '#fff',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          />
          {/* Transparent click-shield so parent card buttons remain interactive */}
          <div className='absolute inset-0' />
        </>
      )}
    </div>
  )
}
