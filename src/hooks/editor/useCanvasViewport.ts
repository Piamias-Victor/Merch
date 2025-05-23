import { useState, useCallback, useRef } from 'react';

interface ViewportState {
  scale: number;
  x: number;
  y: number;
}

interface UseCanvasViewportProps {
  minScale?: number;
  maxScale?: number;
  scaleStep?: number;
}

export const useCanvasViewport = ({ 
  minScale = 0.1, 
  maxScale = 5, 
  scaleStep = 0.2 
}: UseCanvasViewportProps = {}) => {
  const [viewport, setViewport] = useState<ViewportState>({
    scale: 1,
    x: 0,
    y: 0,
  });
  
  const stageRef = useRef<any>(null);

  const zoomIn = useCallback(() => {
    setViewport(prev => ({
      ...prev,
      scale: Math.min(prev.scale + scaleStep, maxScale),
    }));
  }, [scaleStep, maxScale]);

  const zoomOut = useCallback(() => {
    setViewport(prev => ({
      ...prev,
      scale: Math.max(prev.scale - scaleStep, minScale),
    }));
  }, [scaleStep, minScale]);

  const resetZoom = useCallback(() => {
    setViewport({
      scale: 1,
      x: 0,
      y: 0,
    });
  }, []);

  const zoomToFit = useCallback((containerWidth: number, containerHeight: number, contentWidth: number, contentHeight: number) => {
    const scaleX = containerWidth / contentWidth;
    const scaleY = containerHeight / contentHeight;
    const optimalScale = Math.min(scaleX, scaleY, 1) * 0.8; // 80% pour laisser de la marge
    
    setViewport({
      scale: Math.max(optimalScale, minScale),
      x: (containerWidth - contentWidth * optimalScale) / 2,
      y: (containerHeight - contentHeight * optimalScale) / 2,
    });
  }, [minScale]);

  const handleDragEnd = useCallback((e: any) => {
    setViewport(prev => ({
      ...prev,
      x: e.target.x(),
      y: e.target.y(),
    }));
  }, []);

  return {
    viewport,
    stageRef,
    zoomIn,
    zoomOut,
    resetZoom,
    zoomToFit,
    handleDragEnd,
    setViewport,
  };
};