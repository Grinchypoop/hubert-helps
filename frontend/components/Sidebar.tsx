'use client'

import { useState } from 'react'

export interface Module {
  id: string
  name: string
  color: string
}

interface SidebarProps {
  modules: Module[]
  selectedModule: Module | null
  onSelectModule: (module: Module) => void
  onAddModule: (name: string) => void
  onDeleteModule: (id: string) => void
  isOpen: boolean
  onToggle: () => void
}

const MODULE_COLORS = [
  '#722f37', // burgundy
  '#1e3a5f', // navy
  '#5a6b5a', // sage
  '#8b5a2b', // brown
  '#4a5568', // slate
  '#744210', // amber
  '#285e61', // teal
  '#702459', // pink
]

export default function Sidebar({
  modules,
  selectedModule,
  onSelectModule,
  onAddModule,
  onDeleteModule,
  isOpen,
  onToggle,
}: SidebarProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newModuleName, setNewModuleName] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleAddModule = () => {
    if (newModuleName.trim()) {
      onAddModule(newModuleName.trim())
      setNewModuleName('')
      setIsAdding(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddModule()
    if (e.key === 'Escape') {
      setIsAdding(false)
      setNewModuleName('')
    }
  }

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDeleteModule(id)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          w-72 bg-[var(--color-cream)] border-r border-[var(--color-ink-muted)]/10
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-0
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--color-ink-muted)]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-burgundy)] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-[var(--color-ink)]">Hubert</h2>
                <p className="text-xs text-[var(--color-ink-muted)]">Your Modules</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-parchment-dark)] transition-colors"
            >
              <svg className="w-5 h-5 text-[var(--color-ink-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Module List */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {modules.map((module) => (
              <div
                key={module.id}
                className={`
                  group relative rounded-lg transition-all duration-200
                  ${selectedModule?.id === module.id
                    ? 'bg-[var(--color-parchment-dark)]'
                    : 'hover:bg-[var(--color-parchment)]'
                  }
                `}
              >
                <button
                  onClick={() => onSelectModule(module)}
                  className="w-full flex items-center gap-3 p-3 text-left"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: module.color }}
                  />
                  <span
                    className={`
                      font-medium text-sm truncate flex-1
                      ${selectedModule?.id === module.id
                        ? 'text-[var(--color-ink)]'
                        : 'text-[var(--color-ink-light)]'
                      }
                    `}
                  >
                    {module.name}
                  </span>
                  {selectedModule?.id === module.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-burgundy)]" />
                  )}
                </button>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(module.id)
                  }}
                  className={`
                    absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md
                    transition-all duration-200
                    ${deleteConfirm === module.id
                      ? 'bg-red-500 text-white opacity-100'
                      : 'text-[var(--color-ink-muted)] opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500'
                    }
                  `}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}

            {modules.length === 0 && !isAdding && (
              <div className="text-center py-8 px-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-parchment-dark)] flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[var(--color-ink-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-sm text-[var(--color-ink-muted)]">No modules yet</p>
                <p className="text-xs text-[var(--color-ink-muted)]/70 mt-1">Add your first module below</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Module */}
        <div className="p-3 border-t border-[var(--color-ink-muted)]/10">
          {isAdding ? (
            <div className="space-y-2">
              <input
                type="text"
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Module name..."
                autoFocus
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-ink-muted)]/20
                  bg-white text-sm text-[var(--color-ink)]
                  placeholder:text-[var(--color-ink-muted)]
                  focus:outline-none focus:border-[var(--color-burgundy)] focus:ring-1 focus:ring-[var(--color-burgundy)]/20"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddModule}
                  disabled={!newModuleName.trim()}
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-burgundy)] text-white text-sm font-medium
                    hover:bg-[var(--color-burgundy-light)] disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors"
                >
                  Add Module
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false)
                    setNewModuleName('')
                  }}
                  className="px-3 py-2 rounded-lg text-sm text-[var(--color-ink-muted)] hover:bg-[var(--color-parchment-dark)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg
                border border-dashed border-[var(--color-ink-muted)]/30
                text-sm text-[var(--color-ink-muted)] font-medium
                hover:border-[var(--color-burgundy)]/40 hover:text-[var(--color-burgundy)] hover:bg-[var(--color-parchment)]
                transition-all duration-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Add Module
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
