import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { getRecommendedProjects } from '../lib/smart-search';
import { Link } from 'react-router-dom';
import projectsEn from '../data/projects_en.json';
import projectsTr from '../data/projects_tr.json';
import type { Project } from '../types';

export function RecommendedProjects() {
  const { t, i18n } = useTranslation();
  const { selectedCategories } = useStore();

  const allProjects = useMemo(() => {
    return (i18n.language === 'en' ? projectsEn : projectsTr) as Project[];
  }, [i18n.language]);

  const recommendations = useMemo(() => {
    // If categories selected, finding related is better, but mock 'Trending' 
    // is what we promised for Phase 10 start. 
    // We pass 'selectedCategories' context if we want to be smarter later.
    return getRecommendedProjects(allProjects, 3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProjects, selectedCategories]); 
  // Re-roll when categories change to simulate "Dynamic Contextual" behavior

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-surface rounded-xl border border-border p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <span className="text-primary">✨</span>
        {t('home.trending') || (i18n.language === 'tr' ? 'Sizin İçin Önerilenler' : 'Trending for You')}
      </h3>
      <div className="space-y-3">
        {recommendations.map(project => (
          <Link 
            key={project.id} 
            to={`/project/${project.id}`}
            className="block group"
          >
            <div className="flex gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                     <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                     />
                </div>
                <div className="flex flex-col justify-center">
                    <h4 className="text-sm font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {project.title}
                    </h4>
                    <span className="text-xs text-text/60 mt-1">
                        {project.categories[0]}
                    </span>
                </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
