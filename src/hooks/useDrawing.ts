import React from 'react';
import type { Line, EditorSettings } from '../types';
import { LineController } from '../LineController';

export function useDrawing(controller: LineController, settings: EditorSettings) {
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [tempLine, setTempLine] = React.useState<Partial<Line> | null>(null);

  const snap = React.useCallback((v: number) => settings.snapToGrid ? Math.round(v / settings.gridSize) * settings.gridSize : v, [settings.snapToGrid, settings.gridSize]);

  const start = React.useCallback((x: number, y: number) => {
    const sx = snap(x);
    const sy = snap(y);
    setTempLine({ startX: sx, startY: sy, endX: sx, endY: sy, color: settings.strokeColor, strokeWidth: settings.strokeWidth });
    setIsDrawing(true);
  }, [snap, settings.strokeColor, settings.strokeWidth]);

  const move = React.useCallback((x: number, y: number) => {
    setTempLine(prev => prev ? { ...prev, endX: snap(x), endY: snap(y) } : prev);
  }, [snap]);

  const end = React.useCallback(() => {
    setIsDrawing(prev => {
      if (prev && tempLine) {
        controller.createLine({
          startX: tempLine.startX!,
          startY: tempLine.startY!,
          endX: tempLine.endX!,
          endY: tempLine.endY!,
          color: tempLine.color,
          strokeWidth: tempLine.strokeWidth,
        });
      }
      return false;
    });
    setTempLine(null);
  }, [controller, tempLine]);

  return { isDrawing, tempLine, start, move, end } as const;
}


