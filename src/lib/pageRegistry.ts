import type { AstroComponentFactory } from 'astro/runtime/server/index.js'

import MaternalMortalityInequity from '@/components/maternal-mortality/MaternalMortalityInequity.astro'
import Analytics from '@/components/analytics/Analytics.astro'
import Welcome from '@/components/Welcome.astro'
import MaternalMortalitySDoH from '@/components/maternal-mortality/MaternalMortalitySDoH.astro'
import PrioritySelector from '@/components/PrioritySelector.astro'
import StratifiedIndicator from '@/components/StratifiedIndicator.astro'

import type {
  AnalyticsDataRow,
  MaternalMortalityRateRow,
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
  data?: AnalyticsDataRow[] | MaternalMortalityRateRow[]
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
      geojsonUrls: {
        traslado: base(baseUrl, 'mock_bivariate_traslado.geojson'),
        empleo_informal: base(
          baseUrl,
          'mock_bivariate_empleo_informal.geojson',
        ),
        sobrecarga: base(baseUrl, 'mock_bivariate_sobrecarga.geojson'),
        cobertura_programa: base(
          baseUrl,
          'mock_bivariate_cobertura_programa.geojson',
        ),
        transporte: base(baseUrl, 'mock_bivariate_transporte.geojson'),
      },
      maternalGeojsonUrl: base(baseUrl, 'mock_maternal_mortality.geojson'),
      dssBivariateGeojsonUrls: {
        traslado: {
          empleo_informal: base(baseUrl, 'mock_bivariate_dss_traslado_empleo_informal.geojson'),
          sobrecarga: base(baseUrl, 'mock_bivariate_dss_traslado_sobrecarga.geojson'),
          cobertura_programa: base(baseUrl, 'mock_bivariate_dss_traslado_cobertura_programa.geojson'),
          transporte: base(baseUrl, 'mock_bivariate_dss_traslado_transporte.geojson'),
        },
        empleo_informal: {
          traslado: base(baseUrl, 'mock_bivariate_dss_empleo_informal_traslado.geojson'),
          sobrecarga: base(baseUrl, 'mock_bivariate_dss_empleo_informal_sobrecarga.geojson'),
          cobertura_programa: base(baseUrl, 'mock_bivariate_dss_empleo_informal_cobertura_programa.geojson'),
          transporte: base(baseUrl, 'mock_bivariate_dss_empleo_informal_transporte.geojson'),
        },
        sobrecarga: {
          traslado: base(baseUrl, 'mock_bivariate_dss_sobrecarga_traslado.geojson'),
          empleo_informal: base(baseUrl, 'mock_bivariate_dss_sobrecarga_empleo_informal.geojson'),
          cobertura_programa: base(baseUrl, 'mock_bivariate_dss_sobrecarga_cobertura_programa.geojson'),
          transporte: base(baseUrl, 'mock_bivariate_dss_sobrecarga_transporte.geojson'),
        },
        cobertura_programa: {
          traslado: base(baseUrl, 'mock_bivariate_dss_cobertura_programa_traslado.geojson'),
          empleo_informal: base(baseUrl, 'mock_bivariate_dss_cobertura_programa_empleo_informal.geojson'),
          sobrecarga: base(baseUrl, 'mock_bivariate_dss_cobertura_programa_sobrecarga.geojson'),
          transporte: base(baseUrl, 'mock_bivariate_dss_cobertura_programa_transporte.geojson'),
        },
        transporte: {
          traslado: base(baseUrl, 'mock_bivariate_dss_transporte_traslado.geojson'),
          empleo_informal: base(baseUrl, 'mock_bivariate_dss_transporte_empleo_informal.geojson'),
          sobrecarga: base(baseUrl, 'mock_bivariate_dss_transporte_sobrecarga.geojson'),
          cobertura_programa: base(baseUrl, 'mock_bivariate_dss_transporte_cobertura_programa.geojson'),
        },
      },
      csvUrl: base(baseUrl, 'mock_scatter_maternal.csv'),
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
