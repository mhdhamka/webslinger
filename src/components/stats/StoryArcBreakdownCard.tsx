import React from 'react';
import { ComicIssue, StoryArc, UserProgressMap } from '../../types';

interface StoryArcBreakdownCardProps {
  arcs: StoryArc[];
  issues: ComicIssue[];
  userProgress: UserProgressMap;
}

export const StoryArcBreakdownCard: React.FC<StoryArcBreakdownCardProps> = ({
  arcs,
  issues,
  userProgress,
}) => {
  return (
    <div className="lg:col-span-2 bg-black border-4 border-[#1e3a8a] p-5 space-y-4 shadow-comic">
      <div className="border-b-2 border-blue-900 pb-2">
        <span className="text-[10px] font-mono uppercase text-yellow-400 font-black">PROGRESSION LOG</span>
        <h3 className="text-base font-black text-white uppercase">STORY ARC COMPLETION BREAKDOWN</h3>
      </div>

      <div className="space-y-3.5">
        {arcs.map((arc) => {
          const arcIssues = issues.filter((i) => i.arcId === arc.id);
          const arcRead = arcIssues.filter((i) => userProgress[i.id]?.isRead).length;
          const pct = arcIssues.length > 0 ? Math.round((arcRead / arcIssues.length) * 100) : 0;

          return (
            <div key={arc.id} className="space-y-1 text-xs">
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-gray-200">{arc.title}</span>
                <span className="text-yellow-400 font-bold">
                  {arcRead} / {arcIssues.length} ({pct}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#070b14] border-2 border-blue-900 overflow-hidden">
                <div
                  className="h-full transition-all duration-300 bg-yellow-400"
                  style={{
                    width: `${pct}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};