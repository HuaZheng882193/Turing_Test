import React from 'react';
import { GameStats } from '../types';
import { ShieldCheck, ShieldAlert, Activity, Brain } from 'lucide-react';

interface StatsPanelProps {
  stats: GameStats;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const winRate = stats.totalGames > 0 
    ? Math.round((stats.correctGuesses / stats.totalGames) * 100) 
    : 0;

  return (
    <div className="w-full lg:w-80 border-l border-zinc-800 bg-zinc-950/50 p-6 flex flex-col gap-6 font-mono text-sm hidden md:flex">
      <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-4">
        <Activity className="text-emerald-500" size={18} />
        <h2 className="text-emerald-500 font-bold uppercase tracking-widest">测试协议统计</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800">
          <div className="text-zinc-500 text-xs uppercase mb-1">成功率</div>
          <div className="text-2xl font-bold text-white">{winRate}%</div>
          <div className="w-full bg-zinc-800 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${winRate}%` }}></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-900/50 p-3 rounded border border-zinc-800">
            <div className="text-zinc-500 text-xs uppercase mb-1">总场次</div>
            <div className="text-xl font-bold text-white">{stats.totalGames}</div>
          </div>
          <div className="bg-zinc-900/50 p-3 rounded border border-zinc-800">
            <div className="text-zinc-500 text-xs uppercase mb-1">正确</div>
            <div className="text-xl font-bold text-emerald-400">{stats.correctGuesses}</div>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-zinc-800">
          <div className="text-zinc-500 text-xs uppercase">遭遇类型</div>
          <div className="flex items-center justify-between text-zinc-300">
            <span className="flex items-center gap-2"><Brain size={14} /> 合成体 (AI)</span>
            <span>{stats.aiEncounters}</span>
          </div>
          <div className="flex items-center justify-between text-zinc-300">
             <span className="flex items-center gap-2"><User size={14} /> 人类 (Human)</span>
             <span>{stats.humanEncounters}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-auto text-xs text-zinc-600">
        <p>系统状态：在线</p>
        <p>加密：已启用</p>
        <p>延迟：24ms</p>
      </div>
    </div>
  );
};

// Simple Icon component used above locally
const User = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);