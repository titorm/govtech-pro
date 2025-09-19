# GovTech Pro API

Backend API construída com Node.js + Fastify + PostgreSQL + Drizzle ORM.

## 🚀 Quick Start

```bash
# Instalar dependências
pnpm install

# Configurar ambiente
cp ../../.env.example .env
# Editar .env com suas configurações

# Inicializar banco de dados
pnpm run db:generate
pnpm run db:migrate
pnpm run db:seed

# Iniciar desenvolvimento
pnpm run dev
```

## 📚 Documentação da API

Após iniciar o servidor, acesse:
- **Swagger UI**: http://localhost:3002/docs
- **Health Check**: http://localhost:3002/health

## 🗄️ Banco de Dados

### Schema Principal
- **users**: Usuários do sistema (cidadãos, admins, operadores)
- **citizen_profiles**: Perfis detalhados dos cidadãos
- **protocols**: Protocolos digitais (core do sistema)
- **workflow_steps**: Etapas do fluxo de trabalho
- **protocol_responses**: Respostas aos protocolos
- **services**: Catálogo de serviços públicos
- **departments**: Departamentos da prefeitura
- **categories**: Categorias de serviços
- **documents**: Documentos anexados
- **sessions**: Sessões de usuário
- **audit_logs**: Logs de auditoria (compliance)

### Comandos Úteis
```bash
# Gerar nova migração
pnpm run db:generate

# Executar migrações
pnpm run db:migrate

# Popular dados de teste
pnpm run db:seed

# Abrir Drizzle Studio
pnpm run db:studio
```

## 🔐 Autenticação

### JWT Tokens
- **Access Token**: 7 dias de validade
- **Refresh Token**: 30 dias de validade
- **Header**: `Authorization: Bearer <token>`

### Roles
- **citizen**: Cidadão comum
- **operator**: Operador de serviços
- **admin**: Administrador
- **manager**: Gestor público

## 📋 Endpoints Principais

### Autenticação
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Registro
- `POST /api/v1/auth/refresh` - Renovar token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Dados do usuário

### Protocolos
- `POST /api/v1/protocols` - Criar protocolo
- `GET /api/v1/protocols` - Listar protocolos
- `GET /api/v1/protocols/:id` - Detalhes do protocolo
- `PUT /api/v1/protocols/:id` - Atualizar protocolo (admin)
- `POST /api/v1/protocols/:id/responses` - Adicionar resposta
- `GET /api/v1/protocols/track/:number` - Rastrear protocolo (público)

### Serviços
- `GET /api/v1/services` - Listar serviços
- `GET /api/v1/services/:id` - Detalhes do serviço
- `GET /api/v1/services/categories` - Listar categorias
- `GET /api/v1/services/departments` - Listar departamentos

### Documentos
- `POST /api/v1/documents/upload` - Upload de documento
- `GET /api/v1/documents/:id` - Detalhes do documento
- `GET /api/v1/documents/:id/download` - Download do documento
- `DELETE /api/v1/documents/:id` - Excluir documento

### Usuários
- `GET /api/v1/users/profile` - Perfil do usuário
- `PUT /api/v1/users/profile` - Atualizar perfil

### Admin
- `GET /api/v1/admin/dashboard` - Métricas do dashboard
- `GET /api/v1/admin/users` - Listar usuários
- `PATCH /api/v1/admin/users/:id/status` - Alterar status do usuário
- `GET /api/v1/admin/audit-logs` - Logs de auditoria

### Integrações
- `POST /api/v1/integrations/govbr/callback` - Callback Gov.br
- `POST /api/v1/integrations/whatsapp/webhook` - Webhook WhatsApp
- `POST /api/v1/integrations/icp-brasil/validate` - Validar certificado
- `POST /api/v1/integrations/digital-signature/sign` - Assinatura digital
- `POST /api/v1/integrations/tcu/generate-report` - Relatório TCU/TCE

## 🔒 Segurança

### Implementado
- ✅ JWT Authentication
- ✅ Rate Limiting (100 req/min)
- ✅ CORS configurado
- ✅ Helmet (security headers)
- ✅ Input validation (Zod)
- ✅ SQL injection protection (Drizzle ORM)
- ✅ File upload validation
- ✅ Audit logging

### Compliance
- ✅ LGPD: Logs de processamento de dados
- ✅ Auditoria: Todas as ações são logadas
- ✅ Backup: Estrutura preparada
- ✅ Criptografia: Senhas com bcrypt

## 📊 Monitoramento

### Logs
- **Aplicação**: `logs/combined.log`
- **Erros**: `logs/error.log`
- **Auditoria**: `logs/audit.log`

### Health Check
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "development"
}
```

## 🧪 Testes

```bash
# Executar testes
pnpm run test

# Testes com coverage
pnpm run test:coverage

# Verificar tipos
pnpm run type-check

# Lint
pnpm run lint
```

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Build para produção
pnpm run build

# Deploy
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build
EXPOSE 3002
CMD ["pnpm", "start"]
```

## 🔧 Configuração

### Variáveis de Ambiente Obrigatórias
```env
NODE_ENV=development
PORT=3002
DATABASE_URL=postgresql://user:pass@localhost:5432/govtech_pro
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key
```

### Variáveis Opcionais
```env
# Gov.br
GOVBR_CLIENT_ID=your-govbr-client-id
GOVBR_CLIENT_SECRET=your-govbr-client-secret

# WhatsApp Business
WHATSAPP_ACCESS_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-id

# Storage
STORAGE_TYPE=local
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

## 📈 Performance

### Otimizações Implementadas
- Connection pooling (PostgreSQL)
- Query optimization (Drizzle ORM)
- File streaming (uploads/downloads)
- Compression (gzip)
- Caching headers
- Rate limiting

### Métricas Esperadas
- **Response Time**: < 200ms (95th percentile)
- **Throughput**: > 1000 req/s
- **Memory Usage**: < 512MB
- **CPU Usage**: < 50%

## 🐛 Troubleshooting

### Problemas Comuns

**Erro de conexão com banco**
```bash
# Verificar se PostgreSQL está rodando
pg_isready -h localhost -p 5432

# Testar conexão
psql -h localhost -U postgres -d govtech_pro_dev
```

**Erro de migração**
```bash
# Resetar migrações (CUIDADO: apaga dados)
pnpm run db:reset

# Gerar nova migração
pnpm run db:generate
```

**Erro de upload**
```bash
# Verificar permissões da pasta uploads
chmod 755 uploads/

# Criar pasta se não existir
mkdir -p uploads
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Add nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Pull Request

### Padrões de Código
- TypeScript strict mode
- ESLint + Prettier
- Conventional Commits
- 100% type coverage
- Testes unitários obrigatórios

---

**Desenvolvido com ❤️ para modernizar a gestão pública brasileira**