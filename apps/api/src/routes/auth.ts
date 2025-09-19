import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '../db/connection';
import { users, sessions } from '../db/schema';
import { eq } from 'drizzle-orm';
import { validateCPF } from '@govtech-pro/utils';
import { logger, logAuditEvent } from '../lib/logger';

const loginSchema = z.object({
  cpf: z.string().refine(validateCPF, 'CPF inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

const registerSchema = z.object({
  cpf: z.string().refine(validateCPF, 'CPF inválido'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

export async function authRoutes(server: FastifyInstance) {
  // Login
  server.post('/login', {
    schema: {
      tags: ['auth'],
      summary: 'User login',
      body: loginSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string' },
                  },
                },
                token: { type: 'string' },
                refreshToken: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { cpf, password } = loginSchema.parse(request.body);

    try {
      // Find user by CPF
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.cpf, cpf.replace(/\D/g, '')))
        .limit(1);

      if (!user || !user.passwordHash) {
        return reply.code(401).send({
          success: false,
          error: 'Credenciais inválidas',
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return reply.code(401).send({
          success: false,
          error: 'Credenciais inválidas',
        });
      }

      // Check if user is active
      if (user.status !== 'active') {
        return reply.code(401).send({
          success: false,
          error: 'Conta inativa ou suspensa',
        });
      }

      // Generate tokens
      const token = server.jwt.sign({
        id: user.id,
        cpf: user.cpf,
        email: user.email,
        role: user.role,
      });

      const refreshToken = server.jwt.sign(
        { id: user.id, type: 'refresh' },
        { expiresIn: '30d' }
      );

      // Create session
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      await db.insert(sessions).values({
        userId: user.id,
        token,
        refreshToken,
        expiresAt,
        refreshExpiresAt,
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'] || '',
      });

      // Update last login
      await db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, user.id));

      // Log audit event
      logAuditEvent({
        userId: user.id,
        action: 'LOGIN',
        resource: 'auth',
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
      });

      return reply.send({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
          refreshToken,
        },
      });
    } catch (error) {
      logger.error('Login error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });

  // Register
  server.post('/register', {
    schema: {
      tags: ['auth'],
      summary: 'User registration',
      body: registerSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { cpf, name, email, phone, password } = registerSchema.parse(request.body);

    try {
      const cleanCPF = cpf.replace(/\D/g, '');

      // Check if user already exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.cpf, cleanCPF))
        .limit(1);

      if (existingUser) {
        return reply.code(409).send({
          success: false,
          error: 'CPF já cadastrado',
        });
      }

      // Check if email already exists
      const [existingEmail] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingEmail) {
        return reply.code(409).send({
          success: false,
          error: 'Email já cadastrado',
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          cpf: cleanCPF,
          name,
          email,
          phone,
          passwordHash,
          role: 'citizen',
          status: 'active',
        })
        .returning();

      // Log audit event
      logAuditEvent({
        userId: newUser.id,
        action: 'REGISTER',
        resource: 'auth',
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
      });

      return reply.code(201).send({
        success: true,
        data: {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          },
        },
      });
    } catch (error) {
      logger.error('Registration error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });

  // Refresh token
  server.post('/refresh', {
    schema: {
      tags: ['auth'],
      summary: 'Refresh access token',
      body: {
        type: 'object',
        properties: {
          refreshToken: { type: 'string' },
        },
        required: ['refreshToken'],
      },
    },
  }, async (request, reply) => {
    const { refreshToken } = request.body as { refreshToken: string };

    try {
      // Verify refresh token
      const decoded = server.jwt.verify(refreshToken) as any;
      
      if (decoded.type !== 'refresh') {
        return reply.code(401).send({
          success: false,
          error: 'Token inválido',
        });
      }

      // Find session
      const [session] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.refreshToken, refreshToken))
        .limit(1);

      if (!session || !session.isActive || new Date() > session.refreshExpiresAt) {
        return reply.code(401).send({
          success: false,
          error: 'Token expirado ou inválido',
        });
      }

      // Get user
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, decoded.id))
        .limit(1);

      if (!user || user.status !== 'active') {
        return reply.code(401).send({
          success: false,
          error: 'Usuário inativo',
        });
      }

      // Generate new tokens
      const newToken = server.jwt.sign({
        id: user.id,
        cpf: user.cpf,
        email: user.email,
        role: user.role,
      });

      const newRefreshToken = server.jwt.sign(
        { id: user.id, type: 'refresh' },
        { expiresIn: '30d' }
      );

      // Update session
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await db
        .update(sessions)
        .set({
          token: newToken,
          refreshToken: newRefreshToken,
          expiresAt,
          refreshExpiresAt,
          lastUsedAt: new Date(),
        })
        .where(eq(sessions.id, session.id));

      return reply.send({
        success: true,
        data: {
          token: newToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      logger.error('Refresh token error:', error);
      return reply.code(401).send({
        success: false,
        error: 'Token inválido',
      });
    }
  });

  // Logout
  server.post('/logout', {
    preHandler: [server.authenticate],
    schema: {
      tags: ['auth'],
      summary: 'User logout',
      security: [{ Bearer: [] }],
    },
  }, async (request, reply) => {
    try {
      const token = request.headers.authorization?.replace('Bearer ', '');
      
      if (token) {
        // Deactivate session
        await db
          .update(sessions)
          .set({ isActive: false })
          .where(eq(sessions.token, token));
      }

      // Log audit event
      logAuditEvent({
        userId: (request as any).user.id,
        action: 'LOGOUT',
        resource: 'auth',
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
      });

      return reply.send({
        success: true,
        message: 'Logout realizado com sucesso',
      });
    } catch (error) {
      logger.error('Logout error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });

  // Get current user
  server.get('/me', {
    preHandler: [server.authenticate],
    schema: {
      tags: ['auth'],
      summary: 'Get current user info',
      security: [{ Bearer: [] }],
    },
  }, async (request, reply) => {
    try {
      const userId = (request as any).user.id;

      const [user] = await db
        .select({
          id: users.id,
          cpf: users.cpf,
          name: users.name,
          email: users.email,
          phone: users.phone,
          role: users.role,
          status: users.status,
          emailVerifiedAt: users.emailVerifiedAt,
          phoneVerifiedAt: users.phoneVerifiedAt,
          lastLoginAt: users.lastLoginAt,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        return reply.code(404).send({
          success: false,
          error: 'Usuário não encontrado',
        });
      }

      return reply.send({
        success: true,
        data: { user },
      });
    } catch (error) {
      logger.error('Get user error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });
}