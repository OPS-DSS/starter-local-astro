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
    description: 'Privación en múltiples dimensiones: educación, salud y nivel de vida.',
    date: '2026-01-01',
    category: 'Condiciones de Vida',
  },
  {
    slug: 'indicador/consumo-de-alcohol',
    title: 'Consumo de Alcohol',
    text: 'El consumo de alcohol es un indicador que representa la cantidad y frecuencia con la que la población consume bebidas alcohólicas, lo cual puede tener implicaciones en la salud pública y el bienestar social.',
    description: 'Cantidad y frecuencia de consumo de bebidas alcohólicas en la población.',
    date: '2026-01-01',
    category: 'Salud',
  },
  {
    slug: 'indicador/mortalidad-suicidio',
    title: 'Mortalidad por Suicidio',
    text: 'Tasa de mortalidad por suicidio por cada 100.000 habitantes en el departamento del Huila. El indicador se desagrega por sexo (masculino y femenino) para identificar brechas de género y apoyar intervenciones diferenciadas en salud mental.',
    description: 'Tasa de mortalidad por suicidio (por 100.000 hab.) desagregada por sexo — Huila.',
    date: '2026-01-01',
    category: 'Salud Mental',
  },
]
