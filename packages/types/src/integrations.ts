import { z } from "zod";

// Gov.br Integration
export interface GovBrConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string;
  environment: "sandbox" | "production";
}

export interface GovBrUserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
  email_verified: boolean;
  phone_number?: string;
  phone_number_verified?: boolean;
  cpf: string;
  picture?: string;
}

export interface GovBrTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

// ICP-Brasil Integration
export interface ICPBrasilConfig {
  certificatePath: string;
  certificatePassword: string;
  timestampUrl: string;
  crlUrl: string;
}

export interface ICPBrasilCertificateInfo {
  serialNumber: string;
  issuer: {
    commonName: string;
    organization: string;
    country: string;
  };
  subject: {
    commonName: string;
    organization?: string;
    organizationalUnit?: string;
    country: string;
    cpf?: string;
    cnpj?: string;
  };
  validFrom: Date;
  validTo: Date;
  keyUsage: string[];
  extendedKeyUsage: string[];
  isValid: boolean;
}

export interface DigitalSignatureRequest {
  documentHash: string;
  certificateId: string;
  algorithm: "SHA256withRSA" | "SHA512withRSA";
  includeTimestamp: boolean;
}

export interface DigitalSignatureResponse {
  signature: string;
  certificate: string;
  timestamp?: string;
  signedAt: Date;
  isValid: boolean;
}

// TCU/TCE Integration
export interface TCUReportConfig {
  entityCode: string;
  entityName: string;
  reportingPeriod: "monthly" | "quarterly" | "annual";
  contactEmail: string;
}

export interface TCUReport {
  id: string;
  type: TCUReportType;
  period: string;
  year: number;
  data: Record<string, any>;
  generatedAt: Date;
  submittedAt?: Date;
  status: "draft" | "submitted" | "approved" | "rejected";
}

export enum TCUReportType {
  BUDGET_EXECUTION = "budget_execution",
  PUBLIC_CONTRACTS = "public_contracts",
  PERSONNEL_EXPENSES = "personnel_expenses",
  TRANSPARENCY_PORTAL = "transparency_portal",
  INTERNAL_CONTROLS = "internal_controls",
}

// Portal da Transparência Integration
export interface TransparencyPortalConfig {
  portalUrl: string;
  apiKey: string;
  entityCode: string;
  updateFrequency: "daily" | "weekly" | "monthly";
}

export interface TransparencyDataSync {
  id: string;
  dataType: TransparencyDataType;
  lastSyncAt: Date;
  nextSyncAt: Date;
  status: "pending" | "syncing" | "completed" | "failed";
  recordsCount: number;
  errorMessage?: string;
}

export enum TransparencyDataType {
  BUDGET = "budget",
  EXPENSES = "expenses",
  CONTRACTS = "contracts",
  EMPLOYEES = "employees",
  LAWS = "laws",
  BIDDINGS = "biddings",
}

// LGPD Compliance
export interface LGPDConfig {
  dpoEmail: string;
  privacyPolicyUrl: string;
  dataRetentionPeriod: number; // in days
  anonymizationDelay: number; // in days
  consentRequired: boolean;
}

export interface DataProcessingRecord {
  id: string;
  userId: string;
  dataType: string;
  purpose: string;
  legalBasis: LGPDLegalBasis;
  processingDate: Date;
  retentionUntil: Date;
  consentGiven: boolean;
  consentDate?: Date;
  isAnonymized: boolean;
  anonymizedAt?: Date;
}

export enum LGPDLegalBasis {
  CONSENT = "consent",
  CONTRACT = "contract",
  LEGAL_OBLIGATION = "legal_obligation",
  VITAL_INTERESTS = "vital_interests",
  PUBLIC_TASK = "public_task",
  LEGITIMATE_INTERESTS = "legitimate_interests",
}

export interface DataSubjectRequest {
  id: string;
  userId: string;
  requestType: DataSubjectRequestType;
  description: string;
  status: "pending" | "in_progress" | "completed" | "rejected";
  requestedAt: Date;
  completedAt?: Date;
  response?: string;
}

export enum DataSubjectRequestType {
  ACCESS = "access",
  RECTIFICATION = "rectification",
  ERASURE = "erasure",
  PORTABILITY = "portability",
  RESTRICTION = "restriction",
  OBJECTION = "objection",
}

// WhatsApp Business Integration
export interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  webhookVerifyToken: string;
  businessAccountId: string;
}

export interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  type: "text" | "image" | "document" | "audio" | "video";
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read" | "failed";
  protocolId?: string;
}

export interface WhatsAppTemplate {
  name: string;
  language: string;
  category: "AUTHENTICATION" | "MARKETING" | "UTILITY";
  components: WhatsAppTemplateComponent[];
}

export interface WhatsAppTemplateComponent {
  type: "HEADER" | "BODY" | "FOOTER" | "BUTTONS";
  text?: string;
  parameters?: string[];
}

// Validation schemas
export const DigitalSignatureRequestSchema = z.object({
  documentHash: z.string().min(1, "Hash do documento é obrigatório"),
  certificateId: z.string().uuid("ID do certificado inválido"),
  algorithm: z
    .enum(["SHA256withRSA", "SHA512withRSA"])
    .default("SHA256withRSA"),
  includeTimestamp: z.boolean().default(true),
});

export const DataSubjectRequestSchema = z.object({
  requestType: z.nativeEnum(DataSubjectRequestType),
  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
});

export const WhatsAppMessageSchema = z.object({
  to: z.string().regex(/^\d{10,15}$/, "Número de telefone inválido"),
  type: z.enum(["text", "template"]).default("text"),
  content: z.string().min(1, "Conteúdo da mensagem é obrigatório"),
  templateName: z.string().optional(),
  templateParameters: z.array(z.string()).optional(),
});

export type DigitalSignatureRequestInput = z.infer<
  typeof DigitalSignatureRequestSchema
>;
export type DataSubjectRequestInput = z.infer<typeof DataSubjectRequestSchema>;
export type WhatsAppMessageInput = z.infer<typeof WhatsAppMessageSchema>;
