import React, { useState } from 'react';
import { Card } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { 
  Video, 
  Play, 
  Music, 
  Settings,
  Download,
  RefreshCw,
  Clock,
  Zap
} from 'lucide-react';

const VideoControls = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState([5]);
  const [quality, setQuality] = useState('standard');
  const [fps, setFps] = useState('24');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [includeAudio, setIncludeAudio] = useState(true);
  const [audioType, setAudioType] = useState('ambient');
  const [motionIntensity, setMotionIntensity] = useState([50]);
  const [cameraMovement, setCameraMovement] = useState('static');

  const qualityOptions = [
    { value: 'draft', label: 'Rascunho (Rápido)' },
    { value: 'standard', label: 'Padrão' },
    { value: 'high', label: 'Alta Qualidade' },
    { value: 'ultra', label: 'Ultra HD' }
  ];

  const aspectRatios = [
    { value: '16:9', label: 'Paisagem (16:9)' },
    { value: '9:16', label: 'Vertical (9:16)' },
    { value: '1:1', label: 'Quadrado (1:1)' },
    { value: '21:9', label: 'Cinemático (21:9)' }
  ];

  const audioTypes = [
    { value: 'ambient', label: 'Ambiente' },
    { value: 'music', label: 'Música' },
    { value: 'effects', label: 'Efeitos Sonoros' },
    { value: 'dialogue', label: 'Diálogo' },
    { value: 'none', label: 'Sem Áudio' }
  ];

  const cameraMovements = [
    { value: 'static', label: 'Estático' },
    { value: 'pan', label: 'Panorâmica' },
    { value: 'zoom', label: 'Zoom' },
    { value: 'dolly', label: 'Dolly' },
    { value: 'orbit', label: 'Orbital' },
    { value: 'handheld', label: 'Câmera na Mão' }
  ];

  const handleGenerate = () => {
    const params = {
      prompt,
      duration: duration[0],
      quality,
      fps: parseInt(fps),
      aspectRatio,
      includeAudio,
      audioType: includeAudio ? audioType : 'none',
      motionIntensity: motionIntensity[0],
      cameraMovement
    };
    
    onGenerate?.(params);
  };

  const presetPrompts = [
    'Uma pessoa caminhando em uma praia ao pôr do sol',
    'Gato brincando com uma bola de lã',
    'Chuva caindo em uma janela',
    'Fogo crepitando em uma lareira',
    'Ondas do mar batendo nas rochas',
    'Pessoa digitando em um computador',
    'Flores balançando no vento',
    'Carros passando em uma rua movimentada'
  ];

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Video className="w-5 h-5" />
          Controles de IA - Veo
        </h3>
        <Badge variant="secondary">Google DeepMind</Badge>
      </div>

      {/* Prompt Principal */}
      <div className="space-y-2">
        <Label htmlFor="video-prompt">Descrição do Vídeo</Label>
        <Textarea
          id="video-prompt"
          placeholder="Descreva o vídeo que você quer gerar..."
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
              {preset.substring(0, 25)}...
            </Button>
          ))}
        </div>
      </div>

      {/* Configurações de Vídeo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Duração */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Duração: {duration[0]}s
          </Label>
          <Slider
            value={duration}
            onValueChange={setDuration}
            max={30}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        {/* Qualidade */}
        <div className="space-y-2">
          <Label>Qualidade</Label>
          <Select value={quality} onValueChange={setQuality}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {qualityOptions.map((q) => (
                <SelectItem key={q.value} value={q.value}>
                  {q.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* FPS */}
        <div className="space-y-2">
          <Label>FPS</Label>
          <Select value={fps} onValueChange={setFps}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24">24 FPS</SelectItem>
              <SelectItem value="30">30 FPS</SelectItem>
              <SelectItem value="60">60 FPS</SelectItem>
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

      {/* Movimento da Câmera */}
      <div className="space-y-2">
        <Label>Movimento da Câmera</Label>
        <Select value={cameraMovement} onValueChange={setCameraMovement}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cameraMovements.map((movement) => (
              <SelectItem key={movement.value} value={movement.value}>
                {movement.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Intensidade do Movimento */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Intensidade do Movimento: {motionIntensity[0]}%
        </Label>
        <Slider
          value={motionIntensity}
          onValueChange={setMotionIntensity}
          max={100}
          min={0}
          step={5}
          className="w-full"
        />
      </div>

      {/* Configurações de Áudio */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            Incluir Áudio
          </Label>
          <Switch
            checked={includeAudio}
            onCheckedChange={setIncludeAudio}
          />
        </div>

        {includeAudio && (
          <div className="space-y-2">
            <Label>Tipo de Áudio</Label>
            <Select value={audioType} onValueChange={setAudioType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {audioTypes.slice(0, -1).map((audio) => (
                  <SelectItem key={audio.value} value={audio.value}>
                    {audio.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
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
            Gerando Vídeo...
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" />
            Gerar Vídeo
          </>
        )}
      </Button>

      {/* Informações */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Vídeos mais longos levam mais tempo para gerar</p>
        <p>• Use descrições detalhadas de movimento e ação</p>
        <p>• O áudio é gerado automaticamente baseado no conteúdo visual</p>
        <p>• Qualidade ultra pode levar vários minutos para processar</p>
      </div>
    </Card>
  );
};

export default VideoControls;

