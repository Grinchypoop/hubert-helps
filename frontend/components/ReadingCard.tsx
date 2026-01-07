'use client'

import { useState } from 'react'

interface Evidence {
  text: string
  page: string
  explanation?: string
}

interface Argument {
  argument: string
  evidence: Evidence[]
}

interface KeyTerm {
  term: string
  definition: string
}

interface Reading {
  id: number
  week_number: number
  title: string
  filename: string
  author?: string
  thesis: string
  key_terms?: KeyTerm[]
  arguments?: Argument[]
  historical_context: string
  historiography: string
  significance?: string
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
  const [showKeyTerms, setShowKeyTerms] = useState(false)

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
          <div className="w-10 h-10 rounded-lg bg-[var(--color-navy)]/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[var(--color-navy)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-semibold text-[var(--color-ink)] leading-tight truncate">
              {reading.title}
            </h3>
            <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
              {reading.author && <span>{reading.author} • </span>}
              {reading.filename}
            </p>
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
          <div className="p-5 space-y-6">

            {/* Key Terms Section */}
            {reading.key_terms && reading.key_terms.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <button
                  onClick={() => setShowKeyTerms(!showKeyTerms)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-semibold text-amber-800">Key Terms ({reading.key_terms.length})</span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-amber-600 transition-transform ${showKeyTerms ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {showKeyTerms && (
                  <div className="mt-3 space-y-3">
                    {reading.key_terms.map((term, i) => (
                      <div key={i} className="bg-white rounded-lg p-3">
                        <span className="font-semibold text-amber-900">{term.term}:</span>
                        <span className="text-[var(--color-ink-light)] ml-2">{term.definition}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Thesis - Root Node */}
            <div className="flex flex-col items-center">
              <div className="bg-[var(--color-burgundy)] text-white px-6 py-5 rounded-xl max-w-3xl text-center shadow-lg">
                <div className="text-xs uppercase tracking-wider opacity-80 mb-3">Main Thesis</div>
                <p className="text-sm leading-relaxed">{reading.thesis}</p>
              </div>

              {reading.arguments && reading.arguments.length > 0 && (
                <div className="w-0.5 h-8 bg-[var(--color-ink-muted)]/30"></div>
              )}
            </div>

            {/* Arguments Grid */}
            {reading.arguments && reading.arguments.length > 0 && (
              <div>
                <div className="flex justify-center mb-4">
                  <div className="h-0.5 bg-[var(--color-ink-muted)]/30" style={{ width: `${Math.min(reading.arguments.length * 180, 900)}px` }}></div>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  {reading.arguments.map((arg, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="w-0.5 h-4 bg-[var(--color-ink-muted)]/30 -mt-4"></div>

                      <div
                        className={`
                          w-72 bg-white border-2 rounded-xl shadow-md cursor-pointer transition-all duration-200
                          ${expandedArgs.has(index)
                            ? 'border-[var(--color-navy)] shadow-lg'
                            : 'border-[var(--color-ink-muted)]/20 hover:border-[var(--color-navy)]/50 hover:shadow-lg'
                          }
                        `}
                        onClick={(e) => toggleArgument(e, index)}
                      >
                        <div className="px-4 py-3 border-b border-[var(--color-ink-muted)]/10 bg-[var(--color-navy)]/5">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-[var(--color-navy)] text-white flex items-center justify-center text-sm font-bold">
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

                        <div className="px-4 py-3">
                          <p className="text-sm text-[var(--color-ink)] leading-relaxed">{arg.argument}</p>
                        </div>
                      </div>

                      {/* Evidence Section */}
                      {expandedArgs.has(index) && arg.evidence && arg.evidence.length > 0 && (
                        <div className="flex flex-col items-center mt-3">
                          <div className="flex flex-col items-center">
                            <div className="w-0.5 h-4 bg-[var(--color-sage)]"></div>
                            <svg className="w-4 h-4 text-[var(--color-sage)] -mt-1" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 16l-6-6h12l-6 6z"/>
                            </svg>
                          </div>

                          <div className="space-y-3 mt-2">
                            {arg.evidence.map((ev, evIndex) => (
                              <div
                                key={evIndex}
                                className="w-68 bg-[var(--color-sage)]/10 border border-[var(--color-sage)]/30 rounded-lg px-4 py-3"
                              >
                                <p className="text-sm text-[var(--color-ink)] leading-relaxed italic">"{ev.text}"</p>
                                {ev.explanation && (
                                  <p className="text-xs text-[var(--color-ink-light)] mt-2 leading-relaxed">
                                    → {ev.explanation}
                                  </p>
                                )}
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

            {/* Significance Section */}
            {reading.significance && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-semibold text-purple-800">Why This Matters</span>
                </div>
                <p className="text-sm text-purple-900 leading-relaxed">{reading.significance}</p>
              </div>
            )}

            {/* Context & Historiography */}
            {(reading.historical_context || reading.historiography) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reading.historical_context && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="font-semibold text-blue-800">Historical Context</span>
                    </div>
                    <p className="text-sm text-blue-900 leading-relaxed">{reading.historical_context}</p>
                  </div>
                )}
                {reading.historiography && (
                  <div className="bg-slate-100 border border-slate-300 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="font-semibold text-slate-700">Historiographical Approach</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{reading.historiography}</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
