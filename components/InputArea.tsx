import React, { useState, useRef, useEffect } from 'react';
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
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(prev => prev + ' ' + transcript);
      };

      recognitionRef.current.onend = () => setIsRecording(false);
      recognitionRef.current.onerror = () => setIsRecording(false);
    }
  }, []);

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
        const base64Data = base64String.split(',')[1];
        setAttachment({
          mimeType: file.type,
          data: base64Data
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      const base64Data = dataUrl.split(',')[1];
      setAttachment({
        mimeType: 'image/png',
        data: base64Data
      });
      stopCamera();
    }
  };

  const clearAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full bg-design-black/60 backdrop-blur-3xl border-t border-zinc-800/60 p-6 md:p-10 z-30">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Advanced Viewfinder */}
        {isCameraActive && (
          <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-6 animate-fade-in">
            <div className="relative w-full max-w-3xl aspect-video bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl">
              {/* Corner Accents */}
              <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-white/40"></div>
              <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/40"></div>
              <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-white/40"></div>
              <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-white/40"></div>
              
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-90" />
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 border border-white/10 rounded-full"></div>
              </div>

              <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-6 z-10">
                <button 
                  onClick={captureFrame}
                  className="bg-white text-black px-10 py-3 font-mono text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all active:scale-95 shadow-xl"
                >
                  Capture_Target
                </button>
                <button 
                  onClick={stopCamera}
                  className="bg-zinc-900 text-white border border-zinc-700 px-10 py-3 font-mono text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all active:scale-95"
                >
                  Terminate
                </button>
              </div>
            </div>
            <p className="mt-8 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.5em] animate-pulse">Optics_System_Active</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-zinc-900/50 pb-6">
            <div className="flex items-center gap-4">
              <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-[0.4em] shrink-0">Processing_Vector:</span>
              <div className="overflow-x-auto no-scrollbar">
                  <ModeSelector 
                      currentMode={currentMode} 
                      onSelectMode={onSelectMode} 
                      disabled={isLoading} 
                      variant="compact"
                  />
              </div>
            </div>
            {attachment && (
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 border border-zinc-800 rounded-sm animate-fade-in">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.3)]"></div>
                <span className="text-[9px] text-zinc-400 font-mono uppercase tracking-[0.2em]">Context_Stabilized</span>
                <button 
                  onClick={clearAttachment} 
                  className="text-zinc-600 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            )}
        </div>

        <div className="flex gap-2 items-end bg-zinc-950/40 border border-zinc-800/60 rounded-sm p-1.5 focus-within:border-white/20 transition-all">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="flex items-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="p-4 text-zinc-600 hover:text-white transition-all active:scale-90"
              title="Inject Static Media"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
            </button>
            <button
              onClick={startCamera}
              disabled={isLoading}
              className="p-4 text-zinc-600 hover:text-white transition-all active:scale-90"
              title="Engage Visual Uplink"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            </button>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={isRecording ? "Transcribing_Audio..." : (isLoading ? "Synthesizing..." : "Input strategic query...")}
            className={`flex-1 bg-transparent border-none text-white px-4 py-4 min-h-[56px] max-h-[200px] resize-none outline-none font-sans text-sm tracking-wide transition-opacity ${isRecording ? 'placeholder-white/60' : ''}`}
            rows={1}
          />

          <div className="flex items-center pr-2">
            <button
              onClick={toggleRecording}
              disabled={isLoading}
              className={`p-4 transition-all active:scale-90 ${isRecording ? 'text-red-500 bg-red-500/10 rounded-full' : 'text-zinc-600 hover:text-white'}`}
              title="Voice Protocol"
            >
              <svg className={isRecording ? 'animate-pulse' : ''} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
            </button>
            <button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && !attachment)}
              className={`
                p-4 bg-white text-black font-bold transition-all shadow-xl
                ${(isLoading || (!input.trim() && !attachment)) ? 'opacity-20 cursor-not-allowed scale-95' : 'hover:bg-zinc-200 active:scale-90'}
              `}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center px-2">
            <div className="flex gap-4">
              <p className="text-[8px] text-zinc-700 font-mono uppercase tracking-[0.3em]">
                Link_Secured: AES-256
              </p>
              <p className="text-[8px] text-zinc-700 font-mono uppercase tracking-[0.3em]">
                Ingestion_Format: Multimodal
              </p>
            </div>
            <p className="text-[8px] text-zinc-700 font-mono uppercase tracking-[0.3em]">
              Creative_Director_Core: ACTIVE
            </p>
        </div>
      </div>
    </div>
  );
};

export default InputArea;