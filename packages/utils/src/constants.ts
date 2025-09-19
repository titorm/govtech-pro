/**
 * Constants for GovTech Pro application
 */

// Brazilian States
export const BRAZILIAN_STATES = [
  { code: "AC", name: "Acre" },
  { code: "AL", name: "Alagoas" },
  { code: "AP", name: "Amapá" },
  { code: "AM", name: "Amazonas" },
  { code: "BA", name: "Bahia" },
  { code: "CE", name: "Ceará" },
  { code: "DF", name: "Distrito Federal" },
  { code: "ES", name: "Espírito Santo" },
  { code: "GO", name: "Goiás" },
  { code: "MA", name: "Maranhão" },
  { code: "MT", name: "Mato Grosso" },
  { code: "MS", name: "Mato Grosso do Sul" },
  { code: "MG", name: "Minas Gerais" },
  { code: "PA", name: "Pará" },
  { code: "PB", name: "Paraíba" },
  { code: "PR", name: "Paraná" },
  { code: "PE", name: "Pernambuco" },
  { code: "PI", name: "Piauí" },
  { code: "RJ", name: "Rio de Janeiro" },
  { code: "RN", name: "Rio Grande do Norte" },
  { code: "RS", name: "Rio Grande do Sul" },
  { code: "RO", name: "Rondônia" },
  { code: "RR", name: "Roraima" },
  { code: "SC", name: "Santa Catarina" },
  { code: "SP", name: "São Paulo" },
  { code: "SE", name: "Sergipe" },
  { code: "TO", name: "Tocantins" },
] as const;

// File types
export const ALLOWED_DOCUMENT_TYPES = [
  "pdf",
  "doc",
  "docx",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "txt",
  "rtf",
] as const;

export const ALLOWED_IMAGE_TYPES = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
] as const;

// File size limits (in MB)
export const FILE_SIZE_LIMITS = {
  DOCUMENT: 10,
  IMAGE: 5,
  AVATAR: 2,
} as const;

// Service categories
export const SERVICE_CATEGORIES = [
  { id: "licensing", name: "Licenciamento", icon: "document-check" },
  { id: "permits", name: "Alvarás", icon: "shield-check" },
  { id: "certificates", name: "Certidões", icon: "certificate" },
  { id: "complaints", name: "Reclamações", icon: "exclamation-triangle" },
  { id: "requests", name: "Solicitações", icon: "hand-raised" },
  { id: "taxes", name: "Tributos", icon: "currency-dollar" },
  { id: "social_services", name: "Serviços Sociais", icon: "users" },
  { id: "health", name: "Saúde", icon: "heart" },
  { id: "education", name: "Educação", icon: "academic-cap" },
  { id: "infrastructure", name: "Infraestrutura", icon: "building-office" },
] as const;

// Priority levels
export const PRIORITY_LEVELS = [
  { value: "low", label: "Baixa", color: "green" },
  { value: "normal", label: "Normal", color: "blue" },
  { value: "high", label: "Alta", color: "yellow" },
  { value: "urgent", label: "Urgente", color: "orange" },
  { value: "critical", label: "Crítica", color: "red" },
] as const;

// Status colors
export const STATUS_COLORS = {
  // Protocol statuses
  received: "blue",
  in_analysis: "yellow",
  pending_info: "orange",
  in_progress: "purple",
  forwarded: "indigo",
  resolved: "green",
  closed: "gray",
  cancelled: "red",

  // User statuses
  active: "green",
  inactive: "gray",
  suspended: "red",
  pending_verification: "yellow",
} as const;

// Gov.br scopes
export const GOVBR_SCOPES = [
  "openid",
  "email",
  "phone",
  "profile",
  "govbr_empresa",
  "govbr_confiabilidades",
] as const;

// ICP-Brasil certificate types
export const ICP_CERTIFICATE_TYPES = [
  "A1",
  "A3",
  "S1",
  "S3",
  "T3",
  "T4",
] as const;

// LGPD legal basis
export const LGPD_LEGAL_BASIS = [
  { value: "consent", label: "Consentimento" },
  { value: "contract", label: "Execução de contrato" },
  { value: "legal_obligation", label: "Cumprimento de obrigação legal" },
  { value: "vital_interests", label: "Proteção da vida" },
  { value: "public_task", label: "Exercício regular de direitos" },
  { value: "legitimate_interests", label: "Interesse legítimo" },
] as const;

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Cache TTL (in seconds)
export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

// Rate limiting
export const RATE_LIMITS = {
  API_GENERAL: 100, // requests per minute
  API_AUTH: 10, // requests per minute
  API_UPLOAD: 5, // requests per minute
  WHATSAPP: 50, // messages per hour
} as const;

// Regex patterns
export const REGEX_PATTERNS = {
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  PHONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  CEP: /^\d{5}-\d{3}$/,
  PROTOCOL: /^\d{4}\.\d{6}\.\d{3}$/,
} as const;

// Error codes
export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  DUPLICATE_ENTRY: "DUPLICATE_ENTRY",
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_FILE_TYPE: "INVALID_FILE_TYPE",
} as const;
