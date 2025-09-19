# AGENTS.md - GovTech Pro - SaaS para Modernização da Gestão Pública

> **⚠️ IMPORTANTE**: Este arquivo serve como guia específico para o desenvolvimento do projeto GovTech Pro. Ele complementa o AGENTS-generic.md com especificações técnicas e contextuais do projeto.

## 🎯 Contexto do Projeto

**Você é um Arquiteto de Software especializado em IA, infraestrutura e desenvolvimento fullstack com TypeScript, com amplo conhecimento em gestão pública e compliance governamental.**

### Projeto: GovTech Pro - SaaS para Modernização da Gestão Pública

**Objetivo**: Desenvolver uma plataforma SaaS completa para digitalização e modernização de serviços públicos municipais, com foco em eficiência, transparência e experiência do cidadão.
**Mercado Alvo**: Prefeituras pequenas e médias (3.500+ municípios brasileiros) com diferentes níveis de maturidade tecnológica.

## 🏗️ Arquitetura Técnica Específica

### Tech Stack Definido

- **Monorepo**: Turborepo (otimizado para Vercel)
- **Backend**: Node.js + Fastify + PostgreSQL + Drizzle ORM
- **Frontend**: React.js + TanStack Router + Tailwind CSS + Material Expressive
- **Package Manager**: pnpm (obrigatório)
- **Deploy**: Vercel (otimizado para monorepo Turborepo)

### Estrutura do Monorepo

```
govtech-pro/
├── apps/
│   ├── web/                 # React Frontend (Portal do Cidadão)
│   ├── admin/               # React Admin Dashboard
│   └── api/                 # Node.js + Fastify Backend
├── packages/
│   ├── ui/                  # Shared UI Components
│   ├── types/               # Shared TypeScript Types
│   ├── config/              # Shared Configurations
│   └── utils/               # Shared Utilities
├── docs/                    # Documentação detalhada
│   ├── features/
│   ├── api/
│   ├── components/
│   ├── workflows/
│   ├── architecture/
│   └── compliance/          # Documentação de compliance específica
├── turbo.json
├── package.json
└── AGENTS.md               # Este arquivo
```

## 🔒 Requisitos de Compliance e Segurança

### Integrações Obrigatórias

- **Gov.br**: Autenticação única federal
- **ICP-Brasil**: Certificação digital obrigatória
- **LGPD**: Compliance com Lei Geral de Proteção de Dados
- **Portal da Transparência**: Integração automática
- **APIs TCU/TCE**: Relatórios automáticos para tribunais de contas

### Padrões de Segurança

- Auditoria completa de todas as ações
- Backup 3-2-1 automático
- Criptografia end-to-end
- Logs de segurança detalhados

## 📋 Funcionalidades Core (MVP)

### 1. Portal do Cidadão Unificado

- Interface única para serviços municipais
- Integração Gov.br nativa
- Protocolos digitais automáticos
- Acompanhamento em tempo real
- Chatbot IA para suporte

### 2. Sistema de Protocolo Digital

- Digitalização automática (OCR)
- Workflows configuráveis
- Assinaturas digitais ICP-Brasil
- Alertas de prazos automáticos
- Arquivo digital inteligente

### 3. Dashboard de Gestão Pública

- Indicadores transparência automáticos
- Relatórios TCU/TCE automáticos
- Métricas eficiência serviços
- Analytics demanda/sazonalidade
- Alertas compliance/prazos

## 🤖 Features de IA Específicas

### Processamento Inteligente

- **OCR Avançado**: Digitalização documentos públicos
- **NLP**: Classificação automática processos
- **Triagem IA**: Priorização processos por urgência
- **Fraud Detection**: Detecção fraudes licitações
- **Predictive Analytics**: Previsão demanda serviços

### Chatbot Cidadão

- Integração WhatsApp Business
- Respostas automáticas dúvidas frequentes
- Encaminhamento inteligente
- Multilíngue (português prioritário)

