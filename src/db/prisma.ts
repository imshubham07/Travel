import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export { prisma };

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

// Connection retry logic with exponential backoff
const MAX_RETRIES = 5;
const INITIAL_DELAY = 1000; // 1 second

async function connectWithRetry(): Promise<void> {
  let retries = 0;
  let delay = INITIAL_DELAY;

  while (retries < MAX_RETRIES) {
    try {
      console.log(`Attempting to connect to database (attempt ${retries + 1}/${MAX_RETRIES})...`);
      await prisma.$queryRaw`SELECT 1`;
      console.log('✓ Successfully connected to database');
      return;
    } catch (error) {
      retries++;
      if (retries >= MAX_RETRIES) {
        console.error('✗ Failed to connect to database after maximum retries');
        throw new Error(
          `Could not connect to database after ${MAX_RETRIES} attempts. Error: ${error instanceof Error ? error.message : String(error)}`
        );
      }
      console.log(`✗ Connection failed. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, 10000); // Exponential backoff, max 10 seconds
    }
  }
}

// Ensure connection on startup
connectWithRetry().catch((error) => {
  console.error('Fatal: Unable to connect to database:', error);
  process.exit(1);
});
