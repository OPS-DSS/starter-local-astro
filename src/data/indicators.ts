export type IndicatorMeta = {
  slug: string
  title: string
  text: string
  description: string
  date: string
  category: string
  navbar: boolean
}

export const indicators: IndicatorMeta[] = [
  {
    slug: 'mortalidad-suicidio',
    title: 'Mortalidad por Suicidio',
    text: 'Tasa de mortalidad por suicidio por cada 100.000 habitantes. El indicador se desagrega por sexo (masculino y femenino) para identificar brechas de género y apoyar intervenciones diferenciadas en salud mental.',
    description:
      'Tasa de mortalidad por suicidio (por 100.000 hab.) desagregada por sexo.',
    date: '2026-01-01',
    category: 'Salud Mental',
    navbar: false,
  },
  {
    slug: 'desercion-suicidio',
    title: 'Deserción Escolar y Suicidio',
    text: 'Análisis de la relación entre la deserción escolar y la mortalidad por suicidio.',
    description: 'Indicadores de análisis de datos y visualización.',
    date: '2026-01-01',
    category: 'Tendencia',
    navbar: false,
  },
  {
    slug: 'correlacion-suaza',
    title: 'Educación y Brecha de Suicidio',
    text: 'Gráfico de bosque que muestra la correlación de Spearman entre cada indicador de educación y la brecha de género en mortalidad por suicidio en Suaza. Permite identificar qué indicadores educativos están más relacionados con la brecha.',
    description:
      'Correlación de Spearman entre indicadores de educación y la brecha de género en mortalidad por suicidio en Suaza.',
    date: '2026-01-01',
    category: 'Brechas',
    navbar: false,
  },
]
