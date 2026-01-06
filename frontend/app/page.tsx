'use client'

import { useState, useEffect } from 'react'
import WeekSelector from '@/components/WeekSelector'
import FileUpload from '@/components/FileUpload'
import ReadingCard from '@/components/ReadingCard'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [readings, setReadings] = useState<Reading[]>([])
  const [loading, setLoading] = useState(false)

  const fetchReadings = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/readings?week=${selectedWeek}`)
      const data = await response.json()
      setReadings(data.readings || [])
    } catch (err) {
      console.error('Failed to fetch readings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReadings()
  }, [selectedWeek])

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_URL}/api/readings/${id}`, { method: 'DELETE' })
      setReadings(readings.filter((r) => r.id !== id))
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">History Reading Analyzer</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-sm font-medium text-gray-700 mb-2">Select Week</h2>
          <WeekSelector selectedWeek={selectedWeek} onSelectWeek={setSelectedWeek} />
        </section>

        <section>
          <h2 className="text-sm font-medium text-gray-700 mb-2">Upload Reading</h2>
          <FileUpload week={selectedWeek} onUploadComplete={fetchReadings} />
        </section>

        <section>
          <h2 className="text-sm font-medium text-gray-700 mb-2">
            Week {selectedWeek} Readings ({readings.length})
          </h2>
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : readings.length === 0 ? (
            <div className="text-gray-500">No readings for this week yet.</div>
          ) : (
            <div className="space-y-4">
              {readings.map((reading) => (
                <ReadingCard key={reading.id} reading={reading} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
