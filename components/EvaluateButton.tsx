'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  artworkId: string
}

export default function EvaluateButton({ artworkId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEvaluate = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artworkId })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Evaluation failed')
        return
      }

      router.refresh()
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <p className="text-red-600 text-sm mb-2">{error}</p>
      )}
      <button
        onClick={handleEvaluate}
        disabled={loading}
        className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Analyzing...
          </span>
        ) : (
          'Evaluate with AI'
        )}
      </button>
    </div>
  )
}
