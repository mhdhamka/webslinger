import React from 'react';
import { ComicIssue, StoryArc, SuitTheme, UserProgressItem } from '../types';
import {
  X,
  BookOpen,
  Package,
  Star,
  Calendar,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Tag,
} from 'lucide-react';

interface IssueDetailModalProps {
  issue: ComicIssue | null;
  arc: StoryArc | undefined;
  progress: UserProgressItem;
  suitTheme: SuitTheme;
  onClose: () => void;
  onToggleRead: (issueId: string) => void;
  onToggleOwned: (issueId: string) => void;
  onUpdateRating: (issueId: string, rating: number) => void;
  onUpdateFormat: (issueId: string, format: 'digital' | 'floppy' | 'trade' | 'omnibus') => void;
  onUpdateNotes: (issueId: string, notes: string) => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  arc,
  progress,
  suitTheme,
  onClose,
  onToggleRead,
  onToggleOwned,
  onUpdateRating,
  onUpdateFormat,
  onUpdateNotes,
}) => {
  if (!issue) return null;

  const threatColorMap: Record<string, string> = {
    Low: 'text-blue-400 bg-blue-950/60 border-blue-500/30',
    Medium: 'text-yellow-400 bg-yellow-950/60 border-yellow-500/30',
    High: 'text-orange-400 bg-orange-950/60 border-orange-500/30',
    Extreme: 'text-red-400 bg-red-950/60 border-red-500/30',
    Omega: 'text-purple-300 bg-purple-950/80 border-purple-500/50',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-3xl rounded-sm border-4 border-black bg-[#111827] text-white shadow-comic-blue overflow-hidden my-8"
      >
        {/* Header Ribbon / Comic Style Banner */}
        <div
          className="p-6 bg-[#b91c1c] relative border-b-4 border-black comic-hatch"
        >
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 text-xs font-mono font-black uppercase rounded-none bg-black text-yellow-300 border border-black shadow-[2px_2px_0px_0px_#000]">
                  READING ORDER #{issue.readingOrder}
                </span>
                {issue.badgeLabel && (
                  <span
                    className="px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-black bg-yellow-400 border border-black shadow-[2px_2px_0px_0px_#000]"
                  >
                    {issue.badgeLabel}
                  </span>
                )}
                {arc && (
                  <span className="px-2.5 py-0.5 text-xs font-black uppercase bg-[#1e3a8a] text-blue-100 border border-black shadow-[2px_2px_0px_0px_#000]">
                    {arc.title}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tighter text-white drop-shadow-[2px_2px_0px_#000]">
                {issue.seriesName} {issue.issueNumber}
              </h2>
              <p className="text-sm font-bold text-yellow-300 mt-1 italic drop-shadow-[1px_1px_0px_#000]">
                "{issue.title}"
              </p>
            </div>

            <button
              id="close-modal-btn"
              onClick={onClose}
              className="p-2 rounded-sm bg-black hover:bg-yellow-400 hover:text-black text-white border-2 border-black transition shrink-0 shadow-comic"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-mono relative z-10">
            <span className="flex items-center gap-1.5 bg-black px-2.5 py-1 border border-black text-yellow-300 font-bold shadow-comic">
              <Calendar className="w-3.5 h-3.5" />
              COVER: {issue.coverDate}
            </span>
            <span className="flex items-center gap-1.5 bg-black px-2.5 py-1 border border-black text-yellow-300 font-bold shadow-comic">
              RELEASE: {issue.releaseDate}
            </span>
            <span
              className={`flex items-center gap-1.5 px-2.5 py-1 border-2 border-black font-black uppercase shadow-comic ${
                threatColorMap[issue.threatLevel] || 'text-slate-300'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              THREAT: {issue.threatLevel}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto bg-[#0a0f1e]">
          {/* Key Creators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-sm bg-black border-2 border-black text-xs shadow-comic">
            <div>
              <span className="text-yellow-400 font-mono uppercase tracking-wider font-black block mb-1">
                WRITTEN BY:
              </span>
              <p className="font-bold text-white text-sm">
                {issue.writers.join(', ')}
              </p>
            </div>
            <div>
              <span className="text-yellow-400 font-mono uppercase tracking-wider font-black block mb-1">
                ART & PENCILS:
              </span>
              <p className="font-bold text-white text-sm">
                {issue.artists.join(', ')}
              </p>
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h3 className="text-sm font-black uppercase italic tracking-wider text-yellow-400 font-mono mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-yellow-400" />
              ARCHIVAL ISSUE SYNOPSIS
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-gray-200 bg-[#111827] p-4 rounded-sm border-2 border-black shadow-comic italic">
              {issue.synopsis}
            </p>
          </div>

          {/* First Appearances Badge Callout */}
          {issue.firstAppearances && issue.firstAppearances.length > 0 && (
            <div className="p-3.5 rounded-sm bg-yellow-400 border-2 border-black shadow-comic">
              <span className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-1.5 mb-2 font-mono">
                HISTORIC FIRST APPEARANCES & DEBUTS:
              </span>
              <div className="flex flex-wrap gap-2">
                {issue.firstAppearances.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs rounded-none font-black uppercase bg-black text-yellow-300 border border-black shadow-[2px_2px_0px_0px_#000]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Featured Characters & Villains */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-mono uppercase font-black tracking-wider text-blue-300 mb-2 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                CAST & ALLIES:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {issue.keyCharacters.map((char, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs rounded-none bg-black text-white border border-white/40 font-bold uppercase"
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase font-black tracking-wider text-red-400 mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-red-400" />
                ROGUES / ANTAGONISTS:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {issue.keyVillains.map((vil, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs rounded-none bg-red-700 text-white border border-black font-black uppercase shadow-[2px_2px_0px_0px_#000]"
                  >
                    {vil}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Trivia / Reading Advice */}
          {issue.trivia && (
            <div className="p-3.5 rounded-sm bg-[#1e3a8a] border-2 border-black text-xs shadow-comic">
              <span className="font-black text-yellow-300 block mb-1 font-mono uppercase">
                🕸️ CONTINUITY DOSSIER TRIVIA:
              </span>
              <p className="text-blue-100 leading-relaxed font-medium">{issue.trivia}</p>
            </div>
          )}

          {/* Interactive User Reader Dossier / Pivot Table Record */}
          <div className="pt-4 border-t-2 border-black space-y-4">
            <h3 className="text-sm font-black uppercase italic tracking-wider text-yellow-400 font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              READER PROGRESS & PERSONAL LOG
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Read & Owned Toggles */}
              <div className="space-y-2">
                <button
                  id={`modal-toggle-read-${issue.id}`}
                  onClick={() => onToggleRead(issue.id)}
                  className={`w-full p-3 rounded-sm border-2 border-black flex items-center justify-between font-black uppercase text-xs transition shadow-comic ${
                    progress?.isRead
                      ? 'bg-green-500 text-black hover:bg-green-400'
                      : 'bg-black text-gray-300 hover:bg-yellow-400 hover:text-black'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {progress?.isRead ? 'READ STATUS: COMPLETED' : 'READ STATUS: UNREAD'}
                  </span>
                  <span className="text-xs px-2 py-0.5 border border-black bg-black text-white font-mono">
                    {progress?.isRead ? '✓ READ' : 'MARK READ'}
                  </span>
                </button>

                <button
                  id={`modal-toggle-owned-${issue.id}`}
                  onClick={() => onToggleOwned(issue.id)}
                  className={`w-full p-3 rounded-sm border-2 border-black flex items-center justify-between font-black uppercase text-xs transition shadow-comic ${
                    progress?.isOwned
                      ? 'bg-blue-600 text-white'
                      : 'bg-black text-gray-400 hover:bg-blue-900 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    {progress?.isOwned ? 'IN PERSONAL COLLECTION' : 'NOT IN COLLECTION'}
                  </span>
                  <span className="text-xs px-2 py-0.5 border border-black bg-black text-white font-mono">
                    {progress?.isOwned ? '✓ OWNED' : 'MARK OWNED'}
                  </span>
                </button>
              </div>

              {/* Rating & Format */}
              <div className="space-y-3 bg-black p-3.5 rounded-sm border-2 border-black shadow-comic">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-yellow-400 font-black block mb-1.5">
                    YOUR COMIC RATING:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => onUpdateRating(issue.id, star === progress?.rating ? 0 : star)}
                        className="p-1 hover:scale-125 transition"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            (progress?.rating || 0) >= star
                              ? 'text-yellow-400 fill-yellow-400 drop-shadow'
                              : 'text-gray-600 hover:text-gray-400'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-yellow-300 ml-2 font-mono font-bold">
                      {progress?.rating ? `${progress.rating} / 5 STARS` : 'UNRATED'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-yellow-400 font-black block mb-1.5">
                    READING FORMAT:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-xs font-bold uppercase">
                    {(['digital', 'floppy', 'trade', 'omnibus'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => onUpdateFormat(issue.id, fmt)}
                        className={`py-1 px-2 rounded-none border-2 border-black transition ${
                          progress?.readingFormat === fmt
                            ? 'bg-yellow-400 text-black shadow-comic-yellow'
                            : 'bg-[#111827] text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        {fmt === 'floppy' ? 'Floppy / Single' : fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Textarea */}
            <div>
              <span className="text-xs font-mono uppercase font-black tracking-wider text-yellow-400 block mb-1.5">
                READER NOTES & FAVORITE PANELS:
              </span>
              <textarea
                value={progress?.notes || ''}
                onChange={(e) => onUpdateNotes(issue.id, e.target.value)}
                placeholder="Log your thoughts, favorite quotes, or panel notes for this issue..."
                rows={2}
                className="w-full p-3 rounded-sm bg-black border-2 border-black text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-yellow-400 transition font-mono shadow-comic"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black border-t-4 border-black flex items-center justify-between">
          <span className="text-xs text-yellow-400 font-mono font-bold">
            MARVEL CONTINUITY ARCHIVE • ASM #{issue.issueNumber}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-sm text-xs font-black uppercase bg-yellow-400 text-black border-2 border-black shadow-comic hover:bg-yellow-300 transition"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
