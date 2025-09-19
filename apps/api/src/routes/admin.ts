import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db/connection';
import { users, protocols, auditLogs } from '../db/schema';
import { eq, desc, count, sql } from 'drizzle-orm';
import { logger } from '../lib/logger';

export async function adminRoutes(server: FastifyInstance) {
  // Dashboard metrics
  server.get('/dashboard', {
    preHandler: [server.requireAdmin],
    schema: {
      tags: ['admin'],
      summary: 'Get dashboard metrics',
      security: [{ Bearer: [] }],
    },
  }, async (request, reply) => {
    try {
      // Total protocols
      const [{ totalProtocols }] = await db
        .select({ totalProtocols: count() })
        .from(protocols);

      // Protocols by status
      const protocolsByStatus = await db
        .select({
          status: protocols.status,
          count: count(),
        })
        .from(protocols)
        .groupBy(protocols.status);

      // Protocols by priority
      const protocolsByPriority = await db
        .select({
          priority: protocols.priority,
          count: count(),
        })
        .from(protocols)
        .groupBy(protocols.priority);

      // Total users
      const [{ totalUsers }] = await db
        .select({ totalUsers: count() })
        .from(users);

      // Active users (logged in last 30 days)
      const [{ activeUsers }] = await db
        .select({ activeUsers: count() })
        .from(users)
        .where(sql`last_login_at > NOW() - INTERVAL '30 days'`);

      // New users this month
      const [{ newUsersThisMonth }] = await db
        .select({ newUsersThisMonth: count() })
        .from(users)
        .where(sql`created_at > DATE_TRUNC('month', NOW())`);

      // Recent protocols
      const recentProtocols = await db
        .select({
          id: protocols.id,
          number: protocols.number,
          subject: protocols.subject,
          status: protocols.status,
          priority: protocols.priority,
          createdAt: protocols.createdAt,
        })
        .from(protocols)
        .orderBy(desc(protocols.createdAt))
        .limit(10);

      return reply.send({
        success: true,
        data: {
          metrics: {
            totalProtocols,
            totalUsers,
            activeUsers,
            newUsersThisMonth,
          },
          charts: {
            protocolsByStatus: protocolsByStatus.reduce((acc, item) => {
              acc[item.status] = item.count;
              return acc;
            }, {} as Record<string, number>),
            protocolsByPriority: protocolsByPriority.reduce((acc, item) => {
              acc[item.priority] = item.count;
              return acc;
            }, {} as Record<string, number>),
          },
          recentProtocols,
        },
      });
    } catch (error) {
      logger.error('Dashboard metrics error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });

  // List users
  server.get('/users', {
    preHandler: [server.requireAdmin],
    schema: {
      tags: ['admin'],
      summary: 'List users',
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'string', default: '1' },
          limit: { type: 'string', default: '20' },
          search: { type: 'string' },
          role: { type: 'string' },
          status: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    const query = request.query as any;
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const offset = (page - 1) * limit;

    try {
      let whereConditions = [];
      
      if (query.search) {
        whereConditions.push(sql`name ILIKE ${`%${query.search}%`} OR email ILIKE ${`%${query.search}%`} OR cpf LIKE ${`%${query.search}%`}`);
      }
      
      if (query.role) {
        whereConditions.push(eq(users.role, query.role));
      }
      
      if (query.status) {
        whereConditions.push(eq(users.status, query.status));
      }

      const whereClause = whereConditions.length > 0 ? sql`WHERE ${sql.join(whereConditions, sql` AND `)}` : sql``;

      const usersList = await db
        .select({
          id: users.id,
          cpf: users.cpf,
          name: users.name,
          email: users.email,
          phone: users.phone,
          role: users.role,
          status: users.status,
          lastLoginAt: users.lastLoginAt,
          createdAt: users.createdAt,
        })
        .from(users)
        .where(whereClause)
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset(offset);

      const [{ total }] = await db
        .select({ total: count() })
        .from(users)
        .where(whereClause);

      return reply.send({
        success: true,
        data: usersList,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      logger.error('List users error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });

  // Update user status
  server.patch('/users/:id/status', {
    preHandler: [server.requireAdmin],
    schema: {
      tags: ['admin'],
      summary: 'Update user status',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
        required: ['id'],
      },
      body: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['active', 'inactive', 'suspended', 'pending_verification'],
          },
        },
        required: ['status'],
      },
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: string };
    const adminId = (request as any).user.id;

    try {
      const [updatedUser] = await db
        .update(users)
        .set({ status: status as any, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();

      if (!updatedUser) {
        return reply.code(404).send({
          success: false,
          error: 'Usuário não encontrado',
        });
      }

      return reply.send({
        success: true,
        data: { user: updatedUser },
      });
    } catch (error) {
      logger.error('Update user status error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });

  // Audit logs
  server.get('/audit-logs', {
    preHandler: [server.requireAdmin],
    schema: {
      tags: ['admin'],
      summary: 'Get audit logs',
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'string', default: '1' },
          limit: { type: 'string', default: '50' },
          action: { type: 'string' },
          entityType: { type: 'string' },
          userId: { type: 'string' },
          dateFrom: { type: 'string' },
          dateTo: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    const query = request.query as any;
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 50;
    const offset = (page - 1) * limit;

    try {
      let whereConditions = [];
      
      if (query.action) {
        whereConditions.push(eq(auditLogs.action, query.action));
      }
      
      if (query.entityType) {
        whereConditions.push(eq(auditLogs.entityType, query.entityType));
      }
      
      if (query.userId) {
        whereConditions.push(eq(auditLogs.userId, query.userId));
      }
      
      if (query.dateFrom) {
        whereConditions.push(sql`timestamp >= ${query.dateFrom}`);
      }
      
      if (query.dateTo) {
        whereConditions.push(sql`timestamp <= ${query.dateTo}`);
      }

      const whereClause = whereConditions.length > 0 ? sql`WHERE ${sql.join(whereConditions, sql` AND `)}` : sql``;

      const logs = await db
        .select()
        .from(auditLogs)
        .where(whereClause)
        .orderBy(desc(auditLogs.timestamp))
        .limit(limit)
        .offset(offset);

      const [{ total }] = await db
        .select({ total: count() })
        .from(auditLogs)
        .where(whereClause);

      return reply.send({
        success: true,
        data: logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      logger.error('Audit logs error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });
}