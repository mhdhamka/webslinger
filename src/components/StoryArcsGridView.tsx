import React, { useState } from 'react';
import { ComicIssue, StoryArc, SuitTheme, UserProgressMap } from '../types';
import {
  Layers,
  CheckCircle2,
  Circle,
  Package,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StoryArcsGridViewProps {
  arcs: StoryArc[];
  issues: ComicIssue[];
  userProgress: UserProgressMap;
  suitTheme: SuitTheme;
  onSelectIssue: (issue: ComicIssue) => void;
  onToggleRead: (issueId: string) => void;
  onToggleOwned: (issueId: string) => void;
  onMarkArcRead: (arcId: string, read: boolean) => void;
  onMarkArcOwned: (arcId: string, owned: boolean) => void;
  onFilterByVillain: (villain: string) => void;
  onJumpToTimelineArc: (arcId: string) => void;
}

export const StoryArcsGridView: React.FC<StoryArcsGridViewProps> = ({
  arcs,
  issues,
  userProgress,
  suitTheme,
  onSelectIssue,
  onToggleRead,
  onToggleOwned,
  onMarkArcRead,
  onMarkArcOwned,
  onFilterByVillain,
  onJumpToTimelineArc,
}) => {
  const [expandedArcId, setExpandedArcId] = useState<string | null>(null);

  const toggleExpand = (arcId: string) => {
    setExpandedArcId(expandedArcId === arcId ? null : arcId);
  };

  const handleArcReadBatch = (arcId: string, currentIsAllRead: boolean) => {
    onMarkArcRead(arcId, !currentIsAllRead);
    if (!currentIsAllRead) {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.5 },
        colors: [suitTheme.primaryAccent, suitTheme.secondaryAccent, '#ffffff'],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-5 rounded-sm bg-[#111827] border-2 border-black shadow-comic-blue">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-red-600 text-white font-black text-xs px-2 py-0.5 tracking-wider border border-black shadow-comic">
                MARVEL
              </span>
              <span className="text-yellow-400 text-xs font-mono font-bold uppercase tracking-widest">
                NARRATIVE ARCS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white italic drop-shadow-[2px_2px_0px_#000]">
              Brand New Day Story Arcs Matrix
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 font-mono mt-1 max-w-2xl">
              Chronological story arcs spanning the Brain Trust renaissance of Brand New Day, The
              Gauntlet, Grim Hunt, and Big Time. Track and mark reading progress by entire arcs.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-black p-2.5 rounded-sm border-2 border-black shadow-comic">
            <span className="text-yellow-400 font-bold">TOTAL ARCS:</span>
            <strong className="text-white text-sm">{arcs.length}</strong>
            <span className="text-gray-600">|</span>
            <span className="text-yellow-400 font-bold">TOTAL ISSUES:</span>
            <strong className="text-white text-sm">{issues.length}</strong>
          </div>
        </div>
      </div>

      {/* Arcs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {arcs.map((arc) => {
          const arcIssues = issues.filter((i) => i.arcId === arc.id);
          const readCount = arcIssues.filter((i) => userProgress[i.id]?.isRead).length;
          const ownedCount = arcIssues.filter((i) => userProgress[i.id]?.isOwned).length;
          const percentRead = arcIssues.length > 0 ? Math.round((readCount / arcIssues.length) * 100) : 0;
          const isAllRead = arcIssues.length > 0 && readCount === arcIssues.length;
          const isAllOwned = arcIssues.length > 0 && ownedCount === arcIssues.length;
          const isExpanded = expandedArcId === arc.id;

          return (
            <div
              key={arc.id}
              id={`arc-card-${arc.id}`}
              className="rounded-sm border-2 bg-[#111827] border-black overflow-hidden shadow-comic-blue transition flex flex-col justify-between"
            >
              {/* Card Top Banner */}
              <div
                className="p-4 border-b-2 border-black relative"
                style={{
                  background: `linear-gradient(135deg, ${arc.accentColor}40 0%, #111827 100%)`,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-none border border-black"
                        style={{ backgroundColor: arc.accentColor }}
                      />
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-yellow-300">
                        {arc.issueRange} • {arc.year}
                      </span>
                      <span className="px-2 py-0.2 rounded-none text-[10px] uppercase font-black bg-black text-white border border-black">
                        {arc.importance}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black uppercase text-white tracking-tight">{arc.title}</h3>
                    <p className="text-xs text-gray-300 italic mt-0.5">{arc.subtitle}</p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-sm text-xs font-black font-mono shrink-0 border-2 border-black shadow-comic ${
                      isAllRead
                        ? 'bg-green-500 text-black'
                        : 'bg-black text-yellow-300'
                    }`}
                  >
                    {percentRead}% Read
                  </span>
                </div>

                {/* Arc Progress Bar */}
                <div className="mt-3.5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-300">
                    <span>
                      COMPLETED: <strong className="text-white">{readCount}</strong> / {arcIssues.length}
                    </span>
                    <span>
                      OWNED: <strong className="text-yellow-300">{ownedCount}</strong> / {arcIssues.length}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-black border border-black overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 bg-yellow-400"
                      style={{
                        width: `${percentRead}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Arc Details Body */}
              <div className="p-4 space-y-3.5 flex-1">
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {arc.summary}
                </p>

                {/* Creators */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 rounded-sm bg-black border-2 border-black text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-yellow-400 font-bold block">WRITERS:</span>
                    <p className="font-semibold text-white truncate">
                      {arc.keyCreators.writers.join(', ')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-yellow-400 font-bold block">ARTISTS:</span>
                    <p className="font-semibold text-white truncate">
                      {arc.keyCreators.artists.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Key Villains with Clickable Filter */}
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 block mb-1">
                    FEATURED VILLAINS:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {arc.keyVillains.map((villain, idx) => (
                      <button
                        key={idx}
                        onClick={() => onFilterByVillain(villain)}
                        className="px-2 py-0.5 text-xs font-mono font-bold bg-black hover:bg-yellow-400 hover:text-black text-red-300 border border-black shadow-comic transition"
                      >
                        {villain}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Expandable Issues Accordion */}
                {isExpanded && (
                  <div className="pt-3 border-t-2 border-black space-y-2 animate-fadeIn">
                    <span className="text-xs font-mono uppercase text-yellow-400 font-bold block mb-1">
                      Included Issues Checklist:
                    </span>
                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {arcIssues.map((issue) => {
                        const isRead = userProgress[issue.id]?.isRead;
                        return (
                          <div
                            key={issue.id}
                            onClick={() => onSelectIssue(issue)}
                            className="p-2 rounded-sm bg-black border border-black flex items-center justify-between text-xs cursor-pointer group shadow-comic hover:border-yellow-400"
                          >
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleRead(issue.id);
                                }}
                                className="text-gray-400 hover:text-white"
                              >
                                {isRead ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                                ) : (
                                  <Circle className="w-4 h-4 text-gray-600" />
                                )}
                              </button>
                              <span className="font-mono text-yellow-400">#{issue.readingOrder}</span>
                              <span className="font-black uppercase text-white group-hover:text-yellow-400 truncate">
                                {issue.seriesName} {issue.issueNumber}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-gray-400 italic">
                              {issue.coverDate}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 bg-black border-t-2 border-black flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleArcReadBatch(arc.id, isAllRead)}
                    className={`px-3 py-1.5 rounded-sm text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border-2 border-black shadow-comic transition ${
                      isAllRead
                        ? 'bg-green-500 text-black'
                        : 'bg-[#1e3a8a] text-white hover:bg-blue-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isAllRead ? 'Arc Read ✓' : 'Mark Arc Read'}</span>
                  </button>

                  <button
                    onClick={() => onMarkArcOwned(arc.id, !isAllOwned)}
                    className={`p-1.5 rounded-sm text-xs border-2 border-black shadow-comic transition ${
                      isAllOwned
                        ? 'bg-blue-600 text-white'
                        : 'bg-black text-gray-400 hover:text-white'
                    }`}
                    title={isAllOwned ? 'All Issues Owned' : 'Mark All Issues as Owned'}
                  >
                    <Package className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleExpand(arc.id)}
                    className="px-2.5 py-1.5 rounded-sm text-xs font-black uppercase text-gray-300 hover:text-black bg-gray-900 hover:bg-yellow-400 border-2 border-black shadow-comic flex items-center gap-1 transition"
                  >
                    <span>{isExpanded ? 'Hide' : `Issues (${arcIssues.length})`}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onJumpToTimelineArc(arc.id)}
                    className="px-3 py-1.5 rounded-sm text-xs font-black uppercase bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-black shadow-comic flex items-center gap-1 transition"
                  >
                    <span>Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
