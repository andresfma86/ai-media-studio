import React, { useState } from 'react';
import { useAI } from './hooks/useAI.js';
import Header from './components/Layout/Header.jsx';
import AnnotationCanvas from './components/Canvas/AnnotationCanvas.jsx';
import EnhancedImageControls from './components/AIControls/EnhancedImageControls.jsx';
import VideoControls from './components/AIControls/VideoControls.jsx';
import MediaGallery from './components/Gallery/MediaGallery.jsx';
import { Card } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { 
  Info, 
  Zap, 
  Clock,
  AlertTriangle,
  Target,
  CheckCircle
} from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('image');
  const [annotations, setAnnotations] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  
  const { 
    isLoading, 
    error, 
    progress,
    generateImage, 
    editImage, 
    generateVideo, 
    downloadMedia, 
    shareMedia,
    clearError 
  } = useAI();
  
  const [galleryItems, setGalleryItems] = useState([
    // Dados de exemplo para demonstração
    {
      id: '1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      prompt: 'Uma paisagem montanhosa ao pôr do sol com cores vibrantes',
      createdAt: new Date().toISOString(),
      size: 1024000,
      metadata: {
        style: 'realistic',
        aspectRatio: '16:9',
        quality: 'high'
      }
    },
    {
      id: '2',
      type: 'video',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      prompt: 'Ondas do mar batendo suavemente na praia',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      size: 2048000,
      duration: 8,
      metadata: {
        aspectRatio: '16:9',
        quality: 'standard'
      }
    }
  ]);

  // Handlers para geração e edição
  const handleGenerateImage = async (params) => {
    try {
      console.log('🎨 Gerando imagem com anotações:', params);
      const result = await generateImage(params);
      
      if (result.success) {
        const newItem = {
          id: Date.now().toString(),
          type: 'image',
          url: result.imageUrl,
          prompt: params.prompt,
          createdAt: new Date().toISOString(),
          size: Math.floor(Math.random() * 2000000) + 500000,
          metadata: {
            ...result.metadata,
            annotations: params.annotations || []
          }
        };
        
        setGalleryItems(prev => [newItem, ...prev]);
        setCurrentImage(result.imageUrl);
      }
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
    }
  };

  const handleEditImage = async (params, imageData) => {
    try {
      console.log('✏️ Editando imagem com anotações:', params);
      const result = await editImage(params, imageData || currentImage);
      
      if (result.success) {
        const newItem = {
          id: Date.now().toString(),
          type: 'image',
          url: result.imageUrl,
          prompt: `Editado: ${params.prompt}`,
          createdAt: new Date().toISOString(),
          size: Math.floor(Math.random() * 2000000) + 500000,
          metadata: {
            ...result.metadata,
            annotations: params.annotations || [],
            isEdited: true,
            originalImage: currentImage
          }
        };
        
        setGalleryItems(prev => [newItem, ...prev]);
        setCurrentImage(result.imageUrl);
      }
    } catch (error) {
      console.error('Erro ao editar imagem:', error);
    }
  };

  const handleGenerateVideo = async (params) => {
    try {
      console.log('🎬 Gerando vídeo:', params);
      const result = await generateVideo(params);
      
      if (result.success) {
        const newItem = {
          id: Date.now().toString(),
          type: 'video',
          url: result.videoUrl,
          prompt: params.prompt,
          createdAt: new Date().toISOString(),
          size: Math.floor(Math.random() * 5000000) + 1000000,
          duration: params.duration || 8,
          metadata: result.metadata
        };
        
        setGalleryItems(prev => [newItem, ...prev]);
      }
    } catch (error) {
      console.error('Erro ao gerar vídeo:', error);
    }
  };

  // Handler para mudanças nas anotações
  const handleAnnotationsChange = (newAnnotations) => {
    setAnnotations(newAnnotations);
  };

  // Handler para carregamento de imagem no canvas
  const handleImageLoad = (imageUrl) => {
    setCurrentImage(imageUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Alert de Demonstração Melhorado */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Target className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>Funcional com Anotações:</strong> Agora você pode usar anotações interativas para guiar a IA na geração e edição de imagens, como mostrado no vídeo de referência.
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                <CheckCircle className="w-3 h-3 mr-1" />
                Ativo
              </Badge>
            </div>
          </AlertDescription>
        </Alert>

        {/* Navegação de Abas */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('image')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'image'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Imagens com Anotações
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'video'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Vídeos
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Canvas e Controles */}
          <div className="xl:col-span-2 space-y-6">
            {activeTab === 'image' && (
              <>
                {/* Canvas com Anotações */}
                <Card className="p-1">
                  <AnnotationCanvas
                    onAnnotationsChange={handleAnnotationsChange}
                    backgroundImage={currentImage}
                    onImageLoad={handleImageLoad}
                  />
                </Card>

                {/* Controles de IA Melhorados */}
                <EnhancedImageControls
                  onGenerate={handleGenerateImage}
                  onEdit={handleEditImage}
                  isLoading={isLoading}
                  progress={progress}
                  annotations={annotations}
                  currentImage={currentImage}
                />
              </>
            )}

            {activeTab === 'video' && (
              <VideoControls
                onGenerate={handleGenerateVideo}
                isLoading={isLoading}
                progress={progress}
              />
            )}

            {/* Indicador de Progresso */}
            {isLoading && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <Clock className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <div className="flex items-center justify-between">
                    <span>Processando com IA... Isso pode levar alguns minutos.</span>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      <Zap className="w-3 h-3 mr-1" />
                      {progress || 0}%
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Erro */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <div className="flex items-center justify-between">
                    <span>{error}</span>
                    <button
                      onClick={clearError}
                      className="text-red-600 hover:text-red-800 underline"
                    >
                      Fechar
                    </button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Galeria */}
          <div className="xl:col-span-1">
            <MediaGallery
              items={galleryItems}
              onDownload={downloadMedia}
              onShare={shareMedia}
              onImageSelect={setCurrentImage}
            />
          </div>
        </div>

        {/* Status das Anotações */}
        {annotations.length > 0 && (
          <Card className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  Anotações Ativas: {annotations.length}
                </span>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  Retângulos: {annotations.filter(a => a.type === 'rectangle').length}
                </Badge>
                <Badge variant="outline" className="bg-purple-100 text-purple-800">
                  Círculos: {annotations.filter(a => a.type === 'circle').length}
                </Badge>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

export default App;

