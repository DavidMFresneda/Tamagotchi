import initSqlJs from 'sql.js'
import type { Database } from 'sql.js'
import { SCHEMA_SQL, USER_VERSION } from './schema'

const STORAGE_KEY = 'tamagotchi_db'
let db: Database | null = null

export async function getDatabase(): Promise<Database> {
  if (db) return db

  const SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' })

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      const binary = atob(stored)
      const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))
      db = new SQL.Database(bytes)
      return db
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  db = new SQL.Database()
  db.run(SCHEMA_SQL)
  db.run(`PRAGMA user_version = ${USER_VERSION}`)
  return db
}

export function saveDb(): void {
  if (!db) throw new Error('Database not initialized')
  const bytes = db.export()
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  localStorage.setItem(STORAGE_KEY, btoa(binary))
}

export function _resetDatabase(): void {
  db = null
}
