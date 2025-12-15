import React from 'react';
import { DesignMode } from '../types';

interface ModeSelectorProps {
  currentMode: DesignMode;
  onSelectMode: (mode: DesignMode) => void;
  disabled: boolean;
  variant?: 'full' | 'compact';
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onSelectMode, disabled, variant = 'full' }) => {
  return (
    <div className={`flex flex-wrap gap-2 w-full ${variant === 'full' ? 'mb-6 justify-center' : 'mb-2 justify-start overflow-x-auto pb-1'}`}>
      {Object.values(DesignMode).map((mode) => (
        <button
          key={mode}
          onClick={() => onSelectMode(mode)}
          disabled={disabled}
          className={`
            font-mono uppercase tracking-wider border transition-all duration-300 whitespace-nowrap
            ${variant === 'full' 
              ? 'px-4 py-2 text-xs' 
              : 'px-3 py-1.5 text-[10px]'
            }
            ${currentMode === mode 
              ? 'bg-white text-black border-white' 
              : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-500 hover:text-zinc-300'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {mode}
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;