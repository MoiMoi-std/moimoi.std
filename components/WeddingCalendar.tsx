import { Heart } from 'lucide-react'

interface WeddingCalendarProps {
  year: number
  month: number // 1-12
  day: number
  primaryColor: string
  /** 'light' = white bg (Default, Vintage), 'dark' = dark bg (Luxury, Modern) */
  variant?: 'light' | 'dark'
  fontFamily?: string
}

const DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

const MONTH_VI = [
  '',
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12'
]

export function WeddingCalendar({
  year,
  month,
  day,
  primaryColor,
  variant = 'light',
  fontFamily
}: WeddingCalendarProps) {
  const isDark = variant === 'dark'

  // First weekday of month: 0=Sun…6=Sat → convert to Mon=0…Sun=6
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const startOffset = firstWeekday === 0 ? 6 : firstWeekday - 1

  // Total days in month
  const daysInMonth = new Date(year, month, 0).getDate()

  // Build flat cell array (null = empty leading cell)
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ]

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  const textColor = isDark ? '#d4d4d4' : '#4a4a4a'
  const mutedColor = isDark ? '#555' : '#aaa'
  const bgColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)'
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'

  return (
    <div
      style={{
        width: '100%',
        borderRadius: 16,
        background: bgColor,
        border: `1px solid ${borderColor}`,
        overflow: 'hidden',
        fontFamily: fontFamily || 'inherit'
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: primaryColor,
          padding: '10px 12px',
          textAlign: 'center'
        }}
      >
        <span
          style={{
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.95rem',
            letterSpacing: '0.05em'
          }}
        >
          {MONTH_VI[month]}/{year}
        </span>
      </div>

      {/* Day-of-week labels */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          padding: '8px 6px 4px'
        }}
      >
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            style={{
              textAlign: 'center',
              fontSize: '0.65rem',
              fontWeight: 600,
              color: label === 'CN' ? primaryColor : mutedColor,
              padding: '2px 0'
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          padding: '0 6px 10px',
          gap: '2px 0'
        }}
      >
        {cells.map((cell, idx) => {
          const isWeddingDay = cell === day
          // Sunday = idx % 7 === 6
          const isSunday = idx % 7 === 6

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                height: 38,
                gap: 1
              }}
            >
              {isWeddingDay ? (
                <>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: primaryColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 2px 8px ${primaryColor}60`
                    }}
                  >
                    <span
                      style={{
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        lineHeight: 1
                      }}
                    >
                      {cell}
                    </span>
                  </div>
                  <Heart size={7} fill={primaryColor} color={primaryColor} />
                </>
              ) : cell ? (
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: isSunday ? primaryColor : textColor,
                    fontWeight: isSunday ? 600 : 400
                  }}
                >
                  {cell}
                </span>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
