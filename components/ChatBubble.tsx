import React from 'react';
import { Message } from '../types';
import { User, Cpu } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
      <div className={`
        flex max-w-[80%] md:max-w-[70%] gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300 delay-100
        ${isUser ? 'flex-row-reverse translate-x-2' : 'flex-row'}
      `}>
        
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 animate-in zoom-in duration-200 delay-200
          ${isUser
            ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400'
            : 'bg-zinc-800 border-zinc-600 text-zinc-400'}
        `}>
          {isUser ? <User size={16} className="animate-in rotate-in duration-300 delay-300" /> : <Cpu size={16} className="animate-in rotate-in duration-300 delay-300" />}
        </div>

        {/* Message Content */}
        <div className={`
          flex flex-col p-3 rounded-lg border text-sm md:text-base leading-relaxed transition-all duration-200 animate-in fade-in slide-in-from-bottom-1 duration-300 delay-150
          ${isUser
            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-100 rounded-tr-none'
            : 'bg-zinc-900/60 border-zinc-700/60 text-gray-200 rounded-tl-none'}
        `}>
          <span className="whitespace-pre-wrap font-mono animate-in fade-in duration-500 delay-200">{message.text}</span>
          <span className={`
            text-[10px] mt-1 self-end font-mono animate-in fade-in duration-1000 fill-mode-forwards
            ${isUser ? 'text-emerald-100/40' : 'text-gray-200/40'}
          `}>
            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
          </span>
        </div>

      </div>
    </div>
  );
};