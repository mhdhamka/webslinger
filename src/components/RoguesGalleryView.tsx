import React, { useState } from 'react';
import { ComicIssue, SuitTheme, UserProgressMap } from '../types';
import { VILLAINS_GALLERY } from '../data/spiderManData';

interface RoguesGalleryViewProps {
  issues: ComicIssue[];
  userProgress: UserProgressMap;
  suitTheme: SuitTheme;
  onSelectIssue: (issue: ComicIssue) => void;
  onToggleRead: (issueId: string) => void;
}

export const RoguesGalleryView: React.FC<RoguesGalleryViewProps> = ({
  issues,
  userProgress,
  suitTheme,
  onSelectIssue,
  onToggleRead,
}) => {
  const [selectedVillainId, setSelectedVillainId] = useState<string>(VILLAINS_GALLERY[0].id);

  const selectedVillain =
    VILLAINS_GALLERY.find((v) => v.id === selectedVillainId) || VILLAINS_GALLERY[0];

  // Find all issues featuring this villain
  const villainIssues = issues.filter((issue) =>
    issue.keyVillains.some((v) =>
      v.toLowerCase().includes(selectedVillain.name.toLowerCase()) ||
      v.toLowerCase().includes(selectedVillain.alias.toLowerCase())
    )
  );

  const readCount = villainIssues.filter((i) => userProgress[i.id]?.isRead).length;
  const percentRead =
    villainIssues.length > 0 ? Math.round((readCount / villainIssues.length) * 100) : 0;

  const threatBoxStyle: Record<string, string> = {
    Low: 'bg-blue-950 text-blue-300 border-blue-500',
    Medium: 'bg-yellow-950 text-yellow-300 border-yellow-500',
    High: 'bg-orange-950 text-orange-300 border-orange-500',
    Extreme: 'bg-red-950 text-red-300 border-red-500',
    Omega: 'bg-purple-950 text-purple-300 border-purple-500 shadow-[2px_2px_0px_0px_#a855f7]',
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-[#1e3a8a] border-4 border-black p-5 shadow-comic relative overflow-hidden text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="text-[10px] font-mono tracking-widest text-yellow-400 uppercase font-black mb-1">
              [ ANTAGONIST DATABASE ACTIVATED ]
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide">
              ROGUES GALLERY & DOSSIERS
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 font-mono mt-1 max-w-2xl">
              Track arch-nemeses, threat tiers, and issue read counts across Brand New Day story lines.
            </p>
          </div>
          <div className="px-4 py-2 bg-black border-2 border-yellow-400 text-right shadow-[2px_2px_0px_0px_#facc15]">
            <div className="text-[9px] font-mono text-yellow-400 uppercase">TOTAL DOSSIERS</div>
            <div className="text-base font-black font-mono text-white">{VILLAINS_GALLERY.length}</div>
          </div>
        </div>
      </div>

      {/* Villain Selector Row (Iconless Comic Buttons) */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-thin">
        {VILLAINS_GALLERY.map((villain) => {
          const isSelected = selectedVillainId === villain.id;
          const vIssues = issues.filter((i) =>
            i.keyVillains.some((v) => v.toLowerCase().includes(villain.name.toLowerCase()))
          );
          const vReadCount = vIssues.filter((i) => userProgress[i.id]?.isRead).length;
          const vPercent = vIssues.length > 0 ? Math.round((vReadCount / vIssues.length) * 100) : 0;

          return (
            <button
              key={villain.id}
              id={`rogue-btn-${villain.id}`}
              onClick={() => setSelectedVillainId(villain.id)}
              className={`p-3 border-4 text-left transition-all shrink-0 min-w-[190px] shadow-comic ${
                isSelected
                  ? 'bg-yellow-400 text-black border-black font-black translate-y-[-2px]'
                  : 'bg-black text-white border-blue-900 hover:border-yellow-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl px-2 py-0.5 bg-black/40 border border-current">
                  {villain.imageAvatar}
                </span>
                <span className={`text-[9px] font-mono uppercase px-2 py-0.5 font-bold border border-black ${threatBoxStyle[villain.threatLevel] || 'bg-slate-800 text-white'}`}>
                  {villain.threatLevel}
                </span>
              </div>
              <div className="font-bold text-xs uppercase tracking-wide truncate">
                {villain.name}
              </div>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-current/20 text-[10px] font-mono">
                <span>{vIssues.length} ISSUES</span>
                <span className="font-black">{vPercent}% READ</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Rogue Dossier & Issues Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Villain Dossier Card */}
        <div className="lg:col-span-1 bg-black border-4 border-[#1e3a8a] p-5 space-y-4 shadow-comic">
          <div className="bg-yellow-400 text-black font-mono font-black text-[10px] px-2.5 py-1 border-2 border-black inline-block">
            DOSSIER ID: #{selectedVillain.id.toUpperCase()}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-950 border-2 border-yellow-400 flex items-center justify-center text-2xl">
              {selectedVillain.imageAvatar}
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase">{selectedVillain.name}</h3>
              <p className="text-xs text-yellow-400 font-mono font-bold">
                [{selectedVillain.alias}]
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-[#070b14] border-2 border-blue-900 text-xs font-mono">
            <span className="text-gray-400">THREAT TIER:</span>
            <span className={`px-2 py-0.5 font-black uppercase border border-black ${threatBoxStyle[selectedVillain.threatLevel]}`}>
              {selectedVillain.threatLevel}
            </span>
          </div>

          <div className="p-2.5 bg-[#070b14] border-2 border-blue-900 space-y-1 text-xs">
            <span className="text-yellow-400 font-mono uppercase block text-[10px] font-bold">FIRST APPEARANCE:</span>
            <span className="font-bold text-white font-mono">
              {selectedVillain.firstAppearedIn}
            </span>
          </div>

          <div className="space-y-1 text-xs">
            <span className="font-mono uppercase text-yellow-400 font-bold text-[10px] block">
              THREAT BIO:
            </span>
            <p className="text-gray-300 leading-relaxed bg-[#070b14] p-3 border-2 border-blue-900 font-sans text-xs">
              {selectedVillain.bio}
            </p>
          </div>

          <div className="space-y-1 text-xs">
            <span className="font-mono uppercase text-yellow-400 font-bold text-[10px] block">
              POWERS & WEAPONRY:
            </span>
            <p className="text-gray-300 leading-relaxed bg-[#070b14] p-3 border-2 border-blue-900 font-sans text-xs">
              {selectedVillain.powerDescription}
            </p>
          </div>

          <div className="pt-2 border-t-2 border-blue-900 space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-yellow-400 font-bold block">
              KEY CONFLICT ARCS:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedVillain.keyArcs.map((arc, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[10px] font-mono font-bold bg-red-900 text-white border-2 border-black"
                >
                  {arc}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Issues Checklist Container */}
        <div className="lg:col-span-2 bg-black border-4 border-[#1e3a8a] p-5 space-y-4 shadow-comic flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-blue-900">
            <div>
              <div className="text-[10px] font-mono text-yellow-400 uppercase font-black">CHRONOLOGICAL LOG</div>
              <h3 className="text-base font-black text-white uppercase">
                ISSUES FEATURING {selectedVillain.name.toUpperCase()}
              </h3>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs bg-[#070b14] px-3 py-1.5 border-2 border-blue-900">
              <span className="text-gray-300">
                READ: <strong className="text-white">{readCount}</strong> / {villainIssues.length}
              </span>
              <span className={`px-2 py-0.5 font-black border border-black ${percentRead === 100 ? 'bg-emerald-600 text-white' : 'bg-yellow-400 text-black'}`}>
                {percentRead}%
              </span>
            </div>
          </div>

          {/* Progress Bar Line */}
          <div className="w-full h-2 bg-[#070b14] border-2 border-blue-900 overflow-hidden">
            <div 
              className="h-full bg-yellow-400 transition-all duration-300" 
              style={{ width: `${percentRead}%` }}
            />
          </div>

          {/* Issues List */}
          {villainIssues.length === 0 ? (
            <div className="p-12 text-center text-gray-400 font-mono text-xs border-2 border-dashed border-blue-900 my-auto">
              [ NO LOGGED ISSUES FOUND FOR THIS ANTAGONIST IN CURRENT CHRONOLOGY ]
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
              {villainIssues.map((issue) => {
                const isRead = userProgress[issue.id]?.isRead;

                return (
                  <div
                    key={issue.id}
                    onClick={() => onSelectIssue(issue)}
                    className={`p-3.5 border-4 transition cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isRead
                        ? 'bg-emerald-950/40 border-emerald-600 hover:border-emerald-400'
                        : 'bg-[#070b14] border-blue-900 hover:border-yellow-400'
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-mono font-black bg-black text-yellow-400 border-2 border-yellow-500">
                          #{issue.readingOrder}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-950 text-blue-200 border border-blue-800">
                          {issue.seriesName} {issue.issueNumber}
                        </span>
                        <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-yellow-400 transition uppercase">
                          "{issue.title}"
                        </h4>
                      </div>
                      <p className="text-xs text-gray-300 font-sans line-clamp-1">{issue.synopsis}</p>
                    </div>

                    <div
                      className="flex items-center gap-2 shrink-0 self-end sm:self-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onToggleRead(issue.id)}
                        className={`px-3 py-1.5 text-xs font-mono font-black uppercase border-2 border-black transition ${
                          isRead
                            ? 'bg-emerald-500 text-black shadow-[2px_2px_0px_0px_#000]'
                            : 'bg-black text-white hover:bg-yellow-400 hover:text-black shadow-[2px_2px_0px_0px_#1e3a8a]'
                        }`}
                      >
                        {isRead ? '[ COMPLETED ]' : '[ MARK READ ]'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};