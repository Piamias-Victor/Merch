export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  isTemporary?: boolean;
}

export interface PlanDimensions {
  width: number;
  height: number;
}

export interface GridSettings {
  size: number;
  visible: boolean;
  snapEnabled: boolean;
}

export interface EditorState {
  activeTool: 'select' | 'wall';
  walls: Wall[];
  isDrawing: boolean;
  currentStart: Point | null;
}

export interface PlanMetadata {
  name: string;
  dimensions: PlanDimensions;
  createdAt: Date;
  updatedAt: Date;
}

// Ajouter à la fin du fichier
export type EditorTool = 'select' | 'wall' | 'furniture';

export interface EditorState {
  activeTool: EditorTool;
  walls: Wall[];
  furniture: import('./furniture').Furniture[];
  selectedFurnitureId: string | null;
  isDrawing: boolean;
  currentStart: Point | null;
}