import React from 'react';
import { ComicIssue, StoryArc, UserProgressMap } from '../types';
import { CheckCircle2, Package, Star } from 'lucide-react';

interface ReadingTimelineFlowViewProps {
  groupedByArc: { arc: StoryArc; issues: ComicIssue[] }[];
  userProgress: UserProgressMap;
  onSelectIssue: (issue: ComicIssue) => void;
  onToggleRead: (issueId: string, e: React.MouseEvent) => void;
  onToggleOwned: (issueId: string, e: React.MouseEvent) => void;
  onUpdateRating: (issueId: string, rating: number) => void;
  onMarkArcRead: (arcId: string, read: boolean) => void;
}

export const ReadingTimelineFlowView: React.FC<ReadingTimelineFlowViewProps> = ({
  groupedByArc,
  userProgress,
  onSelectIssue,
  onToggleRead,
  onToggleOwned,
  onUpdateRating,
  onMarkArcRead,
}) => {
  return (
    <div className="space-y-10">
      {groupedByArc.map(({ arc, issues: arcIssues }) => {
        const arcReadCount = arcIssues.filter((i) => userProgress[i.id]?.isRead).length;
        const arcPercent = Math.round((arcReadCount / arcIssues.length) * 100);
        const isAllRead = arcReadCount === arcIssues.length;

        return (
          <section
            key={arc.id}
            id={`arc-section-${arc.id}`}
            className="relative rounded-sm bg-[#111827] border-2 border-black shadow-comic-blue overflow-hidden"
          >
            {/* Arc Header Banner */}
            <div className="p-5 sm:p-6 border-b-4 border-black relative overflow-hidden bg-[#1e3a8a]">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="w-3 h-3 border border-black shrink-0"
                      style={{ backgroundColor: arc.accentColor }}
                    />
                    <span className="text-xs font-mono font-black uppercase tracking-wider text-yellow-300 bg-black px-2 py-0.5 border border-black">
                      {arc.issueRange} • {arc.year}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] uppercase font-black bg-red-700 text-white border border-black shadow-[2px_2px_0px_0px_#000]">
                      {arc.importance}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter text-white drop-shadow-[2px_2px_0px_#000]">
                    {arc.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-medium">
                    {arc.summary}
                  </p>
                </div>

                {/* Progress Stats & Action */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
                  <div className="flex items-center gap-2 font-mono text-xs bg-black p-2 border-2 border-black shadow-comic">
                    <span className="text-gray-300 font-bold">
                      ARC PROGRESS: <strong className="text-yellow-400">{arcReadCount} / {arcIssues.length}</strong>
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-black uppercase border border-black ${
                        isAllRead ? 'bg-green-500 text-black' : 'bg-yellow-400 text-black'
                      }`}
                    >
                      {arcPercent}%
                    </span>
                  </div>

                  <button
                    onClick={() => onMarkArcRead(arc.id, !isAllRead)}
                    className={`px-3 py-1.5 rounded-sm text-xs font-black uppercase italic tracking-wider transition flex items-center gap-1.5 border-2 border-black shadow-comic ${
                      isAllRead ? 'bg-green-500 text-black hover:bg-green-400' : 'bg-black text-white hover:bg-yellow-400 hover:text-black'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isAllRead ? 'Arc Completed ✓' : 'Mark Arc Read'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Issues List Timeline */}
            <div className="p-4 sm:p-6 bg-[#0d1527]">
              <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-1 before:bg-black">
                {arcIssues.map((issue) => {
                  const prog = userProgress[issue.id];
                  const isRead = prog?.isRead;
                  const isOwned = prog?.isOwned;

                  return (
                    <div
                      key={issue.id}
                      id={`issue-card-${issue.id}`}
                      onClick={() => onSelectIssue(issue)}
                      className={`relative rounded-sm border-2 border-black p-4 transition-all duration-150 cursor-pointer group ${
                        isRead
                          ? 'bg-[#111827] shadow-comic-blue border-yellow-400'
                          : 'bg-[#111827] hover:bg-[#162036] shadow-comic hover:shadow-comic-yellow'
                      }`}
                    >
                      {/* Timeline Node dot */}
                      <div
                        className={`absolute -left-[29px] sm:-left-[37px] top-5 w-5 h-5 rounded-full border-2 border-black transition-all flex items-center justify-center shadow-comic ${
                          isRead
                            ? 'bg-green-500 text-black font-black text-xs'
                            : 'bg-black text-gray-400 group-hover:bg-yellow-400 group-hover:text-black'
                        }`}
                      >
                        {isRead ? '✓' : '•'}
                      </div>

                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded-none text-[11px] font-mono font-black bg-black text-yellow-300 border border-black shadow-[2px_2px_0px_0px_#000]">
                              #{issue.readingOrder}
                            </span>
                            <h4 className="text-base sm:text-lg font-black uppercase tracking-tight text-white group-hover:text-yellow-400 transition">
                              {issue.seriesName} {issue.issueNumber}
                            </h4>
                            <span className="text-xs text-yellow-200 font-bold italic">
                              "{issue.title}"
                            </span>
                            {issue.badgeLabel && (
                              <span className="px-2 py-0.5 text-[10px] uppercase font-black text-black bg-yellow-400 border border-black shadow-[2px_2px_0px_0px_#000]">
                                {issue.badgeLabel}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed italic">
                            {issue.synopsis}
                          </p>

                          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                            {issue.firstAppearances?.[0] && (
                              <span className="px-2 py-0.5 font-black uppercase text-[10px] bg-yellow-400 text-black border border-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1">
                                {issue.firstAppearances[0]}
                              </span>
                            )}
                            {issue.keyVillains.slice(0, 3).map((vil, i) => (
                              <span
                                key={i}
                                className="bg-black px-2 py-0.5 text-[10px] font-bold border border-white/40 text-gray-200 uppercase"
                              >
                                {vil}
                              </span>
                            ))}
                            <span className="text-gray-400 font-mono text-[11px]">
                               {issue.writers[0]} • {issue.artists[0]}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div
                          className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-black"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => onToggleRead(issue.id, e)}
                            className={`px-3 py-1.5 rounded-sm text-xs font-black uppercase italic tracking-wider flex items-center gap-1.5 transition border-2 border-black shadow-comic ${
                              isRead
                                ? 'bg-green-500 text-black hover:bg-green-400'
                                : 'bg-black text-gray-300 hover:bg-yellow-400 hover:text-black'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{isRead ? 'Read ✓' : 'Mark Read'}</span>
                          </button>

                          <button
                            onClick={(e) => onToggleOwned(issue.id, e)}
                            className={`p-1.5 rounded-sm text-xs transition border-2 border-black shadow-comic ${
                              isOwned ? 'bg-blue-600 text-white' : 'bg-black text-gray-400 hover:text-white'
                            }`}
                            title={isOwned ? 'In Collection' : 'Mark as Owned'}
                          >
                            <Package className="w-4 h-4" />
                          </button>

                          <div className="flex items-center gap-0.5 px-2 py-1 rounded-sm bg-black border-2 border-black shadow-comic">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => onUpdateRating(issue.id, star === prog?.rating ? 0 : star)}
                                className="p-0.5 hover:scale-125 transition"
                              >
                                <Star
                                  className={`w-3.5 h-3.5 ${
                                    (prog?.rating || 0) >= star
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-600 hover:text-gray-400'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};