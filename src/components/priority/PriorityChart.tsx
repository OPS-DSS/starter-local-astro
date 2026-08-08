import { useState, useMemo } from 'react'
import { DSLineChart } from '@ops-dss/charts/line-chart'
import type { PriorityRow } from '@/lib/parquet'
import { ExpandablePanel } from '@/components/ExpandablePanel'
import { Icon } from '@iconify/react'
import { app } from '@/config/general'
import type { IndicatorMeta } from '@/config/general'

// ── Stratifier type ───────────────────────────────────────────────────────────
export type Stratifier = 'total' | 'etnia' | 'zona'

const TOTAL_LABEL = 'Total'
const DEFAULT_COLOR = '#6b7280'

// ── Data pivot ────────────────────────────────────────────────────────────────

function pivotData(
  rows: PriorityRow[],
  stratifier: Stratifier,
  priority: IndicatorMeta,
) {
  const scheme = priority.scheme ?? []
  const zonaColumn = scheme.find((c) => c.name === 'zona')
  const etniaColumn = scheme.find((c) => c.name === 'etnia')

  // Sentinel values marking aggregate (unstratified) rows for each column.
  const totalZona = zonaColumn?.aggregate ?? TOTAL_LABEL
  const totalEtnia = etniaColumn?.aggregate ?? TOTAL_LABEL

  // Only municipality-level aggregates
  const smvRows = rows.filter((r) => r.territorio === app.local)

  let filtered: PriorityRow[]

  if (stratifier === 'total') {
    filtered = smvRows.filter(
      (r) => r.etnia === totalEtnia && r.zona === totalZona,
    )
  } else if (stratifier === 'etnia') {
    filtered = smvRows.filter(
      (r) => r.zona === totalZona && r.etnia !== totalEtnia,
    )
  } else {
    filtered = smvRows.filter(
      (r) => r.etnia === totalEtnia && r.zona !== totalZona,
    )
  }

  const byYear = new Map<number, Record<string, number>>()
  const keySet = new Set<string>()

  for (const row of filtered) {
    const key =
      stratifier === 'total'
        ? app.local
        : String(stratifier === 'etnia' ? row.etnia : row.zona)

    keySet.add(key)
    if (!byYear.has(row.anio)) byYear.set(row.anio, {})
    byYear.get(row.anio)![key] = row.valor
  }

  const chartData = Array.from(byYear.entries())
    .sort(([a], [b]) => a - b)
    .map(([anio, vals]) => ({ anio, ...vals }))

  // Value order and colors come from the active stratifier column's config.
  const activeColumn =
    stratifier === 'zona'
      ? zonaColumn
      : stratifier === 'etnia'
        ? etniaColumn
        : undefined
  const orderArray = activeColumn?.values ?? null
  const colors = activeColumn?.colors ?? {}

  const keys = Array.from(keySet).sort((a, b) => {
    if (orderArray) return orderArray.indexOf(a) - orderArray.indexOf(b)
    return a.localeCompare(b, 'es')
  })

  const lines = keys.map((key) => ({
    dataKey: key,
    name: key,
    color:
      stratifier === 'total'
        ? (priority.totalColor ?? DEFAULT_COLOR)
        : (colors[key] ?? DEFAULT_COLOR),
  }))

  return { chartData, lines, keys }
}

// ── Component ─────────────────────────────────────────────────────────────────

interface PriorityChartProps {
  data: PriorityRow[]
  priority: IndicatorMeta
  csvPath?: string
  highlightYear?: number
  stratifier: Stratifier
  onStratifierChange: (s: Stratifier) => void
}

export const PriorityChart = ({
  data,
  priority,
  csvPath,
  highlightYear,
  stratifier,
  onStratifierChange: setStratifier,
}: PriorityChartProps) => {
  const [view, setView] = useState<'chart' | 'table'>('chart')

  const { chartData, lines, keys } = useMemo(
    () => pivotData(data, stratifier, priority),
    [data, stratifier, priority],
  )

  // 'total' (no stratification) is always available; other options come from config.
  const stratifierOptions: { value: Stratifier; label: string }[] = [
    { value: 'total', label: TOTAL_LABEL },
    ...((priority.stratifiers ?? []) as Stratifier[]).map((s) => ({
      value: s,
      label: s.charAt(0).toUpperCase() + s.slice(1),
    })),
  ]

  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 italic py-8 text-center">
        No hay datos disponibles.
      </p>
    )
  }

  return (
    <div style={{ width: '100%', margin: '0 auto' }}>
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
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

          {/* ── Stratifier selector ──────────────────────────────────────────────── */}
          <div className="flex rounded-lg overflow-hidden border border-gray-200 text-sm">
            {stratifierOptions.map(({ value, label }) => (
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

          <div className="flex items-center gap-2">
            {csvPath && (
              <a
                href={csvPath}
                download
                className="flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Icon icon="mdi:download" className="size-4 opacity-50" />
                Descargar tabla
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Chart or Table ─────────────────────────────────────────────────── */}
      {view === 'chart' ? (
        <ExpandablePanel className="relative border rounded-lg px-4 pt-6">
          {(isFullscreen) => (
            <div>
              <DSLineChart
                data={chartData}
                xAxisKey="anio"
                lines={lines}
                height={
                  isFullscreen ? Math.max(300, window.innerHeight - 200) : 400
                }
                xAxisLabel="Año"
                yAxisLabel="Tasa (×100.000 NV)"
                yAxisDomain={[0, 100]}
                highlightX={highlightYear}
              />
            </div>
          )}
        </ExpandablePanel>
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
