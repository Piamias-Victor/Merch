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
  activeTool: 'wall' | 'select' | null;
  walls: Wall[];
  isDrawing: boolean;
  currentWallStart: Point | null;
  mousePosition: Point;
}

export interface PlanMetadata {
  name: string;
  dimensions: PlanDimensions;
  createdAt: Date;
  updatedAt: Date;
}

export interface ViewportState {
  zoom: number;
  panX: number;
  panY: number;
  minZoom: number;
  maxZoom: number;
}

export interface ZoomControls {
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: () => void;
  resetZoom: () => void;
  setZoom: (zoom: number) => void;
}