import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'framer-motion';

export function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error: unknown) {
      console.log('SW registration error', error)
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <AnimatePresence>
      {(offlineReady || needRefresh) && (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-[100] max-w-sm w-full bg-surface border border-white/20 shadow-2xl rounded-xl p-4 backdrop-blur-md"
        >
            <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-2 rounded-lg text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-lg mb-1">
                        {offlineReady ? 'Çevrimdışı Hazır' : 'Yeni İçerik Mevcut'}
                    </h4>
                    <p className="text-sm text-text/80 mb-3">
                        {offlineReady 
                            ? 'Uygulama artık çevrimdışı kullanılabilir.' 
                            : 'Yeni özellikler ve iyileştirmeler için uygulamayı güncelleyin.'}
                    </p>
                    <div className="flex gap-2">
                        {needRefresh && (
                            <button 
                                onClick={() => updateServiceWorker(true)}
                                className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Güncelle
                            </button>
                        )}
                        <button 
                            onClick={close}
                            className="px-4 py-2 bg-white/10 text-text/80 text-sm font-bold rounded-lg hover:bg-white/20 transition-colors"
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
