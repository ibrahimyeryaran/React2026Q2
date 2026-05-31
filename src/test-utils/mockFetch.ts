import { vi } from 'vitest';
import type { PokemonDetail } from '../types';

export interface MockPokemon {
  id: number;
  name: string;
  type?: string;
}

/** Extracts the request URL whether fetch was called with a string or Request. */
export const urlOf = (input: unknown): string => {
  if (typeof input === 'string') return input;
  if (input instanceof Request) return input.url;
  return String(input);
};

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const buildDetail = (p: MockPokemon): PokemonDetail => ({
  id: p.id,
  name: p.name.toLowerCase(),
  height: 7,
  weight: 69,
  sprites: {
    front_default: `https://example.com/${p.name}.png`,
    other: {
      'official-artwork': {
        front_default: `https://example.com/${p.name}-art.png`,
      },
    },
  },
  types: [{ slot: 1, type: { name: p.type ?? 'grass', url: '' } }],
});

/**
 * Builds a fetch mock that routes PokeAPI list and detail requests
 * to the provided pokemon definitions. Useful for RTK Query tests.
 */
export function createFetchMock(pokemons: MockPokemon[]) {
  return vi.fn(async (input: RequestInfo | URL): Promise<Response> => {
    const url = urlOf(input);

    if (url.includes('pokemon?limit')) {
      return jsonResponse({
        count: pokemons.length,
        next: null,
        previous: null,
        results: pokemons.map((p) => ({
          name: p.name.toLowerCase(),
          url: `https://pokeapi.co/api/v2/pokemon/${p.id}`,
        })),
      });
    }

    const match = url.match(/pokemon\/(\d+)/);
    if (match) {
      const id = Number(match[1]);
      const found = pokemons.find((p) => p.id === id);
      if (found) return jsonResponse(buildDetail(found));
    }

    return jsonResponse({ error: 'not found' }, 404);
  });
}

export const defaultMockPokemons: MockPokemon[] = [
  { id: 1, name: 'Bulbasaur', type: 'grass' },
  { id: 2, name: 'Charmander', type: 'fire' },
];
