import { useState } from 'react';
import { Select } from '@ops-dss/ui/select';

const regions = [
  { value: 'north-america', label: 'North America' },
  { value: 'central-america', label: 'Central America' },
  { value: 'south-america', label: 'South America' },
  { value: 'caribbean', label: 'Caribbean' },
  { value: 'all-regions', label: 'All Regions' },
];

export const RegionSelector = () => {
  const [selectedRegion, setSelectedRegion] = useState('');

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>
        Health Indicators Region Filter
      </h3>
      <Select
        label="Select Region"
        options={regions}
        value={selectedRegion}
        onChange={setSelectedRegion}
        placeholder="Choose a region to view data"
        id="region-select"
      />
      {selectedRegion && (
        <p style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', textAlign: 'center' }}>
          Selected: <strong>{regions.find(r => r.value === selectedRegion)?.label}</strong>
        </p>
      )}
    </div>
  );
};
