/**
 * Main Application Module
 * Responsabilidade: Orquestrar todos os módulos e inicializar a aplicação
 */

// ============================================
// CONFIGURAÇÃO DE ATUALIZAÇÃO DE DADOS
// ============================================
// Intervalo de atualização automática dos dados
// Para testar localmente, use valores menores (ex: 30 * 1000 para 30 segundos)
// Para produção, use 10 * 60 * 1000 (10 minutos)
const UPDATE_INTERVAL = 15 * 60 * 1000; // 15 minutos
// Opções de teste:
// const UPDATE_INTERVAL = 30 * 1000;           // 30 segundos
// const UPDATE_INTERVAL = 1 * 60 * 1000;       // 1 minuto
// const UPDATE_INTERVAL = 2 * 60 * 1000;       // 2 minutos
// const UPDATE_INTERVAL = 5 * 60 * 1000;       // 5 minutos
// const UPDATE_INTERVAL =  10 * 60 * 1000;     // 10 minutos
// const UPDATE_INTERVAL =  15 * 60 * 1000;     // 15 minutos
// const UPDATE_INTERVAL =  20 * 60 * 1000;     // 20 minutos
// const UPDATE_INTERVAL =  30 * 60 * 1000;     // 30 minutos
// ============================================

class App {
    constructor(config) {
        this.config = config;
        this.obras = [];
        this.dataFetcher = new DataFetcher({
            sheetId: config.sheetId,
            gid: config.gid
        });
        this.slidesManager = null;
        this.chartsManager = new ChartsManager();
    }

