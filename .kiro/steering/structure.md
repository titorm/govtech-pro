# Project Structure

## Monorepo Organization

The project follows a standard monorepo structure with clear separation between applications and shared packages:

```
govtech-pro/
├── apps/                   # Application layer
│   ├── web/               # Citizen portal (React + Vite)
│   ├── admin/             # Admin dashboard (React + Vite)
│   └── api/               # Backend API (Node.js + Fastify)
├── packages/              # Shared packages
│   ├── ui/                # Reusable UI components
│   ├── types/             # Shared TypeScript types
│   ├── config/            # Shared configurations
│   └── utils/             # Common utilities
├── docs/                  # Documentation
└── scripts/               # Build and deployment scripts
```

## Application Structure

### API (`apps/api/`)
```
src/
├── db/                    # Database layer
│   ├── schema/           # Drizzle schema definitions
│   ├── connection.ts     # Database connection
│   ├── migrate.ts        # Migration runner
│   └── seed.ts           # Database seeding
├── routes/               # API route handlers
├── plugins/              # Fastify plugins
├── lib/                  # Utilities and helpers
└── index.ts              # Application entry point
```

### Frontend Apps (`apps/web/` & `apps/admin/`)
```
src/
├── components/           # Reusable components
├── pages/               # Page components
│   └── auth/           # Authentication pages
├── routes/             # Route definitions (TanStack Router)
├── lib/                # App-specific utilities
│   ├── api.ts         # API client configuration
│   └── auth.tsx       # Authentication logic
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Shared Packages Structure

### UI Package (`packages/ui/`)
```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── StatusBadge.tsx
├── styles/             # Shared styles
└── index.ts            # Package exports
```

### Types Package (`packages/types/`)
```
src/
├── auth.ts             # Authentication types
├── protocol.ts         # Protocol/document types
├── admin.ts            # Admin-specific types
├── citizen.ts          # Citizen-specific types
├── common.ts           # Common/shared types
├── integrations.ts     # External integration types
└── index.ts            # Package exports
```

### Config Package (`packages/config/`)
```
src/
├── app.ts              # Application configuration
├── auth.ts             # Authentication configuration
├── database.ts         # Database configuration
├── env.ts              # Environment variables
├── integrations.ts     # External service configs
└── index.ts            # Package exports
```

### Utils Package (`packages/utils/`)
```
src/
├── constants.ts        # Application constants
├── cpf.ts             # CPF validation utilities
├── crypto.ts          # Cryptographic utilities
├── date.ts            # Date formatting utilities
├── format.ts          # General formatting utilities
├── protocol.ts        # Protocol-specific utilities
├── validation.ts      # Validation schemas
└── index.ts           # Package exports
```

## Naming Conventions

- **Packages**: Scoped with `@govtech-pro/` prefix
- **Components**: PascalCase (e.g., `AdminHeader.tsx`)
- **Files**: camelCase for utilities, PascalCase for components
- **Directories**: kebab-case for multi-word names
- **Database**: snake_case for tables and columns
- **API Routes**: kebab-case URLs (e.g., `/api/user-protocols`)

## Import Patterns

- Use workspace references for internal packages: `@govtech-pro/types`
- Absolute imports within apps using TypeScript path mapping
- Group imports: external → internal → relative
- Alphabetical ordering within groups

## File Organization Rules

- Keep related functionality together (colocation)
- Separate concerns: components, utilities, types, styles
- Use index files for clean package exports
- Place tests adjacent to source files (`*.test.ts`)
- Configuration files at package/app root level