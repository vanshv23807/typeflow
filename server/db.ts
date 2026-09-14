import fs from 'fs';
import path from 'path';

export interface UserDoc {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  avatar: string;
  bio?: string;
  createdAt: string;
  xp: number;
  level: number;
  badges: string[];
  stats: {
    testsCompleted: number;
    timeSpentSeconds: number;
    bestWpm: number;
    avgWpm: number;
    avgAccuracy: number;
    totalCharsTyped: number;
    racesWon: number;
  };
}

export interface TypingTestDoc {
  id: string;
  userId?: string;
  username: string;
  wpm: number;
  netWpm: number;
  rawWpm: number;
  accuracy: number;
  durationSeconds: number;
  mode: 'time' | 'words' | 'quote' | 'code';
  modeValue: number | string;
  correctChars: number;
  incorrectChars: number;
  missedChars: number;
  extraChars: number;
  timeline: { second: number; wpm: number; rawWpm: number; errors: number }[];
  textTitle?: string;
  createdAt: string;
}

export interface TextSnippet {
  id: string;
  category: 'quote' | 'code' | 'standard' | 'tech';
  title: string;
  author?: string;
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'typeflow_db.json');

interface DatabaseSchema {
  users: UserDoc[];
  tests: TypingTestDoc[];
  texts: TextSnippet[];
}

const INITIAL_TEXTS: TextSnippet[] = [
  {
    id: 't-1',
    category: 'quote',
    title: 'The Road Not Taken',
    author: 'Robert Frost',
    content: 'Two roads diverged in a yellow wood, and sorry I could not travel both and be one traveler, long I stood and looked down one as far as I could to where it bent in the undergrowth.',
    difficulty: 'easy'
  },
  {
    id: 't-2',
    category: 'tech',
    title: 'Clean Code Philosophy',
    author: 'Robert C. Martin',
    content: 'Clean code is simple and direct. Clean code reads like well-written prose. Clean code never obscures the designer intent but rather is full of crisp abstractions and straightforward lines of control.',
    difficulty: 'medium'
  },
  {
    id: 't-3',
    category: 'code',
    title: 'JavaScript Async / Await',
    author: 'TypeScript Runtime',
    content: 'const fetchTelemetry = async (sessionId: string) => { const response = await fetch(`/api/telemetry/${sessionId}`); return response.ok ? await response.json() : null; };',
    difficulty: 'hard'
  },
  {
    id: 't-4',
    category: 'code',
    title: 'Python Binary Search',
    author: 'Algorithms Library',
    content: 'def binary_search(arr, target): left, right = 0, len(arr) - 1; while left <= right: mid = (left + right) // 2; if arr[mid] == target: return mid; left = mid + 1 if arr[mid] < target else right = mid - 1; return -1',
    difficulty: 'hard'
  },
  {
    id: 't-5',
    category: 'quote',
    title: 'Steve Jobs Stanford Speech',
    author: 'Steve Jobs',
    content: 'Your time is limited, so do not waste it living someone else life. Do not be trapped by dogma, which is living with the results of other people thinking. Have the courage to follow your heart and intuition.',
    difficulty: 'medium'
  },
  {
    id: 't-6',
    category: 'standard',
    title: 'Fast Flow Common Corpus',
    author: 'Standard Corpus',
    content: 'The quick brown fox jumps over the lazy dog while mechanical switches click rhythmically in the midnight glow. Focus your breath, maintain steady cadence, and watch accuracy elevate your speed.',
    difficulty: 'easy'
  },
  {
    id: 't-7',
    category: 'tech',
    title: 'Distributed Systems',
    author: 'Leslie Lamport',
    content: 'A distributed system is one in which the failure of a computer you did not even know existed can render your own computer unusable. Resilient state machines require consensus protocols like Paxos or Raft.',
    difficulty: 'hard'
  },
  {
    id: 't-8',
    category: 'quote',
    title: 'Marcus Aurelius Meditations',
    author: 'Marcus Aurelius',
    content: 'You have power over your mind, not outside events. Realize this, and you will find strength. The happiness of your life depends upon the quality of your thoughts.',
    difficulty: 'medium'
  }
];

