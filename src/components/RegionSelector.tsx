import { useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from '../components/ui/select'

const regions = [
  { value: 'total', label: 'Total' },
  { value: 'sexo', label: 'Sexo' },
]

export const RegionSelector = () => {
  const [selectedRegion, setSelectedRegion] = useState('')

  return (
    <div>
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
