"use client";

import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Wall, PlanMetadata, GridSettings } from '@/types/editor';
import { Shelf } from '@/types/shelf';
import { useCanvasViewport } from '@/hooks/editor/useCanvasViewport';
import ZoneToolbar from './ZoneToolbar';

const ZoneCanvas = dynamic(() => import('@/components/zones/ZoneCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 bg-gray-100 flex items-center justify-center">
      <div className="text-lg text-gray-600">Chargement du canvas zones...</div>
    </div>
  ),
});

interface ZoneLayoutProps {
  metadata: PlanMetadata;
  walls: Wall[];
  furniture: Shelf[];
}

export default function ZoneLayout({ metadata, walls, furniture }: ZoneLayoutProps) {
  const router = useRouter();
  
  // Charger les rayons depuis localStorage si pas fournis
  const [loadedFurniture] = useState(() => {
    if (furniture.length > 0) {
      return furniture;
    }
    try {
      const saved = localStorage.getItem('current-furniture');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Erreur lors du chargement des rayons:', error);
      return [];
    }
  });

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

  const handleBackToFurniture = useCallback(() => {
    const params = new URLSearchParams();
    params.append('step', 'furniture');
    params.append('name', metadata.name);
    params.append('width', metadata.dimensions.width.toString());
    params.append('height', metadata.dimensions.height.toString());
    
    router.push(`/editor?${params.toString()}`);
  }, [metadata, router]);

  const handleFinishPlan = useCallback(() => {
    // Sauvegarder le plan final complet
    const finalPlan = {
      metadata,
      walls,
      furniture: loadedFurniture,
      // zones: [], // À récupérer du hook useZoneCreation si besoin
      completedAt: new Date(),
    };
    
    localStorage.setItem('completed-plan', JSON.stringify(finalPlan));
    
    // Rediriger vers la page d'accueil ou une page de résumé
    router.push('/');
  }, [metadata, walls, furniture, router]);

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
          Étape 3: Création des zones ({walls.length} mur{walls.length !== 1 ? 's' : ''}, {loadedFurniture.length} rayon{loadedFurniture.length !== 1 ? 's' : ''})
        </div>
        <div className="ml-auto flex items-center gap-4">
          <button
            onClick={handleBackToFurniture}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            ← Retour aux rayons
          </button>
          <div className="text-sm text-gray-500">
            {metadata.dimensions.width} × {metadata.dimensions.height} px • Zoom: {Math.round(viewport.scale * 100)}%
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <ZoneToolbar
          gridVisible={gridSettings.visible}
          onToggleGrid={() => setGridSettings(prev => ({ ...prev, visible: !prev.visible }))}
          zoom={viewport.scale}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onZoomToFit={handleZoomToFit}
          onResetZoom={resetZoom}
          onFinishPlan={handleFinishPlan}
        />
        
        <div className="flex-1">
          <ZoneCanvas
            dimensions={metadata.dimensions}
            walls={walls}
            furniture={loadedFurniture}
            gridSettings={gridSettings}
            viewport={viewport}
            stageRef={stageRef}
            onDragEnd={handleDragEnd}
          />
        </div>
      </div>

      <div className="bg-[#0A5B91] text-white px-4 py-2 text-sm">
        <strong>Mode création de zones :</strong> 
        Sélectionnez un univers, puis cliquez et tirez pour créer une zone. 
        <strong>Raccourcis :</strong> +/- (zoom), 0 (ajuster), R (reset zoom)
      </div>
    </div>
  );
}