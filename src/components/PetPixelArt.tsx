import type { Pet } from '../types'
import '../styles/pet-pixel-art.css'

interface PetPixelArtProps {
  pet: Pet
  animationState?: 'idle' | 'eating' | 'playing' | 'sleeping'
}

export function PetPixelArt({ pet, animationState = 'idle' }: PetPixelArtProps) {
  // Determine emotions based on stats and state
  const isHungry = pet.hunger.value < pet.hunger.max * 0.3
  const isHappy = pet.happiness.value > pet.happiness.max * 0.7
  const isEnergyLow = pet.energy.value < pet.energy.max * 0.3
  const isDepressed = pet.hunger.value < pet.hunger.max * 0.1 || pet.happiness.value < pet.happiness.max * 0.1

  // Select face based on state and mood
  const getFaceType = () => {
    if (pet.state === 'evolved') return 'evolved'
    if (pet.state === 'sick') return 'sick'
    if (isDepressed) return 'dead'
    if (isHungry && animationState !== 'eating') return 'hungry'
    if (isHappy && animationState === 'playing') return 'happy'
    if (isEnergyLow && animationState === 'sleeping') return 'sleeping'
    return 'normal'
  }

  const faceType = getFaceType()

  return (
    <div className={`pet-pixel-art pet-animation-${animationState} pet-face-${faceType}`}>
      <svg width="96" height="96" viewBox="0 0 96 96" style={{ imageRendering: 'pixelated' }}>
        {/* Body */}
        <rect x="24" y="40" width="48" height="40" fill="#ffd700" />
        <rect x="20" y="36" width="56" height="4" fill="#ffed4e" />
        {/* Arms */}
        <rect x="8" y="48" width="16" height="12" fill="#ffd700" />
        <rect x="72" y="48" width="16" height="12" fill="#ffd700" />
        {/* Legs */}
        <rect x="32" y="80" width="12" height="12" fill="#ffd700" />
        <rect x="52" y="80" width="12" height="12" fill="#ffd700" />

        {/* Face rendering based on faceType */}
        <g className={`face face-${faceType}`}>
          {faceType === 'normal' && (
            <>
              {/* Normal happy face */}
              <circle cx="32" cy="48" r="3" fill="#000" className="eye left-eye" />
              <circle cx="64" cy="48" r="3" fill="#000" className="eye right-eye" />
              <path
                d="M 40 58 Q 48 64 56 58"
                stroke="#000"
                strokeWidth="2"
                fill="none"
                className="mouth"
              />
            </>
          )}

          {faceType === 'happy' && (
            <>
              {/* Big happy eyes with sparkles */}
              <circle cx="30" cy="46" r="4" fill="#000" className="eye left-eye" />
              <circle cx="66" cy="46" r="4" fill="#000" className="eye right-eye" />
              <circle cx="28" cy="44" r="1" fill="#fff" className="sparkle" />
              <circle cx="68" cy="44" r="1" fill="#fff" className="sparkle" />
              {/* Big smile */}
              <path
                d="M 35 60 Q 48 68 61 60"
                stroke="#000"
                strokeWidth="2"
                fill="none"
                className="mouth"
              />
              {/* Rosy cheeks */}
              <circle cx="20" cy="54" r="2" fill="#ff69b4" opacity="0.6" />
              <circle cx="76" cy="54" r="2" fill="#ff69b4" opacity="0.6" />
            </>
          )}

          {faceType === 'hungry' && (
            <>
              {/* Droopy eyes */}
              <path
                d="M 28 44 Q 32 50 36 46"
                stroke="#000"
                strokeWidth="2"
                fill="none"
                className="eye left-eye"
              />
              <path
                d="M 60 44 Q 64 50 68 46"
                stroke="#000"
                strokeWidth="2"
                fill="none"
                className="eye right-eye"
              />
              {/* Sad mouth */}
              <path
                d="M 40 62 Q 48 58 56 62"
                stroke="#000"
                strokeWidth="2"
                fill="none"
                className="mouth"
              />
              {/* Tears */}
              <line x1="32" y1="52" x2="32" y2="56" stroke="#87ceeb" strokeWidth="1" className="tear" />
              <line x1="64" y1="52" x2="64" y2="56" stroke="#87ceeb" strokeWidth="1" className="tear" />
            </>
          )}

          {faceType === 'sleeping' && (
            <>
              {/* Closed eyes (zzz) */}
              <line x1="26" y1="48" x2="36" y2="48" stroke="#000" strokeWidth="2" className="eye left-eye" />
              <line x1="60" y1="48" x2="70" y2="48" stroke="#000" strokeWidth="2" className="eye right-eye" />
              {/* Peaceful mouth */}
              <path
                d="M 42 62 Q 48 60 54 62"
                stroke="#000"
                strokeWidth="1"
                fill="none"
                className="mouth"
              />
              {/* ZZZ symbols */}
              <text x="72" y="28" fontSize="8" fill="#87ceeb" className="zzz" opacity="0.8">
                Z
              </text>
              <text x="82" y="20" fontSize="6" fill="#87ceeb" className="zzz" opacity="0.6">
                z
              </text>
            </>
          )}

          {faceType === 'sick' && (
            <>
              {/* X eyes */}
              <line x1="28" y1="44" x2="36" y2="52" stroke="#000" strokeWidth="2" className="eye left-eye" />
              <line x1="36" y1="44" x2="28" y2="52" stroke="#000" strokeWidth="2" />
              <line x1="60" y1="44" x2="68" y2="52" stroke="#000" strokeWidth="2" className="eye right-eye" />
              <line x1="68" y1="44" x2="60" y2="52" stroke="#000" strokeWidth="2" />
              {/* Wavy mouth (sick) */}
              <path
                d="M 40 62 Q 44 58 48 62 Q 52 58 56 62"
                stroke="#000"
                strokeWidth="2"
                fill="none"
                className="mouth"
              />
              {/* Blush marks */}
              <circle cx="18" cy="56" r="2" fill="#ff69b4" opacity="0.8" />
              <circle cx="78" cy="56" r="2" fill="#ff69b4" opacity="0.8" />
            </>
          )}

          {faceType === 'evolved' && (
            <>
              {/* Wise/fierce eyes */}
              <circle cx="30" cy="46" r="4" fill="#000" className="eye left-eye" />
              <circle cx="66" cy="46" r="4" fill="#000" className="eye right-eye" />
              <circle cx="30" cy="46" r="2" fill="#ffd700" className="pupil" />
              <circle cx="66" cy="46" r="2" fill="#ffd700" className="pupil" />
              {/* Determined mouth */}
              <line x1="40" y1="62" x2="56" y2="62" stroke="#000" strokeWidth="2" className="mouth" />
              {/* Crown/halo effect */}
              <line x1="28" y1="32" x2="68" y2="32" stroke="#ffd700" strokeWidth="2" />
              <circle cx="40" cy="28" r="2" fill="#ffd700" />
              <circle cx="56" cy="28" r="2" fill="#ffd700" />
            </>
          )}

          {faceType === 'dead' && (
            <>
              {/* Dead eyes (X) */}
              <line x1="28" y1="44" x2="36" y2="52" stroke="#000" strokeWidth="2" className="eye left-eye" />
              <line x1="36" y1="44" x2="28" y2="52" stroke="#000" strokeWidth="2" />
              <line x1="60" y1="44" x2="68" y2="52" stroke="#000" strokeWidth="2" className="eye right-eye" />
              <line x1="68" y1="44" x2="60" y2="52" stroke="#000" strokeWidth="2" />
              {/* Sad straight mouth */}
              <line x1="40" y1="64" x2="56" y2="64" stroke="#000" strokeWidth="2" className="mouth" />
              {/* Tongue out */}
              <rect x="46" y="64" width="4" height="4" fill="#ff69b4" />
            </>
          )}
        </g>
      </svg>
    </div>
  )
}
