import { Router, Request, Response } from 'express';
import * as experiencesService from '../services/experiencesService.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validation.js';
import { createExperienceSchema, queryExperiencesSchema } from '../validators/experiences.js';

const router = Router();

router.post(
  '/',
  requireAuth,
  requireRole('host', 'admin'),
  validateRequest(createExperienceSchema),
  async (req: Request, res: Response) => {
    try {
      const { title, description, location, price, startTime } = req.body;
      const userId = req.user!.userId;

      const experience = await experiencesService.createExperience(
        title,
        description,
        location,
        price,
        new Date(startTime),
        userId
      );

      res.status(201).json(experience);
    } catch (error) {
      res.status(500).json({
        error: { code: 'CREATE_ERROR', message: 'Failed to create experience' },
      });
    }
  }
);

router.patch('/:id/publish', requireAuth, requireRole('host', 'admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    const experience = await experiencesService.getExperienceById(Number(id));
    if (!experience) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Experience not found' },
      });
    }

    if (experience.createdBy !== userId && userRole !== 'admin') {
      return res.status(403).json({
        error: { code: 'FORBIDDEN', message: 'Cannot publish this experience' },
      });
    }

    const updated = await experiencesService.publishExperience(Number(id));
    res.json(updated);
  } catch (error) {
    res.status(500).json({
      error: { code: 'PUBLISH_ERROR', message: 'Failed to publish experience' },
    });
  }
});

router.patch('/:id/block', requireAuth, requireRole('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const experience = await experiencesService.getExperienceById(Number(id));
    if (!experience) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Experience not found' },
      });
    }

    const updated = await experiencesService.blockExperience(Number(id));
    res.json(updated);
  } catch (error) {
    res.status(500).json({
      error: { code: 'BLOCK_ERROR', message: 'Failed to block experience' },
    });
  }
});

router.get('/', validateRequest(queryExperiencesSchema), async (req: Request, res: Response) => {
  try {
    const { location, from, to, page = 1, limit = 10, sort = 'asc' } = req.body;

    const offset = (Number(page) - 1) * Number(limit);

    const result = await experiencesService.getPublishedExperiences({
      location,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      limit: Number(limit),
      offset,
      sort: sort as 'asc' | 'desc',
    });

    res.json({
      data: result.experiences,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        pages: Math.ceil(result.total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: { code: 'QUERY_ERROR', message: 'Failed to fetch experiences' },
    });
  }
});

export default router;
