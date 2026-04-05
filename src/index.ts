import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { prisma } from './db/prisma.js';
import { requestLoggingMiddleware, errorHandler } from './middlewares/logging.js';
import authRoutes from './routes/auth.js';
import experiencesRoutes from './routes/experiences.js';
import bookingsRoutes from './routes/bookings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(requestLoggingMiddleware);

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: 'ok',
      db: 'connected',
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'error',
      db: 'disconnected',
    });
  }
});

// Routes
app.use('/auth', authRoutes);
app.use('/experiences', experiencesRoutes);
app.use('/experiences', bookingsRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.path} not found`,
      details: [],
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Ready to accept requests');
});
