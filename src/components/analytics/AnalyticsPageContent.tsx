import { useState, useEffect } from 'react'
import { DSForestPlot } from '@ops-dss/charts/forest-plot'
import { DSScatterChart } from '@ops-dss/charts/scatter-chart'
import { DSChoroplethMap } from '@ops-dss/charts/choropleth-map'
import { AnalyticsDualChart } from './AnalyticsDualChart'
import {
  ANALYTICS_INDICATORS,
  type AnalyticsIndicatorKey,
} from './educationIndicators'
import type {
  ForestPlotDataRow,
  AnalyticsMaternalRow,
  ScatterMaternalRow,
} from '@/lib/parquet'

// ── Types ─────────────────────────────────────────────────────────────────────

type TableRow = { name: string; value: number | null }

interface AnalyticsPageContentProps {
  forestPlotData?: ForestPlotDataRow[]
  analyticsMaternalData?: AnalyticsMaternalRow[]
  scatterMaternalData?: ScatterMaternalRow[]
  smvGeojsonUrl?: string
  csvUrl?: string
}

// ── Main component ────────────────────────────────────────────────────────────

export const AnalyticsPageContent = ({
  forestPlotData,
  analyticsMaternalData,
  scatterMaternalData,
  smvGeojsonUrl,
  csvUrl,
}: AnalyticsPageContentProps) => {
  // Shared indicator — drives forest plot, charts
  const [selectedIndicator, setSelectedIndicator] =
    useState<AnalyticsIndicatorKey>('desercion')

  // Map-specific state
  const [view, setView] = useState<'map' | 'table'>('map')
  const [tableData, setTableData] = useState<TableRow[]>([])
  const [tableLoading, setTableLoading] = useState(false)

  // ── Analytics panel derived values ────────────────────────────────────────

  const hasData =
    (forestPlotData && forestPlotData.length > 0) ||
    (analyticsMaternalData && analyticsMaternalData.length > 0) ||
    (scatterMaternalData && scatterMaternalData.length > 0)

  const selectedMeta = ANALYTICS_INDICATORS[selectedIndicator]

  const lastYear =
    scatterMaternalData && scatterMaternalData.length > 0
      ? Math.max(...scatterMaternalData.map((r) => r.anio))
      : null

  const scatterPoints =
    scatterMaternalData && lastYear !== null
      ? scatterMaternalData
          .filter((r) => r.anio === lastYear)
          .map((r) => ({
            x: r[selectedIndicator] as number,
            y: r.valor,
            label: r.territorio,
            size: r.nacimientos,
          }))
          .filter((d) => Number.isFinite(d.x) && Number.isFinite(d.y))
      : []

  // ── Map handlers ───────────────────────────────────────────────────────────

  const fetchTableData = (url: string) => {
    setTableLoading(true)
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((geojson) => {
        const rows: TableRow[] = (geojson.features ?? [])
          .map(
            (f: {
              properties: { NAME_2?: string; mock_value?: number }
            }) => ({
              name: f.properties.NAME_2 ?? '',
              value: f.properties.mock_value ?? null,
            }),
          )
          .sort((a: TableRow, b: TableRow) => a.name.localeCompare(b.name))
        setTableData(rows)
        setTableLoading(false)
      })
      .catch(() => setTableLoading(false))
  }

  // Fetch table data whenever the view switches to 'table' or the URL changes.
  // fetchTableData closes only over stable state setters and is intentionally
  // omitted from the dep array to avoid a stale-closure warning.
  useEffect(() => {
    if (view === 'table' && smvGeojsonUrl) {
      fetchTableData(smvGeojsonUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, smvGeojsonUrl])

  const handleViewChange = (nextView: 'map' | 'table') => {
    setView(nextView)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!hasData) {
    return (
      <p className="text-gray-500 italic py-8 text-center">
        No hay datos disponibles.
      </p>
    )
  }

  return (
    <div className="flex flex-row gap-4 mb-10">
      <div className="flex flex-col basis-1/3 flex-1 gap-4">
        {/* ── Forest plot ── */}
        {forestPlotData && forestPlotData.length > 0 && (
          <section className="border rounded-lg p-4">
            <h2 className="text-xl font-bold text-gray-900">
              Correlaciones con mortalidad materna
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Correlación de Spearman entre cada indicador educativo y la
              mortalidad materna (municipios de San Martin del Valle, último año
              disponible). Haz clic en un indicador para explorar su relación.
            </p>
            <DSForestPlot
              data={forestPlotData}
              selectedIndicator={selectedIndicator}
              onSelectIndicator={(ind) =>
                setSelectedIndicator(ind as AnalyticsIndicatorKey)
              }
            />
          </section>
        )}

        {/* ── Temporal trends ── */}
        {analyticsMaternalData && analyticsMaternalData.length > 0 && (
          <section className="flex flex-col gap-4 border rounded-lg p-4">
            <AnalyticsDualChart
              data={analyticsMaternalData}
              selectedIndicator={selectedIndicator}
            />
          </section>
        )}
      </div>

      <div className="flex flex-col basis-2/3 gap-4 flex-1 h-screen">
        {/* ── Scatter chart ── */}
        {scatterPoints.length > 0 && (
          <section className="flex flex-col gap-4 border rounded-lg p-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Dispersión:{' '}
                <span style={{ color: selectedMeta.color }}>
                  {selectedMeta.label}
                </span>{' '}
                vs mortalidad materna
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Cada punto es un municipio de San Martin del Valle (último año
                disponible). El tamaño refleja el número de nacidos vivos. La
                línea punteada muestra la tendencia lineal.
              </p>
            </div>
            <DSScatterChart
              data={scatterPoints}
              xLabel={selectedMeta.label}
              yLabel="Mortalidad materna (×100k NV)"
              width={800}
            />
          </section>
        )}

        {/* ── Municipalities map ── */}
        <section className="flex flex-col gap-4 border rounded-lg p-4">
          {/* Controls bar */}
          <div className="flex items-center justify-end gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg overflow-hidden border border-gray-200 text-sm">
                <button
                  onClick={() => handleViewChange('map')}
                  className={`px-4 py-1.5 transition-colors ${
                    view === 'map'
                      ? 'bg-gray-800 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Mapa
                </button>
                <button
                  onClick={() => handleViewChange('table')}
                  className={`px-4 py-1.5 transition-colors ${
                    view === 'table'
                      ? 'bg-gray-800 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Tabla
                </button>
              </div>

              {csvUrl && (
                <a
                  href={csvUrl}
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
                  Descargar Tabla
                </a>
              )}
            </div>
          </div>

          {/* Map view */}
          {view === 'map' && (
            <>
              <DSChoroplethMap
                geojsonUrl={smvGeojsonUrl}
                center={[2.3, -75.7]}
                zoom={8}
                height="30em"
                nameProperty="NAME_2"
                valueProperty="mock_value"
                valueName="Valor indicador"
                secondaryValueProperty="tipo_zona"
                secondaryValueName="Tipo de zona"
              />

              {/* Legend */}
              <div className="flex flex-col gap-2 text-sm">
                <span className="font-medium text-gray-700">Leyenda:</span>
                <div className="flex flex-wrap gap-x-6 gap-y-2 items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs w-28 shrink-0">
                      Valor indicador
                    </span>
                    <span className="text-gray-600 text-xs">Menor</span>
                    <div
                      style={{
                        width: 120,
                        height: 14,
                        background:
                          'linear-gradient(to right, #FFFFB2, #FECC5C, #FD8D3C, #F03B20, #BD0026)',
                        border: '1px solid #9ca3af',
                        borderRadius: 3,
                      }}
                    />
                    <span className="text-gray-600 text-xs">Mayor</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        background: '#CCCCCC',
                        border: '1px solid #9ca3af',
                        borderRadius: 3,
                        flexShrink: 0,
                      }}
                    />
                    <span className="text-gray-600 text-xs">Sin datos</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs">
                  Haz clic en un barrio para ver su tipo de zona (Urbano
                  central · Periurbano · Rural).
                </p>
              </div>
            </>
          )}

          {/* Table view */}
          {view === 'table' &&
            (tableLoading ? (
              <p className="text-gray-500 italic py-8 text-center">
                Cargando datos…
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 font-medium">Barrio</th>
                      <th className="px-4 py-3 font-medium">
                        Valor indicador
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tableData.map((row) => (
                      <tr
                        key={row.name}
                        className="bg-white hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {row.name}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {row.value != null && Number.isFinite(row.value)
                            ? row.value.toFixed(2)
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
        </section>
      </div>
    </div>
  )
}
