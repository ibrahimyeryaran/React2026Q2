import type { Item, PokemonDetail, PokemonListResponse } from '@/types';
import { mapPokemonDetailToItem } from '@/services/pokemonMapper';

const BASE_URL = 'https://pokeapi.co/api/v2';
const POKEMON_LIMIT = 151;
export const ITEMS_PER_PAGE = 21;

// Cache lifetime (seconds) for server-side fetches; configurable via env.
const REVALIDATE = Number(process.env.POKEMON_CACHE_TTL) || 300;

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: REVALIDATE } });
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}) for ${url}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Fetches the original 151 Pokémon with details on the server.
 * Results are cached by Next.js, so navigation reuses them.
 */
export async function getAllPokemons(): Promise<Item[]> {
  const list = await fetchJson<PokemonListResponse>(
    `${BASE_URL}/pokemon?limit=${POKEMON_LIMIT}&offset=0`
  );
  const details = await Promise.all(
    list.results.map((p) => fetchJson<PokemonDetail>(p.url))
  );
  return details.map(mapPokemonDetailToItem);
}

export async function getPokemonById(id: number): Promise<Item | null> {
  try {
    const detail = await fetchJson<PokemonDetail>(`${BASE_URL}/pokemon/${id}`);
    return mapPokemonDetailToItem(detail);
  } catch {
    return null;
  }
}

export interface PagedResult {
  items: Item[];
  totalItems: number;
  totalPages: number;
  page: number;
}

/** Filters by search query and paginates — all on the server. */
export function filterAndPaginate(
  all: Item[],
  query: string,
  page: number
): PagedResult {
  const trimmed = query.trim().toLowerCase();
  const filtered = trimmed
    ? all.filter((item) => item.name.toLowerCase().includes(trimmed))
    : all;

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * ITEMS_PER_PAGE;

  return {
    items: filtered.slice(start, start + ITEMS_PER_PAGE),
    totalItems,
    totalPages,
    page: safePage,
  };
}
