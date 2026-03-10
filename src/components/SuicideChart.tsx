import { DSLineChart } from '@ops-dss/charts/line-chart'

interface DataPoint {
  anio: number
  [key: string]: number | string
}

interface SuicideChartProps {
  data: DataPoint[]
}

const COLOR_MAP: Record<string, string> = {
  Masculino: '#3b82f6',
  masculino: '#3b82f6',
  Femenino:  '#ec4899',
  femenino:  '#ec4899',
  Total:     '#6b7280',
  total:     '#6b7280',
}

const FALLBACK_COLORS = ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444']

export const SuicideChart = ({ data }: SuicideChartProps) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 italic py-8 text-center">
        No hay datos disponibles.
      </p>
    )
  }

  const sexCategories = Array.from(
    new Set(data.flatMap(row => Object.keys(row).filter(k => k !== 'anio')))
  )

  const lines = sexCategories.map((category, i) => ({
    dataKey: category,
    name:    category,
    color:   COLOR_MAP[category] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
  }))

  return (
    <div style={{ width: '100%', margin: '0 auto' }}>
      <DSLineChart
        data={data}
        xAxisKey="anio"
        lines={lines}
        height={400}
      />
    </div>
  )
}
