const PRAGMA_V2 = [{ columns: ['user_version'], values: [[2]] }]
const PRAGMA_V1 = [{ columns: ['user_version'], values: [[1]] }]

const { mockRun, mockExec } = vi.hoisted(() => ({
  mockRun:  vi.fn(),
  mockExec: vi.fn(),
}))

vi.mock('sql.js', () => {
  class MockDatabase {
    run    = mockRun
    exec   = mockExec
    export = vi.fn(() => new Uint8Array([1, 2, 3]))
    close  = vi.fn()
  }
  return { default: vi.fn().mockResolvedValue({ Database: MockDatabase }) }
})

import { getDatabase, saveDb, _resetDatabase } from '../database'

beforeEach(() => {
  _resetDatabase()
  vi.clearAllMocks()
  mockExec.mockReturnValue(PRAGMA_V2)
  localStorage.clear()
})

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

  it('loads db from valid localStorage snapshot and skips migration when up to date', async () => {
    const bytes = new Uint8Array([1, 2, 3])
    let binary = ''
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
    localStorage.setItem('tamagotchi_db', btoa(binary))

    const db = await getDatabase()
    expect(db).toBeDefined()
    expect(db.run).not.toHaveBeenCalled()
  })

  it('runs migration when stored db has user_version < 2', async () => {
    const bytes = new Uint8Array([1, 2, 3])
    let binary = ''
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
    localStorage.setItem('tamagotchi_db', btoa(binary))

    mockExec.mockReturnValueOnce(PRAGMA_V1)
    const db = await getDatabase()
    expect(db.run).toHaveBeenCalled()
  })

  it('silently resets to a fresh db on corrupt localStorage data', async () => {
    localStorage.setItem('tamagotchi_db', 'not!!valid!!base64@@@')

    const db = await getDatabase()
    expect(db).toBeDefined()
    expect(db.run).toHaveBeenCalled()
  })
})

describe('saveDb()', () => {
  it('writes a base64-encoded string to localStorage', async () => {
    await getDatabase()
    saveDb()

    const stored = localStorage.getItem('tamagotchi_db')
    expect(stored).toBeTruthy()
    expect(() => atob(stored!)).not.toThrow()
  })
})
