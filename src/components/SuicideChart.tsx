import { useState } from 'react'
import { DSLineChart } from '@ops-dss/charts/line-chart'

interface DataPoint {
  anio: number
  [key: string]: number | string
}

interface SuicideChartProps {
  data: DataPoint[]
  csvPath?: string
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

export const SuicideChart = ({ data, csvPath }: SuicideChartProps) => {
  const [view, setView] = useState<'chart' | 'table'>('chart')

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
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <div className="flex rounded-lg overflow-hidden border border-gray-200 text-sm">
          <button
            onClick={() => setView('chart')}
            className={`px-4 py-1.5 transition-colors ${
              view === 'chart'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Gráfico
          </button>
          <button
            onClick={() => setView('table')}
            className={`px-4 py-1.5 transition-colors ${
              view === 'table'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Tabla
          </button>
        </div>

        {csvPath && (
          <a
            href={csvPath}
            download
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Descargar CSV
          </a>
        )}
      </div>

      {view === 'chart' ? (
        <DSLineChart
          data={data}
          xAxisKey="anio"
          lines={lines}
          height={400}
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 font-medium">Año</th>
                {sexCategories.map(cat => (
                  <th key={cat} className="px-4 py-3 font-medium">
                    {cat}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map(row => (
                <tr key={row.anio} className="bg-white hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{row.anio}</td>
                  {sexCategories.map(cat => {
                    const value = row[cat]

                    return (
                      <td key={cat} className="px-4 py-3 text-gray-600">
                        {typeof value === 'number' ? value.toFixed(2) : '0.00'}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
