import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth';
import { userRoutes } from './users';
import { protocolRoutes } from './protocols';
import { serviceRoutes } from './services';
import { documentRoutes } from './documents';
import { adminRoutes } from './admin';
import { integrationRoutes } from './integrations';

export async function registerRoutes(server: FastifyInstance) {
  // API prefix
  await server.register(async function (server) {
    // Authentication routes
    await server.register(authRoutes, { prefix: '/auth' });
    
    // User routes
    await server.register(userRoutes, { prefix: '/users' });
    
    // Protocol routes
    await server.register(protocolRoutes, { prefix: '/protocols' });
    
    // Service routes
    await server.register(serviceRoutes, { prefix: '/services' });
    
    // Document routes
    await server.register(documentRoutes, { prefix: '/documents' });
    
    // Admin routes
    await server.register(adminRoutes, { prefix: '/admin' });
    
    // Integration routes
    await server.register(integrationRoutes, { prefix: '/integrations' });
    
  }, { prefix: '/api/v1' });
}