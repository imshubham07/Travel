import { prisma } from '../db/prisma.js';
import { Status } from '@prisma/client';

export const createExperience = async (
  title: string,
  description: string | undefined,
  location: string | undefined,
  price: number,
  startTime: Date,
  createdBy: number
) => {
  return await prisma.experience.create({
    data: {
      title,
      description,
      location,
      price,
      startTime,
      status: 'draft',
      createdBy,
    },
  });
};

export const getExperienceById = async (id: number) => {
  return await prisma.experience.findUnique({
    where: { id },
  });
};

export const publishExperience = async (id: number) => {
  return await prisma.experience.update({
    where: { id },
    data: { status: 'published' },
  });
};

export const blockExperience = async (id: number) => {
  return await prisma.experience.update({
    where: { id },
    data: { status: 'blocked' },
  });
};

interface GetPublishedParams {
  location?: string;
  from?: Date;
  to?: Date;
  limit: number;
  offset: number;
  sort: 'asc' | 'desc';
}

export const getPublishedExperiences = async (params: GetPublishedParams) => {
  const whereClause: any = { status: 'published' };

  if (params.location) {
    whereClause.location = {
      contains: params.location,
      mode: 'insensitive',
    };
  }

  if (params.from || params.to) {
    whereClause.startTime = {};
    if (params.from) whereClause.startTime.gte = params.from;
    if (params.to) whereClause.startTime.lte = params.to;
  }

  const [experiences, total] = await Promise.all([
    prisma.experience.findMany({
      where: whereClause,
      take: params.limit,
      skip: params.offset,
      orderBy: { startTime: params.sort },
    }),
    prisma.experience.count({ where: whereClause }),
  ]);

  return { experiences, total };
};
