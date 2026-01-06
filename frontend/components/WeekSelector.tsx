'use client'

interface WeekSelectorProps {
  selectedWeek: number
  onSelectWeek: (week: number) => void
}

export default function WeekSelector({ selectedWeek, onSelectWeek }: WeekSelectorProps) {
  const weeks = Array.from({ length: 13 }, (_, i) => i + 1)

  return (
    <div className="flex flex-wrap gap-2">
      {weeks.map((week) => (
        <button
          key={week}
          onClick={() => onSelectWeek(week)}
          className={`px-4 py-2 rounded border ${
            selectedWeek === week
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
          }`}
        >
          Week {week}
        </button>
      ))}
    </div>
  )
}
