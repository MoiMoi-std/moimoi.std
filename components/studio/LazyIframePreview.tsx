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
              width: viewMode === 'mobile' ? '375px' : '1280px',
              height: viewMode === 'mobile' ? '812px' : '960px',
              transform: viewMode === 'mobile' ? 'scale(0.32)' : 'scale(0.25)',
              transformOrigin: 'top left',
              border: viewMode === 'mobile' ? '12px solid #222' : 'none',
              borderRadius: viewMode === 'mobile' ? '36px' : '0',
              pointerEvents: 'none',
              position: 'absolute',
              top: viewMode === 'mobile' ? '50%' : 0,
              left: viewMode === 'mobile' ? '50%' : 0,
              marginLeft: viewMode === 'mobile' ? '-60px' : 0, // 375 * 0.32 / 2
              marginTop: viewMode === 'mobile' ? '-130px' : 0, // 812 * 0.32 / 2
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
