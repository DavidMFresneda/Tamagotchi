import type { Stat } from '../types'

interface Props {
  label: string
  stat: Stat
}

export function StatBar({ label, stat }: Props) {
  const pct = Math.round((stat.value / stat.max) * 100)
  return (
    <div className="stat-row">
      <span className="stat-label">
        {stat.isSpecial && <span className="star">★</span>}
        {label}
      </span>
      <div className="stat-bar-track">
        <div
          className={`stat-bar-fill${stat.isSpecial ? ' special' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
