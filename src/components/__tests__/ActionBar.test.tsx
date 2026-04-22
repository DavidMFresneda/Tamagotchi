import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { usePetStore } from '../../store/usePetStore'
import { ActionBar } from '../ActionBar'
import type { Pet } from '../../types'

const mockPet: Pet = {
  name: 'Testi',
  hunger:    { value: 50, max: 100, isSpecial: false },
  happiness: { value: 50, max: 100, isSpecial: false },
  energy:    { value: 50, max: 100, isSpecial: false },
  state: 'normal',
}

beforeEach(() => {
  usePetStore.setState({
    pet: mockPet,
    feed: vi.fn(),
    play: vi.fn(),
    rest: vi.fn(),
  })
})

describe('<ActionBar>', () => {
  it('renders Feed, Play, and Rest buttons', () => {
    render(<ActionBar />)
    expect(screen.getByRole('button', { name: /feed/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /rest/i })).toBeInTheDocument()
  })

  it('disables all buttons when pet is null', () => {
    usePetStore.setState({ pet: null })
    render(<ActionBar />)

    expect(screen.getByRole('button', { name: /feed/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /play/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /rest/i })).toBeDisabled()
  })

  it('calls matching store actions on click', async () => {
    const user = userEvent.setup()
    const feed = vi.fn()
    const play = vi.fn()
    const rest = vi.fn()

    usePetStore.setState({ pet: mockPet, feed, play, rest })
    render(<ActionBar />)

    await user.click(screen.getByRole('button', { name: /feed/i }))
    await user.click(screen.getByRole('button', { name: /play/i }))
    await user.click(screen.getByRole('button', { name: /rest/i }))

    expect(feed).toHaveBeenCalledTimes(1)
    expect(play).toHaveBeenCalledTimes(1)
    expect(rest).toHaveBeenCalledTimes(1)
  })
})