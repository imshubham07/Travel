import { prisma } from '../db/prisma.js';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

export const createUser = async (email: string, passwordHash: string, role: Role) => {
  return await prisma.user.create({
    data: {
      email,
      passwordHash,
      role,
    },
  });
};

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
