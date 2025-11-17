#!/bin/bash

# Script para preparar projeto para GitHub Pages
# Execute: bash scripts/preparar-github.sh

echo "🚀 Preparando projeto para GitHub Pages..."
echo ""

# Verificar se já é um repositório git
if [ -d .git ]; then
    echo "✅ Repositório Git já inicializado"
else
    echo "📦 Inicializando repositório Git..."
    git init
    echo "✅ Repositório Git inicializado"
fi

# Verificar se .gitignore existe
if [ -f .gitignore ]; then
    echo "✅ .gitignore já existe"
else
    echo "⚠️  .gitignore não encontrado (deveria existir)"
fi

# Verificar se GitHub Actions está configurado
if [ -f .github/workflows/atualizar-dados.yml ]; then
    echo "✅ GitHub Actions configurado"
else
    echo "⚠️  GitHub Actions não encontrado"
fi

# Verificar se dados/dados.csv existe
if [ -f dados/dados.csv ]; then
    echo "✅ Arquivo dados/dados.csv encontrado"
    echo "   Tamanho: $(wc -c < dados/dados.csv) bytes"
else
    echo "⚠️  Arquivo dados/dados.csv não encontrado"
    echo "   Será criado na primeira execução do GitHub Actions"
fi

echo ""
echo "📋 Próximos passos:"
echo ""
echo "1. Crie um repositório no GitHub:"
echo "   https://github.com/new"
echo ""
echo "2. Adicione o repositório remoto:"
echo "   git remote add origin https://github.com/SEU_USUARIO/nao-conformidades.git"
echo ""
echo "3. Faça commit e push:"
echo "   git add ."
echo "   git commit -m '🎉 Initial commit'"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Configure GitHub Pages:"
echo "   Settings → Pages → Source: main → Save"
echo ""
echo "5. Acesse seu dashboard:"
echo "   https://SEU_USUARIO.github.io/nao-conformidades/"
echo ""
echo "📖 Veja DEPLOY_GITHUB_PAGES.md para instruções detalhadas"

