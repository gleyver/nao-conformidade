/**
 * Data Mapper Module
 * Responsabilidade: Mapear dados do CSV para o formato esperado pela aplicação
 */
class DataMapper {
    /**
     * Encontra uma coluna por padrões de nome (case-insensitive)
     * @param {Object} row - Linha de dados do CSV
     * @param {Array<string>} patterns - Array de padrões de nome para buscar
     * @returns {string} Valor encontrado ou string vazia
     */
    static findColumn(row, patterns) {
        for (const pattern of patterns) {
            // Busca exata
            if (row[pattern] !== undefined) {
                return row[pattern];
            }
            // Busca case-insensitive
            const key = Object.keys(row).find(k => 
                k.toLowerCase().trim() === pattern.toLowerCase().trim()
            );
            if (key) return row[key];
        }
        return '';
    }

    /**
     * Mapeia dados do Google Sheets para o formato esperado
     * @param {Array<Object>} sheetData - Dados parseados do CSV
     * @returns {Array<Object>} Array de obras no formato padronizado
     */
    static mapSheetData(sheetData) {
        if (sheetData.length === 0) return [];
        
        // Log das colunas disponíveis para debug
        const firstRow = sheetData[0];
        console.log('Colunas disponíveis:', Object.keys(firstRow));
        
        return sheetData.map((row, index) => {
            // Mapear colunas exatas da planilha
            const titulo = this.findColumn(row, [
                'Titulo da Não conformidade:',
                'Título da Não conformidade:',
                'Titulo da Não Conformidade:',
                'Título da Não Conformidade:',
                'Titulo da Não conformidade',
                'Título', 'Titulo', 'OBRA', 'Obra'
            ]) || '';
            
            const origem = this.findColumn(row, [
                'Origem da RNC, inserir apenas JOB.',
                'Origem da RNC',
                'Origem', 'ORIGEM', 'origem', 'JOB'
            ]) || 'Não informado';
            
            const responsavelApontamento = this.findColumn(row, [
                'Responsável pela emissão do R.N.C.:',
                'Responsável pela emissão do RNC:',
                'Responsável pela emissão',
                'Responsável Apontamento',
                'Responsavel Apontamento',
                'Emissão', 'Emissor'
            ]) || 'Não informado';
            
            const responsavelPlanoAcao = this.findColumn(row, [
                'Responsável pela resolução do problema:',
                'Responsável pela resolução',
                'Responsável pela resolução do R.N.C.:',
                'Responsável Plano de Ação',
                'Responsavel Plano de Acao',
                'Resolução', 'Responsável Resolução'
            ]) || 'Não informado';
            
            // Extrair prazo
            let prazo = 0;
            const prazoStr = this.findColumn(row, [
                'Prazo para conclusão da R.N.C.:',
                'Prazo para conclusão da RNC:',
                'Prazo para conclusão',
                'Prazo (dias)', 'Prazo (Dias)',
                'Prazo', 'PRAZO', 'Dias', 'DIAS'
            ]);
            if (prazoStr) {
                const prazoMatch = prazoStr.toString().match(/\d+/);
                if (prazoMatch) prazo = parseInt(prazoMatch[0]);
            }

            // Extrair datas
            const dataAbertura = this.findColumn(row, [
                'Data de emissão:',
                'Data de emissão',
                'Data Abertura',
                'Data de Abertura',
                'DATA ABERTURA',
                'Emissão', 'Data Emissão'
            ]) || '';
            
            const dataConclusao = this.findColumn(row, [
                'Data Conclusão',
                'Data de Conclusão',
                'DATA CONCLUSÃO',
                'Conclusão', 'Data Fim'
            ]) || '';

            // Extrair link da imagem - priorizar a coluna "Insira até 3 imagens"
            let imagemUrl = this.findColumn(row, [
                'Insira até 3 imagens da Não Conformidade:',
                'Insira até 3 imagens da Não Conformidade',
                'Insira até 3 imagens',
                'Imagens da Não Conformidade'
            ]) || '';
            
            // Se não encontrou, tentar a outra coluna
            if (!imagemUrl) {
                imagemUrl = this.findColumn(row, [
                    'Link da imagem para site',
                    'Link da imagem',
                    'Imagem', 'Link Imagem',
                    'URL Imagem', 'Imagem URL'
                ]) || '';
            }

            // Se não encontrou título, tentar usar a primeira coluna não vazia
            let finalTitulo = titulo;
            if (!finalTitulo || finalTitulo.trim() === '') {
                const firstValue = Object.values(row).find(v => v && v.toString().trim());
                finalTitulo = firstValue ? firstValue.toString().trim() : `RNC ${index + 1}`;
            }

            return {
                titulo: finalTitulo,
                origem: origem,
                responsavelApontamento: responsavelApontamento,
                responsavelPlanoAcao: responsavelPlanoAcao,
                prazo: prazo,
                dataAbertura: dataAbertura || new Date().toISOString().split('T')[0],
                dataConclusao: dataConclusao || null,
                imagemUrl: imagemUrl
            };
        }).filter(obra => obra.titulo && obra.titulo.trim() !== '' && obra.titulo !== 'RNC');
    }
}

