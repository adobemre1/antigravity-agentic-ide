import { useStore } from '../store';
import { motion } from 'framer-motion';
import { MagneticButton } from './MagneticButton';

export function PersonaSelector() {
  const { currentPersona, setPersona } = useStore();

  const personas = [
    { id: 'citizen', label: 'Citizen', icon: '🏡' },
    { id: 'investor', label: 'Investor', icon: '💼' },
    { id: 'tourist', label: 'Tourist', icon: '📷' }
  ] as const;

  return (
    <div className="flex gap-2 bg-surface p-1 rounded-xl border border-border shadow-sm">
      {personas.map((p) => {
        const isActive = currentPersona === p.id;
        return (
          <MagneticButton
            key={p.id}
            onClick={() => setPersona(p.id)}
            aria-label={`Switch to ${p.label} view`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                isActive ? 'text-primary-content' : 'text-text/70 hover:text-text hover:bg-background'
            }`}
          >
            {isActive && (
                <motion.div 
                    layoutId="persona-active"
                    className="absolute inset-0 bg-primary rounded-lg shadow-md -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
            <span className="relative z-10">{p.icon} {p.label}</span>
          </MagneticButton>
        );
      })}
    </div>
  );
}
