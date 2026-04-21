vi.mock('sql.js', () => {
  class MockDatabase {
    run = vi.fn()
    exec = vi.fn()
    export = vi.fn(() => new Uint8Array([1, 2, 3]))
    close = vi.fn()
  }
  return { default: vi.fn().mockResolvedValue({ Database: MockDatabase }) }
})

import { getDatabase } from '../database'

describe('getDatabase()', () => {
  it('returns a db instance with run and exec methods', async () => {
    const db = await getDatabase()
    expect(db).toBeDefined()
    expect(typeof db.run).toBe('function')
    expect(typeof db.exec).toBe('function')
  })

  it('calls initSqlJs with a locateFile that returns /sql-wasm.wasm', async () => {
    const initSqlJs = (await import('sql.js')).default as unknown as ReturnType<typeof vi.fn>
    await getDatabase()
    expect(initSqlJs).toHaveBeenCalled()
    const arg = initSqlJs.mock.calls[0][0] as { locateFile: () => string }
    expect(arg.locateFile()).toBe('/sql-wasm.wasm')
  })

  it('returns the same instance on repeated calls (singleton)', async () => {
    const a = await getDatabase()
    const b = await getDatabase()
    expect(a).toBe(b)
  })
})
