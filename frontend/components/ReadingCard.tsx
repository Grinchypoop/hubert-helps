'use client'

import { useState } from 'react'

interface Reading {
  id: number
  week_number: number
  title: string
  filename: string
  thesis: string
  supporting_arguments: string[]
  evidence: string[]
  historical_context: string
  historiography: string
  created_at: string
}

interface ReadingCardProps {
  reading: Reading
  onDelete: (id: number) => void
}

export default function ReadingCard({ reading, onDelete }: ReadingCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(
    new Set(['thesis', 'arguments', 'evidence', 'context', 'historiography'])
  )

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(reading.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  const toggleBranch = (branch: string) => {
    const newExpanded = new Set(expandedBranches)
    if (newExpanded.has(branch)) {
      newExpanded.delete(branch)
    } else {
      newExpanded.add(branch)
    }
    setExpandedBranches(newExpanded)
  }

  return (
    <div className="card-paper rounded-xl overflow-hidden">
      {/* Header - Title */}
      <div className="px-5 py-4 border-b border-[var(--color-ink-muted)]/10 bg-gradient-to-r from-[var(--color-cream)] to-[var(--color-parchment)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-semibold text-[var(--color-ink)] leading-tight">
              {reading.title}
            </h3>
            <p className="text-xs text-[var(--color-ink-muted)] mt-1">{reading.filename}</p>
          </div>
          <button
            onClick={handleDelete}
            className={`
              px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 flex-shrink-0
              ${confirmDelete
                ? 'bg-red-600 text-white'
                : 'text-[var(--color-ink-muted)] hover:text-red-600 hover:bg-red-50'
              }
            `}
          >
            {confirmDelete ? 'Confirm?' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Mindmap Content */}
      <div className="p-5">
        <div className="space-y-3">

          {/* Thesis - Main Node */}
          <div className="relative">
            <button
              onClick={() => toggleBranch('thesis')}
              className="w-full flex items-center gap-2 text-left group"
            >
              <div className="w-3 h-3 rounded-full bg-[var(--color-burgundy)] flex-shrink-0" />
              <span className="font-display font-semibold text-[var(--color-burgundy)] text-sm uppercase tracking-wide">
                Thesis
              </span>
              <svg
                className={`w-4 h-4 text-[var(--color-ink-muted)] transition-transform ${expandedBranches.has('thesis') ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {expandedBranches.has('thesis') && (
              <div className="mt-2 ml-1.5 pl-4 border-l-2 border-[var(--color-burgundy)]/30">
                <p className="text-[var(--color-ink)] leading-relaxed text-sm">{reading.thesis}</p>
              </div>
            )}
          </div>

          {/* Supporting Arguments Branch */}
          {reading.supporting_arguments.length > 0 && (
            <div className="relative">
              <button
                onClick={() => toggleBranch('arguments')}
                className="w-full flex items-center gap-2 text-left group"
              >
                <div className="w-3 h-3 rounded-full bg-[var(--color-navy)] flex-shrink-0" />
                <span className="font-display font-semibold text-[var(--color-navy)] text-sm uppercase tracking-wide">
                  Arguments
                </span>
                <span className="text-xs text-[var(--color-ink-muted)]">({reading.supporting_arguments.length})</span>
                <svg
                  className={`w-4 h-4 text-[var(--color-ink-muted)] transition-transform ${expandedBranches.has('arguments') ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {expandedBranches.has('arguments') && (
                <div className="mt-2 ml-1.5 pl-4 border-l-2 border-[var(--color-navy)]/30 space-y-2">
                  {reading.supporting_arguments.map((arg, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-[var(--color-navy)]/10 flex items-center justify-center text-xs font-medium text-[var(--color-navy)] flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-[var(--color-ink-light)] leading-relaxed">{arg}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Evidence Branch */}
          {reading.evidence.length > 0 && (
            <div className="relative">
              <button
                onClick={() => toggleBranch('evidence')}
                className="w-full flex items-center gap-2 text-left group"
              >
                <div className="w-3 h-3 rounded-full bg-[var(--color-sage)] flex-shrink-0" />
                <span className="font-display font-semibold text-[var(--color-sage)] text-sm uppercase tracking-wide">
                  Evidence
                </span>
                <span className="text-xs text-[var(--color-ink-muted)]">({reading.evidence.length})</span>
                <svg
                  className={`w-4 h-4 text-[var(--color-ink-muted)] transition-transform ${expandedBranches.has('evidence') ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {expandedBranches.has('evidence') && (
                <div className="mt-2 ml-1.5 pl-4 border-l-2 border-[var(--color-sage)]/30 space-y-1.5">
                  {reading.evidence.map((ev, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-[var(--color-sage)] mt-1">•</span>
                      <p className="text-sm text-[var(--color-ink-light)] leading-relaxed">{ev}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Historical Context Branch */}
          {reading.historical_context && (
            <div className="relative">
              <button
                onClick={() => toggleBranch('context')}
                className="w-full flex items-center gap-2 text-left group"
              >
                <div className="w-3 h-3 rounded-full bg-[var(--color-gold)] flex-shrink-0" />
                <span className="font-display font-semibold text-[var(--color-gold)] text-sm uppercase tracking-wide">
                  Context
                </span>
                <svg
                  className={`w-4 h-4 text-[var(--color-ink-muted)] transition-transform ${expandedBranches.has('context') ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {expandedBranches.has('context') && (
                <div className="mt-2 ml-1.5 pl-4 border-l-2 border-[var(--color-gold)]/30">
                  <p className="text-sm text-[var(--color-ink-light)] leading-relaxed">{reading.historical_context}</p>
                </div>
              )}
            </div>
          )}

          {/* Historiography Branch */}
          {reading.historiography && (
            <div className="relative">
              <button
                onClick={() => toggleBranch('historiography')}
                className="w-full flex items-center gap-2 text-left group"
              >
                <div className="w-3 h-3 rounded-full bg-[var(--color-ink-muted)] flex-shrink-0" />
                <span className="font-display font-semibold text-[var(--color-ink-muted)] text-sm uppercase tracking-wide">
                  Historiography
                </span>
                <svg
                  className={`w-4 h-4 text-[var(--color-ink-muted)] transition-transform ${expandedBranches.has('historiography') ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {expandedBranches.has('historiography') && (
                <div className="mt-2 ml-1.5 pl-4 border-l-2 border-[var(--color-ink-muted)]/30">
                  <p className="text-sm text-[var(--color-ink-light)] leading-relaxed">{reading.historiography}</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
