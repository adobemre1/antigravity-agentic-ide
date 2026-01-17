import { AnimatePresence, motion } from 'framer-motion';
import type { IntentScore } from '../lib/intent';

interface SuggestionChipsProps {
  intents: IntentScore[];
  onSelect: (intent: IntentScore) => void;
}

export function SuggestionChips({ intents, onSelect }: SuggestionChipsProps) {
  // Only show high confidence intents (> 0.6)
  const relevantIntents = intents.filter(i => i.score > 0.6).slice(0, 3);

  if (relevantIntents.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <AnimatePresence>
        {relevantIntents.map((intent, i) => (
          <motion.button
            key={intent.category}
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelect(intent)}
            className="group relative flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm font-medium transition-colors border border-primary/20 backdrop-blur-sm"
          >
             <span className="text-lg">
                {intent.category === 'bills' && '💸'}
                {intent.category === 'commute' && '🚗'}
                {intent.category === 'leisure' && '🌳'}
                {intent.category === 'official' && '🏛️'}
                {intent.category === 'health' && '🏥'}
             </span>
             <div className="flex flex-col items-start text-left">
                <span className="text-[10px] uppercase opacity-60 leading-none">{intent.reason}</span>
                <span className="leading-none">{intent.suggestedAction}</span>
             </div>
             
             {/* Sparkle effect on high confidence */}
             {intent.score > 0.85 && (
                 <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </span>
             )}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
