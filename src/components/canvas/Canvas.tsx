"use client";

import React, { useRef, useCallback } from 'react';
import { Wall, PlanDimensions, GridSettings, Point } from '@/types/pharmacy';
import { getMousePosition } from '@/lib/canvas/utils';
import Grid from './Grid';

interface CanvasProps {
  dimensions: PlanDimensions;
  walls: Wall[];
  gridSettings: GridSettings;
  previewWall: Wall | null;
  onMouseMove: (point: Point) => void;
  onCanvasClick: (point: Point) => void;
}

export default function Canvas({
  dimensions,
  walls,
  gridSettings,
  previewWall,
  onMouseMove,
  onCanvasClick,
}: CanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseMove = useCallback((event: React.MouseEvent<SVGElement>) => {
    if (!svgRef.current) return;
    const point = getMousePosition(event, svgRef.current);
    onMouseMove(point);
  }, [onMouseMove]);

  const handleClick = useCallback((event: React.MouseEvent<SVGElement>) => {
    if (!svgRef.current) return;
    const point = getMousePosition(event, svgRef.current);
    onCanvasClick(point);
  }, [onCanvasClick]);

  const renderWall = (wall: Wall) => {
    const isPreview = wall.isTemporary;
    
    return (
      <line
        key={wall.id}
        x1={wall.start.x}
        y1={wall.start.y}
        x2={wall.end.x}
        y2={wall.end.y}
        stroke={isPreview ? "#0A5B91" : "#374151"}
        strokeWidth={wall.thickness}
        strokeLinecap="round"
        opacity={isPreview ? 0.6 : 1}
        strokeDasharray={isPreview ? "8,4" : "none"}
      />
    );
  };

  return (
    <div className="flex-1 overflow-hidden bg-white border border-gray-200 rounded-lg">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="cursor-crosshair"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <Grid dimensions={dimensions} settings={gridSettings} />
        
        {/* Murs existants */}
        {walls.map(renderWall)}
        
        {/* Mur en cours de création */}
        {previewWall && renderWall(previewWall)}
      </svg>
    </div>
  );
}