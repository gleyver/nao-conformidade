/**
 * CSV Parser Module
 * Responsabilidade: Converter texto CSV em array de objetos JavaScript
 */
class CSVParser {
    /**
     * Converte texto CSV em array de objetos
     * @param {string} csvText - Texto CSV completo
     * @returns {Array<Object>} Array de objetos com os dados parseados
     */
    static parse(csvText) {
        if (!csvText || csvText.trim().length === 0) {
            console.warn('CSV vazio');
            return [];
        }
        
        const allLines = csvText.split('\n');
        const lines = allLines.filter(line => line.trim());
        
        if (lines.length < 2) {
            console.warn('CSV tem menos de 2 linhas. Total de linhas:', lines.length);
            return [];
        }

        // Detectar onde começa os dados (primeira linha com data DD/MM/YYYY HH:MM:SS)
        let dataStartIndex = 1;
        for (let i = 0; i < Math.min(10, lines.length); i++) {
            if (lines[i].match(/^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2}/)) {
                dataStartIndex = i;
                break;
            }
        }
        
        // Juntar todas as linhas antes dos dados como cabeçalho
        let headerLine = '';
        for (let i = 0; i < dataStartIndex; i++) {
            headerLine += lines[i];
        }
        
        const headers = this.parseCSVLine(headerLine)
            .map(h => h.replace(/^"|"$/g, '').trim())
            .filter(h => h);
        
        console.log('Cabeçalhos detectados:', headers);
        console.log('Total de colunas:', headers.length);
        console.log('Primeira linha de dados na posição:', dataStartIndex);
        
        const data = [];
        
        // Processar linhas de dados
        let currentLine = '';
        for (let i = dataStartIndex; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Se começa com data/hora, é uma nova linha de dados
            if (line.match(/^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2}/)) {
                // Processar linha anterior se existir
                if (currentLine) {
                    const values = this.parseCSVLine(currentLine)
                        .map(v => v.replace(/^"|"$/g, '').trim());
                    if (values.length > 0 && values[0]) {
                        const obj = {};
                        headers.forEach((header, index) => {
                            obj[header] = values[index] || '';
                        });
                        data.push(obj);
                    }
                }
                currentLine = line;
            } else {
                // Continuação da linha anterior (descrição com quebras de linha)
                currentLine += ' ' + line;
            }
        }
        
        // Processar última linha
        if (currentLine) {
            const values = this.parseCSVLine(currentLine)
                .map(v => v.replace(/^"|"$/g, '').trim());
            if (values.length > 0 && values[0]) {
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = values[index] || '';
                });
                data.push(obj);
            }
        }

        console.log('Total de registros parseados:', data.length);
        return data;
    }

    /**
     * Faz parse de uma linha CSV considerando aspas e vírgulas dentro de campos
     * @param {string} line - Linha CSV
     * @returns {Array<string>} Array de valores parseados
     */
    static parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++; // Pular próxima aspas
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    }
}

