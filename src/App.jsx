import React, { useState } from 'react';
import { useAI } from './hooks/useAI.js';
import Header from './components/Layout/Header.jsx';
import ImageCanvas from './components/Canvas/ImageCanvas.jsx';
import ImageControls from './components/AIControls/ImageControls.jsx';
import VideoControls from './components/AIControls/VideoControls.jsx';
import MediaGallery from './components/Gallery/MediaGallery.jsx';
import { Card } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { 
  Info, 
  Zap, 
  Clock,
  AlertTriangle
} from 'lucide-react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('image');
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
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
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
        quality: 'standard',
        aspectRatio: '16:9',
        fps: 30
      }
    }
  ]);

  const handleImageGenerate = async (params) => {
    try {
      const newItem = await generateImage(params);
      setGalleryItems(prev => [newItem, ...prev]);
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
    }
  };

  const handleImageEdit = async (params) => {
    try {
      const newItem = await editImage(params);
      setGalleryItems(prev => [newItem, ...prev]);
    } catch (error) {
      console.error('Erro ao editar imagem:', error);
    }
  };

  const handleVideoGenerate = async (params) => {
    try {
      const newItem = await generateVideo(params);
      setGalleryItems(prev => [newItem, ...prev]);
    } catch (error) {
      console.error('Erro ao gerar vídeo:', error);
    }
  };

  const handleDeleteItem = (id) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
  };

  const handleDownloadItem = async (item) => {
    try {
      const filename = `ai-media-studio-${item.type}-${item.id}.${item.type === 'image' ? 'png' : 'mp4'}`;
      await downloadMedia(item.url, filename);
    } catch (error) {
      console.error('Erro ao baixar item:', error);
    }
  };

  const handleShareItem = async (item) => {
    try {
      await shareMedia(item.url, 'AI Media Studio', item.prompt);
    } catch (error) {
      console.error('Erro ao compartilhar item:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 py-6">
        {/* Aviso sobre APIs */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Demonstração:</strong> Esta é uma versão de demonstração. 
            Para funcionalidade completa, configure as APIs do Google Cloud (Nano Banana e Veo) 
            nas variáveis de ambiente.
          </AlertDescription>
        </Alert>

        {/* Status de Carregamento */}
        {isLoading && (
          <Alert className="mb-6">
            <Clock className="h-4 w-4 animate-spin" />
            <AlertDescription>
              <strong>Processando:</strong> Sua solicitação está sendo processada pela IA. 
              {progress > 0 && ` Progresso: ${progress}%`}
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Erro */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Erro:</strong> {error}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearError}
                className="ml-2"
              >
                Fechar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Painel Principal */}
          <div className="xl:col-span-2 space-y-6">
            {activeTab === 'image' ? (
              <>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">Canvas Interativo</Badge>
                    <Badge variant="outline">Nano Banana</Badge>
                  </div>
                  <ImageCanvas />
                </Card>
              </>
            ) : (
              <Card className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Geração de Vídeo com IA</h3>
                    <p className="text-muted-foreground">
                      Use os controles ao lado para gerar vídeos incríveis com o modelo Veo do Google DeepMind.
                    </p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Badge variant="secondary">Veo 3</Badge>
                    <Badge variant="outline">Áudio Incluído</Badge>
                    <Badge variant="outline">Até 30s</Badge>
                  </div>
                </div>
              </Card>
            )}

            {/* Galeria */}
            <MediaGallery
              items={galleryItems}
              onDelete={handleDeleteItem}
              onDownload={handleDownloadItem}
              onShare={handleShareItem}
            />
          </div>

          {/* Painel de Controles */}
          <div className="space-y-6">
            {activeTab === 'image' ? (
              <ImageControls
                onGenerate={handleImageGenerate}
                onEdit={handleImageEdit}
                isLoading={isLoading}
              />
            ) : (
              <VideoControls
                onGenerate={handleVideoGenerate}
                isLoading={isLoading}
              />
            )}

            {/* Informações Adicionais */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Recursos Disponíveis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Canvas interativo para edição</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Geração de imagens com IA</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Geração de vídeos com áudio</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Integração com APIs (configuração necessária)</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

