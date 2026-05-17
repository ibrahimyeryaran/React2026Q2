import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { Item } from '../types';
import useLocalStorage from './useLocalStorage';

function usePokemonSearch() {
  const [savedSearchTerm, setSavedSearchTerm] = useLocalStorage<string>(
    'pokemonSearchTerm',
    ''
  );
  const [searchTerm, setSearchTerm] = useState<string>(savedSearchTerm);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = searchTerm
          ? await apiService.searchItems(searchTerm)
          : await apiService.getAllItems();
        setItems(result);
      } catch {
        setError('Failed to load items. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchTerm]);

  const handleSearch = (term: string) => {
    if (term === searchTerm) return;
    setSavedSearchTerm(term);
    setSearchTerm(term);
  };

  return { items, loading, error, searchTerm, handleSearch };
}

export default usePokemonSearch;
