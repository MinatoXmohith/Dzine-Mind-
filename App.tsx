import React, { useState, useRef, useEffect } from 'react';
import { DesignMode, Message, Role, Attachment } from './types';
import { sendMessageToGemini } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMode, setCurrentMode] = useState<DesignMode>(DesignMode.CRITIC);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      // Pass the previous messages as history to the service
      const responseText = await sendMessageToGemini(
        [...messages], // We pass history excluding current message
        currentMode,
        text,
        attachment
      );

      const newModelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        content: responseText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, newModelMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        content: "**SYSTEM ERROR**: Connection to Design Mind™ Intelligence failed. Please verify API configuration.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-design-black text-design-text font-sans overflow-hidden">
      
      {/* Header */}
      <header className="border-b border-zinc-800 p-6 bg-design-black/90 backdrop-blur-sm z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-white">DESIGN MIND™</h1>
            <p className="text-xs text-zinc-500 font-mono mt-1">INTELLIGENT CREATIVE PARTNER</p>
          </div>
          <div className="hidden sm:block">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block mr-2"></div>
            <span className="text-xs text-zinc-400 font-mono">SYSTEM ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
        <div className="max-w-3xl mx-auto min-h-full flex flex-col">
          
          {/* Welcome / Empty State */}
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col justify-center items-center text-center opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
              <div className="w-16 h-16 border border-white mb-6 flex items-center justify-center">
                <span className="text-2xl font-serif italic">Dm</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white tracking-tight">
                How can I sharpen your thinking?
              </h2>
              <p className="text-zinc-400 max-w-md mb-8 leading-relaxed">
                I am not a generator. I am a critic, a strategist, and an advisor. 
                Select a mode below to begin our collaboration.
              </p>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 pb-4">
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono uppercase tracking-widest mt-4 ml-2">
                <div className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce"></div>
                Thinking
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input Area */}
      <InputArea 
        onSend={handleSendMessage} 
        isLoading={isLoading} 
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
      />
    </div>
  );
};

export default App;