import type { Item } from '../types'

export const mockItems: Item[] = [
  {
    id: 1,
    name: 'Bulbasaur',
    description: 'Height: 0.7m | Weight: 6.9kg | Type: grass/poison',
    types: ['grass', 'poison'],
  },
  {
    id: 2,
    name: 'Charmander',
    description: 'Height: 0.6m | Weight: 8.5kg | Type: fire',
    types: ['fire'],
  },
]

export const makePokemonListResponse = (names: string[]) => ({
  ok: true,
  json: async () => ({
    count: names.length,
    next: null,
    previous: null,
    results: names.map((name, i) => ({
      name,
      url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
    })),
  }),
})

export const makePokemonDetailResponse = (
  id: number,
  name: string,
  typeName = 'grass',
) => ({
  ok: true,
  json: async () => ({
    id,
    name,
    height: 7,
    weight: 69,
    sprites: {
      front_default: `https://example.com/${name}.png`,
      other: {
        'official-artwork': {
          front_default: `https://example.com/${name}-art.png`,
        },
      },
    },
    types: [{ slot: 1, type: { name: typeName, url: '' } }],
  }),
})
