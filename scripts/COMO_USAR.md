# Como Usar os Scripts de Atualização

## ⚠️ IMPORTANTE: Cron NÃO é Automático!

O **cron job precisa ser configurado manualmente uma vez**. Depois de configurado, ele executa automaticamente, mas a configuração inicial não é automática.

## 🎯 Opções Disponíveis

### Opção 1: Script em Loop (MAIS SIMPLES - RECOMENDADO) ⭐

**Não precisa configurar cron!** O script roda continuamente e atualiza automaticamente.

#### Executar uma vez e deixar rodando:

```bash
# Executar normalmente (ver logs no terminal)
node scripts/atualizar-dados-loop.js

# Executar em background (não trava o terminal)
nohup node scripts/atualizar-dados-loop.js > logs/loop.log 2>&1 &

# Ver logs em tempo real
tail -f logs/loop.log

# Parar o script
pkill -f atualizar-dados-loop.js
```

**Vantagens:**
- ✅ Não precisa configurar cron
- ✅ Funciona imediatamente
- ✅ Mais simples de usar
- ✅ Fácil de parar/iniciar

**Desvantagens:**
- ❌ Precisa estar rodando (ou em background)
- ❌ Se o servidor reiniciar, precisa iniciar novamente

---

### Opção 2: Cron Job (MAIS ROBUSTO)

**Precisa configurar uma vez**, depois funciona automaticamente mesmo após reiniciar o servidor.

#### Configurar automaticamente:

```bash
bash scripts/configurar-cron.sh
```

#### Ou configurar manualmente:

```bash
# Editar crontab
crontab -e

# Adicionar esta linha (ajuste o caminho):
*/10 * * * * cd /caminho/para/nao-conformidades && node scripts/atualizar-dados.js >> logs/atualizacao.log 2>&1
```

**Vantagens:**
- ✅ Funciona mesmo após reiniciar servidor
- ✅ Mais robusto
- ✅ Não precisa manter processo rodando

**Desvantagens:**
- ❌ Precisa configurar manualmente uma vez
- ❌ Mais complexo de configurar

---

### Opção 3: Executar Manualmente

Sempre que quiser atualizar:

```bash
node scripts/atualizar-dados.js
```

---

## 📊 Comparação

| Método | Configuração | Reinicia Automaticamente | Complexidade |
|--------|--------------|--------------------------|--------------|
| **Script em Loop** | ⭐ Muito fácil | ❌ Não | ⭐ Muito simples |
| **Cron Job** | ⚠️ Média | ✅ Sim | ⚠️ Média |
| **Manual** | ✅ Nenhuma | ❌ Não | ✅ Muito simples |

## 🎯 Recomendação

**Para começar rápido:** Use o **Script em Loop** (`atualizar-dados-loop.js`)

**Para produção/robustez:** Configure o **Cron Job**

## 🔍 Verificar se está funcionando

```bash
# Ver se o arquivo foi atualizado recentemente
ls -lh dados/dados.csv

# Ver logs do cron
tail -f logs/atualizacao.log

# Ver logs do loop
tail -f logs/loop.log

# Ver processos rodando
ps aux | grep atualizar-dados
```

