import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useStore } from '../store';
import { searchProjects } from '../lib/smart-search';
import type { Project } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { CitizenView } from '../views/CitizenView';
import { InvestorView } from '../views/InvestorView';
import { TouristView } from '../views/TouristView';
import { PersonaSelector } from '../components/PersonaSelector';
import projectsEn from '../data/projects_en.json';
import projectsTr from '../data/projects_tr.json';
import taxonomyData from '../data/taxonomy.json';
import { Helmet } from 'react-helmet-async';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { searchQuery, selectedCategories, setAllCategories, currentPersona, setPersona } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Scroll Progress Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Sync URL -> Store (Initial Load & Back Button)
  useEffect(() => {
    const view = searchParams.get('view');
    if (view && ['citizen', 'investor', 'tourist'].includes(view) && view !== currentPersona) {
      setPersona(view as 'citizen' | 'investor' | 'tourist');
    }
  }, [searchParams, setPersona, currentPersona]);

  // Sync Store -> URL
  useEffect(() => {
     const currentParams = new URLSearchParams(searchParams);
     if (currentPersona !== 'citizen') {
        currentParams.set('view', currentPersona);
     } else {
        currentParams.delete('view'); // Default
     }
     setSearchParams(currentParams, { replace: true });
  }, [currentPersona, setSearchParams, searchParams]);

  // Dynamic project data based on language
  const projects = useMemo(() => {
    return (i18n.language === 'en' ? projectsEn : projectsTr) as unknown as Project[];
  }, [i18n.language]);

  useEffect(() => {
    setAllCategories(Object.keys(taxonomyData));
  }, [setAllCategories]);

  const filteredProjects = useMemo(() => {
    // 1. Algorithmic Search (Fuse.js)
    let candidates = projects;
    if (searchQuery.trim()) {
      candidates = searchProjects(searchQuery, projects);
    }

    // 2. Category Filter
    return candidates.filter((p: Project) => {
      const matchesCategory = selectedCategories.length === 0 ||
        p.categories.some((c: string) => selectedCategories.includes(c));
      return matchesCategory;
    });
  }, [projects, searchQuery, selectedCategories]);

  const renderCurrentView = () => {
    switch (currentPersona) {
      case 'investor':
        return <InvestorView filteredProjects={filteredProjects} />;
      case 'tourist':
        return <TouristView filteredProjects={filteredProjects} />;
      case 'citizen':
      default:
        return <CitizenView filteredProjects={filteredProjects} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background text-text font-sans"
    >
      <Helmet>
        <title>{t('home.title')}</title>
        <meta name="description" content="Seyhan Belediyesi Proje Portalı - Geleceği Birlikte Tasarlıyoruz" />
      </Helmet>
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX }}
      />
      
      <Navbar />

      <main className="container mx-auto px-4 py-8">
         <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
                 <h1 className="text-3xl font-bold font-display text-primary">Seyhan Projects</h1>
                 <p className="text-text/60">Discover the future of our municipality.</p>
            </div>
            <PersonaSelector />
         </div>

         <AnimatePresence mode="wait">
            <motion.div
                key={currentPersona}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
            >
                {renderCurrentView()}
            </motion.div>
         </AnimatePresence>
      </main>

      <Footer />
    </motion.div>
  );
}

