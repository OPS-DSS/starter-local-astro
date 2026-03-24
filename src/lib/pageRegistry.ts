import type { AstroComponentFactory } from 'astro/runtime/server/index.js'

import Education from '@/components/education/Education.astro'
import SuicideMortalityInequity from '@/components/suicide-mortality/SuicideMortalityInequity.astro'
import MunicipalitiesMap from '@/components/map/MunicipalitiesMap.astro'
import Analytics from '@/components/analytics/Analytics.astro'
import Welcome from '@/components/Welcome.astro'
import SuicideMortalitySDoH from '@/components/suicide-mortality/SuicideMortalitySDoH.astro'
import PrioritySelector from '@/components/PrioritySelector.astro'

import type {
  SuicideDataRow,
  GapsChartPoint,
  EducationDataRow,
  AnalyticsDataRow,
} from '@/lib/parquet'
import ViolenceSDoH from '@/components/violence/ViolenceSDoH.astro'
import ViolenceInequity from '@/components/violence/ViolenceInequity.astro'

export interface PageProps {
  title: string
  text: string
  pages: unknown[]
  slug: string | undefined
  date: Date
  data?: SuicideDataRow[] | EducationDataRow[] | AnalyticsDataRow[]
  gapsData?: GapsChartPoint[]
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
  'inequidades-en-salud': {
    component: PrioritySelector,
    resolveProps: ({ title, text, slug }) => ({ title, text, section: slug }),
  },
  'determinantes-de-la-salud': {
    component: PrioritySelector,
    resolveProps: ({ title, text, slug }) => ({ title, text, section: slug }),
  },

  // ─── Detail pages ──────────────────────────────────────────────────────────
  'determinantes-de-la-salud/mortalidad-por-suicidio': {
    component: SuicideMortalitySDoH,
    resolveProps: ({ title, text }) => ({ title, text }),
  },
  'determinantes-de-la-salud/violencia': {
    component: ViolenceSDoH,
    resolveProps: ({ title, text }) => ({ title, text }),
  },
  'inequidades-en-salud/mortalidad-por-suicidio': {
    component: SuicideMortalityInequity,
    resolveProps: ({ title, text, data, gapsData }, baseUrl) => ({
      title,
      text,
      data,
      gapsData,
      csvPath: base(baseUrl, 'suicide_huila.csv'),
      gapsCsvPath: base(baseUrl, 'suicide_huila_gaps.csv'),
    }),
  },
  'inequidades-en-salud/violencia': {
    component: ViolenceInequity,
    resolveProps: ({ title, text }) => ({
      title,
      text,
    }),
  },
  educacion: {
    component: Education,
    resolveProps: ({ title, text, data }, baseUrl) => ({
      title,
      text,
      data,
      csvPath: base(baseUrl, 'education_suaza.csv'),
    }),
  },
  analisis: {
    component: Analytics,
    resolveProps: ({ title, text, data }, baseUrl) => ({
      title,
      text,
      data,
      csvPath: base(baseUrl, 'analytics_suaza.csv'),
    }),
  },
  'mapa-huila': {
    component: MunicipalitiesMap,
    resolveProps: ({ title, text }, baseUrl) => ({
      title,
      text,
      geojsonUrls: {
        cobertura_bruta: base(baseUrl, 'huila_cobertura_bruta.geojson'),
        cobertura_neta: base(baseUrl, 'huila_cobertura_neta.geojson'),
        deserci_n: base(baseUrl, 'huila_desercion.geojson'),
        aprobaci_n: base(baseUrl, 'huila_aprobacion.geojson'),
        reprobaci_n: base(baseUrl, 'huila_reprobacion.geojson'),
        repitencia: base(baseUrl, 'huila_repitencia.geojson'),
      },
      csvUrl: base(baseUrl, 'huila_map.csv'),
    }),
  },
}
