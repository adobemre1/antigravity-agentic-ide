import { motion } from 'framer-motion';
import { cn } from '../lib/utils'; // Assuming a utils file exists or I'll implement simple class concatenation

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "bento-grid mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoItem = ({
  className,
  children,
  span,
}: {
  className?: string;
  children?: React.ReactNode;
  span?: 'default' | 'large' | 'xl' | 'hero';
}) => {
  const spanClass = {
    default: '',
    large: 'bento-item-large',
    xl: 'bento-item-xl',
    hero: 'bento-item-hero',
  }[span || 'default'];

  return (
    <motion.div
      layoutId={`bento-${Math.random()}`} // Unique ID for layout animation (in prod use real ID)
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        "bento-item group/bento transition duration-200 shadow-input dark:shadow-none bg-white border border-transparent justify-between flex flex-col space-y-4",
        spanClass,
        className
      )}
    >
      {children}
    </motion.div>
  );
};
