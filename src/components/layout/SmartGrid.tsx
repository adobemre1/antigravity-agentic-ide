import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SmartGridProps {
  children: ReactNode;
  className?: string;
}

export function SmartGrid({ children, className = '' }: SmartGridProps) {
  return (
    <motion.div 
      layout
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px] ${className}`}
    >
      {children}
    </motion.div>
  );
}
