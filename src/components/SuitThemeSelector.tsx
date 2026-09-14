import React, { useState, useRef, useEffect } from 'react';
import { SUIT_THEMES } from '../data/spiderManData';
import { SuitTheme } from '../types';
import { Check, ChevronDown, Cpu } from 'lucide-react';

interface SuitThemeSelectorProps {
  currentTheme: SuitTheme;
  onSelectTheme: (theme: SuitTheme) => void;
}

export const SuitThemeSelector: React.FC<SuitThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-yellow-400/40 bg-black/80 hover:border-yellow-400 text-white backdrop-blur-md transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
        style={{
          boxShadow: isOpen ? `0 0 20px ${currentTheme.primaryAccent}40` : undefined,
        }}
      >
        {/* Animated HUD Corner Accents */}
        <span className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-yellow-400" />
        <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-yellow-400" />

        <div className="flex items-center gap-2">
          <div
            className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-inner transition-transform group-hover:scale-110"
            style={{ backgroundColor: currentTheme.primaryAccent }}
          />
          <div className="text-left font-mono">
            <div className="text-[9px] text-yellow-400 tracking-wider uppercase font-bold flex items-center gap-1">
              <Cpu className="w-2.5 h-2.5 animate-pulse" /> SUIT MATRIX
            </div>
            <div className="text-xs font-black tracking-wide text-gray-100 max-w-[110px] sm:max-w-[140px] truncate">
              {currentTheme.name}
            </div>
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-yellow-400 transition-transform duration-300 ml-1 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Modern Popout Drawer / Dropdown Matrix */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-black/95 border-2 border-yellow-400 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-blue-950 to-black px-4 py-2.5 border-b-2 border-yellow-400/40 flex items-center justify-between">
            <span className="text-[10px] font-mono font-black text-yellow-400 tracking-wider uppercase flex items-center gap-1.5">
              SELECT PROTOCOL SUIT
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 bg-yellow-400 text-black font-bold">
              {SUIT_THEMES.STYLES || SUIT_THEMES.length} VAULTED
            </span>
          </div>

          {/* Suit Selection List */}
          <div className="p-2 space-y-1.5 max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-black">
            {SUIT_THEMES.map((theme) => {
              const isSelected = currentTheme.id === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    onSelectTheme(theme);
                    setIsOpen(false);
                  }}
                  className={`w-full group text-left p-2.5 rounded-lg transition-all duration-200 flex items-center justify-between border ${
                    isSelected
                      ? 'bg-yellow-400/15 border-yellow-400 shadow-[2px_2px_0px_0px_#facc15]'
                      : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Dual Color Swatch Preview */}
                    <div className="relative flex -space-x-1.5 shrink-0">
                      <div
                        className="w-5 h-5 rounded-full border border-black shadow-md z-10"
                        style={{ backgroundColor: theme.primaryAccent }}
                      />
                      <div
                        className="w-5 h-5 rounded-full border border-black shadow-md"
                        style={{ backgroundColor: theme.secondaryAccent }}
                      />
                    </div>

                    <div>
                      <div className="text-xs font-black text-white group-hover:text-yellow-300 transition-colors">
                        {theme.name}
                      </div>
                      <div className="text-[10px] font-mono text-gray-400">
                        {theme.designation || 'Web-Slinger Variant'}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 bg-yellow-400 text-black rounded-full flex items-center justify-center shrink-0 shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer note inside dropdown */}
          <div className="px-3 py-2 bg-black border-t border-white/10 text-[9px] font-mono text-center text-gray-400">
            Clicking a suit instantly recalibrates HUD themes & CSS variables.
          </div>
        </div>
      )}
    </div>
  );
};