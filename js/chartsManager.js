/**
 * Charts Manager Module
 * Responsabilidade: Gerenciar criação e atualização de gráficos Chart.js
 */
class ChartsManager {
    constructor() {
        this.chartAbertura = null;
        this.chartConclusao = null;
    }

    /**
     * Inicializa ou atualiza os gráficos
     * @param {Array<Object>} obras - Array de obras para gerar dados dos gráficos
     */
    init(obras) {
        // Destruir gráficos existentes
        this.destroy();

        // Preparar dados
        const chartData = StatsCalculator.prepareChartData(obras);

        // Criar gráfico de abertura
        this.createAberturaChart(chartData.meses, chartData.aberturas);

        // Criar gráfico de conclusão
        this.createConclusaoChart(chartData.meses, chartData.conclusoes);
    }

    /**
     * Cria o gráfico de abertura
     * @param {Array<string>} meses - Labels dos meses
     * @param {Array<number>} aberturas - Dados de aberturas
     */
    createAberturaChart(meses, aberturas) {
        const ctxAbertura = document.getElementById('aberturaChart');
        if (!ctxAbertura) return;

        this.chartAbertura = new Chart(ctxAbertura, {
            type: 'bar',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Obras Abertas',
                    data: aberturas,
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 16
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            font: {
                                size: 14
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Cria o gráfico de conclusão
     * @param {Array<string>} meses - Labels dos meses
     * @param {Array<number>} conclusoes - Dados de conclusões
     */
    createConclusaoChart(meses, conclusoes) {
        const ctxConclusao = document.getElementById('conclusaoChart');
        if (!ctxConclusao) return;

        this.chartConclusao = new Chart(ctxConclusao, {
            type: 'line',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Obras Concluídas',
                    data: conclusoes,
                    backgroundColor: 'rgba(118, 75, 162, 0.2)',
                    borderColor: 'rgba(118, 75, 162, 1)',
                    borderWidth: 4,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 16
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            font: {
                                size: 14
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * Destrói os gráficos existentes
     */
    destroy() {
        if (this.chartAbertura) {
            this.chartAbertura.destroy();
            this.chartAbertura = null;
        }
        if (this.chartConclusao) {
            this.chartConclusao.destroy();
            this.chartConclusao = null;
        }
    }
}