// Initial seed users for global leaderboard demonstration
const SEED_USERS: UserDoc[] = [
  {
    id: 'user_apex',
    username: 'ApexTyper',
    email: 'apex@typeflow.dev',
    passwordHash: '$2a$10$wE9i.z60Gf3bKq1tWz7J6eY6w8Qn3gY/H3Vl9S2vE3d6f7a8b9c0.',
    avatar: 'bolt',
    bio: 'Mechanical keyboard enthusiast. Aiming for 180 WPM.',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    xp: 8400,
    level: 18,
    badges: ['speed_demon', 'laser_precision', 'centurion', 'race_champion'],
    stats: {
      testsCompleted: 412,
      timeSpentSeconds: 16500,
      bestWpm: 154,
      avgWpm: 128,
      avgAccuracy: 98.4,
      totalCharsTyped: 124000,
      racesWon: 89
    }
  },
  {
    id: 'user_cyber',
    username: 'CyberKeys',
    email: 'cyber@typeflow.dev',
    passwordHash: '$2a$10$wE9i.z60Gf3bKq1tWz7J6eY6w8Qn3gY/H3Vl9S2vE3d6f7a8b9c0.',
    avatar: 'flame',
    bio: 'Smooth linear switch warrior. Code & speed.',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    xp: 6200,
    level: 14,
    badges: ['speed_demon', 'laser_precision', 'code_ninja'],
    stats: {
      testsCompleted: 280,
      timeSpentSeconds: 11200,
      bestWpm: 142,
      avgWpm: 119,
      avgAccuracy: 97.8,
      totalCharsTyped: 89000,
      racesWon: 52
    }
  },
  {
    id: 'user_zenith',
    username: 'ZenithFlow',
    email: 'zenith@typeflow.dev',
    passwordHash: '$2a$10$wE9i.z60Gf3bKq1tWz7J6eY6w8Qn3gY/H3Vl9S2vE3d6f7a8b9c0.',
    avatar: 'sparkles',
    bio: 'Focus on 100% accuracy first, speed follows naturally.',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    xp: 5100,
    level: 12,
    badges: ['laser_precision', 'night_owl'],
    stats: {
      testsCompleted: 195,
      timeSpentSeconds: 7800,
      bestWpm: 136,
      avgWpm: 112,
      avgAccuracy: 99.2,
      totalCharsTyped: 61000,
      racesWon: 34
    }
  },
  {
    id: 'user_novadash',
    username: 'NovaDash',
    email: 'nova@typeflow.dev',
    passwordHash: '$2a$10$wE9i.z60Gf3bKq1tWz7J6eY6w8Qn3gY/H3Vl9S2vE3d6f7a8b9c0.',
    avatar: 'zap',
    bio: 'Daily 30-minute practice grind.',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    xp: 3800,
    level: 9,
    badges: ['centurion'],
    stats: {
      testsCompleted: 140,
      timeSpentSeconds: 5600,
      bestWpm: 122,
      avgWpm: 104,
      avgAccuracy: 96.5,
      totalCharsTyped: 44000,
      racesWon: 19
    }
  }
];

const SEED_TESTS: TypingTestDoc[] = [
  {
    id: 'seed-t-1',
    userId: 'user_apex',
    username: 'ApexTyper',
    wpm: 154,
    netWpm: 151,
    rawWpm: 158,
    accuracy: 98.5,
    durationSeconds: 60,
    mode: 'time',
    modeValue: 60,
    correctChars: 770,
    incorrectChars: 12,
    missedChars: 2,
    extraChars: 3,
    timeline: [
      { second: 10, wpm: 145, rawWpm: 150, errors: 1 },
      { second: 20, wpm: 152, rawWpm: 156, errors: 2 },
      { second: 30, wpm: 158, rawWpm: 162, errors: 4 },
      { second: 40, wpm: 155, rawWpm: 160, errors: 6 },
      { second: 50, wpm: 153, rawWpm: 158, errors: 9 },
      { second: 60, wpm: 154, rawWpm: 158, errors: 12 }
    ],
    textTitle: 'The Road Not Taken',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'seed-t-2',
    userId: 'user_cyber',
    username: 'CyberKeys',
    wpm: 142,
    netWpm: 139,
    rawWpm: 146,
    accuracy: 97.9,
    durationSeconds: 30,
    mode: 'time',
    modeValue: 30,
    correctChars: 355,
    incorrectChars: 7,
    missedChars: 1,
    extraChars: 2,
    timeline: [
      { second: 10, wpm: 138, rawWpm: 142, errors: 2 },
      { second: 20, wpm: 144, rawWpm: 148, errors: 4 },
      { second: 30, wpm: 142, rawWpm: 146, errors: 7 }
    ],
    textTitle: 'Clean Code Philosophy',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'seed-t-3',
    userId: 'user_zenith',
    username: 'ZenithFlow',
    wpm: 136,
    netWpm: 135,
    rawWpm: 138,
    accuracy: 99.2,
    durationSeconds: 60,
    mode: 'time',
    modeValue: 60,
    correctChars: 680,
    incorrectChars: 5,
    missedChars: 1,
    extraChars: 0,
    timeline: [
      { second: 15, wpm: 130, rawWpm: 132, errors: 0 },
      { second: 30, wpm: 135, rawWpm: 137, errors: 1 },
      { second: 45, wpm: 138, rawWpm: 140, errors: 3 },
      { second: 60, wpm: 136, rawWpm: 138, errors: 5 }
    ],
    textTitle: 'Marcus Aurelius Meditations',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  }
];

