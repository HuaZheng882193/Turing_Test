import React, { useState, useEffect } from "react";

interface TypingIndicatorProps {
  showLongWaitMessage?: boolean;
  onRetry?: () => void;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  showLongWaitMessage = false,
  onRetry,
}) => {
  const [dots, setDots] = useState(".");
  const [waitTime, setWaitTime] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  const thinkingMessages = [
    "等待回复",
    "请稍等",
    "正在处理",
    "正在输入",
    "即将完成",
  ];

  const longWaitMessages = [
    "对方正在思考中...",
    "正在回单答案...",
    "对方正在回复...",
    "请耐心等待回复...",
  ];

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);

    const timeInterval = setInterval(() => {
      setWaitTime((prev) => prev + 1);
    }, 1000);

    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % thinkingMessages.length);
    }, 2000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(timeInterval);
      clearInterval(messageInterval);
    };
  }, []);

  const getDisplayMessage = () => {
    if (showLongWaitMessage && waitTime > 8) {
      return longWaitMessages[
        Math.floor((waitTime - 8) / 3) % longWaitMessages.length
      ];
    }
    return thinkingMessages[currentMessage] + dots;
  };

  const getProgressWidth = () => {
    if (waitTime < 3) return "w-1/4";
    if (waitTime < 6) return "w-1/2";
    if (waitTime < 10) return "w-3/4";
    return "w-full";
  };

  return (
    <div className="flex w-full justify-start mb-4">
      <div className="flex gap-3 flex-row">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border bg-zinc-800 border-zinc-600 text-zinc-400 relative">
          <div className="w-1 h-1 bg-zinc-500 rounded-full animate-pulse" />
          {/* 添加活跃状态指示器 */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-75" />
          {/* 进度环 */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/30">
            <div
              className={`absolute top-0 left-0 w-full h-full rounded-full border-2 border-blue-500 transition-all duration-1000 ${getProgressWidth()}`}
              style={{ clipPath: "inset(0 0 0 0)" }}
            />
          </div>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-700/60 p-3 rounded-lg rounded-tl-none flex flex-col gap-2 relative min-w-[200px]">
          {/* 更生动的打字指示器 */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div
                className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms", animationDuration: "0.8s" }}
              />
              <div
                className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                style={{ animationDelay: "200ms", animationDuration: "0.8s" }}
              />
              <div
                className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                style={{ animationDelay: "400ms", animationDuration: "0.8s" }}
              />
            </div>
            <div className="text-zinc-300 text-sm font-mono flex-1">
              {getDisplayMessage()}
            </div>
          </div>

          {/* 长时间等待时的额外提示 */}
          {waitTime > 8 && showLongWaitMessage && (
            <div className="flex items-center justify-between text-xs text-zinc-500 animate-in fade-in slide-in-from-bottom-1 duration-500">
              <span>AI正在深度思考您的提问...</span>
              {onRetry && waitTime > 15 && (
                <button
                  onClick={onRetry}
                  className="text-blue-400 hover:text-blue-300 underline text-xs"
                >
                  重试
                </button>
              )}
            </div>
          )}

          {/* 添加微妙的脉动效果 */}
          <div className="absolute inset-0 bg-zinc-500/5 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
};
