import { useState, useEffect } from 'react';

// Simulated WebSocket Hook
export function useTrustData(projectId: string) {
  const [activeViewers, setActiveViewers] = useState(1);
  const [liveStatus, setLiveStatus] = useState<'idle' | 'updating' | 'synced'>('idle');

  useEffect(() => {
    // Randomize active viewers
    const interval = setInterval(() => {
      setActiveViewers(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
      
      // Simulate sporadic "Blockchain Sync" events
      if (Math.random() > 0.8) {
         setLiveStatus('updating');
         setTimeout(() => setLiveStatus('synced'), 2000);
         setTimeout(() => setLiveStatus('idle'), 4000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [projectId]);

  return { activeViewers, liveStatus };
}
