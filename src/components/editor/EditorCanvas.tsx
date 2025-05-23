import React, { useRef, useCallback } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import { Wall, PlanDimensions, GridSettings, Point } from '@/types/editor';

interface EditorCanvasProps {
  dimensions: PlanDimensions;
  walls: Wall[];
  gridSettings: GridSettings;
  previewWall: Wall | null;
  onMouseMove: (point: Point) => void;
  onCanvasClick: (point: Point) => void;
  viewport: { scale: number; x: number; y: number };
  stageRef: React.RefObject<any>;
  onDragEnd: (e: any) => void;
}

export default function EditorCanvas({
  dimensions,
  walls,
  gridSettings,
  previewWall,
  onMouseMove,
  onCanvasClick,
  viewport,
  stageRef,
  onDragEnd,
}: EditorCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: any) => {
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (point) {
      // Convertir les coordonnées écran en coordonnées du plan
      const planPoint = {
        x: (point.x - viewport.x) / viewport.scale,
        y: (point.y - viewport.y) / viewport.scale,
      };
      
      // Valider que le point est dans les limites du plan
      const validPoint = {
        x: Math.max(0, Math.min(planPoint.x, dimensions.width)),
        y: Math.max(0, Math.min(planPoint.y, dimensions.height)),
      };
      onMouseMove(validPoint);
    }
  }, [onMouseMove, dimensions, viewport]);

  const handleClick = useCallback((e: any) => {
    // Empêcher le clic si on a fait un drag (pan)
    const stage = e.target.getStage();
    if (stage.isDragging()) {
      return;
    }

    const point = stage.getPointerPosition();
    if (point) {
      // Convertir les coordonnées écran en coordonnées du plan
      const planPoint = {
        x: (point.x - viewport.x) / viewport.scale,
        y: (point.y - viewport.y) / viewport.scale,
      };
      
      // Seulement permettre les clics dans les limites du plan
      if (planPoint.x >= 0 && planPoint.x <= dimensions.width && 
          planPoint.y >= 0 && planPoint.y <= dimensions.height) {
        onCanvasClick(planPoint);
      }
    }
  }, [onCanvasClick, dimensions, viewport]);

  const renderWall = (wall: Wall) => {
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
        listening={false} // Important: empêche les murs d'intercepter les clics
      />
    );
  };

  const containerWidth = containerRef.current?.clientWidth || 800;
  const containerHeight = containerRef.current?.clientHeight || 600;

  return (
    <div 
      ref={containerRef}
      className="flex-1 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <Stage
        ref={stageRef}
        width={containerWidth}
        height={containerHeight}
        scaleX={viewport.scale}
        scaleY={viewport.scale}
        x={viewport.x}
        y={viewport.y}
        draggable
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onDragEnd={onDragEnd}
      >
        <Layer>
          {/* Zone de plan principale avec fond blanc */}
          <Rect
            x={0}
            y={0}
            width={dimensions.width}
            height={dimensions.height}
            fill="white"
            stroke="#0A5B91"
            strokeWidth={2 / viewport.scale}
            dash={[5 / viewport.scale, 5 / viewport.scale]}
            listening={false} // Empêche le rectangle d'intercepter les clics
          />
          
          {/* Grille dans la zone de plan */}
          {gridSettings.visible && (
            <>
              {Array.from({ length: Math.ceil(dimensions.width / gridSettings.size) + 1 }, (_, i) => (
                <Line
                  key={`v-${i}`}
                  points={[
                    i * gridSettings.size, 
                    0, 
                    i * gridSettings.size, 
                    dimensions.height
                  ]}
                  stroke="#e2e8f0"
                  strokeWidth={(i % 5 === 0 ? 0.8 : 0.3) / viewport.scale}
                  opacity={i % 5 === 0 ? 0.6 : 0.4}
                  listening={false} // Empêche la grille d'intercepter les clics
                />
              ))}
              {Array.from({ length: Math.ceil(dimensions.height / gridSettings.size) + 1 }, (_, i) => (
                <Line
                  key={`h-${i}`}
                  points={[
                    0, 
                    i * gridSettings.size, 
                    dimensions.width, 
                    i * gridSettings.size
                  ]}
                  stroke="#e2e8f0"
                  strokeWidth={(i % 5 === 0 ? 0.8 : 0.3) / viewport.scale}
                  opacity={i % 5 === 0 ? 0.6 : 0.4}
                  listening={false} // Empêche la grille d'intercepter les clics
                />
              ))}
            </>
          )}
          
          {/* Murs existants */}
          {walls.map(renderWall)}
          
          {/* Mur en cours de création */}
          {previewWall && renderWall(previewWall)}
        </Layer>
      </Stage>
    </div>
  );
}