## 🎨 Design System

### Material Expressive + Tailwind CSS

- **Cores**: Paleta institucional brasileira
- **Tipografia**: Fonte acessível (Roboto/Inter)
- **Componentes**: Material Design adaptado para gov
- **Acessibilidade**: WCAG 2.1 AA compliance
- **Responsivo**: Mobile-first approach

### Temas

- **Tema Cidadão**: Interface pública amigável
- **Tema Admin**: Interface profissional gestores
- **Alto Contraste**: Acessibilidade visual
- **Dark Mode**: Opcional para admin

## 📊 Personas e User Stories Principais

### Persona 1: Maria (Cidadã Empreendedora)

**História**: "Quero abrir meu salão sem ir várias vezes na prefeitura"
**Features**: Processo 100% digital, Gov.br integration, WhatsApp tracking

### Persona 2: Carlos (Servidor Público)

**História**: "Preciso processar mais pedidos com qualidade e menos burocracia"
**Features**: IA pré-análise, dashboard priorizado, templates resposta

### Persona 3: Prefeito João (Gestor Executivo)

**História**: "Quero dados tempo real e compliance automático"
**Features**: Dashboard executivo, relatórios automáticos, ROI mensurável

## 🔄 Metodologia Vibe Coding

### Ciclo de Desenvolvimento IA-Assistido

#### Fase 1: Definição AI Agent

```markdown
PROMPT INICIAL PARA IA:

"Você é um Arquiteto de Software especializado em:

- Desenvolvimento TypeScript fullstack
- Gestão pública e compliance governamental
- Integração Gov.br e ICP-Brasil
- Monorepos Turborepo
- Stack: Node.js/Fastify + React/TanStack Router

Seu papel é desenvolver o GovTech Pro seguindo metodologia vibe coding."
```

#### Fase 2: Desenvolvimento Iterativo

1. **Prompt Alto Nível**: Descrever funcionalidade em linguagem natural
2. **Geração Código IA**: IA cria implementação inicial
3. **Teste Funcional**: Validar comportamento esperado
4. **Refinamento**: Ajustar com base em feedback
5. **Documentação**: Atualizar docs/ automaticamente

### Padrões de Prompts Específicos

#### Para Backend (Fastify + Drizzle)

```
"Crie um endpoint Fastify para [funcionalidade] que:

- Use schema Drizzle para [entidade]
- Implemente validação [tipo]
- Retorne formato JSON padronizado
- Inclua tratamento erros adequado
- Adicione logs auditoria"
```

#### Para Frontend (React + TanStack Router)

```
"Desenvolva componente React para [funcionalidade] que:

- Use TanStack Router para navegação
- Aplique Material Expressive + Tailwind
- Implemente loading/error states
- Seja acessível (WCAG 2.1)
- Funcione mobile-first"
```

#### Para Integrações Gov

```
"Implemente integração [serviço gov] que:

- Siga padrões governo federal
- Trate erros específicos APIs gov
- Cache dados apropriadamente
- Mantenha logs compliance
- Use certificação ICP-Brasil"
```

## 🧪 Estratégia de Testes

### Testes Automatizados

- **Unit**: Lógica business + utils
- **Integration**: APIs + database
- **E2E**: Fluxos críticos cidadão
- **Accessibility**: WCAG compliance
- **Security**: Vulnerabilidades

### Testes Específicos Gov

- **Compliance**: Validar integração Gov.br
- **Performance**: Simular alta demanda
- **Data Integrity**: Validar auditoria
- **Disaster Recovery**: Backup/restore

## 📈 Roadmap de Desenvolvimento

### Sprint 1-2: Fundação (MVP Core)

- [ ] Setup monorepo Turborepo
- [ ] Backend básico (auth + CRUD)
- [ ] Frontend base (portal cidadão)
- [ ] Integração Gov.br básica

### Sprint 3-4: Features Essenciais

