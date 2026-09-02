import React from 'react';
import { ComicIssue, StoryArc, SuitTheme, UserProgressItem, UserProgressMap } from '../types';
import { TelemetryHeader } from './stats/TelemetryHeader';
import { MetricCardsGrid } from './stats/MetricCardsGrid';
import { StoryArcBreakdownCard } from './stats/StoryArcBreakdownCard';
import { ReadingFormatsCard } from './stats/ReadingFormatsCard';
import { AchievementsTrophyCase } from './stats/AchievementsTrophyCase';

interface SpiderTelemetryStatsProps {
  issues: ComicIssue[];
  arcs: StoryArc[];
  userProgress: UserProgressMap;
  suitTheme: SuitTheme;
  onSelectIssue: (issue: ComicIssue) => void;
}

export const SpiderTelemetryStats: React.FC<SpiderTelemetryStatsProps> = ({
  issues,
  arcs,
  userProgress,
}) => {
  const totalIssues = issues.length;
  const readIssues = issues.filter((i) => userProgress[i.id]?.isRead);
  const ownedIssues = issues.filter((i) => userProgress[i.id]?.isOwned);
  const readCount = readIssues.length;
  const ownedCount = ownedIssues.length;
  const percentRead = totalIssues > 0 ? Math.round((readCount / totalIssues) * 100) : 0;

  // Format counts
  const progressList = Object.values(userProgress) as (UserProgressItem | undefined)[];
  const formatCounts = {
    digital: progressList.filter((p): p is UserProgressItem => p?.readingFormat === 'digital').length,
    floppy: progressList.filter((p): p is UserProgressItem => p?.readingFormat === 'floppy').length,
    trade: progressList.filter((p): p is UserProgressItem => p?.readingFormat === 'trade').length,
    omnibus: progressList.filter((p): p is UserProgressItem => p?.readingFormat === 'omnibus').length,
  };

  // 5-Star rated issues
  const topRatedIssues = issues.filter((i) => (userProgress[i.id]?.rating || 0) >= 4);

  // Achievements
  const achievements = [
    {
      id: 'first-web',
      title: 'First Web Slinger',
      desc: 'Read your first comic issue in the archives',
      unlocked: readCount >= 1,
      icon: '🕷️',
    },
    {
      id: 'bnd-starter',
      title: 'Brand New Day Pioneer',
      desc: 'Complete the first 5 issues of Brand New Day',
      unlocked: readCount >= 5,
      icon: '🌅',
    },
    {
      id: 'anti-venom-cure',
      title: 'Anti-Venom Purifier',
      desc: 'Read the complete "New Ways to Die" storyline',
      unlocked: issues.filter((i) => i.arcId === 'arc-new-ways-to-die').every((i) => userProgress[i.id]?.isRead),
      icon: '⚪',
    },
    {
      id: 'gauntlet-runner',
      title: 'Gauntlet Survivor',
      desc: 'Read at least 10 issues of The Gauntlet and Grim Hunt',
      unlocked: readIssues.filter((i) => i.arcId === 'arc-the-gauntlet' || i.arcId === 'arc-grim-hunt').length >= 5,
      icon: '⚡',
    },
    {
      id: 'collector-tier',
      title: 'Vault Collector',
      desc: 'Own 10 or more physical or digital issues in collection',
      unlocked: ownedCount >= 10,
      icon: '📦',
    },
    {
      id: 'superior-master',
      title: 'Superior Web-Slinger',
      desc: 'Read 25+ issues across the entire archive',
      unlocked: readCount >= 25,
      icon: '👑',
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <TelemetryHeader />

      {/* Metric Cards Top Row */}
      <MetricCardsGrid
        percentRead={percentRead}
        readCount={readCount}
        totalIssues={totalIssues}
        ownedCount={ownedCount}
        topRatedCount={topRatedIssues.length}
        unlockedCount={unlockedCount}
        totalAchievements={achievements.length}
      />

      {/* Middle Grid: Arc Progress Breakdown + Format Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StoryArcBreakdownCard arcs={arcs} issues={issues} userProgress={userProgress} />
        <ReadingFormatsCard formatCounts={formatCounts} />
      </div>

      {/* Reader Badges & Achievements */}
      <AchievementsTrophyCase achievements={achievements} />
    </div>
  );
};