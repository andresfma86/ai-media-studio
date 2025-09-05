import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Rect, Circle, Text, Transformer } from 'react-konva';
import { Button } from '@/components/ui/button.jsx';
import { Card } from '@/components/ui/card.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Brush, 
  Square, 
  Circle as CircleIcon, 
  Type, 
  Eraser, 
  Undo, 
  Redo, 
  Download,
  Upload,
  Trash2,
  MousePointer,
  Target,
  Zap
} from 'lucide-react';

const AnnotationCanvas = ({ onAnnotationsChange, backgroundImage, onImageLoad }) => {
  const stageRef = useRef();
  const fileInputRef = useRef();
  const transformerRef = useRef();
  
  const [tool, setTool] = useState('select');
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState('#ff0000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [konvaImage, setKonvaImage] = useState(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  // Carregar imagem de fundo
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          setKonvaImage(img);
          // Ajustar tamanho do stage baseado na imagem
          const maxWidth = 800;
          const maxHeight = 600;
          const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
          setStageSize({
            width: img.width * ratio,
            height: img.height * ratio
          });
          if (onImageLoad) {
            onImageLoad(event.target.result);
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Usar imagem externa se fornecida
  useEffect(() => {
    if (backgroundImage && backgroundImage !== konvaImage?.src) {
      const img = new window.Image();
      img.onload = () => {
        setKonvaImage(img);
        const maxWidth = 800;
        const maxHeight = 600;
        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
        setStageSize({
          width: img.width * ratio,
          height: img.height * ratio
        });
      };
      img.crossOrigin = 'anonymous';
      img.src = backgroundImage;
    }
  }, [backgroundImage]);

  // Salvar estado no histórico
  const saveState = () => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push({ 
      lines: [...lines], 
      annotations: [...annotations] 
    });
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  // Notificar mudanças nas anotações
  useEffect(() => {
    if (onAnnotationsChange) {
      onAnnotationsChange(annotations);
    }
  }, [annotations, onAnnotationsChange]);

  // Undo
  const undo = () => {
    if (historyStep > 0) {
      const prevState = history[historyStep - 1];
      setLines(prevState.lines);
      setAnnotations(prevState.annotations);
      setHistoryStep(historyStep - 1);
    }
  };

  // Redo
  const redo = () => {
    if (historyStep < history.length - 1) {
      const nextState = history[historyStep + 1];
      setLines(nextState.lines);
      setAnnotations(nextState.annotations);
      setHistoryStep(historyStep + 1);
    }
  };

  // Eventos de desenho e anotação
  const handleMouseDown = (e) => {
    if (tool === 'select') {
      return;
    }

    const pos = e.target.getStage().getPointerPosition();
    
    if (tool === 'brush' || tool === 'eraser') {
      setIsDrawing(true);
      setLines([...lines, { 
        tool, 
        points: [pos.x, pos.y], 
        color: tool === 'eraser' ? '#FFFFFF' : color,
        size: brushSize,
        id: Date.now()
      }]);
    } else if (tool === 'rect') {
      const newAnnotation = {
        id: Date.now(),
        type: 'rectangle',
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        color: color,
        opacity: 0.3
      };
      setAnnotations([...annotations, newAnnotation]);
      setIsDrawing(true);
    } else if (tool === 'circle') {
      const newAnnotation = {
        id: Date.now(),
        type: 'circle',
        x: pos.x,
        y: pos.y,
        radius: 0,
        color: color,
        opacity: 0.3
      };
      setAnnotations([...annotations, newAnnotation]);
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (tool === 'brush' || tool === 'eraser') {
      let lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    } else if (tool === 'rect') {
      const lastAnnotation = annotations[annotations.length - 1];
      const width = point.x - lastAnnotation.x;
      const height = point.y - lastAnnotation.y;
      
      const updatedAnnotations = [...annotations];
      updatedAnnotations[updatedAnnotations.length - 1] = {
        ...lastAnnotation,
        width: width,
        height: height
      };
      setAnnotations(updatedAnnotations);
    } else if (tool === 'circle') {
      const lastAnnotation = annotations[annotations.length - 1];
      const radius = Math.sqrt(
        Math.pow(point.x - lastAnnotation.x, 2) + 
        Math.pow(point.y - lastAnnotation.y, 2)
      );
      
      const updatedAnnotations = [...annotations];
      updatedAnnotations[updatedAnnotations.length - 1] = {
        ...lastAnnotation,
        radius: radius
      };
      setAnnotations(updatedAnnotations);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  // Seleção de anotações
  const handleAnnotationClick = (id) => {
    setSelectedId(id);
  };

  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  // Atualizar transformer
  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const selectedNode = stageRef.current.findOne(`#${selectedId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedId]);

  // Exportar canvas como imagem
  const exportImage = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = 'ai-media-studio-annotated.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Limpar canvas
  const clearCanvas = () => {
    setLines([]);
    setAnnotations([]);
    setKonvaImage(null);
    setSelectedId(null);
    saveState();
  };

  // Deletar anotação selecionada
  const deleteSelected = () => {
    if (selectedId) {
      setAnnotations(annotations.filter(ann => ann.id !== selectedId));
      setLines(lines.filter(line => line.id !== selectedId));
      setSelectedId(null);
      saveState();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      {/* Painel de Ferramentas */}
      <Card className="p-4 lg:w-80">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Ferramentas de Anotação
        </h3>
        
        {/* Upload de Imagem */}
        <div className="mb-4">
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full mb-2"
            variant="outline"
          >
            <Upload className="w-4 h-4 mr-2" />
            Carregar Imagem
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Ferramentas */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            variant={tool === 'select' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('select')}
          >
            <MousePointer className="w-4 h-4" />
          </Button>
          <Button
            variant={tool === 'brush' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('brush')}
          >
            <Brush className="w-4 h-4" />
          </Button>
          <Button
            variant={tool === 'eraser' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('eraser')}
          >
            <Eraser className="w-4 h-4" />
          </Button>
          <Button
            variant={tool === 'rect' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('rect')}
          >
            <Square className="w-4 h-4" />
          </Button>
          <Button
            variant={tool === 'circle' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('circle')}
          >
            <CircleIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={deleteSelected}
            disabled={!selectedId}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Controles de Tamanho e Cor */}
        <div className="space-y-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Tamanho: {brushSize}px
            </label>
            <Slider
              value={[brushSize]}
              onValueChange={(value) => setBrushSize(value[0])}
              max={50}
              min={1}
              step={1}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Cor</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 rounded border"
            />
          </div>
        </div>

        {/* Histórico */}
        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={historyStep <= 0}
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={historyStep >= history.length - 1}
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>

        {/* Ações */}
        <div className="space-y-2">
          <Button onClick={exportImage} className="w-full" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={clearCanvas} className="w-full" variant="outline">
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        </div>

        {/* Status das Anotações */}
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Anotações Ativas</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">
              Retângulos: {annotations.filter(a => a.type === 'rectangle').length}
            </Badge>
            <Badge variant="secondary">
              Círculos: {annotations.filter(a => a.type === 'circle').length}
            </Badge>
            <Badge variant="secondary">
              Desenhos: {lines.length}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Canvas */}
      <Card className="flex-1 p-4">
        <div className="border rounded-lg overflow-hidden bg-white">
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            onClick={handleStageClick}
            ref={stageRef}
          >
            <Layer>
              {/* Imagem de fundo */}
              {konvaImage && (
                <KonvaImage
                  image={konvaImage}
                  width={stageSize.width}
                  height={stageSize.height}
                />
              )}
              
              {/* Linhas de desenho */}
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.color}
                  strokeWidth={line.size}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation={
                    line.tool === 'eraser' ? 'destination-out' : 'source-over'
                  }
                />
              ))}
              
              {/* Anotações - Retângulos */}
              {annotations
                .filter(ann => ann.type === 'rectangle')
                .map((rect) => (
                  <Rect
                    key={rect.id}
                    id={rect.id.toString()}
                    x={rect.x}
                    y={rect.y}
                    width={rect.width}
                    height={rect.height}
                    fill={rect.color}
                    opacity={rect.opacity}
                    stroke={rect.color}
                    strokeWidth={2}
                    draggable={tool === 'select'}
                    onClick={() => handleAnnotationClick(rect.id)}
                  />
                ))}
              
              {/* Anotações - Círculos */}
              {annotations
                .filter(ann => ann.type === 'circle')
                .map((circle) => (
                  <Circle
                    key={circle.id}
                    id={circle.id.toString()}
                    x={circle.x}
                    y={circle.y}
                    radius={circle.radius}
                    fill={circle.color}
                    opacity={circle.opacity}
                    stroke={circle.color}
                    strokeWidth={2}
                    draggable={tool === 'select'}
                    onClick={() => handleAnnotationClick(circle.id)}
                  />
                ))}
              
              {/* Transformer para seleção */}
              {tool === 'select' && (
                <Transformer
                  ref={transformerRef}
                  boundBoxFunc={(oldBox, newBox) => {
                    // Limitar o tamanho mínimo
                    if (newBox.width < 5 || newBox.height < 5) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                />
              )}
            </Layer>
          </Stage>
        </div>
      </Card>
    </div>
  );
};

export default AnnotationCanvas;

