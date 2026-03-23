export type IndicatorMeta = {
  slug: string
  title: string
  text: string
  description: string
  date: string
  category: string
  navbar: boolean
  priority: boolean
}

export const indicators: IndicatorMeta[] = [
  {
    slug: 'educacion',
    title: 'Educación',
    text: 'Indicadores de educación en Suaza, incluyendo tasa de deserción escolar, entre otros.',
    description:
      'Indicadores de educación en Suaza, incluyendo tasa de deserción escolar, entre otros.',
    date: '2026-01-01',
    category: 'Indicadores',
    navbar: false,
    priority: true,
  },
]
