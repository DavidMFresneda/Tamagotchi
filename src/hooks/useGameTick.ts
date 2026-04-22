import { useEffect } from 'react'
import { usePetStore } from '../store/usePetStore'
import { TICK_INTERVAL_MS } from '../config'

export function useGameTick(): void {
  useEffect(() => {
    const id = setInterval(() => {
      usePetStore.getState().tick()
    }, TICK_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])
}
