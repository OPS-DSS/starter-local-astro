import { useState, useMemo, useRef } from 'react'
import { DSLineChart } from '@ops-dss/charts/line-chart'
import type { MaternalMortalityRateRow } from '@/lib/parquet'
import { downloadChartImage } from '@/lib/downloadChartImage'

// ── Aggregate label constants (must match R mock script) ──────────────────────
const TOTAL_EDAD = 'Todas las edades'
const TOTAL_ZONA = 'Total'
const SMV = 'San Martín del Valle'

// ── Stratifier type ───────────────────────────────────────────────────────────
type Stratifier = 'total' | 'grupo_edad' | 'zona'

// ── Colour palettes ───────────────────────────────────────────────────────────
const AGE_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#14b8a6',
]
const ZONA_COLORS: Record<string, string> = {
  urbano: '#22c55e',
  periurbano: '#f59e0b',
  rural: '#ef4444',
}

// Explicit ordering for consistent legend/table display across renders
const ZONA_ORDER = ['urbano', 'periurbano', 'rural']
const AGE_ORDER = ['10-14', '15-19', '20-34', '35-49']
const TOTAL_COLOR = '#6b7280'

// ── Icons ─────────────────────────────────────────────────────────────────────
const DownloadIcon = () => (
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
)

const ImageIcon = () => (
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
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
)

// ── Data pivot ────────────────────────────────────────────────────────────────

function pivotData(rows: MaternalMortalityRateRow[], stratifier: Stratifier) {
  // Only municipality-level aggregates
  const smvRows = rows.filter((r) => r.territorio === SMV)

  let filtered: MaternalMortalityRateRow[]

  if (stratifier === 'total') {
    filtered = smvRows.filter(
      (r) => r.grupo_edad === TOTAL_EDAD && r.zona === TOTAL_ZONA,
    )
  } else if (stratifier === 'grupo_edad') {
    filtered = smvRows.filter(
      (r) => r.zona === TOTAL_ZONA && r.grupo_edad !== TOTAL_EDAD,
    )
  } else {
    filtered = smvRows.filter(
      (r) => r.grupo_edad === TOTAL_EDAD && r.zona !== TOTAL_ZONA,
    )
  }

  const byYear = new Map<number, Record<string, number>>()
  const keySet = new Set<string>()

  for (const row of filtered) {
    const key =
      stratifier === 'total'
        ? SMV
        : stratifier === 'grupo_edad'
          ? row.grupo_edad
          : row.zona

    keySet.add(key)
    if (!byYear.has(row.anio)) byYear.set(row.anio, {})
    byYear.get(row.anio)![key] = row.valor
  }

  const chartData = Array.from(byYear.entries())
    .sort(([a], [b]) => a - b)
    .map(([anio, vals]) => ({ anio, ...vals }))

  const orderArray =
    stratifier === 'zona'
      ? ZONA_ORDER
      : stratifier === 'grupo_edad'
        ? AGE_ORDER
        : null

  const keys = Array.from(keySet).sort((a, b) => {
    if (orderArray) return orderArray.indexOf(a) - orderArray.indexOf(b)
    return a.localeCompare(b, 'es')
  })

  const lines = keys.map((key, i) => ({
    dataKey: key,
    name: key,
    color:
      stratifier === 'total'
        ? TOTAL_COLOR
        : stratifier === 'zona'
          ? (ZONA_COLORS[key] ?? AGE_COLORS[i % AGE_COLORS.length])
          : AGE_COLORS[i % AGE_COLORS.length],
  }))

  return { chartData, lines, keys }
}

// ── Component ─────────────────────────────────────────────────────────────────

interface MaternalMortalityChartProps {
  data: MaternalMortalityRateRow[]
  csvPath?: string
}

const STRATIFIER_OPTIONS: { value: Stratifier; label: string }[] = [
  { value: 'total', label: 'Total' },
  { value: 'grupo_edad', label: 'Grupo de Edad' },
  { value: 'zona', label: 'Zona' },
]

export const MaternalMortalityChart = ({
  data,
  csvPath,
}: MaternalMortalityChartProps) => {
  const [stratifier, setStratifier] = useState<Stratifier>('total')
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const chartRef = useRef<HTMLDivElement>(null)

  const { chartData, lines, keys } = useMemo(
    () => pivotData(data, stratifier),
    [data, stratifier],
  )

  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 italic py-8 text-center">
        No hay datos disponibles.
      </p>
    )
  }

  return (
    <div style={{ width: '100%', margin: '0 auto' }}>
      {/* ── Stratifier selector ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-600 font-medium">Ver por:</span>
          <div className="flex rounded-lg overflow-hidden border border-gray-200 text-sm">
            {STRATIFIER_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setStratifier(value)}
                className={`px-4 py-1.5 transition-colors ${
                  stratifier === value
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── View toggle + download ──────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex rounded-lg overflow-hidden border border-gray-200 text-sm">
            <button
              type="button"
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
              type="button"
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

          <div className="flex items-center gap-2">
            {view === 'chart' && (
              <button
                type="button"
                onClick={() => downloadChartImage(chartRef.current, 'grafico')}
                className="flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ImageIcon />
                Descargar imagen
              </button>
            )}
            {csvPath && (
              <a
                href={csvPath}
                download
                className="flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <DownloadIcon />
                Descargar tabla
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Context label ──────────────────────────────────────────────────── */}
      <p className="text-xs text-gray-500 mb-3">
        {stratifier === 'total' && (
          <>Mostrando la tasa de mortalidad materna total para San Martín del Valle.</>
        )}
        {stratifier === 'grupo_edad' && (
          <>
            Mostrando por <strong>grupo de edad</strong> · todas las zonas.
          </>
        )}
        {stratifier === 'zona' && (
          <>
            Mostrando por <strong>zona</strong> · todas las edades.
          </>
        )}
      </p>

      {/* ── Chart or Table ─────────────────────────────────────────────────── */}
      {view === 'chart' ? (
        <div ref={chartRef}>
          <DSLineChart
            data={chartData}
            xAxisKey="anio"
            lines={lines}
            height={400}
            xAxisLabel="Año"
            yAxisLabel="Tasa (×100.000 NV)"
          />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 font-medium">Año</th>
                {keys.map((k) => (
                  <th key={k} className="px-4 py-3 font-medium">
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {chartData.map((row) => (
                <tr
                  key={row.anio}
                  className="bg-white hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {row.anio}
                  </td>
                  {keys.map((k) => {
                    const value = (row as Record<string, unknown>)[k]
                    return (
                      <td key={k} className="px-4 py-3 text-gray-600">
                        {typeof value === 'number' ? value.toFixed(1) : '—'}
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
