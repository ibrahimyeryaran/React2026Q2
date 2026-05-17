import type { Item, PokemonListResponse, PokemonDetail } from "../types";

const BASE_URL = "https://pokeapi.co/api/v2";

let allPokemonCache: Item[] | null = null;

const fetchPokemonDetails = async (url: string): Promise<Item> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch pokemon details: ${response.status}`);
  }

  const data: PokemonDetail = await response.json();

  return {
    id: data.id,
    name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    description: getPokemonDescription(data),
    image:
      data.sprites.other?.["official-artwork"]?.front_default ||
      data.sprites.front_default,
    height: data.height,
    weight: data.weight,
    types: data.types.map((t) => t.type.name),
  };
};

const getPokemonDescription = (data: PokemonDetail): string => {
  const heightM = (data.height / 10).toFixed(1);
  const weightKg = (data.weight / 10).toFixed(1);
  const types = data.types.map((t) => t.type.name).join("/");
  return `Height: ${heightM}m | Weight: ${weightKg}kg | Type: ${types}`;
};

export const apiService = {
  getAllItems: async (): Promise<Item[]> => {
    if (allPokemonCache) {
      return allPokemonCache;
    }

    const response = await fetch(`${BASE_URL}/pokemon?limit=151&offset=0`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("API endpoint not found. Please try again later.");
      } else if (response.status === 429) {
        throw new Error(
          "Too many requests. Please wait a moment and try again.",
        );
      } else {
        throw new Error(
          `Server error: ${response.status}. Please try again later.`,
        );
      }
    }

    const data: PokemonListResponse = await response.json();

    const items: Item[] = await Promise.all(
      data.results.map((pokemon) => fetchPokemonDetails(pokemon.url)),
    );

    allPokemonCache = items;
    return items;
  },

  getPokemonById: async (id: number): Promise<Item> => {
    if (allPokemonCache) {
      const found = allPokemonCache.find((p) => p.id === id);
      if (found) return found;
    }
    return fetchPokemonDetails(`${BASE_URL}/pokemon/${id}`);
  },

  searchItems: async (searchTerm: string): Promise<Item[]> => {
    if (!searchTerm.trim()) {
      return apiService.getAllItems();
    }

    const allItems = await apiService.getAllItems();

    return allItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  },
};
