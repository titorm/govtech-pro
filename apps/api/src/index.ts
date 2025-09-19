import { fastify } from 'fastify';
import { env, appConfig } from '@govtech-pro/config';
import { logger } from './lib/logger';
import { registerPlugins } from './plugins';
import { registerRoutes } from './routes';
import { connectDatabase } from './db/connection';

const server = fastify({
  logger: {
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

async function start() {
  try {
    // Connect to database
    await connectDatabase();
    logger.info('Database connected successfully');

    // Register plugins
    await registerPlugins(server);
    logger.info('Plugins registered successfully');

    // Register routes
    await registerRoutes(server);
    logger.info('Routes registered successfully');

    // Start server
    const address = await server.listen({
      port: appConfig.port,
      host: '0.0.0.0',
    });

    logger.info(`🚀 GovTech Pro API running at ${address}`);
    logger.info(`📚 API Documentation: ${address}/docs`);
    logger.info(`🔍 Health Check: ${address}/health`);

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);
      
      try {
        await server.close();
        logger.info('Server closed successfully');
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

start();