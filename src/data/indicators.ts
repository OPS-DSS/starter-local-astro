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
    slug: 'indicador/pobreza-multidimensional',
    title: 'Pobreza Multidimensional',
    text: 'El indicador de pobreza multidimensional mide la privación en múltiples dimensiones, como educación, salud y nivel de vida, para identificar a las personas que viven en condiciones de pobreza más allá de los ingresos económicos.',
    description:
      'Privación en múltiples dimensiones: educación, salud y nivel de vida.',
    date: '2026-01-01',
    category: 'Condiciones de Vida',
  },
  {
    slug: 'indicador/mortalidad-suicidio',
    title: 'Mortalidad por Suicidio',
    text: 'Tasa de mortalidad por suicidio por cada 100.000 habitantes en Suaza. El indicador se desagrega por sexo (masculino y femenino) para identificar brechas de género y apoyar intervenciones diferenciadas en salud mental.',
    description:
      'Tasa de mortalidad por suicidio (por 100.000 hab.) desagregada por sexo — Suaza.',
    date: '2026-01-01',
    category: 'Salud Mental',
  },
]
