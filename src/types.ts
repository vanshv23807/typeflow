export type TestMode = 'time' | 'words' | 'quote' | 'code';

export interface TestConfig {
  mode: TestMode;
  modeValue: number; // 15, 30, 60, 120 or 10, 25, 50, 100
  level: number; // 1 to 100
  punctuation: boolean;
  numbers: boolean;
  category?: string;
}

export interface TimelinePoint {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

export interface TypingTestResult {
  id?: string;
  userId?: string;
  username: string;
  wpm: number;
  netWpm: number;
  rawWpm: number;
  accuracy: number;
  durationSeconds: number;
  mode: TestMode;
  modeValue: number | string;
  level?: number;
  correctChars: number;
  incorrectChars: number;
  missedChars: number;
  extraChars: number;
  timeline: TimelinePoint[];
  textTitle?: string;
  createdAt: string;
}

export interface UserStats {
  testsCompleted: number;
  timeSpentSeconds: number;
  bestWpm: number;
  avgWpm: number;
  avgAccuracy: number;
  totalCharsTyped: number;
  racesWon: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio?: string;
  createdAt: string;
  xp: number;
  level: number;
  badges: string[];
  stats: UserStats;
}

export interface LeaderboardEntry {
  rank: number;
  testId: string;
  userId?: string;
  username: string;
  avatar: string;
  level: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  mode: TestMode;
  modeValue: number | string;
  textTitle?: string;
  createdAt: string;
}

export interface RacerPlayer {
  id: string;
  userId?: string;
  username: string;
  avatar: string;
  color: string;
  isHost: boolean;
  isReady: boolean;
  progress: number;
  wpm: number;
  accuracy: number;
  isFinished: boolean;
  finishRank?: number;
  finishTimeSeconds?: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface RaceRoom {
  code: string;
  name: string;
  status: 'waiting' | 'countdown' | 'racing' | 'finished';
  text: string;
  textTitle: string;
  players: RacerPlayer[];
  countdown: number;
  startTime?: number;
  endTime?: number;
  maxPlayers: number;
  isPrivate: boolean;
  chat: ChatMessage[];
}

export type ThemeName = 'midnight' | 'cyber' | 'matrix' | 'sunset' | 'arctic';
export type CaretStyle = 'line' | 'block' | 'underline';
export type FontFamily = 'mono' | 'sans';
