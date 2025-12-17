import React, { useState, useEffect } from 'react';
import { EntityType } from '../types';

interface TypewriterMessageProps {
  text: string;
  entityType: EntityType;
  onComplete: () => void;
  typingSpeed?: number;
}

export const TypewriterMessage: React.FC<TypewriterMessageProps> = ({
  text,
  entityType,
  onComplete,
  typingSpeed = 50
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      setTimeout(onComplete, 300); // 短暂延迟后标记完成
    }
  }, [currentIndex, text, typingSpeed, onComplete]);

  return (
    <div className="flex w-full justify-start mb-4">
      <div className="flex gap-3 flex-row">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${
          entityType === 'ai'
            ? 'bg-blue-900/60 border-blue-600/60 text-blue-400'
            : 'bg-green-900/60 border-green-600/60 text-green-400'
        }`}>
          {entityType === 'ai' ? (
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
          ) : (
            <div className="w-3 h-3 bg-green-400 rounded-full" />
          )}
        </div>
        <div className={`p-3 rounded-lg rounded-tl-none border ${
          entityType === 'ai'
            ? 'bg-blue-900/40 border-blue-700/40 text-blue-100'
            : 'bg-green-900/40 border-green-700/40 text-green-100'
        }`}>
          <div className="whitespace-pre-wrap break-words">
            {displayedText}
            {isTyping && (
              <span className="inline-block w-0.5 h-5 bg-current animate-pulse ml-0.5" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
