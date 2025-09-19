import { z } from "zod";
import { BaseEntity } from "./common";

// User types
export interface User extends BaseEntity {
  cpf: string;
  name: string;
  email: string;
  phone?: string;
  govBrId?: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: Date;
  emailVerifiedAt?: Date;
  phoneVerifiedAt?: Date;
}

export enum UserRole {
  CITIZEN = "citizen",
  ADMIN = "admin",
  MANAGER = "manager",
  OPERATOR = "operator",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  PENDING_VERIFICATION = "pending_verification",
}

// Authentication
export interface AuthSession {
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  govBrSession?: GovBrSession;
}

export interface GovBrSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  scope: string;
  tokenType: string;
}

// ICP-Brasil Certificate
export interface ICPBrasilCertificate {
  id: string;
  userId: string;
  serialNumber: string;
  issuer: string;
  subject: string;
  validFrom: Date;
  validTo: Date;
  fingerprint: string;
  status: CertificateStatus;
}

export enum CertificateStatus {
  VALID = "valid",
  EXPIRED = "expired",
  REVOKED = "revoked",
  SUSPENDED = "suspended",
}

// Validation schemas
export const LoginSchema = z.object({
  cpf: z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

export const RegisterSchema = z.object({
  cpf: z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .regex(/^\d{10,11}$/, "Telefone inválido")
    .optional(),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

export const GovBrCallbackSchema = z.object({
  code: z.string(),
  state: z.string(),
});

export type LoginRequest = z.infer<typeof LoginSchema>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;
export type GovBrCallback = z.infer<typeof GovBrCallbackSchema>;
