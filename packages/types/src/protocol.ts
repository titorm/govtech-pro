import { z } from "zod";
import { BaseEntity } from "./common";

// Digital Protocol System
export interface Protocol extends BaseEntity {
  number: string;
  type: ProtocolType;
  status: ProtocolStatus;
  priority: ProtocolPriority;
  subject: string;
  description: string;
  requesterType: RequesterType;
  requesterId: string;
  assignedTo?: string;
  departmentId: string;
  categoryId: string;
  tags: string[];
  documents: ProtocolDocument[];
  workflow: WorkflowStep[];
  deadlineAt?: Date;
  completedAt?: Date;
  metadata: Record<string, any>;
}

export enum ProtocolType {
  REQUEST = "request",
  COMPLAINT = "complaint",
  SUGGESTION = "suggestion",
  INFORMATION = "information",
  APPEAL = "appeal",
  INTERNAL = "internal",
}

export enum ProtocolStatus {
  RECEIVED = "received",
  IN_ANALYSIS = "in_analysis",
  PENDING_INFO = "pending_info",
  IN_PROGRESS = "in_progress",
  FORWARDED = "forwarded",
  RESOLVED = "resolved",
  CLOSED = "closed",
  CANCELLED = "cancelled",
}

export enum ProtocolPriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  URGENT = "urgent",
  CRITICAL = "critical",
}

export enum RequesterType {
  CITIZEN = "citizen",
  COMPANY = "company",
  GOVERNMENT = "government",
  ANONYMOUS = "anonymous",
}

export interface ProtocolDocument extends BaseEntity {
  protocolId: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  hash: string;
  ocrText?: string;
  isOriginal: boolean;
  isPublic: boolean;
  digitalSignature?: DigitalSignature;
}

export interface DigitalSignature {
  certificateId: string;
  signedAt: Date;
  signedBy: string;
  algorithm: string;
  hash: string;
  isValid: boolean;
  validatedAt?: Date;
}

export interface WorkflowStep extends BaseEntity {
  protocolId: string;
  stepNumber: number;
  name: string;
  description?: string;
  assignedTo?: string;
  departmentId?: string;
  status: WorkflowStepStatus;
  startedAt?: Date;
  completedAt?: Date;
  deadlineAt?: Date;
  comments?: string;
  documents: string[];
}

export enum WorkflowStepStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  SKIPPED = "skipped",
  FAILED = "failed",
}

// AI Processing
export interface AIProcessingResult {
  protocolId: string;
  processedAt: Date;
  classification: {
    category: string;
    subcategory?: string;
    confidence: number;
  };
  priority: {
    level: ProtocolPriority;
    confidence: number;
    reasoning: string;
  };
  extractedEntities: {
    type: string;
    value: string;
    confidence: number;
  }[];
  suggestedActions: {
    action: string;
    confidence: number;
    reasoning: string;
  }[];
  fraudRisk?: {
    score: number;
    factors: string[];
  };
}

// Validation schemas
export const CreateProtocolSchema = z.object({
  type: z.nativeEnum(ProtocolType),
  subject: z.string().min(5, "Assunto deve ter pelo menos 5 caracteres"),
  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  requesterType: z.nativeEnum(RequesterType),
  categoryId: z.string().uuid("ID da categoria inválido"),
  priority: z.nativeEnum(ProtocolPriority).default(ProtocolPriority.NORMAL),
  tags: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

export const UpdateProtocolSchema = z.object({
  status: z.nativeEnum(ProtocolStatus).optional(),
  priority: z.nativeEnum(ProtocolPriority).optional(),
  assignedTo: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  deadlineAt: z.string().datetime().optional(),
});

export const AddWorkflowStepSchema = z.object({
  name: z.string().min(1, "Nome da etapa é obrigatório"),
  description: z.string().optional(),
  assignedTo: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
  deadlineAt: z.string().datetime().optional(),
});

export type CreateProtocolInput = z.infer<typeof CreateProtocolSchema>;
export type UpdateProtocolInput = z.infer<typeof UpdateProtocolSchema>;
export type AddWorkflowStepInput = z.infer<typeof AddWorkflowStepSchema>;
