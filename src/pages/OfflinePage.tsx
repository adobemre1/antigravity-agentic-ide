import { motion } from 'framer-motion';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 max-w-md w-full glass-panel p-8 rounded-3xl text-center">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ duration: 0.5 }}
           className="mb-6 flex justify-center"
        >
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M1 1l22 22"></path><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
          </div>
        </motion.div>
        
        <h1 className="text-2xl font-bold text-text mb-2">İnternet Bağlantısı Yok</h1>
        <p className="text-text/70 mb-8">
          Şu anda çevrimdışısınız. Bağlantınızı kontrol edip tekrar deneyin. Seyhan Proje Portalı internet olmadan da sizinle, ancak bazı özellikler kısıtlı olabilir.
        </p>

        <button 
          onClick={() => window.location.reload()}
          className="w-full py-3 px-6 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-primary/25"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  );
};
