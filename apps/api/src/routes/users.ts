import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db/connection';
import { users, citizenProfiles } from '../db/schema';
import { eq } from 'drizzle-orm';
import { logger, logAuditEvent } from '../lib/logger';

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  rg: z.string().optional(),
  birthDate: z.string().datetime().optional(),
  occupation: z.string().optional(),
  maritalStatus: z.string().optional(),
  education: z.string().optional(),
  monthlyIncome: z.string().optional(),
  // Address
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2).optional(),
  zipCode: z.string().length(8).optional(),
});

export async function userRoutes(server: FastifyInstance) {
  // Get user profile
  server.get('/profile', {
    preHandler: [server.authenticate],
    schema: {
      tags: ['users'],
      summary: 'Get user profile',
      security: [{ Bearer: [] }],
    },
  }, async (request, reply) => {
    const userId = (request as any).user.id;

    try {
      const [user] = await db
        .select()
        .from(users)
        .leftJoin(citizenProfiles, eq(users.id, citizenProfiles.userId))
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
      logger.error('Get profile error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });

  // Update user profile
  server.put('/profile', {
    preHandler: [server.authenticate],
    schema: {
      tags: ['users'],
      summary: 'Update user profile',
      security: [{ Bearer: [] }],
      body: updateProfileSchema,
    },
  }, async (request, reply) => {
    const userId = (request as any).user.id;
    const updateData = updateProfileSchema.parse(request.body);

    try {
      // Update user basic info
      const userUpdates: any = {};
      if (updateData.name) userUpdates.name = updateData.name;
      if (updateData.email) userUpdates.email = updateData.email;
      if (updateData.phone) userUpdates.phone = updateData.phone;

      if (Object.keys(userUpdates).length > 0) {
        await db
          .update(users)
          .set({ ...userUpdates, updatedAt: new Date() })
          .where(eq(users.id, userId));
      }

      // Update or create citizen profile
      const profileUpdates: any = {};
      if (updateData.rg) profileUpdates.rg = updateData.rg;
      if (updateData.birthDate) profileUpdates.birthDate = new Date(updateData.birthDate);
      if (updateData.occupation) profileUpdates.occupation = updateData.occupation;
      if (updateData.maritalStatus) profileUpdates.maritalStatus = updateData.maritalStatus;
      if (updateData.education) profileUpdates.education = updateData.education;
      if (updateData.monthlyIncome) profileUpdates.monthlyIncome = updateData.monthlyIncome;
      if (updateData.street) profileUpdates.street = updateData.street;
      if (updateData.number) profileUpdates.number = updateData.number;
      if (updateData.complement) profileUpdates.complement = updateData.complement;
      if (updateData.neighborhood) profileUpdates.neighborhood = updateData.neighborhood;
      if (updateData.city) profileUpdates.city = updateData.city;
      if (updateData.state) profileUpdates.state = updateData.state;
      if (updateData.zipCode) profileUpdates.zipCode = updateData.zipCode;

      if (Object.keys(profileUpdates).length > 0) {
        // Check if profile exists
        const [existingProfile] = await db
          .select()
          .from(citizenProfiles)
          .where(eq(citizenProfiles.userId, userId))
          .limit(1);

        if (existingProfile) {
          await db
            .update(citizenProfiles)
            .set({ ...profileUpdates, updatedAt: new Date() })
            .where(eq(citizenProfiles.userId, userId));
        } else {
          await db
            .insert(citizenProfiles)
            .values({ userId, ...profileUpdates });
        }
      }

      // Log audit event
      logAuditEvent({
        userId,
        action: 'UPDATE_PROFILE',
        resource: 'user',
        resourceId: userId,
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
        metadata: updateData,
      });

      return reply.send({
        success: true,
        message: 'Perfil atualizado com sucesso',
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });
}