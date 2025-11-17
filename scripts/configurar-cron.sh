#!/bin/bash

# Script para configurar cron job de atualização automática
# Execute: bash scripts/configurar-cron.sh

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT_PATH="$PROJECT_DIR/scripts/atualizar-dados.js"
LOG_DIR="$PROJECT_DIR/logs"

# Criar pasta de logs se não existir
mkdir -p "$LOG_DIR"

# Criar entrada do cron
CRON_ENTRY="*/10 * * * * cd $PROJECT_DIR && node $SCRIPT_PATH >> $LOG_DIR/atualizacao.log 2>&1"

# Verificar se já existe
if crontab -l 2>/dev/null | grep -q "atualizar-dados.js"; then
    echo "⚠️  Cron job já existe!"
    echo ""
    echo "Para remover o existente:"
    echo "  crontab -e"
    echo "  (remova a linha com atualizar-dados.js)"
    echo ""
    echo "Para adicionar manualmente:"
    echo "  crontab -e"
    echo "  (adicione: $CRON_ENTRY)"
else
    # Adicionar ao crontab
    (crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -
    echo "✅ Cron job configurado com sucesso!"
    echo ""
    echo "O script será executado a cada 10 minutos"
    echo "Logs serão salvos em: $LOG_DIR/atualizacao.log"
    echo ""
    echo "Para verificar:"
    echo "  crontab -l"
    echo ""
    echo "Para remover:"
    echo "  crontab -e"
    echo "  (remova a linha com atualizar-dados.js)"
fi

