import type { AstroComponentFactory } from 'astro/runtime/server/index.js'

import MaternalMortalityInequity from '@/components/maternal-mortality/MaternalMortalityInequity.astro'
import Analytics from '@/components/analytics/Analytics.astro'
import Welcome from '@/components/Welcome.astro'
import MaternalMortalitySDoH from '@/components/maternal-mortality/MaternalMortalitySDoH.astro'
import PrioritySelector from '@/components/PrioritySelector.astro'
import StratifiedIndicator from '@/components/StratifiedIndicator.astro'

import type {
  SuicideDataRow,
  GapsChartPoint,
  EducationDataRow,
  AnalyticsDataRow,
  MaternalMortalityRateRow,
  MaternalMortalityQuintilRow,
  MaternalMortalityGapsRow,
  ForestPlotDataRow,
  AnalyticsMaternalRow,
  ScatterMaternalRow,
  StratifiedRow,
} from '@/lib/parquet'

export interface PageProps {
  title: string
  text: string
  pages: unknown[]
  slug: string | undefined
  date: Date
  data?:
    | SuicideDataRow[]
    | EducationDataRow[]
    | AnalyticsDataRow[]
    | MaternalMortalityRateRow[]
  forestPlotData?: ForestPlotDataRow[]
  analyticsMaternalData?: AnalyticsMaternalRow[]
  scatterMaternalData?: ScatterMaternalRow[]
  trasladoData?: StratifiedRow[]
  frecuenciaTransporteData?: StratifiedRow[]
  sobrecargaCuidadosData?: StratifiedRow[]
  empleoInformalData?: StratifiedRow[]
  coberturaProgramaData?: StratifiedRow[]
  controlesPrenatalData?: StratifiedRow[]
}

type PropsResolver = (
  props: PageProps,
  baseUrl: string,
) => Record<string, unknown>

interface PageRegistryEntry {
  component: AstroComponentFactory
  resolveProps: PropsResolver
}

const base = (url: string, path: string) => `${url}/data/${path}`

export const pageRegistry: Record<string, PageRegistryEntry> = {
  // ─── No slug (home) ────────────────────────────────────────────────────────
  '': {
    component: Welcome,
    resolveProps: ({ text }) => ({ text }),
  },

  // ─── Section index pages ───────────────────────────────────────────────────
  'analisis-de-inequidad': {
    component: PrioritySelector,
    resolveProps: ({ title, text, slug }) => ({ title, text, section: slug }),
  },
  'determinantes-de-la-salud': {
    component: PrioritySelector,
    resolveProps: ({ title, text, slug }) => ({ title, text, section: slug }),
  },
  analisis: {
    component: PrioritySelector,
    resolveProps: ({ title, text, slug }) => ({ title, text, section: slug }),
  },

  // ─── Detail pages ──────────────────────────────────────────────────────────
  'determinantes-de-la-salud/mortalidad-materna': {
    component: MaternalMortalitySDoH,
    resolveProps: ({ title, text }) => ({ title, text }),
  },
  'analisis-de-inequidad/mortalidad-materna': {
    component: MaternalMortalityInequity,
    resolveProps: ({ title, text, data }, baseUrl) => ({
      title,
      text,
      data,
      csvPath: base(baseUrl, 'maternal_mortality_rate.csv'),
    }),
  },
  'analisis/mortalidad-materna': {
    component: Analytics,
    resolveProps: (
      {
        title,
        text,
        forestPlotData,
        analyticsMaternalData,
        scatterMaternalData,
      },
      baseUrl,
    ) => ({
      title,
      text,
      forestPlotData,
      analyticsMaternalData,
      scatterMaternalData,
      smvGeojsonUrl: base(baseUrl, 'SMV_municipalities.geojson'),
      csvUrl: base(baseUrl, 'SMV_map.csv'),
    }),
  },
  traslado: {
    component: StratifiedIndicator,
    resolveProps: ({ title, text, trasladoData }, baseUrl) => ({
      title,
      text,
      data: trasladoData ?? [],
      yAxisLabel: 'Minutos promedio',
      csvPath: base(baseUrl, 'journey_time.csv'),
    }),
  },
  'frecuencia-transporte': {
    component: StratifiedIndicator,
    resolveProps: ({ title, text, frecuenciaTransporteData }, baseUrl) => ({
      title,
      text,
      data: frecuenciaTransporteData ?? [],
      yAxisLabel: 'Buses por hora',
      csvPath: base(baseUrl, 'transport_frequency.csv'),
    }),
  },
  'sobrecarga-embarazadas': {
    component: StratifiedIndicator,
    resolveProps: ({ title, text, sobrecargaCuidadosData }, baseUrl) => ({
      title,
      text,
      data: sobrecargaCuidadosData ?? [],
      yAxisLabel: '% mujeres embarazadas',
      csvPath: base(baseUrl, 'care_overload.csv'),
    }),
  },
  'embarazadas-empleo-informal': {
    component: StratifiedIndicator,
    resolveProps: ({ title, text, empleoInformalData }, baseUrl) => ({
      title,
      text,
      data: empleoInformalData ?? [],
      yAxisLabel: '% mujeres embarazadas',
      csvPath: base(baseUrl, 'informal_employment.csv'),
    }),
  },
  'apoyo-embarazadas': {
    component: StratifiedIndicator,
    resolveProps: ({ title, text, coberturaProgramaData }, baseUrl) => ({
      title,
      text,
      data: coberturaProgramaData ?? [],
      yAxisLabel: '% de embarazadas',
      csvPath: base(baseUrl, 'program_cover.csv'),
    }),
  },
}
