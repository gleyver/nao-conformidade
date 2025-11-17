/**
 * Data Fetcher Module
 * Responsabilidade: Buscar dados do Google Sheets (online) ou arquivo local (CSV)
 */
class DataFetcher {
    constructor(config) {
        this.SHEET_ID_EDIT = config.sheetId;
        this.GID = config.gid;
        this.CSV_URLS = this.buildUrls();
    }

    /**
     * Constrói array de URLs para tentar buscar dados
     * @returns {Array<string>} Array de URLs
     */
    buildUrls() {
        const BASE_URL_EXPORT = `https://docs.google.com/spreadsheets/d/${this.SHEET_ID_EDIT}/export?format=csv&gid=${this.GID}`;
        const BASE_URL_EXPORT_NO_GID = `https://docs.google.com/spreadsheets/d/${this.SHEET_ID_EDIT}/export?format=csv`;
        
        return [
            BASE_URL_EXPORT,
            BASE_URL_EXPORT_NO_GID,
            `https://docs.google.com/spreadsheets/d/${this.SHEET_ID_EDIT}/gviz/tq?tqx=out:csv&gid=${this.GID}`,
            `https://docs.google.com/spreadsheets/d/${this.SHEET_ID_EDIT}/gviz/tq?tqx=out:csv`,
            `https://api.allorigins.win/raw?url=${encodeURIComponent(BASE_URL_EXPORT)}`,
            `https://corsproxy.io/?${encodeURIComponent(BASE_URL_EXPORT)}`
        ];
    }

    /**
     * Busca dados do arquivo local (dados/dados.csv)
     * @returns {Promise<string|null>} Texto CSV ou null se falhar
     */
    async fetchLocal() {
        try {
            const response = await fetch('dados/dados.csv');
            if (response.ok) {
                const csvText = await response.text();
                console.log('Carregando dados locais (dados/dados.csv)');
                return csvText;
            }
        } catch (error) {
            console.warn('Erro ao carregar arquivo local:', error);
        }
        return null;
    }

    /**
     * Busca dados de uma URL específica
     * @param {string} url - URL para buscar
     * @returns {Promise<string>} Texto CSV
     */
    async fetchFromUrl(url) {
        let response;
        let csvText;
        
        // Para proxies, pode precisar de tratamento especial
        if (url.includes('allorigins.win')) {
            response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache'
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            csvText = await response.text();
        } else if (url.includes('corsproxy.io')) {
            response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache'
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            csvText = await response.text();
        } else {
            // Para URLs diretas do Google Sheets
            response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'omit',
                headers: {
                    'Accept': 'text/csv, text/plain, */*'
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text().catch(() => '');
                throw new Error(`HTTP ${response.status}: ${response.statusText}. ${errorText.substring(0, 100)}`);
            }
            
            csvText = await response.text();
        }
        
        return csvText;
    }

    /**
     * Valida se o texto recebido é um CSV válido
     * @param {string} csvText - Texto a validar
     * @returns {boolean} True se válido
     */
    validateCSV(csvText) {
        if (!csvText || csvText.trim().length === 0) {
            throw new Error('CSV vazio recebido');
        }
        
        // Verificar se não é uma página de erro HTML
        if (csvText.includes('<!DOCTYPE') || csvText.includes('<html')) {
            throw new Error('Recebido HTML ao invés de CSV. A planilha pode não estar pública.');
        }
        
        return true;
    }

    /**
     * Busca dados online do Google Sheets
     * @param {Function} onProgress - Callback para atualizar progresso
     * @returns {Promise<string|null>} Texto CSV ou null se todas as tentativas falharem
     */
    async fetchOnline(onProgress) {
        let lastError = null;
        
        for (let i = 0; i < this.CSV_URLS.length; i++) {
            const url = this.CSV_URLS[i];
            try {
                console.log(`Tentativa ${i + 1}/${this.CSV_URLS.length}:`, url);
                if (onProgress) {
                    onProgress(`Tentando carregar... (${i + 1}/${this.CSV_URLS.length})`);
                }
                
                const csvText = await this.fetchFromUrl(url);
                
                console.log('CSV recebido, tamanho:', csvText.length);
                console.log('Primeiros 500 caracteres do CSV:', csvText.substring(0, 500));
                
                this.validateCSV(csvText);
                
                return csvText;
                
            } catch (error) {
                console.warn('Erro ao tentar URL:', url, error);
                lastError = error;
                continue;
            }
        }
        
        console.error('Todas as URLs online falharam. Último erro:', lastError);
        return null;
    }

    /**
     * Busca dados (tenta local primeiro, depois online)
     * @param {Function} onProgress - Callback para atualizar progresso
     * @returns {Promise<string|null>} Texto CSV ou null se falhar
     */
    async fetch(onProgress) {
        // Tentar local primeiro
        const localData = await this.fetchLocal();
        if (localData) {
            return localData;
        }
        
        // Se local falhou, tentar online
        return await this.fetchOnline(onProgress);
    }
}

