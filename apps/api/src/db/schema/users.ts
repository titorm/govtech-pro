import { pgTable, uuid, varchar, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['citizen', 'admin', 'manager', 'operator']);
export const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'suspended', 'pending_verification']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  cpf: varchar('cpf', { length: 11 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 15 }),
  passwordHash: text('password_hash'),
  govBrId: varchar('gov_br_id', { length: 255 }),
  role: userRoleEnum('role').notNull().default('citizen'),
  status: userStatusEnum('status').notNull().default('active'),
  emailVerifiedAt: timestamp('email_verified_at'),
  phoneVerifiedAt: timestamp('phone_verified_at'),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Citizen profiles table
export const citizenProfiles = pgTable('citizen_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rg: varchar('rg', { length: 20 }),
  birthDate: timestamp('birth_date'),
  occupation: varchar('occupation', { length: 255 }),
  maritalStatus: varchar('marital_status', { length: 50 }),
  education: varchar('education', { length: 50 }),
  monthlyIncome: varchar('monthly_income', { length: 50 }),
  // Address fields
  street: varchar('street', { length: 255 }),
  number: varchar('number', { length: 20 }),
  complement: varchar('complement', { length: 255 }),
  neighborhood: varchar('neighborhood', { length: 255 }),
  city: varchar('city', { length: 255 }),
  state: varchar('state', { length: 2 }),
  zipCode: varchar('zip_code', { length: 8 }),
  country: varchar('country', { length: 255 }).default('Brasil'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ICP-Brasil certificates table
export const icpCertificates = pgTable('icp_certificates', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  serialNumber: varchar('serial_number', { length: 255 }).notNull(),
  issuer: text('issuer').notNull(),
  subject: text('subject').notNull(),
  validFrom: timestamp('valid_from').notNull(),
  validTo: timestamp('valid_to').notNull(),
  fingerprint: varchar('fingerprint', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('valid'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(citizenProfiles, {
    fields: [users.id],
    references: [citizenProfiles.userId],
  }),
  certificates: many(icpCertificates),
}));

export const citizenProfilesRelations = relations(citizenProfiles, ({ one }) => ({
  user: one(users, {
    fields: [citizenProfiles.userId],
    references: [users.id],
  }),
}));

export const icpCertificatesRelations = relations(icpCertificates, ({ one }) => ({
  user: one(users, {
    fields: [icpCertificates.userId],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertCitizenProfileSchema = createInsertSchema(citizenProfiles);
export const selectCitizenProfileSchema = createSelectSchema(citizenProfiles);
export const insertIcpCertificateSchema = createInsertSchema(icpCertificates);
export const selectIcpCertificateSchema = createSelectSchema(icpCertificates);