export const ANALYTICS_INDICATORS = {
  traslado:           { label: 'Tiempo de traslado (>1h al CS)',  color: '#6366f1' },
  empleo_informal:    { label: 'Empleo informal',                  color: '#8b5cf6' },
  sobrecarga:         { label: 'Sobrecarga de cuidados',           color: '#f59e0b' },
  cobertura_programa: { label: 'Cobertura programa social',        color: '#10b981' },
  transporte:         { label: 'Transporte subsidiado',            color: '#3b82f6' },
} as const

export type AnalyticsIndicatorKey = keyof typeof ANALYTICS_INDICATORS
