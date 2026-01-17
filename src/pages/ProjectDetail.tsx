import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { motion, useScroll, useSpring } from 'framer-motion';
import type { Project } from '../types';
import projectsEn from '../data/projects_en.json';
import projectsTr from '../data/projects_tr.json';
import { ProjectCard } from '../components/ProjectCard';
import { useStore } from '../store';
import { Navbar } from '../components/Navbar';
import { EngagementBar } from '../components/EngagementBar';
import { FeedbackModal } from '../components/FeedbackModal';
import { ParallaxHero } from '../components/ParallaxHero';
import { Helmet } from 'react-helmet-async';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { isAdmin } = useStore();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  
  // Scroll Progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const sourceData = (i18n.language === 'en' ? projectsEn : projectsTr) as unknown as Project[];
  const project = sourceData.find(p => p.id === id) || null;

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text/50">{t('home.no_projects')}</p>
      </div>
    );
  }

  const otherProjects = sourceData
    .filter(p => p.id !== project.id)
    .slice(0, 3);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background text-text font-sans pb-24 md:pb-8 selection:bg-primary/30"
    >
      <Helmet>
        <title>{project.title} - {t('home.title')}</title>
        <meta name="description" content={project.title} />
      </Helmet>

      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary origin-left z-50"
        style={{ scaleX }}
      />

      <Navbar />

      {/* Parallax Hero */}
      <ParallaxHero 
        image={project.image} 
        title={project.title} 
        category={t(`categories.${project.categories[0]}`)} 
      />
      
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* Sidebar / Left Column (Metadata) */}
           <div className="lg:col-span-3 lg:sticky lg:top-24 h-fit space-y-8">
               {/* Live Status Placeholder (Phase 19 Future) */}
               {/* <div className="flex items-center gap-2 mb-[-20px] ml-1">...</div> */}
               
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="p-6 bg-surface border border-border rounded-xl shadow-sm"
               >
                   <div className="text-sm font-bold text-text/50 uppercase tracking-widest mb-4">Details</div>
                   
                   <div className="mb-6">
                       <span className="block text-xs text-text/50 mb-1">Status</span>
                       <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                           project.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                           project.status === 'ongoing' ? 'bg-blue-500/10 text-blue-500' :
                           'bg-yellow-500/10 text-yellow-500'
                       }`}>
                           {project.status?.toUpperCase() || 'UNKNOWN'}
                       </span>
                   </div>

                   {/* Trust Badge Integration (Commented out until Phase 19 implementation) */}
                   {/* {project.verificationHash && project.lastAudited && (
                      <div className="mb-6">
                         <span className="block text-xs text-text/50 mb-1">Integrity</span>
                         <TrustBadge lastAudited={project.lastAudited} verificationId={project.verificationHash} />
                      </div>
                   )} */}

                   <div className="mb-6">
                       <span className="block text-xs text-text/50 mb-1">Categories</span>
                       <div className="flex flex-wrap gap-2">
                           {project.categories.map(cat => (
                               <span key={cat} className="text-sm text-text border-b border-primary/30 pb-0.5">
                                   {t(`categories.${cat}`)}
                               </span>
                           ))}
                       </div>
                   </div>

                    {isAdmin && (
                        <Link
                            to="/admin"
                            className="block w-full text-center px-4 py-2 bg-secondary/10 text-secondary rounded hover:bg-secondary/20 transition-colors"
                        >
                            Edit
                        </Link>
                    )}
               </motion.div>

               {/* Audit Timeline (Commented out until Phase 19) */}
               {/* {project.auditLog && (
                  <motion.div
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.1 }}
                     className="p-6 bg-surface border border-border rounded-xl shadow-sm"
                  >
                      <div className="text-sm font-bold text-text/50 uppercase tracking-widest mb-4">Process Audit</div>
                      <ProcessTimeline events={project.auditLog.map(log => ({
                          id: log.id,
                          date: log.date,
                          title: log.action,
                          status: log.status as any,
                          actor: log.actor
                      }))} />
                  </motion.div>
               )} */}

               <div className="hidden lg:block">
                   <EngagementBar project={project} />
               </div>
           </div>

           {/* Main Content */}
           <div className="lg:col-span-8 lg:col-start-5">
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="prose prose-invert prose-lg max-w-none mb-8 first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-4 first-letter:mt-2"
              >
                  <ReactMarkdown>{project.description}</ReactMarkdown>
              </motion.div>

              {/* Budget Visualizer (Commented out until Phase 19) */}
              {/* {project.auditLog && (
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                 >
                    <BudgetVisualizer estimated={estimatedBudget} spent={spentBudget} />
                 </motion.div>
              )} */}

              {/* Feedback CTA */}
              <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-surface to-background border border-border rounded-2xl p-8 mb-16 text-center shadow-2xl relative overflow-hidden group"
              >
                   <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <h3 className="text-2xl font-bold mb-4 relative z-10">Your Voice Matters</h3>
                   <p className="text-text/70 mb-8 max-w-md mx-auto relative z-10">Help us shape the future of this project. Share your thoughts directly with the municipal council.</p>
                   <button 
                      onClick={() => setIsFeedbackOpen(true)}
                      className="relative z-10 px-8 py-3 bg-primary text-white rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-primary/25"
                   >
                      Send Feedback
                   </button>
              </motion.div>

              {/* Similar Projects */}
              <section>
                 <h2 className="text-2xl font-bold mb-8 flex items-center gap-4">
                    <span className="w-8 h-1 bg-primary rounded-full" />
                    {t('project.similar')}
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {otherProjects.map((p, i) => (
                         <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                         >
                             <ProjectCard project={p} />
                         </motion.div>
                     ))}
                 </div>
              </section>
           </div>
        </div>

        {/* Mobile Engagement (Sticky) */}
        <div className="lg:hidden">
            <EngagementBar project={project} />
        </div>
      </main>

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)}
        projectTitle={project.title} 
      />
    </motion.div>
  );
}

