vi.mock('../../db/database', () => ({
  getDatabase: vi.fn().mockResolvedValue({ run: vi.fn() }),
  saveDb: vi.fn(),
}))

import { usePetStore } from '../usePetStore'
import { PET_NAMES } from '../../data/petNames'
import type { Pet } from '../../types'

function makePet(hunger = 50, happiness = 50, energy = 50): Pet {
  return {
    name: 'Testi',
    hunger:    { value: hunger,    max: 100, isSpecial: false },
    happiness: { value: happiness, max: 100, isSpecial: false },
    energy:    { value: energy,    max: 100, isSpecial: false },
    state: 'normal',
  }
}

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
})

describe('usePetStore — tick()', () => {
  it('is a no-op when pet is null', () => {
    expect(() => usePetStore.getState().tick()).not.toThrow()
    expect(usePetStore.getState().pet).toBeNull()
  })

  it('decrements hunger by 5, happiness by 4, energy by 3', () => {
    usePetStore.setState({ pet: makePet(50, 50, 50) })
    usePetStore.getState().tick()
    const { hunger, happiness, energy } = usePetStore.getState().pet!
    expect(hunger.value).toBe(45)
    expect(happiness.value).toBe(46)
    expect(energy.value).toBe(47)
  })

  it('clamps hunger at 0 when value would go negative', () => {
    usePetStore.setState({ pet: makePet(3, 50, 50) })
    usePetStore.getState().tick()
    expect(usePetStore.getState().pet!.hunger.value).toBe(0)
  })

  it('clamps all stats at 0 simultaneously', () => {
    usePetStore.setState({ pet: makePet(0, 0, 0) })
    usePetStore.getState().tick()
    const { hunger, happiness, energy } = usePetStore.getState().pet!
    expect(hunger.value).toBe(0)
    expect(happiness.value).toBe(0)
    expect(energy.value).toBe(0)
  })

  it('does not modify max or isSpecial', () => {
    usePetStore.setState({ pet: makePet(50, 50, 50) })
    usePetStore.getState().tick()
    const { hunger, happiness, energy } = usePetStore.getState().pet!
    expect(hunger.max).toBe(100)
    expect(hunger.isSpecial).toBe(false)
    expect(happiness.max).toBe(100)
    expect(energy.max).toBe(100)
  })

  it('applies same numeric decay to a special stat (max 200)', () => {
    const pet: Pet = {
      name: 'Zap',
      hunger:    { value: 200, max: 200, isSpecial: true },
      happiness: { value: 200, max: 200, isSpecial: true },
      energy:    { value: 200, max: 200, isSpecial: true },
      state: 'normal',
    }
    usePetStore.setState({ pet })
    usePetStore.getState().tick()
    const { hunger, happiness, energy } = usePetStore.getState().pet!
    expect(hunger.value).toBe(195)
    expect(happiness.value).toBe(196)
    expect(energy.value).toBe(197)
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
