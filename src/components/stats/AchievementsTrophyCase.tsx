import React from 'react';

interface Achievement {
  id: string;
  title: string;
  desc: string;
  unlocked: boolean;
  icon: string;
}

interface AchievementsTrophyCaseProps {
  achievements: Achievement[];
}

export const AchievementsTrophyCase: React.FC<AchievementsTrophyCaseProps> = ({ achievements }) => {
  return (
    <div className="bg-black border-4 border-[#1e3a8a] p-5 space-y-4 shadow-comic">
      <div className="border-b-2 border-blue-900 pb-2">
        <span className="text-[10px] font-mono uppercase text-yellow-400 font-black">TROPHY CASE</span>
        <h3 className="text-base font-black text-white uppercase">SPIDER-SLINGER MILESTONES & ACHIEVEMENTS</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`p-4 border-4 flex items-start gap-3 transition ${
              ach.unlocked
                ? 'bg-yellow-400/10 border-yellow-400 text-white shadow-[2px_2px_0px_0px_#facc15]'
                : 'bg-[#070b14] border-blue-900 text-gray-500 opacity-60'
            }`}
          >
            <div className="text-2xl p-2 bg-black border-2 border-current shrink-0">{ach.icon}</div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h4 className="text-xs font-black uppercase text-white">{ach.title}</h4>
                {ach.unlocked && (
                  <span className="text-[9px] px-1.5 py-0.5 font-mono font-black bg-yellow-400 text-black border border-black">
                    [ UNLOCKED ]
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-300 font-sans leading-snug">{ach.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};