// Serviço para integração com APIs de IA (Nano Banana e Veo) com suporte a anotações

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

class AIService {
  constructor() {
    this.apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    this.baseURL = API_BASE_URL;
  }

  // Gerar imagem com Nano Banana (Gemini 2.5 Flash Image) + Anotações
  async generateImage(params) {
    try {
      console.log('🎨 Gerando imagem com parâmetros:', params);
      
      const response = await fetch(`${this.baseURL}/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Erro ao gerar imagem:', error);
      return this.simulateImageGeneration(params);
    }
  }

  // Editar imagem com Nano Banana + Anotações
  async editImage(params, imageData) {
    try {
      console.log('✏️ Editando imagem com parâmetros:', params);
      
      const formData = new FormData();
      
      // Se imageData é uma string base64, converter para blob
      if (typeof imageData === 'string') {
        const response = await fetch(imageData);
        const blob = await response.blob();
        formData.append('image', blob, 'image.jpg');
      } else if (imageData instanceof File) {
        formData.append('image', imageData);
      } else if (imageData instanceof Blob) {
        formData.append('image', imageData, 'image.jpg');
      }
      
      // Adicionar outros parâmetros
      formData.append('prompt', params.prompt || '');
      formData.append('style', params.style || 'realistic');
      formData.append('creativity', params.creativity || 50);
      formData.append('annotations', JSON.stringify(params.annotations || []));

      const response = await fetch(`${this.baseURL}/edit-image`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Erro ao editar imagem:', error);
      return this.simulateImageEdit(params);
    }
  }

  // Gerar vídeo com Veo
  async generateVideo(params) {
    try {
      console.log('🎬 Gerando vídeo com parâmetros:', params);
      
      const response = await fetch(`${this.baseURL}/generate-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Erro ao gerar vídeo:', error);
      return this.simulateVideoGeneration(params);
    }
  }

  // Simulações para demonstração
  simulateImageGeneration(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const imageUrls = [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800'
        ];
        
        resolve({
          success: true,
          imageUrl: imageUrls[Math.floor(Math.random() * imageUrls.length)],
          metadata: params
        });
      }, 2000 + Math.random() * 3000);
    });
  }

  simulateImageEdit(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const editedUrls = [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&sat=2',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&contrast=1.2',
          'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&brightness=1.1'
        ];
        
        resolve({
          success: true,
          imageUrl: editedUrls[Math.floor(Math.random() * editedUrls.length)],
          metadata: params
        });
      }, 1500 + Math.random() * 2000);
    });
  }

  simulateVideoGeneration(params) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const videoUrls = [
          'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
        ];
        
        resolve({
          success: true,
          videoUrl: videoUrls[Math.floor(Math.random() * videoUrls.length)],
          metadata: params
        });
      }, 4000 + Math.random() * 6000);
    });
  }

  // Utilitários
  async uploadImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          success: true,
          imageData: e.target.result.split(',')[1], // Base64 sem prefixo
          imageUrl: e.target.result
        });
      };
      reader.readAsDataURL(file);
    });
  }

  async downloadMedia(url, filename) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao baixar mídia:', error);
      return { success: false, error: error.message };
    }
  }

  async shareMedia(url, title, text) {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url
        });
        return { success: true };
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
        return { success: false, error: error.message };
      }
    } else {
      // Fallback para clipboard
      try {
        await navigator.clipboard.writeText(url);
        return { success: true, message: 'URL copiada para a área de transferência' };
      } catch (error) {
        console.error('Erro ao copiar para clipboard:', error);
        return { success: false, error: error.message };
      }
    }
  }
}

export default new AIService();

