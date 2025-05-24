"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Wall, PlanMetadata, GridSettings } from '@/types/editor';
import { useCanvasViewport } from '@/hooks/editor/useCanvasViewport';
import FurnitureToolbar from './FurnitureToolbar';

const FurnitureCanvas = dynamic(() => import('@/components/furniture/FurnitureCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 bg-gray-100 flex items-center justify-center">
      <div className="text-lg text-gray-600">Chargement du canvas rayons...</div>
    </div>
  ),
});

interface FurnitureLayoutProps {
  metadata: PlanMetadata;
  walls: Wall[];
}

export default function FurnitureLayout({ metadata, walls }: FurnitureLayoutProps) {
  const router = useRouter();
  const furnitureDataRef = useRef<any>(null);
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

  const handleZoomToFit = useCallback(() => {
    const containerWidth = 800;
    const containerHeight = 600;
    zoomToFit(containerWidth, containerHeight, metadata.dimensions.width, metadata.dimensions.height);
  }, [zoomToFit, metadata.dimensions]);

  const handleBackToWalls = useCallback(() => {
    const params = new URLSearchParams();
    params.append('name', metadata.name);
    params.append('width', metadata.dimensions.width.toString());
    params.append('height', metadata.dimensions.height.toString());
    
    router.push(`/editor?${params.toString()}`);
  }, [metadata, router]);

  const handleFurnitureDataUpdate = useCallback((furnitureData: any) => {
    furnitureDataRef.current = furnitureData;
  }, []);

  const handleFinishFurniture = useCallback(() => {
    // Sauvegarder les rayons dans localStorage
    const furnitureData = furnitureDataRef.current || { shelves: [] };
    
    localStorage.setItem('current-furniture', JSON.stringify(furnitureData.shelves));
    
    // Rediriger vers l'étape zones
    const params = new URLSearchParams();
    params.append('step', 'zones');
    params.append('name', metadata.name);
    params.append('width', metadata.dimensions.width.toString());
    params.append('height', metadata.dimensions.height.toString());
    
    router.push(`/editor?${params.toString()}`);
  }, [metadata, router]);

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '+' || event.key === '=') {
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
  }, [zoomIn, zoomOut, handleZoomToFit, resetZoom]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4">
        <h1 className="text-lg font-medium text-gray-900">{metadata.name}</h1>
        <div className="ml-4 text-sm text-gray-500">
          Étape 2: Placement des rayons ({walls.length} mur{walls.length !== 1 ? 's' : ''} défini{walls.length !== 1 ? 's' : ''})
        </div>
        <div className="ml-auto flex items-center gap-4">
          <button
            onClick={handleBackToWalls}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            ← Retour aux murs
          </button>
          <div className="text-sm text-gray-500">
            {metadata.dimensions.width} × {metadata.dimensions.height} px • Zoom: {Math.round(viewport.scale * 100)}%
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <FurnitureToolbar
          gridVisible={gridSettings.visible}
          onToggleGrid={() => setGridSettings(prev => ({ ...prev, visible: !prev.visible }))}
          zoom={viewport.scale}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onZoomToFit={handleZoomToFit}
          onResetZoom={resetZoom}
          onFinishPlan={handleFinishFurniture}
        />
        
        <div className="flex-1">
          <FurnitureCanvas
            dimensions={metadata.dimensions}
            walls={walls}
            gridSettings={gridSettings}
            viewport={viewport}
            stageRef={stageRef}
            onDragEnd={handleDragEnd}
            onFurnitureDataUpdate={handleFurnitureDataUpdate}
          />
        </div>
      </div>

      <div className="bg-[#0A5B91] text-white px-4 py-2 text-sm">
        <strong>Mode placement de rayons :</strong> 
        Cliquez sur "Rayon" puis cliquez dans le plan pour placer des rayons. 
        <strong>Raccourcis :</strong> +/- (zoom), 0 (ajuster), R (reset zoom)
      </div>
    </div>
  );
}