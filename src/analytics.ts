declare global {
  interface Window {
    plausible: (eventName: string, options?: { props?: Record<string, unknown> }) => void;
  }
}

export const trackEvent = (eventName: string, props?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, { props });
  }
  
  if (import.meta.env.DEV) {
    // console.log(`[Analytics] ${eventName}`, props);
  }
};
