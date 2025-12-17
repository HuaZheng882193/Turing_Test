import React, { useState, useEffect, useCallback } from 'react';
import { EntityType } from '../types';

interface TypewriterMessageProps {
  text: string;
  entityType: EntityType;
  onComplete: () => void;
  speedMode?: 'fast' | 'normal' | 'slow';
}

export const TypewriterMessage: React.FC<TypewriterMessageProps> = ({
  text,
  entityType,
  onComplete,
  speedMode = 'normal'
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // 根据模式设置不同的速度参数
  const getSpeedConfig = useCallback((mode: string) => {
    switch (mode) {
      case 'fast':
        return { baseDelay: 15, chunkSize: 3, variance: 0.3 };
      case 'slow':
        return { baseDelay: 80, chunkSize: 1, variance: 0.8 };
      default: // normal
        return { baseDelay: 25, chunkSize: 2, variance: 0.5 };
    }
  }, []);

  useEffect(() => {
    const config = getSpeedConfig(speedMode);
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const typeNext = () => {
      if (currentIndex >= text.length) {
        setIsTyping(false);
        // 为不同实体类型设置不同的完成延迟
        const completeDelay = entityType === 'ai' ? 150 : 300;
        setTimeout(onComplete, completeDelay);
        return;
      }

      // 计算本次要显示的字符数（智能分组）
      const remainingChars = text.length - currentIndex;
      let chunkSize = Math.min(config.chunkSize, remainingChars);

      // 对人类角色，偶尔添加更长的停顿来模拟思考
      if (entityType === 'human' && Math.random() < 0.15) {
        chunkSize = 1; // 单个字符显示
      }

      // 添加轻微的随机延迟来模拟自然打字
      const baseDelay = config.baseDelay;
      const variance = (Math.random() - 0.5) * config.variance;
      const delay = Math.max(baseDelay + variance * baseDelay, 5); // 最小5ms延迟

      timeoutId = setTimeout(() => {
        const nextChunk = text.slice(currentIndex, currentIndex + chunkSize);
        setDisplayedText(prev => prev + nextChunk);
        currentIndex += chunkSize;
        typeNext();
      }, delay);
    };

    typeNext();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [text, speedMode, onComplete, getSpeedConfig, entityType]);

  return (
    <div className="flex w-full justify-start mb-4">
      <div className="flex gap-3 flex-row">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 ${
          entityType === 'ai'
            ? 'bg-blue-900/60 border-blue-600/60 text-blue-400'
            : 'bg-green-900/60 border-green-600/60 text-green-400'
        }`}>
          {entityType === 'ai' ? (
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
          ) : (
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>
        <div className={`p-3 rounded-lg rounded-tl-none border transition-all duration-200 ${
          entityType === 'ai'
            ? 'bg-blue-900/40 border-blue-700/40 text-blue-100'
            : 'bg-green-900/40 border-green-700/40 text-green-100'
        }`}>
          <div className="whitespace-pre-wrap break-words font-mono">
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
