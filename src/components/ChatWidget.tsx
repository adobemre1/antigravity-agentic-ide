import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { executeClientTool } from '../lib/ai-tools';
import { chatRateLimiter } from '../lib/security';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const store = useStore();
  
  const { messages, sendMessage, status, addToolResult } = useChat({
    // maxToolRoundtrips is not supported in this version or configured differently
    transport: new TextStreamChatTransport({
        api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
    }),
    async onToolCall({ toolCall }: { toolCall: any }) {
        const result = await executeClientTool(
            toolCall.toolName,
            toolCall.args,
            store,
            navigate
        );
        addToolResult({ 
            toolCallId: toolCall.toolCallId, 
            tool: toolCall.toolName,
            output: result 
        });
    },
  });

  const isLoading = status === 'streaming' || status === 'submitted';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);



// ...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!chatRateLimiter.tryConsume()) {
        // Simple alert for now, could be a toast
        // In a real app we'd show a specialized error UI
        setInput('⚠️ Rate limit exceeded. Please wait 10s.');
        return;
    }

    const userMessage = input;
    setInput('');
    await sendMessage({ text: userMessage });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            data-testid="chat-widget-container"
            className="bg-surface border border-border shadow-2xl rounded-2xl w-[350px] md:w-[400px] h-[500px] flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between text-primary-content">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    🤖
                </div>
                <div>
                  <h3 className="font-bold text-sm">Seyhan Asistan</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-xs opacity-80">Çevrimiçi</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
                {messages.length === 0 && (
                    <div className="text-center text-text/60 text-sm mt-8">
                        <p>Merhaba! Ben yapay zeka asistanınızım.</p>
                        <p className="mt-2">Projeler, hizmetler veya belediye hakkında bana soru sorabilirsiniz.</p>
                    </div>
                )}
                
                {messages.map((m: any) => (
                    <div key={m.id} className={`flex flex-col gap-1 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                        {m.content && (
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === 'user' ? 'bg-primary text-primary-content rounded-br-none' : 'bg-surface border border-border rounded-bl-none'}`}>
                                {m.content}
                            </div>
                        )}
                        {/* Display Tool Invocations */}
                        {m.toolInvocations?.map((toolInvocation: { toolCallId: string; toolName: string; result?: unknown; args: unknown }) => {
                            const toolCallId = toolInvocation.toolCallId;
                            // Fallback manual execution if needed (though onToolCall handles it)
                            // const addResult = (output: string) => addToolResult({ toolCallId, tool: toolInvocation.toolName, output });

                            // Check if tool is executed
                            if ('result' in toolInvocation) {
                                return (
                                    <div key={toolCallId} className="text-xs text-text/50 bg-surface/50 px-2 py-1 rounded border border-border/50">
                                        ✅ {toolInvocation.toolName} executed.
                                    </div>
                                );
                            } 
                            // Tool is being called
                            return (
                                <div key={toolCallId} className="text-xs text-text/50 bg-surface/50 px-2 py-1 rounded border border-border/50 animate-pulse">
                                    ⚙️ Calling {toolInvocation.toolName}...
                                </div>
                            );
                        })}
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-surface border border-border rounded-2xl rounded-bl-none px-4 py-3 flex gap-1">
                            <span className="w-2 h-2 bg-text/40 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-text/40 rounded-full animate-bounce delay-75"></span>
                            <span className="w-2 h-2 bg-text/40 rounded-full animate-bounce delay-150"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 bg-surface border-t border-border">
                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Bir soru sorun..."
                        className="flex-1 bg-background border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button 
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-2 bg-primary text-primary-content rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                </div>
                <div className="text-center mt-2">
                    <span className="text-[10px] text-text/40">Yapay zeka hata yapabilir. Lütfen cevapları kontrol ediniz.</span>
                </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        layoutId="chat-fab"
        data-testid="chat-fab"
        onClick={() => setIsOpen(true)}
        className={`bg-primary text-primary-content p-4 rounded-full shadow-lg hover:shadow-primary/25 hover:scale-110 transition-all ${isOpen ? 'hidden' : 'block'}`}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
      </motion.button>
    </div>
  );
}
