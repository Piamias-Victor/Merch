"use client";

import React, { useCallback } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import { Wall, PlanDimensions, GridSettings } from '@/types/editor';
import { Shelf } from '@/types/shelf';
import { ZoneCategory, ZONE_CATEGORIES } from '@/types/zone';
import { useZoneCreation } from '@/hooks/zones/useZoneCreation';
import ZonePropertiesPanel from './ZonePropertiesPanel';
import ZoneElement from './ZoneElement';


interface ZoneCanvasProps {
  dimensions: PlanDimensions;
  walls: Wall[];
  furniture: Shelf[];
  gridSettings: GridSettings;
  viewport: { scale: number; x: number; y: number };
  stageRef: React.RefObject<any>;
  onDragEnd: (e: any) => void;
}

export default function ZoneCanvas({
  dimensions,
  walls,
  furniture,
  gridSettings,
  viewport,
  stageRef,
  onDragEnd,
}: ZoneCanvasProps) {
  const {
    zones,
    selectedZoneId,
    activeTool,
    currentCategory,
    isDrawing,
    setActiveTool,
    setCurrentCategory,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCanvasClick,
    handleZoneSelect,
    handleZoneDrag,
    handleZoneResize,
    updateZone,
    getSelectedZone,
    deleteSelectedZone,
    duplicateSelectedZone,
    getPreviewZone,
  } = useZoneCreation();

  const handleStageMouseDown = useCallback((e: any) => {
    if (e.target === e.target.getStage()) {
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      
      if (point) {
        const planPoint = {
          x: (point.x - viewport.x) / viewport.scale,
          y: (point.y - viewport.y) / viewport.scale,
        };
        
        if (planPoint.x >= 0 && planPoint.x <= dimensions.width && 
            planPoint.y >= 0 && planPoint.y <= dimensions.height) {
          handleMouseDown(planPoint);
        }
      }
    }
  }, [handleMouseDown, dimensions, viewport]);

  const handleStageMouseMove = useCallback((e: any) => {
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    if (point) {
      const planPoint = {
        x: (point.x - viewport.x) / viewport.scale,
        y: (point.y - viewport.y) / viewport.scale,
      };
      handleMouseMove(planPoint);
    }
  }, [handleMouseMove, viewport]);

  const handleStageMouseUp = useCallback((e: any) => {
    if (e.target === e.target.getStage()) {
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      
      if (point) {
        const planPoint = {
          x: (point.x - viewport.x) / viewport.scale,
          y: (point.y - viewport.y) / viewport.scale,
        };
        
        if (planPoint.x >= 0 && planPoint.x <= dimensions.width && 
            planPoint.y >= 0 && planPoint.y <= dimensions.height) {
          if (activeTool === 'zone') {
            handleMouseUp(planPoint);
          } else {
            handleCanvasClick(planPoint);
          }
        }
      }
    }
  }, [handleMouseUp, handleCanvasClick, dimensions, viewport, activeTool]);

  const handleStageDragEnd = useCallback((e: any) => {
    if (e.target === e.target.getStage()) {
      onDragEnd(e);
    }
  }, [onDragEnd]);

  const handleUpdateSelectedZone = useCallback((updates: Partial<import('@/types/zone').Zone>) => {
    if (selectedZoneId) {
      updateZone(selectedZoneId, updates);
    }
  }, [selectedZoneId, updateZone]);

  const renderWall = useCallback((wall: Wall) => {
    return (
      <Line
        key={wall.id}
        points={[wall.start.x, wall.start.y, wall.end.x, wall.end.y]}
        stroke="#374151"
        strokeWidth={wall.thickness}
        lineCap="round"
        listening={false}
      />
    );
  }, []);

  const renderShelf = useCallback((shelf: Shelf) => {
    return (
      <Rect
        key={shelf.id}
        x={shelf.position.x}
        y={shelf.position.y}
        width={shelf.width}
        height={shelf.height}
        rotation={shelf.rotation}
        fill="#4882b4"
        stroke="#0A5B91"
        strokeWidth={2 / viewport.scale}
        opacity={0.8}
        cornerRadius={4 / viewport.scale}
        listening={false}
      />
    );
  }, [viewport.scale]);

  const previewZone = getPreviewZone();

  return (
    <div className="flex-1 flex">
      {/* Zone principale du canvas */}
      <div className="flex-1 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden mr-4">
        {/* Barre d'outils pour les zones */}
        <div className="bg-white border-b border-gray-200 p-3 space-y-3">
          <div className="flex items-center gap-3">
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
              onClick={() => setActiveTool('zone')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTool === 'zone' 
                  ? 'bg-[#0A5B91] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Zone
            </button>
            <div className="text-sm text-gray-500 ml-4">
              {activeTool === 'zone' ? 
                'Cliquez et tirez pour créer une zone' : 
                `${zones.length} zone${zones.length !== 1 ? 's' : ''} créée${zones.length !== 1 ? 's' : ''}`
              }
            </div>
            {selectedZoneId && (
              <div className="text-sm text-blue-600 ml-2">
                • Zone sélectionnée
              </div>
            )}
          </div>

          {/* Sélecteur d'univers */}
          {activeTool === 'zone' && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Univers :</span>
              <select
                value={currentCategory}
                onChange={(e) => setCurrentCategory(e.target.value as ZoneCategory)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-[#0A5B91] focus:border-[#0A5B91]"
              >
                {Object.entries(ZONE_CATEGORIES).map(([key, data]) => (
                  <option key={key} value={key}>
                    {data.label}
                  </option>
                ))}
              </select>
              <div 
                className="w-6 h-6 rounded border border-gray-300 ml-2"
                style={{ backgroundColor: ZONE_CATEGORIES[currentCategory].color }}
                title={ZONE_CATEGORIES[currentCategory].description}
              />
            </div>
          )}
        </div>

        <Stage
          ref={stageRef}
          width={800}
          height={520}
          scaleX={viewport.scale}
          scaleY={viewport.scale}
          x={viewport.x}
          y={viewport.y}
          draggable={!isDrawing}
          onMouseDown={handleStageMouseDown}
          onMouseMove={handleStageMouseMove}
          onMouseUp={handleStageMouseUp}
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
            
            {/* Zones existantes */}
            {zones.map((zone) => (
              <ZoneElement
                key={zone.id}
                zone={zone}
                isSelected={zone.id === selectedZoneId}
                onSelect={handleZoneSelect}
                onDrag={handleZoneDrag}
                onResize={handleZoneResize}
                viewport={viewport}
              />
            ))}

            {/* Zone en cours de création */}
            {previewZone && (
              <ZoneElement
                zone={previewZone}
                isSelected={false}
                isPreview={true}
                onSelect={() => {}}
                onDrag={() => {}}
                onResize={() => {}}
                viewport={viewport}
              />
            )}
            
            {/* Murs existants */}
            {walls.map(renderWall)}
            
            {/* Rayons existants */}
            {furniture.map(renderShelf)}
          </Layer>
        </Stage>
      </div>

      {/* Panneau de propriétés */}
      <ZonePropertiesPanel
        selectedZone={getSelectedZone()}
        onUpdateZone={handleUpdateSelectedZone}
        onDeleteZone={deleteSelectedZone}
        onDuplicateZone={duplicateSelectedZone}
      />
    </div>
  );
}