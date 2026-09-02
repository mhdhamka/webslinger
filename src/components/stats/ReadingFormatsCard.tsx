import React from 'react';

interface ReadingFormatsCardProps {
  formatCounts: {
    digital: number;
    floppy: number;
    trade: number;
    omnibus: number;
  };
}

export const ReadingFormatsCard: React.FC<ReadingFormatsCardProps> = ({ formatCounts }) => {
  return (
    <div className="bg-black border-4 border-[#1e3a8a] p-5 space-y-4 shadow-comic">
      <div className="border-b-2 border-blue-900 pb-2">
        <span className="text-[10px] font-mono uppercase text-yellow-400 font-black">FORMAT METRICS</span>
        <h3 className="text-base font-black text-white uppercase">READING FORMATS</h3>
      </div>

      <div className="space-y-3 text-xs">
        <div className="p-3 bg-[#070b14] border-2 border-blue-900 flex items-center justify-between font-mono">
          <span className="text-gray-300 uppercase">Digital Edition</span>
          <strong className="text-yellow-400 text-sm font-black">{formatCounts.digital}</strong>
        </div>
        <div className="p-3 bg-[#070b14] border-2 border-blue-900 flex items-center justify-between font-mono">
          <span className="text-gray-300 uppercase">Single Floppy Issue</span>
          <strong className="text-yellow-400 text-sm font-black">{formatCounts.floppy}</strong>
        </div>
        <div className="p-3 bg-[#070b14] border-2 border-blue-900 flex items-center justify-between font-mono">
          <span className="text-gray-300 uppercase">Trade Paperback (TPB)</span>
          <strong className="text-yellow-400 text-sm font-black">{formatCounts.trade}</strong>
        </div>
        <div className="p-3 bg-[#070b14] border-2 border-blue-900 flex items-center justify-between font-mono">
          <span className="text-gray-300 uppercase">Hardcover / Omnibus</span>
          <strong className="text-yellow-400 text-sm font-black">{formatCounts.omnibus}</strong>
        </div>
      </div>
    </div>
  );
};