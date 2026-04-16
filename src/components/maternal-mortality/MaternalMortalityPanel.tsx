import { MaternalMortalityChart } from './MaternalMortalityChart'
import type { MaternalMortalityRateRow } from '@/lib/parquet'

interface MaternalMortalityPanelProps {
  data: MaternalMortalityRateRow[]
  csvPath?: string
}

export const MaternalMortalityPanel = ({
  data,
  csvPath,
}: MaternalMortalityPanelProps) => {
  return (
    <div className="flex flex-col gap-8">
      <MaternalMortalityChart data={data} csvPath={csvPath} />
    </div>
  )
}
