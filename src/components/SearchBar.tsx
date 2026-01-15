import React, { useState } from 'react';
import { useStore } from '@/store';
import { useTranslation } from 'react-i18next';

export const SearchBar: React.FC = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const setSearch = useStore((state) => state.setSearchQuery);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    setSearch(q);
  };

  return (
    <input
      type="text"
      placeholder={t('search.placeholder')}
      value={query}
      onChange={handleChange}
      className="w-full p-2 border border-primary/20 rounded focus:outline-none focus:ring-2 focus:ring-primary"
    />
  );
};
