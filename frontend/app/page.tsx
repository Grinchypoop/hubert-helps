'use client'

import { useState, useEffect } from 'react'
import Sidebar, { Module } from '@/components/Sidebar'
import WeekSelector from '@/components/WeekSelector'
import FileUpload from '@/components/FileUpload'
import ReadingCard from '@/components/ReadingCard'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const MODULE_COLORS = [
  '#722f37', '#1e3a5f', '#5a6b5a', '#8b5a2b',
  '#4a5568', '#744210', '#285e61', '#702459',
]

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

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modules, setModules] = useState<Module[]>([])
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [readings, setReadings] = useState<Reading[]>([])
  const [loading, setLoading] = useState(false)

  // Load modules from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('hubert-modules')
    if (saved) {
      const parsed = JSON.parse(saved) as Module[]
      setModules(parsed)
      if (parsed.length > 0) {
        setSelectedModule(parsed[0])
      }
    }
  }, [])

  // Save modules to localStorage
  useEffect(() => {
    if (modules.length > 0) {
      localStorage.setItem('hubert-modules', JSON.stringify(modules))
    }
  }, [modules])

  const fetchReadings = async () => {
    if (!selectedModule) return
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/readings?week=${selectedWeek}&module=${selectedModule.id}`)
      const data = await response.json()
      setReadings(data.readings || [])
    } catch (err) {
      console.error('Failed to fetch readings:', err)
      setReadings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedModule) {
      fetchReadings()
    }
  }, [selectedWeek, selectedModule])

  const handleAddModule = (name: string) => {
    const newModule: Module = {
      id: Date.now().toString(),
      name,
      color: MODULE_COLORS[modules.length % MODULE_COLORS.length],
    }
    setModules([...modules, newModule])
    setSelectedModule(newModule)
  }

  const handleDeleteModule = (id: string) => {
    const updated = modules.filter((m) => m.id !== id)
    setModules(updated)
    if (selectedModule?.id === id) {
      setSelectedModule(updated[0] || null)
    }
    if (updated.length === 0) {
      localStorage.removeItem('hubert-modules')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}/api/readings/${id}`, { method: 'DELETE' })
      setReadings(readings.filter((r) => r.id !== id))
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        modules={modules}
        selectedModule={selectedModule}
        onSelectModule={setSelectedModule}
        onAddModule={handleAddModule}
        onDeleteModule={handleDeleteModule}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-[var(--color-parchment)] border-b border-[var(--color-ink-muted)]/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-[var(--color-parchment-dark)] transition-colors"
            >
              <svg className="w-6 h-6 text-[var(--color-ink)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="font-display text-lg font-semibold text-[var(--color-ink)]">
              {selectedModule?.name || 'Study with Hubert'}
            </h1>
          </div>
        </div>

        <div className="py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header - Desktop */}
            <header className="hidden lg:block text-center mb-12 animate-fade-in-up">
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="w-12 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent"></span>
                <svg className="w-6 h-6 text-[var(--color-gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="w-12 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent"></span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[var(--color-ink)] tracking-tight mb-3">
                Study with Hubert
              </h1>

              <p className="font-body text-[var(--color-ink-muted)] text-lg max-w-md mx-auto">
                Transform your readings into structured arguments, evidence, and historical insights
              </p>

              <div className="mt-6 flex justify-center">
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-[var(--color-ink-muted)] to-transparent opacity-30"></div>
              </div>
            </header>

            {/* No Module Selected State */}
            {!selectedModule ? (
              <div className="card-paper rounded-xl p-12 text-center animate-fade-in-up">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-parchment-dark)] mb-6">
                  <svg className="w-10 h-10 text-[var(--color-ink-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="font-display text-2xl text-[var(--color-ink)] mb-3">Welcome to Hubert</h2>
                <p className="text-[var(--color-ink-muted)] max-w-sm mx-auto mb-6">
                  Get started by adding your first module. Each module represents a course or subject you're studying.
                </p>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-burgundy)] text-white font-medium
                    hover:bg-[var(--color-burgundy-light)] transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Add Your First Module
                </button>
              </div>
            ) : (
              <>
                {/* Module Header */}
                <div className="mb-8 animate-fade-in-up">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: selectedModule.color }}
                    />
                    <h2 className="font-display text-2xl font-semibold text-[var(--color-ink)]">
                      {selectedModule.name}
                    </h2>
                  </div>
                  <p className="text-[var(--color-ink-muted)] text-sm">
                    Select a week and upload your readings to get started
                  </p>
                </div>

                {/* Week Selection */}
                <section className="mb-10 animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="font-display text-lg font-medium text-[var(--color-ink)]">
                      Select Week
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-[var(--color-ink-muted)] to-transparent opacity-20"></div>
                  </div>
                  <WeekSelector selectedWeek={selectedWeek} onSelectWeek={setSelectedWeek} />
                </section>

                {/* Upload Section */}
                <section className="mb-12 animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="font-display text-lg font-medium text-[var(--color-ink)]">
                      Add Reading
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-[var(--color-ink-muted)] to-transparent opacity-20"></div>
                  </div>
                  <FileUpload week={selectedWeek} onUploadComplete={fetchReadings} />
                </section>

                {/* Readings Display */}
                <section className="animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <h3 className="font-display text-lg font-medium text-[var(--color-ink)]">
                        Week {selectedWeek} Readings
                      </h3>
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--color-burgundy)] text-white text-sm font-medium">
                        {readings.length}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--color-ink-muted)] to-transparent opacity-20"></div>
                  </div>

                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="card-paper rounded-lg p-8">
                          <div className="shimmer h-6 w-2/3 rounded mb-4"></div>
                          <div className="shimmer h-4 w-full rounded mb-2"></div>
                          <div className="shimmer h-4 w-5/6 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : readings.length === 0 ? (
                    <div className="card-paper rounded-lg p-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-parchment-dark)] mb-4">
                        <svg className="w-8 h-8 text-[var(--color-ink-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h3 className="font-display text-xl text-[var(--color-ink)] mb-2">No readings yet</h3>
                      <p className="text-[var(--color-ink-muted)] max-w-sm mx-auto">
                        Upload a PDF above to analyze your first reading for Week {selectedWeek}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {readings.map((reading, index) => (
                        <div
                          key={reading.id}
                          className="animate-scale-in"
                          style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
                        >
                          <ReadingCard reading={reading} onDelete={handleDelete} />
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}

            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-[var(--color-ink-muted)]/10 text-center">
              <p className="text-sm text-[var(--color-ink-muted)]">
                <span className="font-display italic">Study with Hubert</span> — Your Academic Companion
              </p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  )
}
