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
      <Select onValueChange={setSelectedRegion}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
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
      {/* <Select
        options={regions}
        triggerClassName="border rounded px-3 py-2"
        popupClassName="bg-white shadow-lg rounded"
        itemClassName="px-3 py-2 hover:bg-gray-100"
        value={selectedRegion}
        onValueChange={setSelectedRegion}
      /> */}

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
