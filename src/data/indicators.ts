export type IndicatorMeta = {
  slug: string
  title: string
  text: string
  description: string
  date: string
  category: string
  priority: boolean
}

export const suicideMortalitySDoHIndicators: IndicatorMeta[] = [
  {
    slug: 'educacion',
    title: 'Educación',
    text: 'Indicadores de educación, incluyendo tasa de deserción escolar, entre otros.',
    description:
      'Indicadores de educación, incluyendo tasa de deserción escolar, entre otros.',
    date: '2026-01-01',
    category: 'Indicadores',
    priority: true,
  },
  {
    slug: 'violencia',
    title: 'Violencia',
    text: 'Indicadores de violencia, incluyendo tasa de victimización, entre otros.',
    description:
      'Indicadores de violencia, incluyendo tasa de victimización, entre otros.',
    date: '2026-01-01',
    category: 'Indicadores',
    priority: true,
  },
  {
    slug: 'trabajo',
    title: 'Trabajo',
    text: 'Indicadores de trabajo, incluyendo tasa de desempleo, entre otros.',
    description:
      'Indicadores de trabajo, incluyendo tasa de desempleo, entre otros.',
    date: '2026-01-01',
    category: 'Indicadores',
    priority: true,
  },
]

export const violenceIndicators: IndicatorMeta[] = [
  {
    slug: 'educacion',
    title: 'Educación',
    text: 'Indicadores de educación, incluyendo tasa de deserción escolar, entre otros.',
    description:
      'Indicadores de educación, incluyendo tasa de deserción escolar, entre otros.',
    date: '2026-01-01',
    category: 'Indicadores',
    priority: true,
  },
]
