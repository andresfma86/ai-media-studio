import { useState, useCallback } from 'react';
import aiService from '../api/aiService.js';

export const useAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const generateImage = useCallback(async (params) => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await aiService.generateImage(params);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (result.success) {
        return {
          id: Date.now().toString(),
          type: 'image',
          url: result.imageUrl,
          prompt: params.prompt,
          createdAt: new Date().toISOString(),
          size: Math.floor(Math.random() * 2000000) + 500000,
          metadata: result.metadata
        };
      } else {
        throw new Error(result.error || 'Erro ao gerar imagem');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, []);

  const editImage = useCallback(async (params, imageData) => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90));
      }, 150);

      const result = await aiService.editImage(params, imageData);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (result.success) {
        return {
          id: Date.now().toString(),
          type: 'image',
          url: result.imageUrl,
          prompt: `Edição: ${params.prompt}`,
          createdAt: new Date().toISOString(),
          size: Math.floor(Math.random() * 2000000) + 500000,
          metadata: result.metadata
        };
      } else {
        throw new Error(result.error || 'Erro ao editar imagem');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, []);

  const generateVideo = useCallback(async (params) => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90));
      }, 300);

      const result = await aiService.generateVideo(params);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (result.success) {
        return {
          id: Date.now().toString(),
          type: 'video',
          url: result.videoUrl,
          prompt: params.prompt,
          createdAt: new Date().toISOString(),
          size: Math.floor(Math.random() * 5000000) + 1000000,
          duration: params.duration,
          metadata: result.metadata
        };
      } else {
        throw new Error(result.error || 'Erro ao gerar vídeo');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, []);

  const uploadImage = useCallback(async (file) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await aiService.uploadImage(file);
      
      if (result.success) {
        return result;
      } else {
        throw new Error(result.error || 'Erro ao fazer upload da imagem');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const downloadMedia = useCallback(async (url, filename) => {
    try {
      const result = await aiService.downloadMedia(url, filename);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const shareMedia = useCallback(async (url, title, text) => {
    try {
      const result = await aiService.shareMedia(url, title, text);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    progress,
    generateImage,
    editImage,
    generateVideo,
    uploadImage,
    downloadMedia,
    shareMedia,
    clearError
  };
};

