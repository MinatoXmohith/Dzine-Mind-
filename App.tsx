import React, { useState, useRef, useEffect } from 'react';
import { DesignMode, Message, Role, Attachment } from './types';
import { sendMessageToGemini } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';
import SystemSidebar from './components/SystemSidebar';
import { MODE_EXAMPLES } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMode, setCurrentMode] = useState<DesignMode>(DesignMode.CRITIC);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string, attachment: Attachment | null) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: text,
      timestamp: Date.now(),
      attachment: attachment ? attachment : undefined
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const { text: responseText, attachment: responseAttachment } = await sendMessageToGemini(
        [...messages],
        currentMode,
        text,
        attachment
      );

      const newModelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        content: responseText,
        timestamp: Date.now(),
        attachment: responseAttachment
      };

      setMessages(prev => [...prev, newModelMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        content: "**SYSTEM ERROR**: Connection to DZINE MIND™ Intelligence failed. Check API configuration or environment stability.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen text-design-text font-sans overflow-hidden">
      {/* Sidebar Readout */}
      <SystemSidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        currentMode={currentMode}
      />

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent transition-all duration-300 ease-in-out">
        
        {/* Header Navigation */}
        <header className="border-b border-zinc-800/60 p-6 bg-design-black/40 backdrop-blur-xl z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isSidebarOpen && (
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 -ml-2 text-zinc-600 hover:text-white transition-all active:scale-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                </button>
              )}
              <div>
                <h1 className="text-sm font-bold tracking-[0.2em] text-white uppercase flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]"></div>
                  DZINE MIND™
                </h1>
                <p className="text-[9px] text-zinc-500 font-mono mt-1 uppercase tracking-widest flex gap-2">
                  <span>{currentMode}</span>
                  <span className="text-zinc-700">|</span>
                  <span>System_Link_Active</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[8px] text-zinc-600 font-mono uppercase tracking-[0.3em] mb-1">Processing_Core</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`w-3 h-1 ${isLoading ? 'bg-white animate-pulse' : 'bg-zinc-800'} transition-colors`} style={{animationDelay: `${i*100}ms`}}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Studio Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-12 scroll-smooth">
          <div className="max-w-3xl mx-auto min-h-full flex flex-col">
            
            {/* Welcome Display */}
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col justify-center items-center text-center py-20 animate-fade-in">
                <div className="relative mb-12">
                  <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full opacity-20 animate-pulse-slow"></div>
                  <div className="relative w-24 h-24 border border-zinc-800 flex items-center justify-center bg-zinc-950 shadow-2xl">
                    <span className="text-4xl font-serif italic text-white select-none">Dm</span>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-white"></div>
                  </div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tighter max-w-xl leading-tight">
                  Awaiting Strategic Ingestion.
                </h2>
                <p className="text-zinc-500 max-w-sm mb-12 leading-relaxed font-mono text-[10px] uppercase tracking-[0.4em]">
                  Systems • Logic • Aesthetics • Future
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                  {MODE_EXAMPLES[currentMode].map((example, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleSendMessage(example.prompt, null)}
                      className="p-6 border border-zinc-800/50 bg-zinc-900/10 rounded-sm text-left hover:border-white/20 hover:bg-zinc-900/40 transition-all group animate-fade-in text-zinc-400 hover:text-white"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] font-mono tracking-[0.3em] text-zinc-600 group-hover:text-zinc-400 uppercase">
                          {example.label}
                        </span>
                        <svg className="opacity-0 group-hover:opacity-100 transition-opacity" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                      </div>
                      <p className="text-xs leading-relaxed font-sans">
                        {example.prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation Flow */}
            <div className="flex-1 space-y-4">
              {messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && (
                <div className="flex flex-col gap-4 py-8 border-t border-zinc-900/50 mt-12 animate-fade-in">
                  <div className="flex items-center gap-3 text-zinc-500 text-[9px] font-mono uppercase tracking-[0.4em]">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                      <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-ping [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full animate-ping [animation-delay:0.4s]"></div>
                    </div>
                    Synthesizing_Multimodal_Vectors
                  </div>
                  <div className="w-full max-w-xs h-[1px] bg-zinc-900 relative overflow-hidden">
                    <div className="absolute inset-y-0 w-1/3 bg-white/20 animate-[move_2s_linear_infinite]" style={{animationName: 'shimmer'}}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-12" />
            </div>
          </div>
        </main>

        {/* Global Input Bar */}
        <InputArea 
          onSend={handleSendMessage} 
          isLoading={isLoading} 
          currentMode={currentMode}
          onSelectMode={setCurrentMode}
        />
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default App;