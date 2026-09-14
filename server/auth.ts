import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { db, UserDoc } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'typeflow_super_secret_jwt_key_2025';

export interface AuthenticatedRequest extends Request {
  user?: UserDoc;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(user: { id: string; username: string; email: string }): string {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): { id: string; username: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; username: string; email: string };
  } catch (err) {
    return null;
  }
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization header missing or invalid' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired authentication token' });
    return;
  }

  const user = db.findUserById(payload.id);
  if (!user) {
    res.status(401).json({ error: 'User associated with token not found' });
    return;
  }

  req.user = user;
  next();
}

export function optionalAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (payload) {
      const user = db.findUserById(payload.id);
      if (user) {
        req.user = user;
      }
    }
  }
  next();
}
