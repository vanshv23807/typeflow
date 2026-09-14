import { User, TypingTestResult, LeaderboardEntry } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('typeflow_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  auth: {
    async register(data: { username: string; email: string; password: string; avatar?: string }): Promise<{ token: string; user: User }> {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Registration failed');
      return json;
    },

    async login(data: { identifier: string; password: string }): Promise<{ token: string; user: User }> {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Login failed');
      return json;
    },

    async getMe(): Promise<{ user: User }> {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          ...getAuthHeader()
        }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch current user');
      return json;
    },

    async updateProfile(data: { bio?: string; avatar?: string }): Promise<{ user: User }> {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update profile');
      return json;
    }
  },

  // Tests
  tests: {
    async recordTest(data: Partial<TypingTestResult>): Promise<{ test: TypingTestResult; user?: User }> {
      const res = await fetch(`${API_BASE}/tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to record test');
      return json;
    },

    async getHistory(params?: { mode?: string; page?: number; limit?: number }): Promise<{ tests: TypingTestResult[]; total: number; totalPages: number }> {
      const query = new URLSearchParams();
      if (params?.mode) query.set('mode', params.mode);
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));

      const res = await fetch(`${API_BASE}/tests/history?${query.toString()}`, {
        headers: {
          ...getAuthHeader()
        }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch test history');
      return json;
    },

    async getTestById(id: string): Promise<{ test: TypingTestResult }> {
      const res = await fetch(`${API_BASE}/tests/${id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch test');
      return json;
    }
  },

  // Leaderboard
  leaderboard: {
    async getLeaderboard(params?: { timeframe?: string; mode?: string }): Promise<{
      entries: LeaderboardEntry[];
      totalParticipants: number;
      userRank?: { rank: number; wpm: number; accuracy: number; mode: string } | null;
    }> {
      const query = new URLSearchParams();
      if (params?.timeframe) query.set('timeframe', params.timeframe);
      if (params?.mode) query.set('mode', params.mode);

      const res = await fetch(`${API_BASE}/leaderboard?${query.toString()}`, {
        headers: {
          ...getAuthHeader()
        }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch leaderboard');
      return json;
    }
  },

  // Texts
  texts: {
    async getRandomText(params?: {
      mode?: string;
      count?: number;
      level?: number;
      category?: string;
      punctuation?: boolean;
      numbers?: boolean;
    }): Promise<{ title: string; author?: string; content: string; mode: string; count?: number; level?: number }> {
      const query = new URLSearchParams();
      if (params?.mode) query.set('mode', params.mode);
      if (params?.count) query.set('count', String(params.count));
      if (params?.level) query.set('level', String(params.level));
      if (params?.category) query.set('category', params.category);
      if (params?.punctuation !== undefined) query.set('punctuation', String(params.punctuation));
      if (params?.numbers !== undefined) query.set('numbers', String(params.numbers));

      const res = await fetch(`${API_BASE}/texts/random?${query.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch text');
      return json;
    }
  },

  // Stats
  stats: {
    async getGlobalStats(): Promise<{
      totalTests: number;
      registeredUsers: number;
      avgSpeed: number;
      highestSpeed: number;
      totalCharacters: number;
    }> {
      const res = await fetch(`${API_BASE}/stats/global`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch global stats');
      return json;
    },

    async getUserStats(): Promise<{
      user: User;
      speedProgression: Array<{ index: number; date: string; wpm: number; rawWpm: number; accuracy: number; mode: string }>;
      modeBreakdown: Record<string, number>;
      bestByMode: Record<string, number>;
      recentTests: TypingTestResult[];
    }> {
      const res = await fetch(`${API_BASE}/stats/user`, {
        headers: {
          ...getAuthHeader()
        }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch user analytics');
      return json;
    }
  },

  // Multiplayer
  multiplayer: {
    async getRooms(): Promise<{ rooms: Array<{ code: string; name: string; playerCount: number; maxPlayers: number; status: string }> }> {
      const res = await fetch(`${API_BASE}/rooms`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch rooms');
      return json;
    }
  }
};
