"use client";

import React, { useCallback, useEffect } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import { Wall, PlanDimensions, GridSettings } from '@/types/editor';
import { useShelfPlacement } from '@/hooks/furniture/useShelfPlacement';
import ShelfElement from './ShelfElement';
import PropertiesPanel from './PropertiesPanel';

interface FurnitureCanvasProps {
  dimensions: PlanDimensions;
  walls: Wall[];
  gridSettings: GridSettings;
  viewport: { scale: number; x: number; y: number };
  stageRef: React.RefObject<any>;
  onDragEnd: (e: any) => void;
  onFurnitureDataUpdate?: (data: any) => void;
}

export default function FurnitureCanvas({
  dimensions,
  walls,
  gridSettings,
  viewport,
  stageRef,
  onDragEnd,
  onFurnitureDataUpdate,
}: FurnitureCanvasProps) {
  const {
    shelves,
    selectedShelfId,
    activeTool,
    setActiveTool,
    handleCanvasClick,
    handleShelfSelect,
    handleShelfDrag,
    handleShelfTransform,
    updateShelf,
    getSelectedShelf,
    deleteSelectedShelf,
    duplicateSelectedShelf,
  } = useShelfPlacement();

  // Transmettre les données du mobilier au parent
  useEffect(() => {
    if (onFurnitureDataUpdate) {
      onFurnitureDataUpdate({ 
        shelves, 
        selectedShelfId 
      });
    }
  }, [shelves, selectedShelfId, onFurnitureDataUpdate]);

  const handleStageClick = useCallback((e: any) => {
    // Seulement traiter si le clic est sur le Stage lui-même (pas sur un enfant)
    if (e.target === e.target.getStage()) {
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      
      if (point) {
        // Convertir les coordonnées écran en coordonnées du plan
        const planPoint = {
          x: (point.x - viewport.x) / viewport.scale,
          y: (point.y - viewport.y) / viewport.scale,
        };
        
        // Vérifier que le clic est dans la zone du plan
        if (planPoint.x >= 0 && planPoint.x <= dimensions.width && 
            planPoint.y >= 0 && planPoint.y <= dimensions.height) {
          handleCanvasClick(planPoint);
        }
      }
    }
  }, [handleCanvasClick, dimensions, viewport]);

  const handleStageDragEnd = useCallback((e: any) => {
    // Ne traiter le drag que si c'est le Stage qui a bougé
    if (e.target === e.target.getStage()) {
      onDragEnd(e);
    }
  }, [onDragEnd]);

  const handleUpdateSelectedShelf = useCallback((updates: Partial<import('@/types/shelf').Shelf>) => {
    if (selectedShelfId) {
      updateShelf(selectedShelfId, updates);
    }
  }, [selectedShelfId, updateShelf]);

  const renderWall = useCallback((wall: Wall) => {
    const isPreview = wall.isTemporary;
    
    return (
      <Line
        key={wall.id}
        points={[wall.start.x, wall.start.y, wall.end.x, wall.end.y]}
        stroke={isPreview ? "#0A5B91" : "#374151"}
        strokeWidth={wall.thickness}
        lineCap="round"
        opacity={isPreview ? 0.6 : 1}
        dash={isPreview ? [8, 4] : []}
        listening={false}
      />
    );
  }, []);

  return (
    <div className="flex-1 flex">
      {/* Zone principale du canvas */}
      <div className="flex-1 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden mr-4">
        {/* Barre d'outils pour les rayons */}
        <div className="bg-white border-b border-gray-200 p-3 flex items-center gap-3">
          <button
            onClick={() => setActiveTool('select')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTool === 'select' 
                ? 'bg-[#0A5B91] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Sélection
          </button>
          <button
            onClick={() => setActiveTool('shelf')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTool === 'shelf' 
                ? 'bg-[#0A5B91] text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rayon
          </button>
          <div className="text-sm text-gray-500 ml-4">
            {activeTool === 'shelf' ? 
              'Cliquez dans le plan pour placer un rayon' : 
              `${shelves.length} rayon${shelves.length !== 1 ? 's' : ''} placé${shelves.length !== 1 ? 's' : ''}`
            }
          </div>
          {selectedShelfId && (
            <div className="text-sm text-blue-600 ml-2">
              • Rayon sélectionné
            </div>
          )}
        </div>

        <Stage
          ref={stageRef}
          width={800}
          height={560} // Ajuster pour la barre d'outils
          scaleX={viewport.scale}
          scaleY={viewport.scale}
          x={viewport.x}
          y={viewport.y}
          draggable
          onClick={handleStageClick}
          onTap={handleStageClick}
          onDragEnd={handleStageDragEnd}
        >
          <Layer>
            {/* Zone de plan avec fond blanc */}
            <Rect
              x={0}
              y={0}
              width={dimensions.width}
              height={dimensions.height}
              fill="white"
              stroke="#0A5B91"
              strokeWidth={2 / viewport.scale}
              dash={[5 / viewport.scale, 5 / viewport.scale]}
              listening={false}
            />
            
            {/* Grille */}
            {gridSettings.visible && (
              <>
                {Array.from({ length: Math.ceil(dimensions.width / gridSettings.size) + 1 }, (_, i) => (
                  <Line
                    key={`v-${i}`}
                    points={[i * gridSettings.size, 0, i * gridSettings.size, dimensions.height]}
                    stroke="#e2e8f0"
                    strokeWidth={(i % 5 === 0 ? 0.8 : 0.3) / viewport.scale}
                    opacity={i % 5 === 0 ? 0.6 : 0.4}
                    listening={false}
                  />
                ))}
                {Array.from({ length: Math.ceil(dimensions.height / gridSettings.size) + 1 }, (_, i) => (
                  <Line
                    key={`h-${i}`}
                    points={[0, i * gridSettings.size, dimensions.width, i * gridSettings.size]}
                    stroke="#e2e8f0"
                    strokeWidth={(i % 5 === 0 ? 0.8 : 0.3) / viewport.scale}
                    opacity={i % 5 === 0 ? 0.6 : 0.4}
                    listening={false}
                  />
                ))}
              </>
            )}
            
            {/* Murs existants */}
            {walls.map(renderWall)}
            
            {/* Rayons */}
            {shelves.map((shelf) => (
              <ShelfElement
                key={shelf.id}
                shelf={shelf}
                isSelected={shelf.id === selectedShelfId}
                onSelect={handleShelfSelect}
                onDrag={handleShelfDrag}
                onTransform={handleShelfTransform}
                viewport={viewport}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      {/* Panneau de propriétés */}
      <PropertiesPanel
        selectedShelf={getSelectedShelf()}
        onUpdateShelf={handleUpdateSelectedShelf}
        onDeleteShelf={deleteSelectedShelf}
        onDuplicateShelf={duplicateSelectedShelf}
      />
    </div>
  );
}