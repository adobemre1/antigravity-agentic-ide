import { useState, useOptimistic, startTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../types';

interface EngagementBarProps {
  project: Project;
}

export function EngagementBar({ project }: EngagementBarProps) {
  // Base state (source of truth - normally would come from server/prop updates)
  const [likes, setLikes] = useState(() => project.stats?.likes || Math.floor(Math.random() * 100) + 10);
  
  // Optimistic state
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (state: number, newLike: number) => state + newLike
  );

  const [hasLiked, setHasLiked] = useState(() => {
    if (typeof window === 'undefined') return false;
    const supportedProjects = JSON.parse(localStorage.getItem('seyhan_supported_projects') || '[]');
    return supportedProjects.includes(project.id);
  });

  const [showShareToast, setShowShareToast] = useState(false);

  const handleLike = async () => {
    if (hasLiked) return;
    
    // 1. Optimistic Update (Immediate Feedback)
    startTransition(() => {
      addOptimisticLike(1);
      setHasLiked(true); // Immediate local UI update
    });

    // 2. Perform "Server" Action (Simulated)
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 3. Update Real State (Source of Truth)
      setLikes(prev => prev + 1);
      
      // Persist to local storage
      const supportedProjects = JSON.parse(localStorage.getItem('seyhan_supported_projects') || '[]');
      supportedProjects.push(project.id);
      localStorage.setItem('seyhan_supported_projects', JSON.stringify(supportedProjects));

    } catch (error) {
      // Revert if failed (not fully implemented here as we assume local success, 
      // but in real app we'd revert hasLiked)
      console.error("Like failed", error);
      setHasLiked(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: project.title,
      text: project.description.substring(0, 100) + '...',
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
      } catch (err) {
        console.error('Clipboard failed', err);
      }
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface border-t border-border z-30 md:static md:bg-transparent md:border-0 md:p-0 md:mt-6">
        <div className="container mx-auto flex items-center justify-between gap-4 md:justify-start">
            
            {/* Like Button */}
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                disabled={hasLiked}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${
                    hasLiked 
                    ? 'bg-red-50 text-red-500 border border-red-200 cursor-default' 
                    : 'bg-white border border-border hover:border-red-300 hover:text-red-500 text-text'
                }`}
            >
                <motion.span
                    animate={hasLiked ? { scale: [1, 1.5, 1] } : {}}
                    transition={{ duration: 0.4 }}
                >
                    {hasLiked ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    )}
                </motion.span>
                <span>{hasLiked ? 'Destekledin' : 'Projeyi Destekle'}</span>
                <span className="bg-black/5 px-2 py-0.5 rounded text-sm ml-1">{optimisticLikes}</span>
            </motion.button>

            {/* Share Button */}
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-border rounded-xl hover:bg-black/5 text-text transition-colors shadow-sm"
                aria-label="Paylaş"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            </motion.button>
        </div>
      </div>

      {/* Share Toast */}
      <AnimatePresence>
        {showShareToast && (
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-24 md:bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-lg z-50 text-sm font-medium flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                Bağlantı kopyalandı!
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
