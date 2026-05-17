import { useState, useEffect } from 'react';
import type { SearchProps } from '../../types';
import Button from '../Button/Button';
import useLocalStorage from '../../hooks/useLocalStorage';
import styles from './Search.module.css';

function Search({ onSearch, initialSearchTerm = '' }: SearchProps) {
  const [savedTerm, setSavedTerm] = useLocalStorage<string>('pokemonSearchTerm', '');
  const [inputValue, setInputValue] = useState<string>(savedTerm || initialSearchTerm);

  useEffect(() => {
    if (savedTerm) {
      onSearch(savedTerm);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = () => {
    const trimmedValue = inputValue.trim();
    setSavedTerm(trimmedValue);
    onSearch(trimmedValue);
  };

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        className={styles.input}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter pokemon name"
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}

export default Search;
