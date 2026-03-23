import { useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from './ui/select'
import { EducationChart } from './EducationChart'
import type { EducationDataRow, EducationIndicator } from '../lib/parquet'

const INDICATORS: { value: EducationIndicator; label: string }[] = [
  { value: 'cobertura_bruta', label: 'Cobertura Bruta' },
  { value: 'cobertura_neta',  label: 'Cobertura Neta' },
  { value: 'deserci_n',       label: 'Deserción' },
  { value: 'aprobaci_n',      label: 'Aprobación' },
  { value: 'reprobaci_n',     label: 'Reprobación' },
  { value: 'repitencia',      label: 'Repitencia' },
]

interface EducationPanelProps {
  data: EducationDataRow[]
  csvPath?: string
}

export const EducationPanel = ({ data, csvPath }: EducationPanelProps) => {
  const [indicator, setIndicator] = useState<EducationIndicator>('cobertura_bruta')

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Select
          value={indicator}
          onValueChange={(v) => setIndicator(v as EducationIndicator)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {INDICATORS.map((ind) => (
                <SelectItem key={ind.value} value={ind.value}>
                  {ind.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <EducationChart data={data} indicator={indicator} csvPath={csvPath} />
    </div>
  )
}
