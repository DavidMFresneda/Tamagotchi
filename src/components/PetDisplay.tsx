import { usePetStore } from '../store/usePetStore'
import { StatBar } from './StatBar'

export function PetDisplay() {
  const pet = usePetStore((state) => state.pet)
  const reactionMessage = usePetStore((state) => state.reactionMessage)
  if (!pet) return null

  const stateLabel =
    pet.state === 'evolved' ? 'Evolved' : pet.state === 'sick' ? 'Sick' : 'Normal'

  return (
    <div className={`pet-display pet-state-${pet.state}`}>
      <h2>{pet.name}</h2>
      <p className="pet-state-badge">State: {stateLabel}</p>
      <StatBar label="Hunger" stat={pet.hunger} />
      <StatBar label="Happiness" stat={pet.happiness} />
      <StatBar label="Energy" stat={pet.energy} />
      {reactionMessage && <p className="reaction-message">{reactionMessage}</p>}
    </div>
  )
}
