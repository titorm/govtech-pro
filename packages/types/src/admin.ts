import { z } from "zod";
import { BaseEntity } from "./common";

// Department Management
export interface Department extends BaseEntity {
  name: string;
  description?: string;
  code: string;
  parentId?: string;
  managerId?: string;
  isActive: boolean;
  contactEmail?: string;
  contactPhone?: string;
  workingHours?: WorkingHours;
}

export interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime?: string; // HH:mm format
  closeTime?: string; // HH:mm format
  breakStart?: string;
  breakEnd?: string;
}

// Service Management
export interface Service extends BaseEntity {
  name: string;
  description: string;
  code: string;
  categoryId: string;
  departmentId: string;
  isActive: boolean;
  isOnline: boolean;
  estimatedDuration?: number; // in minutes
  requiredDocuments: RequiredDocument[];
  workflow: ServiceWorkflowTemplate[];
  fees?: ServiceFee[];
  metadata: Record<string, any>;
}

export interface RequiredDocument {
  id: string;
  name: string;
  description?: string;
  isRequired: boolean;
  acceptedFormats: string[];
  maxSize: number; // in bytes
}

export interface ServiceWorkflowTemplate {
  stepNumber: number;
  name: string;
  description?: string;
  departmentId?: string;
  estimatedDuration?: number;
  isAutomated: boolean;
  requiredRole?: string;
}

export interface ServiceFee {
  name: string;
  amount: number;
  currency: string;
  isRequired: boolean;
  description?: string;
}

// Category Management
export interface Category extends BaseEntity {
  name: string;
  description?: string;
  code: string;
  parentId?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  sortOrder: number;
}

// Analytics and Reports
export interface DashboardMetrics {
  totalProtocols: number;
  protocolsByStatus: Record<string, number>;
  protocolsByPriority: Record<string, number>;
  protocolsByCategory: Record<string, number>;
  averageResolutionTime: number;
  satisfactionRating: number;
  activeUsers: number;
  newUsersThisMonth: number;
  topServices: ServiceMetric[];
  departmentPerformance: DepartmentMetric[];
}

export interface ServiceMetric {
  serviceId: string;
  serviceName: string;
  requestCount: number;
  averageResolutionTime: number;
  satisfactionRating: number;
}

export interface DepartmentMetric {
  departmentId: string;
  departmentName: string;
  protocolCount: number;
  averageResolutionTime: number;
  onTimeCompletion: number;
}

// Transparency Portal
export interface TransparencyData {
  budgetExecution: BudgetExecution[];
  publicContracts: PublicContract[];
  publicEmployees: PublicEmployee[];
  publicExpenses: PublicExpense[];
  laws: PublicLaw[];
}

export interface BudgetExecution {
  year: number;
  department: string;
  budgeted: number;
  executed: number;
  percentage: number;
  category: string;
}

export interface PublicContract {
  id: string;
  number: string;
  supplier: string;
  object: string;
  value: number;
  startDate: Date;
  endDate: Date;
  status: string;
}

export interface PublicEmployee {
  name: string;
  position: string;
  department: string;
  salary: number;
  benefits: number;
  total: number;
}

export interface PublicExpense {
  date: Date;
  description: string;
  supplier: string;
  value: number;
  category: string;
  department: string;
}

export interface PublicLaw {
  number: string;
  title: string;
  description: string;
  publishedAt: Date;
  type: string;
  url?: string;
}

// Validation schemas
export const CreateDepartmentSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  code: z.string().min(2, "Código deve ter pelo menos 2 caracteres"),
  parentId: z.string().uuid().optional(),
  managerId: z.string().uuid().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
});

export const CreateServiceSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  code: z.string().min(2, "Código deve ter pelo menos 2 caracteres"),
  categoryId: z.string().uuid("ID da categoria inválido"),
  departmentId: z.string().uuid("ID do departamento inválido"),
  isOnline: z.boolean().default(true),
  estimatedDuration: z.number().positive().optional(),
  requiredDocuments: z
    .array(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        isRequired: z.boolean().default(true),
        acceptedFormats: z.array(z.string()),
        maxSize: z.number().positive(),
      })
    )
    .optional(),
});

export const CreateCategorySchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  code: z.string().min(2, "Código deve ter pelo menos 2 caracteres"),
  parentId: z.string().uuid().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  sortOrder: z.number().default(0),
});

export type CreateDepartmentInput = z.infer<typeof CreateDepartmentSchema>;
export type CreateServiceInput = z.infer<typeof CreateServiceSchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
