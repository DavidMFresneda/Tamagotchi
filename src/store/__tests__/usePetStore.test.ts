vi.mock('../../db/database', () => ({
  getDatabase: vi.fn().mockResolvedValue({ run: vi.fn() }),
  saveDb: vi.fn(),
}))

import { usePetStore } from '../usePetStore'
import { PET_NAMES } from '../../data/petNames'
import { getDatabase, saveDb } from '../../db/database'
import type { Pet } from '../../types'

function makePet(hunger = 50, happiness = 50, energy = 50, state: Pet['state'] = 'normal'): Pet {
  return {
    name: 'Testi',
    hunger:    { value: hunger,    max: 100, isSpecial: false },
    happiness: { value: happiness, max: 100, isSpecial: false },
    energy:    { value: energy,    max: 100, isSpecial: false },
    state,
  }
}

beforeEach(() => {
  usePetStore.setState({
    pet: null,
    evolutionStreak: 0,
    reactionMessage: null,
    actionSequence: [],
  })
  vi.clearAllMocks()
})

afterEach(async () => {
  await Promise.resolve()
})

describe('usePetStore — initial state', () => {
  it('starts with pet as null', () => {
    expect(usePetStore.getState().pet).toBeNull()
  })
})

describe('usePetStore — care actions', () => {
  it('feed() raises hunger by 20 and happiness by 5', async () => {
    usePetStore.setState({ pet: makePet(50, 50, 50) })
    usePetStore.getState().feed()

    const { hunger, happiness, energy } = usePetStore.getState().pet!
    expect(hunger.value).toBe(70)
    expect(happiness.value).toBe(55)
    expect(energy.value).toBe(50)

    await Promise.resolve()
    const db = await getDatabase()
    expect(db.run).toHaveBeenCalledWith(
      'UPDATE pets SET hunger=?, happiness=?, energy=?, state=? WHERE 1',
      [70, 55, 50, 'normal'],
    )
    expect(saveDb).toHaveBeenCalled()
  })

  it('play() raises happiness by 20 and lowers energy by 5', async () => {
    usePetStore.setState({ pet: makePet(50, 50, 50) })
    usePetStore.getState().play()

    const { hunger, happiness, energy } = usePetStore.getState().pet!
    expect(hunger.value).toBe(50)
    expect(happiness.value).toBe(70)
    expect(energy.value).toBe(45)

    await Promise.resolve()
    const db = await getDatabase()
    expect(db.run).toHaveBeenCalledWith(
      'UPDATE pets SET hunger=?, happiness=?, energy=?, state=? WHERE 1',
      [50, 70, 45, 'normal'],
    )
    expect(saveDb).toHaveBeenCalled()
  })

  it('rest() raises energy by 20 and happiness by 5', async () => {
    usePetStore.setState({ pet: makePet(50, 50, 50) })
    usePetStore.getState().rest()

    const { hunger, happiness, energy } = usePetStore.getState().pet!
    expect(hunger.value).toBe(50)
    expect(happiness.value).toBe(55)
    expect(energy.value).toBe(70)

    await Promise.resolve()
    const db = await getDatabase()
    expect(db.run).toHaveBeenCalledWith(
      'UPDATE pets SET hunger=?, happiness=?, energy=?, state=? WHERE 1',
      [50, 55, 70, 'normal'],
    )
    expect(saveDb).toHaveBeenCalled()
  })

  it('clamps feed and rest increments to each stat max', () => {
    usePetStore.setState({ pet: makePet(95, 98, 96) })
    usePetStore.getState().feed()
    usePetStore.getState().rest()

    const { hunger, happiness, energy } = usePetStore.getState().pet!
    expect(hunger.value).toBe(100)
    expect(happiness.value).toBe(100)
    expect(energy.value).toBe(100)
  })

  it('clamps play energy decrement at 0', () => {
    usePetStore.setState({ pet: makePet(50, 50, 2) })
    usePetStore.getState().play()
    expect(usePetStore.getState().pet!.energy.value).toBe(0)
  })

  it('all actions are no-ops when pet is null', () => {
    usePetStore.setState({ pet: null })

    expect(() => usePetStore.getState().feed()).not.toThrow()
    expect(() => usePetStore.getState().play()).not.toThrow()
    expect(() => usePetStore.getState().rest()).not.toThrow()

    expect(usePetStore.getState().pet).toBeNull()
    expect(getDatabase).not.toHaveBeenCalled()
    expect(saveDb).not.toHaveBeenCalled()
  })

  it('triggers the easter egg reaction on feed -> play -> rest', () => {
    usePetStore.setState({ pet: makePet(90, 90, 90) })

    usePetStore.getState().feed()
    usePetStore.getState().play()
    usePetStore.getState().rest()

    expect(usePetStore.getState().reactionMessage).toBe('Secret combo unlocked! Pixel power activated!')
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

  it('sets state to sick when any stat reaches 0', () => {
    usePetStore.setState({ pet: makePet(1, 50, 50) })
    usePetStore.getState().tick()
    expect(usePetStore.getState().pet!.state).toBe('sick')
    expect(usePetStore.getState().evolutionStreak).toBe(0)
  })

  it('evolves after 3 consecutive healthy ticks', () => {
    usePetStore.setState({ pet: makePet(100, 100, 100), evolutionStreak: 0 })

    usePetStore.getState().tick()
    expect(usePetStore.getState().pet!.state).toBe('normal')
    expect(usePetStore.getState().evolutionStreak).toBe(1)

    usePetStore.getState().tick()
    expect(usePetStore.getState().pet!.state).toBe('normal')
    expect(usePetStore.getState().evolutionStreak).toBe(2)

    usePetStore.getState().tick()
    expect(usePetStore.getState().pet!.state).toBe('evolved')
    expect(usePetStore.getState().evolutionStreak).toBe(3)
  })

  it('resets evolution streak when healthy threshold breaks', () => {
    usePetStore.setState({ pet: makePet(79, 100, 100), evolutionStreak: 2 })
    usePetStore.getState().tick()
    expect(usePetStore.getState().pet!.state).toBe('normal')
    expect(usePetStore.getState().evolutionStreak).toBe(0)
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

  it('persists state together with stats', async () => {
    usePetStore.setState({ pet: makePet(1, 50, 50) })
    usePetStore.getState().tick()

    await Promise.resolve()
    const db = await getDatabase()
    expect(db.run).toHaveBeenCalledWith(
      'UPDATE pets SET hunger=?, happiness=?, energy=?, state=? WHERE 1',
      [0, 46, 47, 'sick'],
    )
    expect(saveDb).toHaveBeenCalled()
  })
})

describe('usePetStore — state recovery and action rules', () => {
  it('recovers from sick to normal when all stats are above 0', () => {
    usePetStore.setState({
      pet: makePet(0, 50, 50, 'sick'),
      evolutionStreak: 0,
    })

    usePetStore.getState().feed()
    expect(usePetStore.getState().pet!.state).toBe('normal')
  })

  it('care action does not increase evolution streak by itself', () => {
    usePetStore.setState({ pet: makePet(90, 90, 90), evolutionStreak: 2 })
    usePetStore.getState().feed()
    expect(usePetStore.getState().evolutionStreak).toBe(2)
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
