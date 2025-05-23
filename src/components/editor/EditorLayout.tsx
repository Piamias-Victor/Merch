"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Wall, PlanDimensions, GridSettings, PlanMetadata } from '@/types/pharmacy';
import { useWallTool } from '@/hooks/editor/useWallTool';
import Canvas from '@/components/canvas/Canvas';
import Toolbar from './Toolbar';

interface EditorLayoutProps {
  metadata: PlanMetadata;
}

export default function EditorLayout({ metadata }: EditorLayoutProps) {
  const [activeTool, setActiveTool] = useState<'wall' | 'select'>('wall');
  const [walls, setWalls] = useState<Wall[]>([]);
  const [gridSettings, setGridSettings] = useState<GridSettings>({
    size: 20,
    visible: true,
    snapEnabled: true,
  });

  const handleWallCreate = useCallback((wall: Wall) => {
    setWalls(prev => [...prev, wall]);
  }, []);

  const wallTool = useWallTool({
    gridSize: gridSettings.size,
    snapEnabled: gridSettings.snapEnabled,
    onWallCreate: handleWallCreate,
  });

  const handleCanvasClick = useCallback((point: { x: number; y: number }) => {
    if (activeTool === 'wall') {
      wallTool.handleCanvasClick(point);
    }
  }, [activeTool, wallTool]);

  const handleMouseMove = useCallback((point: { x: number; y: number }) => {
    if (activeTool === 'wall') {
      wallTool.handleMouseMove(point);
    }
  }, [activeTool, wallTool]);

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        wallTool.cancelDrawing();
      } else if (event.key === 'w' || event.key === 'W') {
        setActiveTool('wall');
      } else if (event.key === 'v' || event.key === 'V') {
        setActiveTool('select');
        wallTool.cancelDrawing();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [wallTool]);

  const previewWall = activeTool === 'wall' ? wallTool.getPreviewWall() : null;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4">
        <h1 className="text-lg font-medium text-gray-900">{metadata.name}</h1>
        <div className="ml-auto text-sm text-gray-500">
          {metadata.dimensions.width} × {metadata.dimensions.height} px
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex">
        <Toolbar
          activeTool={activeTool}
          onToolSelect={setActiveTool}
          gridVisible={gridSettings.visible}
          onToggleGrid={() => setGridSettings(prev => ({ ...prev, visible: !prev.visible }))}
          canUndo={false}
          canRedo={false}
          onUndo={() => {}}
          onRedo={() => {}}
        />
        
        <div className="flex-1 p-4">
          <Canvas
            dimensions={metadata.dimensions}
            walls={walls}
            gridSettings={gridSettings}
            previewWall={previewWall}
            onMouseMove={handleMouseMove}
            onCanvasClick={handleCanvasClick}
          />
        </div>
      </div>
    </div>
  );
}