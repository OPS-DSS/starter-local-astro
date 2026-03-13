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
    text: 'Los indicadores de Educación incluyen la tasa de alfabetización, la tasa de matrícula escolar, el porcentaje de estudiantes que completan la educación primaria y secundaria, y el acceso a recursos educativos. Estos indicadores reflejan el nivel de desarrollo educativo en el municipio y ayudan a identificar áreas de mejora para garantizar una educación de calidad para todos los habitantes.',
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
]
