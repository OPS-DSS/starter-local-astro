import { useState } from 'react'
// import { Select } from '@ops-dss/ui/select'
// import type { SelectOption } from '@ops-dss/ui/select'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from '../components/ui/select'

const regions = [
  { value: 'estrat1', label: 'Estratificador 1' },
  { value: 'estrat2', label: 'Estratificador 2' },
  { value: 'estrat3', label: 'Estratificador 3' },
  { value: 'estrat4', label: 'Estratificador 4' },
  { value: 'all-estrats', label: 'Todos los estratificadores' },
]

export const RegionSelector = () => {
  const [selectedRegion, setSelectedRegion] = useState('')

  return (
    <div className="p-4">
      <Select onValueChange={setSelectedRegion}>
        <SelectTrigger>
          <SelectValue placeholder="Estratificador" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {regions.map((region) => (
              <SelectItem key={region.value} value={region.value}>
                {region.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {selectedRegion && (
        <p className="mt-4">
          Estratificador:{' '}
          <strong>
            {regions.find((r) => r.value === selectedRegion)?.label}
          </strong>
        </p>
      )}
    </div>
  )
}
