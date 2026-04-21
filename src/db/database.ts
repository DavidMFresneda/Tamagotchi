import initSqlJs from 'sql.js'
import type { Database } from 'sql.js'

let db: Database | null = null

export async function getDatabase(): Promise<Database> {
  if (db) return db

  const SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' })
  db = new SQL.Database()
  return db
}
