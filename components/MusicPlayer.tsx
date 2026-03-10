import { useEffect, useRef, useState } from 'react'

interface MusicPlayerProps {
  musicUrl?: string
}

export default function MusicPlayer({ musicUrl }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!musicUrl) return
    const audio = new Audio(musicUrl)
    audio.loop = true
    audioRef.current = audio

    const handleInteraction = () => {
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    }

    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Autoplay blocked by browser — start on first user gesture
        document.addEventListener('click', handleInteraction, { once: true })
        document.addEventListener('touchstart', handleInteraction, { once: true })
      })

    return () => {
      audio.pause()
      audioRef.current = null
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }
  }, [musicUrl])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {})
    }
  }

  if (!musicUrl) return null

  return (
    <>
      <style>{`
        @keyframes music-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes music-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.35), 0 4px 16px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 0 0 8px rgba(255,255,255,0), 0 4px 16px rgba(0,0,0,0.3); }
        }
        .music-btn:hover {
          background: rgba(30,30,30,0.85) !important;
          transform: scale(1.08);
        }
      `}</style>
      <button
        className='music-btn'
        onClick={togglePlay}
        title={isPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9998,
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'rgba(10,10,10,0.65)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#f1f5f9',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          animation: isPlaying ? 'music-pulse 2s ease-in-out infinite' : 'none',
          transition: 'background 0.2s, transform 0.2s'
        }}
      >
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='currentColor'
          style={{
            animation: isPlaying ? 'music-spin 4s linear infinite' : 'none',
            flexShrink: 0
          }}
        >
          <path d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' />
        </svg>
      </button>
    </>
  )
}
