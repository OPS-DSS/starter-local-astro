import { asyncBufferFromFile, parquetRead, parquetMetadata } from 'hyparquet'
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

      // Try to read metadata separately for column names
      parquetMetadata(file)
        .then((metadata) => {
          if (metadata?.schema) {
            // schema[0] is the root, children are columns
            columnNames = metadata.schema
              .slice(1)
              .map((s: { name: string }) => s.name)
          }
        })
        .catch(() => {
          // Ignore metadata errors, fallback names will be used
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
    // console.log('Processing row:', row)
    // console.log('valores:', row.valor, 'anio:', row.anio, 'sexo:', row.sexo)
    const year = Number(row[4])
    const sex = String(row[5])
    const value = Number(row[6])
    if (!byYear.has(year)) byYear.set(year, { anio: year })
    byYear.get(year)![sex] = value
  }
  return Array.from(byYear.values()).sort(
    (a, b) => (a.anio as number) - (b.anio as number),
  )
}
