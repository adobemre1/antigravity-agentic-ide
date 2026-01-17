import { Suspense, lazy } from 'react';
import type { Project } from '../types';
import { motion } from 'framer-motion';
import { SmartTile } from '../components/layout/SmartTile';

const MapWidget = lazy(() => import('../components/MapWidget').then(module => ({ default: module.MapWidget })));

interface TouristViewProps {
  filteredProjects: Project[];
}

export function TouristView({ filteredProjects }: TouristViewProps) {
  // Filter for touristy spots mostly
  const touristSpots = filteredProjects.filter(p => 
    p.categories.includes('Park') || 
    p.categories.includes('Culture') || 
    p.categories.includes('Transport') ||
    true // For layout demo show all
  );

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col relative">
       <SmartTile className="absolute top-4 left-4 z-10 max-w-xs !p-4 !bg-surface/90 !backdrop-blur-md">
            <h3 className="font-semibold text-orange-500 mb-1 font-outfit">Tourist Mode</h3>
            <p className="text-sm opacity-80">Welcome to Seyhan! Discover parks, museums, and historical sites.</p>
       </SmartTile>

       <motion.div 
         initial={{ opacity: 0 }} 
         animate={{ opacity: 1 }} 
         className="flex-1 rounded-xl overflow-hidden shadow-inner border border-border"
       >
         <Suspense fallback={<div className="h-full w-full flex items-center justify-center bg-surface"><div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div></div>}>
            <MapWidget projects={touristSpots} />
         </Suspense>
       </motion.div>
    </div>
  );
}
