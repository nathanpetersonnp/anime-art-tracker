'use client'

import { useState, useEffect, ReactNode } from 'react'

interface Link {
  name: string
  url: string
  icon: string
}

interface Suggestion {
  query: string
  links: Link[]
}

interface ReferencesData {
  skillLevel?: string
  suggestions: Suggestion[]
  weakestAreas?: string[]
  message?: string
  queries?: string[]
}

export default function ReferenceGrid() {
  const [data, setData] = useState<ReferencesData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/references')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const iconMap: Record<string, ReactNode> = {
    pinterest: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
      </svg>
    ),
    deviantart: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 6h6l2-4h4v4l-3.5 7H18v5h-6l-2 4H6v-4l3.5-7H6V6z"/>
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    artstation: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0zm24-3.235-3.927-6.803a2.439 2.439 0 0 0-2.125-1.236H9.032l7.944 13.753 4.897-3.28a2.435 2.435 0 0 0 2.127-2.434zM9.532 15.614l-5.217-9.035c-.48.322-.868.755-1.137 1.249L.17 14.777l9.362 5.672 2.117-3.668-2.117-1.167z"/>
      </svg>
    )
  }

  if (data.message && data.queries) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Reference Suggestions</h2>
        <p className="text-gray-600 mb-4">{data.message}</p>
        <div className="space-y-3">
          {data.queries.map((query, i) => (
            <a
              key={i}
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-indigo-600">{query}</span>
            </a>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Reference Suggestions</h2>
          <p className="text-sm text-gray-500 mt-1">
            Based on your {data.skillLevel} level
          </p>
        </div>
        {data.weakestAreas && (
          <div className="text-right">
            <p className="text-xs text-gray-500">Focus areas:</p>
            <div className="flex flex-wrap gap-1 justify-end mt-1">
              {data.weakestAreas.map((area, i) => (
                <span key={i} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {data.suggestions?.map((suggestion, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900 mb-3">{suggestion.query}</p>
            <div className="flex flex-wrap gap-2">
              {suggestion.links.map((link, j) => (
                <a
                  key={j}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-colors"
                >
                  <span className="text-gray-500">{iconMap[link.icon]}</span>
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
