import { useEffect, useRef, useState } from 'react'

interface LazyIframePreviewProps {
  src: string
  title: string
}

/**
 * Renders a scaled-down iframe preview that:
 *  - Only mounts once the card enters the viewport (IntersectionObserver).
 *  - Shows a shimmer skeleton while the iframe is still loading.
 *  - Disables pointer events on the iframe so the parent card stays clickable.
 */
export default function LazyIframePreview({ src, title }: LazyIframePreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [loaded, setLoaded] = useState(false)

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
              width: '1280px',
              height: '960px',
              transform: 'scale(0.25)',
              transformOrigin: 'top left',
              border: 'none',
              pointerEvents: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
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
