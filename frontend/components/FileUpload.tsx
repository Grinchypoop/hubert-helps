'use client'

import { useState, useRef } from 'react'

interface FileUploadProps {
  week: number
  onUploadComplete: () => void
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function FileUpload({ week, onUploadComplete }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file')
      return
    }

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(`${API_URL}/api/upload?week=${week}`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Upload failed')
      }

      onUploadComplete()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  return (
    <div className="space-y-3">
      <div
        className={`
          card-paper rounded-lg cursor-pointer
          transition-all duration-300 ease-out
          ${dragOver
            ? 'border-2 border-dashed border-[var(--color-burgundy)] bg-[var(--color-burgundy)]/5 scale-[1.01]'
            : 'border border-dashed border-[var(--color-ink-muted)]/30 hover:border-[var(--color-burgundy)]/40'
          }
          ${uploading ? 'opacity-70 pointer-events-none' : ''}
        `}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="p-8 sm:p-10 text-center">
          {uploading ? (
            <div className="space-y-4">
              {/* Animated book icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-burgundy)]/10">
                <svg
                  className="w-8 h-8 text-[var(--color-burgundy)] animate-pulse"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div>
                <p className="font-display text-lg text-[var(--color-ink)]">
                  Analyzing your reading...
                </p>
                <p className="text-sm text-[var(--color-ink-muted)] mt-1">
                  Extracting thesis, arguments, and evidence
                </p>
              </div>

              {/* Progress bar */}
              <div className="max-w-xs mx-auto">
                <div className="h-1 bg-[var(--color-parchment-dark)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-burgundy)] rounded-full shimmer w-2/3"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Upload icon */}
              <div
                className={`
                  inline-flex items-center justify-center w-16 h-16 rounded-full
                  transition-all duration-300
                  ${dragOver
                    ? 'bg-[var(--color-burgundy)]/20 scale-110'
                    : 'bg-[var(--color-parchment-dark)]'
                  }
                `}
              >
                <svg
                  className={`
                    w-8 h-8 transition-colors duration-300
                    ${dragOver ? 'text-[var(--color-burgundy)]' : 'text-[var(--color-ink-muted)]'}
                  `}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div>
                <p className="font-display text-lg text-[var(--color-ink)]">
                  {dragOver ? 'Release to upload' : 'Drop your PDF here'}
                </p>
                <p className="text-sm text-[var(--color-ink-muted)] mt-1">
                  or <span className="text-[var(--color-burgundy)] font-medium hover:underline">browse</span> to select a file
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-[var(--color-ink-muted)]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Week {week} Reading</span>
                <span className="mx-1">·</span>
                <span>PDF format</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 animate-fade-in">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  )
}
