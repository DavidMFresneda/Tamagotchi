const { mockTick } = vi.hoisted(() => ({ mockTick: vi.fn() }))

vi.mock('../../store/usePetStore', () => ({
  usePetStore: { getState: () => ({ tick: mockTick }) },
}))

import { renderHook } from '@testing-library/react'
import { useGameTick } from '../useGameTick'
import { TICK_INTERVAL_MS } from '../../config'

beforeEach(() => {
  vi.useFakeTimers()
  vi.clearAllMocks()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useGameTick()', () => {
  it('starts a setInterval with TICK_INTERVAL_MS', () => {
    const spy = vi.spyOn(globalThis, 'setInterval')
    renderHook(() => useGameTick())
    expect(spy).toHaveBeenCalledWith(expect.any(Function), TICK_INTERVAL_MS)
  })

  it('calls tick() once after one interval', () => {
    renderHook(() => useGameTick())
    vi.advanceTimersByTime(TICK_INTERVAL_MS)
    expect(mockTick).toHaveBeenCalledTimes(1)
  })

  it('calls tick() multiple times across multiple intervals', () => {
    renderHook(() => useGameTick())
    vi.advanceTimersByTime(TICK_INTERVAL_MS * 3)
    expect(mockTick).toHaveBeenCalledTimes(3)
  })

  it('clears the interval on unmount — no further ticks fire', () => {
    const { unmount } = renderHook(() => useGameTick())
    unmount()
    vi.advanceTimersByTime(TICK_INTERVAL_MS * 5)
    expect(mockTick).not.toHaveBeenCalled()
  })
})
