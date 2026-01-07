'use client'

import { useState, useRef, useEffect } from 'react'

interface WeekSelectorProps {
  selectedWeek: number
  onSelectWeek: (week: number) => void
}

export default function WeekSelector({ selectedWeek, onSelectWeek }: WeekSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const weeks = Array.from({ length: 13 }, (_, i) => i + 1)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (week: number) => {
    onSelectWeek(week)
    setIsOpen(false)
  }

  return (
    <div className="relative z-50" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between gap-3 px-4 py-3
          bg-[var(--color-cream)] border border-[var(--color-ink-muted)]/20 rounded-lg
          text-left transition-all duration-200
          hover:border-[var(--color-burgundy)]/40
          ${isOpen ? 'border-[var(--color-burgundy)] ring-2 ring-[var(--color-burgundy)]/10' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--color-burgundy)] flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{selectedWeek}</span>
          </div>
          <span className="font-medium text-[var(--color-ink)]">Week {selectedWeek}</span>
        </div>
        <svg
          className={`w-5 h-5 text-[var(--color-ink-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[100] mt-2 w-full bg-[var(--color-cream)] border border-[var(--color-ink-muted)]/20 rounded-lg shadow-xl overflow-hidden animate-scale-in">
          <div className="max-h-64 overflow-y-auto py-1">
            {weeks.map((week) => (
              <button
                key={week}
                onClick={() => handleSelect(week)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                  ${selectedWeek === week
                    ? 'bg-[var(--color-burgundy)]/10 text-[var(--color-burgundy)]'
                    : 'text-[var(--color-ink-light)] hover:bg-[var(--color-parchment-dark)]'
                  }
                `}
              >
                <div
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium
                    ${selectedWeek === week
                      ? 'bg-[var(--color-burgundy)] text-white'
                      : 'bg-[var(--color-parchment-dark)] text-[var(--color-ink-muted)]'
                    }
                  `}
                >
                  {week}
                </div>
                <span className="font-medium">Week {week}</span>
                {selectedWeek === week && (
                  <svg className="w-4 h-4 ml-auto text-[var(--color-burgundy)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
