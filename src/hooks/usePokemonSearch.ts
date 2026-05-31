import { useMemo, useState } from 'react';
import { useGetAllPokemonsQuery, pokemonApi } from '../store/pokemonApi';
import { useAppDispatch } from '../store/hooks';
import type { Item } from '../types';
import useLocalStorage from './useLocalStorage';

function usePokemonSearch() {
  const dispatch = useAppDispatch();
  const [savedSearchTerm, setSavedSearchTerm] = useLocalStorage<string>(
    'pokemonSearchTerm',
    ''
  );
  const [searchTerm, setSearchTerm] = useState<string>(savedSearchTerm);

  const { data, isFetching, isError } = useGetAllPokemonsQuery();

  const items = useMemo<Item[]>(() => {
    const all = data ?? [];
    if (!searchTerm.trim()) return all;
    const term = searchTerm.toLowerCase();
    return all.filter((item) => item.name.toLowerCase().includes(term));
  }, [data, searchTerm]);

  const handleSearch = (term: string) => {
    if (term === searchTerm) return;
    setSavedSearchTerm(term);
    setSearchTerm(term);
  };

  const refresh = () => {
    dispatch(pokemonApi.util.invalidateTags(['PokemonList']));
  };

  return {
    items,
    loading: isFetching,
    error: isError ? 'Failed to load items. Please try again.' : null,
    searchTerm,
    handleSearch,
    refresh,
  };
}

export default usePokemonSearch;
