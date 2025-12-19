import React from 'react';
import { DesignMode } from '../types';
import { PERSONA_ATTRIBUTES, CORE_DIRECTIVES, ARCHITECT_DATA } from '../constants';

interface SystemSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentMode: DesignMode;
}

const SystemSidebar: React.FC<SystemSidebarProps> = ({ isOpen, onToggle, currentMode }) => {
  const attributes = PERSONA_ATTRIBUTES[currentMode];

  return (
    <aside 
      className={`
        relative h-full bg-design-dark border-r border-zinc-800 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) z-40
        ${isOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full overflow-hidden'}
      `}
    >
      <div className="w-80 h-full flex flex-col p-8 overflow-y-auto no-scrollbar">
        {/* Navigation Control */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
            <h2 className="text-[9px] font-mono uppercase tracking-[0.5em] text-zinc-600">Sys_Status</h2>
          </div>
          <button 
            onClick={onToggle} 
            className="p-1 text-zinc-700 hover:text-white transition-all active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
          </button>
        </div>

        {/* Agent Profile */}
        <div className="mb-14">
           <div className="flex items-start gap-5 mb-8">
              <div className="w-14 h-14 border border-zinc-800 flex items-center justify-center bg-zinc-950 relative">
                <span className="text-xl font-serif italic text-white">Dm</span>
                <div className="absolute -bottom-0.5 -right-0.5 w-1 h-1 bg-white"></div>
              </div>
              <div>
                <p className="text-xs font-bold text-white tracking-[0.1em] uppercase">DZINE MIND™</p>
                <p className="text-[8px] text-zinc-600 font-mono tracking-widest mt-1.5 uppercase">Strategic_Synthesizer_V1.4</p>
                <div className="flex gap-1 mt-3">
                  {[1,2,3].map(i => <div key={i} className="w-1.5 h-0.5 bg-zinc-800"></div>)}
                </div>
              </div>
           </div>
           <div className="bg-zinc-900/20 border border-zinc-800/40 p-4 rounded-sm">
             <p className="text-[11px] text-zinc-500 font-sans leading-relaxed tracking-wide italic">
               "Intelligence is the ability to maintain aesthetic rigor amidst strategic chaos."
             </p>
           </div>
        </div>

        <div className="space-y-12">
          {/* Internal Parameters */}
          <section>
            <h3 className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.4em] mb-8">Cognitive_Parameters</h3>
            <div className="space-y-8">
              {[
                { label: 'Entropy', value: attributes.entropy, color: 'bg-zinc-700' },
                { label: 'Rigor', value: attributes.rigor, color: 'bg-white' },
                { label: 'Strategic Depth', value: attributes.depth, color: 'bg-white' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-[9px] font-mono mb-3 uppercase tracking-tighter">
                    <span className="text-zinc-600">{stat.label}</span>
                    <span className="text-zinc-300">{stat.value}%</span>
                  </div>
                  <div className="h-[2px] w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className={`${stat.color} h-full transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)`} 
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Persona Directives */}
          <section>
            <h3 className="text-[9px] font-mono text-zinc-600 uppercase mb-8 tracking-[0.4em]">Active_Constraints</h3>
            <ul className="space-y-6">
              {CORE_DIRECTIVES.map((directive, idx) => (
                <li key={idx} className="flex gap-5 items-start group">
                  <span className="text-[9px] font-mono text-zinc-800 mt-0.5 group-hover:text-zinc-400 transition-colors">0{idx + 1}</span>
                  <span className="text-[10px] text-zinc-500 font-mono leading-normal group-hover:text-zinc-200 transition-colors uppercase tracking-tight">
                    {directive}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Architect Profile Section */}
          <section className="pt-10 border-t border-zinc-900">
            <h3 className="text-[9px] font-mono text-zinc-600 uppercase mb-8 tracking-[0.4em]">Architect_Log</h3>
            <div className="space-y-6">
              <div className="group">
                <span className="text-[8px] text-zinc-700 font-mono uppercase tracking-[0.3em] block mb-1">Built_By</span>
                <span className="text-[10px] text-white font-mono uppercase tracking-widest group-hover:text-design-accent transition-colors">
                  {ARCHITECT_DATA.name}
                </span>
              </div>
              
              <div className="bg-zinc-900/40 p-3 border border-zinc-800/40">
                <p className="text-[9px] text-zinc-500 font-sans leading-relaxed tracking-wide uppercase italic">
                  {ARCHITECT_DATA.philosophy}
                </p>
              </div>

              <div>
                <span className="text-[8px] text-zinc-700 font-mono uppercase tracking-[0.3em] block mb-2">Core_Library_Dependency</span>
                <div className="flex flex-wrap gap-2">
                  {ARCHITECT_DATA.stack.map(tech => (
                    <span key={tech} className="text-[8px] font-mono px-2 py-1 bg-zinc-950 text-zinc-400 border border-zinc-900 uppercase">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Footer Readout */}
          <section className="pt-10 border-t border-zinc-900 mt-auto pb-8">
            <div className="text-[8px] font-mono text-zinc-700 space-y-3 uppercase tracking-widest">
              <div className="flex justify-between">
                <span>Memory_Map:</span>
                <span className="text-zinc-500">Allocated</span>
              </div>
              <div className="flex justify-between">
                <span>Kernel_Ver:</span>
                <span className="text-zinc-500">0.99.2-STABLE</span>
              </div>
              <div className="flex justify-between">
                <span>Studio_Mode:</span>
                <span className="text-zinc-500">Headless</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
};

export default SystemSidebar;