export type PriorityMeta = {
  slug: string
  title: string
  description: string
  date: string
  category: string
}

export const priorities: PriorityMeta[] = [
  {
    slug: 'violencia',
    title: 'Violencia',
    description: 'La violencia es un factor importante.',
    date: '2026-03-01',
    category: 'Prioridades',
  },
  {
    slug: 'mortalidad-por-suicidio',
    title: 'Mortalidad por Suicidio',
    description: 'La mortalidad por suicidio es un indicador clave.',
    date: '2026-03-01',
    category: 'Prioridades',
  },
]
