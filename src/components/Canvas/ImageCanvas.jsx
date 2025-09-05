import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Rect, Circle, Text } from 'react-konva';
import { Button } from '@/components/ui/button.jsx';
import { Card } from '@/components/ui/card.jsx';
import { Slider } from '@/components/ui/slider.jsx';
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
  Trash2
} from 'lucide-react';

const ImageCanvas = () => {
  const stageRef = useRef();
  const fileInputRef = useRef();
  const [tool, setTool] = useState('brush');
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  // Carregar imagem de fundo
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          setBackgroundImage(img);
          // Ajustar tamanho do stage baseado na imagem
          const maxWidth = 800;
          const maxHeight = 600;
          const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
          setStageSize({
            width: img.width * ratio,
            height: img.height * ratio
          });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Salvar estado no histórico
  const saveState = () => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push({ lines: [...lines], shapes: [...shapes] });
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  // Undo
  const undo = () => {
    if (historyStep > 0) {
      const prevState = history[historyStep - 1];
      setLines(prevState.lines);
      setShapes(prevState.shapes);
      setHistoryStep(historyStep - 1);
    }
  };

  // Redo
  const redo = () => {
    if (historyStep < history.length - 1) {
      const nextState = history[historyStep + 1];
      setLines(nextState.lines);
      setShapes(nextState.shapes);
      setHistoryStep(historyStep + 1);
    }
  };

  // Eventos de desenho
  const handleMouseDown = (e) => {
    if (tool === 'brush' || tool === 'eraser') {
      setIsDrawing(true);
      const pos = e.target.getStage().getPointerPosition();
      setLines([...lines, { 
        tool, 
        points: [pos.x, pos.y], 
        color: tool === 'eraser' ? '#FFFFFF' : color,
        size: brushSize
      }]);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  // Exportar canvas como imagem
  const exportImage = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = 'ai-media-studio-edit.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Limpar canvas
  const clearCanvas = () => {
    setLines([]);
    setShapes([]);
    setBackgroundImage(null);
    saveState();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      {/* Painel de Ferramentas */}
      <Card className="p-4 lg:w-80">
        <h3 className="text-lg font-semibold mb-4">Ferramentas de Edição</h3>
        
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

        {/* Ferramentas de Desenho */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button
            variant={tool === 'brush' ? 'default' : 'outline'}
            onClick={() => setTool('brush')}
            className="flex items-center justify-center"
          >
            <Brush className="w-4 h-4" />
          </Button>
          <Button
            variant={tool === 'eraser' ? 'default' : 'outline'}
            onClick={() => setTool('eraser')}
            className="flex items-center justify-center"
          >
            <Eraser className="w-4 h-4" />
          </Button>
          <Button
            variant={tool === 'rectangle' ? 'default' : 'outline'}
            onClick={() => setTool('rectangle')}
            className="flex items-center justify-center"
          >
            <Square className="w-4 h-4" />
          </Button>
          <Button
            variant={tool === 'circle' ? 'default' : 'outline'}
            onClick={() => setTool('circle')}
            className="flex items-center justify-center"
          >
            <CircleIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Tamanho do Pincel */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-2 block">
            Tamanho: {brushSize}px
          </label>
          <Slider
            value={[brushSize]}
            onValueChange={(value) => setBrushSize(value[0])}
            max={50}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        {/* Seletor de Cor */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-2 block">Cor</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 rounded border"
          />
        </div>

        {/* Controles de Histórico */}
        <div className="flex gap-2 mb-4">
          <Button
            onClick={undo}
            disabled={historyStep <= 0}
            variant="outline"
            className="flex-1"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            onClick={redo}
            disabled={historyStep >= history.length - 1}
            variant="outline"
            className="flex-1"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>

        {/* Ações */}
        <div className="space-y-2">
          <Button onClick={exportImage} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={clearCanvas} variant="destructive" className="w-full">
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar
          </Button>
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
            ref={stageRef}
          >
            <Layer>
              {/* Imagem de Fundo */}
              {backgroundImage && (
                <KonvaImage
                  image={backgroundImage}
                  width={stageSize.width}
                  height={stageSize.height}
                />
              )}
              
              {/* Linhas Desenhadas */}
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.color}
                  strokeWidth={line.size}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    line.tool === 'eraser' ? 'destination-out' : 'source-over'
                  }
                />
              ))}
              
              {/* Formas */}
              {shapes.map((shape, i) => {
                if (shape.type === 'rectangle') {
                  return (
                    <Rect
                      key={i}
                      x={shape.x}
                      y={shape.y}
                      width={shape.width}
                      height={shape.height}
                      fill={shape.color}
                      stroke={shape.strokeColor}
                      strokeWidth={shape.strokeWidth}
                    />
                  );
                } else if (shape.type === 'circle') {
                  return (
                    <Circle
                      key={i}
                      x={shape.x}
                      y={shape.y}
                      radius={shape.radius}
                      fill={shape.color}
                      stroke={shape.strokeColor}
                      strokeWidth={shape.strokeWidth}
                    />
                  );
                }
                return null;
              })}
            </Layer>
          </Stage>
        </div>
      </Card>
    </div>
  );
};

export default ImageCanvas;

