import { render, screen } from '@testing-library/react'
import { StatBar } from '../StatBar'
import type { Stat } from '../../types'

const normalStat: Stat = { value: 80, max: 100, isSpecial: false }
const specialStat: Stat = { value: 60, max: 200, isSpecial: true }

describe('<StatBar> — normal stat', () => {
  it('renders the label', () => {
    render(<StatBar label="Hunger" stat={normalStat} />)
    expect(screen.getByText(/hunger/i)).toBeInTheDocument()
  })

  it('fill width reflects value/max ratio', () => {
    const { container } = render(<StatBar label="Hunger" stat={normalStat} />)
    const fill = container.querySelector('.stat-bar-fill') as HTMLElement
    expect(fill.style.width).toBe('80%')
  })

  it('does not render the star', () => {
    render(<StatBar label="Hunger" stat={normalStat} />)
    expect(screen.queryByText('★')).not.toBeInTheDocument()
  })

  it('does not apply .special class to fill', () => {
    const { container } = render(<StatBar label="Hunger" stat={normalStat} />)
    const fill = container.querySelector('.stat-bar-fill')
    expect(fill).not.toHaveClass('special')
  })
})

describe('<StatBar> — special stat', () => {
  it('renders the star prefix', () => {
    render(<StatBar label="Happiness" stat={specialStat} />)
    expect(screen.getByText('★')).toBeInTheDocument()
  })

  it('fill width reflects value/max with double ceiling', () => {
    const { container } = render(<StatBar label="Happiness" stat={specialStat} />)
    const fill = container.querySelector('.stat-bar-fill') as HTMLElement
    // 60/200 = 30%
    expect(fill.style.width).toBe('30%')
  })

  it('applies .special class to fill', () => {
    const { container } = render(<StatBar label="Happiness" stat={specialStat} />)
    const fill = container.querySelector('.stat-bar-fill')
    expect(fill).toHaveClass('special')
  })
})
