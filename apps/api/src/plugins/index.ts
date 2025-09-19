import { FastifyInstance } from 'fastify';
import { logger } from '../lib/logger';

export async function registerPlugins(server: FastifyInstance) {
  // CORS
  await server.register(import('@fastify/cors'), {
    origin: (origin, callback) => {
      const hostname = new URL(origin || 'http://localhost:3000').hostname;
      
      // Allow localhost in development
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        callback(null, true);
        return;
      }
      
      // Allow production domains
      const allowedDomains = [
        'govtech-pro.com.br',
        'portal.govtech-pro.com.br',
        'admin.govtech-pro.com.br',
      ];
      
      if (allowedDomains.some(domain => hostname.endsWith(domain))) {
        callback(null, true);
        return;
      }
      
      callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  // Security headers
  await server.register(import('@fastify/helmet'), {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  });

  // Rate limiting
  await server.register(import('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
    errorResponseBuilder: (request, context) => ({
      code: 429,
      error: 'Too Many Requests',
      message: `Rate limit exceeded, retry in ${context.ttl} seconds`,
      date: Date.now(),
      expiresIn: context.ttl,
    }),
  });

  // JWT authentication
  await server.register(import('@fastify/jwt'), {
    secret: process.env.JWT_SECRET!,
    sign: {
      expiresIn: '7d',
    },
  });

  // Multipart support for file uploads
  await server.register(import('@fastify/multipart'), {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 10,
    },
  });

  // Static files
  await server.register(import('@fastify/static'), {
    root: process.cwd() + '/uploads',
    prefix: '/uploads/',
  });

  // Swagger documentation
  await server.register(import('@fastify/swagger'), {
    swagger: {
      info: {
        title: 'GovTech Pro API',
        description: 'API para Modernização da Gestão Pública',
        version: '1.0.0',
      },
      host: 'localhost:3002',
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'auth', description: 'Authentication endpoints' },
        { name: 'users', description: 'User management endpoints' },
        { name: 'protocols', description: 'Protocol management endpoints' },
        { name: 'services', description: 'Service management endpoints' },
        { name: 'documents', description: 'Document management endpoints' },
        { name: 'admin', description: 'Administrative endpoints' },
      ],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    },
  });

  await server.register(import('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });

  // Health check
  server.get('/health', async (request, reply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      environment: process.env.NODE_ENV,
    };
  });

  // Authentication decorator
  server.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  // Admin role check decorator
  server.decorate('requireAdmin', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
      
      if (!['admin', 'manager'].includes(request.user.role)) {
        reply.code(403).send({ error: 'Forbidden: Admin access required' });
      }
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  // Request logging
  server.addHook('onRequest', async (request, reply) => {
    logger.info(`${request.method} ${request.url}`, {
      ip: request.ip,
      userAgent: request.headers['user-agent'],
    });
  });

  // Error handling
  server.setErrorHandler((error, request, reply) => {
    logger.error('Request error:', {
      error: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method,
      ip: request.ip,
    });

    // Validation errors
    if (error.validation) {
      reply.code(400).send({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: error.validation,
      });
      return;
    }

    // JWT errors
    if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
      reply.code(401).send({
        error: 'Token Expired',
        message: 'Authentication token has expired',
      });
      return;
    }

    if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER') {
      reply.code(401).send({
        error: 'No Authorization',
        message: 'Authorization header is required',
      });
      return;
    }

    // Default error response
    const statusCode = error.statusCode || 500;
    reply.code(statusCode).send({
      error: statusCode >= 500 ? 'Internal Server Error' : error.message,
      message: statusCode >= 500 ? 'Something went wrong' : error.message,
      timestamp: new Date().toISOString(),
    });
  });

  logger.info('All plugins registered successfully');
}