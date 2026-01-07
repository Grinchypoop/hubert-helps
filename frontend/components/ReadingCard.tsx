'use client'

import { useState, useEffect, useRef } from 'react'

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

interface Highlight {
  id: string
  text: string
  note: string
  color: string
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

  // Highlight and notes state
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [activeNote, setActiveNote] = useState<{id: string, x: number, y: number} | null>(null)
  const [noteText, setNoteText] = useState('')

  const contentRef = useRef<HTMLDivElement>(null)
  const noteInputRef = useRef<HTMLTextAreaElement>(null)

  // Load highlights from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`highlights-${reading.id}`)
    if (saved) {
      setHighlights(JSON.parse(saved))
    }
  }, [reading.id])

  // Save highlights to localStorage
  useEffect(() => {
    if (highlights.length > 0) {
      localStorage.setItem(`highlights-${reading.id}`, JSON.stringify(highlights))
    }
  }, [highlights, reading.id])

  // Handle text selection - automatically create highlight and show note popup
  const handleMouseUp = (e: React.MouseEvent) => {
    // Don't create highlight if clicking on existing highlight
    if ((e.target as HTMLElement).classList.contains('highlight-mark')) {
      return
    }

    const selection = window.getSelection()
    const text = selection?.toString().trim()

    if (text && text.length > 0 && contentRef.current?.contains(selection?.anchorNode || null)) {
      const rect = selection!.getRangeAt(0).getBoundingClientRect()

      // Automatically create the highlight
      const newHighlight: Highlight = {
        id: Date.now().toString(),
        text: text,
        note: '',
        color: '#fef08a' // yellow-200
      }
      setHighlights(prev => [...prev, newHighlight])

      // Show note popup immediately
      setActiveNote({
        id: newHighlight.id,
        x: rect.left + rect.width / 2,
        y: rect.bottom + 10
      })
      setNoteText('')

      window.getSelection()?.removeAllRanges()
    }
  }

  const handleSaveNote = () => {
    if (activeNote) {
      setHighlights(highlights.map(h =>
        h.id === activeNote.id ? { ...h, note: noteText } : h
      ))
      setActiveNote(null)
      setNoteText('')
    }
  }

  const handleDeleteHighlight = (id: string) => {
    setHighlights(highlights.filter(h => h.id !== id))
    setActiveNote(null)
  }

  const handleClickOutside = (e: React.MouseEvent) => {
    if (activeNote && noteInputRef.current && !noteInputRef.current.contains(e.target as Node)) {
      handleSaveNote()
    }
  }

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

  // Function to render text with highlights
  const renderWithHighlights = (text: string) => {
    let result = text
    highlights.forEach(h => {
      if (text.includes(h.text)) {
        result = result.replace(
          h.text,
          `<mark class="highlight-mark" data-id="${h.id}" style="background-color: ${h.color}; padding: 2px 0; cursor: pointer;">${h.text}</mark>`
        )
      }
    })
    return result
  }

  const handleHighlightClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('highlight-mark')) {
      const id = target.getAttribute('data-id')
      if (id) {
        const highlight = highlights.find(h => h.id === id)
        if (highlight) {
          const rect = target.getBoundingClientRect()
          setActiveNote({ id, x: rect.left + rect.width / 2, y: rect.bottom + 10 })
          setNoteText(highlight.note)
        }
      }
    }
  }

  return (
    <div className="card-paper rounded-xl overflow-hidden relative" onClick={handleClickOutside}>
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
              {highlights.length > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 text-amber-600">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                  {highlights.length} note{highlights.length > 1 ? 's' : ''}
                </span>
              )}
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
          <div
            ref={contentRef}
            className="p-5 space-y-6"
            onMouseUp={handleMouseUp}
            onClick={handleHighlightClick}
          >
            {/* Highlight instruction */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700 flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Select any text to highlight & add notes. Click highlights to edit.</span>
            </div>

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
                        <span
                          className="text-[var(--color-ink-light)] ml-2"
                          dangerouslySetInnerHTML={{ __html: renderWithHighlights(term.definition) }}
                        />
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
                <p
                  className="text-sm leading-relaxed [&_mark]:bg-yellow-300 [&_mark]:text-[var(--color-ink)]"
                  dangerouslySetInnerHTML={{ __html: renderWithHighlights(reading.thesis) }}
                />
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
                          <p
                            className="text-sm text-[var(--color-ink)] leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: renderWithHighlights(arg.argument) }}
                          />
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
                                <p
                                  className="text-sm text-[var(--color-ink)] leading-relaxed italic"
                                  dangerouslySetInnerHTML={{ __html: `"${renderWithHighlights(ev.text)}"` }}
                                />
                                {ev.explanation && (
                                  <p
                                    className="text-xs text-[var(--color-ink-light)] mt-2 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: `→ ${renderWithHighlights(ev.explanation)}` }}
                                  />
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
                <p
                  className="text-sm text-purple-900 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderWithHighlights(reading.significance) }}
                />
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
                    <p
                      className="text-sm text-blue-900 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: renderWithHighlights(reading.historical_context) }}
                    />
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
                    <p
                      className="text-sm text-slate-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: renderWithHighlights(reading.historiography) }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Notes Summary */}
            {highlights.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-semibold text-yellow-800">Your Notes ({highlights.length})</span>
                </div>
                <div className="space-y-2">
                  {highlights.map(h => (
                    <div key={h.id} className="bg-white rounded-lg p-3 border border-yellow-200">
                      <p className="text-sm text-[var(--color-ink)] italic bg-yellow-100 px-1 inline">"{h.text}"</p>
                      {h.note && (
                        <p className="text-sm text-[var(--color-ink-light)] mt-2">→ {h.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Note Editor Popup - Post-it style */}
      {activeNote && (
        <div
          className="fixed z-50 transform -translate-x-1/2 animate-fade-in"
          style={{ left: Math.min(Math.max(activeNote.x, 150), window.innerWidth - 150), top: activeNote.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-yellow-200 rounded-lg shadow-xl p-4 w-64 border-2 border-yellow-300" style={{ boxShadow: '4px 4px 0 rgba(0,0,0,0.1)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-yellow-800 uppercase tracking-wide">Your Note</span>
              <button
                onClick={() => handleDeleteHighlight(activeNote.id)}
                className="text-yellow-700 hover:text-red-600 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <textarea
              ref={noteInputRef}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your note here..."
              autoFocus
              className="w-full h-24 bg-yellow-100 border border-yellow-300 rounded-md p-2 text-sm text-[var(--color-ink)] placeholder:text-yellow-600 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={handleSaveNote}
              className="mt-2 w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 py-1.5 rounded-md text-sm font-medium transition-colors"
            >
              Save Note
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
