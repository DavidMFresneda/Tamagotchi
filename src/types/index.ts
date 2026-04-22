export type PetState = 'normal' | 'sick' | 'evolved'

export interface Stat {
  value: number
  max: number
  isSpecial: boolean
}

export interface Pet {
  name: string
  hunger: Stat
  happiness: Stat
  energy: Stat
  state: PetState
}
