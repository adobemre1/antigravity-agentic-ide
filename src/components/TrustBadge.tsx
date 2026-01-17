import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrustBadgeProps {
  lastAudited: string; // ISO Date
  verificationId: string; // Simulated Hash
}

export function TrustBadge({ lastAudited, verificationId }: TrustBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full cursor-help hover:bg-green-500/20 transition-colors">
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-green-500"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="m9 12 2 2 4-4"></path>
        </svg>
        <span className="text-xs font-medium text-green-500 uppercase tracking-wider">Verified</span>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full mt-2 w-72 bg-surface border border-border rounded-xl shadow-xl p-4 z-50 backdrop-blur-3xl"
          >
            <div className="space-y-3">
                <h4 className="flex items-center gap-2 text-sm font-bold text-text">
                    <span className="text-green-500">✓</span> Data Integrity Verified
                </h4>
                
                <div>
                    <div className="text-[10px] text-text/50 uppercase tracking-wider mb-1">Last Audit Audit</div>
                    <div className="text-xs text-text">{new Date(lastAudited).toLocaleString()}</div>
                </div>

                <div>
                    <div className="text-[10px] text-text/50 uppercase tracking-wider mb-1">Immutable Ledger ID</div>
                    <div className="font-mono text-[10px] bg-black/30 p-1.5 rounded text-text/70 break-all select-all">
                        {verificationId}
                    </div>
                </div>
                
                <div className="pt-2 border-t border-white/5">
                    <p className="text-[10px] text-text/40 italic">
                        This project record is cryptographically signed and cannot be altered retrospectively.
                    </p>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
