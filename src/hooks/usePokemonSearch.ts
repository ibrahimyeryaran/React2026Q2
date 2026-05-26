import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPokemons, setSearchTerm } from '../store/pokemonSlice';
import useLocalStorage from './useLocalStorage';

function usePokemonSearch() {
  const dispatch = useAppDispatch();
  const { items, loading, error, searchTerm } = useAppSelector(
    (state) => state.pokemon
  );

  const [savedSearchTerm, setSavedSearchTerm] = useLocalStorage<string>(
    'pokemonSearchTerm',
    ''
  );

  useEffect(() => {
    if (searchTerm === '' && savedSearchTerm !== '') {
      dispatch(setSearchTerm(savedSearchTerm));
      return;
    }
    dispatch(fetchPokemons(searchTerm));
  }, [searchTerm, savedSearchTerm, dispatch]);

  const handleSearch = (term: string) => {
    if (term === searchTerm) return;
    setSavedSearchTerm(term);
    dispatch(setSearchTerm(term));
  };

  return { items, loading, error, searchTerm, handleSearch };
}

export default usePokemonSearch;
