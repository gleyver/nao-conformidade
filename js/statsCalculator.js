/**
 * Stats Calculator Module
 * Responsabilidade: Calcular estatísticas das obras/RNCs
 */
class StatsCalculator {
    /**
     * Calcula todas as estatísticas
     * @param {Array<Object>} obras - Array de obras
     * @returns {Object} Objeto com todas as estatísticas
     */
    static calculate(obras) {
        const totalObras = obras.length;
        const totalAbertas = obras.filter(o => !o.dataConclusao || o.dataConclusao === '').length;
        const totalConcluidas = obras.filter(o => o.dataConclusao && o.dataConclusao !== '').length;
        
        const obrasComPrazo = obras.filter(o => o.prazo > 0);
        const mediaPrazo = obrasComPrazo.length > 0 
            ? Math.round(obrasComPrazo.reduce((sum, o) => sum + o.prazo, 0) / obrasComPrazo.length)
            : 0;

        return {
            totalObras,
            totalAbertas,
            totalConcluidas,
            mediaPrazo
        };
    }

    /**
     * Atualiza os elementos HTML com as estatísticas
     * @param {Object} stats - Estatísticas calculadas
     */
    static updateDOM(stats) {
        const element = (id) => document.getElementById(id);
        
        if (element('totalObras')) element('totalObras').textContent = stats.totalObras;
        if (element('totalAbertas')) element('totalAbertas').textContent = stats.totalAbertas;
        if (element('totalConcluidas')) element('totalConcluidas').textContent = stats.totalConcluidas;
        if (element('mediaPrazo')) element('mediaPrazo').textContent = stats.mediaPrazo;
    }

    /**
     * Prepara dados para gráficos de abertura e conclusão
     * @param {Array<Object>} obras - Array de obras
     * @returns {Object} Dados formatados para gráficos
     */
    static prepareChartData(obras) {
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const aberturas = new Array(12).fill(0);
        const conclusoes = new Array(12).fill(0);

        obras.forEach(obra => {
            if (obra.dataAbertura) {
                try {
                    const dataAbertura = new Date(obra.dataAbertura);
                    if (!isNaN(dataAbertura.getTime())) {
                        const mesAbertura = dataAbertura.getMonth();
                        if (mesAbertura >= 0 && mesAbertura < 12) {
                            aberturas[mesAbertura]++;
                        }
                    }
                } catch (e) {
                    console.warn('Data de abertura inválida:', obra.dataAbertura);
                }
            }
            
            if (obra.dataConclusao) {
                try {
                    const dataConclusao = new Date(obra.dataConclusao);
                    if (!isNaN(dataConclusao.getTime())) {
                        const mesConclusao = dataConclusao.getMonth();
                        if (mesConclusao >= 0 && mesConclusao < 12) {
                            conclusoes[mesConclusao]++;
                        }
                    }
                } catch (e) {
                    console.warn('Data de conclusão inválida:', obra.dataConclusao);
                }
            }
        });

        return {
            meses,
            aberturas,
            conclusoes
        };
    }
}

