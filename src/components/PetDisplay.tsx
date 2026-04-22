import { usePetStore } from '../store/usePetStore'
import { StatBar } from './StatBar'

export function PetDisplay() {
  const pet = usePetStore((state) => state.pet)
  if (!pet) return null
  return (
    <div className="pet-display">
      <h2>{pet.name}</h2>
      <StatBar label="Hunger" stat={pet.hunger} />
      <StatBar label="Happiness" stat={pet.happiness} />
      <StatBar label="Energy" stat={pet.energy} />
    </div>
  )
}
