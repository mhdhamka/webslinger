import React, { useState, useEffect } from 'react';
import { ActiveTab, ComicIssue, FilterState, SuitTheme, UserProgressMap } from './types';
import { COMIC_ISSUES, DEFAULT_PROGRESS, STORY_ARCS, SUIT_THEMES } from './data/spiderManData';
import { Header } from './components/Header';
import { ReadingTimelineView } from './components/ReadingTimelineView';
import { StoryArcsGridView } from './components/StoryArcsGridView';
import { RoguesGalleryView } from './components/RoguesGalleryView';
import { SpiderTelemetryStats } from './components/SpiderTelemetryStats';
import { AiChronologistView } from './components/AiChronologistView';
import { IssueDetailModal } from './components/IssueDetailModal';
import confetti from 'canvas-confetti';
import { Filter, Sparkles, CheckCircle2 } from 'lucide-react';

const STORAGE_PROGRESS_KEY = 'webslinger_archives_progress_v2';
const STORAGE_THEME_KEY = 'webslinger_archives_suit_theme_id_v2';

export default function App() {
  // Load User Progress from localStorage
  const [userProgress, setUserProgress] = useState<UserProgressMap>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROGRESS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse progress from storage', e);
    }
    return DEFAULT_PROGRESS;
  });

  // Load Suit Theme
  const [suitTheme, setSuitTheme] = useState<SuitTheme>(() => {
    try {
      const savedThemeId = localStorage.getItem(STORAGE_THEME_KEY);
      if (savedThemeId) {
        const found = SUIT_THEMES.find((t) => t.id === savedThemeId);
        if (found) return found;
      }
    } catch (e) {
      console.error('Failed to parse theme from storage', e);
    }
    return SUIT_THEMES[0]; // Classic Red & Blue default
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('timeline');

  // Filter State
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    selectedEraId: 'all',
    selectedArcId: 'all',
    selectedVillain: 'all',
    selectedCharacter: 'all',
    readFilter: 'all',
    ownedFilter: 'all',
    selectedImportance: 'all',
    sortBy: 'order',
  });

  // Selected Issue for Modal
  const [selectedIssue, setSelectedIssue] = useState<ComicIssue | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Global Keyboard Shortcuts (e.g. '/' for quick search focus or 'N' for next unread)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSelectRandomNextUnread();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userProgress]);

  // Persist User Progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(userProgress));
    } catch (e) {
      console.error('Failed to save progress to storage', e);
    }
  }, [userProgress]);

  // Persist Suit Theme
  const handleSelectSuitTheme = (theme: SuitTheme) => {
    setSuitTheme(theme);
    try {
      localStorage.setItem(STORAGE_THEME_KEY, theme.id);
    } catch (e) {
      console.error('Failed to save suit theme to storage', e);
    }
    showToast(`Suit Matrix Re-aligned: ${theme.name}`);
  };

  // Progress update handlers
  const handleToggleRead = (issueId: string) => {
    setUserProgress((prev) => {
      const current = prev[issueId] || {
        issueId,
        isRead: false,
        isOwned: false,
        rating: 0,
        readingFormat: 'digital',
        notes: '',
      };
      const willBeRead = !current.isRead;
      return {
        ...prev,
        [issueId]: {
          ...current,
          isRead: willBeRead,
          dateRead: willBeRead ? new Date().toISOString().split('T')[0] : undefined,
        },
      };
    });
  };

  const handleToggleOwned = (issueId: string) => {
    setUserProgress((prev) => {
      const current = prev[issueId] || {
        issueId,
        isRead: false,
        isOwned: false,
        rating: 0,
        readingFormat: 'floppy',
        notes: '',
      };
      return {
        ...prev,
        [issueId]: {
          ...current,
          isOwned: !current.isOwned,
        },
      };
    });
  };

  const handleUpdateRating = (issueId: string, rating: number) => {
    setUserProgress((prev) => {
      const current = prev[issueId] || {
        issueId,
        isRead: true,
        isOwned: false,
        rating: 0,
        readingFormat: 'digital',
        notes: '',
      };
      return {
        ...prev,
        [issueId]: {
          ...current,
          rating,
          isRead: true,
        },
      };
    });
  };

  const handleUpdateFormat = (
    issueId: string,
    format: 'digital' | 'floppy' | 'trade' | 'omnibus'
  ) => {
    setUserProgress((prev) => {
      const current = prev[issueId] || {
        issueId,
        isRead: false,
        isOwned: true,
        rating: 0,
        readingFormat: 'digital',
        notes: '',
      };
      return {
        ...prev,
        [issueId]: {
          ...current,
          readingFormat: format,
          isOwned: true,
        },
      };
    });
  };

  const handleUpdateNotes = (issueId: string, notes: string) => {
    setUserProgress((prev) => {
      const current = prev[issueId] || {
        issueId,
        isRead: false,
        isOwned: false,
        rating: 0,
        readingFormat: 'digital',
        notes: '',
      };
      return {
        ...prev,
        [issueId]: {
          ...current,
          notes,
        },
      };
    });
  };

  const handleMarkArcRead = (arcId: string, read: boolean) => {
    const arcIssues = COMIC_ISSUES.filter((i) => i.arcId === arcId);
    setUserProgress((prev) => {
      const next = { ...prev };
      arcIssues.forEach((issue) => {
        const cur = next[issue.id] || {
          issueId: issue.id,
          isRead: false,
          isOwned: false,
          rating: 0,
          readingFormat: 'digital',
          notes: '',
        };
        next[issue.id] = {
          ...cur,
          isRead: read,
          dateRead: read ? new Date().toISOString().split('T')[0] : undefined,
        };
      });
      return next;
    });
    showToast(read ? 'Story Arc marked as complete! 🌟' : 'Story Arc reset to unread');
  };

  const handleMarkArcOwned = (arcId: string, owned: boolean) => {
    const arcIssues = COMIC_ISSUES.filter((i) => i.arcId === arcId);
    setUserProgress((prev) => {
      const next = { ...prev };
      arcIssues.forEach((issue) => {
        const cur = next[issue.id] || {
          issueId: issue.id,
          isRead: false,
          isOwned: false,
          rating: 0,
          readingFormat: 'floppy',
          notes: '',
        };
        next[issue.id] = {
          ...cur,
          isOwned: owned,
        };
      });
      return next;
    });
    showToast(owned ? 'All issues in arc marked as owned!' : 'Removed arc from owned collection');
  };

  // Utility Actions
  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all reading progress and ratings?')) {
      setUserProgress({});
      showToast('Reading archives reset.');
    }
  };

  const handleExportData = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            version: '2.0',
            exportedAt: new Date().toISOString(),
            suitThemeId: suitTheme.id,
            userProgress,
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `spider-man-bnd-progress-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Progress backup JSON exported successfully!');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.userProgress) {
          setUserProgress(parsed.userProgress);
          if (parsed.suitThemeId) {
            const foundTheme = SUIT_THEMES.find((t) => t.id === parsed.suitThemeId);
            if (foundTheme) setSuitTheme(foundTheme);
          }
          showToast('Reading progress restored from JSON backup!');
        } else {
          showToast('Invalid backup file format.');
        }
      } catch (err) {
        showToast('Failed to parse backup JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSelectRandomNextUnread = () => {
    const unreadIssues = COMIC_ISSUES.filter((i) => !userProgress[i.id]?.isRead);
    if (unreadIssues.length === 0) {
      showToast('Sensational! You have completed every issue in the archives! 🎉');
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.3 },
      });
      return;
    }
    const nextIssue = unreadIssues[0];
    setSelectedIssue(nextIssue);
    showToast(`Next Issue: ${nextIssue.seriesName} ${nextIssue.issueNumber}`);
  };

  const handleFilterByVillain = (villainName: string) => {
    setFilterState((prev) => ({
      ...prev,
      selectedVillain: villainName,
    }));
    setActiveTab('timeline');
    showToast(`Filtered reading timeline for: ${villainName}`);
  };

  const handleJumpToTimelineArc = (arcId: string) => {
    setFilterState((prev) => ({
      ...prev,
      selectedArcId: arcId,
    }));
    setActiveTab('timeline');
    setTimeout(() => {
      const el = document.getElementById(`arc-section-${arcId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const selectedArc = selectedIssue
    ? STORY_ARCS.find((a) => a.id === selectedIssue.arcId)
    : undefined;

  return (
    <div
      className="min-h-screen bg-[#0a0f1e] text-white font-sans selection:bg-yellow-400 selection:text-black comic-dots relative"
      style={
        {
          '--suit-primary': suitTheme.primaryAccent,
          '--suit-secondary': suitTheme.secondaryAccent,
        } as React.CSSProperties
      }
    >
      {/* Halftone / Web Pattern Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20 comic-hatch-fine z-0" />

      {/* Main App Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header with Artistic Flair Theme */}
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userProgress={userProgress}
          suitTheme={suitTheme}
          onSelectSuitTheme={handleSelectSuitTheme}
          onResetProgress={handleResetProgress}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onSelectRandomNextUnread={handleSelectRandomNextUnread}
        />

        {/* Comic Dialogue & Interactive Quick-Filter Banner */}
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-1">
          <div className="bg-black border-l-4 border-yellow-400 p-3 shadow-comic flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 italic font-medium">
              <span>"Face it, Tiger... you just hit the jackpot!" — Welcome to the Marvel Brand New Day Comic Archives</span>
            </div>

            {/* Interactive Quick Status Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setFilterState((prev) => ({
                    ...prev,
                    readFilter: prev.readFilter === 'unread' ? 'all' : 'unread',
                  }));
                  setActiveTab('timeline');
                }}
                className={`px-2.5 py-1 text-[10px] font-mono uppercase font-black border border-black shadow-[2px_2px_0px_0px_#000] transition ${
                  filterState.readFilter === 'unread' ? 'bg-yellow-400 text-black' : 'bg-blue-900 text-blue-100 hover:bg-blue-800'
                }`}
              >
                Filter: Unread Only
              </button>

              {filterState.selectedArcId !== 'all' && (
                <button
                  onClick={() => setFilterState((prev) => ({ ...prev, selectedArcId: 'all' }))}
                  className="px-2.5 py-1 text-[10px] font-mono uppercase font-black bg-red-700 text-white border border-black shadow-[2px_2px_0px_0px_#000] hover:bg-red-600 flex items-center gap-1"
                >
                  <span>Arc: {filterState.selectedArcId.toUpperCase()}</span>
                  <span className="text-yellow-300 font-bold ml-1">×</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
          {activeTab === 'timeline' && (
            <ReadingTimelineView
              issues={COMIC_ISSUES}
              arcs={STORY_ARCS}
              userProgress={userProgress}
              suitTheme={suitTheme}
              filterState={filterState}
              onFilterChange={(newF) => setFilterState((prev) => ({ ...prev, ...newF }))}
              onSelectIssue={(iss) => setSelectedIssue(iss)}
              onToggleRead={handleToggleRead}
              onToggleOwned={handleToggleOwned}
              onUpdateRating={handleUpdateRating}
              onMarkArcRead={handleMarkArcRead}
            />
          )}

          {activeTab === 'arcs' && (
            <StoryArcsGridView
              arcs={STORY_ARCS}
              issues={COMIC_ISSUES}
              userProgress={userProgress}
              suitTheme={suitTheme}
              onSelectIssue={(iss) => setSelectedIssue(iss)}
              onToggleRead={handleToggleRead}
              onToggleOwned={handleToggleOwned}
              onMarkArcRead={handleMarkArcRead}
              onMarkArcOwned={handleMarkArcOwned}
              onFilterByVillain={handleFilterByVillain}
              onJumpToTimelineArc={handleJumpToTimelineArc}
            />
          )}

          {activeTab === 'rogues' && (
            <RoguesGalleryView
              issues={COMIC_ISSUES}
              userProgress={userProgress}
              suitTheme={suitTheme}
              onSelectIssue={(iss) => setSelectedIssue(iss)}
              onToggleRead={handleToggleRead}
            />
          )}

          {activeTab === 'stats' && (
            <SpiderTelemetryStats
              issues={COMIC_ISSUES}
              arcs={STORY_ARCS}
              userProgress={userProgress}
              suitTheme={suitTheme}
              onSelectIssue={(iss) => setSelectedIssue(iss)}
            />
          )}

          {activeTab === 'ai-chronologist' && (
            <AiChronologistView
              issues={COMIC_ISSUES}
              arcs={STORY_ARCS}
              userProgress={userProgress}
              suitTheme={suitTheme}
              onSelectIssue={(iss) => setSelectedIssue(iss)}
            />
          )}
        </main>

        {/* Comic Strip System Status Footer */}
        <footer className="h-12 bg-black border-t-4 border-[#1e3a8a] flex items-center justify-between px-4 sm:px-8 text-[11px] font-mono text-gray-400 shadow-comic mt-auto">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wider">SYSTEM STATUS: [ CONNECTED TO WEB-NET ]</span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <span className="text-blue-300">STACK: <strong className="text-yellow-400">REACT + VITE</strong></span>
            <span className="text-blue-300">STORAGE: <strong className="text-yellow-400">LOCALSTORAGE</strong></span>
            <span className="text-gray-300">USER: <strong className="text-white">SPIDER-READER-001</strong></span>
          </div>
        </footer>
      </div>

      {/* Deep-Dive Issue Detail Modal */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          arc={selectedArc}
          progress={
            userProgress[selectedIssue.id] || {
              issueId: selectedIssue.id,
              isRead: false,
              isOwned: false,
              rating: 0,
              readingFormat: 'digital',
              notes: '',
            }
          }
          suitTheme={suitTheme}
          onClose={() => setSelectedIssue(null)}
          onToggleRead={handleToggleRead}
          onToggleOwned={handleToggleOwned}
          onUpdateRating={handleUpdateRating}
          onUpdateFormat={handleUpdateFormat}
          onUpdateNotes={handleUpdateNotes}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 right-6 z-50 px-4 py-3 bg-black border-2 border-yellow-400 text-yellow-300 text-xs font-black uppercase shadow-comic-yellow flex items-center gap-3 animate-bounce">
          <span className="w-3 h-3 bg-yellow-400 border border-black" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}