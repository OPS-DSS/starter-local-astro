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
    description: 'La violencia es un factor en la comunidad.',
    date: '2026-03-01',
    category: 'inequidad',
  },
  {
    slug: 'mortalidad-por-suicidio',
    title: 'Mortalidad por Suicidio',
    description: 'La mortalidad por suicidio es un indicador clave.',
    date: '2026-03-01',
    category: 'comunidad',
  },
]
