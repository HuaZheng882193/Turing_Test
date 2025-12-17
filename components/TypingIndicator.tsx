import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex w-full justify-start mb-4 animate-pulse">
       <div className="flex gap-3 flex-row">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border bg-zinc-800 border-zinc-600 text-zinc-400">
           {/* Placeholder icon space */}
           <div className="w-1 h-1 bg-zinc-500 rounded-full" />
        </div>
        <div className="bg-zinc-900/60 border border-zinc-700/60 p-3 rounded-lg rounded-tl-none flex items-center gap-1.5 h-10">
          <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};
