import { render, screen } from '@testing-library/react'
import { usePetStore } from '../../store/usePetStore'
import { PetDisplay } from '../PetDisplay'
import type { Pet } from '../../types'

const mockPet: Pet = {
  name: 'Testi',
  hunger:    { value: 80,  max: 100, isSpecial: false },
  happiness: { value: 60,  max: 200, isSpecial: true  },
  energy:    { value: 50,  max: 100, isSpecial: false },
  state: 'normal',
}

beforeEach(() => {
  usePetStore.setState({ pet: null })
})

describe('<PetDisplay> — with pet', () => {
  beforeEach(() => {
    usePetStore.setState({ pet: mockPet })
  })

  it('renders the pet name', () => {
    render(<PetDisplay />)
    expect(screen.getByText('Testi')).toBeInTheDocument()
  })

  it('renders all three stat labels', () => {
    render(<PetDisplay />)
    expect(screen.getByText(/hunger/i)).toBeInTheDocument()
    expect(screen.getByText(/happiness/i)).toBeInTheDocument()
    expect(screen.getByText(/energy/i)).toBeInTheDocument()
  })

  it('marks the special stat with a star', () => {
    render(<PetDisplay />)
    expect(screen.getByText('★')).toBeInTheDocument()
  })
})

describe('<PetDisplay> — null pet', () => {
  it('renders nothing when pet is null', () => {
    const { container } = render(<PetDisplay />)
    expect(container.firstChild).toBeNull()
  })
})
