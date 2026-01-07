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
  const [expanded, setExpanded] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(reading.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  return (
    <article className="card-paper rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-[var(--shadow-elevated)]">
      {/* Header */}
      <header className="px-6 py-5 border-b border-[var(--color-ink-muted)]/10 bg-gradient-to-r from-[var(--color-cream)] to-[var(--color-parchment)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl font-semibold text-[var(--color-ink)] leading-tight mb-1 line-clamp-2">
              {reading.title}
            </h3>
            <div className="flex items-center gap-3 text-sm text-[var(--color-ink-muted)]">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="truncate max-w-[200px]">{reading.filename}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-lg hover:bg-[var(--color-parchment-dark)] transition-colors"
              aria-label={expanded ? 'Collapse' : 'Expand'}
            >
              <svg
                className={`w-5 h-5 text-[var(--color-ink-muted)] transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              onClick={handleDelete}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${confirmDelete
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'text-[var(--color-ink-muted)] hover:text-red-600 hover:bg-red-50'
                }
              `}
            >
              {confirmDelete ? 'Confirm?' : 'Delete'}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      {expanded && (
        <div className="p-6 space-y-6">
          {/* Thesis - Primary highlight */}
          <section className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-[var(--color-burgundy)]"></div>
            <div className="pl-5">
              <h4 className="flex items-center gap-2 font-display text-sm font-semibold text-[var(--color-burgundy)] uppercase tracking-wider mb-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Thesis
              </h4>
              <p className="font-display text-lg text-[var(--color-ink)] leading-relaxed italic">
                "{reading.thesis}"
              </p>
            </div>
          </section>

          {/* Supporting Arguments */}
          {reading.supporting_arguments.length > 0 && (
            <section>
              <h4 className="flex items-center gap-2 font-display text-sm font-semibold text-[var(--color-navy)] uppercase tracking-wider mb-3">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Supporting Arguments
              </h4>
              <ul className="space-y-2">
                {reading.supporting_arguments.map((arg, i) => (
                  <li key={i} className="flex gap-3 group">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-navy)]/10 flex items-center justify-center text-xs font-semibold text-[var(--color-navy)]">
                      {i + 1}
                    </span>
                    <p className="text-[var(--color-ink-light)] leading-relaxed pt-0.5">{arg}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Evidence */}
          {reading.evidence.length > 0 && (
            <section>
              <h4 className="flex items-center gap-2 font-display text-sm font-semibold text-[var(--color-sage)] uppercase tracking-wider mb-3">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Evidence
              </h4>
              <div className="bg-[var(--color-parchment-dark)]/50 rounded-lg p-4 border-l-2 border-[var(--color-sage)]">
                <ul className="space-y-2">
                  {reading.evidence.map((ev, i) => (
                    <li key={i} className="flex gap-2 text-[var(--color-ink-light)]">
                      <span className="text-[var(--color-sage)]">•</span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Two-column layout for context sections */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Historical Context */}
            {reading.historical_context && (
              <section className="bg-[var(--color-parchment)]/50 rounded-lg p-4">
                <h4 className="flex items-center gap-2 font-display text-sm font-semibold text-[var(--color-ink)] uppercase tracking-wider mb-2">
                  <svg className="w-4 h-4 text-[var(--color-gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Historical Context
                </h4>
                <p className="text-sm text-[var(--color-ink-light)] leading-relaxed">{reading.historical_context}</p>
              </section>
            )}

            {/* Historiography */}
            {reading.historiography && (
              <section className="bg-[var(--color-parchment)]/50 rounded-lg p-4">
                <h4 className="flex items-center gap-2 font-display text-sm font-semibold text-[var(--color-ink)] uppercase tracking-wider mb-2">
                  <svg className="w-4 h-4 text-[var(--color-gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Historiography
                </h4>
                <p className="text-sm text-[var(--color-ink-light)] leading-relaxed">{reading.historiography}</p>
              </section>
            )}
          </div>
        </div>
      )}
    </article>
  )
}
