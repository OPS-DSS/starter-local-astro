import { useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from './ui/select'

const stratifiers = [
  { value: 'total', label: 'Total' },
  { value: 'sexo', label: 'Sexo' },
]

export const StratifierSelector = () => {
  const [selectedStratifier, setSelectedStratifier] = useState('')

  return (
    <div>
      <Select onValueChange={setSelectedStratifier}>
        <SelectTrigger>
          <SelectValue placeholder="Estratificador" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {stratifiers.map((stratifier) => (
              <SelectItem key={stratifier.value} value={stratifier.value}>
                {stratifier.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {selectedStratifier && (
        <p className="mt-4">
          Estratificador:{' '}
          <strong>
            {stratifiers.find((r) => r.value === selectedStratifier)?.label}
          </strong>
        </p>
      )}
    </div>
  )
}
