import { Router, Response } from 'express';
import { db, UserDoc } from '../db';
import { hashPassword, comparePassword, signToken, authMiddleware, AuthenticatedRequest } from '../auth';

export const authRouter = Router();

// Register
authRouter.post('/register', async (req, res): Promise<void> => {
  try {
    const { username, email, password, avatar } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: 'Username, email, and password are required' });
      return;
    }

    if (username.length < 3 || username.length > 20) {
      res.status(400).json({ error: 'Username must be between 3 and 20 characters' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    if (db.findUserByEmail(email)) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    if (db.findUserByUsername(username)) {
      res.status(409).json({ error: 'Username is already taken' });
      return;
    }

    const passwordHash = await hashPassword(password);
    const newUser: UserDoc = {
      id: `u_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      username,
      email,
      passwordHash,
      avatar: avatar || 'bolt',
      bio: 'Ready to elevate my typing velocity.',
      createdAt: new Date().toISOString(),
      xp: 100,
      level: 1,
      badges: ['novice_typer'],
      stats: {
        testsCompleted: 0,
        timeSpentSeconds: 0,
        bestWpm: 0,
        avgWpm: 0,
        avgAccuracy: 0,
        totalCharsTyped: 0,
        racesWon: 0
      }
    };

    db.createUser(newUser);
    const token = signToken({ id: newUser.id, username: newUser.username, email: newUser.email });

    const { passwordHash: _, ...safeUser } = newUser;
    res.status(201).json({ token, user: safeUser });
  } catch (err: any) {
    res.status(500).json({ error: 'Registration failed: ' + (err.message || 'Server error') });
  }
});

// Login
authRouter.post('/login', async (req, res): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({ error: 'Username/email and password are required' });
      return;
    }

    let user = db.findUserByEmail(identifier);
    if (!user) {
      user = db.findUserByUsername(identifier);
    }

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials. User not found.' });
      return;
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
      return;
    }

    const token = signToken({ id: user.id, username: user.username, email: user.email });
    const { passwordHash: _, ...safeUser } = user;

    res.json({ token, user: safeUser });
  } catch (err: any) {
    res.status(500).json({ error: 'Login failed: ' + (err.message || 'Server error') });
  }
});

// Get current authenticated user
authRouter.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { passwordHash: _, ...safeUser } = req.user;
  res.json({ user: safeUser });
});

// Update profile
authRouter.put('/profile', authMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { bio, avatar } = req.body;
  const updates: Partial<UserDoc> = {};
  if (bio !== undefined) updates.bio = String(bio).slice(0, 200);
  if (avatar !== undefined) updates.avatar = String(avatar);

  const updated = db.updateUser(req.user.id, updates);
  if (!updated) {
    res.status(404).json({ error: 'User update failed' });
    return;
  }

  const { passwordHash: _, ...safeUser } = updated;
  res.json({ user: safeUser });
});
