import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db/connection';
import { protocols, workflowSteps, protocolResponses } from '../db/schema';
import { eq, desc, and, or, like, count } from 'drizzle-orm';
import { generateProtocolNumber } from '@govtech-pro/utils';
import { logger, logAuditEvent } from '../lib/logger';

const createProtocolSchema = z.object({
  type: z.enum(['request', 'complaint', 'suggestion', 'information', 'appeal', 'internal']),
  subject: z.string().min(5, 'Assunto deve ter pelo menos 5 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  requesterType: z.enum(['citizen', 'company', 'government', 'anonymous']),
  categoryId: z.string().uuid('ID da categoria inválido'),
  departmentId: z.string().uuid('ID do departamento inválido'),
  priority: z.enum(['low', 'normal', 'high', 'urgent', 'critical']).default('normal'),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

const updateProtocolSchema = z.object({
  status: z.enum(['received', 'in_analysis', 'pending_info', 'in_progress', 'forwarded', 'resolved', 'closed', 'cancelled']).optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent', 'critical']).optional(),
  assignedTo: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  deadlineAt: z.string().datetime().optional(),
});

const addResponseSchema = z.object({
  message: z.string().min(1, 'Mensagem é obrigatória'),
  isPublic: z.boolean().default(true),
  documents: z.array(z.string()).optional(),
});

const querySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('20'),
  search: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  type: z.string().optional(),
  assignedTo: z.string().optional(),
  departmentId: z.string().optional(),
  categoryId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export async function protocolRoutes(server: FastifyInstance) {
  // Create protocol
  server.post('/', {
    preHandler: [server.authenticate],
    schema: {
      tags: ['protocols'],
      summary: 'Create new protocol',
      security: [{ Bearer: [] }],
      body: createProtocolSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                protocol: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    number: { type: 'string' },
                    subject: { type: 'string' },
                    status: { type: 'string' },
                    priority: { type: 'string' },
                    createdAt: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    const userId = (request as any).user.id;
    const protocolData = createProtocolSchema.parse(request.body);

    try {
      const protocolNumber = generateProtocolNumber();

      const [newProtocol] = await db
        .insert(protocols)
        .values({
          ...protocolData,
          number: protocolNumber,
          requesterId: userId,
          tags: protocolData.tags || [],
          metadata: protocolData.metadata || {},
        })
        .returning();

      // Log audit event
      logAuditEvent({
        userId,
        action: 'CREATE_PROTOCOL',
        resource: 'protocol',
        resourceId: newProtocol.id,
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
        metadata: { protocolNumber },
      });

      return reply.code(201).send({
        success: true,
        data: { protocol: newProtocol },
      });
    } catch (error) {
      logger.error('Create protocol error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });

  // List protocols
  server.get('/', {
    preHandler: [server.authenticate],
    schema: {
      tags: ['protocols'],
      summary: 'List protocols',
      security: [{ Bearer: [] }],
      querystring: querySchema,
    },
  }, async (request, reply) => {
    const userId = (request as any).user.id;
    const userRole = (request as any).user.role;
    const query = querySchema.parse(request.query);

    try {
      const offset = (query.page - 1) * query.limit;
      
      // Build where conditions
      const conditions = [];
      
      // Citizens can only see their own protocols
      if (userRole === 'citizen') {
        conditions.push(eq(protocols.requesterId, userId));
      }
      
      if (query.search) {
        conditions.push(
          or(
            like(protocols.subject, `%${query.search}%`),
            like(protocols.description, `%${query.search}%`),
            like(protocols.number, `%${query.search}%`)
          )
        );
      }
      
      if (query.status) {
        conditions.push(eq(protocols.status, query.status as any));
      }
      
      if (query.priority) {
        conditions.push(eq(protocols.priority, query.priority as any));
      }
      
      if (query.type) {
        conditions.push(eq(protocols.type, query.type as any));
      }
      
      if (query.assignedTo) {
        conditions.push(eq(protocols.assignedTo, query.assignedTo));
      }
      
      if (query.departmentId) {
        conditions.push(eq(protocols.departmentId, query.departmentId));
      }
      
      if (query.categoryId) {
        conditions.push(eq(protocols.categoryId, query.categoryId));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      // Get protocols
      const protocolsList = await db
        .select()
        .from(protocols)
        .where(whereClause)
        .orderBy(desc(protocols.createdAt))
        .limit(query.limit)
        .offset(offset);

      // Get total count
      const [{ total }] = await db
        .select({ total: count() })
        .from(protocols)
        .where(whereClause);

      const totalPages = Math.ceil(total / query.limit);

      return reply.send({
        success: true,
        data: protocolsList,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          totalPages,
        },
      });
    } catch (error) {
      logger.error('List protocols error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });

  // Get protocol by ID
  server.get('/:id', {
    preHandler: [server.authenticate],
    schema: {
      tags: ['protocols'],
      summary: 'Get protocol by ID',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
        required: ['id'],
      },
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const userId = (request as any).user.id;
    const userRole = (request as any).user.role;

    try {
      const [protocol] = await db
        .select()
        .from(protocols)
        .where(eq(protocols.id, id))
        .limit(1);

      if (!protocol) {
        return reply.code(404).send({
          success: false,
          error: 'Protocolo não encontrado',
        });
      }

      // Check permissions
      if (userRole === 'citizen' && protocol.requesterId !== userId) {
        return reply.code(403).send({
          success: false,
          error: 'Acesso negado',
        });
      }

      // Get workflow steps
      const steps = await db
        .select()
        .from(workflowSteps)
        .where(eq(workflowSteps.protocolId, id))
        .orderBy(workflowSteps.stepNumber);

      // Get responses
      const responses = await db
        .select()
        .from(protocolResponses)
        .where(eq(protocolResponses.protocolId, id))
        .orderBy(desc(protocolResponses.createdAt));

      return reply.send({
        success: true,
        data: {
          protocol,
          workflowSteps: steps,
          responses,
        },
      });
    } catch (error) {
      logger.error('Get protocol error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });

  // Update protocol
  server.put('/:id', {
    preHandler: [server.requireAdmin],
    schema: {
      tags: ['protocols'],
      summary: 'Update protocol',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
        required: ['id'],
      },
      body: updateProtocolSchema,
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const userId = (request as any).user.id;
    const updateData = updateProtocolSchema.parse(request.body);

    try {
      // Get current protocol
      const [currentProtocol] = await db
        .select()
        .from(protocols)
        .where(eq(protocols.id, id))
        .limit(1);

      if (!currentProtocol) {
        return reply.code(404).send({
          success: false,
          error: 'Protocolo não encontrado',
        });
      }

      // Update protocol
      const [updatedProtocol] = await db
        .update(protocols)
        .set({
          ...updateData,
          deadlineAt: updateData.deadlineAt ? new Date(updateData.deadlineAt) : undefined,
          updatedAt: new Date(),
        })
        .where(eq(protocols.id, id))
        .returning();

      // Log audit event
      logAuditEvent({
        userId,
        action: 'UPDATE_PROTOCOL',
        resource: 'protocol',
        resourceId: id,
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
        metadata: {
          oldData: currentProtocol,
          newData: updatedProtocol,
        },
      });

      return reply.send({
        success: true,
        data: { protocol: updatedProtocol },
      });
    } catch (error) {
      logger.error('Update protocol error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });

  // Add response to protocol
  server.post('/:id/responses', {
    preHandler: [server.authenticate],
    schema: {
      tags: ['protocols'],
      summary: 'Add response to protocol',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
        required: ['id'],
      },
      body: addResponseSchema,
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const userId = (request as any).user.id;
    const userRole = (request as any).user.role;
    const responseData = addResponseSchema.parse(request.body);

    try {
      // Check if protocol exists
      const [protocol] = await db
        .select()
        .from(protocols)
        .where(eq(protocols.id, id))
        .limit(1);

      if (!protocol) {
        return reply.code(404).send({
          success: false,
          error: 'Protocolo não encontrado',
        });
      }

      // Check permissions
      if (userRole === 'citizen' && protocol.requesterId !== userId) {
        return reply.code(403).send({
          success: false,
          error: 'Acesso negado',
        });
      }

      // Add response
      const [newResponse] = await db
        .insert(protocolResponses)
        .values({
          protocolId: id,
          userId,
          message: responseData.message,
          isPublic: responseData.isPublic,
          documents: responseData.documents || [],
        })
        .returning();

      // Log audit event
      logAuditEvent({
        userId,
        action: 'ADD_PROTOCOL_RESPONSE',
        resource: 'protocol_response',
        resourceId: newResponse.id,
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
        metadata: { protocolId: id },
      });

      return reply.code(201).send({
        success: true,
        data: { response: newResponse },
      });
    } catch (error) {
      logger.error('Add protocol response error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });

  // Get protocol by number (public endpoint for tracking)
  server.get('/track/:number', {
    schema: {
      tags: ['protocols'],
      summary: 'Track protocol by number',
      params: {
        type: 'object',
        properties: {
          number: { type: 'string' },
        },
        required: ['number'],
      },
    },
  }, async (request, reply) => {
    const { number } = request.params as { number: string };

    try {
      const [protocol] = await db
        .select({
          id: protocols.id,
          number: protocols.number,
          subject: protocols.subject,
          status: protocols.status,
          priority: protocols.priority,
          createdAt: protocols.createdAt,
          updatedAt: protocols.updatedAt,
        })
        .from(protocols)
        .where(eq(protocols.number, number))
        .limit(1);

      if (!protocol) {
        return reply.code(404).send({
          success: false,
          error: 'Protocolo não encontrado',
        });
      }

      // Get public responses only
      const responses = await db
        .select({
          id: protocolResponses.id,
          message: protocolResponses.message,
          createdAt: protocolResponses.createdAt,
        })
        .from(protocolResponses)
        .where(
          and(
            eq(protocolResponses.protocolId, protocol.id),
            eq(protocolResponses.isPublic, true)
          )
        )
        .orderBy(desc(protocolResponses.createdAt));

      return reply.send({
        success: true,
        data: {
          protocol,
          responses,
        },
      });
    } catch (error) {
      logger.error('Track protocol error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });
}