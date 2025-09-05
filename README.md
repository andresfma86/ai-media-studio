# AI Media Studio

Um aplicativo web moderno que combina os modelos de IA mais avançados do Google (Nano Banana e Veo) em uma única plataforma para geração e edição de imagens e vídeos com controles visuais avançados.

## 🚀 Funcionalidades

### Canvas Interativo
- Desenho direto sobre imagens
- Ferramentas de pincel, borracha, formas geométricas
- Sistema de camadas (layers)
- Histórico de ações (undo/redo)
- Zoom e pan
- Upload e exportação de imagens

### Geração de Imagens (Nano Banana)
- Geração de imagens a partir de texto
- Edição de imagens existentes
- Múltiplos estilos artísticos
- Controle de qualidade e criatividade
- Diferentes proporções de aspecto
- Prompts negativos para maior controle

### Geração de Vídeos (Veo)
- Criação de vídeos a partir de texto
- Vídeos de até 30 segundos
- Áudio gerado automaticamente
- Controles de movimento de câmera
- Diferentes qualidades e FPS
- Múltiplas proporções de aspecto

### Galeria Inteligente
- Visualização de todos os itens gerados
- Controles de reprodução para vídeos
- Download e compartilhamento
- Metadados detalhados
- Organização por tipo de mídia

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18+ com Vite
- **Styling**: Tailwind CSS + Shadcn/UI
- **Canvas**: Konva.js + React-Konva
- **Estado**: Zustand
- **Ícones**: Lucide React
- **Animações**: Framer Motion

## 📋 Pré-requisitos

- Node.js 18.18 ou superior
- npm ou pnpm
- Conta no Google Cloud Platform
- APIs habilitadas:
  - Generative Language API (Nano Banana)
  - Vertex AI API (Veo)

## 🚀 Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd ai-media-studio
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   # ou
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas credenciais:
   ```env
   REACT_APP_GOOGLE_API_KEY=sua_api_key_aqui
   REACT_APP_GOOGLE_PROJECT_ID=seu_project_id_aqui
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   pnpm run dev
   # ou
   npm run dev
   ```

5. **Acesse a aplicação**
   ```
   http://localhost:5173
   ```

## 🔧 Configuração das APIs

### Google Cloud Setup

1. **Crie um projeto no Google Cloud Console**
   - Acesse [Google Cloud Console](https://console.cloud.google.com)
   - Crie um novo projeto ou selecione um existente

2. **Habilite as APIs necessárias**
   ```bash
   # Generative Language API (Nano Banana)
   gcloud services enable generativelanguage.googleapis.com
   
   # Vertex AI API (Veo)
   gcloud services enable aiplatform.googleapis.com
   ```

3. **Crie uma API Key**
   - Vá para "APIs & Services" > "Credentials"
   - Clique em "Create Credentials" > "API Key"
   - Copie a chave gerada

4. **Configure as permissões**
   - Restrinja a API Key aos serviços necessários
   - Configure as origens permitidas

### Nano Banana (Gemini 2.5 Flash Image)
- Endpoint: `https://generativelanguage.googleapis.com/v1beta`
- Modelo: `gemini-2.5-flash`
- Funcionalidades: Geração e edição de imagens

### Veo (Video Generation)
- Endpoint: `https://aiplatform.googleapis.com/v1`
- Modelo: `veo-001`
- Funcionalidades: Geração de vídeos com áudio

## 📁 Estrutura do Projeto

```
ai-media-studio/
├── public/                 # Arquivos estáticos
├── src/
│   ├── api/               # Serviços de API
│   │   └── aiService.js   # Integração com APIs de IA
│   ├── components/        # Componentes React
│   │   ├── AIControls/    # Controles de IA
│   │   ├── Canvas/        # Canvas interativo
│   │   ├── Gallery/       # Galeria de mídia
│   │   ├── Layout/        # Componentes de layout
│   │   └── ui/           # Componentes de UI (Shadcn)
│   ├── hooks/            # Hooks personalizados
│   │   └── useAI.js      # Hook para gerenciar IA
│   ├── lib/              # Utilitários
│   ├── App.jsx           # Componente principal
│   └── main.jsx          # Ponto de entrada
├── .env.example          # Exemplo de variáveis de ambiente
├── package.json          # Dependências do projeto
└── README.md            # Documentação
```

## 🎨 Componentes Principais

### ImageCanvas
Canvas interativo para edição de imagens com ferramentas de desenho.

### ImageControls
Painel de controles para geração e edição de imagens com Nano Banana.

### VideoControls
Painel de controles para geração de vídeos com Veo.

### MediaGallery
Galeria para visualização, download e compartilhamento de mídia gerada.

## 🔄 Fluxo de Trabalho

1. **Upload/Criação**: Carregue uma imagem ou inicie uma nova criação
2. **Edição Canvas**: Use as ferramentas visuais para desenhar e editar
3. **Processamento IA**: Envie para os modelos de IA (Nano Banana ou Veo)
4. **Resultado**: Visualize o resultado processado
5. **Refinamento**: Faça ajustes adicionais se necessário
6. **Export**: Baixe ou compartilhe o resultado final

## 🚀 Deploy

### Desenvolvimento Local
```bash
pnpm run dev
```

### Build de Produção
```bash
pnpm run build
```

### Preview da Build
```bash
pnpm run preview
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Se você encontrar problemas ou tiver dúvidas:

1. Verifique a [documentação das APIs do Google](https://cloud.google.com/docs)
2. Consulte os [issues do projeto](../../issues)
3. Crie um novo issue se necessário

## 🔮 Roadmap

- [ ] Integração com mais modelos de IA
- [ ] Editor de vídeo avançado
- [ ] Colaboração em tempo real
- [ ] Templates predefinidos
- [ ] API própria para integração
- [ ] Aplicativo mobile

---

Desenvolvido com ❤️ usando as mais avançadas tecnologias de IA do Google.

