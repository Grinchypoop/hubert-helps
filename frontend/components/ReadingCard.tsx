'use client'

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
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{reading.title}</h3>
          <p className="text-sm text-gray-500">{reading.filename}</p>
        </div>
        <button
          onClick={() => onDelete(reading.id)}
          className="text-gray-400 hover:text-red-600 text-sm"
        >
          Delete
        </button>
      </div>

      <div>
        <h4 className="font-medium text-gray-700 mb-1">Thesis</h4>
        <p className="text-gray-600">{reading.thesis}</p>
      </div>

      {reading.supporting_arguments.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-1">Supporting Arguments</h4>
          <ul className="list-disc list-inside space-y-1">
            {reading.supporting_arguments.map((arg, i) => (
              <li key={i} className="text-gray-600">{arg}</li>
            ))}
          </ul>
        </div>
      )}

      {reading.evidence.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-1">Evidence</h4>
          <ul className="list-disc list-inside space-y-1">
            {reading.evidence.map((ev, i) => (
              <li key={i} className="text-gray-600">{ev}</li>
            ))}
          </ul>
        </div>
      )}

      {reading.historical_context && (
        <div>
          <h4 className="font-medium text-gray-700 mb-1">Historical Context</h4>
          <p className="text-gray-600">{reading.historical_context}</p>
        </div>
      )}

      {reading.historiography && (
        <div>
          <h4 className="font-medium text-gray-700 mb-1">Historiography</h4>
          <p className="text-gray-600">{reading.historiography}</p>
        </div>
      )}
    </div>
  )
}
