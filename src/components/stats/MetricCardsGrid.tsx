import React from 'react';

interface MetricCardsGridProps {
  percentRead: number;
  readCount: number;
  totalIssues: number;
  ownedCount: number;
  topRatedCount: number;
  unlockedCount: number;
  totalAchievements: number;
}

export const MetricCardsGrid: React.FC<MetricCardsGridProps> = ({
  percentRead,
  readCount,
  totalIssues,
  ownedCount,
  topRatedCount,
  unlockedCount,
  totalAchievements,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-black border-4 border-blue-900 p-4 space-y-2 shadow-comic">
        <div className="flex items-center justify-between text-[10px] font-mono text-yellow-400 uppercase font-black">
          <span>Overall Completion</span>
          <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500">LIVE</span>
        </div>
        <div className="text-3xl font-black font-mono text-white">{percentRead}%</div>
        <p className="text-[11px] text-gray-300 font-mono">
          {readCount} of {totalIssues} issues completed
        </p>
      </div>

      <div className="bg-black border-4 border-blue-900 p-4 space-y-2 shadow-comic">
        <div className="flex items-center justify-between text-[10px] font-mono text-yellow-400 uppercase font-black">
          <span>Owned in Collection</span>
          <span className="px-1.5 py-0.5 bg-blue-950 text-blue-300 border border-blue-500">VAULT</span>
        </div>
        <div className="text-3xl font-black font-mono text-white">{ownedCount}</div>
        <p className="text-[11px] text-gray-300 font-mono">
          {totalIssues > 0 ? Math.round((ownedCount / totalIssues) * 100) : 0}% physical/digital ownership
        </p>
      </div>

      <div className="bg-black border-4 border-blue-900 p-4 space-y-2 shadow-comic">
        <div className="flex items-center justify-between text-[10px] font-mono text-yellow-400 uppercase font-black">
          <span>Highly Rated (4-5★)</span>
          <span className="px-1.5 py-0.5 bg-yellow-950 text-yellow-300 border border-yellow-500">FAV</span>
        </div>
        <div className="text-3xl font-black font-mono text-white">{topRatedCount}</div>
        <p className="text-[11px] text-gray-300 font-mono">Reader favorites logged</p>
      </div>

      <div className="bg-black border-4 border-blue-900 p-4 space-y-2 shadow-comic">
        <div className="flex items-center justify-between text-[10px] font-mono text-yellow-400 uppercase font-black">
          <span>Achievements</span>
          <span className="px-1.5 py-0.5 bg-purple-950 text-purple-300 border border-purple-500">BADGES</span>
        </div>
        <div className="text-3xl font-black font-mono text-white">
          {unlockedCount} / {totalAchievements}
        </div>
        <p className="text-[11px] text-gray-300 font-mono">Suit badges unlocked</p>
      </div>
    </div>
  );
};