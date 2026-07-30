import {
  readParquet,
  dataPath,
  filterMaternalMortalityRateRows,
  filterForestPlotRows,
  filterAnalyticsRows,
  filterScatterRows,
  filterJourneyTimeStratifiedRows,
  filterSexoOnlyStratifiedRows,
  filterZonaOnlyStratifiedRows,
  filterEtniaStratifiedRows,
} from './parquet'
import { priorities, indicators } from '@/config/general'
import type { IndicatorMeta, IndicatorStratifier } from '@/config/general'

import type {
  MaternalMortalityRateRawRow,
  MaternalMortalityRateRow,
  ForestPlotRawRow,
  ForestPlotDataRow,
  AnalyticsRawRow,
  AnalyticsRow,
  ScatterMaternalRawRow,
  ScatterRow,
  StratifiedRawRow,
  StratifiedRow,
} from './parquet'

// ─── Loaded datasets ─────────────────────────────────────────────────────────

export interface PageDatasets {
  forestPlotData: ForestPlotDataRow[]
  analyticsData: AnalyticsRow[]
  scatterData: ScatterRow[]
  maternalMortalityRateData: MaternalMortalityRateRow[]
  trasladoData: StratifiedRow[]
  frecuenciaTransporteData: StratifiedRow[]
  sobrecargaCuidadosData: StratifiedRow[]
  empleoInformalData: StratifiedRow[]
  coberturaProgramaData: StratifiedRow[]
  apoyoInfantilData: StratifiedRow[]
}

export async function loadAllDatasets(): Promise<PageDatasets> {
  let forestPlotData: ForestPlotDataRow[] = []
  try {
    const rows = await readParquet<ForestPlotRawRow>(
      dataPath('forest-plot.parquet'),
    )
    forestPlotData = filterForestPlotRows(rows)
  } catch (e) {
    console.error('[loadAllDatasets] forest-plot:', e)
  }

  let analyticsData: AnalyticsRow[] = []
  try {
    const rows = await readParquet<AnalyticsRawRow>(
      dataPath('analytics.parquet'),
    )
    analyticsData = filterAnalyticsRows(rows)
  } catch (e) {
    console.error('[loadAllDatasets] analytics:', e)
  }

  let scatterData: ScatterRow[] = []
  try {
    const rows = await readParquet<ScatterMaternalRawRow>(
      dataPath('scatter.parquet'),
    )
    scatterData = filterScatterRows(rows)
  } catch (e) {
    console.error('[loadAllDatasets] scatter:', e)
  }

  let maternalMortalityRateData: MaternalMortalityRateRow[] = []
  try {
    const rows = await readParquet<MaternalMortalityRateRawRow>(
      dataPath('mortalidad-materna.parquet'),
    )
    maternalMortalityRateData = filterMaternalMortalityRateRows(rows)
  } catch (e) {
    console.error('[loadAllDatasets] mortalidad-materna:', e)
  }

  let trasladoData: StratifiedRow[] = []
  try {
    const rows = await readParquet<StratifiedRawRow>(
      dataPath('traslado.parquet'),
    )
    trasladoData = filterJourneyTimeStratifiedRows(rows)
  } catch (e) {
    console.error('[loadAllDatasets] traslado:', e)
  }

  let frecuenciaTransporteData: StratifiedRow[] = []
  try {
    const rows = await readParquet<StratifiedRawRow>(
      dataPath('frecuencia-transporte.parquet'),
    )
    frecuenciaTransporteData = filterEtniaStratifiedRows(rows)
  } catch (e) {
    console.error('[loadAllDatasets] frecuencia-transporte:', e)
  }

  let sobrecargaCuidadosData: StratifiedRow[] = []
  try {
    const rows = await readParquet<StratifiedRawRow>(
      dataPath('sobrecarga-embarazadas.parquet'),
    )
    sobrecargaCuidadosData = filterEtniaStratifiedRows(rows)
  } catch (e) {
    console.error('[loadAllDatasets] sobrecarga-embarazadas:', e)
  }

  let empleoInformalData: StratifiedRow[] = []
  try {
    const rows = await readParquet<StratifiedRawRow>(
      dataPath('embarazadas-empleo-informal.parquet'),
    )
    empleoInformalData = filterSexoOnlyStratifiedRows(rows)
  } catch (e) {
    console.error('[loadAllDatasets] embarazadas-empleo-informal:', e)
  }

  let coberturaProgramaData: StratifiedRow[] = []
  try {
    const rows = await readParquet<StratifiedRawRow>(
      dataPath('apoyo-embarazadas.parquet'),
    )
    coberturaProgramaData = filterZonaOnlyStratifiedRows(rows)
  } catch (e) {
    console.error('[loadAllDatasets] apoyo-embarazadas:', e)
  }

  let apoyoInfantilData: StratifiedRow[] = []
  try {
    const rows = await readParquet<StratifiedRawRow>(
      dataPath('apoyo-infantil.parquet'),
    )
    apoyoInfantilData = filterEtniaStratifiedRows(rows)
  } catch (e) {
    console.error('[loadAllDatasets] apoyo-infantil:', e)
  }

  return {
    forestPlotData,
    analyticsData,
    scatterData,
    maternalMortalityRateData,
    trasladoData,
    frecuenciaTransporteData,
    sobrecargaCuidadosData,
    empleoInformalData,
    coberturaProgramaData,
    apoyoInfantilData,
  }
}

