import { render, screen } from '@testing-library/react'
import App from '../../App'

describe('<App />', () => {
  it('renders the Tamagotchi heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /tamagotchi/i })).toBeInTheDocument()
  })
})
