import { z } from "zod";
import { BaseEntity } from "./common";

// Citizen Profile
export interface CitizenProfile extends BaseEntity {
  userId: string;
  cpf: string;
  rg?: string;
  birthDate?: Date;
  address?: Address;
  occupation?: string;
  maritalStatus?: MaritalStatus;
  education?: EducationLevel;
  monthlyIncome?: number;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export enum MaritalStatus {
  SINGLE = "single",
  MARRIED = "married",
  DIVORCED = "divorced",
  WIDOWED = "widowed",
  SEPARATED = "separated",
}

export enum EducationLevel {
  ELEMENTARY_INCOMPLETE = "elementary_incomplete",
  ELEMENTARY_COMPLETE = "elementary_complete",
  HIGH_SCHOOL_INCOMPLETE = "high_school_incomplete",
  HIGH_SCHOOL_COMPLETE = "high_school_complete",
  COLLEGE_INCOMPLETE = "college_incomplete",
  COLLEGE_COMPLETE = "college_complete",
  POSTGRADUATE = "postgraduate",
  MASTERS = "masters",
  DOCTORATE = "doctorate",
}

// Service Request
export interface ServiceRequest extends BaseEntity {
  citizenId: string;
  serviceId: string;
  protocolNumber: string;
  title: string;
  description: string;
  status: ServiceStatus;
  priority: ServicePriority;
  category: ServiceCategory;
  documents: Document[];
  responses: ServiceResponse[];
  assignedTo?: string;
  estimatedCompletionDate?: Date;
  completedAt?: Date;
  satisfactionRating?: number;
  satisfactionComment?: string;
}

export enum ServiceStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  IN_ANALYSIS = "in_analysis",
  PENDING_DOCUMENTS = "pending_documents",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

export enum ServicePriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  URGENT = "urgent",
}

export enum ServiceCategory {
  LICENSING = "licensing",
  PERMITS = "permits",
  CERTIFICATES = "certificates",
  COMPLAINTS = "complaints",
  REQUESTS = "requests",
  TAXES = "taxes",
  SOCIAL_SERVICES = "social_services",
  HEALTH = "health",
  EDUCATION = "education",
  INFRASTRUCTURE = "infrastructure",
}

export interface Document extends BaseEntity {
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  hash: string;
  isRequired: boolean;
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
}

export interface ServiceResponse extends BaseEntity {
  serviceRequestId: string;
  userId: string;
  message: string;
  isPublic: boolean;
  documents: Document[];
}

// Validation schemas
export const AddressSchema = z.object({
  street: z.string().min(1, "Logradouro é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 caracteres"),
  zipCode: z.string().regex(/^\d{8}$/, "CEP deve ter 8 dígitos"),
  country: z.string().default("Brasil"),
});

export const ServiceRequestSchema = z.object({
  serviceId: z.string().uuid("ID do serviço inválido"),
  title: z.string().min(5, "Título deve ter pelo menos 5 caracteres"),
  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  category: z.nativeEnum(ServiceCategory),
  priority: z.nativeEnum(ServicePriority).default(ServicePriority.NORMAL),
  documents: z.array(z.string()).optional(),
});

export const ServiceResponseSchema = z.object({
  message: z.string().min(1, "Mensagem é obrigatória"),
  isPublic: z.boolean().default(true),
  documents: z.array(z.string()).optional(),
});

export type ServiceRequestInput = z.infer<typeof ServiceRequestSchema>;
export type ServiceResponseInput = z.infer<typeof ServiceResponseSchema>;
