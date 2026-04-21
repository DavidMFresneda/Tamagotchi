import type { Pet, PetState } from '../index'

describe('PetState', () => {
  it('accepts all valid literals', () => {
    const states: PetState[] = ['normal', 'sick', 'evolved']
    expect(states).toHaveLength(3)
  })
})

describe('Pet interface shape', () => {
  it('accepts a fully-populated pet', () => {
    const pet: Pet = {
      name: 'Blob',
      hunger: 80,
      happiness: 60,
      energy: 100,
      state: 'normal',
    }
    expect(pet.name).toBe('Blob')
    expect(pet.state).toBe('normal')
  })

  it('accepts sick and evolved states', () => {
    const sick: Pet = { name: 'X', hunger: 0, happiness: 0, energy: 0, state: 'sick' }
    const evolved: Pet = { name: 'Y', hunger: 100, happiness: 100, energy: 100, state: 'evolved' }
    expect(sick.state).toBe('sick')
    expect(evolved.state).toBe('evolved')
  })
})