    /**
     * Atualiza o indicador de refresh
     * @param {string} message - Mensagem a exibir
     */
    updateRefreshIndicator(message) {
        const indicator = document.getElementById('refreshIndicator');
        if (indicator) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
            indicator.textContent = `${message} - ${timeStr}`;
        }
    }

    /**
     * Atualiza toda a interface com os dados
     * Agora apenas inicializa os componentes, pois o HTML já está no index.html
     */
    updateUI() {
        this.initComponents();
    }

    /**
     * Inicializa os componentes (slides, gráficos, estatísticas)
     */
    initComponents() {
        // Inicializar slides
        this.slidesManager = new SlidesManager(
            this.obras,
            'slidesContainer',
            'indicators'
        );
        window.slidesManager = this.slidesManager;
        this.slidesManager.init();

        // Inicializar gráficos
        this.chartsManager.init(this.obras);

        // Atualizar estatísticas
        const stats = StatsCalculator.calculate(this.obras);
        StatsCalculator.updateDOM(stats);
    }

    /**
     * Processa os dados CSV e atualiza a aplicação
     * @param {string} csvText - Texto CSV
     */
    processData(csvText) {
        try {
            // Parse CSV
            const sheetData = CSVParser.parse(csvText);
            console.log('Dados parseados:', sheetData.length, 'linhas');
            
            if (sheetData.length === 0) {
                throw new Error('Nenhum dado encontrado após parsing do CSV');
            }
            
            // Mapear dados
            this.obras = DataMapper.mapSheetData(sheetData);
            console.log('Obras mapeadas:', this.obras.length);
            
            if (this.obras.length === 0) {
                throw new Error('Nenhuma RNC válida encontrada após mapeamento');
            }

            // Atualizar UI
            this.updateUI();
            this.updateRefreshIndicator(`Última atualização: ${new Date().toLocaleTimeString('pt-BR')}`);
            
            return true;
        } catch (error) {
            console.error('Erro ao processar dados:', error);
            throw error;
        }
    }

    /**
     * Carrega dados e inicializa a aplicação
     */
    async loadData() {
        this.updateRefreshIndicator('Carregando dados...');
        
        try {
            // Tentar buscar dados
            const csvText = await this.dataFetcher.fetch((message) => {
                this.updateRefreshIndicator(message);
            });
            
            if (!csvText) {
                throw new Error('Não foi possível carregar dados');
            }
            
            // Processar dados
            this.processData(csvText);
            
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.showError(error);
        }
    }

    /**
     * Exibe mensagem de erro
     * @param {Error} error - Erro ocorrido
     */
    showError(error) {
        const container = document.getElementById('mainContainer');
        
        // Substituir conteúdo do container com mensagem de erro
        if (container) {
            container.innerHTML = `
                <div class="text-center text-white text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 4k:text-5xl py-8 sm:py-12 md:py-16">
                    <div class="text-red-400 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 4k:text-6xl mb-4 sm:mb-6 md:mb-8 font-bold">
                        Erro ao carregar dados do Google Sheets
                    </div>
                    <div class="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 4k:text-5xl mb-2 sm:mb-4 font-semibold">
                        Possíveis causas:
                    </div>
                    <ul class="text-left inline-block text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 4k:text-4xl mb-4 sm:mb-6 md:mb-8 space-y-2">
                        <li>• A planilha não está configurada para acesso público</li>
                        <li>• Problemas de conexão com a internet</li>
                        <li>• Bloqueio de CORS no navegador</li>
                    </ul>
                    <div class="mt-6 sm:mt-8 md:mt-10 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 4k:text-4xl mb-4 sm:mb-6 md:mb-8">
                        <strong>Como resolver:</strong><br>
                        <span class="block mt-2 sm:mt-3">1. Abra a planilha: <a href="https://docs.google.com/spreadsheets/d/${this.config.sheetId}/edit?gid=${this.config.gid}" target="_blank" class="text-indigo-300 hover:text-indigo-200 underline">Abrir Planilha</a></span>
                        <span class="block mt-1 sm:mt-2">2. Clique em "Compartilhar" (canto superior direito)</span>
                        <span class="block mt-1 sm:mt-2">3. Clique em "Alterar para qualquer pessoa com o link"</span>
                        <span class="block mt-1 sm:mt-2">4. Defina como "Leitor"</span>
                        <span class="block mt-1 sm:mt-2">5. Clique em "Concluído"</span>
                        <span class="block mt-1 sm:mt-2">6. Clique no botão abaixo para tentar novamente</span>
                        <span class="block mt-3 sm:mt-4 font-bold">OU</span>
                        <span class="block mt-1 sm:mt-2">Baixe a planilha como CSV e salve como "dados/dados.csv" na pasta de dados</span>
                    </div>
                    <button onclick="location.reload()" class="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 4k:text-5xl rounded-lg sm:rounded-xl cursor-pointer shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 font-bold">
                        Tentar Novamente
                    </button>
                    <div class="mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 4k:text-3xl opacity-80">
                        Erro técnico: ${error?.message || 'Desconhecido'}<br>
                        <small class="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 4k:text-3xl">Abra o Console do navegador (F12) para mais detalhes</small>
                    </div>
                </div>
            `;
        }
        
        this.updateRefreshIndicator('Erro ao carregar dados');
    }

    /**
     * Inicializa a aplicação
     */
    async init() {
        // Suporte para fullscreen (F11)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F11') {
                e.preventDefault();
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
            }
        });

        // Carregar dados
        await this.loadData();
        
        // Atualizar dados automaticamente (intervalo configurado no início do arquivo)
        setInterval(async () => {
            try {
                console.log('Iniciando atualização automática de dados...');
                this.updateRefreshIndicator('Atualizando dados...');
                
                const csvText = await this.dataFetcher.fetchOnline((message) => {
                    this.updateRefreshIndicator(message);
                });
                
                if (csvText) {
                    this.processData(csvText);
                    console.log('Dados atualizados com sucesso!');
                } else {
                    console.warn('Não foi possível atualizar dados. Mantendo dados existentes.');
                    this.updateRefreshIndicator(`Última atualização: ${new Date().toLocaleTimeString('pt-BR')} (sem atualização)`);
                }
            } catch (error) {
                console.warn('Erro ao atualizar dados:', error);
                // Manter dados existentes em caso de erro
                this.updateRefreshIndicator(`Última atualização: ${new Date().toLocaleTimeString('pt-BR')} (erro)`);
            }
        }, UPDATE_INTERVAL);
        
        console.log(`Atualização automática configurada para a cada ${UPDATE_INTERVAL / 1000 / 60} minutos`);
    }
}

