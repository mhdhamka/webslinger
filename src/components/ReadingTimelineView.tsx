import React, { useState, useMemo } from 'react';
import { ComicIssue, FilterState, StoryArc, SuitTheme, UserProgressMap } from '../types';
import confetti from 'canvas-confetti';
import { ReadingTimelineHeader } from './ReadingTimelineHeader';
import { ArcNavigationStrip } from './ArcNavigationStrip';
import { ReadingTimelineControls } from './ReadingTimelineControls';
import { ReadingTimelineFlowView } from './ReadingTimelineFlowView';
import { ReadingTimelineGridView } from './ReadingTimelineGridView';

interface ReadingTimelineViewProps {
  issues: ComicIssue[];
  arcs: StoryArc[];
  userProgress: UserProgressMap;
  suitTheme: SuitTheme;
  filterState: FilterState;
  onFilterChange: (newFilter: Partial<FilterState>) => void;
  onSelectIssue: (issue: ComicIssue) => void;
  onToggleRead: (issueId: string) => void;
  onToggleOwned: (issueId: string) => void;
  onUpdateRating: (issueId: string, rating: number) => void;
  onMarkArcRead: (arcId: string, read: boolean) => void;
}

export const ReadingTimelineView: React.FC<ReadingTimelineViewProps> = ({
  issues,
  arcs,
  userProgress,
  suitTheme,
  filterState,
  onFilterChange,
  onSelectIssue,
  onToggleRead,
  onToggleOwned,
  onUpdateRating,
  onMarkArcRead,
}) => {
  const [viewMode, setViewMode] = useState<'flow' | 'grid'>('flow');

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      if (filterState.searchQuery.trim()) {
        const query = filterState.searchQuery.toLowerCase();
        const matches = [
          issue.title.toLowerCase().includes(query),
          issue.seriesName.toLowerCase().includes(query),
          issue.issueNumber.toLowerCase().includes(query),
          issue.synopsis.toLowerCase().includes(query),
          [...issue.writers, ...issue.artists].some((c) => c.toLowerCase().includes(query)),
          issue.keyVillains.some((v) => v.toLowerCase().includes(query)),
          issue.firstAppearances.some((f) => f.toLowerCase().includes(query)),
        ];
        if (!matches.some(Boolean)) return false;
      }

      if (filterState.selectedArcId !== 'all' && issue.arcId !== filterState.selectedArcId) return false;
      if (
        filterState.selectedVillain !== 'all' &&
        !issue.keyVillains.some((v) => v.toLowerCase().includes(filterState.selectedVillain.toLowerCase()))
      )
        return false;

      const isRead = userProgress[issue.id]?.isRead;
      if (filterState.readFilter === 'read' && !isRead) return false;
      if (filterState.readFilter === 'unread' && isRead) return false;

      const isOwned = userProgress[issue.id]?.isOwned;
      if (filterState.ownedFilter === 'owned' && !isOwned) return false;
      if (filterState.ownedFilter === 'unowned' && isOwned) return false;

      return true;
    });
  }, [issues, filterState, userProgress]);

  const groupedByArc = useMemo(() => {
    const groups: { arc: StoryArc; issues: ComicIssue[] }[] = [];
    const arcMap = new Map<string, StoryArc>();
    arcs.forEach((a) => arcMap.set(a.id, a));

    filteredIssues.forEach((issue) => {
      const arc = arcMap.get(issue.arcId);
      if (!arc) return;
      let existing = groups.find((g) => g.arc.id === arc.id);
      if (!existing) {
        existing = { arc, issues: [] };
        groups.push(existing);
      }
      existing.issues.push(issue);
    });

    return groups;
  }, [filteredIssues, arcs]);

  const handleReadCheck = (issueId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const willBeRead = !userProgress[issueId]?.isRead;
    onToggleRead(issueId);
    if (willBeRead) {
      confetti({
        particleCount: 15,
        spread: 40,
        origin: { y: 0.8 },
        colors: [suitTheme.primaryAccent, '#ffffff'],
      });
    }
  };

  const handleOwnedCheck = (issueId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleOwned(issueId);
  };

  return (
    <div className="space-y-6">
      <ReadingTimelineHeader filteredCount={filteredIssues.length} totalCount={issues.length} />

      <ReadingTimelineControls
        arcs={arcs}
        filterState={filterState}
        onFilterChange={onFilterChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <ArcNavigationStrip
        arcs={arcs}
        issues={issues}
        userProgress={userProgress}
        selectedArcId={filterState.selectedArcId}
        onSelectArc={(arcId) => onFilterChange({ selectedArcId: arcId })}
      />

      {groupedByArc.length === 0 ? (
        <div className="p-12 text-center rounded-sm bg-[#111827] border-2 border-black shadow-comic space-y-3">
          <div className="text-4xl">🕸️</div>
          <h3 className="text-lg font-black uppercase italic tracking-tighter text-yellow-400">
            No Comic Issues Match Your Filter
          </h3>
          <button
            onClick={() =>
              onFilterChange({
                searchQuery: '',
                selectedArcId: 'all',
                selectedVillain: 'all',
                readFilter: 'all',
                ownedFilter: 'all',
              })
            }
            className="px-4 py-2 text-xs font-black uppercase rounded-sm bg-yellow-400 text-black border-2 border-black shadow-comic hover:bg-yellow-300 transition"
          >
            Show All Issues
          </button>
        </div>
      ) : viewMode === 'flow' ? (
        <ReadingTimelineFlowView
          groupedByArc={groupedByArc}
          userProgress={userProgress}
          onSelectIssue={onSelectIssue}
          onToggleRead={handleReadCheck}
          onToggleOwned={handleOwnedCheck}
          onUpdateRating={onUpdateRating}
          onMarkArcRead={onMarkArcRead}
        />
      ) : (
        <ReadingTimelineGridView
          groupedByArc={groupedByArc}
          userProgress={userProgress}
          onSelectIssue={onSelectIssue}
          onToggleRead={handleReadCheck}
          onToggleOwned={handleOwnedCheck}
          onUpdateRating={onUpdateRating}
          onMarkArcRead={onMarkArcRead}
        />
      )}
    </div>
  );
};