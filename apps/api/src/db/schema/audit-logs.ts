import { pgTable, uuid, varchar, text, timestamp, json, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { users } from './users';

// Audit logs table
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 100 }).notNull(),
  entityId: uuid('entity_id').notNull(),
  oldData: json('old_data').$type<Record<string, any>>(),
  newData: json('new_data').$type<Record<string, any>>(),
  ipAddress: varchar('ip_address', { length: 45 }).notNull(),
  userAgent: text('user_agent'),
  metadata: json('metadata').$type<Record<string, any>>().default({}),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
});

// LGPD data processing records
export const dataProcessingRecords = pgTable('data_processing_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  dataType: varchar('data_type', { length: 100 }).notNull(),
  purpose: text('purpose').notNull(),
  legalBasis: varchar('legal_basis', { length: 50 }).notNull(),
  processingDate: timestamp('processing_date').notNull().defaultNow(),
  retentionUntil: timestamp('retention_until').notNull(),
  consentGiven: boolean('consent_given').notNull().default(false),
  consentDate: timestamp('consent_date'),
  isAnonymized: boolean('is_anonymized').notNull().default(false),
  anonymizedAt: timestamp('anonymized_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Data subject requests (LGPD)
export const dataSubjectRequests = pgTable('data_subject_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  requestType: varchar('request_type', { length: 50 }).notNull(),
  description: text('description').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  requestedAt: timestamp('requested_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  response: text('response'),
  processedBy: uuid('processed_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relations
export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

export const dataProcessingRecordsRelations = relations(dataProcessingRecords, ({ one }) => ({
  user: one(users, {
    fields: [dataProcessingRecords.userId],
    references: [users.id],
  }),
}));

export const dataSubjectRequestsRelations = relations(dataSubjectRequests, ({ one }) => ({
  user: one(users, {
    fields: [dataSubjectRequests.userId],
    references: [users.id],
  }),
  processor: one(users, {
    fields: [dataSubjectRequests.processedBy],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertAuditLogSchema = createInsertSchema(auditLogs);
export const selectAuditLogSchema = createSelectSchema(auditLogs);
export const insertDataProcessingRecordSchema = createInsertSchema(dataProcessingRecords);
export const selectDataProcessingRecordSchema = createSelectSchema(dataProcessingRecords);
export const insertDataSubjectRequestSchema = createInsertSchema(dataSubjectRequests);
export const selectDataSubjectRequestSchema = createSelectSchema(dataSubjectRequests);