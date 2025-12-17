export type Role = 'user' | 'model';

export type GamePhase = 'idle' | 'connecting' | 'chatting' | 'voting' | 'reveal';

export type EntityType = 'human' | 'ai';

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
}

export interface GameStats {
  totalGames: number;
  correctGuesses: number;
  aiEncounters: number;
  humanEncounters: number;
}

export interface ChatSession {
  entityType: EntityType;
  messages: Message[];
  startTime: number;
}
