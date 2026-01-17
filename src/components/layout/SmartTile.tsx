import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SmartTileProps {
  children: ReactNode;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2;
  className?: string;
  onClick?: () => void;
  priority?: 'high' | 'normal' | 'low';
  title?: string;
}

export function SmartTile({ 
  children, 
  colSpan = 1, 
  rowSpan = 1, 
  className = '', 
  onClick,
  priority = 'normal',
  title
}: SmartTileProps) {
  
  // Algorithmic sizing can be injected here based on priority
  const colClass = {
    1: 'col-span-1',
    2: 'col-span-1 md:col-span-2',
    3: 'col-span-1 md:col-span-3',
    4: 'col-span-1 md:col-span-2 lg:col-span-4'
  }[colSpan];

  const rowClass = {
    1: 'row-span-1',
    2: 'row-span-2'
  }[rowSpan];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-3xl 
        bg-white/5 backdrop-blur-xl border border-white/10
        shadow-sm hover:shadow-xl hover:border-white/20 hover:bg-white/10
        transition-colors duration-300
        ${colClass} ${rowClass} ${className}
        group
      `}
    >
        {/* Glass Reflection effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 w-full h-full p-6 flex flex-col">
            {title && (
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-outfit font-medium text-text/80 uppercase tracking-widest text-xs">
                        {title}
                    </h3>
                    {priority === 'high' && (
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    )}
                </div>
            )}
            <div className="flex-1 min-h-0">
                {children}
            </div>
        </div>
    </motion.div>
  );
}
