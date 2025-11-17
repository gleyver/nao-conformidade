# Scripts de Atualização

## atualizar-dados.js

Script Node.js para atualizar automaticamente o arquivo `dados/dados.csv` do Google Sheets.

### Funcionalidades

- ✅ Baixa dados do Google Sheets
- ✅ Remove arquivo antigo antes de salvar novo
- ✅ Tenta múltiplas URLs até uma funcionar
- ✅ Valida se o conteúdo é CSV válido
- ✅ Logs detalhados

### Uso Manual

```bash
node scripts/atualizar-dados.js
```

### Configurar Atualização Automática

#### Opção 1: Cron Job (Linux/Mac)

Edite o crontab:
```bash
crontab -e
```

Adicione para atualizar a cada 10 minutos:
```bash
*/10 * * * * cd /caminho/para/nao-conformidades && node scripts/atualizar-dados.js >> logs/atualizacao.log 2>&1
```

#### Opção 2: Task Scheduler (Windows)

1. Abra o "Agendador de Tarefas"
2. Crie uma nova tarefa
3. Configure para executar a cada 10 minutos:
   - Programa: `node`
   - Argumentos: `scripts/atualizar-dados.js`
   - Diretório inicial: `C:\caminho\para\nao-conformidades`

#### Opção 3: PM2 (Node.js Process Manager)

```bash
# Instalar PM2
npm install -g pm2

# Executar script a cada 10 minutos
pm2 start scripts/atualizar-dados.js --cron "*/10 * * * *" --name atualizar-dados

# Ver logs
pm2 logs atualizar-dados
```

### Logs

Os logs são exibidos no console. Para salvar em arquivo:

```bash
node scripts/atualizar-dados.js >> logs/atualizacao.log 2>&1
```

### Personalizar

Edite `scripts/atualizar-dados.js` para alterar:
- ID da planilha (`sheetId`)
- GID da aba (`gid`)
- Caminho de saída (`outputPath`)

