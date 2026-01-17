import { useState } from 'react';
import type { Project } from '../types';

interface AdminProjectFormProps {
  initial?: Project;
  onSubmit: (project: Omit<Project, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export default function AdminProjectForm({ initial, onSubmit, onCancel }: AdminProjectFormProps) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [image, setImage] = useState(initial?.image || '');
  const [categories, setCategories] = useState(initial?.categories.join(', ') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        title,
        description,
        image,
        categories: categories.split(',').map(c => c.trim()).filter(Boolean),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface p-6 rounded shadow-md border border-border">
      <h2 className="text-xl font-bold mb-4">{initial ? 'Edit Project' : 'New Project'}</h2>
      
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded bg-background text-text border-border"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full p-2 border rounded bg-background text-text border-border"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="image" className="block text-sm font-medium mb-1">Image URL</label>
        <input
          id="image"
          type="text"
          value={image}
          onChange={e => setImage(e.target.value)}
          className="w-full p-2 border rounded bg-background text-text border-border"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="categories" className="block text-sm font-medium mb-1">Categories (comma separated)</label>
        <input
          id="categories"
          type="text"
          value={categories}
          onChange={e => setCategories(e.target.value)}
          className="w-full p-2 border rounded bg-background text-text border-border"
          placeholder="e.g. React, TypeScript, Full Stack"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-text/70 hover:text-text"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Project'}
        </button>
      </div>
    </form>
  );
}
