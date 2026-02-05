import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

const regions = [
  { value: 'north-america', label: 'North America' },
  { value: 'central-america', label: 'Central America' },
  { value: 'south-america', label: 'South America' },
  { value: 'caribbean', label: 'Caribbean' },
  { value: 'all-regions', label: 'All Regions' },
]

export const RegionSelector = () => {
  const [selectedRegion, setSelectedRegion] = useState('')

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <h3 className="text-red-600 text-2xl font-semibold mb-4 text-center">
        Health Indicators Region Filter
      </h3>

      <Select
        label="Select Region"
        options={regions}
        value={selectedRegion}
        onValueChange={setSelectedRegion}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectItem key={region.value} value={region.value}>
              {region.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedRegion && (
        <p
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.375rem',
            textAlign: 'center',
          }}
        >
          Selected:{' '}
          <strong>
            {regions.find((r) => r.value === selectedRegion)?.label}
          </strong>
        </p>
      )}
    </div>
  )
}
