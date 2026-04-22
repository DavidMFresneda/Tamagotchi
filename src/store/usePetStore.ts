import { create } from 'zustand'
import type { Pet, Stat } from '../types'
import { PET_NAMES } from '../data/petNames'
import { getDatabase, saveDb } from '../db/database'
import { DECAY, REPLENISH, SIDE_EFFECT } from '../config'

type CareAction = 'feed' | 'play' | 'rest'

interface PetStore {
  pet: Pet | null
  evolutionStreak: number
  reactionMessage: string | null
  actionSequence: CareAction[]
  feed: () => void
  play: () => void
  rest: () => void
  tick: () => void
  generatePet: () => void
}

const EVOLVE_THRESHOLD = 0.8
const EVOLVE_TICKS = 3
const EASTER_EGG_SEQUENCE: CareAction[] = ['feed', 'play', 'rest']

const REACTIONS: Record<CareAction, string> = {
  feed: 'Yum! That was delicious!',
  play: 'Whee! Lets play again!',
  rest: 'Zzz... feeling better now.',
}

const EASTER_EGG_REACTION = 'Secret combo unlocked! Pixel power activated!'

function rollStat(): Stat {
  const isSpecial = Math.random() < 0.1
  const max = isSpecial ? 200 : 100
  return { value: max, max, isSpecial }
}

function evaluateState(pet: Pet, evolutionStreak: number, source: 'tick' | 'action') {
  const hasZeroStat = pet.hunger.value === 0 || pet.happiness.value === 0 || pet.energy.value === 0
  if (hasZeroStat) {
    return { nextState: 'sick' as const, nextStreak: 0 }
  }

  const allHealthy =
    pet.hunger.value >= pet.hunger.max * EVOLVE_THRESHOLD
    && pet.happiness.value >= pet.happiness.max * EVOLVE_THRESHOLD
    && pet.energy.value >= pet.energy.max * EVOLVE_THRESHOLD

  if (!allHealthy) {
    return { nextState: 'normal' as const, nextStreak: 0 }
  }

  const nextStreak = source === 'tick' ? evolutionStreak + 1 : evolutionStreak
  if (nextStreak >= EVOLVE_TICKS) {
    return { nextState: 'evolved' as const, nextStreak }
  }

  return { nextState: 'normal' as const, nextStreak }
}

function nextActionSequence(currentSequence: CareAction[], action: CareAction): CareAction[] {
  const updated = [...currentSequence, action].slice(-EASTER_EGG_SEQUENCE.length)
  return updated
}

function persistStats(pet: Pet): void {
  getDatabase().then(db => {
    db.run(
      'UPDATE pets SET hunger=?, happiness=?, energy=?, state=? WHERE 1',
      [pet.hunger.value, pet.happiness.value, pet.energy.value, pet.state],
    )
    saveDb()
  })
}

export const usePetStore = create<PetStore>((set, get) => ({
  pet: null,
  evolutionStreak: 0,
  reactionMessage: null,
  actionSequence: [],
  feed: () => {
    const { pet, evolutionStreak, actionSequence } = get()
    if (!pet) return

    const updatedStats: Pet = {
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

    const evaluation = evaluateState(updatedStats, evolutionStreak, 'action')
    const updated: Pet = { ...updatedStats, state: evaluation.nextState }
    const sequence = nextActionSequence(actionSequence, 'feed')
    const isEasterEgg = sequence.join('|') === EASTER_EGG_SEQUENCE.join('|')

    set({
      pet: updated,
      evolutionStreak: evaluation.nextStreak,
      actionSequence: sequence,
      reactionMessage: isEasterEgg ? EASTER_EGG_REACTION : REACTIONS.feed,
    })
    persistStats(updated)
  },
  play: () => {
    const { pet, evolutionStreak, actionSequence } = get()
    if (!pet) return

    const updatedStats: Pet = {
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

    const evaluation = evaluateState(updatedStats, evolutionStreak, 'action')
    const updated: Pet = { ...updatedStats, state: evaluation.nextState }
    const sequence = nextActionSequence(actionSequence, 'play')
    const isEasterEgg = sequence.join('|') === EASTER_EGG_SEQUENCE.join('|')

    set({
      pet: updated,
      evolutionStreak: evaluation.nextStreak,
      actionSequence: sequence,
      reactionMessage: isEasterEgg ? EASTER_EGG_REACTION : REACTIONS.play,
    })
    persistStats(updated)
  },
  rest: () => {
    const { pet, evolutionStreak, actionSequence } = get()
    if (!pet) return

    const updatedStats: Pet = {
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

    const evaluation = evaluateState(updatedStats, evolutionStreak, 'action')
    const updated: Pet = { ...updatedStats, state: evaluation.nextState }
    const sequence = nextActionSequence(actionSequence, 'rest')
    const isEasterEgg = sequence.join('|') === EASTER_EGG_SEQUENCE.join('|')

    set({
      pet: updated,
      evolutionStreak: evaluation.nextStreak,
      actionSequence: sequence,
      reactionMessage: isEasterEgg ? EASTER_EGG_REACTION : REACTIONS.rest,
    })
    persistStats(updated)
  },

  tick: () => {
    const { pet, evolutionStreak } = get()
    if (!pet) return

    const updatedStats: Pet = {
      ...pet,
      hunger:    { ...pet.hunger,    value: Math.max(0, pet.hunger.value    - DECAY.hunger)    },
      happiness: { ...pet.happiness, value: Math.max(0, pet.happiness.value - DECAY.happiness) },
      energy:    { ...pet.energy,    value: Math.max(0, pet.energy.value    - DECAY.energy)    },
    }

    const evaluation = evaluateState(updatedStats, evolutionStreak, 'tick')
    const updated: Pet = { ...updatedStats, state: evaluation.nextState }

    set({
      pet: updated,
      evolutionStreak: evaluation.nextStreak,
      reactionMessage: null,
    })
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
    set({ pet, evolutionStreak: 0, reactionMessage: null, actionSequence: [] })

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
