'use client'

interface WeekSelectorProps {
  selectedWeek: number
  onSelectWeek: (week: number) => void
}

const toRoman = (num: number): string => {
  const romanNumerals: [number, string][] = [
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ]
  let result = ''
  for (const [value, symbol] of romanNumerals) {
    while (num >= value) {
      result += symbol
      num -= value
    }
  }
  return result
}

export default function WeekSelector({ selectedWeek, onSelectWeek }: WeekSelectorProps) {
  const weeks = Array.from({ length: 13 }, (_, i) => i + 1)

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-[var(--color-ink-muted)]/20 -translate-y-1/2 hidden sm:block"></div>

      <div className="flex flex-wrap gap-2 sm:gap-0 sm:justify-between relative">
        {weeks.map((week) => {
          const isSelected = selectedWeek === week
          return (
            <button
              key={week}
              onClick={() => onSelectWeek(week)}
              className={`
                group relative flex flex-col items-center focus-ring rounded-lg
                transition-all duration-200 ease-out
                ${isSelected ? 'z-10' : 'z-0'}
              `}
            >
              {/* Circle indicator */}
              <div
                className={`
                  w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center
                  transition-all duration-200 ease-out
                  ${isSelected
                    ? 'bg-[var(--color-burgundy)] shadow-lg shadow-[var(--color-burgundy)]/20 scale-110'
                    : 'bg-[var(--color-cream)] border border-[var(--color-ink-muted)]/20 hover:border-[var(--color-burgundy)]/40 hover:bg-[var(--color-parchment-dark)]'
                  }
                `}
              >
                <span
                  className={`
                    font-display font-semibold text-sm tracking-wide
                    transition-colors duration-200
                    ${isSelected ? 'text-white' : 'text-[var(--color-ink-light)] group-hover:text-[var(--color-burgundy)]'}
                  `}
                >
                  {toRoman(week)}
                </span>
              </div>

              {/* Week label */}
              <span
                className={`
                  mt-2 text-xs font-medium tracking-wide uppercase
                  transition-all duration-200
                  ${isSelected
                    ? 'text-[var(--color-burgundy)]'
                    : 'text-[var(--color-ink-muted)] group-hover:text-[var(--color-ink-light)]'
                  }
                `}
              >
                Week {week}
              </span>

              {/* Selection dot */}
              {isSelected && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-gold)]"></div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
