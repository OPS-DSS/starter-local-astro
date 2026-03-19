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
  {
    slug: 'correlacion-suaza',
    title: 'Educación y Brecha de Suicidio en Suaza',
    text: 'Gráfico de bosque que muestra la correlación de Spearman entre cada indicador de educación y la brecha de género en mortalidad por suicidio en Suaza. Permite identificar qué indicadores educativos están más relacionados con la brecha.',
    description:
      'Correlación de Spearman entre indicadores de educación y la brecha de género en mortalidad por suicidio en Suaza.',
    date: '2026-01-01',
    category: 'Brechas',
    navbar: false,
    priority: true,
  },
]
