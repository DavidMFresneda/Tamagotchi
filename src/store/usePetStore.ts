import { create } from 'zustand'
import type { Pet, Stat } from '../types'
import { PET_NAMES } from '../data/petNames'
import { getDatabase, saveDb } from '../db/database'
import { DECAY, REPLENISH, SIDE_EFFECT } from '../config'

interface PetStore {
  pet: Pet | null
  feed: () => void
  play: () => void
  rest: () => void
  tick: () => void
  generatePet: () => void
}

function rollStat(): Stat {
  const isSpecial = Math.random() < 0.1
  const max = isSpecial ? 200 : 100
  return { value: max, max, isSpecial }
}

function persistStats(pet: Pet): void {
  getDatabase().then(db => {
    db.run(
      'UPDATE pets SET hunger=?, happiness=?, energy=? WHERE 1',
      [pet.hunger.value, pet.happiness.value, pet.energy.value],
    )
    saveDb()
  })
}

export const usePetStore = create<PetStore>((set, get) => ({
  pet: null,
  feed: () => {
    const { pet } = get()
    if (!pet) return

    const updated: Pet = {
      ...pet,
      hunger: {
        ...pet.hunger,
        value: Math.min(pet.hunger.max, pet.hunger.value + REPLENISH),
      },
      happiness: {
        ...pet.happiness,
        value: Math.min(pet.happiness.max, pet.happiness.value + SIDE_EFFECT),
      },
    }

    set({ pet: updated })
    persistStats(updated)
  },
  play: () => {
    const { pet } = get()
    if (!pet) return

    const updated: Pet = {
      ...pet,
      happiness: {
        ...pet.happiness,
        value: Math.min(pet.happiness.max, pet.happiness.value + REPLENISH),
      },
      energy: {
        ...pet.energy,
        value: Math.max(0, pet.energy.value - SIDE_EFFECT),
      },
    }

    set({ pet: updated })
    persistStats(updated)
  },
  rest: () => {
    const { pet } = get()
    if (!pet) return

    const updated: Pet = {
      ...pet,
      happiness: {
        ...pet.happiness,
        value: Math.min(pet.happiness.max, pet.happiness.value + SIDE_EFFECT),
      },
      energy: {
        ...pet.energy,
        value: Math.min(pet.energy.max, pet.energy.value + REPLENISH),
      },
    }

    set({ pet: updated })
    persistStats(updated)
  },

  tick: () => {
    const { pet } = get()
    if (!pet) return

    const updated: Pet = {
      ...pet,
      hunger:    { ...pet.hunger,    value: Math.max(0, pet.hunger.value    - DECAY.hunger)    },
      happiness: { ...pet.happiness, value: Math.max(0, pet.happiness.value - DECAY.happiness) },
      energy:    { ...pet.energy,    value: Math.max(0, pet.energy.value    - DECAY.energy)    },
    }
    set({ pet: updated })
    persistStats(updated)
  },

  generatePet: () => {
    const name = PET_NAMES[Math.floor(Math.random() * PET_NAMES.length)]
    const pet: Pet = {
      name,
      hunger:    rollStat(),
      happiness: rollStat(),
      energy:    rollStat(),
      state: 'normal',
    }
    set({ pet })

    getDatabase().then(db => {
      db.run(
        `INSERT INTO pets
           (name, hunger, hunger_max, hunger_special,
            happiness, happiness_max, happiness_special,
            energy, energy_max, energy_special, state)
         VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        [
          pet.name,
          pet.hunger.value,    pet.hunger.max,    pet.hunger.isSpecial    ? 1 : 0,
          pet.happiness.value, pet.happiness.max, pet.happiness.isSpecial ? 1 : 0,
          pet.energy.value,    pet.energy.max,    pet.energy.isSpecial    ? 1 : 0,
          pet.state,
        ],
      )
      saveDb()
    })
  },
}))
