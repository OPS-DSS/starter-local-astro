export type EducationIndicatorKey =
  | 'cobertura_bruta'
  | 'cobertura_neta'
  | 'desercion'
  | 'aprobacion'
  | 'reprobacion'
  | 'repitencia'

export const EDUCATION_INDICATORS: Record<
  EducationIndicatorKey,
  { label: string; unit: string; color: string }
> = {
  cobertura_bruta: { label: 'Cobertura Bruta', unit: '%', color: '#3b82f6' },
  cobertura_neta: { label: 'Cobertura Neta', unit: '%', color: '#8b5cf6' },
  desercion: { label: 'Deserción', unit: '%', color: '#f59e0b' },
  aprobacion: { label: 'Aprobación', unit: '%', color: '#10b981' },
  reprobacion: { label: 'Reprobación', unit: '%', color: '#ef4444' },
  repitencia: { label: 'Repitencia', unit: '%', color: '#6366f1' },
}
