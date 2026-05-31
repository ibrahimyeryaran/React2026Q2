import type { Item } from '../types'

export const mockItems: Item[] = [
  {
    id: 1,
    name: 'Bulbasaur',
    description: 'Height: 0.7m | Weight: 6.9kg | Type: grass/poison',
    image: 'https://example.com/bulbasaur.png',
    height: 7,
    weight: 69,
    types: ['grass', 'poison'],
  },
  {
    id: 2,
    name: 'Charmander',
    description: 'Height: 0.6m | Weight: 8.5kg | Type: fire',
    image: 'https://example.com/charmander.png',
    height: 6,
    weight: 85,
    types: ['fire'],
  },
]
