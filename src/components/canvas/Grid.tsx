import React from 'react';
import { GridSettings, PlanDimensions } from '@/types/pharmacy';

interface GridProps {
  dimensions: PlanDimensions;
  settings: GridSettings;
}

export default function Grid({ dimensions, settings }: GridProps) {
  if (!settings.visible) return null;

  const { size } = settings;
  const { width, height } = dimensions;

  // Calcul des lignes de grille
  const verticalLines = [];
  const horizontalLines = [];

  for (let x = 0; x <= width; x += size) {
    verticalLines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke="#e2e8f0"
        strokeWidth={x % (size * 5) === 0 ? 0.8 : 0.3}
        opacity={x % (size * 5) === 0 ? 0.6 : 0.4}
      />
    );
  }

  for (let y = 0; y <= height; y += size) {
    horizontalLines.push(
      <line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke="#e2e8f0"
        strokeWidth={y % (size * 5) === 0 ? 0.8 : 0.3}
        opacity={y % (size * 5) === 0 ? 0.6 : 0.4}
      />
    );
  }

  return (
    <g className="grid">
      {verticalLines}
      {horizontalLines}
    </g>
  );
}