'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts'

interface Props {
  scores: {
    lineQuality: number
    proportions: number
    shading: number
    composition: number
    styleConsistency: number
  }
}

export default function SkillChart({ scores }: Props) {
  const data = [
    { skill: 'Line Quality', value: scores.lineQuality, fullMark: 10 },
    { skill: 'Proportions', value: scores.proportions, fullMark: 10 },
    { skill: 'Shading', value: scores.shading, fullMark: 10 },
    { skill: 'Composition', value: scores.composition, fullMark: 10 },
    { skill: 'Style', value: scores.styleConsistency, fullMark: 10 }
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fill: '#6b7280', fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 10]}
          tick={{ fill: '#9ca3af', fontSize: 10 }}
        />
        <Radar
          name="Score"
          dataKey="value"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.3}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}
          formatter={(value) => [`${value}/10`, 'Score']}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
