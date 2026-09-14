import React from 'react';

interface ReadingTimelineHeaderProps {
  filteredCount: number;
  totalCount: number;
}

export const ReadingTimelineHeader: React.FC<ReadingTimelineHeaderProps> = ({ filteredCount, totalCount }) => (
  <div className="bg-[#111827] border-2 border-black p-5 rounded-sm shadow-comic-blue">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-red-600 text-white font-black text-xs px-2 py-0.5 tracking-wider border border-black shadow-comic">
            MARVEL
          </span>
          <span className="text-yellow-400 text-xs font-mono font-bold uppercase tracking-widest">
            ARCHIVAL DATABASE
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white italic drop-shadow-[2px_2px_0px_#000]">
          Spider-Man (Peter Parker): Comics
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 font-mono mt-1">
          Brand New Day, The Gauntlet, Grim Hunt, and Big Time reading order with interactive progress sync.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-black px-3 py-1.5 border-2 border-black shadow-comic">
          <span className="text-xs font-mono font-bold text-yellow-300 uppercase">
            Showing {filteredCount} of {totalCount} Issues
          </span>
        </div>
      </div>
    </div>
  </div>
);