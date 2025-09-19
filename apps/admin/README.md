# Dashboard Administrativo - GovTech Pro

Interface administrativa para gestores públicos gerenciarem o sistema GovTech Pro.

## 🚀 Quick Start

```bash
# Instalar dependências
pnpm install

# Iniciar desenvolvimento
pnpm run dev

# Build para produção
pnpm run build
```

## 🎯 Funcionalidades

### ✅ Implementado
- **Autenticação Admin**: Login com validação de permissões
- **Dashboard Executivo**: Métricas e KPIs em tempo real
- **Layout Profissional**: Design system administrativo
- **Controle de Acesso**: Diferentes níveis de permissão
- **Responsividade**: Interface adaptável para desktop/tablet
- **Gráficos Interativos**: Recharts para visualização de dados

### 🔄 Em Desenvolvimento
- **Gestão de Protocolos**: CRUD completo com filtros avançados
- **Gestão de Usuários**: Controle de permissões e status
- **Gestão de Serviços**: Configuração de serviços públicos
- **Relatórios Avançados**: TCU/TCE e transparência
- **Auditoria**: Logs detalhados de ações
- **Configurações**: Parâmetros do sistema

## 🏗️ Arquitetura

### Tech Stack
- **React 18** com TypeScript
- **TanStack Router** para roteamento
- **TanStack Query** para estado servidor
- **TanStack Table** para tabelas avançadas
- **Recharts** para gráficos e visualizações
- **Tailwind CSS** para estilização
- **Framer Motion** para animações
- **React Hook Form** + Zod para formulários

### Estrutura de Pastas
```
src/
├── components/          # Componentes reutilizáveis
│   ├── AdminLayout.tsx  # Layout principal
│   ├── AdminHeader.tsx  # Cabeçalho administrativo
│   ├── AdminSidebar.tsx # Menu lateral
│   └── AdminFooter.tsx  # Rodapé
├── pages/              # Páginas da aplicação
│   ├── DashboardPage.tsx # Dashboard principal
│   ├── ProtocolsPage.tsx # Gestão de protocolos
│   ├── UsersPage.tsx    # Gestão de usuários
│   └── auth/           # Páginas de autenticação
├── lib/                # Utilitários e configurações
│   ├── auth.tsx        # Context de autenticação admin
│   └── api.ts          # Cliente HTTP com helpers admin
├── routes/             # Definição de rotas
└── assets/             # Recursos estáticos
```

## 🎨 Design System Administrativo

### Cores
- **Primary**: `#1e40af` (Blue 800)
- **Secondary**: `#059669` (Emerald 600)
- **Accent**: `#d97706` (Amber 600)
- **Danger**: `#dc2626` (Red 600)
- **Success**: `#16a34a` (Green 600)
- **Warning**: `#ca8a04` (Yellow 600)

### Componentes CSS
```css
.admin-card              # Card administrativo
.admin-button-primary    # Botão primário
.admin-button-secondary  # Botão secundário
.admin-button-danger     # Botão de perigo
.admin-input            # Input administrativo
.admin-badge            # Badge de status
.metric-card            # Card de métricas
```

### Responsividade
- **Desktop**: > 1024px (layout completo)
- **Tablet**: 768px - 1024px (sidebar colapsável)
- **Mobile**: < 768px (sidebar overlay)

## 🔐 Controle de Acesso

### Níveis de Permissão
```typescript
// Administrador (admin)
- Acesso total ao sistema
- Gestão de usuários e permissões
- Configurações do sistema
- Auditoria e logs

// Gestor (manager)
- Dashboard executivo
- Gestão de protocolos
- Relatórios e analytics
- Gestão de serviços

// Operador (operator)
- Dashboard básico
- Visualização de protocolos
- Atualização de status
```

### Proteção de Rotas
```tsx
// Verificação automática de permissões
beforeLoad: ({ context }) => {
  const userRole = context.auth.user.role;
  if (!['admin', 'manager', 'operator'].includes(userRole)) {
    throw new Error('Acesso negado');
  }
}
```

## 📊 Dashboard e Métricas

### KPIs Principais
- **Total de Protocolos**: Quantidade total processada
- **Usuários Ativos**: Usuários com login recente
- **Taxa de Resolução**: Percentual de protocolos resolvidos
- **Tempo Médio**: Tempo médio de resolução

### Gráficos Disponíveis
```typescript
// Protocolos por Status (Pie Chart)
- Distribuição por status atual
- Cores diferenciadas por categoria

// Tendência Mensal (Line Chart)
- Evolução temporal dos protocolos
- Comparação mês a mês

// Performance por Departamento (Bar Chart)
- Produtividade por setor
- Tempo médio de resolução
```

## 🔍 Gestão de Protocolos

