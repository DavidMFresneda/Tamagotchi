import { create } from 'zustand'
import type { Pet } from '../types'

interface PetStore {
  pet: Pet | null
  feed: () => void
  play: () => void
  rest: () => void
  tick: () => void
  generatePet: () => void
}

export const usePetStore = create<PetStore>(() => ({
  pet: null,
  feed: () => {},
  play: () => {},
  rest: () => {},
  tick: () => {},
  generatePet: () => {},
}))
