import React from 'react';
import { useStore } from '@/store';
import { useTranslation } from 'react-i18next';

export const CategoryFilter: React.FC = () => {
  const { t } = useTranslation();
  const categories = useStore((state) => state.allCategories);
  const selected = useStore((state) => state.selectedCategories);
  const toggle = (cat: string) => {
    useStore.getState().toggleCategory(cat);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => toggle(cat)}
          data-test-id={`category-${cat}`}
          className={`px-3 py-1 rounded text-sm ${selected.includes(cat) ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}
        >
          {t(`categories.${cat}`)}
        </button>
      ))}
    </div>
  );
};
