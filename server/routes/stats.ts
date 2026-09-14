import { Router, Response } from 'express';
import { db } from '../db';
import { authMiddleware, AuthenticatedRequest } from '../auth';

export const statsRouter = Router();

// Global stats
statsRouter.get('/global', (req, res): void => {
  const tests = db.getTests();
  const users = db.getUsers();

  const totalTests = tests.length;
  const avgSpeed = totalTests > 0 ? Math.round(tests.reduce((acc, t) => acc + t.wpm, 0) / totalTests) : 0;
  const highestSpeed = totalTests > 0 ? Math.max(...tests.map(t => t.wpm)) : 0;
  const totalCharacters = tests.reduce((acc, t) => acc + (t.correctChars || 0), 0);

  res.json({
    totalTests,
    registeredUsers: users.length,
    avgSpeed,
    highestSpeed,
    totalCharacters
  });
});

// User specific stats with graphs
statsRouter.get('/user', authMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const user = db.findUserById(req.user.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const userTests = db.getUserTests(req.user.id);

  // Speed progression over recent 30 tests
  const speedProgression = [...userTests]
    .reverse()
    .slice(-30)
    .map((t, idx) => ({
      index: idx + 1,
      date: new Date(t.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      wpm: t.wpm,
      rawWpm: t.rawWpm,
      accuracy: t.accuracy,
      mode: t.mode
    }));

  // Breakdown by mode
  const modeBreakdown = {
    time: userTests.filter(t => t.mode === 'time').length,
    words: userTests.filter(t => t.mode === 'words').length,
    quote: userTests.filter(t => t.mode === 'quote').length,
    code: userTests.filter(t => t.mode === 'code').length
  };

  // Best WPM by mode
  const bestByMode = {
    time15: Math.max(0, ...userTests.filter(t => t.mode === 'time' && t.modeValue === 15).map(t => t.wpm)),
    time30: Math.max(0, ...userTests.filter(t => t.mode === 'time' && t.modeValue === 30).map(t => t.wpm)),
    time60: Math.max(0, ...userTests.filter(t => t.mode === 'time' && t.modeValue === 60).map(t => t.wpm)),
    words: Math.max(0, ...userTests.filter(t => t.mode === 'words').map(t => t.wpm)),
    quote: Math.max(0, ...userTests.filter(t => t.mode === 'quote').map(t => t.wpm)),
    code: Math.max(0, ...userTests.filter(t => t.mode === 'code').map(t => t.wpm))
  };

  res.json({
    user: {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      xp: user.xp,
      level: user.level,
      badges: user.badges,
      createdAt: user.createdAt,
      stats: user.stats
    },
    speedProgression,
    modeBreakdown,
    bestByMode,
    recentTests: userTests.slice(0, 10)
  });
});
