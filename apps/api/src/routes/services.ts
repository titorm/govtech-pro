import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db/connection';
import { services, categories, departments } from '../db/schema';
import { eq, and, like, desc } from 'drizzle-orm';
import { logger } from '../lib/logger';

const querySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('20'),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  departmentId: z.string().optional(),
  isOnline: z.string().transform(Boolean).optional(),
});

export async function serviceRoutes(server: FastifyInstance) {
  // List services
  server.get('/', {
    schema: {
      tags: ['services'],
      summary: 'List available services',
      querystring: querySchema,
    },
  }, async (request, reply) => {
    const query = querySchema.parse(request.query);

    try {
      const offset = (query.page - 1) * query.limit;
      
      // Build where conditions
      const conditions = [eq(services.isActive, true)];
      
      if (query.search) {
        conditions.push(like(services.name, `%${query.search}%`));
      }
      
      if (query.categoryId) {
        conditions.push(eq(services.categoryId, query.categoryId));
      }
      
      if (query.departmentId) {
        conditions.push(eq(services.departmentId, query.departmentId));
      }
      
      if (query.isOnline !== undefined) {
        conditions.push(eq(services.isOnline, query.isOnline));
      }

      const whereClause = and(...conditions);

      // Get services with category and department info
      const servicesList = await db
        .select({
          id: services.id,
          name: services.name,
          description: services.description,
          code: services.code,
          isOnline: services.isOnline,
          estimatedDuration: services.estimatedDuration,
          requiredDocuments: services.requiredDocuments,
          fees: services.fees,
          category: {
            id: categories.id,
            name: categories.name,
            icon: categories.icon,
            color: categories.color,
          },
          department: {
            id: departments.id,
            name: departments.name,
            contactEmail: departments.contactEmail,
            contactPhone: departments.contactPhone,
          },
        })
        .from(services)
        .leftJoin(categories, eq(services.categoryId, categories.id))
        .leftJoin(departments, eq(services.departmentId, departments.id))
        .where(whereClause)
        .orderBy(services.name)
        .limit(query.limit)
        .offset(offset);

      return reply.send({
        success: true,
        data: servicesList,
        pagination: {
          page: query.page,
          limit: query.limit,
        },
      });
    } catch (error) {
      logger.error('List services error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });

  // Get service by ID
  server.get('/:id', {
    schema: {
      tags: ['services'],
      summary: 'Get service details',
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

    try {
      const [service] = await db
        .select({
          id: services.id,
          name: services.name,
          description: services.description,
          code: services.code,
          isOnline: services.isOnline,
          estimatedDuration: services.estimatedDuration,
          requiredDocuments: services.requiredDocuments,
          workflow: services.workflow,
          fees: services.fees,
          metadata: services.metadata,
          category: {
            id: categories.id,
            name: categories.name,
            icon: categories.icon,
            color: categories.color,
          },
          department: {
            id: departments.id,
            name: departments.name,
            description: departments.description,
            contactEmail: departments.contactEmail,
            contactPhone: departments.contactPhone,
            workingHours: departments.workingHours,
          },
        })
        .from(services)
        .leftJoin(categories, eq(services.categoryId, categories.id))
        .leftJoin(departments, eq(services.departmentId, departments.id))
        .where(and(eq(services.id, id), eq(services.isActive, true)))
        .limit(1);

      if (!service) {
        return reply.code(404).send({
          success: false,
          error: 'Serviço não encontrado',
        });
      }

      return reply.send({
        success: true,
        data: { service },
      });
    } catch (error) {
      logger.error('Get service error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });

  // List categories
  server.get('/categories', {
    schema: {
      tags: ['services'],
      summary: 'List service categories',
    },
  }, async (request, reply) => {
    try {
      const categoriesList = await db
        .select({
          id: categories.id,
          name: categories.name,
          description: categories.description,
          code: categories.code,
          icon: categories.icon,
          color: categories.color,
          sortOrder: categories.sortOrder,
        })
        .from(categories)
        .where(eq(categories.isActive, true))
        .orderBy(categories.sortOrder, categories.name);

      return reply.send({
        success: true,
        data: categoriesList,
      });
    } catch (error) {
      logger.error('List categories error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });

  // List departments
  server.get('/departments', {
    schema: {
      tags: ['services'],
      summary: 'List departments',
    },
  }, async (request, reply) => {
    try {
      const departmentsList = await db
        .select({
          id: departments.id,
          name: departments.name,
          description: departments.description,
          code: departments.code,
          contactEmail: departments.contactEmail,
          contactPhone: departments.contactPhone,
          workingHours: departments.workingHours,
        })
        .from(departments)
        .where(eq(departments.isActive, true))
        .orderBy(departments.name);

      return reply.send({
        success: true,
        data: departmentsList,
      });
    } catch (error) {
      logger.error('List departments error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });
}