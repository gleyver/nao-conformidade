#!/usr/bin/env node

/**
 * Script para atualizar dados/dados.csv automaticamente em loop
 * 
 * Este script roda continuamente e atualiza a cada 10 minutos
 * Não precisa configurar cron - apenas execute e deixe rodando!
 * 
 * Uso:
 *   node scripts/atualizar-dados-loop.js
 * 
 * Para rodar em background:
 *   nohup node scripts/atualizar-dados-loop.js > logs/loop.log 2>&1 &
 * 
 * Para parar:
 *   pkill -f atualizar-dados-loop.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuração
const CONFIG = {
    sheetId: '1Md5fP17bXGEEmRXlbsTTo68F9ILROsAD9iPisUoNJ6g',
    gid: '1443492060',
    outputPath: path.join(__dirname, '..', 'dados', 'dados.csv'),
    interval: 10 * 60 * 1000 // 10 minutos em milissegundos
};

// URLs para tentar
const CSV_URLS = [
    `https://docs.google.com/spreadsheets/d/${CONFIG.sheetId}/export?format=csv&gid=${CONFIG.gid}`,
    `https://docs.google.com/spreadsheets/d/${CONFIG.sheetId}/export?format=csv`,
    `https://docs.google.com/spreadsheets/d/${CONFIG.sheetId}/gviz/tq?tqx=out:csv&gid=${CONFIG.gid}`,
    `https://docs.google.com/spreadsheets/d/${CONFIG.sheetId}/gviz/tq?tqx=out:csv`
];

/**
 * Baixa CSV de uma URL
 */
function downloadCSV(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }

            let csvText = '';
            response.on('data', (chunk) => {
                csvText += chunk;
            });

            response.on('end', () => {
                if (csvText && !csvText.includes('<!DOCTYPE') && !csvText.includes('<html')) {
                    resolve(csvText);
                } else {
                    reject(new Error('Resposta não é CSV válido'));
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

/**
 * Atualiza o arquivo CSV
 */
async function atualizarDados() {
    const timestamp = new Date().toLocaleString('pt-BR');
    console.log(`[${timestamp}] Iniciando atualização de dados...`);

    // Garantir que a pasta existe
    const dadosDir = path.dirname(CONFIG.outputPath);
    if (!fs.existsSync(dadosDir)) {
        fs.mkdirSync(dadosDir, { recursive: true });
        console.log(`Pasta criada: ${dadosDir}`);
    }

    // Tentar cada URL até uma funcionar
    for (let i = 0; i < CSV_URLS.length; i++) {
        const url = CSV_URLS[i];
        try {
            console.log(`  Tentativa ${i + 1}/${CSV_URLS.length}...`);
            const csvText = await downloadCSV(url);
            
            // Remover arquivo antigo se existir
            if (fs.existsSync(CONFIG.outputPath)) {
                fs.unlinkSync(CONFIG.outputPath);
                console.log('  ✓ Arquivo antigo removido');
            }

            // Salvar novo arquivo
            fs.writeFileSync(CONFIG.outputPath, csvText, 'utf8');
            console.log(`  ✅ Dados atualizados com sucesso!`);
            console.log(`     Arquivo: ${CONFIG.outputPath}`);
            console.log(`     Tamanho: ${(csvText.length / 1024).toFixed(2)} KB`);
            console.log(`     Próxima atualização em ${CONFIG.interval / 1000 / 60} minutos\n`);
            return true;
        } catch (error) {
            console.warn(`  ❌ Erro: ${error.message}`);
            if (i === CSV_URLS.length - 1) {
                console.error(`  ❌ Todas as tentativas falharam!`);
                console.log(`     Tentando novamente em ${CONFIG.interval / 1000 / 60} minutos\n`);
                return false;
            }
        }
    }
    return false;
}

// Função principal em loop
async function iniciarLoop() {
    console.log('🚀 Iniciando atualização automática em loop...');
    console.log(`   Intervalo: ${CONFIG.interval / 1000 / 60} minutos`);
    console.log(`   Arquivo de saída: ${CONFIG.outputPath}`);
    console.log(`   Pressione Ctrl+C para parar\n`);

    // Executar imediatamente na primeira vez
    await atualizarDados();

    // Depois executar a cada intervalo
    setInterval(async () => {
        await atualizarDados();
    }, CONFIG.interval);
}

// Tratamento de sinais para encerrar graciosamente
process.on('SIGINT', () => {
    console.log('\n\n⏹️  Encerrando atualização automática...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n⏹️  Encerrando atualização automática...');
    process.exit(0);
});

// Iniciar
iniciarLoop().catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
});

