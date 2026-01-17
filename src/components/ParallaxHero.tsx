import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface ParallaxHeroProps {
  image?: string;
  title: string;
  category: string;
}

export function ParallaxHero({ image, title, category }: ParallaxHeroProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={ref} className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden flex items-end">
        {/* Parallax Background */}
        <motion.div 
            style={{ y, opacity }}
            className="absolute inset-0 w-full h-full"
        >
            {image ? (
                <img src={image} alt={title} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 pb-12 md:pb-24 z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
            >
                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-primary uppercase bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                    {category}
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight max-w-4xl drop-shadow-lg">
                    {title}
                </h1>
            </motion.div>
        </div>
    </div>
  );
}
