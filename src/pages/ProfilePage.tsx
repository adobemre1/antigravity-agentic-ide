import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !user) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-background">
           <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-background text-text font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
             <motion.img 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={user.avatar} 
                alt={user.name} 
                className="w-32 h-32 rounded-full border-4 border-surface shadow-xl" 
             />
             <div className="text-center md:text-left">
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-bold text-primary mb-2"
                >
                    {user.name}
                </motion.h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-3 py-1 bg-surface border border-border rounded-full text-sm text-text/70">
                       {user.email}
                    </span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium capitalize">
                       {user.role === 'admin' ? 'Sistem Yöneticisi' : 'Seyhan Sakini'}
                    </span>
                    {user.id.length > 10 && (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center gap-1">
                            <img src="https://cdn.edevlet.gov.tr/img/turkiye-gov-tr-icon.svg" className="w-4 h-4" alt="e-Devlet" />
                            e-Devlet Onaylı
                        </span>
                    )}
                </div>
             </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Favorites Section */}
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-surface border border-border rounded-xl p-6 shadow-sm"
             >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                   Favori Projelerim
                </h2>
                <div className="text-center py-12 bg-background/50 rounded-lg border border-dashed border-border/50">
                    <p className="text-text/50">Henüz favori projeniz bulunmuyor.</p>
                    <a href="/" className="text-sm text-primary hover:underline mt-2 inline-block">Projeleri Keşfet</a>
                </div>
             </motion.div>

             {/* Activity Section */}
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-surface border border-border rounded-xl p-6 shadow-sm"
             >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   Son İşlemler
                </h2>
                <ul className="space-y-4">
                    <li className="flex items-center gap-4 text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="flex-1">Sisteme başarıyla giriş yapıldı.</span>
                        <span className="text-text/40 text-xs">Şimdi</span>
                    </li>
                    <li className="flex items-center gap-4 text-sm text-text/60">
                        <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                        <span className="flex-1">Profil oluşturuldu.</span>
                        <span className="text-text/40 text-xs text-right">Bugün</span>
                    </li>
                </ul>
             </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
