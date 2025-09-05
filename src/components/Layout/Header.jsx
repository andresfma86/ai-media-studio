import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { 
  Palette, 
  Video, 
  Sparkles, 
  Github, 
  Settings,
  HelpCircle
} from 'lucide-react';

const Header = ({ activeTab, onTabChange }) => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e Título */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI Media Studio</h1>
                <p className="text-xs text-muted-foreground">
                  Powered by Nano Banana & Veo
                </p>
              </div>
            </div>
          </div>

          {/* Navegação */}
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'image' ? 'default' : 'ghost'}
              onClick={() => onTabChange('image')}
              className="flex items-center gap-2"
            >
              <Palette className="w-4 h-4" />
              Imagens
            </Button>
            <Button
              variant={activeTab === 'video' ? 'default' : 'ghost'}
              onClick={() => onTabChange('video')}
              className="flex items-center gap-2"
            >
              <Video className="w-4 h-4" />
              Vídeos
            </Button>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:flex">
              Beta
            </Badge>
            <Button variant="ghost" size="icon">
              <HelpCircle className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

