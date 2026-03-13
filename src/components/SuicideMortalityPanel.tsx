import { useState } from 'react'
import { StratifierSelector } from './StratifierSelector'
import { SuicideChart } from './SuicideChart'
import { SuicideGapsChart } from './SuicideGapsChart'
import type { SuicideDataRow, GapsChartPoint } from '../lib/parquet'

interface SuicideMortalityPanelProps {
  data: SuicideDataRow[]
  gapsData: GapsChartPoint[]
  csvPath?: string
  gapsCsvPath?: string
}

export const SuicideMortalityPanel = ({
  data,
  gapsData,
  csvPath,
  gapsCsvPath,
}: SuicideMortalityPanelProps) => {
  const [stratifier, setStratifier] = useState('total')

  return (
    <div className="flex flex-col gap-8">
      <StratifierSelector value={stratifier} onValueChange={setStratifier} />
      <SuicideChart data={data} csvPath={csvPath} stratifier={stratifier} />
      <SuicideGapsChart data={gapsData} csvPath={gapsCsvPath} stratifier={stratifier} />
    </div>
  )
}
