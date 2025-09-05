import React, { useState } from 'react';
import { Card } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Download, 
  Share2, 
  Trash2, 
  Eye, 
  Play,
  Pause,
  Volume2,
  VolumeX,
  MoreHorizontal
} from 'lucide-react';

const MediaGallery = ({ items = [], onDelete, onDownload, onShare }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [playingVideos, setPlayingVideos] = useState(new Set());
  const [mutedVideos, setMutedVideos] = useState(new Set());

  const toggleVideoPlay = (id) => {
    setPlayingVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleVideoMute = (id) => {
    setMutedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Eye className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhum item gerado ainda</h3>
          <p className="text-sm">
            Use os controles de IA para gerar suas primeiras imagens ou vídeos
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Galeria ({items.length} {items.length === 1 ? 'item' : 'itens'})
        </h3>
        <Button variant="outline" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden group">
            {/* Preview */}
            <div className="relative aspect-video bg-muted">
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.prompt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-full h-full">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted={mutedVideos.has(item.id)}
                    loop
                    playsInline
                    ref={(video) => {
                      if (video) {
                        if (playingVideos.has(item.id)) {
                          video.play();
                        } else {
                          video.pause();
                        }
                      }
                    }}
                  />
                  
                  {/* Controles de Vídeo */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => toggleVideoPlay(item.id)}
                      >
                        {playingVideos.has(item.id) ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => toggleVideoMute(item.id)}
                      >
                        {mutedVideos.has(item.id) ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Badge de Tipo */}
              <Badge 
                className="absolute top-2 left-2"
                variant={item.type === 'image' ? 'default' : 'secondary'}
              >
                {item.type === 'image' ? 'Imagem' : 'Vídeo'}
              </Badge>

              {/* Ações Rápidas */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => onDownload?.(item)}
                    className="h-8 w-8"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => onShare?.(item)}
                    className="h-8 w-8"
                  >
                    <Share2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => onDelete?.(item.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Informações */}
            <div className="p-4 space-y-2">
              <div className="space-y-1">
                <p className="text-sm font-medium line-clamp-2">
                  {item.prompt}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatDate(item.createdAt)}</span>
                  {item.size && (
                    <>
                      <span>•</span>
                      <span>{getFileSize(item.size)}</span>
                    </>
                  )}
                  {item.duration && (
                    <>
                      <span>•</span>
                      <span>{item.duration}s</span>
                    </>
                  )}
                </div>
              </div>

              {/* Metadados */}
              {item.metadata && (
                <div className="flex flex-wrap gap-1">
                  {item.metadata.style && (
                    <Badge variant="outline" className="text-xs">
                      {item.metadata.style}
                    </Badge>
                  )}
                  {item.metadata.aspectRatio && (
                    <Badge variant="outline" className="text-xs">
                      {item.metadata.aspectRatio}
                    </Badge>
                  )}
                  {item.metadata.quality && (
                    <Badge variant="outline" className="text-xs">
                      {item.metadata.quality}
                    </Badge>
                  )}
                </div>
              )}

              {/* Ações */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedItem(item)}
                  className="flex-1"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Ver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload?.(item)}
                >
                  <Download className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShare?.(item)}
                >
                  <Share2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de Visualização */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Visualização</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItem(null)}
              >
                ✕
              </Button>
            </div>
            <div className="p-4">
              {selectedItem.type === 'image' ? (
                <img
                  src={selectedItem.url}
                  alt={selectedItem.prompt}
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
              ) : (
                <video
                  src={selectedItem.url}
                  controls
                  className="w-full h-auto max-h-[60vh]"
                />
              )}
              <div className="mt-4 space-y-2">
                <p className="text-sm">{selectedItem.prompt}</p>
                <div className="text-xs text-muted-foreground">
                  Criado em {formatDate(selectedItem.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;

