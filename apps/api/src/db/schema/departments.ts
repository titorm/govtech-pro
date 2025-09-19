import { pgTable, uuid, varchar, text, timestamp, boolean, json } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { users } from './users';

// Departments table
export const departments = pgTable('departments', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  code: varchar('code', { length: 50 }).notNull().unique(),
  parentId: uuid('parent_id'),
  managerId: uuid('manager_id').references(() => users.id),
  isActive: boolean('is_active').notNull().default(true),
  contactEmail: varchar('contact_email', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 20 }),
  workingHours: json('working_hours').$type<{
    monday: { isOpen: boolean; openTime?: string; closeTime?: string; breakStart?: string; breakEnd?: string; };
    tuesday: { isOpen: boolean; openTime?: string; closeTime?: string; breakStart?: string; breakEnd?: string; };
    wednesday: { isOpen: boolean; openTime?: string; closeTime?: string; breakStart?: string; breakEnd?: string; };
    thursday: { isOpen: boolean; openTime?: string; closeTime?: string; breakStart?: string; breakEnd?: string; };
    friday: { isOpen: boolean; openTime?: string; closeTime?: string; breakStart?: string; breakEnd?: string; };
    saturday?: { isOpen: boolean; openTime?: string; closeTime?: string; breakStart?: string; breakEnd?: string; };
    sunday?: { isOpen: boolean; openTime?: string; closeTime?: string; breakStart?: string; breakEnd?: string; };
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relations
export const departmentsRelations = relations(departments, ({ one, many }) => ({
  parent: one(departments, {
    fields: [departments.parentId],
    references: [departments.id],
    relationName: 'parent_department',
  }),
  children: many(departments, {
    relationName: 'parent_department',
  }),
  manager: one(users, {
    fields: [departments.managerId],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertDepartmentSchema = createInsertSchema(departments);
export const selectDepartmentSchema = createSelectSchema(departments);