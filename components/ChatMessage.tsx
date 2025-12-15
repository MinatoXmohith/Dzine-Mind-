import React from 'react';
import { Message, Role } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  // Function to process bold text (**text**) and newlines for a cleaner read
  // without a heavy markdown library dependency.
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
          }
          // Handle bullet points for lists
          if (part.trim().startsWith('•')) {
            return <span key={j} className="block pl-4 -indent-4">{part}</span>
          }
          return part;
        })}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} mb-8 animate-fade-in`}>
      <div 
        className={`
          max-w-[85%] md:max-w-[75%] 
          ${isUser 
            ? 'bg-design-gray text-design-text border border-zinc-700' 
            : 'bg-transparent text-design-text pl-0'
          }
          ${isUser ? 'p-4 rounded-sm' : ''}
        `}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-2 text-xs font-mono tracking-widest text-zinc-500 uppercase">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            DESIGN MIND™
          </div>
        )}

        {message.attachment && (
          <div className="mb-4">
            <img 
              src={`data:${message.attachment.mimeType};base64,${message.attachment.data}`} 
              alt="User upload" 
              className="max-h-64 rounded-sm border border-zinc-700 object-contain"
            />
          </div>
        )}

        <div className={`text-sm md:text-base leading-relaxed font-sans ${!isUser ? 'tracking-wide' : ''}`}>
          {formatText(message.content)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;