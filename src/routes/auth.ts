import { Router, Request, Response } from 'express';
import * as authService from '../services/authService.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validation.js';
import { signupSchema, loginSchema } from '../validators/auth.js';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/signup', validateRequest(signupSchema), async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    // Admin role not allowed in signup
    if (role === 'admin') {
      return res.status(400).json({
        error: { code: 'INVALID_ROLE', message: 'Cannot self-register as admin' },
      });
    }

    const existingUser = await authService.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: { code: 'USER_EXISTS', message: 'Email already registered' },
      });
    }

    const passwordHash = await authService.hashPassword(password);
    const user = await authService.createUser(email, passwordHash, role);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({
      error: { code: 'SIGNUP_ERROR', message: 'Failed to create user' },
    });
  }
});

router.post('/login', validateRequest(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await authService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
    }

    const isPasswordValid = await authService.verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: { code: 'LOGIN_ERROR', message: 'Failed to login' },
    });
  }
});

export default router;
