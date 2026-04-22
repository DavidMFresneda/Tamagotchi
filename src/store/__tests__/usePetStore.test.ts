import { usePetStore } from '../usePetStore'

beforeEach(() => {
  usePetStore.setState({ pet: null })
})

describe('usePetStore — initial state', () => {
  it('starts with pet as null', () => {
    expect(usePetStore.getState().pet).toBeNull()
  })
})

describe('usePetStore — action stubs', () => {
  it('feed is callable without throwing', () => {
    expect(() => usePetStore.getState().feed()).not.toThrow()
  })

  it('play is callable without throwing', () => {
    expect(() => usePetStore.getState().play()).not.toThrow()
  })

  it('rest is callable without throwing', () => {
    expect(() => usePetStore.getState().rest()).not.toThrow()
  })

  it('tick is callable without throwing', () => {
    expect(() => usePetStore.getState().tick()).not.toThrow()
  })

  it('generatePet is callable without throwing', () => {
    expect(() => usePetStore.getState().generatePet()).not.toThrow()
  })

  it('stubs do not mutate pet', () => {
    usePetStore.getState().feed()
    usePetStore.getState().tick()
    expect(usePetStore.getState().pet).toBeNull()
  })
})
