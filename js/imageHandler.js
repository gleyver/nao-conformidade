/**
 * Image Handler Module
 * Responsabilidade: Processar e converter URLs de imagens do Google Drive
 */
class ImageHandler {
    /**
     * Extrai o ID do arquivo de diferentes formatos de URL do Google Drive
     * @param {string} url - URL do Google Drive
     * @returns {string|null} ID do arquivo ou null
     */
    static extractFileId(url) {
        if (!url) return null;
        
        let fileId = null;
        
        // Tentar extrair ID de diferentes formatos de URL do Google Drive
        // Formato: https://drive.google.com/open?id=FILE_ID
        const matchOpen = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        // Formato: https://drive.google.com/file/d/FILE_ID/view ou /d/FILE_ID/
        const matchFile = url.match(/\/[df]+\/([a-zA-Z0-9_-]+)/);
        // Formato: drive.usercontent.google.com/download?id=FILE_ID
        const matchDownload = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        
        // Priorizar match mais específico
        if (matchFile) {
            fileId = matchFile[1];
        } else if (matchOpen) {
            fileId = matchOpen[1];
        } else if (matchDownload) {
            fileId = matchDownload[1];
        }
        // Se parece ser apenas um ID (sem http)
        else if (url.length > 20 && url.length < 50 && !url.includes('http') && !url.includes('://')) {
            fileId = url.trim();
        }
        
        if (fileId) {
            // Limpar o ID (remover caracteres inválidos)
            return fileId.replace(/[^a-zA-Z0-9_-]/g, '');
        }
        
        return null;
    }

    /**
     * Converte URL do Google Drive para formato de visualização direta
     * @param {string} url - URL original do Google Drive
     * @returns {Object} Objeto com {imageSrc, fileId}
     */
    static processImageUrl(url) {
        if (!url) {
            return { imageSrc: '', fileId: null };
        }

        let processedUrl = url.trim();
        
        // Se tem múltiplas URLs separadas por vírgula, pegar a primeira
        if (processedUrl.includes(',')) {
            processedUrl = processedUrl.split(',')[0].trim();
        }
        
        const fileId = this.extractFileId(processedUrl);
        
        if (fileId) {
            // Usar formato padrão que funciona com imagens públicas
            const imageSrc = `https://drive.google.com/uc?export=view&id=${fileId}`;
            console.log(`ID extraído=${fileId}, URL gerada=${imageSrc}`);
            return { imageSrc, fileId };
        }
        
        // Se a URL já está no formato correto, usar diretamente
        if (processedUrl.includes('drive.usercontent.google.com')) {
            console.log(`URL já está no formato correto=${processedUrl}`);
            return { imageSrc: processedUrl, fileId: null };
        }
        
        // Tentar usar a URL original
        console.warn(`Não foi possível extrair ID da URL=${processedUrl}`);
        return { imageSrc: processedUrl, fileId: null };
    }

    /**
     * Cria HTML para imagem com fallback para iframe
     * @param {string} imageSrc - URL da imagem
     * @param {string} fileId - ID do arquivo no Google Drive
     * @param {string} titulo - Título da obra
     * @param {number} index - Índice do slide
     * @returns {string} HTML da imagem
     */
    static createImageHTML(imageSrc, fileId, titulo, index) {
        if (!imageSrc) {
            return this.createPlaceholderHTML(titulo);
        }

        const iframeFallback = fileId ? `
            const fileId = '${fileId}';
            console.log('Tentando iframe como fallback para:', fileId);
            const iframe = document.createElement('iframe');
            iframe.src = 'https://drive.google.com/file/d/' + fileId + '/preview';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.borderRadius = '15px';
            iframe.allow = 'autoplay';
            container.appendChild(iframe);
        ` : `
            const placeholder = document.createElement('div');
            placeholder.className = 'slide-image-placeholder';
            placeholder.innerHTML = '<div><svg width=\\'150\\' height=\\'150\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'><rect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\' ry=\\'2\\'></rect><circle cx=\\'8.5\\' cy=\\'8.5\\' r=\\'1.5\\'></circle><polyline points=\\'21 15 16 10 5 21\\'></polyline></svg><div>Imagem não disponível</div><div style=\\'font-size: 0.8em; margin-top: 10px; opacity: 0.7;\\'>Arquivo precisa estar público no Drive</div><div style=\\'font-size: 0.7em; margin-top: 5px; opacity: 0.6;\\'>Ou faça login no Google</div><div class=\\'subtitle\\'>${titulo}</div></div>';
            container.appendChild(placeholder);
        `;

        return `
            <img src="${imageSrc}" 
                 alt="${titulo}" 
                 class="w-full h-full object-cover"
                 id="img-${index}"
                 onerror="
                    console.error('Erro ao carregar imagem direta:', '${imageSrc}');
                    this.style.display='none';
                    const container = this.parentElement;
                    ${iframeFallback}
                 "
                 onload="console.log('Imagem carregada com sucesso:', '${imageSrc}')">
            <div class="w-full h-full flex items-center justify-center text-white text-center p-6 sm:p-8 md:p-10 hidden">
                <div>
                    <svg class="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 2xl:w-64 2xl:h-64 4k:w-80 4k:h-80 opacity-60 mx-auto mb-4 sm:mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <div class="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 4k:text-5xl font-bold">Carregando imagem...</div>
                    <div class="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 4k:text-4xl mt-3 sm:mt-4 opacity-80">${titulo}</div>
                </div>
            </div>
        `;
    }

    /**
     * Cria HTML do placeholder quando não há imagem
     * @param {string} titulo - Título da obra
     * @returns {string} HTML do placeholder
     */
    static createPlaceholderHTML(titulo) {
        return `
            <div class="w-full h-full flex items-center justify-center text-white text-center p-6 sm:p-8 md:p-10">
                <div>
                    <svg class="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 2xl:w-64 2xl:h-64 4k:w-80 4k:h-80 opacity-60 mx-auto mb-4 sm:mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <div class="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 4k:text-5xl font-bold">Imagem da Não Conformidade</div>
                    <div class="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 4k:text-4xl mt-3 sm:mt-4 opacity-80">${titulo}</div>
                </div>
            </div>
        `;
    }
}

