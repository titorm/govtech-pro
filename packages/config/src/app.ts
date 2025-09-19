import { env } from "./env";

export const appConfig = {
  name: "GovTech Pro",
  version: "1.0.0",
  description: "SaaS para Modernização da Gestão Pública",
  environment: env.NODE_ENV,
  port: env.PORT,

  // URLs
  urls: {
    web:
      env.NODE_ENV === "production"
        ? "https://portal.govtech-pro.com.br"
        : "http://localhost:3000",
    admin:
      env.NODE_ENV === "production"
        ? "https://admin.govtech-pro.com.br"
        : "http://localhost:3001",
    api:
      env.NODE_ENV === "production"
        ? "https://api.govtech-pro.com.br"
        : "http://localhost:3002",
  },

  // CORS
  cors: {
    origin:
      env.NODE_ENV === "production"
        ? [
            "https://portal.govtech-pro.com.br",
            "https://admin.govtech-pro.com.br",
          ]
        : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  },

  // Rate limiting
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    message: "Muitas tentativas. Tente novamente em alguns minutos.",
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Pagination
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
    defaultPage: 1,
  },

  // File upload
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 10,
    allowedMimeTypes: [
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
  },

  // Cache
  cache: {
    ttl: {
      short: 5 * 60, // 5 minutes
      medium: 30 * 60, // 30 minutes
      long: 60 * 60, // 1 hour
      veryLong: 24 * 60 * 60, // 24 hours
    },
    redis: {
      url: env.REDIS_URL,
      keyPrefix: "govtech-pro:",
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
    },
  },

  // Logging
  logging: {
    level: env.NODE_ENV === "production" ? "info" : "debug",
    format: env.NODE_ENV === "production" ? "json" : "pretty",
    file: {
      enabled: env.NODE_ENV === "production",
      filename: "logs/app.log",
      maxSize: "10m",
      maxFiles: "14d",
    },
  },

  // Security
  security: {
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
          ],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", "https://api.govtech-pro.com.br"],
        },
      },
      crossOriginEmbedderPolicy: false,
    },
    bcrypt: {
      saltRounds: 12,
    },
    session: {
      secret: env.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    },
  },

  // Monitoring
  monitoring: {
    sentry: {
      dsn: env.SENTRY_DSN,
      environment: env.NODE_ENV,
      tracesSampleRate: env.NODE_ENV === "production" ? 0.1 : 1.0,
    },
    healthCheck: {
      path: "/health",
      interval: 30000, // 30 seconds
    },
  },

  // Features flags
  features: {
    govBrIntegration: true,
    icpBrasilIntegration: true,
    whatsappIntegration: true,
    aiProcessing: true,
    transparencyPortal: true,
    tcuReporting: true,
    lgpdCompliance: true,
    multiTenant: false, // Future feature
    mobileApp: false, // Future feature
  },

  // Business rules
  business: {
    protocolExpiration: 365, // days
    documentRetention: 7 * 365, // 7 years in days
    maxProtocolsPerUser: 100,
    maxDocumentsPerProtocol: 20,
    workingHours: {
      start: "08:00",
      end: "17:00",
      timezone: "America/Sao_Paulo",
    },
    sla: {
      response: 24, // hours
      resolution: 72, // hours
      urgent: 4, // hours
    },
  },
} as const;

export type AppConfig = typeof appConfig;
