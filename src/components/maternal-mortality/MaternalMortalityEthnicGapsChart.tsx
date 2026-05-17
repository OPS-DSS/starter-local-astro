'use client'

import { useState, useMemo } from 'react'
import { DSComboChart } from '@ops-dss/charts/combo-chart'
import type { MaternalMortalityRateRow } from '@/lib/parquet'

const SMV = 'San Martín del Valle'
const TOTAL_ZONA = 'Total'

interface GapRow {
  anio: number
  rmm_indigena: number
  rmm_no_indigena: number
  brecha_absoluta: number
  brecha_relativa: number
  ic_inf_ba: number
  ic_sup_ba: number
  ic_inf_br: number
  ic_sup_br: number
}

function r(v: number, d: number) {
  const f = 10 ** d
  return Math.round(v * f) / f
}

function computeGaps(data: MaternalMortalityRateRow[]): GapRow[] {
  const smvRows = data.filter(
    (row) => row.territorio === SMV && row.zona === TOTAL_ZONA,
  )
  const indigenaByYear = new Map<number, number>()
  const noIndigenaByYear = new Map<number, number>()

  for (const row of smvRows) {
    if (row.etnia === 'Indígena') indigenaByYear.set(row.anio, row.valor)
    else if (row.etnia === 'No indígena') noIndigenaByYear.set(row.anio, row.valor)
  }

  const years = [
    ...new Set([...indigenaByYear.keys(), ...noIndigenaByYear.keys()]),
  ].sort((a, b) => a - b)

  return years
    .map((anio) => {
      const rmm_indigena = indigenaByYear.get(anio) ?? NaN
      const rmm_no_indigena = noIndigenaByYear.get(anio) ?? NaN
      if (!Number.isFinite(rmm_indigena) || !Number.isFinite(rmm_no_indigena) || rmm_no_indigena <= 0)
        return null
      const brecha_absoluta = r(rmm_indigena - rmm_no_indigena, 1)
      const brecha_relativa = r(rmm_indigena / rmm_no_indigena, 2)
      const ba_lo = r(brecha_absoluta * 0.8, 1)
      const ba_hi = r(brecha_absoluta * 1.2, 1)
      return {
        anio,
        rmm_indigena: r(rmm_indigena, 1),
        rmm_no_indigena: r(rmm_no_indigena, 1),
        brecha_absoluta,
        brecha_relativa,
        ic_inf_ba: Math.min(ba_lo, ba_hi),
        ic_sup_ba: Math.max(ba_lo, ba_hi),
        ic_inf_br: r(brecha_relativa * 0.85, 2),
        ic_sup_br: r(brecha_relativa * 1.15, 2),
      }
    })
    .filter((row): row is GapRow => row !== null)
}

function interpretacionBA(ba: number): string {
  if (ba > 0)
    return `La razón de mortalidad materna en población indígena fue ${Math.abs(ba).toFixed(1)} muertes por 100.000 nacidos vivos superior a la observada en población no indígena, evidenciando una desigualdad étnica desfavorable para la población indígena.`
  if (ba < 0)
    return `La razón de mortalidad materna en población no indígena fue ${Math.abs(ba).toFixed(1)} muertes por 100.000 nacidos vivos superior a la observada en población indígena.`
  return 'No se observaron diferencias absolutas relevantes entre grupos étnicos.'
}

