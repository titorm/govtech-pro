import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '@govtech-pro/config';
import { logger } from '../lib/logger';
import * as schema from './schema';

// Create postgres client
const client = postgres(env.DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create drizzle instance
export const db = drizzle(client, { 
  schema,
  logger: env.NODE_ENV === 'development',
});

export async function connectDatabase() {
  try {
    // Test connection
    await client`SELECT 1`;
    logger.info('Database connection established');
    return db;
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
}

export async function closeDatabase() {
  try {
    await client.end();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
}

export type Database = typeof db;