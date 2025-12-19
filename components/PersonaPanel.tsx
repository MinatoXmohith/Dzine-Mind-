import React from 'react';
import { DesignMode } from '../types';
import { PERSONA_ATTRIBUTES, CORE_DIRECTIVES } from '../constants';

interface PersonaPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: DesignMode;
}

const PersonaPanel: React.FC<PersonaPanelProps> = ({ isOpen, onClose, currentMode }) => {
  const attributes = PERSONA_ATTRIBUTES[currentMode];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <aside 
        className={`
          fixed top-0 right-0 h-full w-full sm:w-80 bg-design-dark border-l border-zinc-800 z-40
          transform transition-transform duration-500 ease-in-out shadow-2xl
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="p-6 h-full flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">System Persona</h2>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div className="mb-10 text-center">
             <div className="w-16 h-16 border border-zinc-700 mx-auto mb-4 flex items-center justify-center bg-zinc-900/50">
                <span className="text-xl font-serif italic text-white">Dm</span>
             </div>
             <p className="text-lg font-bold text-white tracking-tighter">DZINE MIND™</p>
             <p className="text-[10px] text-zinc-500 font-mono mt-1">CORE ARCHITECTURE v1.0.4</p>
          </div>

          <div className="space-y-8">
            {/* Cognitive Stats */}
            <section>
              <h3 className="text-[10px] font-mono text-zinc-600 uppercase mb-4 tracking-widest">Cognitive State</h3>
              <div className="space-y-4">
                {[
                  { label: 'Entropy', value: attributes.entropy },
                  { label: 'Rigor', value: attributes.rigor },
                  { label: 'Strategic Depth', value: attributes.depth },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-[10px] font-mono mb-1 uppercase">
                      <span className="text-zinc-400">{stat.label}</span>
                      <span className="text-zinc-600">{stat.value}%</span>
                    </div>
                    <div className="h-[2px] w-full bg-zinc-800">
                      <div 
                        className="h-full bg-white transition-all duration-1000 ease-out" 
                        style={{ width: `${stat.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Core Directives */}
            <section>
              <h3 className="text-[10px] font-mono text-zinc-600 uppercase mb-4 tracking-widest">Core Directives</h3>
              <ul className="space-y-3">
                {CORE_DIRECTIVES.map((directive, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full mt-1.5 shrink-0" />
                    <span className="text-xs text-zinc-400 font-mono leading-relaxed">{directive}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="pt-6 border-t border-zinc-800">
               <div className="bg-zinc-900/50 p-3 border border-zinc-800 rounded-sm">
                  <p className="text-[9px] font-mono text-zinc-500 leading-normal uppercase">
                    Note: Systems thinking is currently prioritized. The persona is tuned to favor long-term brand equity over short-term trends.
                  </p>
               </div>
            </section>
          </div>
        </div>
      </aside>
    </>
  );
};

export default PersonaPanel;