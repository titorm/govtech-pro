import { env } from "./env";

export const icpBrasilConfig = {
  certificatePath: env.ICP_BRASIL_CERT_PATH,
  certificatePassword: env.ICP_BRASIL_CERT_PASSWORD,
  timestampUrl: env.ICP_BRASIL_TIMESTAMP_URL || "http://timestamp.iti.gov.br",
  crlUrls: [
    "http://acraiz.icpbrasil.gov.br/LCRacraiz.crl",
    "http://www.iti.gov.br/repositorio/84/lcr/ac-iti-v5.crl",
  ],
  trustedCAs: [
    "AC Raiz ICP-Brasil",
    "AC Instituto Nacional de Tecnologia da Informação",
  ],
} as const;

export const whatsappConfig = {
  phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID,
  accessToken: env.WHATSAPP_ACCESS_TOKEN,
  webhookVerifyToken: env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
  businessAccountId: env.WHATSAPP_BUSINESS_ACCOUNT_ID,
  apiVersion: "v18.0",
  baseUrl: "https://graph.facebook.com",
  webhookUrl: "/webhooks/whatsapp",
  templates: {
    protocolCreated: "protocol_created",
    protocolUpdated: "protocol_updated",
    documentRequired: "document_required",
    serviceCompleted: "service_completed",
  },
} as const;

export const emailConfig = {
  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  },
  from: env.SMTP_FROM || "noreply@govtech-pro.com.br",
  templates: {
    welcome: "welcome",
    passwordReset: "password-reset",
    emailVerification: "email-verification",
    protocolCreated: "protocol-created",
    protocolUpdated: "protocol-updated",
  },
} as const;

export const storageConfig = {
  type: env.STORAGE_TYPE,
  local: {
    uploadDir: "./uploads",
    publicDir: "./public/uploads",
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  s3: {
    bucket: env.STORAGE_BUCKET,
    region: env.STORAGE_REGION || "us-east-1",
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    maxFileSize: 100 * 1024 * 1024, // 100MB
  },
  allowedTypes: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/rtf",
  ],
} as const;

export const tcuConfig = {
  entityCode: env.TCU_ENTITY_CODE,
  entityName: env.TCU_ENTITY_NAME,
  contactEmail: env.TCU_CONTACT_EMAIL,
  reportingPeriods: ["monthly", "quarterly", "annual"] as const,
  reportTypes: [
    "budget_execution",
    "public_contracts",
    "personnel_expenses",
    "transparency_portal",
    "internal_controls",
  ] as const,
  deadlines: {
    monthly: 15, // 15th of next month
    quarterly: 30, // 30 days after quarter end
    annual: 90, // 90 days after year end
  },
} as const;

export const transparencyConfig = {
  portalUrl: env.TRANSPARENCY_PORTAL_URL,
  apiKey: env.TRANSPARENCY_API_KEY,
  entityCode: env.TCU_ENTITY_CODE,
  updateFrequency: "daily" as const,
  dataTypes: [
    "budget",
    "expenses",
    "contracts",
    "employees",
    "laws",
    "biddings",
  ] as const,
  retentionPeriod: 5 * 365, // 5 years in days
} as const;

export const lgpdConfig = {
  dpoEmail: env.DPO_EMAIL,
  privacyPolicyUrl: env.PRIVACY_POLICY_URL,
  dataRetentionDays: env.DATA_RETENTION_DAYS,
  anonymizationDelay: 30, // days
  consentRequired: true,
  legalBasis: [
    "consent",
    "contract",
    "legal_obligation",
    "vital_interests",
    "public_task",
    "legitimate_interests",
  ] as const,
  dataSubjectRights: [
    "access",
    "rectification",
    "erasure",
    "portability",
    "restriction",
    "objection",
  ] as const,
  responseDeadline: 15, // days to respond to data subject requests
} as const;

export const aiConfig = {
  openai: {
    apiKey: env.OPENAI_API_KEY,
    model: "gpt-4-turbo-preview",
    maxTokens: 4000,
    temperature: 0.3,
  },
  azure: {
    cognitiveServicesKey: env.AZURE_COGNITIVE_SERVICES_KEY,
    cognitiveServicesEndpoint: env.AZURE_COGNITIVE_SERVICES_ENDPOINT,
    ocrApiVersion: "2023-10-31-preview",
    textAnalyticsApiVersion: "2023-04-01",
  },
  features: {
    ocr: true,
    textClassification: true,
    sentimentAnalysis: true,
    entityExtraction: true,
    fraudDetection: true,
    chatbot: true,
  },
  confidence: {
    minimum: 0.7,
    high: 0.9,
  },
} as const;
