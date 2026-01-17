import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../../types';
import projectsTr from '../../data/projects_tr.json';
import { Link } from 'react-router-dom';

export default function ProjectsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<Project[]>(projectsTr as Project[]);
  
  // Filtering logic
  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, projects]);

  const handleDelete = (id: string) => {
    if (confirm('Bu projeyi silmek istediğinize emin misiniz?')) {
        setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50 backdrop-blur-sm border border-white/20 p-4 rounded-2xl shadow-sm">
            <h1 className="text-2xl font-bold text-bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Projeler
            </h1>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/40"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input 
                        type="text" 
                        placeholder="Proje ara..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/30 bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text/30"
                    />
                </div>
                <button className="px-4 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    <span className="hidden md:inline">Yeni Proje</span>
                </button>
            </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/30 text-left text-text/60 text-sm">
                            <th className="p-4 font-semibold">Görsel</th>
                            <th className="p-4 font-semibold">Başlık & Açıklama</th>
                            <th className="p-4 font-semibold">Kategori</th>
                            <th className="p-4 font-semibold">Etkileşim</th>
                            <th className="p-4 font-semibold text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        <AnimatePresence>
                            {filteredProjects.map((project) => (
                                <motion.tr 
                                    key={project.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="hover:bg-white/40 transition-colors group"
                                >
                                    <td className="p-4 w-24">
                                        {project.image ? (
                                            <img src={project.image} alt="" className="w-16 h-12 object-cover rounded-lg shadow-sm" />
                                        ) : (
                                            <div className="w-16 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">No Img</div>
                                        )}
                                    </td>
                                    <td className="p-4 max-w-md">
                                        <div className="font-bold text-primary truncate">{project.title}</div>
                                        <div className="text-sm text-text/60 truncate">{project.description}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {project.categories.slice(0, 2).map(c => (
                                                <span key={c} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium border border-blue-100">{c}</span>
                                            ))}
                                            {project.categories.length > 2 && <span className="text-xs text-text/40">+{project.categories.length - 2}</span>}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="flex items-center gap-1 text-red-500 font-medium">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                                {project.stats?.likes || 0}
                                            </span>
                                            <span className="flex items-center gap-1 text-blue-500 font-medium">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                                                {project.stats?.shares || 0}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link to={`/project/${project.id}`} className="p-2 hover:bg-white rounded-lg text-text/60 hover:text-primary transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                            </Link>
                                            <button className="p-2 hover:bg-white rounded-lg text-text/60 hover:text-blue-500 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(project.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg text-text/60 hover:text-red-500 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
                {filteredProjects.length === 0 && (
                    <div className="p-12 text-center text-text/50">
                        Aradığınız kriterlere uygun proje bulunamadı.
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
