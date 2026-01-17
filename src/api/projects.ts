
import { supabase } from '../auth';
import type { Project } from '../types';

export const fetchProjects = async () => {
  const { data, error } = await supabase.from('projects').select('*');
  if (error) throw error;
  // Cast data to Project[] because Supabase types might be loosely defined depending on generation
  return data as Project[];
};

export const createProject = async (proj: Omit<Project, 'id'>) => {
  const { data, error } = await supabase.from('projects').insert(proj).select().single();
  if (error) throw error;
  return data as Project;
};

export const updateProject = async (id: string, proj: Partial<Project>) => {
  const { data, error } = await supabase
    .from('projects')
    .update(proj)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Project;
};

export const deleteProject = async (id: string) => {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
};
