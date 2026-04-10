import { DSLineChart } from '@ops-dss/charts/line-chart'
import type { AnalyticsDataRow } from '@/lib/parquet'
import {
  EDUCATION_INDICATORS,
  type EducationIndicatorKey,
} from './educationIndicators'

export { EDUCATION_INDICATORS, type EducationIndicatorKey }

interface AnalyticsDualChartProps {
  data: AnalyticsDataRow[]
  selectedIndicator: EducationIndicatorKey
}

export const AnalyticsDualChart = ({
  data,
  selectedIndicator,
}: AnalyticsDualChartProps) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 italic py-8 text-center">
        No hay datos disponibles.
      </p>
    )
  }

  const indicator = EDUCATION_INDICATORS[selectedIndicator]
  const suicideData = data.map((row) => ({ anio: row.anio, valor: row.valor }))
  const educationData = data.map((row) => ({
    anio: row.anio,
    valor: row[selectedIndicator],
  }))

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-800">
        Tendencia temporal de {indicator.label.toLowerCase()} y mortalidad por
        suicidio en Suaza
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-center text-gray-600">
            Mortalidad por suicidio (100.000 hab.)
          </p>
          <DSLineChart
            data={suicideData}
            xAxisKey="anio"
            lines={[
              {
                dataKey: 'valor',
                name: 'Mortalidad por suicidio (100.000 hab.)',
                color: '#ef4444',
              },
            ]}
            height={320}
            xAxisLabel="Año"
            yAxisLabel="Tasa (×100.000 hab.)"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-center text-gray-600">
            {indicator.label} ({indicator.unit})
          </p>
          <DSLineChart
            data={educationData}
            xAxisKey="anio"
            lines={[
              {
                dataKey: 'valor',
                name: `${indicator.label} (${indicator.unit})`,
                color: indicator.color,
              },
            ]}
            height={320}
            xAxisLabel="Año"
            yAxisLabel={indicator.unit}
          />
        </div>
      </div>
    </div>
  )
}
