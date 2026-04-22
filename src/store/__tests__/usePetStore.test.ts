vi.mock('../../db/database', () => ({
  getDatabase: vi.fn().mockResolvedValue({ run: vi.fn() }),
  saveDb: vi.fn(),
}))

import { usePetStore } from '../usePetStore'
import { PET_NAMES } from '../../data/petNames'

beforeEach(() => {
  usePetStore.setState({ pet: null })
  vi.clearAllMocks()
})

describe('usePetStore — initial state', () => {
  it('starts with pet as null', () => {
    expect(usePetStore.getState().pet).toBeNull()
  })
})

describe('usePetStore — action stubs', () => {
  it('feed is callable without throwing', () => {
    expect(() => usePetStore.getState().feed()).not.toThrow()
  })

  it('play is callable without throwing', () => {
    expect(() => usePetStore.getState().play()).not.toThrow()
  })

  it('rest is callable without throwing', () => {
    expect(() => usePetStore.getState().rest()).not.toThrow()
  })

  it('tick is callable without throwing', () => {
    expect(() => usePetStore.getState().tick()).not.toThrow()
  })
})

describe('usePetStore — generatePet()', () => {
  it('sets a non-null pet', () => {
    usePetStore.getState().generatePet()
    expect(usePetStore.getState().pet).not.toBeNull()
  })

  it('name is from PET_NAMES', () => {
    usePetStore.getState().generatePet()
    expect(PET_NAMES).toContain(usePetStore.getState().pet!.name)
  })

  it('each stat max is 100 (normal) or 200 (special)', () => {
    usePetStore.getState().generatePet()
    const { hunger, happiness, energy } = usePetStore.getState().pet!
    expect([100, 200]).toContain(hunger.max)
    expect([100, 200]).toContain(happiness.max)
    expect([100, 200]).toContain(energy.max)
  })

  it('each stat value equals its max (starts fully healthy)', () => {
    usePetStore.getState().generatePet()
    const { hunger, happiness, energy } = usePetStore.getState().pet!
    expect(hunger.value).toBe(hunger.max)
    expect(happiness.value).toBe(happiness.max)
    expect(energy.value).toBe(energy.max)
  })

  it('isSpecial matches the max (200 → special, 100 → not special)', () => {
    usePetStore.getState().generatePet()
    const { hunger, happiness, energy } = usePetStore.getState().pet!
    ;[hunger, happiness, energy].forEach(stat => {
      expect(stat.isSpecial).toBe(stat.max === 200)
    })
  })

  it('state is normal', () => {
    usePetStore.getState().generatePet()
    expect(usePetStore.getState().pet!.state).toBe('normal')
  })
})
