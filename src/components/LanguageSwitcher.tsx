import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
    console.log('Language switched to:', lng);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLanguage('tr')}
        className={`px-2 py-1 text-xs rounded border ${i18n.language === 'tr' ? 'bg-primary text-white border-primary' : 'bg-surface text-text border-border hover:border-primary'}`}
      >
        TR
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 text-xs rounded border ${i18n.language === 'en' ? 'bg-primary text-white border-primary' : 'bg-surface text-text border-border hover:border-primary'}`}
      >
        EN
      </button>
    </div>
  );
};
