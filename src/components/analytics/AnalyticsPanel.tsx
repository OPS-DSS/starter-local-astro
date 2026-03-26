import { useState } from 'react'
import { AnalyticsDualChart } from './AnalyticsDualChart'
import {
  EDUCATION_INDICATORS,
  type EducationIndicatorKey,
} from './educationIndicators'
import type { AnalyticsDataRow } from '@/lib/parquet'

interface AnalyticsPanelProps {
  data: AnalyticsDataRow[]
  csvPath?: string
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DataTable({ data }: { data: AnalyticsDataRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-3 py-2">Año</th>
            <th className="px-3 py-2 text-right">
              Suicidio
              <br />
              (×100k)
            </th>
            <th className="px-3 py-2 text-right">
              Deserción
              <br />
              (%)
            </th>
            <th className="px-3 py-2 text-right">Cob. Bruta</th>
            <th className="px-3 py-2 text-right">Cob. Neta</th>
            <th className="px-3 py-2 text-right">Aprobación</th>
            <th className="px-3 py-2 text-right">Reprobación</th>
            <th className="px-3 py-2 text-right">Repitencia</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row) => (
            <tr
              key={row.anio}
              className="bg-white hover:bg-gray-50 transition-colors"
            >
              <td className="px-3 py-2 font-medium text-gray-900">
                {row.anio}
              </td>
              <td className="px-3 py-2 text-right text-gray-700">
                {Number.isFinite(row.valor) ? row.valor.toFixed(2) : '—'}
              </td>
              <td className="px-3 py-2 text-right text-gray-700">
                {Number.isFinite(row.desercion)
                  ? row.desercion.toFixed(2)
                  : '—'}
              </td>
              <td className="px-3 py-2 text-right text-gray-700">
                {Number.isFinite(row.cobertura_bruta)
                  ? row.cobertura_bruta.toFixed(2)
                  : '—'}
              </td>
              <td className="px-3 py-2 text-right text-gray-700">
                {Number.isFinite(row.cobertura_neta)
                  ? row.cobertura_neta.toFixed(2)
                  : '—'}
              </td>
              <td className="px-3 py-2 text-right text-gray-700">
                {Number.isFinite(row.aprobacion)
                  ? row.aprobacion.toFixed(2)
                  : '—'}
              </td>
              <td className="px-3 py-2 text-right text-gray-700">
                {Number.isFinite(row.reprobacion)
                  ? row.reprobacion.toFixed(2)
                  : '—'}
              </td>
              <td className="px-3 py-2 text-right text-gray-700">
                {Number.isFinite(row.repitencia)
                  ? row.repitencia.toFixed(2)
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Main panel ────────────────────────────────────────────────────────────────

export const AnalyticsPanel = ({ data, csvPath }: AnalyticsPanelProps) => {
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const [selectedIndicator, setSelectedIndicator] =
    useState<EducationIndicatorKey>('desercion')

  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 italic py-8 text-center">
        No hay datos disponibles.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      {/* ── Indicator selector ── */}
      <section className="flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-600">
          Indicador de educación
        </p>
        <div className="flex flex-wrap gap-2">
          {(
            Object.entries(EDUCATION_INDICATORS) as [
              EducationIndicatorKey,
              (typeof EDUCATION_INDICATORS)[EducationIndicatorKey],
            ][]
          ).map(([key, meta]) => (
            <button
              key={key}
              type="button"
              aria-pressed={selectedIndicator === key}
              onClick={() => setSelectedIndicator(key)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                selectedIndicator === key
                  ? 'border-transparent text-white'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
              style={
                selectedIndicator === key
                  ? { backgroundColor: meta.color }
                  : {}
              }
            >
              {meta.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Temporal trends chart ── */}
      <section className="flex flex-col gap-4">
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

        {view === 'chart' ? (
          <AnalyticsDualChart data={data} selectedIndicator={selectedIndicator} />
        ) : (
          <DataTable data={data} />
        )}
      </section>
    </div>
  )
}
