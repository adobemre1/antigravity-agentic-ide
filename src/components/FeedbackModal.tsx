import { useState, useEffect, useActionState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle?: string;
}

// Action simulated for Client-Side (normally a Server Action)
// In a real React 19 App with Server Components, this would be imported
async function submitFeedbackAction(_prevState: unknown, formData: FormData) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const topic = formData.get('topic');
  const message = formData.get('message');
  const email = formData.get('email');
  
  console.log('Feedback Submitted (Action):', { topic, message, email });
  
  return { success: true, message: 'Geri bildiriminiz başarıyla iletildi.' };
}

export function FeedbackModal({ isOpen, onClose, projectTitle }: FeedbackModalProps) {
  const { user } = useAuth();
  
  const [state, formAction, isPending] = useActionState(submitFeedbackAction, { success: false, message: '' });
  
  // Local state for form fields to control values if needed (or just use FormData)
  const [topic, setTopic] = useState('suggestion');
  const [email, setEmail] = useState('');
  const [messageText, setMessageText] = useState('');

  // Auto-fill email
  useEffect(() => {
    if (user?.email && email === '') {
      setEmail(user.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Reset logic is slightly different with useActionState, often handled by key changes or just ignoring previous state on re-open.
  // We can just rely on 'isOpen' mounting/unmounting behavior if we conditionally render the whole modal content.
  // But here conditional rendering is outside. We might want to reset the form.

  useEffect(() => {
    if (isOpen && state.success) {
       // Close automatically after success
       const timer = setTimeout(() => {
         onClose();
       }, 2000);
       return () => clearTimeout(timer);
    }
  }, [state.success, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative"
      >
        <button 
           onClick={onClose} 
           className="absolute top-4 right-4 text-text/50 hover:text-text z-10"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-primary mb-2">Geri Bildirim Ver</h2>
            <p className="text-text/60 mb-6">
                {projectTitle ? `"${projectTitle}" projesi hakkında düşüncelerinizi paylaşın.` : 'Belediye hizmetleri hakkında öneri veya şikayetiniz mi var?'}
            </p>

            <AnimatePresence mode="wait">
                {state.success ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                    >
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <h3 className="text-xl font-bold text-green-700">Teşekkürler!</h3>
                        <p className="text-text/60 mt-2">{state.message}</p>
                    </motion.div>
                ) : (
                    <motion.form 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        action={formAction}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <label htmlFor="topic-select" className="text-sm font-medium text-text/80">Konu</label>
                            <select 
                                id="topic-select"
                                name="topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            >
                                <option value="suggestion">Öneri & Fikir</option>
                                <option value="complaint">Şikayet</option>
                                <option value="appreciation">Teşekkür</option>
                                <option value="other">Diğer</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message-input" className="text-sm font-medium text-text/80">Mesajınız</label>
                            <textarea 
                                id="message-input"
                                name="message"
                                required
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                placeholder="Düşüncelerinizi detaylı bir şekilde yazın..."
                                disabled={isPending}
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email-input" className="text-sm font-medium text-text/80">E-Posta Adresi (Geri dönüş için)</label>
                            <input 
                                id="email-input"
                                name="email"
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-50"
                                placeholder="ornek@email.com"
                                disabled={isPending || (!!user && !!user.email)} 
                            />
                            {/* Hidden input for email if disabled/user exists, to ensure it's sent in FormData if needed? 
                                Actually if enabled input has value it sends. If disabled it might not.
                                Let's add hidden input just in case if disabled.
                            */}
                            {(isPending || (!!user && !!user.email)) && <input type="hidden" name="email" value={email} />}
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={isPending}
                                className="w-full py-3 bg-primary text-primary-content rounded-lg font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                            >
                                {isPending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Gönderiliyor...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Geri Bildirim Gönder</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
