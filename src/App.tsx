import { useEffect } from 'react'
import { usePetStore } from './store/usePetStore'
import { PetDisplay } from './components/PetDisplay'
import type { Pet } from './types'

// TODO: remove in Phase 4 — replaced by generatePet()
const PHASE3_SEED: Pet = {
  name: 'Pochi',
  hunger:    { value: 80,  max: 100, isSpecial: false },
  happiness: { value: 60,  max: 200, isSpecial: true  },
  energy:    { value: 100, max: 100, isSpecial: false },
  state: 'normal',
}

function App() {
  useEffect(() => {
    usePetStore.setState({ pet: PHASE3_SEED })
  }, [])

  return (
    <div>
      <h1>Tamagotchi</h1>
      <PetDisplay />
    </div>
  )
}

export default App
