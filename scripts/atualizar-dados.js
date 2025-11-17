#!/usr/bin/env node

/**
 * Script para atualizar dados/dados.csv automaticamente
 * 
 * Uso:
 *   node scripts/atualizar-dados.js
 * 
 * Ou configure um cron job:
 *   */10 * * * * cd /caminho/para/projeto && node scripts/atualizar-dados.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuração
const CONFIG = {
    sheetId: '1Md5fP17bXGEEmRXlbsTTo68F9ILROsAD9iPisUoNJ6g',
    gid: '1443492060',
    outputPath: path.join(__dirname, '..', 'dados', 'dados.csv')
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
    console.log(`[${new Date().toLocaleString('pt-BR')}] Iniciando atualização de dados...`);

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
            console.log(`Tentativa ${i + 1}/${CSV_URLS.length}: ${url}`);
            const csvText = await downloadCSV(url);
            
            // Remover arquivo antigo se existir
            if (fs.existsSync(CONFIG.outputPath)) {
                fs.unlinkSync(CONFIG.outputPath);
                console.log('Arquivo antigo removido');
            }

            // Salvar novo arquivo
            fs.writeFileSync(CONFIG.outputPath, csvText, 'utf8');
            console.log(`✅ Dados atualizados com sucesso!`);
            console.log(`   Arquivo salvo em: ${CONFIG.outputPath}`);
            console.log(`   Tamanho: ${(csvText.length / 1024).toFixed(2)} KB`);
            return;
        } catch (error) {
            console.warn(`   ❌ Erro: ${error.message}`);
            if (i === CSV_URLS.length - 1) {
                console.error('❌ Todas as tentativas falharam!');
                process.exit(1);
            }
        }
    }
}

// Executar
atualizarDados().catch((error) => {
    console.error('Erro fatal:', error);
    process.exit(1);
});

