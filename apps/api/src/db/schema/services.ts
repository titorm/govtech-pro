import { pgTable, uuid, varchar, text, timestamp, boolean, integer, json, decimal } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { categories } from './categories';
import { departments } from './departments';

// Services table
export const services = pgTable('services', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  categoryId: uuid('category_id').notNull().references(() => categories.id),
  departmentId: uuid('department_id').notNull().references(() => departments.id),
  isActive: boolean('is_active').notNull().default(true),
  isOnline: boolean('is_online').notNull().default(true),
  estimatedDuration: integer('estimated_duration'), // in minutes
  requiredDocuments: json('required_documents').$type<Array<{
    id: string;
    name: string;
    description?: string;
    isRequired: boolean;
    acceptedFormats: string[];
    maxSize: number;
  }>>().default([]),
  workflow: json('workflow').$type<Array<{
    stepNumber: number;
    name: string;
    description?: string;
    departmentId?: string;
    estimatedDuration?: number;
    isAutomated: boolean;
    requiredRole?: string;
  }>>().default([]),
  fees: json('fees').$type<Array<{
    name: string;
    amount: number;
    currency: string;
    isRequired: boolean;
    description?: string;
  }>>().default([]),
  metadata: json('metadata').$type<Record<string, any>>().default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Service requests table
export const serviceRequests = pgTable('service_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  citizenId: uuid('citizen_id').notNull(),
  serviceId: uuid('service_id').notNull().references(() => services.id),
  protocolNumber: varchar('protocol_number', { length: 20 }).notNull().unique(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('draft'),
  priority: varchar('priority', { length: 50 }).notNull().default('normal'),
  category: varchar('category', { length: 100 }).notNull(),
  documents: json('documents').$type<string[]>().default([]),
  responses: json('responses').$type<Array<{
    id: string;
    userId: string;
    message: string;
    isPublic: boolean;
    documents: string[];
    createdAt: string;
  }>>().default([]),
  assignedTo: uuid('assigned_to'),
  estimatedCompletionDate: timestamp('estimated_completion_date'),
  completedAt: timestamp('completed_at'),
  satisfactionRating: integer('satisfaction_rating'),
  satisfactionComment: text('satisfaction_comment'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relations
export const servicesRelations = relations(services, ({ one, many }) => ({
  category: one(categories, {
    fields: [services.categoryId],
    references: [categories.id],
  }),
  department: one(departments, {
    fields: [services.departmentId],
    references: [departments.id],
  }),
  requests: many(serviceRequests),
}));

export const serviceRequestsRelations = relations(serviceRequests, ({ one }) => ({
  service: one(services, {
    fields: [serviceRequests.serviceId],
    references: [services.id],
  }),
}));

// Zod schemas
export const insertServiceSchema = createInsertSchema(services);
export const selectServiceSchema = createSelectSchema(services);
export const insertServiceRequestSchema = createInsertSchema(serviceRequests);
export const selectServiceRequestSchema = createSelectSchema(serviceRequests);