class DatabaseStore {
  private data: DatabaseSchema;
  private writeTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.data = {
      users: [...SEED_USERS],
      tests: [...SEED_TESTS],
      texts: [...INITIAL_TEXTS]
    };
    this.load();
  }

  private load() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.tests) {
          this.data = parsed;
          if (!this.data.texts || this.data.texts.length === 0) {
            this.data.texts = INITIAL_TEXTS;
          }
          return;
        }
      }
      // write initial seed
      this.persistSync();
    } catch (e) {
      console.warn('Could not load existing db, using in-memory state:', e);
    }
  }

  private persistSync() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tmp = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmp, DB_FILE);
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  private queueSave() {
    if (this.writeTimer) clearTimeout(this.writeTimer);
    this.writeTimer = setTimeout(() => {
      this.persistSync();
    }, 300);
  }

  // Users
  getUsers(): UserDoc[] {
    return this.data.users;
  }

  findUserById(id: string): UserDoc | undefined {
    return this.data.users.find(u => u.id === id);
  }

  findUserByEmail(email: string): UserDoc | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserByUsername(username: string): UserDoc | undefined {
    return this.data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  createUser(user: UserDoc): UserDoc {
    this.data.users.push(user);
    this.queueSave();
    return user;
  }

  updateUser(id: string, updates: Partial<UserDoc>): UserDoc | undefined {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return undefined;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.queueSave();
    return this.data.users[idx];
  }

  // Tests
  getTests(): TypingTestDoc[] {
    return this.data.tests;
  }

  getUserTests(userId: string): TypingTestDoc[] {
    return this.data.tests
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addTest(test: TypingTestDoc): TypingTestDoc {
    this.data.tests.unshift(test);
    
    // Update user stats if test belongs to a user
    if (test.userId) {
      const user = this.findUserById(test.userId);
      if (user) {
        const userTests = this.getUserTests(test.userId);
        const totalTests = userTests.length;
        const totalDuration = userTests.reduce((acc, t) => acc + (t.durationSeconds || 0), 0);
        const bestWpm = Math.max(...userTests.map(t => t.wpm), test.wpm);
        const avgWpm = Math.round(userTests.reduce((acc, t) => acc + t.wpm, 0) / totalTests);
        const avgAccuracy = Math.round((userTests.reduce((acc, t) => acc + t.accuracy, 0) / totalTests) * 10) / 10;
        const totalChars = userTests.reduce((acc, t) => acc + (t.correctChars || 0), 0);

        // XP Calculation: 10 XP per test + 1 XP per WPM + bonus for accuracy >= 98%
        const xpEarned = 10 + Math.floor(test.wpm) + (test.accuracy >= 98 ? 25 : 0);
        const newXp = (user.xp || 0) + xpEarned;
        const newLevel = Math.floor(Math.sqrt(newXp / 50)) + 1;

        // Check badges
        const badges = new Set(user.badges || []);
        if (test.wpm >= 100) badges.add('speed_demon');
        if (test.wpm >= 130) badges.add('supersonic');
        if (test.accuracy === 100) badges.add('perfectionist');
        if (test.accuracy >= 98) badges.add('laser_precision');
        if (totalTests >= 100) badges.add('centurion');
        if (totalTests >= 25) badges.add('dedicated');

        this.updateUser(test.userId, {
          xp: newXp,
          level: newLevel,
          badges: Array.from(badges),
          stats: {
            ...user.stats,
            testsCompleted: totalTests,
            timeSpentSeconds: totalDuration,
            bestWpm,
            avgWpm,
            avgAccuracy,
            totalCharsTyped: totalChars
          }
        });
      }
    }

    this.queueSave();
    return test;
  }

  // Texts
  getTexts(): TextSnippet[] {
    return this.data.texts;
  }

  addText(text: TextSnippet): TextSnippet {
    this.data.texts.push(text);
    this.queueSave();
    return text;
  }
}

export const db = new DatabaseStore();
