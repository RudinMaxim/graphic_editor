export interface Line {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color?: string;
  strokeWidth?: number;
}

export interface Point {
  x: number;
  y: number;
}

export type Tool = 'select' | 'draw' | 'delete' | 'pan' | 'move';

export interface CanvasState {
  lines: Line[];
  selectedLineId: string | null;
  activeTool: Tool;
  isDrawing: boolean;
  currentLine: Partial<Line> | null;
}

export interface EditorSettings {
  gridSize: number;
  showGrid: boolean;
  snapToGrid: boolean;
  strokeColor: string;
  strokeWidth: number;
}

export interface ViewportState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface ExportedProjectV1 {
  version: 1;
  lines: Line[];
  settings: EditorSettings;
}
