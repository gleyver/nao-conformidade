/**
 * Slides Manager Module
 * Responsabilidade: Gerenciar slides infinitos (criação, navegação, controle)
 */
class SlidesManager {
    constructor(obras, containerId, indicatorsId) {
        this.obras = obras;
        this.currentSlide = 0;
        this.interval = null;
        this.container = document.getElementById(containerId);
        this.indicators = document.getElementById(indicatorsId);
        this.slideInterval = 8000; // 8 segundos
    }

    /**
     * Inicializa os slides
     */
    init() {
        this.container.innerHTML = '';
        this.indicators.innerHTML = '';
        
        this.obras.forEach((obra, index) => {
            this.createSlide(obra, index);
            this.createIndicator(index);
        });
        
        this.startAutoSlide();
    }

    /**
     * Cria um slide individual
     * @param {Object} obra - Dados da obra
     * @param {number} index - Índice do slide
     */
    createSlide(obra, index) {
        const { imageSrc, fileId } = ImageHandler.processImageUrl(obra.imagemUrl);
        obra.fileId = fileId; // Armazenar para fallback
        
        const slide = document.createElement('div');
        const isActive = index === 0;
        slide.className = `slide absolute w-full h-full transition-all duration-700 ease-in-out bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-6 xl:p-8 2xl:p-10 4k:p-12 flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-4 xl:gap-5 2xl:gap-6 4k:gap-8 shadow-2xl ${isActive ? 'opacity-100 translate-x-0 z-[2]' : 'opacity-0 translate-x-full'}`;
        
        const imageHTML = imageSrc 
            ? ImageHandler.createImageHTML(imageSrc, fileId, obra.titulo, index)
            : ImageHandler.createPlaceholderHTML(obra.titulo);
        
        slide.innerHTML = `
            <!-- Imagem: 65% do espaço -->
            <div class="w-full h-[65%] rounded-xl sm:rounded-2xl overflow-hidden bg-white bg-opacity-15 backdrop-blur-md border-2 sm:border-4 border-white border-opacity-30 flex items-center justify-center">
                ${imageHTML}
            </div>
            
            <!-- Informações: 35% do espaço -->
            <div class="w-full h-[35%] text-white flex flex-col justify-start overflow-y-auto">
                <div class="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl 4k:text-8xl font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-4 xl:mb-5 2xl:mb-6 4k:mb-8 drop-shadow-lg leading-tight">${obra.titulo}</div>
                <div class="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-3 xl:gap-4 2xl:gap-5 4k:gap-6 flex-1">
                    <div class="bg-white bg-opacity-25 backdrop-blur-md p-3 sm:p-4 md:p-5 lg:p-4 xl:p-5 2xl:p-6 4k:p-8 rounded-lg sm:rounded-xl border-2 border-white border-opacity-40">
                        <div class="text-sm xs:text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl 2xl:text-2xl 4k:text-4xl opacity-95 mb-2 sm:mb-3 md:mb-4 lg:mb-3 xl:mb-4 2xl:mb-5 4k:mb-6 uppercase tracking-wider font-semibold">Origem (JOB)</div>
                        <div class="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl 4k:text-5xl font-bold leading-tight">${obra.origem}</div>
                    </div>
                    <div class="bg-white bg-opacity-25 backdrop-blur-md p-3 sm:p-4 md:p-5 lg:p-4 xl:p-5 2xl:p-6 4k:p-8 rounded-lg sm:rounded-xl border-2 border-white border-opacity-40">
                        <div class="text-sm xs:text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl 2xl:text-2xl 4k:text-4xl opacity-95 mb-2 sm:mb-3 md:mb-4 lg:mb-3 xl:mb-4 2xl:mb-5 4k:mb-6 uppercase tracking-wider font-semibold">Responsável Emissão</div>
                        <div class="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl 4k:text-5xl font-bold leading-tight">${obra.responsavelApontamento}</div>
                    </div>
                    <div class="bg-white bg-opacity-25 backdrop-blur-md p-3 sm:p-4 md:p-5 lg:p-4 xl:p-5 2xl:p-6 4k:p-8 rounded-lg sm:rounded-xl border-2 border-white border-opacity-40">
                        <div class="text-sm xs:text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl 2xl:text-2xl 4k:text-4xl opacity-95 mb-2 sm:mb-3 md:mb-4 lg:mb-3 xl:mb-4 2xl:mb-5 4k:mb-6 uppercase tracking-wider font-semibold">Responsável Resolução</div>
                        <div class="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl 4k:text-5xl font-bold leading-tight">${obra.responsavelPlanoAcao}</div>
                    </div>
                    <div class="bg-white bg-opacity-25 backdrop-blur-md p-3 sm:p-4 md:p-5 lg:p-4 xl:p-5 2xl:p-6 4k:p-8 rounded-lg sm:rounded-xl border-2 border-white border-opacity-40">
                        <div class="text-sm xs:text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl 2xl:text-2xl 4k:text-4xl opacity-95 mb-2 sm:mb-3 md:mb-4 lg:mb-3 xl:mb-4 2xl:mb-5 4k:mb-6 uppercase tracking-wider font-semibold">Prazo (dias)</div>
                        <div class="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl 4k:text-5xl font-bold leading-tight">${obra.prazo} dias</div>
                    </div>
                </div>
            </div>
        `;
        
        this.container.appendChild(slide);
    }

