import { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { searchProjects } from '../lib/smart-search';
import { useStore } from '../store';
import { Project } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
}

export function CommandPalette({ isOpen, onClose, projects }: CommandPaletteProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { setPersona } = useStore(); // For actions like "Switch to Investor"

  // Prevent scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => document.getElementById('cmd-input')?.focus(), 50);
    }
  }, [isOpen]);

  // Search Logic
  const results = useMemo(() => {
    if (!query) return [];
    return searchProjects(query, projects).slice(0, 5); // Limit to top 5
  }, [query, projects]);

  // Defined Actions
  const actions = useMemo(() => {
    if (!query) return [
      { id: 'view-citizen', title: t('home.citizen'), type: 'action', handler: () => setPersona('citizen') },
      { id: 'view-investor', title: t('home.investor'), type: 'action', handler: () => setPersona('investor') },
      { id: 'theme-toggle', title: 'Toggle Theme', type: 'action', handler: () => console.log('Theme toggle unimplemented') }
    ];
    
    // Filter actions by query
    const allActions = [
      { id: 'view-citizen', title: 'Switch to Citizen View', keywords: ['citizen', 'view'], type: 'action', handler: () => setPersona('citizen') },
      { id: 'view-investor', title: 'Switch to Investor View', keywords: ['investor', 'view'], type: 'action', handler: () => setPersona('investor') }
    ];
    
    return allActions.filter(a => 
      a.title.toLowerCase().includes(query.toLowerCase()) || 
      a.keywords.some(k => k.includes(query.toLowerCase()))
    );
  }, [query, t, setPersona]);

  const allItems = [...actions, ...results];

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % allItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + allItems.length) % allItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = allItems[selectedIndex];
        if (item) {
          if ('handler' in item) {
            (item as any).handler();
          } else {
            navigate(`/project/${(item as Project).id}`);
          }
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, allItems, selectedIndex, navigate, onClose]);


  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95, y: -20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: -20 }}
           className="relative w-full max-w-2xl bg-surface border border-white/10 shadow-2xl rounded-xl overflow-hidden flex flex-col max-h-[60vh]"
        >
           {/* Input */}
           <div className="p-4 border-b border-border flex items-center gap-3">
              <svg className="w-5 h-5 text-text/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="cmd-input"
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                placeholder={t('search.placeholder') + " (Type 'safe', 'job', 'park')..."}
                className="flex-1 bg-transparent border-none outline-none text-lg text-text placeholder-text/30 h-8"
                autoComplete="off"
              />
              <div className="hidden md:flex items-center gap-1">
                 <kbd className="px-2 py-0.5 rounded bg-background/50 border border-border text-[10px] text-text/50">ESC</kbd>
              </div>
           </div>

           {/* Results */}
           <div className="flex-1 overflow-y-auto p-2">
              {allItems.length === 0 && (
                <div className="p-8 text-center text-text/40 text-sm">
                   No results found for "{query}"
                </div>
              )}

              {/* Actions Section */}
              {actions.length > 0 && (
                 <div className="mb-2">
                    <div className="text-[10px] uppercase font-bold text-text/40 px-3 py-2">Actions</div>
                    {actions.map((action, i) => (
                       <CommandItem 
                          key={action.id}
                          isSelected={i === selectedIndex}
                          onClick={() => { action.handler(); onClose(); }}
                       >
                          <span className="opacity-50 mr-2">⚡</span>
                          {action.title}
                       </CommandItem>
                    ))}
                 </div>
              )}

              {/* Projects Section */}
              {results.length > 0 && (
                 <div>
                    <div className="text-[10px] uppercase font-bold text-text/40 px-3 py-2">Projects</div>
                    {results.map((project, i) => (
                       <CommandItem 
                          key={project.id}
                          isSelected={(i + actions.length) === selectedIndex}
                          onClick={() => { navigate(`/project/${project.id}`); onClose(); }}
                       >
                          <span className="opacity-50 mr-2">📄</span>
                          <span className="flex-1">{project.title}</span>
                          <span className="text-xs opacity-40 capitalize">{t(`categories.${project.categories[0]}`)}</span>
                       </CommandItem>
                    ))}
                 </div>
              )}
           </div>

           {/* Footer */}
           <div className="p-2 border-t border-border bg-background/30 text-[10px] text-text/40 flex justify-between px-4">
              <span><strong>↑↓</strong> to navigate</span>
              <span><strong>↵</strong> to select</span>
           </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}

function CommandItem({ children, isSelected, onClick }: { children: React.ReactNode, isSelected: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`
         flex items-center px-3 py-3 rounded-lg cursor-pointer transition-colors
         ${isSelected ? 'bg-primary/10 text-primary' : 'text-text/70 hover:bg-white/5'}
      `}
    >
       {children}
    </div>
  );
}
