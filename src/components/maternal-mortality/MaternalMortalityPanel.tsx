import { useState } from 'react'
import { MaternalMortalityChart } from './MaternalMortalityChart'
import { MaternalMortalityGapsChart } from './MaternalMortalityGapsChart'
import type {
  MaternalMortalityRateRow,
  MaternalMortalityQuintilRow,
  MaternalMortalityGapsRow,
} from '@/lib/parquet'

interface MaternalMortalityPanelProps {
  data: MaternalMortalityRateRow[]
  quintilData: MaternalMortalityQuintilRow[]
  maternalGapsData: MaternalMortalityGapsRow[]
  csvPath?: string
  quintilCsvPath?: string
  gapsCsvPath?: string
}

export const MaternalMortalityPanel = ({
  data,
  quintilData,
  maternalGapsData,
  csvPath,
  quintilCsvPath,
  gapsCsvPath,
}: MaternalMortalityPanelProps) => {
  const [metric, setMetric] = useState<'brecha_absoluta' | 'brecha_relativa'>(
    'brecha_absoluta',
  )

  const lastYear =
    maternalGapsData.length > 0
      ? maternalGapsData[maternalGapsData.length - 1]
      : null

  return (
    <div className="flex flex-col gap-8">
      <MaternalMortalityChart data={data} csvPath={csvPath} />
    </div>
  )
}
