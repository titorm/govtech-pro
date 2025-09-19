import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db/connection';
import { documents } from '../db/schema';
import { eq } from 'drizzle-orm';
import { generateDocumentHash } from '@govtech-pro/utils/src/server';
import { logger, logAuditEvent } from '../lib/logger';
import path from 'path';
import fs from 'fs/promises';

export async function documentRoutes(server: FastifyInstance) {
  // Upload document
  server.post('/upload', {
    preHandler: [server.authenticate],
    schema: {
      tags: ['documents'],
      summary: 'Upload document',
      security: [{ Bearer: [] }],
      consumes: ['multipart/form-data'],
    },
  }, async (request, reply) => {
    const userId = (request as any).user.id;

    try {
      const data = await request.file();
      
      if (!data) {
        return reply.code(400).send({
          success: false,
          error: 'Nenhum arquivo enviado',
        });
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ];

      if (!allowedTypes.includes(data.mimetype)) {
        return reply.code(400).send({
          success: false,
          error: 'Tipo de arquivo não permitido',
        });
      }

      // Validate file size (10MB)
      const maxSize = 10 * 1024 * 1024;
      const buffer = await data.toBuffer();
      
      if (buffer.length > maxSize) {
        return reply.code(400).send({
          success: false,
          error: 'Arquivo muito grande (máximo 10MB)',
        });
      }

      // Generate unique filename
      const fileExtension = path.extname(data.filename);
      const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${fileExtension}`;
      const uploadPath = path.join(process.cwd(), 'uploads', uniqueFilename);

      // Ensure upload directory exists
      await fs.mkdir(path.dirname(uploadPath), { recursive: true });

      // Save file
      await fs.writeFile(uploadPath, buffer);

      // Generate hash
      const hash = generateDocumentHash(buffer);

      // Save to database
      const [newDocument] = await db
        .insert(documents)
        .values({
          name: uniqueFilename,
          originalName: data.filename,
          mimeType: data.mimetype,
          size: buffer.length,
          url: `/uploads/${uniqueFilename}`,
          hash,
          uploadedBy: userId,
        })
        .returning();

      // Log audit event
      logAuditEvent({
        userId,
        action: 'UPLOAD_DOCUMENT',
        resource: 'document',
        resourceId: newDocument.id,
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
        metadata: {
          filename: data.filename,
          size: buffer.length,
          mimeType: data.mimetype,
        },
      });

      return reply.code(201).send({
        success: true,
        data: { document: newDocument },
      });
    } catch (error) {
      logger.error('Upload document error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });

  // Get document
  server.get('/:id', {
    preHandler: [server.authenticate],
    schema: {
      tags: ['documents'],
      summary: 'Get document',
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
      const [document] = await db
        .select()
        .from(documents)
        .where(eq(documents.id, id))
        .limit(1);

      if (!document) {
        return reply.code(404).send({
          success: false,
          error: 'Documento não encontrado',
        });
      }

      // Check permissions
      if (userRole === 'citizen' && document.uploadedBy !== userId && !document.isPublic) {
        return reply.code(403).send({
          success: false,
          error: 'Acesso negado',
        });
      }

      return reply.send({
        success: true,
        data: { document },
      });
    } catch (error) {
      logger.error('Get document error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });

  // Download document
  server.get('/:id/download', {
    preHandler: [server.authenticate],
    schema: {
      tags: ['documents'],
      summary: 'Download document',
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
      const [document] = await db
        .select()
        .from(documents)
        .where(eq(documents.id, id))
        .limit(1);

      if (!document) {
        return reply.code(404).send({
          success: false,
          error: 'Documento não encontrado',
        });
      }

      // Check permissions
      if (userRole === 'citizen' && document.uploadedBy !== userId && !document.isPublic) {
        return reply.code(403).send({
          success: false,
          error: 'Acesso negado',
        });
      }

      const filePath = path.join(process.cwd(), 'uploads', document.name);

      try {
        await fs.access(filePath);
      } catch {
        return reply.code(404).send({
          success: false,
          error: 'Arquivo não encontrado no servidor',
        });
      }

      // Log audit event
      logAuditEvent({
        userId,
        action: 'DOWNLOAD_DOCUMENT',
        resource: 'document',
        resourceId: id,
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
      });

      return reply
        .header('Content-Disposition', `attachment; filename="${document.originalName}"`)
        .header('Content-Type', document.mimeType)
        .sendFile(document.name);
    } catch (error) {
      logger.error('Download document error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });

  // Delete document
  server.delete('/:id', {
    preHandler: [server.authenticate],
    schema: {
      tags: ['documents'],
      summary: 'Delete document',
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
      const [document] = await db
        .select()
        .from(documents)
        .where(eq(documents.id, id))
        .limit(1);

      if (!document) {
        return reply.code(404).send({
          success: false,
          error: 'Documento não encontrado',
        });
      }

      // Check permissions
      if (userRole === 'citizen' && document.uploadedBy !== userId) {
        return reply.code(403).send({
          success: false,
          error: 'Acesso negado',
        });
      }

      // Delete from database
      await db.delete(documents).where(eq(documents.id, id));

      // Delete file from disk
      const filePath = path.join(process.cwd(), 'uploads', document.name);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        logger.warn('Failed to delete file from disk:', error);
      }

      // Log audit event
      logAuditEvent({
        userId,
        action: 'DELETE_DOCUMENT',
        resource: 'document',
        resourceId: id,
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
        metadata: { filename: document.originalName },
      });

      return reply.send({
        success: true,
        message: 'Documento excluído com sucesso',
      });
    } catch (error) {
      logger.error('Delete document error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Erro interno do servidor',
      });
    }
  });
}