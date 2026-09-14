import React from 'react';
import { ComicIssue, StoryArc, UserProgressMap } from '../types';
import { Package, Star } from 'lucide-react';

interface ReadingTimelineGridViewProps {
  groupedByArc: { arc: StoryArc; issues: ComicIssue[] }[];
  userProgress: UserProgressMap;
  onSelectIssue: (issue: ComicIssue) => void;
  onToggleRead: (issueId: string, e: React.MouseEvent) => void;
  onToggleOwned: (issueId: string, e: React.MouseEvent) => void;
  onUpdateRating: (issueId: string, rating: number) => void;
  onMarkArcRead: (arcId: string, read: boolean) => void;
}

export const ReadingTimelineGridView: React.FC<ReadingTimelineGridViewProps> = ({
  groupedByArc,
  userProgress,
  onSelectIssue,
  onToggleRead,
  onToggleOwned,
  onUpdateRating,
}) => {
  return (
    <div className="space-y-10">
      {groupedByArc.map(({ arc, issues: arcIssues }) => (
        <section
          key={arc.id}
          className="relative rounded-sm bg-[#111827] border-2 border-black shadow-comic-blue overflow-hidden p-5"
        >
          <div className="mb-4 pb-2 border-b-2 border-black flex items-center justify-between">
            <h3 className="text-xl font-black italic uppercase text-yellow-400">
              {arc.title}
            </h3>
            <span className="text-xs font-mono font-bold text-gray-300">
              {arcIssues.length} issues
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {arcIssues.map((issue) => {
              const prog = userProgress[issue.id];
              const isRead = prog?.isRead;
              const isOwned = prog?.isOwned;

              return (
                <div
                  key={issue.id}
                  onClick={() => onSelectIssue(issue)}
                  className={`bg-[#111827] border-2 border-black p-4 shadow-comic-blue relative group cursor-pointer hover:border-yellow-400 hover:shadow-comic-yellow transition-all flex flex-col justify-between ${
                    isRead ? 'border-yellow-400' : ''
                  }`}
                >
                  {isRead && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 border-2 border-black rounded-full flex items-center justify-center text-black font-black z-20 shadow-comic">
                      ✓
                    </div>
                  )}

                  <div>
                    {/* 2:3 Comic Cover Card */}
                    <div className="aspect-[2/3] bg-gradient-to-b from-[#1e1b4b] via-[#0f172a] to-black border-2 border-black mb-3 overflow-hidden relative group-hover:scale-[1.01] transition-transform shadow-comic">
                      <div
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 8px)',
                        }}
                      />

                      <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                        <span className="bg-red-600 text-white font-black text-[10px] px-1.5 py-0.5 tracking-wider border border-black shadow-comic">
                          MARVEL
                        </span>
                        <span className="bg-black/90 text-yellow-300 font-mono text-[9px] font-black px-1.5 py-0.5 border border-black">
                          #{issue.readingOrder}
                        </span>
                      </div>

                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        <span className="text-[10px] font-mono uppercase text-red-400 font-black tracking-widest mb-1">
                          {issue.importance}
                        </span>
                        <h3 className="text-base sm:text-lg font-black uppercase italic tracking-tight text-white drop-shadow-[2px_2px_0px_#000] leading-tight">
                          {issue.title}
                        </h3>
                        <span className="text-[11px] font-mono text-yellow-300 font-bold mt-1">
                          {issue.seriesName} {issue.issueNumber}
                        </span>
                      </div>

                      <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black via-black/90 to-transparent border-t border-black">
                        <p className="text-[10px] text-gray-300 font-mono truncate">
                         {issue.writers.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      <h4 className="font-black uppercase text-sm text-white group-hover:text-yellow-400 transition truncate">
                        {issue.seriesName} {issue.issueNumber}
                      </h4>
                      <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed">
                        {issue.synopsis}
                      </p>
                    </div>
                  </div>

                  <div
                    className="pt-2 border-t-2 border-black flex items-center justify-between mt-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => onToggleRead(issue.id, e)}
                      className={`px-2.5 py-1 text-xs font-black uppercase border-2 border-black shadow-comic transition flex items-center gap-1 ${
                        isRead ? 'bg-green-500 text-black' : 'bg-black text-gray-300 hover:bg-yellow-400 hover:text-black'
                      }`}
                    >
                      <span>{isRead ? 'Read ✓' : 'Mark Read'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => onToggleOwned(issue.id, e)}
                        className={`p-1.5 border-2 border-black shadow-comic text-xs ${
                          isOwned ? 'bg-blue-600 text-white' : 'bg-black text-gray-400 hover:text-white'
                        }`}
                        title="Mark as Owned"
                      >
                        <Package className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          onUpdateRating(issue.id, (prog?.rating || 0) === 5 ? 0 : (prog?.rating || 0) + 1)
                        }
                        className="px-1.5 py-1 bg-black border-2 border-black text-yellow-400 font-mono text-[10px] font-bold shadow-comic flex items-center gap-0.5 hover:bg-yellow-400 hover:text-black"
                      >
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{prog?.rating || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};