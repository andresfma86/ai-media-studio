import React, { useState } from 'react';
import { Card } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Wand2, 
  Image as ImageIcon, 
  Sparkles, 
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';

const ImageControls = ({ onGenerate, onEdit, isLoading }) => {
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
    { value: 'watercolor', label: 'Aquarela' }
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
      mode: editMode
    };
    
    if (editMode === 'generate') {
      onGenerate?.(params);
    } else {
      onEdit?.(params);
    }
  };

  const presetPrompts = [
    'Uma paisagem montanhosa ao pôr do sol com cores vibrantes',
    'Retrato de uma pessoa sorrindo, iluminação natural',
    'Cidade futurista com arranha-céus e carros voadores',
    'Gato fofo dormindo em uma almofada colorida',
    'Floresta mágica com árvores brilhantes e fadas'
  ];

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
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Editar Existente
        </Button>
      </div>

      {/* Prompt Principal */}
      <div className="space-y-2">
        <Label htmlFor="prompt">Descrição da Imagem</Label>
        <Textarea
          id="prompt"
          placeholder="Descreva a imagem que você quer gerar ou as modificações que deseja fazer..."
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
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>Criatividade: {creativity[0]}%</Label>
          <Slider
            value={creativity}
            onValueChange={setCreativity}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
        </div>
      </div>

      {/* Botão de Geração */}
      <Button 
        onClick={handleGenerate}
        disabled={!prompt.trim() || isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            {editMode === 'generate' ? 'Gerando...' : 'Editando...'}
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4 mr-2" />
            {editMode === 'generate' ? 'Gerar Imagem' : 'Aplicar Edição'}
          </>
        )}
      </Button>

      {/* Informações */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Use descrições detalhadas para melhores resultados</p>
        <p>• O modo "Editar" aplica mudanças na imagem carregada no canvas</p>
        <p>• Maior criatividade = resultados mais únicos e inesperados</p>
      </div>
    </Card>
  );
};

export default ImageControls;

