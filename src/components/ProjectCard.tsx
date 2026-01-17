import React from 'react';
import type { Project } from '@/types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  variant?: 'default' | 'bento';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, variant = 'default' }) => {
  const { t } = useTranslation();
  
  const containerClasses = variant === 'bento' 
    ? "h-full w-full bg-transparent p-0 shadow-none border-none group-hover:border-none" 
    : "bg-surface rounded-xl shadow-lg border border-border/50 group-hover:border-primary/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20";

  return (
    <Link to={`/project/${project.id}`} data-test-id="project-card" className="block group h-full">
      <div className={`overflow-hidden flex flex-col h-full ${containerClasses}`}>
        {/* Image - Conditional Height for Bento? No, unified for now or handled by parent */}
        <div className={variant === 'bento' ? "aspect-video w-full overflow-hidden rounded-xl mb-4" : "w-full h-48"}>
           <img
             src={project.image ?? '/placeholder.png'}
             alt={project.title}
             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
             loading="lazy"
           />
        </div>
        
        <div className={variant === 'bento' ? "flex-1 flex flex-col" : "p-4"}>
          <h3 className="text-primary font-semibold text-lg mb-2 group-hover:text-primary-focus transition-colors">{project.title}</h3>
          <p className="text-text text-sm mb-4 line-clamp-3 flex-1 opacity-80">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-2 py-1 rounded tracking-wide"
              >
                {t(`categories.${cat}`)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};
