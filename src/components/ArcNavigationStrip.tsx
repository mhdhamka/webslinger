import React from 'react';
import { StoryArc, ComicIssue, UserProgressMap } from '../types';
import { Layers } from 'lucide-react';

interface ArcNavigationStripProps {
  arcs: StoryArc[];
  issues: ComicIssue[];
  userProgress: UserProgressMap;
  selectedArcId: string;
  onSelectArc: (arcId: string) => void;
}

export const ArcNavigationStrip: React.FC<ArcNavigationStripProps> = ({
  arcs,
  issues,
  userProgress,
  selectedArcId,
  onSelectArc,
}) => (
  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
    <span className="text-xs font-mono text-yellow-400 font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 bg-black px-2.5 py-1 border-2 border-black shadow-comic">
      <Layers className="w-3.5 h-3.5" />
      ARCS:
    </span>
    {arcs.map((arc) => {
      const isSelected = selectedArcId === arc.id;
      const issuesInArc = issues.filter((i) => i.arcId === arc.id);
      const readCount = issuesInArc.filter((i) => userProgress[i.id]?.isRead).length;
      const isComplete = issuesInArc.length > 0 && readCount === issuesInArc.length;

      return (
        <button
          key={arc.id}
          id={`jump-arc-${arc.id}`}
          onClick={() => {
            onSelectArc(isSelected ? 'all' : arc.id);
            const el = document.getElementById(`arc-section-${arc.id}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className={`px-3 py-1.5 rounded-sm text-xs font-black uppercase italic tracking-wider whitespace-nowrap transition-all border-2 border-black flex items-center gap-2 shrink-0 ${
            isSelected
              ? 'bg-yellow-400 text-black shadow-comic-yellow scale-[1.02]'
              : 'bg-[#1e3a8a] text-blue-100 hover:bg-blue-800 shadow-comic'
          }`}
        >
          <span
            className="w-2.5 h-2.5 border border-black shrink-0"
            style={{ backgroundColor: arc.accentColor }}
          />
          <span>{arc.title.split(':')[0]}</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-none font-mono font-black border border-black ${
              isComplete ? 'bg-green-500 text-black' : 'bg-black text-yellow-300'
            }`}
          >
            {readCount}/{issuesInArc.length}
          </span>
        </button>
      );
    })}
  </div>
);