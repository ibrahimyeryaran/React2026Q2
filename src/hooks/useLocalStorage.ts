import { useState, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    if (item === null) return initialValue;
    if (typeof initialValue === 'string') return item as unknown as T;
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value);
      if (value === null || value === undefined || value === '') {
        localStorage.removeItem(key);
      } else if (typeof value === 'string') {
        localStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    },
    [key]
  );

  return [storedValue, setValue] as const;
}

export default useLocalStorage;
