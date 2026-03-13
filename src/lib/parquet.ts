import { asyncBufferFromFile, parquetRead } from 'hyparquet'
import { resolve, isAbsolute } from 'node:path'

export function dataPath(filename: string) {
  return resolve(process.cwd(), 'src/data', filename)
}

/**
 * Reads a parquet file at build time (Node.js / Astro SSG).
 * Pass a path relative to the project root, e.g. 'src/data/foo.parquet'.
 */
export async function readParquet<T = Record<string, unknown>>(
  filePath: string,
): Promise<T[]> {
  const resolvedPath = isAbsolute(filePath)
    ? filePath
    : resolve(process.cwd(), filePath)

  const file = await asyncBufferFromFile(resolvedPath)
  return new Promise<T[]>((resolve, reject) => {
    try {
      parquetRead({
        file,
        onComplete: (rows) => {
          try {
            // rows is an array of row-arrays from hyparquet
            // Each row is an array of column values
            if (!rows || rows.length === 0) {
              resolve([] as unknown as T[])
              return
            }
            // parquetRead returns row-oriented arrays (each row is an array of values)
            // We need column names from metadata to build objects
            resolve(rows as unknown as T[])
          } catch (err) {
            reject(err)
          }
        },
      })
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Reads a parquet file and returns row objects with named keys.
 * Uses parquet schema to map column indices to field names.
 */
export async function readParquetAsObjects<T = Record<string, unknown>>(
  filePath: string,
): Promise<T[]> {
  const resolvedPath = isAbsolute(filePath)
    ? filePath
    : resolve(process.cwd(), filePath)

  const file = await asyncBufferFromFile(resolvedPath)
  return new Promise<T[]>((resolve, reject) => {
    try {
      // First pass: read metadata to get column names
      let columnNames: string[] = []
      parquetRead({
        file,
        onComplete: (rows) => {
          try {
            if (!rows || rows.length === 0) {
              resolve([] as unknown as T[])
              return
            }
            // If rows are already objects, return as-is
            if (!Array.isArray(rows[0])) {
              resolve(rows as unknown as T[])
              return
            }
            // Get column names from metadata if available
            if (columnNames.length === 0) {
              // Fallback: generate indexed column names
              const numCols = (rows[0] as unknown[]).length
              columnNames = Array.from({ length: numCols }, (_, i) => `col${i}`)
            }
            // Convert each row array to a named object
            const objects = rows.map((row) => {
              const rowArr = row as unknown[]
              const obj: Record<string, unknown> = {}
              for (let i = 0; i < columnNames.length; i++) {
                obj[columnNames[i]] = rowArr[i]
              }
              return obj as T
            })
            resolve(objects)
          } catch (err) {
            reject(err)
          }
        },
        columns: undefined, // read all columns
      })
    } catch (err) {
      reject(err)
    }
  })
}

export type SuicideRow = {
  anio: number
  sexo: string
  valor: number
  [key: string]: unknown
}
export type ChartPoint = { anio: number; [key: string]: number | string }

export function pivotBySexo(rows: SuicideRow[]): ChartPoint[] {
  const byYear = new Map<number, ChartPoint>()
  for (const row of rows) {
    const year = Number(row[4])
    const sex = String(row[5])
    const value = Number(row[6])
    if (!byYear.has(year)) byYear.set(year, { anio: year })
    if (value !== 0) byYear.get(year)![sex] = value
  }
  return Array.from(byYear.values()).sort(
    (a, b) => (a.anio as number) - (b.anio as number),
  )
}

export type SuicideDataRow = {
  anio: number
  territorio: string
  sexo: string
  valor: number
}

const CHART_TERRITORIES = new Set(['Suaza', 'Huila', 'Nacional'])

/**
 * Filters the raw suicide parquet rows to only Suaza, Huila, and Nacional,
 * returning flat objects suitable for client-side pivoting.
 * Columns: iso3[0], territorio[1], cod_sub[2], cod_local[3], anio[4], sexo[5], valor[6]
 */
export function filterSuicideRows(rows: SuicideRow[]): SuicideDataRow[] {
  const result: SuicideDataRow[] = []
  for (const row of rows) {
    const territorio = String(row[1])
    if (!CHART_TERRITORIES.has(territorio)) continue
    const anio = Number(row[4])
    const sexo = String(row[5])
    const valor = Number(row[6])
    if (Number.isFinite(anio) && Number.isFinite(valor) && valor !== 0) {
      result.push({ anio, territorio, sexo, valor })
    }
  }
  return result
}

// Gaps data types — columns: anio, territorio, Femenino, Masculino, brecha_absoluta, razon
export type GapsRow = unknown[]
export type GapsChartPoint = {
  anio: number
  brechaHuila?: number
  brechaNacional?: number
  brechaSuaza?: number
}

export function pivotGaps(rows: GapsRow[]): GapsChartPoint[] {
  const byYear = new Map<number, GapsChartPoint>()
  for (const row of rows) {
    const anio = Number(row[0])
    if (!Number.isFinite(anio)) {
      continue
    }

    const territorio = String(row[1])
    const brechaAbsoluta = Number(row[4])
    const razon = Number(row[5])

    // Only consider expected territories
    if (
      territorio !== 'Huila' &&
      territorio !== 'Nacional' &&
      territorio !== 'Suaza'
    ) {
      continue
    }

    let point = byYear.get(anio)

    if (territorio === 'Huila') {
      if (!Number.isFinite(brechaAbsoluta)) {
        continue
      }
      if (!point) {
        point = { anio }
        byYear.set(anio, point)
      }
      point.brechaHuila = brechaAbsoluta
    } else if (territorio === 'Nacional') {
      if (!Number.isFinite(brechaAbsoluta)) {
        continue
      }
      if (!point) {
        point = { anio }
        byYear.set(anio, point)
      }
      point.brechaNacional = brechaAbsoluta
    } else if (territorio === 'Suaza') {
      if (!Number.isFinite(brechaAbsoluta)) {
        continue
      }
      if (!point) {
        point = { anio }
        byYear.set(anio, point)
      }
      point.brechaSuaza = brechaAbsoluta
    }
  }
  return Array.from(byYear.values()).sort((a, b) => a.anio - b.anio)
}
