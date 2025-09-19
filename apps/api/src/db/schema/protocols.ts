import { pgTable, uuid, varchar, text, timestamp, integer, json, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { departments } from './departments';
import { categories } from './categories';

// Enums
export const protocolTypeEnum = pgEnum('protocol_type', [
  'request', 'complaint', 'suggestion', 'information', 'appeal', 'internal'
]);

export const protocolStatusEnum = pgEnum('protocol_status', [
  'received', 'in_analysis', 'pending_info', 'in_progress', 'forwarded', 'resolved', 'closed', 'cancelled'
]);

export const protocolPriorityEnum = pgEnum('protocol_priority', [
  'low', 'normal', 'high', 'urgent', 'critical'
]);

export const requesterTypeEnum = pgEnum('requester_type', [
  'citizen', 'company', 'government', 'anonymous'
]);

export const workflowStepStatusEnum = pgEnum('workflow_step_status', [
  'pending', 'in_progress', 'completed', 'skipped', 'failed'
]);

// Protocols table
export const protocols = pgTable('protocols', {
  id: uuid('id').primaryKey().defaultRandom(),
  number: varchar('number', { length: 20 }).notNull().unique(),
  type: protocolTypeEnum('type').notNull(),
  status: protocolStatusEnum('status').notNull().default('received'),
  priority: protocolPriorityEnum('priority').notNull().default('normal'),
  subject: varchar('subject', { length: 500 }).notNull(),
  description: text('description').notNull(),
  requesterType: requesterTypeEnum('requester_type').notNull(),
  requesterId: uuid('requester_id').notNull().references(() => users.id),
  assignedTo: uuid('assigned_to').references(() => users.id),
  departmentId: uuid('department_id').notNull().references(() => departments.id),
  categoryId: uuid('category_id').notNull().references(() => categories.id),
  tags: json('tags').$type<string[]>().default([]),
  deadlineAt: timestamp('deadline_at'),
  completedAt: timestamp('completed_at'),
  metadata: json('metadata').$type<Record<string, any>>().default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Workflow steps table
export const workflowSteps = pgTable('workflow_steps', {
  id: uuid('id').primaryKey().defaultRandom(),
  protocolId: uuid('protocol_id').notNull().references(() => protocols.id, { onDelete: 'cascade' }),
  stepNumber: integer('step_number').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  assignedTo: uuid('assigned_to').references(() => users.id),
  departmentId: uuid('department_id').references(() => departments.id),
  status: workflowStepStatusEnum('status').notNull().default('pending'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  deadlineAt: timestamp('deadline_at'),
  comments: text('comments'),
  documents: json('documents').$type<string[]>().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Protocol responses table
export const protocolResponses = pgTable('protocol_responses', {
  id: uuid('id').primaryKey().defaultRandom(),
  protocolId: uuid('protocol_id').notNull().references(() => protocols.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),
  message: text('message').notNull(),
  isPublic: boolean('is_public').notNull().default(true),
  documents: json('documents').$type<string[]>().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// AI processing results table
export const aiProcessingResults = pgTable('ai_processing_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  protocolId: uuid('protocol_id').notNull().references(() => protocols.id, { onDelete: 'cascade' }),
  processedAt: timestamp('processed_at').notNull().defaultNow(),
  classification: json('classification').$type<{
    category: string;
    subcategory?: string;
    confidence: number;
  }>().notNull(),
  priority: json('priority').$type<{
    level: string;
    confidence: number;
    reasoning: string;
  }>().notNull(),
  extractedEntities: json('extracted_entities').$type<Array<{
    type: string;
    value: string;
    confidence: number;
  }>>().default([]),
  suggestedActions: json('suggested_actions').$type<Array<{
    action: string;
    confidence: number;
    reasoning: string;
  }>>().default([]),
  fraudRisk: json('fraud_risk').$type<{
    score: number;
    factors: string[];
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Relations
export const protocolsRelations = relations(protocols, ({ one, many }) => ({
  requester: one(users, {
    fields: [protocols.requesterId],
    references: [users.id],
  }),
  assignee: one(users, {
    fields: [protocols.assignedTo],
    references: [users.id],
  }),
  department: one(departments, {
    fields: [protocols.departmentId],
    references: [departments.id],
  }),
  category: one(categories, {
    fields: [protocols.categoryId],
    references: [categories.id],
  }),
  workflowSteps: many(workflowSteps),
  responses: many(protocolResponses),
  aiProcessing: one(aiProcessingResults),
}));

export const workflowStepsRelations = relations(workflowSteps, ({ one }) => ({
  protocol: one(protocols, {
    fields: [workflowSteps.protocolId],
    references: [protocols.id],
  }),
  assignee: one(users, {
    fields: [workflowSteps.assignedTo],
    references: [users.id],
  }),
  department: one(departments, {
    fields: [workflowSteps.departmentId],
    references: [departments.id],
  }),
}));

export const protocolResponsesRelations = relations(protocolResponses, ({ one }) => ({
  protocol: one(protocols, {
    fields: [protocolResponses.protocolId],
    references: [protocols.id],
  }),
  user: one(users, {
    fields: [protocolResponses.userId],
    references: [users.id],
  }),
}));

export const aiProcessingResultsRelations = relations(aiProcessingResults, ({ one }) => ({
  protocol: one(protocols, {
    fields: [aiProcessingResults.protocolId],
    references: [protocols.id],
  }),
}));

// Zod schemas
export const insertProtocolSchema = createInsertSchema(protocols);
export const selectProtocolSchema = createSelectSchema(protocols);
export const insertWorkflowStepSchema = createInsertSchema(workflowSteps);
export const selectWorkflowStepSchema = createSelectSchema(workflowSteps);
export const insertProtocolResponseSchema = createInsertSchema(protocolResponses);
export const selectProtocolResponseSchema = createSelectSchema(protocolResponses);
export const insertAiProcessingResultSchema = createInsertSchema(aiProcessingResults);
export const selectAiProcessingResultSchema = createSelectSchema(aiProcessingResults);