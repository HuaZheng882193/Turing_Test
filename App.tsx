import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Power,
  CheckCircle,
  XCircle,
  HelpCircle,
  Terminal,
  RotateCcw,
} from "lucide-react";
import { ChatBubble } from "./components/ChatBubble";
import { TypingIndicator } from "./components/TypingIndicator";
import { TypewriterMessage } from "./components/TypewriterMessage";
import { StatsPanel } from "./components/StatsPanel";
import { geminiService } from "./services/geminiService";
import { GamePhase, EntityType, Message, GameStats } from "./types";
import {
  INITIAL_GREETINGS,
  TYPING_SPEED_MS_PER_CHAR_AI,
  TYPING_SPEED_MS_PER_CHAR_HUMAN,
} from "./constants";

const App: React.FC = () => {
  // State
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [entityType, setEntityType] = useState<EntityType | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [stats, setStats] = useState<GameStats>({
    totalGames: 0,
    correctGuesses: 0,
    aiEncounters: 0,
    humanEncounters: 0,
  });
  const [revealMessage, setRevealMessage] = useState<string>("");
  const [typingMessage, setTypingMessage] = useState<{
    text: string;
    entityType: EntityType;
    id: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const phaseRef = useRef(phase);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Scroll to bottom effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input on phase change
  useEffect(() => {
    if (phase === "chatting" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase]);

  const startGame = async () => {
    setPhase("connecting");
    setMessages([]);
    setRevealMessage("");

    // Simulate connection delay
    setTimeout(() => {
      const type: EntityType = Math.random() > 0.5 ? "human" : "ai";
      setEntityType(type);

      try {
        geminiService.initializeChat(type);
        setPhase("chatting");

        const greetings = INITIAL_GREETINGS[type];
        const randomGreeting =
          greetings[Math.floor(Math.random() * greetings.length)];

        simulateIncomingMessage(randomGreeting, type);
      } catch (error) {
        console.error("Failed to start game", error);
        setPhase("idle");
      }
    }, 2000);
  };

  const resetGame = () => {
    setPhase("idle");
    setMessages([]);
    setInputValue("");
    setEntityType(null);
    setIsTyping(false);
    setTypingMessage(null);
    setStats({
      totalGames: 0,
      correctGuesses: 0,
      aiEncounters: 0,
      humanEncounters: 0,
    });
    setRevealMessage("");
  };

  /**
   * Message simulation with smooth typewriter effect
   */
  const simulateIncomingMessage = (text: string, type: EntityType) => {
    if (phaseRef.current === "idle") return;

    const messageId = Date.now().toString();

    // Calculate typing speed with natural variation
    const baseSpeed = type === "human"
      ? TYPING_SPEED_MS_PER_CHAR_HUMAN
      : TYPING_SPEED_MS_PER_CHAR_AI;

    // Add natural typing variation
    const variance = type === "human"
      ? Math.random() * 0.6 + 0.4  // Human typing: 40-100% of base speed
      : Math.random() * 0.3 + 0.85; // AI typing: 85-115% of base speed

    const typingSpeed = Math.max(baseSpeed * variance, 10);

    // Start the typewriter effect
    setTypingMessage({
      text,
      entityType: type,
      id: messageId
    });
  };

  const handleTypewriterComplete = () => {
    if (typingMessage) {
      const newMessage: Message = {
        id: typingMessage.id,
        role: "model",
        text: typingMessage.text,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setTypingMessage(null);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || phase !== "chatting" || isTyping || typingMessage) return;

    const userText = inputValue.trim();
    setInputValue("");

    // Add user message immediately
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: userText,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Show thinking indicator while processing
    setIsTyping(true);

    try {
      // Get AI response
      const responseText = await geminiService.sendMessage(userText);

      if (phaseRef.current !== "chatting") return;

      setIsTyping(false); // Hide thinking indicator
      if (entityType) {
        simulateIncomingMessage(responseText, entityType); // Start typewriter effect
      }
    } catch (e) {
      console.error(e);
      setIsTyping(false);
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: "model",
        text: "系统错误：连接中断。",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleVote = (vote: EntityType) => {
    if (phase !== "voting" || !entityType) return;

    setPhase("reveal");
    const isCorrect = vote === entityType;

    setStats((prev) => ({
      totalGames: prev.totalGames + 1,
      correctGuesses: isCorrect ? prev.correctGuesses + 1 : prev.correctGuesses,
      aiEncounters:
        entityType === "ai" ? prev.aiEncounters + 1 : prev.aiEncounters,
      humanEncounters:
        entityType === "human"
          ? prev.humanEncounters + 1
          : prev.humanEncounters,
    }));

    const entityName = entityType === "human" ? "人类" : "人工智能";
    if (isCorrect) {
      setRevealMessage(`正确。身份已验证：${entityName}。`);
    } else {
      setRevealMessage(`判断错误。对象的真实身份是：${entityName}。`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-black text-emerald-500 overflow-hidden font-mono relative">
      {/* Header */}
      <header className="h-16 border-b border-emerald-900/30 bg-black flex items-center justify-between px-6 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Terminal className="text-emerald-500 animate-pulse" />
          <div>
            <h1 className="text-xl font-bold tracking-widest text-emerald-400 glow-text">
              图灵测试
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {phase === "chatting" && (
            <button
              onClick={() => setPhase("voting")}
              className="bg-red-900/20 border border-red-500/50 text-red-400 hover:bg-red-900/40 px-4 py-1.5 rounded text-sm transition-all"
            >
              终止并投票
            </button>
          )}
          {phase === "voting" && (
            <span className="text-amber-500 animate-pulse font-bold">
              等待裁决...
            </span>
          )}

          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-3 py-1.5 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-900/20 rounded transition-all text-sm border border-zinc-800 hover:border-emerald-500/30"
            title="重置系统"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">重置游戏</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Chat Area */}
        <main className="flex-1 flex flex-col relative">
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 relative">
            {phase === "idle" && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                <div className="w-16 h-16 border border-emerald-800 rounded-full flex items-center justify-center mb-4">
                  <Power size={32} className="text-emerald-700" />
                </div>
                <h2 className="text-2xl font-bold mb-2">初始化序列</h2>
                <p className="max-w-md text-emerald-800">
                  你将被连接到一个实体。它可能是人类，也可能是模拟人类行为的机器。
                  <br />
                  <br />
                  你的指令：进行对话。确定实体的性质。
                </p>
                <button
                  onClick={startGame}
                  className="mt-8 px-8 py-3 bg-emerald-900/20 border border-emerald-500/50 hover:bg-emerald-500/10 hover:border-emerald-400 text-emerald-400 transition-all font-bold tracking-widest rounded"
                >
                  建立连接
                </button>
              </div>
            )}

            {phase === "connecting" && (
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                <div className="font-mono text-emerald-500 text-lg">
                  正在搜索匹配对象...
                </div>
                <div className="w-64 h-2 bg-emerald-900/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 animate-[loading_2s_ease-in-out_infinite]"
                    style={{ width: "30%" }}
                  ></div>
                </div>
                <div className="text-xs text-emerald-700 font-mono">
                  <p>正在加密频道...</p>
                  <p>正在隐藏IP地址...</p>
                  <p>同步神经握手...</p>
                </div>
              </div>
            )}

            {(phase === "chatting" ||
              phase === "voting" ||
              phase === "reveal") && (
              <>
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}
                {typingMessage && (
                  <TypewriterMessage
                    text={typingMessage.text}
                    entityType={typingMessage.entityType}
                    onComplete={handleTypewriterComplete}
                    typingSpeed={
                      typingMessage.entityType === "human"
                        ? TYPING_SPEED_MS_PER_CHAR_HUMAN
                        : TYPING_SPEED_MS_PER_CHAR_AI
                    }
                  />
                )}
                {isTyping && !typingMessage && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Overlay for Voting/Reveal */}
          {phase === "voting" && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20 animate-in fade-in duration-300">
              <div className="bg-zinc-900 border border-emerald-500/30 p-8 rounded-lg max-w-lg w-full text-center shadow-2xl shadow-emerald-900/20">
                <h2 className="text-2xl text-white font-bold mb-6 tracking-wider">
                  请做出裁决
                </h2>
                <p className="text-gray-400 mb-8">
                  根据刚才的互动，识别该实体的身份。
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleVote("human")}
                    className="p-6 border border-zinc-700 hover:border-emerald-500 hover:bg-emerald-900/10 rounded flex flex-col items-center gap-2 transition-all group"
                  >
                    <div className="p-3 bg-zinc-800 rounded-full group-hover:bg-emerald-500/20 transition-colors">
                      <CheckCircle className="text-emerald-500" size={32} />
                    </div>
                    <span className="text-lg font-bold text-gray-200 group-hover:text-emerald-400">
                      人类
                    </span>
                  </button>
                  <button
                    onClick={() => handleVote("ai")}
                    className="p-6 border border-zinc-700 hover:border-cyan-500 hover:bg-cyan-900/10 rounded flex flex-col items-center gap-2 transition-all group"
                  >
                    <div className="p-3 bg-zinc-800 rounded-full group-hover:bg-cyan-500/20 transition-colors">
                      <XCircle className="text-cyan-500" size={32} />
                    </div>
                    <span className="text-lg font-bold text-gray-200 group-hover:text-cyan-400">
                      机器
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {phase === "reveal" && (
            <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-30 animate-in fade-in duration-500">
              <div className="text-center space-y-6 max-w-md px-4">
                <div className="text-4xl font-black tracking-tighter mb-2 glow-text">
                  {revealMessage.includes("正确") ? (
                    <span className="text-emerald-500">判断正确</span>
                  ) : (
                    <span className="text-red-500">判断错误</span>
                  )}
                </div>
                <div className="font-mono text-xl text-gray-300 border-y border-gray-800 py-4">
                  {revealMessage}
                </div>
                <div className="flex justify-center pt-4">
                  <button
                    onClick={startGame}
                    className="px-8 py-3 bg-white text-black font-bold hover:bg-gray-200 transition-colors rounded uppercase tracking-widest"
                  >
                    初始化下一个对象
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-emerald-900/30 bg-black z-10">
            <div className="relative max-w-4xl mx-auto flex items-center gap-2">
              <span className="text-emerald-700 font-mono hidden md:block">
                {">"}
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  phase === "chatting" ? "输入消息..." : "系统空闲..."
                }
                disabled={phase !== "chatting" || isTyping}
                className="flex-1 bg-transparent border-b border-zinc-800 focus:border-emerald-500 text-emerald-100 placeholder-zinc-700 p-2 outline-none font-mono transition-colors disabled:opacity-50"
                autoComplete="off"
              />
              <button
                onClick={handleSendMessage}
                disabled={
                  !inputValue.trim() || phase !== "chatting" || isTyping
                }
                className="p-2 text-zinc-500 hover:text-emerald-500 disabled:opacity-30 disabled:hover:text-zinc-500 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
            <div className="max-w-4xl mx-auto mt-2 text-[10px] text-zinc-700 flex justify-between">
              <span>安全线路已加密</span>
              <span>{messages.length} 次传输</span>
            </div>
          </div>
        </main>

        {/* Sidebar Stats */}
        <StatsPanel stats={stats} />
      </div>

      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900 via-black to-black z-0"></div>
    </div>
  );
};

export default App;
