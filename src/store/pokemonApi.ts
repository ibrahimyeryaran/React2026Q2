import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Item,
  PokemonDetail,
  PokemonListResponse,
} from '../types';
import { mapPokemonDetailToItem } from '../services/pokemonMapper';

const DEFAULT_TTL_SECONDS = 300;
const POKEMON_LIMIT = 151;

const cacheTtl =
  Number(import.meta.env.VITE_CACHE_TTL) || DEFAULT_TTL_SECONDS;

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  keepUnusedDataFor: cacheTtl,
  tagTypes: ['PokemonList', 'Pokemon'],
  endpoints: (builder) => ({
    getAllPokemons: builder.query<Item[], void>({
      async queryFn(_arg, _api, _extra, fetchWithBQ) {
        const listResult = await fetchWithBQ(
          `pokemon?limit=${POKEMON_LIMIT}&offset=0`
        );
        if (listResult.error) {
          return { error: listResult.error };
        }

        const list = listResult.data as PokemonListResponse;
        const detailResults = await Promise.all(
          list.results.map((p) => fetchWithBQ(p.url))
        );

        const failed = detailResults.find((r) => r.error);
        if (failed?.error) {
          return { error: failed.error };
        }

        const items = detailResults.map((r) =>
          mapPokemonDetailToItem(r.data as PokemonDetail)
        );
        return { data: items };
      },
      providesTags: ['PokemonList'],
    }),

    getPokemonById: builder.query<Item, number>({
      query: (id) => `pokemon/${id}`,
      transformResponse: (response: PokemonDetail) =>
        mapPokemonDetailToItem(response),
      providesTags: (_result, _error, id) => [{ type: 'Pokemon', id }],
    }),
  }),
});

export const {
  useGetAllPokemonsQuery,
  useGetPokemonByIdQuery,
} = pokemonApi;
