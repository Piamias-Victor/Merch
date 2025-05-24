export interface Point {
  x: number;
  y: number;
}

export interface Shelf {
  id: string;
  position: Point;
  width: number;
  height: number;
  rotation: number;
  isSelected?: boolean;
  zIndex?: number;
}

export interface ShelfState {
  shelves: Shelf[];
  selectedShelfId: string | null;
  activeTool: 'select' | 'shelf';
}

export interface ShelfDragEvent {
  shelfId: string;
  newPosition: Point;
}

export interface ShelfTransformEvent {
  shelfId: string;
  width: number;
  height: number;
  rotation: number;
  position: Point;
}

export const DEFAULT_SHELF_DIMENSIONS = {
  width: 120,
  height: 40,
} as const;