    /**
     * Cria um indicador de slide
     * @param {number} index - Índice do slide
     */
    createIndicator(index) {
        const indicator = document.createElement('div');
        indicator.className = `w-2 h-2 xs:w-3 xs:h-3 sm:w-4 sm:h-4 rounded-full bg-indigo-400 cursor-pointer transition-all duration-300 border-2 border-indigo-600 ${index === 0 ? 'bg-indigo-600 scale-125 sm:scale-150 border-indigo-600' : ''}`;
        indicator.onclick = () => this.goToSlide(index);
        this.indicators.appendChild(indicator);
    }

    /**
     * Navega para um slide específico
     * @param {number} index - Índice do slide
     */
    goToSlide(index) {
        if (this.obras.length === 0) return;
        
        const slides = document.querySelectorAll('.slide');
        const indicators = document.querySelectorAll('.indicator');
        
        if (slides[this.currentSlide]) {
            slides[this.currentSlide].classList.remove('active', 'opacity-100', 'translate-x-0', 'z-[2]');
            slides[this.currentSlide].classList.add('opacity-0', 'translate-x-full');
        }
        if (indicators[this.currentSlide]) {
            indicators[this.currentSlide].classList.remove('active', 'bg-indigo-600', 'scale-125', 'sm:scale-150', 'border-indigo-600');
            indicators[this.currentSlide].classList.add('bg-indigo-400');
        }
        
        this.currentSlide = index % this.obras.length;
        
        if (slides[this.currentSlide]) {
            slides[this.currentSlide].classList.add('active', 'opacity-100', 'translate-x-0', 'z-[2]');
            slides[this.currentSlide].classList.remove('opacity-0', 'translate-x-full');
        }
        if (indicators[this.currentSlide]) {
            indicators[this.currentSlide].classList.add('active', 'bg-indigo-600', 'scale-125', 'sm:scale-150', 'border-indigo-600');
            indicators[this.currentSlide].classList.remove('bg-indigo-400');
        }
        
        this.resetInterval();
    }

    /**
     * Vai para o próximo slide
     */
    next() {
        if (this.obras.length === 0) return;
        const next = (this.currentSlide + 1) % this.obras.length;
        this.goToSlide(next);
    }

    /**
     * Vai para o slide anterior
     */
    previous() {
        if (this.obras.length === 0) return;
        const prev = (this.currentSlide - 1 + this.obras.length) % this.obras.length;
        this.goToSlide(prev);
    }

    /**
     * Inicia o slide automático
     */
    startAutoSlide() {
        this.resetInterval();
    }

    /**
     * Reinicia o intervalo automático
     */
    resetInterval() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        if (this.obras.length > 0) {
            this.interval = setInterval(() => this.next(), this.slideInterval);
        }
    }

    /**
     * Atualiza os slides com novos dados
     * @param {Array<Object>} novasObras - Novos dados de obras
     */
    update(novasObras) {
        this.obras = novasObras;
        this.currentSlide = 0;
        this.init();
    }
}

// Funções globais para os botões
window.nextSlide = function() {
    if (window.slidesManager) {
        window.slidesManager.next();
    }
};

window.previousSlide = function() {
    if (window.slidesManager) {
        window.slidesManager.previous();
    }
};

