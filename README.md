# 📊 Dashboard de Não Conformidades - RNC

Dashboard interativo para exibição em TV/Painel com slides infinitos, gráficos estatísticos e visualização detalhada de não conformidades (RNCs).

![Dashboard Preview](https://img.shields.io/badge/Status-Produção-brightgreen)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Ready-blue)
![Responsive](https://img.shields.io/badge/Responsive-320px--4K-orange)

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Funciona](#-como-funciona)
- [Instalação e Uso Local](#-instalação-e-uso-local)
- [Deploy no GitHub Pages](#-deploy-no-github-pages)
- [Configuração](#-configuração)
- [Atualização de Dados](#-atualização-de-dados)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Sobre o Projeto

Este dashboard foi desenvolvido para exibir informações de não conformidades (RNCs) em tempo real, ideal para:

- **Painéis de TV** em escritórios e fábricas
- **Monitores de acompanhamento** de qualidade
- **Apresentações** de status de projetos
- **Visualização remota** via GitHub Pages

### Características Principais

- ✅ **Design Responsivo**: Funciona de 320px (mobile) até 4K (TV)
- ✅ **Atualização Automática**: Dados atualizados a cada 10 minutos
- ✅ **Slides Infinitos**: Navegação automática entre não conformidades
- ✅ **Gráficos Interativos**: Visualização de aberturas e conclusões
- ✅ **Imagens do Google Drive**: Suporte completo com fallback automático
- ✅ **Arquitetura Modular**: Código organizado seguindo SRP (Single Responsibility Principle)

---

## ✨ Funcionalidades

### 📈 Visão Geral
- **Estatísticas em Tempo Real**: Total de RNCs, abertas, concluídas e prazo médio
- **Gráfico de Abertura**: Barras mostrando RNCs abertas por mês
- **Gráfico de Conclusão**: Linha mostrando RNCs concluídas por mês

### 🖼️ Detalhes das Não Conformidades
- **Slides Automáticos**: Transição a cada 8 segundos
- **Layout Otimizado**: 65% imagem, 35% informações
- **Navegação Manual**: Botões e indicadores para controle
- **Informações Completas**: Título, origem, responsáveis e prazo

### 🔄 Atualização Automática
- **Frontend**: Atualiza interface a cada 10 minutos
- **GitHub Actions**: Atualiza arquivo CSV automaticamente
- **Fallback Inteligente**: Usa dados locais se online falhar

### 📱 Responsividade
- **Mobile (320px+)**: Layout em coluna única
- **Desktop (1024px+)**: Layout em 2 colunas (Visão Geral | Detalhes)
- **TV 4K (3840px)**: Otimizado para telas grandes

---

## 📁 Estrutura do Projeto

O projeto foi organizado seguindo o **Princípio da Responsabilidade Única (SRP)**, com cada módulo tendo uma responsabilidade específica:

```
nao-conformidades/
├── index.html              # Estrutura HTML e inicialização
├── dados/
│   └── dados.csv          # Dados locais (fallback)
├── css/
│   └── styles.css         # Estilos customizados
├── js/
│   ├── csvParser.js       # Parse de arquivos CSV
│   ├── dataMapper.js      # Mapeamento de dados do CSV
│   ├── imageHandler.js    # Tratamento de imagens do Google Drive
│   ├── dataFetcher.js     # Busca de dados (online/local)
│   ├── statsCalculator.js # Cálculo de estatísticas
│   ├── chartsManager.js   # Gerenciamento de gráficos Chart.js
│   ├── slidesManager.js   # Gerenciamento de slides infinitos
│   └── app.js             # Orquestração principal da aplicação
├── scripts/
│   ├── atualizar-dados.js        # Script para atualizar CSV
│   ├── atualizar-dados-loop.js   # Script em loop (sem cron)
│   ├── configurar-cron.sh        # Configurador de cron job
│   ├── preparar-github.sh        # Preparação para GitHub Pages
│   └── README.md                 # Documentação dos scripts
└── .github/
    └── workflows/
        ├── atualizar-dados.yml         # GitHub Actions (público)
        └── atualizar-dados-privado.yml # GitHub Actions (privado)
```

---

## 🔧 Como Funciona

### Fluxo de Dados

1. **Carregamento Inicial**:
   - Tenta carregar `dados/dados.csv` local
   - Se falhar, busca do Google Sheets online

2. **Processamento**:
   - CSV é parseado em objetos JavaScript
   - Dados são mapeados para formato padronizado
   - URLs de imagens são processadas

3. **Renderização**:
   - Estatísticas são calculadas e exibidas
   - Gráficos são criados com Chart.js
   - Slides são gerados dinamicamente

4. **Atualização Automática**:
   - Frontend atualiza a cada 10 minutos
   - GitHub Actions atualiza CSV a cada 10 minutos

### Arquitetura Modular

Cada módulo tem uma responsabilidade única:

| Módulo | Responsabilidade |
|--------|------------------|
| `csvParser.js` | Converter CSV em objetos JavaScript |
| `dataMapper.js` | Mapear dados do CSV para formato padronizado |
| `imageHandler.js` | Processar URLs de imagens do Google Drive |
| `dataFetcher.js` | Buscar dados (online/local) |
| `statsCalculator.js` | Calcular estatísticas |
| `chartsManager.js` | Gerenciar gráficos Chart.js |
| `slidesManager.js` | Gerenciar slides infinitos |
| `app.js` | Orquestrar todos os módulos |

---

## 💻 Instalação e Uso Local

### Pré-requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Servidor HTTP local (opcional, mas recomendado)

### Executar Localmente

#### Opção 1: Servidor HTTP Simples (Recomendado)

```bash
# Python 3
python3 -m http.server 8000

# Node.js (http-server)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Acesse: `http://localhost:8000`

#### Opção 2: Abrir Diretamente

Simplesmente abra `index.html` no navegador (algumas funcionalidades podem não funcionar devido a CORS).

### Configurar Intervalo de Atualização para Teste

Para testar a atualização rapidamente, edite `js/app.js` no início do arquivo:

```javascript
// Linha 12 - Para teste rápido (30 segundos)
const UPDATE_INTERVAL = 30 * 1000;

// Linha 12 - Para produção (10 minutos)
const UPDATE_INTERVAL = 10 * 60 * 1000;
```

---

## 🚀 Deploy no GitHub Pages

### Passo a Passo Completo

#### 1. Criar Repositório no GitHub

1. Acesse [GitHub](https://github.com) e faça login
2. Clique em **"New repository"** (ou **"+"** → **"New repository"**)
3. Preencha:
   - **Repository name**: `nao-conformidades` (ou outro nome)
   - **Description**: Dashboard de Não Conformidades - RNC
   - **Visibility**: **Público** ⚠️ (necessário para GitHub Pages gratuito)
   - **NÃO** marque "Initialize with README"
4. Clique em **"Create repository"**

#### 2. Preparar e Enviar Código

```bash
# No diretório do projeto
cd /caminho/para/nao-conformidades

# Inicializar git (se ainda não fez)
git init

# Adicionar todos os arquivos
git add .

# Primeiro commit
git commit -m "🎉 Initial commit - Dashboard de Não Conformidades"

# Adicionar repositório remoto (substitua SEU_USUARIO pelo seu username)
git remote add origin https://github.com/SEU_USUARIO/nao-conformidades.git

# Renomear branch para main (se necessário)
git branch -M main

# Enviar para GitHub
git push -u origin main
```

#### 3. Configurar GitHub Pages

1. No repositório do GitHub, vá em **Settings** (Configurações)
2. No menu lateral, clique em **Pages**
3. Em **Source** (Origem), selecione:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Clique em **Save** (Salvar)

#### 4. Aguardar Publicação

Após alguns minutos (geralmente 1-2 minutos), seu dashboard estará disponível em:

```
https://SEU_USUARIO.github.io/nao-conformidades/
```

### ✅ Verificar se Funcionou

1. Acesse a URL do GitHub Pages
2. O dashboard deve carregar automaticamente
3. Vá em **Actions** no repositório para ver o workflow de atualização

---

## ⚙️ Configuração

### Configurar Planilha do Google Sheets

Edite `index.html` (linhas 96-99) para alterar a planilha:

```javascript
const CONFIG = {
    sheetId: 'SEU_SHEET_ID_AQUI',
    gid: 'SEU_GID_AQUI'
};
```

**Como encontrar:**
- `sheetId`: ID na URL da planilha: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`
- `gID`: ID da aba específica (veja na URL quando selecionar a aba)

### Tornar Planilha Pública

⚠️ **IMPORTANTE**: A planilha precisa estar pública para funcionar!

1. Abra a planilha no Google Sheets
2. Clique em **"Compartilhar"** (canto superior direito)
3. Clique em **"Alterar para qualquer pessoa com o link"**
4. Defina como **"Leitor"**
5. Clique em **"Concluído"**

### Configurar Intervalo de Atualização

Edite `js/app.js` no início do arquivo (linha 12):

```javascript
const UPDATE_INTERVAL = 10 * 60 * 1000; // 10 minutos
```

**Opções:**
- `30 * 1000` - 30 segundos (teste)
- `1 * 60 * 1000` - 1 minuto
- `5 * 60 * 1000` - 5 minutos
- `10 * 60 * 1000` - 10 minutos (padrão)
- `60 * 60 * 1000` - 1 hora

---

## 🔄 Atualização de Dados

### Atualização Automática (GitHub Pages)

O projeto já está configurado com **GitHub Actions** que atualiza automaticamente:

- ✅ **Repositório PÚBLICO**: ILIMITADO (gratuito)
- ⚠️ **Repositório PRIVADO**: 2.000 min/mês (use workflow alternativo)

O workflow `.github/workflows/atualizar-dados.yml` executa a cada 10 minutos automaticamente.

### Atualização Manual Local

#### Opção 1: Script em Loop (Mais Simples) ⭐

```bash
# Executar e deixar rodando
node scripts/atualizar-dados-loop.js

# Ou em background
nohup node scripts/atualizar-dados-loop.js > logs/loop.log 2>&1 &
```

#### Opção 2: Cron Job (Mais Robusto)

```bash
# Configurar automaticamente
bash scripts/configurar-cron.sh

# Ou executar manualmente
node scripts/atualizar-dados.js
```

#### Opção 3: Manual

```bash
curl -L "https://docs.google.com/spreadsheets/d/1Md5fP17bXGEEmRXlbsTTo68F9ILROsAD9iPisUoNJ6g/export?format=csv&gid=1443492060" -o dados/dados.csv
```

📖 Veja `scripts/COMO_USAR.md` para mais detalhes.

---

## 🐛 Troubleshooting

### Dashboard não carrega dados

**Problema**: Erro "Erro ao carregar dados"

**Soluções**:
1. ✅ Verifique se a planilha está **pública**
2. ✅ Abra o Console do navegador (F12) para ver erros
3. ✅ Verifique se `dados/dados.csv` existe no repositório
4. ✅ Teste a URL da planilha diretamente no navegador

### Imagens não aparecem

**Problema**: "Imagem não disponível"

**Soluções**:
1. ✅ Torne as imagens **públicas** no Google Drive
2. ✅ Verifique se a URL da imagem está correta no CSV
3. ✅ O dashboard tentará usar iframe automaticamente

### GitHub Actions não atualiza

**Problema**: Workflow falha ou não executa

**Soluções**:
1. ✅ Vá em **Actions** → veja logs de erro
2. ✅ Verifique se a planilha está pública
3. ✅ Verifique se o repositório é público (para Actions ilimitado)
4. ✅ Para repositório privado, use `.github/workflows/atualizar-dados-privado.yml`

### CORS Errors

**Problema**: Erros de CORS no console

**Soluções**:
1. ✅ A planilha precisa estar pública
2. ✅ GitHub Pages usa HTTPS, então precisa de planilha pública
3. ✅ Use o arquivo local `dados/dados.csv` como fallback

### Slides não mudam automaticamente

**Problema**: Slides ficam parados

**Soluções**:
1. ✅ Verifique o Console (F12) para erros
2. ✅ Certifique-se de que há dados carregados
3. ✅ O intervalo é de 8 segundos (configurável em `slidesManager.js`)

---

## 📊 Limites e Recursos

### GitHub Actions

| Tipo de Repositório | Limite de Minutos |
|---------------------|-------------------|
| **Público** | ✅ **ILIMITADO** |
| **Privado** | ⚠️ 2.000 min/mês |

**Cálculo do uso atual:**
- Executa a cada 10 minutos = 144 vezes/dia = ~4.320 vezes/mês
- Cada execução leva ~1-2 minutos
- **Total estimado: ~4.320-8.640 minutos/mês**

**Recomendação**: Use repositório **PÚBLICO** para GitHub Pages gratuito e Actions ilimitado.

### GitHub Pages

- ✅ **Gratuito** para repositórios públicos
- ✅ **HTTPS** automático
- ✅ **Custom domain** suportado
- ✅ **Sem limites** de tráfego

---

## 🎨 Personalização

### Alterar Cores

Edite `index.html` para alterar o gradiente:

```html
<!-- Linha 23 -->
<body class="... bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 ...">
```

### Alterar Intervalo dos Slides

Edite `js/slidesManager.js` (linha 12):

```javascript
this.slideInterval = 8000; // 8 segundos
```

### Alterar Layout

- **Proporção Imagem/Textos**: `js/slidesManager.js` (linhas 49 e 54)
- **Layout Desktop**: `index.html` (linha 30)

---

## 📝 Licença

Este projeto está disponível para uso livre.

---

## 🤝 Contribuindo

Sugestões e melhorias são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a seção [Troubleshooting](#-troubleshooting)
2. Abra uma issue no GitHub
3. Consulte os logs do Console do navegador (F12)

---

**Desenvolvido com ❤️ para visualização de dados em tempo real**
