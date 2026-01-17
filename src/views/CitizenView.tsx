import { useState, Suspense, lazy, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import type { Project } from '../types';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProjectCard } from '../components/ProjectCard';
import { MathWidget } from '../components/MathWidget';
import { RecommendedProjects } from '../components/RecommendedProjects';
import { MagneticButton } from '../components/MagneticButton';
import { intentEngine, type IntentScore } from '../lib/intent';
import { SuggestionChips } from '../components/SuggestionChips';
import { BentoGrid, BentoItem } from '../components/BentoGrid';

const MapWidget = lazy(() => import('../components/MapWidget').then(module => ({ default: module.MapWidget })));

interface CitizenViewProps {
  filteredProjects: Project[];
}

export function CitizenView({ filteredProjects }: CitizenViewProps) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  
  // Predictive UX State
  const [intents] = useState<IntentScore[]>(() => intentEngine.predict());
  const [activeIntent, setActiveIntent] = useState<IntentScore | null>(null);

  // Auto-select top intent logic removed in favor of user choice, or can be done in useEffect if needed based on external changes.
  // Since predict() is synchronous and relies on current time/static context, we act once.

  // Smart Sorting based on Active Intent
  const sortedProjects = useMemo(() => {
    if (!activeIntent) return filteredProjects;
    return intentEngine.sortProjects(filteredProjects, activeIntent.category);
  }, [filteredProjects, activeIntent]);

  // Parallax Scroll Animation
  const containerRef = useRef(null);
  const { scrollY } = useScroll(); // Global scroll
  const heroY = useTransform(scrollY, [0, 500], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="space-y-8" ref={containerRef}>
      {/* Hero Section with Parallax */}
      <motion.div 
        style={{ y: heroY, opacity: heroOpacity }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-white overflow-hidden shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold font-display mb-4 leading-tight">
                Shaping the Future of <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-white">Seyhan Together.</span>
            </h1>
            <p className="text-white/80 text-lg mb-6 max-w-lg">
                Explore projected investments, parks, and cultural centers. Join the decision-making process.
            </p>
            
            {/* Predictive Chips */}
            <SuggestionChips 
                intents={intents} 
                onSelect={(intent) => setActiveIntent(activeIntent?.category === intent.category ? null : intent)} 
            />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6">
            <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
                <h3 className="font-semibold text-primary mb-1">Citizen Mode</h3>
                <p className="text-xs opacity-70">Focus: Community, Parks, Complaints</p>
            </div>
            <MathWidget />
            <RecommendedProjects />
            <CategoryFilter />
        </aside>
        <section className="lg:col-span-3">
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-semibold">
                {activeIntent 
                    ? t('home.found_projects_intent', { count: sortedProjects.length, intent: activeIntent.suggestedAction })
                    : t('home.found_projects', { count: sortedProjects.length })
                }
            </h2>
            
            {/* View Mode Toggle */}
            <div className="flex bg-surface rounded-lg p-1 shadow-sm border border-border">
                <MagneticButton
                onClick={() => setViewMode('grid')}
                aria-label="Switch to Grid View"
                className={`px-4 py-2 rounded-md transition-all text-sm font-medium flex items-center gap-2 ${
                    viewMode === 'grid' 
                    ? 'bg-primary text-primary-content shadow' 
                    : 'text-text/70 hover:bg-background/50'
                }`}
                >
                Grid
                </MagneticButton>
                <MagneticButton
                data-test-id="map-view-btn"
                onClick={() => setViewMode('map')}
                aria-label="Switch to Map View"
                className={`px-4 py-2 rounded-md transition-all text-sm font-medium flex items-center gap-2 ${
                    viewMode === 'map' 
                    ? 'bg-primary text-primary-content shadow' 
                    : 'text-text/70 hover:bg-background/50'
                }`}
                >
                Map
                </MagneticButton>
            </div>
            </div>

            <AnimatePresence mode="wait">
            {viewMode === 'map' ? (
                <motion.div
                key="map"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                data-test-id="map-container"
                >
                <Suspense fallback={<div className="h-96 w-full flex items-center justify-center bg-surface rounded-xl"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>}>
                    <MapWidget projects={sortedProjects} />
                </Suspense>
                </motion.div>
            ) : (
                <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full"
                >
                {sortedProjects.length > 0 ? (
                    <BentoGrid>
                      {sortedProjects.map((project, i) => (
                        <BentoItem
                          key={project.id}
                          span={i === 0 ? 'hero' : (i % 3 === 0 ? 'large' : 'default')}
                          className="min-h-[250px]"
                        >
                          <ProjectCard project={project} variant="bento" />
                        </BentoItem>
                      ))}
                    </BentoGrid>
                ) : (
                    <div className="text-center py-12 text-text/50">
                    <p>{t('home.no_projects')}</p>
                    </div>
                )}
                </motion.div>
            )}
            </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
