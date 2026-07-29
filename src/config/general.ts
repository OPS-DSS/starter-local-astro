import { z } from 'astro/zod'
import raw from '../../app.config.json'

const Indicator = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  dimension: z.enum(['dss', 'policy']),
  subdimensions: z.array(z.string()),
  related_priorities: z.array(z.string()),
  stratifiers: z.array(z.string()),
  source: z.string(),
  priority: z.boolean().default(false),
})

const Config = z.object({
  local: z.string(),
  subnational: z.string(),
  national: z.string(),
  indicators: z.array(Indicator),
  features: z.object({ map: z.boolean().default(false) }),
})

export const locality = Config.parse(raw)
export type IndicatorMeta = z.infer<typeof Indicator>

const indicators = locality.indicators.filter((i) => i.priority)
const priorities = locality.indicators.filter((i) => !i.priority)
