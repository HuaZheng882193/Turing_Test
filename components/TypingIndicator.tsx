import React, { useState, useEffect } from 'react';

export const TypingIndicator: React.FC = () => {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full justify-start mb-4">
       <div className="flex gap-3 flex-row">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border bg-zinc-800 border-zinc-600 text-zinc-400 relative">
           <div className="w-1 h-1 bg-zinc-500 rounded-full animate-pulse" />
           {/* 添加活跃状态指示器 */}
           <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-75" />
        </div>
        <div className="bg-zinc-900/60 border border-zinc-700/60 p-3 rounded-lg rounded-tl-none flex items-center gap-2 h-10 relative">
          {/* 更生动的打字指示器 */}
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.8s' }} />
            <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '0.8s' }} />
            <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '0.8s' }} />
          </div>
          <div className="text-zinc-500 text-sm font-mono ml-2">
            正在思考{dots}
          </div>
          {/* 添加微妙的脉动效果 */}
          <div className="absolute inset-0 bg-zinc-500/5 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
};
