import type { Project } from '../types';

interface AdminProjectListProps {
  projects: Project[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AdminProjectList({ projects, onEdit, onDelete }: AdminProjectListProps) {
  if (projects.length === 0) {
    return <div className="p-4 text-text/50">No projects found. Create one to get started.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-surface">
            <th className="p-4 font-semibold">Title</th>
            <th className="p-4 font-semibold hidden md:table-cell">Categories</th>
            <th className="p-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id} className="border-b border-border hover:bg-surface/50">
              <td className="p-4">
                <div className="font-medium">{project.title}</div>
                <div className="text-sm text-text/60 truncate max-w-xs md:hidden">
                  {project.categories.join(', ')}
                </div>
              </td>
              <td className="p-4 hidden md:table-cell">
                <div className="flex flex-wrap gap-1">
                  {project.categories.map(cat => (
                    <span key={cat} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                      {cat}
                    </span>
                  ))}
                </div>
              </td>
              <td className="p-4 text-right space-x-2">
                <button
                  onClick={() => onEdit(project.id)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this project?')) {
                      onDelete(project.id);
                    }
                  }}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
