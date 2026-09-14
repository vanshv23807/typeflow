import { Router, Response } from 'express';
import { db } from '../db';
import { optionalAuthMiddleware, AuthenticatedRequest } from '../auth';

export const leaderboardRouter = Router();

leaderboardRouter.get('/', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { timeframe = 'all', mode = 'all', limit = 50 } = req.query;
    let tests = db.getTests();

    // Timeframe filter
    const now = Date.now();
    if (timeframe === 'daily') {
      const oneDayAgo = now - 24 * 60 * 60 * 1000;
      tests = tests.filter(t => new Date(t.createdAt).getTime() >= oneDayAgo);
    } else if (timeframe === 'weekly') {
      const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
      tests = tests.filter(t => new Date(t.createdAt).getTime() >= oneWeekAgo);
    } else if (timeframe === 'monthly') {
      const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
      tests = tests.filter(t => new Date(t.createdAt).getTime() >= oneMonthAgo);
    }

    // Mode filter
    if (mode !== 'all') {
      if (mode === '15' || mode === '30' || mode === '60') {
        tests = tests.filter(t => t.mode === 'time' && String(t.modeValue) === mode);
      } else if (mode === 'words') {
        tests = tests.filter(t => t.mode === 'words');
      } else if (mode === 'quote') {
        tests = tests.filter(t => t.mode === 'quote');
      } else if (mode === 'code') {
        tests = tests.filter(t => t.mode === 'code');
      }
    }

    // Best test per user
    const bestPerUser = new Map<string, typeof tests[0]>();
    for (const test of tests) {
      const key = test.userId || test.username;
      const existing = bestPerUser.get(key);
      if (!existing || test.wpm > existing.wpm || (test.wpm === existing.wpm && test.accuracy > existing.accuracy)) {
        bestPerUser.set(key, test);
      }
    }

    // Sort descending by WPM then accuracy
    const sorted = Array.from(bestPerUser.values()).sort((a, b) => {
      if (b.wpm !== a.wpm) return b.wpm - a.wpm;
      return b.accuracy - a.accuracy;
    });

    const l = Math.min(100, Math.max(1, Number(limit)));
    const entries = sorted.slice(0, l).map((t, idx) => {
      const user = t.userId ? db.findUserById(t.userId) : null;
      return {
        rank: idx + 1,
        testId: t.id,
        userId: t.userId,
        username: user ? user.username : t.username,
        avatar: user ? user.avatar : 'bolt',
        level: user ? user.level : 1,
        wpm: t.wpm,
        rawWpm: t.rawWpm,
        accuracy: t.accuracy,
        mode: t.mode,
        modeValue: t.modeValue,
        textTitle: t.textTitle,
        createdAt: t.createdAt
      };
    });

    let userRank = null;
    if (req.user) {
      const userIdx = sorted.findIndex(t => t.userId === req.user?.id);
      if (userIdx !== -1) {
        const t = sorted[userIdx];
        userRank = {
          rank: userIdx + 1,
          wpm: t.wpm,
          accuracy: t.accuracy,
          mode: t.mode
        };
      }
    }

    res.json({
      timeframe,
      mode,
      entries,
      totalParticipants: sorted.length,
      userRank
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve leaderboard: ' + (err.message || 'Server error') });
  }
});
