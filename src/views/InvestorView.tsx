import type { Project } from '../types';
import { MathWidget } from '../components/MathWidget';
import { SmartGrid } from '../components/layout/SmartGrid';
import { SmartTile } from '../components/layout/SmartTile';

interface InvestorViewProps {
  filteredProjects: Project[];
}

export function InvestorView({ filteredProjects }: InvestorViewProps) {
  // Derive stats
  const totalBudget = filteredProjects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const activeProjects = filteredProjects.filter(p => p.status === 'ongoing').length;

  return (
    <div className="space-y-8">
       {/* Investor Hero Stats */}
       <SmartGrid className="mb-8">
          <SmartTile colSpan={1} className="flex flex-col justify-center">
             <h3 className="text-xs uppercase tracking-wider text-white/60 font-outfit">Total Budget Volume</h3>
             <p className="text-4xl font-bold text-primary-content mt-2">₺{totalBudget.toLocaleString()}</p>
          </SmartTile>
          <SmartTile colSpan={1} className="flex flex-col justify-center">
             <h3 className="text-xs uppercase tracking-wider text-white/60 font-outfit">Active Tenders</h3>
             <p className="text-4xl font-bold text-secondary-content mt-2">{activeProjects}</p>
          </SmartTile>
          <SmartTile colSpan={2} className="flex flex-col justify-center items-start">
             <h3 className="text-xs uppercase tracking-wider text-white/60 font-outfit">Project Completion Rate</h3>
             <div className="w-full flex items-center gap-4 mt-2">
                <span className="text-5xl font-bold text-green-400">87%</span>
                <div className="h-4 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[87%] shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                </div>
             </div>
          </SmartTile>
       </SmartGrid>

       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <aside className="lg:col-span-1 space-y-6">
            <div className="bg-secondary/10 p-4 rounded-xl border border-secondary/20">
                <h3 className="font-semibold text-secondary mb-1">Investor Mode</h3>
                <p className="text-xs opacity-70">Focus: Budget, Timeline, ROI</p>
            </div>
            <MathWidget />
            {/* Add Investor specific widgets later */}
         </aside>
         
         <section className="lg:col-span-3">
            <h2 className="text-xl font-semibold mb-6">Investment Opportunities</h2>
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-background border-b border-border">
                        <tr>
                            <th className="p-4 font-medium">Project Name</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Budget</th>
                            <th className="p-4 font-medium">Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProjects.map(p => (
                            <tr key={p.id} className="border-b border-border last:border-0 hover:bg-background/50 transition-colors">
                                <td className="p-4 font-medium">{p.title}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${p.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-primary/10 text-primary'}`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="p-4">₺{(p.budget || 0).toLocaleString()}</td>
                                <td className="p-4">
                                    <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${(p.title.length * 7) % 100}%` }}></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         </section>
       </div>
    </div>
  );
}
