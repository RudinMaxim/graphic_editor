import React from 'react';
import type { ViewportState } from '../types';

export function useViewport(initial?: Partial<ViewportState>) {
  const [viewport, setViewport] = React.useState<ViewportState>({
    scale: initial?.scale ?? 1,
    offsetX: initial?.offsetX ?? 0,
    offsetY: initial?.offsetY ?? 0,
  });

  const api = React.useMemo(() => ({
    zoomAt(point: { x: number; y: number }, direction: 1 | -1) {
      const scaleBy = 1.05;
      setViewport(v => {
        const newScale = direction > 0 ? v.scale * scaleBy : v.scale / scaleBy;
        return {
          scale: newScale,
          offsetX: point.x - ((point.x - v.offsetX) / v.scale) * newScale,
          offsetY: point.y - ((point.y - v.offsetY) / v.scale) * newScale,
        };
      });
    },
    panBy(dx: number, dy: number) {
      setViewport(v => ({ ...v, offsetX: v.offsetX + dx, offsetY: v.offsetY + dy }));
    },
    fitTo(width: number, height: number, viewWidth: number, viewHeight: number, padding = 24) {
      const scaleX = (viewWidth - padding * 2) / width;
      const scaleY = (viewHeight - padding * 2) / height;
      const scale = Math.min(scaleX, scaleY);
      setViewport({
        scale,
        offsetX: padding,
        offsetY: padding,
      });
    }
  }), []);

  return { viewport, setViewport, ...api } as const;
}


