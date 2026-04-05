import { prisma } from '../db/prisma.js';

export const createBooking = async (experienceId: number, userId: number, seats: number) => {
  return await prisma.booking.create({
    data: {
      experienceId,
      userId,
      seats,
      status: 'confirmed',
    },
  });
};

export const getExistingBooking = async (experienceId: number, userId: number) => {
  return await prisma.booking.findFirst({
    where: {
      experienceId,
      userId,
    },
  });
};

export const getUserBookings = async (userId: number) => {
  return await prisma.booking.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const cancelBooking = async (id: number) => {
  return await prisma.booking.update({
    where: { id },
    data: { status: 'cancelled' },
  });
};
