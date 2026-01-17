import { useEffect, useState } from 'react';
import { fetchProjects, createProject, updateProject, deleteProject } from '../api/projects';
import type { Project } from '../types';
import AdminProjectForm from '../components/AdminProjectForm';
import AdminProjectList from '../components/AdminProjectList';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setIsLoading(true);
      const data = await fetchProjects();
      setProjects(data ?? []);
      setError(null);
    } catch (err) {
      setError('Failed to load projects. Ensure you have admin permissions.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (proj: Omit<Project, 'id'>) => {
    await createProject(proj);
    await load();
    setShowForm(false);
  };

  const handleUpdate = async (proj: Omit<Project, 'id'>) => {
    if (!editing?.id) return;
    await updateProject(editing.id, proj);
    await load();
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      await load();
    } catch (err) {
      alert('Failed to delete project');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-text">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        {!showForm && (
          <button
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            onClick={() => { setEditing(null); setShowForm(true); }}
          >
            + New Project
          </button>
        )}
      </header>
      
      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded border border-red-200">{error}</div>}

      {showForm ? (
        <div className="max-w-2xl mx-auto">
          <AdminProjectForm
            initial={editing ?? undefined}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      ) : (
        isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <AdminProjectList
            projects={projects}
            onEdit={(id) => {
              const proj = projects.find(p => p.id === id);
              if (proj) {
                setEditing(proj);
                setShowForm(true);
              }
            }}
            onDelete={handleDelete}
          />
        )
      )}
    </div>
  );
}
