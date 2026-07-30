import { z } from 'astro/zod'
import raw from '../../app.config.json'

const Indicator = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  source: z.string(),
  priority: z.boolean().default(false),
  category: z.string().optional(),
  related_priorities: z.array(z.string()).optional(),
  dimension: z.enum(['dss', 'policy']),
  subdimensions: z.array(z.string()),
  stratifiers: z.array(z.string()).optional(),
  label: z.string(),
  axisLabel: z.string(),
  color: z.string(),
  bivariateValue: z.string().optional(),
  scheme: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        index: z.number(),
      }),
    )
    .optional(),
})

const Config = z.object({
  local: z.string(),
  subnational: z.string(),
  national: z.string(),
  indicators: z.array(z.union([Indicator])),
  features: z.object({ map: z.boolean().default(false) }),
})

export const app = Config.parse(raw)
export type IndicatorMeta = z.infer<typeof Indicator>

export const indicators = app.indicators.filter((i) => !i.priority)
export const priorities = app.indicators.filter((i) => i.priority)

export const indicatorSlugs = indicators.map((i) => i.slug)

const stratifiers = [
  ...new Set(indicators.flatMap((i) => i.stratifiers || [])),
] as const

export type IndicatorStratifier = (typeof stratifiers)[number]
