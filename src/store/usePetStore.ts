import { create } from 'zustand'
import type { Pet, Stat } from '../types'
import { PET_NAMES } from '../data/petNames'
import { getDatabase, saveDb } from '../db/database'

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

export const usePetStore = create<PetStore>((set) => ({
  pet: null,
  feed: () => {},
  play: () => {},
  rest: () => {},
  tick: () => {},
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
