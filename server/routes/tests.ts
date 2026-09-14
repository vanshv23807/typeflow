import { Router, Response } from 'express';
import { db, TypingTestDoc } from '../db';
import { optionalAuthMiddleware, authMiddleware, AuthenticatedRequest } from '../auth';

export const testsRouter = Router();

// Record a completed typing test
testsRouter.post('/', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const {
      wpm,
      netWpm,
      rawWpm,
      accuracy,
      durationSeconds,
      mode,
      modeValue,
      correctChars,
      incorrectChars,
      missedChars,
      extraChars,
      timeline,
      textTitle
    } = req.body;

    if (wpm === undefined || accuracy === undefined || durationSeconds === undefined) {
      res.status(400).json({ error: 'Missing core typing test metrics (wpm, accuracy, durationSeconds)' });
      return;
    }

    const testDoc: TypingTestDoc = {
      id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: req.user ? req.user.id : undefined,
      username: req.user ? req.user.username : 'Guest Typer',
      wpm: Math.max(0, Math.round(Number(wpm))),
      netWpm: Math.max(0, Math.round(Number(netWpm || wpm))),
      rawWpm: Math.max(0, Math.round(Number(rawWpm || wpm))),
      accuracy: Math.min(100, Math.max(0, Math.round(Number(accuracy) * 10) / 10)),
      durationSeconds: Math.round(Number(durationSeconds)),
      mode: mode || 'time',
      modeValue: modeValue || 30,
      correctChars: Number(correctChars || 0),
      incorrectChars: Number(incorrectChars || 0),
      missedChars: Number(missedChars || 0),
      extraChars: Number(extraChars || 0),
      timeline: Array.isArray(timeline) ? timeline : [],
      textTitle: textTitle || 'Typing Practice',
      createdAt: new Date().toISOString()
    };

    const saved = db.addTest(testDoc);
    
    // If user was logged in, return updated user profile
    const updatedUser = req.user ? db.findUserById(req.user.id) : null;
    let safeUser = null;
    if (updatedUser) {
      const { passwordHash: _, ...rest } = updatedUser;
      safeUser = rest;
    }

    res.status(201).json({
      test: saved,
      user: safeUser
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to record test: ' + (err.message || 'Server error') });
  }
});

// Get user test history
testsRouter.get('/history', authMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { mode, limit = 50, page = 1 } = req.query;
  let tests = db.getUserTests(req.user.id);

  if (mode && typeof mode === 'string' && mode !== 'all') {
    tests = tests.filter(t => t.mode === mode);
  }

  const l = Math.min(100, Math.max(1, Number(limit)));
  const p = Math.max(1, Number(page));
  const startIndex = (p - 1) * l;
  const paginated = tests.slice(startIndex, startIndex + l);

  res.json({
    tests: paginated,
    total: tests.length,
    page: p,
    limit: l,
    totalPages: Math.ceil(tests.length / l)
  });
});

// Get specific test by ID
testsRouter.get('/:id', (req, res): void => {
  const test = db.getTests().find(t => t.id === req.params.id);
  if (!test) {
    res.status(404).json({ error: 'Test not found' });
    return;
  }
  res.json({ test });
});
