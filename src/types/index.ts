export type PetState = 'normal' | 'sick' | 'evolved'

export interface Pet {
  name: string
  hunger: number
  happiness: number
  energy: number
  state: PetState
}
