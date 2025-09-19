# Technology Stack

## Build System & Package Management

- **Monorepo**: Turborepo for optimized builds and caching
- **Package Manager**: pnpm (required) - version 8.15.0+
- **Node.js**: Version 18+ required
- **TypeScript**: Strict mode enabled across all packages

## Backend Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Fastify with plugins for CORS, Helmet, Rate Limiting, JWT, Multipart, Swagger
- **Database**: PostgreSQL 14+ with Drizzle ORM
- **Authentication**: JWT with bcryptjs for password hashing
- **File Processing**: Sharp for image processing, Multer for uploads
- **Logging**: Winston for structured logging
- **Validation**: Zod schemas for runtime type checking

## Frontend Stack

- **Framework**: React 18 with TypeScript
- **Routing**: TanStack Router for type-safe routing
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with Headless UI components
- **Icons**: Heroicons and Lucide React
- **Animation**: Framer Motion
- **Notifications**: React Hot Toast

## Shared Packages

- `@govtech-pro/types` - Shared TypeScript types with Zod schemas
- `@govtech-pro/utils` - Common utilities (CPF validation, date formatting, etc.)
- `@govtech-pro/config` - Shared configurations
- `@govtech-pro/ui` - Reusable UI components with Storybook
- `@govtech-pro/eslint-config` - Shared ESLint configuration

## Development Tools

- **Testing**: Vitest for unit/integration tests
- **Linting**: ESLint with TypeScript, React, a11y, and Tailwind rules
- **Formatting**: Prettier (integrated with ESLint)
- **Type Checking**: TypeScript strict mode with project references

## Common Commands

```bash
# Development
pnpm dev                    # Start all apps in development mode
pnpm dev --filter=web      # Start only citizen portal
pnpm dev --filter=admin    # Start only admin dashboard
pnpm dev --filter=api      # Start only API server

# Building
pnpm build                 # Build all packages and apps
pnpm type-check           # Type check all packages

# Database Operations
pnpm db:generate          # Generate Drizzle schemas
pnpm db:migrate           # Run database migrations
pnpm db:seed              # Seed database with initial data

# Code Quality
pnpm lint                 # Lint all packages
pnpm test                 # Run all tests
pnpm clean                # Clean all build artifacts

# Deployment
pnpm deploy:vercel        # Deploy to Vercel (runs build, test, lint first)
```

## Architecture Patterns

- **Workspace References**: TypeScript project references for efficient builds
- **Shared Dependencies**: Common packages referenced via `workspace:*`
- **Type Safety**: End-to-end type safety from database to frontend
- **API-First**: OpenAPI/Swagger documentation for all endpoints
- **Component-Driven**: Storybook for UI component development