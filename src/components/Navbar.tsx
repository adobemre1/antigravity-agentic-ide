import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { useStore } from '../store';
import type { IntentScore } from '../lib/intent';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function PredictiveChip() {
  const { user } = useAuth();
  const [suggestion, setSuggestion] = useState<IntentScore | null>(null);

  useEffect(() => {
    import('../lib/intent').then(({ intentEngine }) => {
        // Inject current user context
        intentEngine.setContext({
             role: (user?.role as any) || 'citizen',
             deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop'
        });
        
        const topIntent = intentEngine.getTopIntent();
        setSuggestion(topIntent);
    });
  }, [user]);

  if (!suggestion || !suggestion.suggestedLink) return null;

  return (
    <Link 
      to={suggestion.suggestedLink}
      className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20 hover:bg-primary/20 transition-all animate-in fade-in slide-in-from-top-2 duration-500"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
      </span>
      {suggestion.suggestedAction}
    </Link>
  );
}

export function Navbar() {
  // ... existing Navbar code ...
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        {t('a11y.skipToContent') || 'Ana İçeriğe Atla'}
      </a>
      <header className="bg-surface shadow-sm sticky top-0 z-40 transition-colors">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-4 group min-h-[44px]">
            <motion.img 
              initial={{ rotate: -180 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
              src="/logo.svg" 
              alt="Seyhan Belediyesi" 
              className="h-10 w-10 group-hover:scale-105 transition-transform" 
              // @ts-ignore - fetchPriority is valid in modern React/Browsers
              fetchPriority="high"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => e.currentTarget.style.display='none'} 
            />
            <h1 className="text-2xl font-bold text-primary">{t('home.title')}</h1>
          </Link>
          
          <div className="w-full md:w-auto flex items-center gap-2">
            <div className="hidden md:block w-64">
               {/* Command Palette Trigger */}
               <button
                  onClick={() => useStore.getState().setCommandPaletteOpen(true)}
                  className="w-full flex items-center justify-between px-3 min-h-[44px] bg-background/50 border border-border rounded-lg text-sm text-text/50 hover:bg-background hover:border-text/20 transition-all group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-label={t('search.placeholder')}
               >
                  <span className="flex items-center gap-2">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                     </svg>
                     <span>{t('search.placeholder')}</span>
                  </span>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">⌘K</span>
               </button>
            </div>
            <LanguageSwitcher />

            {deferredPrompt && (
                <button
                    onClick={handleInstallClick}
                    className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-primary hover:bg-primary/10 rounded-lg transition-colors hidden md:flex"
                    title="Uygulamayı Yükle"
                    aria-label="Uygulamayı Yükle"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </button>
            )}

            {/* Predictive Nav Chip */}
            <PredictiveChip />

            {isAuthenticated && user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-2 min-h-[44px] rounded-full hover:bg-black/5 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-border" />
                  <span className="text-sm font-medium hidden sm:block truncate max-w-[100px]">{user.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text/50"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg py-1 z-50"
                    >
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-bold text-text">{user.name}</p>
                        <p className="text-xs text-text/60 truncate">{user.email}</p>
                      </div>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-text hover:bg-black/5 transition-colors">
                        Profilim
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2 text-sm text-secondary hover:bg-black/5 transition-colors">
                          Yönetici Paneli
                        </Link>
                      )}
                      <button 
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Çıkış Yap
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 bg-primary text-primary-content text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm ml-2"
              >
                Giriş Yap
              </button>
            )}
          </div>
        </div>
        {/* Mobile Search Bar Trigger */}
        <div className="md:hidden px-4 pb-4">
           <button
              onClick={() => useStore.getState().setCommandPaletteOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-3 bg-surface border border-border rounded-xl text-sm text-text/60 shadow-sm"
           >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>{t('search.placeholder')}</span>
           </button>
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