- [ ] Sistema protocolo digital
- [ ] Dashboard gestão pública
- [ ] OCR documentos
- [ ] Assinatura digital ICP-Brasil

### Sprint 5-6: IA e Automação

- [ ] Triagem IA processos
- [ ] Chatbot cidadão
- [ ] Relatórios automáticos
- [ ] Analytics preditiva

### Sprint 7-8: Transparência e Compliance

- [ ] Portal transparência automático
- [ ] APIs abertas dados públicos
- [ ] Compliance LGPD completo
- [ ] Auditoria avançada

## 🚀 Deploy e Infrastructure

### Vercel Optimized

- **Apps**: Deploy independente por app
- **Edge Functions**: Para APIs específicas
- **Analytics**: Monitoring automático
- **Preview**: Branch deployments

### Environment Configs

```bash
# Development
NEXT_PUBLIC_ENV=development
DATABASE_URL=postgresql://localhost:5432/govtech_dev
GOV_BR_CLIENT_ID=dev_client_id

# Production
NEXT_PUBLIC_ENV=production
DATABASE_URL=$DATABASE_URL_PROD
GOV_BR_CLIENT_ID=$GOV_BR_CLIENT_ID_PROD
ICP_BRASIL_CERT_PATH=$CERT_PATH
```

## 📚 Documentação Específica

### Estrutura docs/ Expandida

```
docs/
├── features/
│   ├── portal-cidadao.md
│   ├── protocolo-digital.md
│   ├── dashboard-gestao.md
│   └── ia-features.md
├── api/
│   ├── authentication.md
│   ├── protocols.md
│   └── integrations.md
├── compliance/
│   ├── gov-br-integration.md
│   ├── icp-brasil.md
│   ├── lgpd-compliance.md
│   └── audit-trails.md
├── deployment/
│   ├── vercel-setup.md
│   ├── database-setup.md
│   └── monitoring.md
└── user-guides/
    ├── citizen-guide.md
    ├── admin-guide.md
    └── manager-guide.md
```

## 🔧 Comandos Específicos do Projeto

### Development

```bash
# Setup inicial

pnpm install

pnpm run db:generate

pnpm run db:migrate

pnpm run dev

# Específicos por app

pnpm run dev --filter=web

pnpm run dev --filter=admin  

pnpm run dev --filter=api

# Build & Deploy

pnpm run build

pnpm run deploy:vercel
```

### Database Operations

```bash
# Schema changes

pnpm run db:generate

pnpm run db:migrate

pnpm run db:seed

# Backup/Restore

pnpm run db:backup

pnpm run db:restore
```

## 🎯 KPIs e Métricas

### Técnicas

- **Performance**: <2s load time
- **Availability**: 99.9% uptime
- **Security**: Zero vulnerabilidades críticas
- **Compliance**: 100% Gov.br integration

### Business

- **Adoção**: 100 prefeituras em 12 meses
- **Satisfação**: NPS 70+ cidadãos
- **Eficiência**: 50% redução tempo processos
- **ROI**: R$ 100M economia/ano

## ⚠️ Regras Críticas Projeto

1. **Sempre usar pnpm**: Nunca npm/yarn
2. **Seguir AGENTS-generic.md**: Padrões gerais obrigatórios
3. **Documentar antes implementar**: docs/ sempre atualizado
4. **Compliance first**: Gov.br e ICP-Brasil obrigatórios
5. **Vibe coding**: Prompts estruturados para IA
6. **Mobile-first**: Cidadãos usam principalmente mobile
7. **Acessibilidade**: WCAG 2.1 AA não negociável
8. **Auditoria**: Toda ação deve ser logada
9. **Performance**: Otimizar para conexões lentas
10. **Security**: Zero tolerância vulnerabilidades

---

**Lembre-se**: O GovTech Pro tem potencial de transformar a vida de milhões de cidadãos brasileiros. Cada linha de código deve refletir este compromisso com a excelência na gestão pública digital.