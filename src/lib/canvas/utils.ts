import { Point, GridSettings } from '@/types/pharmacy';

export const snapToGrid = (point: Point, gridSize: number): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize,
  };
};

export const getMousePosition = (
  event: React.MouseEvent<SVGElement>,
  svgElement: SVGElement
): Point => {
  const rect = svgElement.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};

export const calculateDistance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const isPointEqual = (p1: Point, p2: Point, tolerance: number = 1): boolean => {
  return Math.abs(p1.x - p2.x) <= tolerance && Math.abs(p1.y - p2.y) <= tolerance;
};