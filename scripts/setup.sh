#!/bin/bash

# GovTech Pro - Setup Script
# Este script configura o ambiente de desenvolvimento inicial

set -e

echo "🚀 Configurando GovTech Pro..."
echo "================================"

# Verificar pré-requisitos
echo "📋 Verificando pré-requisitos..."

# Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js 18+ antes de continuar."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versão 18+ é necessária. Versão atual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) encontrado"

# pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Instalando pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm $(pnpm -v) encontrado"

# PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL não encontrado. Certifique-se de ter PostgreSQL 14+ instalado."
    echo "   Você pode usar Docker: docker run --name govtech-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:14"
fi

# Git
if ! command -v git &> /dev/null; then
    echo "❌ Git não encontrado. Instale Git antes de continuar."
    exit 1
fi

echo "✅ Git $(git --version | cut -d' ' -f3) encontrado"

echo ""
echo "📦 Instalando dependências..."
pnpm install

echo ""
echo "⚙️  Configurando ambiente..."

# Criar arquivo .env se não existir
if [ ! -f .env.local ]; then
    echo "📝 Criando arquivo .env.local..."
    cp .env.example .env.local
    echo "⚠️  IMPORTANTE: Edite o arquivo .env.local com suas configurações antes de continuar!"
fi

echo ""
echo "🏗️  Configurando banco de dados..."

# Verificar se o banco está acessível
if command -v psql &> /dev/null; then
    echo "🔍 Testando conexão com PostgreSQL..."
    
    # Tentar conectar com configurações padrão
    if psql -h localhost -U postgres -d postgres -c "SELECT 1;" &> /dev/null; then
        echo "✅ Conexão com PostgreSQL estabelecida"
        
        # Criar banco se não existir
        psql -h localhost -U postgres -c "CREATE DATABASE govtech_pro_dev;" 2>/dev/null || echo "ℹ️  Banco govtech_pro_dev já existe"
        
        echo "🔄 Executando migrações..."
        pnpm run db:generate
        pnpm run db:migrate
        
        echo "🌱 Populando dados iniciais..."
        pnpm run db:seed
    else
        echo "⚠️  Não foi possível conectar ao PostgreSQL. Verifique se está rodando e configure DATABASE_URL no .env.local"
    fi
else
    echo "⚠️  PostgreSQL não encontrado. Configure DATABASE_URL no .env.local para um banco remoto"
fi

echo ""
echo "🧪 Executando testes..."
pnpm run type-check
pnpm run lint --fix

echo ""
echo "🎉 Setup concluído com sucesso!"
echo "================================"
echo ""
echo "📋 Próximos passos:"
echo "1. Edite o arquivo .env.local com suas configurações"
echo "2. Configure as integrações Gov.br e ICP-Brasil (opcional)"
echo "3. Execute 'pnpm run dev' para iniciar o desenvolvimento"
echo ""
echo "📚 Documentação: ./docs/README.md"
echo "🆘 Suporte: suporte@govtech-pro.com.br"
echo ""
echo "🚀 Para iniciar o desenvolvimento:"
echo "   pnpm run dev"
echo ""