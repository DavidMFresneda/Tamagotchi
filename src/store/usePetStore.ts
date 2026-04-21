import { create } from 'zustand'

interface PetState {
  name: string
  setName: (name: string) => void
}

export const usePetStore = create<PetState>((set) => ({
  name: '',
  setName: (name) => set({ name }),
}))
