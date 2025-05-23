"use client";

import React, { useState, useEffect } from 'react';

export default function KonvaTest() {
  const [konvaComponents, setKonvaComponents] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [rectangles, setRectangles] = useState([
    { id: 1, x: 100, y: 100, width: 100, height: 100, fill: '#0A5B91' },
    { id: 2, x: 250, y: 150, width: 120, height: 80, fill: '#4882b4' },
  ]);

  const [circles, setCircles] = useState([
    { id: 1, x: 400, y: 200, radius: 50, fill: '#22c55e' },
  ]);

  useEffect(() => {
    // Import dynamique côté client uniquement
    const loadKonva = async () => {
      try {
        const { Stage, Layer, Rect, Circle, Line } = await import('react-konva');
        setKonvaComponents({ Stage, Layer, Rect, Circle, Line });
        setIsLoaded(true);
      } catch (error) {
        console.error('Erreur lors du chargement de Konva:', error);
      }
    };

    loadKonva();
  }, []);

  const handleRectDrag = (id: number, newX: number, newY: number) => {
    setRectangles(prev => 
      prev.map(rect => 
        rect.id === id ? { ...rect, x: newX, y: newY } : rect
      )
    );
  };

  const handleCircleDrag = (id: number, newX: number, newY: number) => {
    setCircles(prev => 
      prev.map(circle => 
        circle.id === id ? { ...circle, x: newX, y: newY } : circle
      )
    );
  };

  if (!isLoaded || !konvaComponents) {
    return (
      <div className="w-full h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-lg text-gray-600">Chargement de Konva...</div>
      </div>
    );
  }

  const { Stage, Layer, Rect, Circle, Line } = konvaComponents;

  return (
    <div className="w-full h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Test Konva.js</h2>
        <p className="text-gray-600 text-sm">
          • Glissez les rectangles et cercles<br/>
          • Les lignes sont statiques pour le moment
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <Stage width={800} height={600}>
          <Layer>
            {/* Grille de fond */}
            {Array.from({ length: 40 }, (_, i) => (
              <Line
                key={`grid-v-${i}`}
                points={[i * 20, 0, i * 20, 600]}
                stroke="#e2e8f0"
                strokeWidth={0.5}
              />
            ))}
            {Array.from({ length: 30 }, (_, i) => (
              <Line
                key={`grid-h-${i}`}
                points={[0, i * 20, 800, i * 20]}
                stroke="#e2e8f0"
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
                onDragEnd={(e) => handleRectDrag(rect.id, e.target.x(), e.target.y())}
                onMouseEnter={(e) => {
                  e.target.getStage()!.container().style.cursor = 'move';
                }}
                onMouseLeave={(e) => {
                  e.target.getStage()!.container().style.cursor = 'default';
                }}
              />
            ))}
            
            {/* Cercles draggables */}
            {circles.map(circle => (
              <Circle
                key={circle.id}
                x={circle.x}
                y={circle.y}
                radius={circle.radius}
                fill={circle.fill}
                draggable
                onDragEnd={(e) => handleCircleDrag(circle.id, e.target.x(), e.target.y())}
                onMouseEnter={(e) => {
                  e.target.getStage()!.container().style.cursor = 'move';
                }}
                onMouseLeave={(e) => {
                  e.target.getStage()!.container().style.cursor = 'default';
                }}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}