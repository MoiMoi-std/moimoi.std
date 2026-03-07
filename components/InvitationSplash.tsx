import { useEffect, useState } from 'react'

interface Props {
  guestName?: string
  coupleNames: string
  onOpen: () => void
}

export default function InvitationSplash({ guestName, coupleNames, onOpen }: Props) {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  const handleClick = () => {
    if (closing) return
    setClosing(true)
    onOpen() // fire immediately so template starts fading in concurrently
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Great+Vibes&display=swap');

        @keyframes splashFadeIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashFadeOut {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          30%  { opacity: 0.85; transform: translateY(-6px) scale(1.01); }
          100% { opacity: 0; transform: translateY(-100vh) scale(1.02); }
        }
        @keyframes floatPetal {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0.7; }
          50%  { transform: translateY(-14px) rotate(8deg); opacity: 1; }
          100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
        }
        @keyframes pulseHint {
          0%, 100% { opacity: 0.55; transform: translateY(0); }
          50%       { opacity: 1;    transform: translateY(-3px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .splash-root {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          user-select: none;
          background: linear-gradient(160deg, #fdf8f2 0%, #fef3f5 45%, #f5f0fa 100%);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .splash-root.closing {
          animation: splashFadeOut 0.75s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          pointer-events: none;
        }

        .splash-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 32px;
          opacity: 0;
          transition: opacity 0.8s ease, transform 0.8s ease;
          transform: translateY(16px);
        }
        .splash-inner.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .splash-deco-ring {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 1.5px solid rgba(190,140,100,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 28px;
          position: relative;
        }
        .splash-deco-ring::before {
          content: '';
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          border: 1px solid rgba(190,140,100,0.2);
        }
        .splash-deco-heart {
          font-size: 2.4rem;
          animation: floatPetal 3.2s ease-in-out infinite;
        }

        .splash-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #b08060;
          margin-bottom: 10px;
        }

        .splash-guest {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(2.4rem, 8vw, 3.8rem);
          color: #7c4f2f;
          margin: 0 0 6px;
          line-height: 1.15;
          background: linear-gradient(90deg, #9a6030 0%, #c8955a 40%, #9a6030 80%, #c8955a 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .splash-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 18px 0;
          width: min(280px, 80vw);
        }
        .splash-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(190,140,100,0.5), transparent);
        }
        .splash-divider-icon {
          font-size: 0.9rem;
          color: #c8955a;
        }

        .splash-couple {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.25rem, 4vw, 1.65rem);
          font-weight: 600;
          font-style: italic;
          color: #4a3020;
          letter-spacing: 0.04em;
          margin: 0;
        }

        .splash-hint {
          margin-top: 44px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          animation: pulseHint 2.2s ease-in-out infinite;
        }
        .splash-hint-icon {
          font-size: 1.4rem;
        }
        .splash-hint-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.78rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #b08060;
        }
      `}</style>

      <div className={`splash-root${closing ? ' closing' : ''}`} onClick={handleClick}>
        {/* decorative corners */}
        {[
          { top: 20, left: 20, rotate: 0 },
          { top: 20, right: 20, rotate: 90 },
          { bottom: 20, right: 20, rotate: 180 },
          { bottom: 20, left: 20, rotate: 270 }
        ].map((pos, i) => (
          <svg
            key={i}
            width='40'
            height='40'
            viewBox='0 0 40 40'
            fill='none'
            style={{
              position: 'absolute',
              opacity: 0.3,
              transform: `rotate(${pos.rotate}deg)`,
              ...((pos as any).top !== undefined ? { top: pos.top } : { bottom: (pos as any).bottom }),
              ...((pos as any).left !== undefined ? { left: pos.left } : { right: (pos as any).right })
            }}
          >
            <path d='M4 4 L4 16 M4 4 L16 4' stroke='#b08060' strokeWidth='1.5' strokeLinecap='round' />
            <circle cx='9' cy='9' r='1.5' fill='#b08060' />
          </svg>
        ))}

        <div className={`splash-inner${visible ? ' visible' : ''}`}>
          <div className='splash-deco-ring'>
            <span className='splash-deco-heart'>💍</span>
          </div>

          <p className='splash-label'>Thiệp mời Cưới</p>

          {guestName ? <h1 className='splash-guest'>{guestName}</h1> : <div style={{ height: 8 }} />}

          <div className='splash-divider'>
            <div className='splash-divider-line' />
            <span className='splash-divider-icon'>✦</span>
            <div className='splash-divider-line' />
          </div>

          <p className='splash-couple'>{coupleNames}</p>

          <div className='splash-hint'>
            <span className='splash-hint-icon'>✉️</span>
            <span className='splash-hint-text'>Nhấn để mở thiệp</span>
          </div>
        </div>
      </div>
    </>
  )
}
