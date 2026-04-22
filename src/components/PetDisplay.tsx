import { usePetStore } from '../store/usePetStore'
import { PetPixelArt } from './PetPixelArt'
import { StatBar } from './StatBar'

export function PetDisplay() {
  const pet = usePetStore((state) => state.pet)
  const reactionMessage = usePetStore((state) => state.reactionMessage)
  const animationState = usePetStore((state) => state.animationState)
  
  if (!pet) return null

  const stateLabel =
    pet.state === 'evolved' ? 'Evolved' : pet.state === 'sick' ? 'Sick' : 'Normal'

  return (
    <div className={`pet-display pet-state-${pet.state}`}>
      <h2>{pet.name}</h2>
      <p className="pet-state-badge">State: {stateLabel}</p>
      
      {/* Pixel Art Display */}
      <PetPixelArt pet={pet} animationState={animationState} />
      
      {/* Stats */}
      <StatBar label="Hunger" stat={pet.hunger} />
      <StatBar label="Happiness" stat={pet.happiness} />
      <StatBar label="Energy" stat={pet.energy} />
      
      {/* Reaction Message */}
      {reactionMessage && <p className="reaction-message">{reactionMessage}</p>}
    </div>
  )
}