### Funcionalidades Planejadas
- **Tabela Interativa**: Ordenação, filtros e busca
- **Filtros Avançados**: Status, prioridade, data, departamento
- **Ações em Lote**: Atualização múltipla de status
- **Detalhes Completos**: Histórico e documentos
- **Atribuição**: Designar responsáveis
- **Respostas**: Adicionar comentários e atualizações

### Estados de Protocolo
```typescript
enum ProtocolStatus {
  RECEIVED = 'received',        // Recebido
  IN_ANALYSIS = 'in_analysis',  // Em Análise
  PENDING_INFO = 'pending_info', // Aguardando Info
  IN_PROGRESS = 'in_progress',  // Em Andamento
  FORWARDED = 'forwarded',      // Encaminhado
  RESOLVED = 'resolved',        // Resolvido
  CLOSED = 'closed',           // Fechado
  CANCELLED = 'cancelled',     // Cancelado
}
```

## 👥 Gestão de Usuários

### Funcionalidades Planejadas
- **Lista Completa**: Todos os usuários do sistema
- **Filtros**: Por status, função, data de cadastro
- **Ações**: Ativar/desativar, alterar permissões
- **Criação**: Novos usuários administrativos
- **Auditoria**: Histórico de alterações

### Tipos de Usuário
```typescript
enum UserRole {
  CITIZEN = 'citizen',    // Cidadão comum
  OPERATOR = 'operator',  // Operador de serviços
  MANAGER = 'manager',    // Gestor público
  ADMIN = 'admin',       // Administrador do sistema
}
```

## 📈 Relatórios e Analytics

### Tipos de Relatório
- **Operacionais**: Performance diária/mensal
- **Executivos**: KPIs e tendências
- **Compliance**: TCU/TCE e transparência
- **Auditoria**: Logs de segurança
- **Customizados**: Filtros específicos

### Formatos de Export
- **PDF**: Relatórios formatados
- **Excel**: Dados tabulares
- **CSV**: Dados brutos
- **JSON**: Integração com outros sistemas

## 🔧 Configurações do Sistema

### Parâmetros Configuráveis
- **Prazos**: SLA de atendimento
- **Notificações**: Alertas automáticos
- **Integrações**: APIs externas
- **Aparência**: Temas e logos
- **Backup**: Frequência e retenção

## 🧪 Testes

### Estratégia de Testes
```bash
# Testes unitários
pnpm run test

# Testes de integração
pnpm run test:integration

# Testes E2E
pnpm run test:e2e

# Coverage
pnpm run test:coverage
```

## 📦 Build e Deploy

### Desenvolvimento
```bash
pnpm run dev
# http://localhost:3001
```

### Produção
```bash
# Build
pnpm run build

# Preview
pnpm run preview

# Deploy Vercel
vercel --prod
```

### Variáveis de Ambiente
```env
# API
VITE_API_URL=http://localhost:3002/api/v1

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_AUDIT=true

# Monitoring
VITE_SENTRY_DSN=https://...
```

## 🔒 Segurança

### Medidas Implementadas
- **Autenticação JWT**: Tokens seguros
- **Controle de Acesso**: Baseado em roles
- **Auditoria**: Log de todas as ações
- **Session Management**: Controle de sessões
- **HTTPS Only**: Comunicação criptografada

### Headers de Segurança
```html
<!-- CSP, X-Frame-Options, etc. -->
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta http-equiv="X-Frame-Options" content="DENY" />
<meta http-equiv="X-XSS-Protection" content="1; mode=block" />
```

## 📊 Performance

### Métricas Alvo
- **FCP**: < 1.2s
- **LCP**: < 2.0s
- **FID**: < 50ms
- **CLS**: < 0.05
- **Bundle Size**: < 800KB

### Otimizações
- Code splitting por rota
- Lazy loading de gráficos
- Memoização de componentes
- Virtual scrolling para tabelas
- Compression (gzip/brotli)

## 🐛 Troubleshooting

### Problemas Comuns

**Erro de permissão**
```bash
# Verificar role do usuário
console.log(user.role)
# Deve ser: admin, manager ou operator
```

**Gráficos não carregam**
```bash
# Verificar dados da API
curl http://localhost:3002/api/v1/admin/dashboard
```

**Build falha**
```bash
# Limpar cache
rm -rf node_modules/.vite
pnpm run clean
pnpm install
```

## 🤝 Contribuindo

### Padrões de Código
- TypeScript strict mode
- ESLint + Prettier
- Conventional Commits
- Component composition
- Custom hooks para lógica

### Fluxo de Desenvolvimento
1. Fork do projeto
2. Feature branch: `git checkout -b feature/admin-feature`
3. Commit: `git commit -m 'feat(admin): adiciona nova feature'`
4. Push: `git push origin feature/admin-feature`
5. Pull Request

---

**Dashboard Administrativo - Modernizando a gestão pública brasileira** 🏛️