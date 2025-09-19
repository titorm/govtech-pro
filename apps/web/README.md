# Portal do Cidadão - GovTech Pro

Interface web para cidadãos acessarem serviços públicos digitais.

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
- **Autenticação**: Login/registro com validação
- **Dashboard**: Visão geral personalizada
- **Rastreamento**: Acompanhar protocolos sem login
- **Layout Responsivo**: Mobile-first design
- **Acessibilidade**: WCAG 2.1 AA compliant
- **PWA Ready**: Manifest e service worker

### 🔄 Em Desenvolvimento
- **Catálogo de Serviços**: Navegação por categorias
- **Gestão de Protocolos**: CRUD completo
- **Perfil do Usuário**: Edição de dados
- **Upload de Documentos**: Drag & drop
- **Notificações**: Push notifications
- **Chat de Suporte**: WhatsApp integration

## 🏗️ Arquitetura

### Tech Stack
- **React 18** com TypeScript
- **TanStack Router** para roteamento
- **TanStack Query** para estado servidor
- **Tailwind CSS** para estilização
- **Framer Motion** para animações
- **React Hook Form** + Zod para formulários
- **Vite** como bundler

### Estrutura de Pastas
```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout.tsx      # Layout principal
│   ├── Header.tsx      # Cabeçalho
│   ├── Sidebar.tsx     # Menu lateral
│   └── Footer.tsx      # Rodapé
├── pages/              # Páginas da aplicação
│   ├── HomePage.tsx    # Landing page
│   ├── DashboardPage.tsx # Dashboard do cidadão
│   ├── auth/           # Páginas de autenticação
│   └── ...
├── lib/                # Utilitários e configurações
│   ├── auth.tsx        # Context de autenticação
│   └── api.ts          # Cliente HTTP
├── routes/             # Definição de rotas
└── assets/             # Recursos estáticos
```

## 🎨 Design System

### Cores
- **Primary**: `#1351B4` (Gov.br Blue)
- **Secondary**: `#168821` (Gov.br Green)
- **Accent**: `#FFCD07` (Gov.br Yellow)
- **Success**: `#22c55e`
- **Warning**: `#f59e0b`
- **Error**: `#ef4444`

### Componentes CSS
```css
.citizen-card          # Card padrão
.citizen-button-primary # Botão primário
.citizen-button-secondary # Botão secundário
.citizen-input         # Input padrão
.citizen-badge         # Badge de status
```

### Responsividade
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔐 Autenticação

### Fluxo de Login
1. Usuário insere CPF e senha
2. Validação no frontend (Zod)
3. Chamada para API `/auth/login`
4. Armazenamento de token JWT
5. Redirecionamento para dashboard

### Proteção de Rotas
```tsx
// Rotas protegidas
/_authenticated/
  ├── dashboard
  ├── services
  ├── protocols
  └── profile

// Rotas públicas
├── / (home)
├── /login
├── /register
└── /track
```

## 📱 PWA Features

### Manifest
```json
{
  "name": "Portal do Cidadão",
  "short_name": "GovTech Pro",
  "theme_color": "#1351B4",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/dashboard"
}
```

### Service Worker
- Cache de recursos estáticos
- Cache de API responses
- Offline fallback
- Background sync

## 🌐 Integração com API

### Cliente HTTP (Axios)
```typescript
// Configuração base
const api = axios.create({
  baseURL: 'http://localhost:3002/api/v1',
  timeout: 30000,
});

// Interceptors
- Request: Adiciona timestamp
- Response: Refresh token automático
```

### React Query
```typescript
// Cache de dados do servidor
const { data, isLoading, error } = useQuery({
  queryKey: ['protocols'],
  queryFn: () => apiHelpers.getProtocols(),
  staleTime: 5 * 60 * 1000, // 5 minutos
});
```

## 🎭 Animações

### Framer Motion
```tsx
// Animação de entrada
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Conteúdo
</motion.div>
```

### CSS Animations
- `fade-in`: Fade suave
- `slide-up`: Deslizar para cima
- `bounce-gentle`: Bounce suave

## ♿ Acessibilidade

### WCAG 2.1 AA
- **Contraste**: Mínimo 4.5:1
- **Navegação**: Keyboard navigation
- **Screen Readers**: ARIA labels
- **Focus**: Indicadores visuais
- **Semântica**: HTML semântico

### Testes
```bash
# Lighthouse audit
pnpm run lighthouse

# Axe accessibility
pnpm run test:a11y
```

## 🧪 Testes

### Configuração
- **Vitest** para unit tests
- **Testing Library** para component tests
- **MSW** para mock de API

### Comandos
```bash
# Executar testes
pnpm run test

# Coverage
pnpm run test:coverage

# Watch mode
pnpm run test:watch
```

## 📦 Build e Deploy

### Desenvolvimento
```bash
pnpm run dev
# http://localhost:3000
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
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false

# Monitoring
VITE_SENTRY_DSN=https://...
```

## 🔧 Configuração

### Vite Config
```typescript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
```

### Tailwind Config
```javascript
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        citizen: {
          primary: '#1351B4',
          secondary: '#168821',
          accent: '#FFCD07',
        },
      },
    },
  },
};
```

## 📊 Performance

### Métricas Alvo
- **FCP**: < 1.5s
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **Bundle Size**: < 500KB

### Otimizações
- Code splitting por rota
- Lazy loading de componentes
- Image optimization
- Tree shaking
- Compression (gzip/brotli)

## 🐛 Troubleshooting

### Problemas Comuns

**Erro de CORS**
```bash
# Verificar se API está rodando
curl http://localhost:3002/health
```

**Build falha**
```bash
# Limpar cache
rm -rf node_modules/.vite
pnpm run clean
pnpm install
```

**Rotas não funcionam**
```bash
# Regenerar route tree
pnpm run build
```

## 🤝 Contribuindo

### Padrões de Código
- TypeScript strict mode
- ESLint + Prettier
- Conventional Commits
- Component composition
- Custom hooks

### Fluxo de Desenvolvimento
1. Fork do projeto
2. Feature branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'feat: adiciona nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Pull Request

---

**Portal do Cidadão - Modernizando a gestão pública brasileira** 🇧🇷