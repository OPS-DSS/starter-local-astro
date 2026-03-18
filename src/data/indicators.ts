export type IndicatorMeta = {
  slug: string
  title: string
  text: string
  description: string
  date: string
  category: string
}

export const indicators: IndicatorMeta[] = [
  {
    slug: 'indicador/educacion',
    title: 'Educación',
    text: 'Los indicadores de Educación incluyen cobertura bruta, cobertura neta, deserción, aprobación, reprobación y repitencia.',
    description:
      'Los indicadores de Educación incluyen cobertura bruta, cobertura neta, deserción, aprobación, reprobación y repitencia',
    date: '2026-01-01',
    category: 'Educación',
  },
  {
    slug: 'indicador/mortalidad-suicidio',
    title: 'Mortalidad por Suicidio',
    text: 'Tasa de mortalidad por suicidio por cada 100.000 habitantes. El indicador se desagrega por sexo (masculino y femenino) para identificar brechas de género y apoyar intervenciones diferenciadas en salud mental.',
    description:
      'Tasa de mortalidad por suicidio (por 100.000 hab.) desagregada por sexo.',
    date: '2026-01-01',
    category: 'Salud Mental',
  },
  {
    slug: 'indicador/analitica',
    title: 'Análisis de Datos',
    text: 'Análisis de datos y visualización de información estadística.',
    description: 'Indicadores de análisis de datos y visualización.',
    date: '2026-01-01',
    category: 'Análisis',
  },
  {
    slug: 'indicador/forest-plot-suaza',
    title: 'Educación y Brecha de Suicidio',
    text: 'Gráfico de bosque (forest plot) que muestra la correlación de Spearman entre cada indicador de educación y la brecha de género en mortalidad por suicidio en Suaza. Permite identificar qué indicadores educativos están más relacionados con la brecha.',
    description:
      'Correlación de Spearman entre indicadores de educación y la brecha de género en mortalidad por suicidio en Suaza (forest plot).',
    date: '2026-01-01',
    category: 'Análisis',
  },
  {
    slug: 'indicador/mapa-huila',
    title: 'Mapa Municipal de Huila',
    text: 'Comparación de indicadores de salud entre los municipios del departamento de Huila, Colombia. El mapa permite comparar a Suaza con los demás municipios de su departamento.',
    description:
      'Mapa coroplético interactivo que compara indicadores de salud por municipio en el departamento de Huila.',
    date: '2026-01-01',
    category: 'Salud',
  },
]
