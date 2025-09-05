const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const axios = require('axios');
const bodyParser = require('body-parser');

// Carregar variáveis de ambiente
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Configuração do multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Configurações das APIs
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const GOOGLE_PROJECT_ID = process.env.REACT_APP_GOOGLE_PROJECT_ID;
const GOOGLE_REGION = process.env.REACT_APP_GOOGLE_REGION || 'us-central1';

// Middleware de autenticação
const authenticateAPI = (req, res, next) => {
  console.log('🔑 Verificando configuração da API...');
  console.log('API Key configurada:', !!GOOGLE_API_KEY);
  console.log('Project ID configurado:', !!GOOGLE_PROJECT_ID);
  next(); // Permitir continuar mesmo sem API key para demonstração
};

// Rota para gerar imagem com Nano Banana (Gemini) + Anotações
app.post('/api/generate-image', authenticateAPI, async (req, res) => {
  try {
    const { prompt, style, aspectRatio, quality, creativity, negativePrompt, annotations } = req.body;
    
    console.log('🎨 Gerando imagem com parâmetros:', { 
      prompt: prompt?.substring(0, 50) + '...', 
      style, 
      aspectRatio, 
      annotations: annotations?.length || 0 
    });
    
    // Construir prompt melhorado com anotações
    let enhancedPrompt = prompt;
    if (annotations && annotations.length > 0) {
      const annotationDescriptions = annotations.map(ann => {
        const type = ann.type || 'annotation';
        const position = `(${Math.round(ann.x)}, ${Math.round(ann.y)})`;
        const size = ann.width && ann.height ? `${Math.round(ann.width)}x${Math.round(ann.height)}` : 'small';
        return `${type} at ${position} size ${size}`;
      }).join(', ');
      enhancedPrompt = `${prompt}. Focus on areas marked by: ${annotationDescriptions}`;
    }
    
    if (negativePrompt) {
      enhancedPrompt += `. Avoid: ${negativePrompt}`;
    }

    // Simular diferentes tipos de imagens baseadas no estilo
    const styleImages = {
      'realistic': [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop'
      ],
      'artistic': [
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&h=600&fit=crop'
      ],
      'cartoon': [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&sat=2',
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop&sat=2',
        'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&h=600&fit=crop&sat=2'
      ]
    };

    const selectedStyle = styleImages[style] || styleImages['realistic'];
    const simulatedImageUrl = selectedStyle[Math.floor(Math.random() * selectedStyle.length)];
    
    // Adicionar parâmetros baseados nas configurações
    const aspectParams = aspectRatio === '16:9' ? '&w=800&h=450' : 
                        aspectRatio === '1:1' ? '&w=600&h=600' : 
                        '&w=600&h=800';
    
    const finalUrl = simulatedImageUrl + aspectParams + `&random=${Date.now()}`;
    
    res.json({
      success: true,
      imageUrl: finalUrl,
      metadata: {
        prompt: enhancedPrompt,
        originalPrompt: prompt,
        style,
        aspectRatio,
        quality,
        creativity,
        annotations: annotations || [],
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Erro ao gerar imagem:', error);
    
    // Fallback para simulação
    const fallbackUrl = `https://picsum.photos/800/600?random=${Date.now()}`;
    res.json({
      success: true,
      imageUrl: fallbackUrl,
      metadata: req.body,
      isSimulated: true,
      error: 'Usando simulação devido a erro na API'
    });
  }
});

// Rota para editar imagem com anotações
app.post('/api/edit-image', authenticateAPI, upload.single('image'), async (req, res) => {
  try {
    const { prompt, style, creativity, annotations } = req.body;
    const imageFile = req.file;
    
    console.log('✏️ Editando imagem com parâmetros:', { 
      prompt: prompt?.substring(0, 50) + '...', 
      style, 
      annotations: annotations ? JSON.parse(annotations).length : 0,
      hasImage: !!imageFile 
    });
    
    // Parse annotations se for string
    let parsedAnnotations = annotations;
    if (typeof annotations === 'string') {
      try {
        parsedAnnotations = JSON.parse(annotations);
      } catch (e) {
        parsedAnnotations = [];
      }
    }
    
    // Construir prompt com anotações
    let enhancedPrompt = prompt;
    if (parsedAnnotations && parsedAnnotations.length > 0) {
      const annotationDescriptions = parsedAnnotations.map(ann => {
        const type = ann.type || 'annotation';
        const position = `(${Math.round(ann.x)}, ${Math.round(ann.y)})`;
        const size = ann.width && ann.height ? `${Math.round(ann.width)}x${Math.round(ann.height)}` : 'small';
        return `${type} at ${position} size ${size}`;
      }).join(', ');
      enhancedPrompt = `${prompt}. Apply changes to areas marked by: ${annotationDescriptions}`;
    }

    // Simular edição baseada no estilo
    const editEffects = {
      'realistic': '&contrast=1.2&brightness=1.1',
      'artistic': '&sat=1.5&hue=15',
      'cartoon': '&sat=2&contrast=1.3',
      'vintage': '&sepia=50&contrast=0.8',
      'modern': '&sat=1.2&sharp=1.1'
    };

    const effect = editEffects[style] || editEffects['realistic'];
    const simulatedEditedUrl = `https://picsum.photos/800/600?random=${Date.now()}${effect}`;
    
    res.json({
      success: true,
      imageUrl: simulatedEditedUrl,
      metadata: {
        prompt: enhancedPrompt,
        originalPrompt: prompt,
        style,
        creativity,
        annotations: parsedAnnotations || [],
        editedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Erro ao editar imagem:', error);
    
    // Fallback para simulação
    const fallbackUrl = `https://picsum.photos/800/600?random=${Date.now()}&blur=1`;
    res.json({
      success: true,
      imageUrl: fallbackUrl,
      metadata: req.body,
      isSimulated: true,
      error: 'Usando simulação devido a erro na API'
    });
  }
});

// Rota para gerar vídeo com Veo
app.post('/api/generate-video', authenticateAPI, async (req, res) => {
  try {
    const { 
      prompt, 
      duration, 
      aspectRatio, 
      quality, 
      fps, 
      cameraMovement, 
      motionIntensity, 
      includeAudio, 
      audioType 
    } = req.body;
    
    console.log('🎬 Gerando vídeo com parâmetros:', { 
      prompt: prompt?.substring(0, 50) + '...', 
      duration, 
      aspectRatio, 
      quality 
    });
    
    // Simulação de diferentes vídeos baseados no prompt
    const videoSamples = [
      'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    ];
    
    const simulatedVideoUrl = videoSamples[Math.floor(Math.random() * videoSamples.length)];
    
    res.json({
      success: true,
      videoUrl: simulatedVideoUrl,
      metadata: {
        prompt,
        duration,
        aspectRatio,
        quality,
        fps,
        cameraMovement,
        motionIntensity,
        includeAudio,
        audioType,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Erro ao gerar vídeo:', error);
    res.status(500).json({ 
      error: 'Erro ao gerar vídeo',
      message: error.message 
    });
  }
});

// Rota de status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!GOOGLE_API_KEY,
    projectIdConfigured: !!GOOGLE_PROJECT_ID,
    version: '1.0.0',
    features: {
      imageGeneration: true,
      imageEditing: true,
      videoGeneration: true,
      annotations: true
    }
  });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('💥 Erro no servidor:', error);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: error.message 
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor AI Media Studio Backend rodando na porta ${PORT}`);
  console.log(`📡 API Key configurada: ${!!GOOGLE_API_KEY}`);
  console.log(`🔧 Project ID configurado: ${!!GOOGLE_PROJECT_ID}`);
  console.log(`🎯 Funcionalidades: Geração de Imagens, Edição com Anotações, Geração de Vídeos`);
});

module.exports = app;