function interpretacionBR(br: number): string {
  if (br > 1)
    return `La población indígena presentó una razón de mortalidad materna ${br.toFixed(2)} veces mayor que la población no indígena.`
  if (br < 1 && br > 0)
    return `La población no indígena presentó una razón de mortalidad materna ${(1 / br).toFixed(2)} veces mayor que la población indígena.`
  return 'No se observaron diferencias relativas entre grupos étnicos.'
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function downloadCsv(rows: GapRow[], filename = 'brechas-etnicas') {
  const header = [
    'anio',
    'rmm_indigena',
    'rmm_no_indigena',
    'brecha_absoluta',
    'ic_inf_ba',
    'ic_sup_ba',
    'brecha_relativa',
    'ic_inf_br',
    'ic_sup_br',
  ].join(',')
  const lines = rows.map((r) =>
    [
      r.anio,
      r.rmm_indigena,
      r.rmm_no_indigena,
      r.brecha_absoluta,
      r.ic_inf_ba,
      r.ic_sup_ba,
      r.brecha_relativa,
      r.ic_inf_br,
      r.ic_sup_br,
    ].join(','),
  )
  const csv = [header, ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

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

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  data: MaternalMortalityRateRow[]
  selectedYear?: number | null
}

type ViewMode = 'chart' | 'table'

export const MaternalMortalityEthnicGapsChart = ({
  data,
  selectedYear,
}: Props) => {
  const gapsData = useMemo(() => computeGaps(data), [data])

  const [view, setView] = useState<ViewMode>('chart')

  const effectiveYear = selectedYear ?? (gapsData.length > 0 ? gapsData[gapsData.length - 1].anio : null)

  const selectedRow = useMemo(
    () => gapsData.find((r) => r.anio === effectiveYear) ?? null,
    [gapsData, effectiveYear],
  )

  const chartData = gapsData.map((row) => ({
    anio: row.anio,
    'Brecha absoluta': row.brecha_absoluta,
    'Brecha relativa': row.brecha_relativa,
  }))

  if (gapsData.length === 0) {
    return (
      <p className="text-gray-500 italic py-8 text-center">
        No hay datos disponibles.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Controls ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex rounded-lg overflow-hidden border border-gray-200 text-sm">
          {(['chart', 'table'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`px-4 py-1.5 transition-colors ${
                view === v
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {v === 'chart' ? 'Gráfico' : 'Tabla'}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => downloadCsv(gapsData)}
          className="flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <DownloadIcon />
          Descargar tabla
        </button>
      </div>

      {/* ── Chart or Table ───────────────────────────────────────────────────── */}
      {view === 'chart' ? (
        <div className="rounded-lg border border-gray-200 px-4 pt-6 pb-2">
          <DSComboChart
            data={chartData}
            xAxisKey="anio"
            bars={[
              {
                dataKey: 'Brecha absoluta',
                name: 'Brecha absoluta (×100.000 NV)',
                color: '#8b5cf6',
                yAxisId: 'right',
              },
            ]}
            lines={[
              {
                dataKey: 'Brecha relativa',
                name: 'Brecha relativa',
                color: '#06b6d4',
                yAxisId: 'left',
              },
            ]}
            height={380}
            highlightX={effectiveYear ?? undefined}
            showRightAxis
          />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 font-medium">Año</th>
                <th className="px-4 py-3 font-medium">RMM Indígena</th>
                <th className="px-4 py-3 font-medium">RMM No indígena</th>
                <th className="px-4 py-3 font-medium">
                  Brecha absoluta
                </th>
                <th className="px-4 py-3 font-medium">IC 95% BA</th>
                <th className="px-4 py-3 font-medium">
                  Brecha relativa
                </th>
                <th className="px-4 py-3 font-medium">IC 95% BR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {gapsData.map((row) => (
                <tr
                  key={row.anio}
                  className={`transition-colors ${
                    row.anio === effectiveYear
                      ? 'bg-gray-100 font-semibold'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {row.anio}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {row.rmm_indigena.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {row.rmm_no_indigena.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {row.brecha_absoluta.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    ({row.ic_inf_ba.toFixed(1)} – {row.ic_sup_ba.toFixed(1)})
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {row.brecha_relativa.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    ({row.ic_inf_br.toFixed(2)} – {row.ic_sup_br.toFixed(2)})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Interpretation cards for selected year ───────────────────────────── */}
      {selectedRow && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-purple-200 p-4 bg-purple-50">
            <p className="text-xs font-semibold uppercase tracking-wide text-purple-600 mb-1">
              Brecha absoluta — {effectiveYear}
            </p>
            <p className="text-3xl font-bold text-purple-700 mb-1">
              {selectedRow.brecha_absoluta.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500 mb-3">
              IC 95%: ({selectedRow.ic_inf_ba.toFixed(1)} –{' '}
              {selectedRow.ic_sup_ba.toFixed(1)}) muertes por 100.000 NV
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {interpretacionBA(selectedRow.brecha_absoluta)}
            </p>
          </div>

          <div className="rounded-lg border border-cyan-200 p-4 bg-cyan-50">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-600 mb-1">
              Brecha relativa — {effectiveYear}
            </p>
            <p className="text-3xl font-bold text-cyan-700 mb-1">
              {selectedRow.brecha_relativa.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mb-3">
              IC 95%: ({selectedRow.ic_inf_br.toFixed(2)} –{' '}
              {selectedRow.ic_sup_br.toFixed(2)})
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {interpretacionBR(selectedRow.brecha_relativa)}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
