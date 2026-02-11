import { DSLineChart } from '@ops-dss/charts/line-chart'

// Sample data representing social determinants of health indicators over time
const sampleData = [
  {
    quarter: 'Q1 2023',
    foodInsecurity: 12.5,
    housingInstability: 8.2,
    healthcareAccess: 78.5,
  },
  {
    quarter: 'Q2 2023',
    foodInsecurity: 11.8,
    housingInstability: 7.9,
    healthcareAccess: 80.1,
  },
  {
    quarter: 'Q3 2023',
    foodInsecurity: 10.5,
    housingInstability: 7.5,
    healthcareAccess: 82.3,
  },
  {
    quarter: 'Q4 2023',
    foodInsecurity: 9.8,
    housingInstability: 7.1,
    healthcareAccess: 83.7,
  },
  {
    quarter: 'Q1 2024',
    foodInsecurity: 9.2,
    housingInstability: 6.8,
    healthcareAccess: 85.2,
  },
  {
    quarter: 'Q2 2024',
    foodInsecurity: 8.7,
    housingInstability: 6.5,
    healthcareAccess: 86.4,
  },
]

export const SampleLineChart = () => {
  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <p
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          color: '#6b7280',
          fontSize: '0.875rem',
        }}
      >
        Quarterly indicators showing food insecurity rate (%), housing
        instability rate (%), and healthcare access (%)
      </p>
      <DSLineChart
        data={sampleData}
        xAxisKey="quarter"
        lines={[
          {
            dataKey: 'foodInsecurity',
            name: 'Food Insecurity',
            color: '#ef4444',
          },
          {
            dataKey: 'housingInstability',
            name: 'Housing Instability',
            color: '#f59e0b',
          },
          {
            dataKey: 'healthcareAccess',
            name: 'Healthcare Access',
            color: '#10b981',
          },
        ]}
        height={400}
      />
    </div>
  )
}
