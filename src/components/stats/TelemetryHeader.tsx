import React from 'react';

export const TelemetryHeader: React.FC = () => {
  return (
    <div className="bg-[#1e3a8a] border-4 border-black p-5 shadow-comic relative overflow-hidden text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-yellow-400 uppercase font-black mb-1">
            [ TELEMETRY & ANALYTICS ACTIVATED ]
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide">
            SPIDER-TELEMETRY & READING ANALYTICS
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 font-mono mt-1 max-w-2xl">
            Real-time reader telemetry, format breakdown, story arc completion rates, and suit achievements.
          </p>
        </div>
        <div className="px-4 py-2 bg-black border-2 border-yellow-400 text-right shadow-[2px_2px_0px_0px_#facc15]">
          <div className="text-[9px] font-mono text-yellow-400 uppercase">ARCHIVE SYNC</div>
          <div className="text-base font-black font-mono text-white">ONLINE</div>
        </div>
      </div>
    </div>
  );
};