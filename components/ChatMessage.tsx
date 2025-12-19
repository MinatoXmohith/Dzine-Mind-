import React from 'react';
import { Message, Role } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <div key={i} className="h-6" />;
      
      return (
        <p key={i} className="mb-5 last:mb-0">
          {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="text-white font-bold tracking-tight bg-white/5 px-1 rounded-sm">{part.slice(2, -2)}</strong>;
            }
            if (part.trim().startsWith('•') || part.trim().startsWith('-')) {
              return (
                <span key={j} className="inline-block pl-6 relative before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-[1px] before:bg-zinc-600">
                  {part.trim().substring(1).trim()}
                </span>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} py-8 animate-fade-in group`}>
      <div 
        className={`
          max-w-[90%] md:max-w-[85%] lg:max-w-[80%] 
          ${isUser 
            ? 'bg-zinc-900/30 text-design-text border border-zinc-800/60 px-6 py-5 rounded-sm hover:border-zinc-700 transition-colors' 
            : 'bg-transparent text-design-text pl-0'
          }
        `}
      >
        {!isUser && (
          <div className="flex items-center gap-4 mb-6 text-[9px] font-mono tracking-[0.5em] text-zinc-600 uppercase select-none group-hover:text-zinc-400 transition-colors">
            <div className="w-1.5 h-1.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.3)]"></div>
            Intelligence_Output
          </div>
        )}

        {message.attachment && (
          <div className="mb-8 overflow-hidden border border-zinc-800 bg-zinc-950 p-1 group/img relative">
            <img 
              src={`data:${message.attachment.mimeType};base64,${message.attachment.data}`} 
              alt="Context Ingestion" 
              className="max-h-[400px] w-full object-contain grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
            />
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-2 py-1 text-[8px] font-mono text-zinc-400 uppercase tracking-widest border border-white/10">
              Context_Reference
            </div>
          </div>
        )}

        <div className={`text-sm md:text-[16px] leading-[1.8] font-sans ${!isUser ? 'tracking-normal text-zinc-300 antialiased font-light' : 'text-zinc-200'}`}>
          {formatText(message.content)}
        </div>
        
        {!isUser && (
          <div className="mt-12 pt-6 border-t border-zinc-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-[0.4em]">Directive_Reference: Verified</span>
            </div>
            <div className="flex gap-2">
               {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-zinc-900 rounded-full group-hover:bg-zinc-700 transition-colors"></div>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;