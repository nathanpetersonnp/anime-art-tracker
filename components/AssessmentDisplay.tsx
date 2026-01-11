'use client'

interface Assessment {
  id: string
  overallLevel: string
  lineQuality: number
  proportions: number
  shading: number
  composition: number
  styleConsistency: number
  feedback: string
  suggestions: string
  createdAt: Date
}

interface Props {
  assessment: Assessment
}

function SkillBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{value}/10</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            value >= 8 ? 'bg-green-500' : value >= 5 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  )
}

export default function AssessmentDisplay({ assessment }: Props) {
  const levelColors = {
    advanced: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    beginner: 'bg-blue-100 text-blue-800 border-blue-200'
  }

  const levelColor = levelColors[assessment.overallLevel as keyof typeof levelColors] || levelColors.beginner

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Skill Assessment</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${levelColor}`}>
            {assessment.overallLevel.charAt(0).toUpperCase() + assessment.overallLevel.slice(1)}
          </span>
        </div>

        <div className="space-y-4">
          <SkillBar label="Line Quality" value={assessment.lineQuality} />
          <SkillBar label="Proportions" value={assessment.proportions} />
          <SkillBar label="Shading" value={assessment.shading} />
          <SkillBar label="Composition" value={assessment.composition} />
          <SkillBar label="Style Consistency" value={assessment.styleConsistency} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Feedback</h2>
        <p className="text-gray-600 whitespace-pre-wrap">{assessment.feedback}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Suggestions for Improvement</h2>
        <p className="text-gray-600 whitespace-pre-wrap">{assessment.suggestions}</p>
      </div>

      <p className="text-sm text-gray-400">
        Evaluated on {new Date(assessment.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
    </div>
  )
}
