import { PET_NAMES } from '../petNames'

describe('PET_NAMES', () => {
  it('contains exactly 20 entries', () => {
    expect(PET_NAMES).toHaveLength(20)
  })

  it('all entries are non-empty strings', () => {
    PET_NAMES.forEach(name => {
      expect(typeof name).toBe('string')
      expect(name.length).toBeGreaterThan(0)
    })
  })

  it('has no duplicate names', () => {
    const unique = new Set(PET_NAMES)
    expect(unique.size).toBe(PET_NAMES.length)
  })
})
