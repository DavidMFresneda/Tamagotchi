import { usePetStore } from '../store/usePetStore'

export function ActionBar() {
  const pet = usePetStore((state) => state.pet)
  const feed = usePetStore((state) => state.feed)
  const play = usePetStore((state) => state.play)
  const rest = usePetStore((state) => state.rest)
  const disabled = pet === null

  return (
    <div className="action-bar">
      <button className="action-button" type="button" onClick={feed} disabled={disabled}>
        🍖 Feed
      </button>
      <button className="action-button" type="button" onClick={play} disabled={disabled}>
        🎮 Play
      </button>
      <button className="action-button" type="button" onClick={rest} disabled={disabled}>
        💤 Rest
      </button>
    </div>
  )
}