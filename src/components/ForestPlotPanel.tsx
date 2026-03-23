import { useState, useMemo } from 'react'
import { DSForestPlot } from '@ops-dss/charts/forest-plot'
import type { ForestPlotDataRow } from '../lib/parquet'

interface ForestPlotPanelProps {
  data: ForestPlotDataRow[]
  csvPath?: string
}

export const ForestPlotPanel = ({ data, csvPath }: ForestPlotPanelProps) => {
  const [view, setView] = useState<'chart' | 'table'>('chart')

  const filteredData = useMemo(
    () => data.filter((d) => d.metrica === 'brecha_absoluta'),
    [data],
  )

  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 italic py-8 text-center">
        No hay datos disponibles.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Description ── */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Brecha Absoluta</h2>
        <p className="text-sm text-gray-600">
          Correlación de Spearman entre cada indicador de educación en Suaza y la
          brecha de género en mortalidad por suicidio. Los indicadores están
          ordenados de mayor a menor correlación en términos absolutos. Los puntos
          de color rojo indican correlación positiva y los azules correlación
          negativa; los colores saturados indican significancia estadística (p&lt;0.05).
        </p>
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
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

      {/* ── Content ── */}
      {view === 'chart' ? (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <DSForestPlot data={filteredData} showSignificance />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 font-medium">Indicador</th>
                <th className="px-4 py-3 font-medium text-right">ρ</th>
                <th className="px-4 py-3 font-medium text-right">IC 95% inferior</th>
                <th className="px-4 py-3 font-medium text-right">IC 95% superior</th>
                <th className="px-4 py-3 font-medium text-right">p-valor</th>
                <th className="px-4 py-3 font-medium text-right">n</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...filteredData]
                .sort((a, b) => Math.abs(b.correlacion) - Math.abs(a.correlacion))
                .map((row) => (
                  <tr
                    key={row.indicador}
                    className="bg-white hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-700">
                      {Number.isFinite(row.correlacion)
                        ? row.correlacion.toFixed(3)
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-600">
                      {Number.isFinite(row.ci_lower)
                        ? row.ci_lower.toFixed(3)
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-600">
                      {Number.isFinite(row.ci_upper)
                        ? row.ci_upper.toFixed(3)
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-600">
                      {Number.isFinite(row.p_value)
                        ? row.p_value < 0.001
                          ? '<0.001'
                          : row.p_value.toFixed(3)
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {row.n}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Footnote ── */}
      <p className="text-xs text-gray-400">
        IC: Intervalo de confianza al 95% (transformación z de Fisher sobre rho).
        Correlación de Spearman calculada sobre los años con datos completos para
        Suaza. Significancia: * p&lt;0.05 &nbsp;** p&lt;0.01 &nbsp;*** p&lt;0.001
      </p>
    </div>
  )
}
