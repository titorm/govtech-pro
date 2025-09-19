#!/bin/bash

# GovTech Pro API - Initialization Script

set -e

echo "🚀 Inicializando GovTech Pro API..."
echo "=================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp ../../.env.example .env
    echo "⚠️  IMPORTANTE: Configure as variáveis de ambiente no arquivo .env"
fi

echo "📦 Instalando dependências..."
pnpm install

echo "🗄️  Gerando schemas do banco..."
pnpm run db:generate

echo "🔄 Executando migrações..."
pnpm run db:migrate

echo "🌱 Populando dados iniciais..."
pnpm run db:seed

echo "🧪 Verificando tipos TypeScript..."
pnpm run type-check

echo "✅ API inicializada com sucesso!"
echo ""
echo "Para iniciar o servidor de desenvolvimento:"
echo "  pnpm run dev"
echo ""
echo "Para acessar a documentação da API:"
echo "  http://localhost:3002/docs"
echo ""
echo "Para acessar o Drizzle Studio:"
echo "  pnpm run db:studio"
echo ""