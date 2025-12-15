import React, { useState, useRef } from 'react';
import { Attachment, DesignMode } from '../types';
import ModeSelector from './ModeSelector';

interface InputAreaProps {
  onSend: (text: string, attachment: Attachment | null) => void;
  isLoading: boolean;
  currentMode: DesignMode;
  onSelectMode: (mode: DesignMode) => void;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading, currentMode, onSelectMode }) => {
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((!input.trim() && !attachment) || isLoading) return;
    onSend(input, attachment);
    setInput('');
    setAttachment(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix for API
        const base64Data = base64String.split(',')[1];
        setAttachment({
          mimeType: file.type,
          data: base64Data
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full bg-design-dark border-t border-zinc-800 p-4 pb-6 sticky bottom-0 z-20">
      <div className="max-w-3xl mx-auto flex flex-col gap-2">
        
        {/* Mode Selector integrated here for context switching */}
        <div className="flex justify-between items-center">
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mr-2 shrink-0">Active Mode</span>
            <div className="flex-1 overflow-hidden">
                <ModeSelector 
                    currentMode={currentMode} 
                    onSelectMode={onSelectMode} 
                    disabled={isLoading} 
                    variant="compact"
                />
            </div>
        </div>

        {attachment && (
          <div className="flex items-center gap-2 bg-zinc-900 p-2 rounded w-fit border border-zinc-800">
            <span className="text-xs text-zinc-400 font-mono">Image attached</span>
            <button 
              onClick={clearAttachment} 
              className="text-zinc-500 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        )}

        <div className="flex gap-4 items-end">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="p-3 text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-zinc-700 rounded-sm"
            title="Attach Image for Critique"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={isLoading ? "Thinking..." : "Describe a concept, ask for a critique, or discuss trends..."}
            className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-white text-white p-3 min-h-[50px] max-h-[150px] resize-none outline-none font-sans text-sm rounded-sm transition-colors"
            rows={1}
          />

          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !attachment)}
            className={`
              p-3 bg-white text-black font-semibold rounded-sm transition-opacity
              ${(isLoading || (!input.trim() && !attachment)) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
        <div className="text-center">
            <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
              Design Mind™ AI System • v1.0
            </p>
        </div>
      </div>
    </div>
  );
};

export default InputArea;