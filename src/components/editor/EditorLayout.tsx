"use client";

import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Wall, PlanMetadata, GridSettings } from '@/types/editor';
import { useWallTool } from '@/hooks/editor/useWallTool';
import { useCanvasViewport } from '@/hooks/editor/useCanvasViewport';
import EditorToolbar from './EditorToolbar';

const EditorCanvas = dynamic(() => import('./EditorCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 bg-gray-100 flex items-center justify-center">
      <div className="text-lg text-gray-600">Chargement du canvas...</div>
    </div>
  ),
});

interface EditorLayoutProps {
  metadata: PlanMetadata;
}

export default function EditorLayout({ metadata }: EditorLayoutProps) {
  const router = useRouter();
  const [activeTool, setActiveTool] = useState<'wall' | 'select'>('wall');
  const [walls, setWalls] = useState<Wall[]>([]);
  const [gridSettings, setGridSettings] = useState<GridSettings>({
    size: 20,
    visible: true,
    snapEnabled: true,
  });

  const {
    viewport,
    stageRef,
    zoomIn,
    zoomOut,
    resetZoom,
    zoomToFit,
    handleDragEnd,
  } = useCanvasViewport();

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

  const handleValidateWalls = useCallback(() => {
    if (walls.length === 0) return;
    
    const planData = {
      metadata,
      walls,
      validatedAt: new Date(),
    };
    
    localStorage.setItem('current-plan', JSON.stringify(planData));
    
    const params = new URLSearchParams();
    params.append('step', 'furniture');
    params.append('name', metadata.name);
    params.append('width', metadata.dimensions.width.toString());
    params.append('height', metadata.dimensions.height.toString());
    
    router.push(`/editor?${params.toString()}`);
  }, [walls, metadata, router]);

  const handleZoomToFit = useCallback(() => {
    const containerWidth = 800;
    const containerHeight = 600;
    zoomToFit(containerWidth, containerHeight, metadata.dimensions.width, metadata.dimensions.height);
  }, [zoomToFit, metadata.dimensions]);

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
      } else if (event.key === 'Enter' && walls.length > 0) {
        handleValidateWalls();
      } else if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        zoomIn();
      } else if (event.key === '-') {
        event.preventDefault();
        zoomOut();
      } else if (event.key === '0') {
        event.preventDefault();
        handleZoomToFit();
      } else if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        resetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [wallTool, walls.length, handleValidateWalls, zoomIn, zoomOut, handleZoomToFit, resetZoom]);

  const previewWall = activeTool === 'wall' ? wallTool.getPreviewWall() : null;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4">
        <h1 className="text-lg font-medium text-gray-900">{metadata.name}</h1>
        <div className="ml-4 text-sm text-gray-500">
          Étape 1: Création des murs ({walls.length} mur{walls.length !== 1 ? 's' : ''})
        </div>
        <div className="ml-auto text-sm text-gray-500">
          {metadata.dimensions.width} × {metadata.dimensions.height} px • Zoom: {Math.round(viewport.scale * 100)}%
        </div>
      </header>

      <div className="flex-1 flex">
        <EditorToolbar
          activeTool={activeTool}
          onToolSelect={setActiveTool}
          gridVisible={gridSettings.visible}
          onToggleGrid={() => setGridSettings(prev => ({ ...prev, visible: !prev.visible }))}
          canUndo={false}
          canRedo={false}
          onUndo={() => {}}
          onRedo={() => {}}
          wallsCount={walls.length}
          onValidateWalls={handleValidateWalls}
          zoom={viewport.scale}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onZoomToFit={handleZoomToFit}
          onResetZoom={resetZoom}
        />
        
        <div className="flex-1 p-4">
          <EditorCanvas
            dimensions={metadata.dimensions}
            walls={walls}
            gridSettings={gridSettings}
            previewWall={previewWall}
            onMouseMove={handleMouseMove}
            onCanvasClick={handleCanvasClick}
            viewport={viewport}
            stageRef={stageRef}
            onDragEnd={handleDragEnd}
          />
        </div>
      </div>

      {activeTool === 'wall' && (
        <div className="bg-[#0A5B91] text-white px-4 py-2 text-sm">
          <strong>Mode création de murs :</strong> 
          Cliquez pour placer le point de départ, puis cliquez à nouveau pour finaliser le mur. 
          <strong>Raccourcis :</strong> W (mur), V (sélection), Échap (annuler), +/- (zoom), 0 (ajuster)
        </div>
      )}
    </div>
  );
}