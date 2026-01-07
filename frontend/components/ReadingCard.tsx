'use client'

import { useState } from 'react'

interface Evidence {
  text: string
  page: string
}

interface Argument {
  argument: string
  evidence: Evidence[]
}

interface Reading {
  id: number
  week_number: number
  title: string
  filename: string
  thesis: string
  arguments?: Argument[]
  historical_context: string
  historiography: string
  created_at: string
}

interface ReadingCardProps {
  reading: Reading
  onDelete: (id: number) => void
}

export default function ReadingCard({ reading, onDelete }: ReadingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [expandedArgs, setExpandedArgs] = useState<Set<number>>(new Set())

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirmDelete) {
      onDelete(reading.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  const toggleArgument = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    const newExpanded = new Set(expandedArgs)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedArgs(newExpanded)
  }

  return (
    <div className="card-paper rounded-xl overflow-hidden">
      {/* Collapsed Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between gap-4 hover:bg-[var(--color-parchment)]/50 transition-colors text-left"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Document icon */}
          <div className="w-10 h-10 rounded-lg bg-[var(--color-navy)]/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[var(--color-navy)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-semibold text-[var(--color-ink)] leading-tight truncate">
              {reading.title}
            </h3>
            <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">{reading.filename}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleDelete}
            className={`
              px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200
              ${confirmDelete
                ? 'bg-red-600 text-white'
                : 'text-[var(--color-ink-muted)] hover:text-red-600 hover:bg-red-50'
              }
            `}
          >
            {confirmDelete ? 'Confirm?' : 'Delete'}
          </button>

          <svg
            className={`w-5 h-5 text-[var(--color-ink-muted)] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-[var(--color-ink-muted)]/10 animate-fade-in">
          <div className="p-5">
            {/* Thesis - Root Node */}
            <div className="flex flex-col items-center">
              <div className="bg-[var(--color-burgundy)] text-white px-6 py-4 rounded-xl max-w-2xl text-center shadow-lg">
                <div className="text-xs uppercase tracking-wider opacity-80 mb-2">Thesis</div>
                <p className="text-sm leading-relaxed font-medium">{reading.thesis}</p>
              </div>

              {/* Connector Line */}
              {reading.arguments && reading.arguments.length > 0 && (
                <div className="w-0.5 h-8 bg-[var(--color-ink-muted)]/30"></div>
              )}
            </div>

            {/* Arguments Grid */}
            {reading.arguments && reading.arguments.length > 0 && (
              <div className="mt-2">
                {/* Horizontal connector */}
                <div className="flex justify-center mb-4">
                  <div className="h-0.5 bg-[var(--color-ink-muted)]/30" style={{ width: `${Math.min(reading.arguments.length * 200, 800)}px` }}></div>
                </div>

                {/* Argument Cards */}
                <div className="flex flex-wrap justify-center gap-4">
                  {reading.arguments.map((arg, index) => (
                    <div key={index} className="flex flex-col items-center">
                      {/* Vertical connector to card */}
                      <div className="w-0.5 h-4 bg-[var(--color-ink-muted)]/30 -mt-4"></div>

                      {/* Argument Card */}
                      <div
                        className={`
                          w-64 bg-white border-2 rounded-xl shadow-md cursor-pointer transition-all duration-200
                          ${expandedArgs.has(index)
                            ? 'border-[var(--color-navy)] shadow-lg'
                            : 'border-[var(--color-ink-muted)]/20 hover:border-[var(--color-navy)]/50 hover:shadow-lg'
                          }
                        `}
                        onClick={(e) => toggleArgument(e, index)}
                      >
                        {/* Argument Header */}
                        <div className="px-4 py-3 border-b border-[var(--color-ink-muted)]/10">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[var(--color-navy)] text-white flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                            <span className="text-xs uppercase tracking-wide text-[var(--color-navy)] font-semibold">
                              Argument
                            </span>
                            <svg
                              className={`w-4 h-4 text-[var(--color-ink-muted)] ml-auto transition-transform ${expandedArgs.has(index) ? 'rotate-180' : ''}`}
                              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            >
                              <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>

                        {/* Argument Text */}
                        <div className="px-4 py-3">
                          <p className="text-sm text-[var(--color-ink)] leading-relaxed">{arg.argument}</p>
                        </div>
                      </div>

                      {/* Evidence Section (expanded) */}
                      {expandedArgs.has(index) && arg.evidence && arg.evidence.length > 0 && (
                        <div className="flex flex-col items-center mt-2">
                          {/* Arrow down */}
                          <div className="flex flex-col items-center">
                            <div className="w-0.5 h-4 bg-[var(--color-sage)]"></div>
                            <svg className="w-4 h-4 text-[var(--color-sage)] -mt-1" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 16l-6-6h12l-6 6z"/>
                            </svg>
                          </div>

                          {/* Evidence Cards */}
                          <div className="space-y-2 mt-1">
                            {arg.evidence.map((ev, evIndex) => (
                              <div
                                key={evIndex}
                                className="w-60 bg-[var(--color-sage)]/10 border border-[var(--color-sage)]/30 rounded-lg px-3 py-2"
                              >
                                <div className="flex items-start gap-2">
                                  <div className="flex-1">
                                    <p className="text-xs text-[var(--color-ink-light)] leading-relaxed">{ev.text}</p>
                                  </div>
                                </div>
                                <div className="mt-2 flex justify-end">
                                  <span className="text-xs font-medium text-[var(--color-sage)] bg-[var(--color-sage)]/20 px-2 py-0.5 rounded">
                                    {ev.page}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Context & Historiography - Footer */}
            {(reading.historical_context || reading.historiography) && (
              <div className="mt-8 pt-6 border-t border-[var(--color-ink-muted)]/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reading.historical_context && (
                    <div className="bg-[var(--color-gold)]/10 rounded-lg p-4">
                      <div className="text-xs uppercase tracking-wide text-[var(--color-gold)] font-semibold mb-2">
                        Historical Context
                      </div>
                      <p className="text-sm text-[var(--color-ink-light)] leading-relaxed">
                        {reading.historical_context}
                      </p>
                    </div>
                  )}
                  {reading.historiography && (
                    <div className="bg-[var(--color-ink-muted)]/10 rounded-lg p-4">
                      <div className="text-xs uppercase tracking-wide text-[var(--color-ink-muted)] font-semibold mb-2">
                        Historiography
                      </div>
                      <p className="text-sm text-[var(--color-ink-light)] leading-relaxed">
                        {reading.historiography}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
