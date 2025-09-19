import { z } from "zod";

// Environment validation schema
export const envSchema = z.object({
  // App
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.string().transform(Number).default("3000"),

  // Database
  DATABASE_URL: z.string().url(),

  // Auth
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("7d"),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("30d"),

  // Gov.br
  GOVBR_CLIENT_ID: z.string(),
  GOVBR_CLIENT_SECRET: z.string(),
  GOVBR_REDIRECT_URI: z.string().url(),
  GOVBR_ENVIRONMENT: z.enum(["sandbox", "production"]).default("sandbox"),

  // ICP-Brasil
  ICP_BRASIL_CERT_PATH: z.string().optional(),
  ICP_BRASIL_CERT_PASSWORD: z.string().optional(),
  ICP_BRASIL_TIMESTAMP_URL: z.string().url().optional(),

  // File Storage
  STORAGE_TYPE: z.enum(["local", "s3", "gcs"]).default("local"),
  STORAGE_BUCKET: z.string().optional(),
  STORAGE_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),

  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),

  // WhatsApp Business
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_ACCESS_TOKEN: z.string().optional(),
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: z.string().optional(),
  WHATSAPP_BUSINESS_ACCOUNT_ID: z.string().optional(),

  // Redis (for caching and sessions)
  REDIS_URL: z.string().url().optional(),

  // Monitoring
  SENTRY_DSN: z.string().url().optional(),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default("60000"), // 1 minute
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default("100"),

  // LGPD
  DPO_EMAIL: z.string().email().optional(),
  PRIVACY_POLICY_URL: z.string().url().optional(),
  DATA_RETENTION_DAYS: z.string().transform(Number).default("2555"), // 7 years

  // TCU/TCE
  TCU_ENTITY_CODE: z.string().optional(),
  TCU_ENTITY_NAME: z.string().optional(),
  TCU_CONTACT_EMAIL: z.string().email().optional(),

  // Transparency Portal
  TRANSPARENCY_PORTAL_URL: z.string().url().optional(),
  TRANSPARENCY_API_KEY: z.string().optional(),

  // AI Services
  OPENAI_API_KEY: z.string().optional(),
  AZURE_COGNITIVE_SERVICES_KEY: z.string().optional(),
  AZURE_COGNITIVE_SERVICES_ENDPOINT: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Invalid environment variables:", error);
    process.exit(1);
  }
}

export const env = validateEnv();
