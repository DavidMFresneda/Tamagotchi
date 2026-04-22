import type { Pet, PetState, Stat } from '../index'

describe('PetState', () => {
  it('accepts all valid literals', () => {
    const states: PetState[] = ['normal', 'sick', 'evolved']
    expect(states).toHaveLength(3)
  })
})

describe('Stat interface shape', () => {
  it('accepts a normal stat', () => {
    const stat: Stat = { value: 80, max: 100, isSpecial: false }
    expect(stat.value).toBe(80)
    expect(stat.max).toBe(100)
    expect(stat.isSpecial).toBe(false)
  })

  it('accepts a special stat with double max', () => {
    const stat: Stat = { value: 150, max: 200, isSpecial: true }
    expect(stat.max).toBe(200)
    expect(stat.isSpecial).toBe(true)
  })
})

describe('Pet interface shape', () => {
  it('accepts a fully-populated pet with Stat objects', () => {
    const pet: Pet = {
      name: 'Blob',
      hunger:    { value: 80,  max: 100, isSpecial: false },
      happiness: { value: 60,  max: 100, isSpecial: false },
      energy:    { value: 100, max: 100, isSpecial: false },
      state: 'normal',
    }
    expect(pet.name).toBe('Blob')
    expect(pet.hunger.value).toBe(80)
    expect(pet.state).toBe('normal')
  })

  it('accepts a pet with special stats', () => {
    const pet: Pet = {
      name: 'Zap',
      hunger:    { value: 200, max: 200, isSpecial: true },
      happiness: { value: 100, max: 100, isSpecial: false },
      energy:    { value: 200, max: 200, isSpecial: true },
      state: 'evolved',
    }
    expect(pet.hunger.isSpecial).toBe(true)
    expect(pet.energy.max).toBe(200)
    expect(pet.state).toBe('evolved')
  })

  it('accepts sick and evolved states', () => {
    const zeroed: Stat = { value: 0, max: 100, isSpecial: false }
    const full: Stat   = { value: 100, max: 100, isSpecial: false }
    const sick: Pet    = { name: 'X', hunger: zeroed, happiness: zeroed, energy: zeroed, state: 'sick' }
    const evolved: Pet = { name: 'Y', hunger: full,   happiness: full,   energy: full,   state: 'evolved' }
    expect(sick.state).toBe('sick')
    expect(evolved.state).toBe('evolved')
  })
})
