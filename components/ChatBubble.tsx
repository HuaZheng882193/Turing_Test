import React from 'react';
import { Message } from '../types';
import { User, Cpu } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] md:max-w-[70%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border
          ${isUser 
            ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400' 
            : 'bg-zinc-800 border-zinc-600 text-zinc-400'}
        `}>
          {isUser ? <User size={16} /> : <Cpu size={16} />}
        </div>

        {/* Message Content */}
        <div className={`
          flex flex-col p-3 rounded-lg border text-sm md:text-base leading-relaxed
          ${isUser 
            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-100 rounded-tr-none' 
            : 'bg-zinc-900/60 border-zinc-700/60 text-gray-200 rounded-tl-none'}
        `}>
          <span className="whitespace-pre-wrap font-mono">{message.text}</span>
          <span className="text-[10px] opacity-40 mt-1 self-end font-mono">
            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
          </span>
        </div>

      </div>
    </div>
  );
};