// ─── Page definitions ─────────────────────────────────────────────────────────

export interface PageDefinition {
  slug: string | undefined
  title: string
  date: string
  navbar: boolean
  source?: string
  data?: MaternalMortalityRateRow[]
  forestPlotData?: ForestPlotDataRow[]
  analyticsData?: AnalyticsRow[]
  scatterData?: ScatterRow[]
  trasladoData?: StratifiedRow[]
  frecuenciaTransporteData?: StratifiedRow[]
  sobrecargaCuidadosData?: StratifiedRow[]
  empleoInformalData?: StratifiedRow[]
  coberturaProgramaData?: StratifiedRow[]
  apoyoInfantilData?: StratifiedRow[]
  dimension?: string
  subdimensions?: string[]
  description?: string
  category?: string
  priority?: boolean
  stratifiers?: IndicatorStratifier[]
}

export function buildPages(datasets: PageDatasets): PageDefinition[] {
  const staticPages: PageDefinition[] = [
    {
      slug: undefined,
      title: 'Inicio',
      description:
        'Bienvenidos al Observatorio de Determinantes Sociales de la Salud, un espacio dedicado a la recopilación, análisis y visualización de datos relacionados con la salud. Nuestro objetivo es proporcionar información precisa y actualizada para apoyar la toma de decisiones informadas en el ámbito de la salud pública.',
      date: '2026-01-01',
      navbar: true,
    },
    {
      slug: 'analisis-de-inequidad',
      title: 'Análisis de Inequidad',
      description: 'Problemas, gráficos de tendencias y mediciones de brechas',
      date: '2026-01-01',
      navbar: true,
    },
    {
      slug: 'determinantes-de-la-salud',
      title: 'Determinantes Sociales de la Salud',
      description: 'Factores que influyen en la salud de la población',
      date: '2026-01-01',
      navbar: true,
    },
    {
      slug: 'analisis',
      title: 'Análisis Avanzado',
      description: 'Análisis de relaciones',
      date: '2026-01-01',
      navbar: true,
    },
    {
      slug: 'analisis/mortalidad-materna',
      title: 'Análisis de Mortalidad Materna',
      description: 'Indicadores de análisis de datos y visualización.',
      date: '2026-01-01',
      category: 'Tendencia',
      navbar: false,
      priority: false,
      forestPlotData: datasets.forestPlotData,
      analyticsData: datasets.analyticsData,
      scatterData: datasets.scatterData,
    },
  ]

  const priorityPages: PageDefinition[] = priorities.flatMap(
    (priority: IndicatorMeta) => [
      {
        slug: `analisis-de-inequidad/${priority.slug}`,
        title: priority.title,
        text: priority.description,
        date: priority.date,
        category: priority.category,
        source: priority.source,
        navbar: false,
        data: datasets.maternalMortalityRateData,
      },
      {
        slug: `determinantes-de-la-salud/${priority.slug}`,
        title: priority.title,
        text: priority.description,
        date: priority.date,
        source: priority.source,
        category: priority.category,
        navbar: false,
      },
    ],
  )

  const indicatorPages: PageDefinition[] = indicators.map((ind) => ({
    slug: ind.slug,
    title: ind.title,
    description: ind.description,
    dimension: ind.dimension,
    subdimensions: ind.subdimensions,
    date: ind.date,
    navbar: false,
    stratifiers: ind.stratifiers,
    source: ind.source,
    ...(ind.slug === 'traslado' ? { trasladoData: datasets.trasladoData } : {}),
    ...(ind.slug === 'frecuencia-transporte'
      ? { frecuenciaTransporteData: datasets.frecuenciaTransporteData }
      : {}),
    ...(ind.slug === 'sobrecarga-embarazadas'
      ? { sobrecargaCuidadosData: datasets.sobrecargaCuidadosData }
      : {}),
    ...(ind.slug === 'embarazadas-empleo-informal'
      ? { empleoInformalData: datasets.empleoInformalData }
      : {}),
    ...(ind.slug === 'apoyo-embarazadas'
      ? { coberturaProgramaData: datasets.coberturaProgramaData }
      : {}),
    ...(ind.slug === 'apoyo-infantil'
      ? { apoyoInfantilData: datasets.apoyoInfantilData }
      : {}),
  }))

  return [...staticPages, ...indicatorPages, ...priorityPages]
}

// ─── Static path factory ──────────────────────────────────────────────────────

export async function buildStaticPaths() {
  const datasets = await loadAllDatasets()
  const pages = buildPages(datasets)

  return pages.map(
    ({ slug, title, description, date, navbar, source, ...rest }) => ({
      params: { slug },
      props: {
        title,
        description,
        slug,
        date: new Date(date),
        navbar,
        source,
        pages,
        ...rest,
      },
    }),
  )
}
