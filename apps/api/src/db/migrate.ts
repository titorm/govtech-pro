import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, closeDatabase } from './connection';
import { logger } from '../lib/logger';

async function runMigrations() {
  try {
    logger.info('Starting database migrations...');
    
    await migrate(db, { migrationsFolder: './drizzle' });
    
    logger.info('Database migrations completed successfully');
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

runMigrations();