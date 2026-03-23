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
  const [wrapperWidth, setWrapperWidth] = useState(0)

  const sourceWidth = viewMode === 'mobile' ? 375 : 1280
  const sourceHeight = viewMode === 'mobile' ? 812 : 960
  const scale = wrapperWidth > 0 ? wrapperWidth / sourceWidth : viewMode === 'mobile' ? 0.32 : 0.25

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

    const measure = () => {
      setWrapperWidth(el.clientWidth)
    }

    measure()
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(el)
    return () => resizeObserver.disconnect()
  }, [])

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
              width: `${sourceWidth}px`,
              height: `${sourceHeight}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              border: 'none',
              borderRadius: 0,
              pointerEvents: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
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
