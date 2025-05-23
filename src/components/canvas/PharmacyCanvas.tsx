import React, { useState } from 'react';
import { Stage, Layer, Rect, Circle, Line } from 'react-konva';

interface PharmacyCanvasProps {
  width?: number;
  height?: number;
}

export default function PharmacyCanvas({ width = 800, height = 600 }: PharmacyCanvasProps) {
  const [rectangles, setRectangles] = useState([
    { id: 1, x: 100, y: 100, width: 100, height: 100, fill: '#0A5B91' },
    { id: 2, x: 250, y: 150, width: 120, height: 80, fill: '#4882b4' },
  ]);

  const handleRectDrag = (id: number, e: any) => {
    setRectangles(prev => 
      prev.map(rect => 
        rect.id === id ? { ...rect, x: e.target.x(), y: e.target.y() } : rect
      )
    );
  };

  return (
    <Stage width={width} height={height}>
      <Layer>
        {/* Grille de fond */}
        {Array.from({ length: Math.ceil(width / 20) }, (_, i) => (
          <Line
            key={`v-${i}`}
            points={[i * 20, 0, i * 20, height]}
            stroke="#f1f5f9"
            strokeWidth={0.5}
          />
        ))}
        {Array.from({ length: Math.ceil(height / 20) }, (_, i) => (
          <Line
            key={`h-${i}`}
            points={[0, i * 20, width, i * 20]}
            stroke="#f1f5f9"
            strokeWidth={0.5}
          />
        ))}
        
        {/* Rectangles draggables */}
        {rectangles.map(rect => (
          <Rect
            key={rect.id}
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            fill={rect.fill}
            draggable
            onDragEnd={(e) => handleRectDrag(rect.id, e)}
            onMouseEnter={(e) => {
              e.target.getStage()!.container().style.cursor = 'move';
            }}
            onMouseLeave={(e) => {
              e.target.getStage()!.container().style.cursor = 'default';
            }}
          />
        ))}
        
        {/* Cercle test */}
        <Circle
          x={400}
          y={200}
          radius={50}
          fill="#22c55e"
          draggable
        />
      </Layer>
    </Stage>
  );
}