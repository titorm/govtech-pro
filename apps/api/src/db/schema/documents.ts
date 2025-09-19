import { pgTable, uuid, varchar, text, timestamp, boolean, integer, json } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { protocols } from './protocols';

// Documents table
export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: integer('size').notNull(),
  url: text('url').notNull(),
  hash: varchar('hash', { length: 64 }).notNull(),
  ocrText: text('ocr_text'),
  isOriginal: boolean('is_original').notNull().default(true),
  isPublic: boolean('is_public').notNull().default(false),
  uploadedBy: uuid('uploaded_by').notNull().references(() => users.id),
  protocolId: uuid('protocol_id').references(() => protocols.id),
  isRequired: boolean('is_required').notNull().default(false),
  isVerified: boolean('is_verified').notNull().default(false),
  verifiedAt: timestamp('verified_at'),
  verifiedBy: uuid('verified_by').references(() => users.id),
  digitalSignature: json('digital_signature').$type<{
    certificateId: string;
    signedAt: string;
    signedBy: string;
    algorithm: string;
    hash: string;
    isValid: boolean;
    validatedAt?: string;
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Document versions table (for version control)
export const documentVersions = pgTable('document_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  documentId: uuid('document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),
  version: integer('version').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  url: text('url').notNull(),
  hash: varchar('hash', { length: 64 }).notNull(),
  size: integer('size').notNull(),
  uploadedBy: uuid('uploaded_by').notNull().references(() => users.id),
  changes: text('changes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Relations
export const documentsRelations = relations(documents, ({ one, many }) => ({
  uploader: one(users, {
    fields: [documents.uploadedBy],
    references: [users.id],
  }),
  verifier: one(users, {
    fields: [documents.verifiedBy],
    references: [users.id],
  }),
  protocol: one(protocols, {
    fields: [documents.protocolId],
    references: [protocols.id],
  }),
  versions: many(documentVersions),
}));

export const documentVersionsRelations = relations(documentVersions, ({ one }) => ({
  document: one(documents, {
    fields: [documentVersions.documentId],
    references: [documents.id],
  }),
  uploader: one(users, {
    fields: [documentVersions.uploadedBy],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertDocumentSchema = createInsertSchema(documents);
export const selectDocumentSchema = createSelectSchema(documents);
export const insertDocumentVersionSchema = createInsertSchema(documentVersions);
export const selectDocumentVersionSchema = createSelectSchema(documentVersions);