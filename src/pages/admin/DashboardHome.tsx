import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { Project } from '../../types';
import projectsTr from '../../data/projects_tr.json';

const data = [
  { name: 'Oca', votes: 4000, visits: 2400 },
  { name: 'Şub', votes: 3000, visits: 1398 },
  { name: 'Mar', votes: 2000, visits: 9800 },
  { name: 'Nis', votes: 2780, visits: 3908 },
  { name: 'May', votes: 1890, visits: 4800 },
  { name: 'Haz', votes: 2390, visits: 3800 },
  { name: 'Tem', votes: 3490, visits: 4300 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DashboardHome() {
  const projects = projectsTr as Project[];
  const totalProjects = projects.length;
  // Calculate category distribution
  const categoryCount: Record<string, number> = {};
  projects.forEach(p => {
    p.categories.forEach(c => {
        categoryCount[c] = (categoryCount[c] || 0) + 1;
    });
  });
  
  const pieData = Object.keys(categoryCount).map(key => ({
    name: key,
    value: categoryCount[key]
  })).sort((a,b) => b.value - a.value).slice(0, 5); // Top 5 categories

  return (
    <div className="space-y-8">
        {/* Stats Grid */}
        {/* Stats Grid - Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-primary/10 to-surface backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                <div>
                    <div className="text-text/60 text-sm font-medium mb-1 uppercase tracking-wider">Toplam Proje</div>
                    <div className="text-5xl font-extrabold text-primary mt-2">{totalProjects}</div>
                </div>
                <div className="text-green-500 text-sm mt-4 font-bold flex items-center gap-2 bg-green-500/10 w-fit px-3 py-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                    +12 bu ay
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-surface/50 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-lg hover:bg-surface/80 transition-colors"
            >
                <div className="text-text/60 text-sm font-medium mb-1">Toplam Etkileşim</div>
                <div className="text-3xl font-bold text-secondary">24.5K</div>
                <div className="text-green-500 text-xs mt-2 font-medium flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                    +5.2% artış
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-surface/50 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-lg hover:bg-surface/80 transition-colors"
            >
                <div className="text-text/60 text-sm font-medium mb-1">Aktif Kullanıcı</div>
                <div className="text-3xl font-bold text-accent">1,203</div>
                <div className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">
                     <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
                    -2% düşüş
                </div>
            </motion.div>
        </div>

        {/* Charts Row - Bento Expanded */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Area Chart */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2 bg-surface/50 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl h-[450px]"
            >
                <h3 className="text-lg font-bold mb-6 text-text/90 flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary rounded-full"></span>
                    Etkileşim Analizi
                </h3>
                <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#004B91" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#004B91" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', color: '#f8fafc' }}
                            itemStyle={{ color: '#f8fafc' }}
                        />
                        <Area type="monotone" dataKey="votes" stroke="#004B91" strokeWidth={3} fillOpacity={1} fill="url(#colorVotes)" />
                        <Area type="monotone" dataKey="visits" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                    </AreaChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Pie Chart */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-surface/50 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl h-[450px] flex flex-col"
            >
                <h3 className="text-lg font-bold mb-2 text-text/90 flex items-center gap-2">
                    <span className="w-2 h-6 bg-secondary rounded-full"></span>
                    Kategori Dağılımı
                </h3>
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={110}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
                    {pieData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-1.5 bg-black/5 px-2 py-1 rounded-full border border-white/5">
                             <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                             <span className="text-text/80 font-medium">{entry.name}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    </div>
  );
}
