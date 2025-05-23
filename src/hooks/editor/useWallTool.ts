import { useState, useCallback } from 'react';
import { Point, Wall, EditorState } from '@/types/pharmacy';
import { snapToGrid, generateId } from '@/lib/canvas/utils';

interface UseWallToolProps {
  gridSize: number;
  snapEnabled: boolean;
  onWallCreate: (wall: Wall) => void;
}

export const useWallTool = ({ gridSize, snapEnabled, onWallCreate }: UseWallToolProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [mousePosition, setMousePosition] = useState<Point>({ x: 0, y: 0 });

  const handleMouseMove = useCallback((point: Point) => {
    const finalPoint = snapEnabled ? snapToGrid(point, gridSize) : point;
    setMousePosition(finalPoint);
  }, [gridSize, snapEnabled]);

  const handleCanvasClick = useCallback((point: Point) => {
    const finalPoint = snapEnabled ? snapToGrid(point, gridSize) : point;

    if (!isDrawing) {
      // Premier clic : démarrer le mur
      setStartPoint(finalPoint);
      setIsDrawing(true);
    } else if (startPoint) {
      // Deuxième clic : finaliser le mur
      const newWall: Wall = {
        id: generateId(),
        start: startPoint,
        end: finalPoint,
        thickness: 10, // 10cm par défaut
      };
      
      onWallCreate(newWall);
      
      // Continuer avec le point final comme nouveau point de départ
      setStartPoint(finalPoint);
    }
  }, [isDrawing, startPoint, snapEnabled, gridSize, onWallCreate]);

  const cancelDrawing = useCallback(() => {
    setIsDrawing(false);
    setStartPoint(null);
  }, []);

  const getPreviewWall = useCallback((): Wall | null => {
    if (!isDrawing || !startPoint) return null;
    
    return {
      id: 'preview',
      start: startPoint,
      end: mousePosition,
      thickness: 10,
      isTemporary: true,
    };
  }, [isDrawing, startPoint, mousePosition]);

  return {
    isDrawing,
    startPoint,
    mousePosition,
    handleMouseMove,
    handleCanvasClick,
    cancelDrawing,
    getPreviewWall,
  };
};