import { usePetStore } from '../usePetStore'

beforeEach(() => {
  usePetStore.setState({ name: '' })
})

describe('usePetStore — name', () => {
  it('starts with an empty name', () => {
    expect(usePetStore.getState().name).toBe('')
  })

  it('setName updates the name', () => {
    usePetStore.getState().setName('Mochi')
    expect(usePetStore.getState().name).toBe('Mochi')
  })

  it('setName overwrites a previous name', () => {
    usePetStore.getState().setName('A')
    usePetStore.getState().setName('B')
    expect(usePetStore.getState().name).toBe('B')
  })

  it('setName accepts an empty string', () => {
    usePetStore.getState().setName('Mochi')
    usePetStore.getState().setName('')
    expect(usePetStore.getState().name).toBe('')
  })
})
