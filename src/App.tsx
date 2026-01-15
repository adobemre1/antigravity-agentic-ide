import { useEffect, useState, useMemo } from 'react';
import { useStore } from './store';
import type { Project } from './types';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { ProjectCard } from './components/ProjectCard';
import { MathWidget } from './components/MathWidget';
import projectsData from './data/projects_en.json';
import taxonomyData from './data/taxonomy.json';

function App() {
  const { searchQuery, selectedCategories, setAllCategories } = useStore();
  const [projects] = useState<Project[]>(projectsData as Project[]);

  useEffect(() => {
    // Initialize taxonomy in store
    setAllCategories(Object.keys(taxonomyData));
  }, [setAllCategories]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || 
                              p.categories.some(c => selectedCategories.includes(c));
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategories]);

  return (
    <div className="min-h-screen bg-background text-text font-sans">
      <header className="bg-surface shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/logo.svg" alt="Seyhan Belediyesi" className="h-10 w-10" onError={(e) => e.currentTarget.style.display='none'}/>
            <h1 className="text-2xl font-bold text-primary">Seyhan Proje Portalı</h1>
          </div>
          <div className="w-full md:w-1/3">
            <SearchBar />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <MathWidget />
            <CategoryFilter />
          </aside>
          
          <section className="lg:col-span-3">
             <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">{filteredProjects.length} Proje Bulundu</h2>
             </div>
             
             {filteredProjects.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredProjects.map(project => (
                   <ProjectCard key={project.id} project={project} />
                 ))}
               </div>
             ) : (
               <div className="text-center py-12 text-text/50">
                 <p>Aradığınız kriterlere uygun proje bulunamadı.</p>
               </div>
             )}
          </section>
        </div>
      </main>

      <footer className="bg-surface mt-12 py-8 border-t border-primary/10">
        <div className="container mx-auto px-4 text-center text-sm text-text/60">
          <p>&copy; {new Date().getFullYear()} Seyhan Belediyesi. Tüm hakları saklıdır.</p>
          <p>Yapay Zeka Destekli Proje Portalı v1.0</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
