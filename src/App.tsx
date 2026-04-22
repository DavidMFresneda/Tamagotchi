import { useEffect } from 'react'
import { usePetStore } from './store/usePetStore'
import { getDatabase } from './db/database'
import { PetDisplay } from './components/PetDisplay'
import type { Pet } from './types'

function App() {
  useEffect(() => {
    async function boot() {
      const db = await getDatabase()
      const result = db.exec('SELECT * FROM pets LIMIT 1')
      if (result.length && result[0].values.length) {
        const [row] = result[0].values
        const [, name, hunger, hunger_max, hunger_special,
               happiness, happiness_max, happiness_special,
               energy, energy_max, energy_special, state] = row as any[]
        const pet: Pet = {
          name:      String(name),
          hunger:    { value: Number(hunger),    max: Number(hunger_max),    isSpecial: hunger_special    === 1 },
          happiness: { value: Number(happiness), max: Number(happiness_max), isSpecial: happiness_special === 1 },
          energy:    { value: Number(energy),    max: Number(energy_max),    isSpecial: energy_special    === 1 },
          state:     state as Pet['state'],
        }
        usePetStore.setState({ pet })
      } else {
        usePetStore.getState().generatePet()
      }
    }
    boot()
  }, [])

  return (
    <div>
      <h1>Tamagotchi</h1>
      <PetDisplay />
    </div>
  )
}

export default App
