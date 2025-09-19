import { env } from "./env";

export const authConfig = {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    algorithm: "HS256" as const,
  },
  refreshToken: {
    secret: env.REFRESH_TOKEN_SECRET,
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  },
  session: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    saltRounds: 12,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5,
    blockDuration: 30 * 60 * 1000, // 30 minutes
  },
} as const;

export const govBrConfig = {
  clientId: env.GOVBR_CLIENT_ID,
  clientSecret: env.GOVBR_CLIENT_SECRET,
  redirectUri: env.GOVBR_REDIRECT_URI,
  environment: env.GOVBR_ENVIRONMENT,
  scopes: [
    "openid",
    "email",
    "phone",
    "profile",
    "govbr_empresa",
    "govbr_confiabilidades",
  ],
  urls: {
    sandbox: {
      authorize: "https://sso.staging.acesso.gov.br/authorize",
      token: "https://sso.staging.acesso.gov.br/token",
      userinfo: "https://sso.staging.acesso.gov.br/userinfo",
    },
    production: {
      authorize: "https://sso.acesso.gov.br/authorize",
      token: "https://sso.acesso.gov.br/token",
      userinfo: "https://sso.acesso.gov.br/userinfo",
    },
  },
} as const;
