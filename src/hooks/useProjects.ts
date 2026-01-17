import { useState, useEffect } from 'react';
import { supabase } from '../auth';
import type { Project } from '../types';
import projectsTr from '../data/projects_tr.json';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.warn('Supabase fetch error, falling back to JSON:', error.message);
            // Fallback to JSON if DB is empty or error (e.g., table not created yet)
            setProjects(projectsTr as Project[]);
        } else if (data && data.length > 0) {
            // Map DB fields to Project type
            const mappedProjects: Project[] = data.map(p => ({
                id: p.id,
                title: p.title,
                description: p.description,
                content: p.content,
                image: p.image_url,
                category: p.category,
                status: p.status,
                location: { lat: p.location_lat, lng: p.location_lng },
                categories: p.category ? [p.category] : [], // Map single category to array
                // Add validation/defaults for missing fields if needed
            }));
            setProjects(mappedProjects);
        } else {
             // DB is empty, use JSON
             setProjects(projectsTr as Project[]);
        }
    } catch (err) {
        console.error('Unexpected error fetching projects:', err);
        setProjects(projectsTr as Project[]);
    } finally {
        setIsLoading(false);
    }
  };

  const createProject = async (project: Omit<Project, 'id'>) => {
      // TODO: Implement create
      console.log('Create not implemented yet', project);
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return { projects, isLoading, error, refetch: fetchProjects, deleteProject, createProject };
}
