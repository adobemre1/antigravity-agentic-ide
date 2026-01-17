import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-surface mt-12 py-8 border-t border-primary/10">
      <div className="container mx-auto px-4 text-center text-sm text-text/60">
        <p>&copy; {new Date().getFullYear()} {t('footer.rights')}</p>
        <p className="mt-2">{t('footer.powered')}</p>
        <div className="mt-4">
          <Link to="/privacy" className="text-primary hover:underline">
            {t('privacy.title', 'Privacy Policy')}
          </Link>
        </div>
      </div>
    </footer>
  );
};
