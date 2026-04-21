import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (import.meta.env.DEV) {
  async function smokeTest() {
    const { getDatabase, saveDb } = await import('./db/database')
    const db = await getDatabase()
    db.run("INSERT INTO pets (name, hunger, happiness, energy, state) VALUES ('Pixel', 50, 70, 80, 'normal')")
    saveDb()
    const result = db.exec('SELECT * FROM pets')
    console.log('[smokeTest] pets after reload:', result)
  }
  smokeTest()
}
