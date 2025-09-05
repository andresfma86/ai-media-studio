import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { 
  Wand2, 
  Image as ImageIcon, 
  Sparkles, 
  Settings,
  Download,
  RefreshCw,
  Target,
  Zap,
  Info,
  Lightbulb
} from 'lucide-react';

const EnhancedImageControls = ({ 
  onGenerate, 
  onEdit, 
  isLoading, 
  progress, 
  annotations = [],
  currentImage 
}) => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [quality, setQuality] = useState([80]);
  const [creativity, setCreativity] = useState([50]);
  const [editMode, setEditMode] = useState('generate');

  const styles = [
    { value: 'realistic', label: 'Realista' },
    { value: 'artistic', label: 'Artístico' },
    { value: 'cartoon', label: 'Cartoon' },
    { value: 'anime', label: 'Anime' },
    { value: 'photographic', label: 'Fotográfico' },
    { value: 'digital-art', label: 'Arte Digital' },
    { value: 'oil-painting', label: 'Pintura a Óleo' },
    { value: 'watercolor', label: 'Aquarela' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'modern', label: 'Moderno' }
  ];

  const aspectRatios = [
    { value: '1:1', label: 'Quadrado (1:1)' },
    { value: '16:9', label: 'Paisagem (16:9)' },
    { value: '9:16', label: 'Retrato (9:16)' },
    { value: '4:3', label: 'Clássico (4:3)' },
    { value: '3:2', label: 'Fotografia (3:2)' }
  ];

  const handleGenerate = () => {
    const params = {
      prompt,
      negativePrompt,
      style,
      aspectRatio,
      quality: quality[0],
      creativity: creativity[0],
      mode: editMode,
      annotations: annotations || []
    };
    
    if (editMode === 'generate') {
      onGenerate?.(params);
    } else {
      onEdit?.(params, currentImage);
    }
  };

  const presetPrompts = [
    'Uma paisagem montanhosa ao pôr do sol com cores vibrantes',
    'Retrato de uma pessoa sorrindo, iluminação natural',
    'Cidade futurista com arranha-céus e carros voadores',
    'Gato fofo dormindo em uma almofada colorida',
    'Floresta mágica com árvores brilhantes e fadas',
    'Oceano cristalino com ondas suaves na praia',
    'Arquitetura moderna com linhas geométricas',
    'Jardim florido com borboletas coloridas'
  ];

  // Gerar descrição das anotações
  const getAnnotationDescription = () => {
    if (!annotations || annotations.length === 0) {
      return 'Nenhuma anotação ativa';
    }
    
    const rectangles = annotations.filter(a => a.type === 'rectangle').length;
    const circles = annotations.filter(a => a.type === 'circle').length;
    
    return `${rectangles} retângulo(s), ${circles} círculo(s)`;
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Wand2 className="w-5 h-5" />
          Controles de IA - Nano Banana
        </h3>
        <Badge variant="secondary">Google Gemini</Badge>
      </div>

      {/* Modo de Operação */}
      <div className="flex gap-2">
        <Button
          variant={editMode === 'generate' ? 'default' : 'outline'}
          onClick={() => setEditMode('generate')}
          className="flex-1"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Gerar Nova
        </Button>
        <Button
          variant={editMode === 'edit' ? 'default' : 'outline'}
          onClick={() => setEditMode('edit')}
          className="flex-1"
          disabled={!currentImage}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Editar Existente
        </Button>
      </div>

      {/* Status das Anotações */}
      {annotations && annotations.length > 0 && (
        <Alert>
          <Target className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>Anotações ativas: {getAnnotationDescription()}</span>
              <Badge variant="outline" className="ml-2">
                <Zap className="w-3 h-3 mr-1" />
                {annotations.length}
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Progress Bar */}
      {isLoading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Processando com IA...</span>
            <span>{progress || 0}%</span>
          </div>
          <Progress value={progress || 0} className="w-full" />
        </div>
      )}

      {/* Prompt Principal */}
      <div className="space-y-2">
        <Label htmlFor="prompt">Descrição da Imagem</Label>
        <Textarea
          id="prompt"
          placeholder={editMode === 'generate' 
            ? "Descreva a imagem que você quer gerar..." 
            : "Descreva as modificações que deseja fazer nas áreas anotadas..."
          }
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />
      </div>

      {/* Prompts Predefinidos */}
      <div className="space-y-2">
        <Label>Prompts Sugeridos</Label>
        <div className="flex flex-wrap gap-2">
          {presetPrompts.map((preset, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setPrompt(preset)}
              className="text-xs"
            >
              {preset.substring(0, 30)}...
            </Button>
          ))}
        </div>
      </div>

      {/* Prompt Negativo */}
      <div className="space-y-2">
        <Label htmlFor="negative-prompt">Prompt Negativo (opcional)</Label>
        <Textarea
          id="negative-prompt"
          placeholder="O que você NÃO quer na imagem..."
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          rows={2}
        />
      </div>

      {/* Configurações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Estilo */}
        <div className="space-y-2">
          <Label>Estilo</Label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {styles.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Proporção */}
        <div className="space-y-2">
          <Label>Proporção</Label>
          <Select value={aspectRatio} onValueChange={setAspectRatio}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {aspectRatios.map((ratio) => (
                <SelectItem key={ratio.value} value={ratio.value}>
                  {ratio.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Qualidade: {quality[0]}%</Label>
          <Slider
            value={quality}
            onValueChange={setQuality}
            max={100}
            min={10}
            step={10}
          />
        </div>

        <div className="space-y-2">
          <Label>Criatividade: {creativity[0]}%</Label>
          <Slider
            value={creativity}
            onValueChange={setCreativity}
            max={100}
            min={0}
            step={10}
          />
        </div>
      </div>

      {/* Botão de Gerar */}
      <Button 
        onClick={handleGenerate} 
        className="w-full" 
        size="lg"
        disabled={isLoading || !prompt.trim()}
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            {editMode === 'generate' ? (
              <ImageIcon className="w-4 h-4 mr-2" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {editMode === 'generate' ? 'Gerar Imagem' : 'Editar Imagem'}
          </>
        )}
      </Button>

      {/* Dicas */}
      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <ul className="text-sm space-y-1">
            <li>• Use descrições detalhadas para melhores resultados</li>
            <li>• O modo "Editar" aplica mudanças nas áreas anotadas</li>
            <li>• Maior criatividade = resultados mais únicos e inesperados</li>
            {annotations && annotations.length > 0 && (
              <li>• <strong>Anotações detectadas:</strong> A IA focará nas áreas marcadas</li>
            )}
          </ul>
        </AlertDescription>
      </Alert>

      {/* Recursos Disponíveis */}
      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Info className="w-4 h-4" />
          Recursos Disponíveis
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Canvas interativo para edição
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Geração de imagens com IA
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Anotações inteligentes
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Edição guiada por anotações
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedImageControls;

