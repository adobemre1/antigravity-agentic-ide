import React from 'react';
import type { Project } from '@/types';
import { useTranslation } from 'react-i18next';

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-surface rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={project.image ?? '/placeholder.png'}
        alt={project.title}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="text-primary font-semibold text-lg mb-2">{project.title}</h3>
        <p className="text-text text-sm mb-2 line-clamp-3">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.categories.map((cat) => (
            <span
              key={cat}
              className="bg-primary/10 text-primary text-xs px-2 py-1 rounded"
            >
              {t(`categories.${cat}`)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
