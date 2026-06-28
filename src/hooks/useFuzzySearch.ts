import { useState, useCallback, useRef } from 'react';

export function useFuzzySearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 100);
  }, []);

  return { searchQuery, handleSearch };
}
