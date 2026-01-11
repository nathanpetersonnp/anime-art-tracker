'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

interface DataPoint {
  date: string
  title: string
  lineQuality: number
  proportions: number
  shading: number
  composition: number
  styleConsistency: number
  average: number
}

interface Props {
  data: DataPoint[]
}

export default function ProgressChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-500">
        No progress data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#6b7280', fontSize: 12 }}
          tickFormatter={(value) => {
            const date = new Date(value)
            return `${date.getMonth() + 1}/${date.getDate()}`
          }}
        />
        <YAxis
          domain={[0, 10]}
          tick={{ fill: '#6b7280', fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}
          labelFormatter={(label) => {
            const point = data.find(d => d.date === label)
            return point ? `${point.title} (${label})` : label
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="average"
          name="Average"
          stroke="#6366f1"
          strokeWidth={3}
          dot={{ fill: '#6366f1', strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="lineQuality"
          name="Line Quality"
          stroke="#10b981"
          strokeWidth={1}
          dot={false}
          strokeDasharray="3 3"
        />
        <Line
          type="monotone"
          dataKey="proportions"
          name="Proportions"
          stroke="#f59e0b"
          strokeWidth={1}
          dot={false}
          strokeDasharray="3 3"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
