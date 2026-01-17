import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import { supabase } from './auth';
import { useStore } from './store';
import { useProjects } from './hooks/useProjects';
import ProtectedRoute from './components/ProtectedRoute';
import Spinner from './components/Spinner';
import { AuthProvider } from './context/AuthContext';
import { ReloadPrompt } from './components/ReloadPrompt';
import { ChatWidget } from './components/ChatWidget';
import { CommandPalette } from './components/CommandPalette';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OfflinePage = lazy(() => import('./pages/OfflinePage'));

// Lazy load admin components
const AdminLayout = lazy(() => import('./layouts/AdminLayout').then(module => ({ default: module.AdminLayout })));
const DashboardHome = lazy(() => import('./pages/admin/DashboardHome'));
const ProjectsTable = lazy(() => import('./pages/admin/ProjectsTable'));

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            } 
          >
              <Route index element={<DashboardHome />} />
              <Route path="projects" element={<ProjectsTable />} />
          </Route>

          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/offline" element={<OfflinePage />} />
        </Routes>
    </AnimatePresence>
  );
}

function GlobalCommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useStore();
  const { projects } = useProjects(); // Fetch globally for the palette

  // Global Keyboard Shortcut: toggle on Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  return (
    <CommandPalette 
      isOpen={isCommandPaletteOpen} 
      onClose={() => setCommandPaletteOpen(false)} 
      projects={projects} 
    />
  );
}

export default function App() {
  const { setSession, setIsLoadingSession } = useStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoadingSession(false);
    });

    return () => subscription.unsubscribe();
  }, [setSession, setIsLoadingSession]);

  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <LazyMotion features={domAnimation}>
            <ReloadPrompt />
            <ChatWidget />
            <GlobalCommandPalette />
            <Suspense fallback={<Spinner />}>
              <main id="main-content" tabIndex={-1} className="outline-none">
                <AnimatedRoutes />
              </main>
            </Suspense>
          </LazyMotion>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}
