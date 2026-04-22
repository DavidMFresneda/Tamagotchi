import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PetPixelArt } from '../PetPixelArt'
import type { Pet } from '../../types'

describe('PetPixelArt', () => {
  const mockPet: Pet = {
    name: 'TestPet',
    hunger: { value: 50, max: 100, isSpecial: false },
    happiness: { value: 75, max: 100, isSpecial: false },
    energy: { value: 60, max: 100, isSpecial: false },
    state: 'normal',
  }

  it('renders SVG pixel art', () => {
    const { container } = render(<PetPixelArt pet={mockPet} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('applies idle animation by default', () => {
    const { container } = render(<PetPixelArt pet={mockPet} />)
    const petArt = container.querySelector('.pet-pixel-art')
    expect(petArt).toHaveClass('pet-animation-idle')
  })

  it('applies eating animation when specified', () => {
    const { container } = render(<PetPixelArt pet={mockPet} animationState="eating" />)
    const petArt = container.querySelector('.pet-pixel-art')
    expect(petArt).toHaveClass('pet-animation-eating')
  })

  it('applies playing animation when specified', () => {
    const { container } = render(<PetPixelArt pet={mockPet} animationState="playing" />)
    const petArt = container.querySelector('.pet-pixel-art')
    expect(petArt).toHaveClass('pet-animation-playing')
  })

  it('applies sleeping animation when specified', () => {
    const { container } = render(<PetPixelArt pet={mockPet} animationState="sleeping" />)
    const petArt = container.querySelector('.pet-pixel-art')
    expect(petArt).toHaveClass('pet-animation-sleeping')
  })

  it('applies normal face class for healthy pet', () => {
    const { container } = render(<PetPixelArt pet={mockPet} />)
    const petArt = container.querySelector('.pet-pixel-art')
    expect(petArt).toHaveClass('pet-face-normal')
  })

  it('applies sick face class for sick pet', () => {
    const sickPet: Pet = { ...mockPet, state: 'sick' }
    const { container } = render(<PetPixelArt pet={sickPet} />)
    const petArt = container.querySelector('.pet-pixel-art')
    expect(petArt).toHaveClass('pet-face-sick')
  })

  it('applies evolved face class for evolved pet', () => {
    const evolvedPet: Pet = { ...mockPet, state: 'evolved' }
    const { container } = render(<PetPixelArt pet={evolvedPet} />)
    const petArt = container.querySelector('.pet-pixel-art')
    expect(petArt).toHaveClass('pet-face-evolved')
  })

  it('applies hungry face class when hunger is critical', () => {
    const hungryPet: Pet = {
      ...mockPet,
      hunger: { value: 20, max: 100, isSpecial: false },
    }
    const { container } = render(<PetPixelArt pet={hungryPet} />)
    const petArt = container.querySelector('.pet-pixel-art')
    expect(petArt).toHaveClass('pet-face-hungry')
  })

  it('applies happy face class when happy and playing', () => {
    const happyPet: Pet = {
      ...mockPet,
      happiness: { value: 90, max: 100, isSpecial: false },
    }
    const { container } = render(<PetPixelArt pet={happyPet} animationState="playing" />)
    const petArt = container.querySelector('.pet-pixel-art')
    expect(petArt).toHaveClass('pet-face-happy')
  })

  it('applies sleeping face class when energy is low and sleeping', () => {
    const tiredPet: Pet = {
      ...mockPet,
      energy: { value: 20, max: 100, isSpecial: false },
    }
    const { container } = render(<PetPixelArt pet={tiredPet} animationState="sleeping" />)
    const petArt = container.querySelector('.pet-pixel-art')
    expect(petArt).toHaveClass('pet-face-sleeping')
  })

  it('applies dead face class when pet is severely neglected', () => {
    const deadPet: Pet = {
      ...mockPet,
      hunger: { value: 5, max: 100, isSpecial: false },
      happiness: { value: 5, max: 100, isSpecial: false },
    }
    const { container } = render(<PetPixelArt pet={deadPet} />)
    const petArt = container.querySelector('.pet-pixel-art')
    expect(petArt).toHaveClass('pet-face-dead')
  })
})
